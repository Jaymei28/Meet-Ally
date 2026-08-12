import { useQuery } from '../utils/db';

export default defineEventHandler(async (event) => {
  const users = await useQuery('SELECT id FROM users LIMIT 1');
  const userId = users[0]?.id || 1;

  const letters = await useQuery(
    `SELECT * FROM dispute_letters WHERE user_id = ? ORDER BY id DESC`,
    [userId]
  );

  return letters;
});
