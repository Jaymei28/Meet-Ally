import { useQuery } from '../../utils/db';
import { defineEventHandler, getCookie, setCookie, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const userCookie = getCookie(event, 'auth_user');
  if (!userCookie) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized. Please sign in.' });
  }

  let loggedInUser: any = null;
  try {
    loggedInUser = JSON.parse(userCookie);
  } catch (_) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid session cookie.' });
  }

  // Fetch fresh user record from DB
  const userRows = await useQuery(
    'SELECT id, name, email, role, plan_type, profile_picture FROM users WHERE id = ? LIMIT 1',
    [loggedInUser.id]
  );

  if (!userRows || userRows.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'User not found.' });
  }

  const freshUser = { ...loggedInUser, ...userRows[0] };

  // Set fresh cookie
  setCookie(event, 'auth_user', JSON.stringify(freshUser), {
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 7,
    path: '/'
  });

  return {
    success: true,
    user: freshUser
  };
});
