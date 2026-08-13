import { defineEventHandler, readBody, createError, getCookie } from 'h3';

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
  const { balance } = body;
  if (balance === undefined || typeof balance !== 'number' || balance < 0) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid balance amount.' });
  }

  const newBalance = balance.toFixed(2);
  await useQuery("UPDATE system_settings SET setting_value = ? WHERE setting_key = 'claude_api_balance'", [newBalance]);

  return {
    success: true,
    balance: parseFloat(newBalance),
    message: `Balance set to $${newBalance}`
  };
});
