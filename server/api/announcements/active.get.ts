import { defineEventHandler, getCookie } from 'h3';
import { useQuery } from '../../utils/db';

export default defineEventHandler(async (event) => {
  try {
    const userCookie = getCookie(event, 'auth_user');
    let sessionUser: any = null;
    if (userCookie) {
      try {
        sessionUser = JSON.parse(userCookie);
      } catch (e) {
        // ignore parse error
      }
    }

    const isPaidUser = sessionUser && (sessionUser.plan_type === 'turbo' || sessionUser.plan_type === 'starter');

    const rows = await useQuery(
      `SELECT id, title, message, alert_type, cta_label, cta_url, target_audience, is_active, updated_at
       FROM system_announcements
       WHERE is_active = 1
       ORDER BY id DESC
       LIMIT 1`
    );

    if (rows.length === 0) {
      return { success: true, announcement: null };
    }

    const ann = rows[0];

    // Filter by audience
    if (ann.target_audience === 'free_only' && isPaidUser) {
      return { success: true, announcement: null };
    }
    if (ann.target_audience === 'paid_only' && !isPaidUser) {
      return { success: true, announcement: null };
    }

    return {
      success: true,
      announcement: ann
    };
  } catch (err: any) {
    return {
      success: false,
      announcement: null,
      error: err.message
    };
  }
});
