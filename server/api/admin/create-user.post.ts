import { defineEventHandler, readBody, createError, getCookie } from 'h3';
import { useQuery } from '../../utils/db';
import bcryptjs from 'bcryptjs';

export default defineEventHandler(async (event) => {
  // 1. Enforce admin RBAC verification
  const userCookie = getCookie(event, 'auth_user');
  if (!userCookie) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized. Please sign in.'
    });
  }

  let sessionUser: any = null;
  try {
    sessionUser = JSON.parse(userCookie);
  } catch (e) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid session cookie.'
    });
  }

  if (!sessionUser || sessionUser.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden. Admin privileges required.'
    });
  }

  // 2. Parse and validate payload
  const body = await readBody(event);
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
    ai_credits
  } = body || {};

  if (!name || typeof name !== 'string' || !name.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Full name is required.'
    });
  }

  if (!email || typeof email !== 'string' || !email.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email address is required.'
    });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Please provide a valid email address.'
    });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Password must be at least 6 characters long.'
    });
  }

  const sanitizedRole = role === 'admin' ? 'admin' : 'regular';
  let sanitizedPlan: string | null = null;
  if (plan_type === 'turbo' || plan_type === 'pro') {
    sanitizedPlan = 'turbo';
  } else if (plan_type === 'starter') {
    sanitizedPlan = 'starter';
  } else {
    sanitizedPlan = null;
  }

  const creditsNum = Number.isInteger(Number(ai_credits)) && Number(ai_credits) >= 0 ? Number(ai_credits) : 100;
  const paidAmount = sanitizedPlan ? 29.99 : 0.00;

  try {
    // 3. Check for conflicting email address
    const existingUsers = await useQuery(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [normalizedEmail]
    );

    if (existingUsers.length > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: 'An account with this email address already exists.'
      });
    }

    // 4. Hash password with bcrypt
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // 5. Insert new user record
    const insertRes = await useQuery(
      `INSERT INTO users (
        name, email, password, role, plan_type, has_paid, registration_status,
        paid_amount, contact_number, ssn_last4, identityiq_username,
        identityiq_password, identityiq_secret_answer, address, city, state, zipcode,
        ai_credits, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, 1, 'completed', ?, ?, '', ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        name.trim(),
        normalizedEmail,
        hashedPassword,
        sanitizedRole,
        sanitizedPlan,
        paidAmount,
        contact_number ? contact_number.trim() : null,
        identityiq_username ? identityiq_username.trim() : null,
        identityiq_password ? identityiq_password.trim() : null,
        identityiq_secret_answer ? identityiq_secret_answer.trim() : null,
        address ? address.trim() : null,
        city ? city.trim() : null,
        state ? state.trim() : null,
        zipcode ? zipcode.trim() : null,
        creditsNum
      ]
    );

    const newUserId = (insertRes as any).insertId;

    return {
      success: true,
      message: `User ${name.trim()} successfully created.`,
      user: {
        id: newUserId,
        name: name.trim(),
        email: normalizedEmail,
        role: sanitizedRole,
        plan_type: sanitizedPlan,
        ai_credits: creditsNum
      }
    };
  } catch (err: any) {
    if (err.statusCode) throw err;
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to create user: ${err.message}`
    });
  }
});
