import { defineEventHandler, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const user = useCookie(event, 'auth_user');
  if (!user.value) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const { useQuery } = useDatabase();
  const rows = await useQuery('SELECT ai_credits FROM users WHERE id = ?', [user.value.id]);
  if (!rows.length) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' });
  }

  return { success: true, credits: rows[0].ai_credits };
});
