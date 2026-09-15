import { defineEventHandler, readBody, createError, getCookie } from 'h3';
import bcrypt from 'bcryptjs';

export default defineEventHandler(async (event) => {
  const userCookie = getCookie(event, 'auth_user');
  if (!userCookie) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const user = JSON.parse(userCookie);
  if (user.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
  }

  const body = await readBody(event);
  const { action, userId, newPassword, newPlan, userData } = body || {};

  if (!action) {
    throw createError({ statusCode: 400, statusMessage: 'Missing action.' });
  }

  if (action === 'create') {
    const {
      name,
      email,
      password,
      role = 'regular',
      plan_type = 'turbo',
      contact_number,
      identityiq_username,
      identityiq_password,
      identityiq_secret_answer,
      address,
      city,
      state,
      zipcode,
      ai_credits = 100
    } = userData || body || {};

    if (!name || !email || !password) {
      throw createError({ statusCode: 400, statusMessage: 'Name, email, and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await useQuery('SELECT id FROM users WHERE email = ? LIMIT 1', [normalizedEmail]);
    if (existing.length > 0) {
      throw createError({ statusCode: 409, statusMessage: 'An account with this email already exists.' });
    }

    const hash = await bcrypt.hash(password, 10);
    const sanitizedRole = role === 'admin' ? 'admin' : 'regular';
    const sanitizedPlan = ['starter', 'turbo'].includes(plan_type) ? plan_type : null;
    const paidAmount = sanitizedPlan ? 29.99 : 0.00;

    const res = await useQuery(
      `INSERT INTO users (
        name, email, password, role, plan_type, has_paid, registration_status,
        paid_amount, contact_number, address, city, state, zipcode,
        created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, 1, 'completed', ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        name.trim(),
        normalizedEmail,
        hash,
        sanitizedRole,
        sanitizedPlan,
        paidAmount,
        contact_number ? contact_number.trim() : null,
        address ? address.trim() : null,
        city ? city.trim() : null,
        state ? state.trim() : null,
        zipcode ? zipcode.trim() : null
      ]
    );

    const newUserId = (res as any).insertId;

    try {
      await useQuery(
        `UPDATE users SET 
          identityiq_username = ?, 
          identityiq_password = ?, 
          identityiq_secret_answer = ?,
          ai_credits = ?
        WHERE id = ?`,
        [
          identityiq_username ? identityiq_username.trim() : null,
          identityiq_password ? identityiq_password.trim() : null,
          identityiq_secret_answer ? identityiq_secret_answer.trim() : null,
          ai_credits,
          newUserId
        ]
      );
    } catch (e) {
      // Gracefully ignore if optional fields are missing
    }

    return {
      success: true,
      message: 'User created successfully.',
      user: {
        id: (res as any).insertId,
        name: name.trim(),
        email: normalizedEmail,
        role: sanitizedRole,
        plan_type: sanitizedPlan
      }
    };
  }

  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'Missing userId.' });
  }

  if (action === 'reset-password') {
    if (!newPassword || newPassword.length < 6) {
      throw createError({ statusCode: 400, statusMessage: 'Password must be at least 6 characters.' });
    }
    const hash = await bcrypt.hash(newPassword, 10);
    await useQuery('UPDATE users SET password = ? WHERE id = ?', [hash, userId]);
    return { success: true, message: 'Password reset successfully.' };
  }

  if (action === 'update-plan') {
    if (!['starter', 'turbo', null].includes(newPlan)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid plan type.' });
    }
    await useQuery('UPDATE users SET plan_type = ? WHERE id = ?', [newPlan, userId]);
    return { success: true, message: 'Plan updated successfully.' };
  }

  if (action === 'delete') {
    // Prevent deleting admin accounts
    const userRows = await useQuery('SELECT role FROM users WHERE id = ?', [userId]);
    if (userRows[0]?.role === 'admin') {
      throw createError({ statusCode: 403, statusMessage: 'Cannot delete admin accounts.' });
    }
    await useQuery('DELETE FROM users WHERE id = ?', [userId]);
    return { success: true, message: 'User deleted successfully.' };
  }

  throw createError({ statusCode: 400, statusMessage: 'Unknown action.' });
});
