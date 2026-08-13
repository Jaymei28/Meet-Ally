import { defineEventHandler, getCookie, createError } from 'h3';
import { useQuery } from '../../utils/db';

export default defineEventHandler(async (event) => {
  // Enforce server-side RBAC check via auth_user cookie
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

  if (!sessionUser || sessionUser.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden. Admin privileges required.'
    });
  }

  try {
    const queryStr = `
      SELECT w1.id, w1.name, w1.email, w1.challenge, w1.usage, w1.timeline,
             w1.referrer_id, w1.referral_count, w1.is_qualified, w1.referral_code, w1.created_at,
             w2.name AS referrer_name, w2.email AS referrer_email
      FROM waitlist_users w1
      LEFT JOIN waitlist_users w2 ON w1.referrer_id = w2.id
      ORDER BY w1.id DESC
    `;

    const waitlistUsers = await useQuery(queryStr);

    return {
      success: true,
      users: waitlistUsers
    };
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch waitlist report: ${err.message}`
    });
  }
});
