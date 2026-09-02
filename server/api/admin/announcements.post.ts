import { defineEventHandler, getCookie, createError, readBody } from 'h3';
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

  const body = await readBody(event);
  const { 
    id,
    title, 
    message, 
    alert_type = 'promo', 
    cta_label, 
    cta_url, 
    target_audience = 'all', 
    is_active = 1 
  } = body || {};

  if (!message || !message.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Announcement message is required.' });
  }

  try {
    if (id) {
      await useQuery(
        `UPDATE system_announcements 
         SET title = ?, message = ?, alert_type = ?, cta_label = ?, cta_url = ?, target_audience = ?, is_active = ?, updated_at = NOW()
         WHERE id = ?`,
        [
          title?.trim() || null,
          message.trim(),
          alert_type,
          cta_label?.trim() || null,
          cta_url?.trim() || null,
          target_audience,
          is_active ? 1 : 0,
          id
        ]
      );
    } else {
      await useQuery(
        `INSERT INTO system_announcements (title, message, alert_type, cta_label, cta_url, target_audience, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          title?.trim() || null,
          message.trim(),
          alert_type,
          cta_label?.trim() || null,
          cta_url?.trim() || null,
          target_audience,
          is_active ? 1 : 0
        ]
      );
    }

    const updated = await useQuery(
      `SELECT id, title, message, alert_type, cta_label, cta_url, target_audience, is_active, updated_at
       FROM system_announcements
       ORDER BY id DESC
       LIMIT 1`
    );

    return {
      success: true,
      message: 'Announcement broadcast updated successfully.',
      announcement: updated.length > 0 ? updated[0] : null
    };
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to update announcement: ${err.message}`
    });
  }
});
