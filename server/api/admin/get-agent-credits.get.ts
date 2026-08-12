import { defineEventHandler, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const user = useCookie(event, 'auth_user');
  if (!user.value || user.value.role !== 'admin') {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const { useQuery } = useDatabase();
  const rows = await useQuery("SELECT setting_value FROM system_settings WHERE setting_key = 'claude_api_balance'");
  const balance = parseFloat(rows[0]?.setting_value || '0.00');

  return { success: true, balance };
});
