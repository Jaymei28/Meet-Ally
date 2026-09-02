import { defineEventHandler, getCookie, createError } from 'h3';
import { useQuery } from '../../utils/db';

export default defineEventHandler(async (event) => {
  const userCookie = getCookie(event, 'auth_user');
  if (!userCookie) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized. Please sign in.' });
  }

  let sessionUser: any = null;
  try {
    sessionUser = JSON.parse(userCookie);
  } catch (e) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid session cookie.' });
  }

  if (!sessionUser || sessionUser.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden. Admin privileges required.' });
  }

  try {
    const rows = await useQuery(
      `SELECT id, title, message, alert_type, cta_label, cta_url, target_audience, is_active, created_at, updated_at
       FROM system_announcements
       ORDER BY id DESC
       LIMIT 1`
    );

    return {
      success: true,
      announcement: rows.length > 0 ? rows[0] : null
    };
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch announcements: ${err.message}`
    });
  }
});
