import { defineEventHandler, createError, getCookie } from 'h3';

export default defineEventHandler(async (event) => {
  const userCookie = getCookie(event, 'auth_user');
  if (!userCookie) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const user = JSON.parse(userCookie);
  if (user.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
  }

  const rows = await useQuery("SELECT setting_value FROM system_settings WHERE setting_key = 'claude_api_balance'");
  const balance = parseFloat(rows[0]?.setting_value || '0.00');

  return { success: true, balance };
});
