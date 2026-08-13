import { useQuery } from '../utils/db';
import { getCookie, createError } from 'h3';

export default defineEventHandler(async (event) => {
  // Get authenticated user from cookie
  const userCookie = getCookie(event, 'auth_user');
  if (!userCookie) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const loggedInUser = JSON.parse(userCookie);
  const userId = loggedInUser.id;

  const letters = await useQuery(
    `SELECT * FROM dispute_letters WHERE user_id = ? ORDER BY id DESC`,
    [userId]
  );

  return letters;
});
