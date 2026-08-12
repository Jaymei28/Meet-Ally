import { defineEventHandler, readBody, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const user = useCookie(event, 'auth_user');
  if (!user.value || user.value.role !== 'admin') {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const body = await readBody(event);
  const { amount } = body;
  if (!amount || typeof amount !== 'number' || amount <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid topup amount.' });
  }

  const { useQuery } = useDatabase();
  const rows = await useQuery("SELECT setting_value FROM system_settings WHERE setting_key = 'claude_api_balance'");
  const currentBalance = parseFloat(rows[0]?.setting_value || '0.00');
  const newBalance = (currentBalance + amount).toFixed(2);

  await useQuery("UPDATE system_settings SET setting_value = ? WHERE setting_key = 'claude_api_balance'", [newBalance]);

  return { 
    success: true, 
    balance: parseFloat(newBalance), 
    message: `Successfully topped up Claude API credits by $${amount.toFixed(2)}!` 
  };
});
