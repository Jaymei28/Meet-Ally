import { defineEventHandler, readBody, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const user = useCookie(event, 'auth_user');
  if (!user.value) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const body = await readBody(event);
  const { amount } = body;
  if (!amount || typeof amount !== 'number' || amount <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid topup amount.' });
  }

  const { useQuery } = useDatabase();
  await useQuery('UPDATE users SET ai_credits = ai_credits + ? WHERE id = ?', [amount, user.value.id]);
  const rows = await useQuery('SELECT ai_credits FROM users WHERE id = ?', [user.value.id]);

  return { 
    success: true, 
    credits: rows[0]?.ai_credits || 0, 
    message: `Successfully added ${amount} credits to your AI Agent balance!` 
  };
});
