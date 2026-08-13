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
  const { action, userId, newPassword, newPlan } = body;

  if (!action || !userId) {
    throw createError({ statusCode: 400, statusMessage: 'Missing action or userId.' });
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
