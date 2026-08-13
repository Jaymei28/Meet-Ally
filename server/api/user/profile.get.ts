import { defineEventHandler, getCookie, createError } from 'h3';
import { useQuery } from '../../utils/db';

export default defineEventHandler(async (event) => {
  const userCookie = getCookie(event, 'auth_user');
  if (!userCookie) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized. Please sign in.'
    });
  }

  let sessionUser: any = null;
  try {
    sessionUser = JSON.parse(userCookie);
  } catch (e) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid session cookie.'
    });
  }

  try {
    const rows = await useQuery(
      'SELECT id, name, email, role, plan_type, profile_picture, address, city, state, zipcode, contact_number, ssn_last4, identityiq_username, identityiq_password, identityiq_secret_answer, created_at FROM users WHERE id = ?',
      [sessionUser.id]
    );

    if (rows.length === 0) {
      throw createError({
        statusCode: 444,
        statusMessage: 'User not found.'
      });
    }

    return {
      success: true,
      user: rows[0]
    };
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || `Failed to fetch profile: ${err.message}`
    });
  }
});
