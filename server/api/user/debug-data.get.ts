import { useQuery } from '../../utils/db';
import { getCookie, createError } from 'h3';

/**
 * GET /api/user/debug-data
 * Returns raw DB state for the current user to diagnose dashboard 0s.
 * Only usable by admin or the user themselves.
 */
export default defineEventHandler(async (event) => {
  const userCookie = getCookie(event, 'auth_user');
  if (!userCookie) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }
  const user = JSON.parse(userCookie);
  const userId = user.id;

  const reports = await useQuery(
    `SELECT id, original_filename, total_accounts_count, negative_accounts_count, hard_inquiries_count, created_at FROM credit_reports WHERE user_id = ? ORDER BY id DESC LIMIT 5`,
    [userId]
  );

  const scores = await useQuery(
    `SELECT cr.id as report_id, cs.bureau, cs.score FROM credit_scores cs JOIN credit_reports cr ON cs.credit_report_id = cr.id WHERE cr.user_id = ? ORDER BY cr.id DESC LIMIT 15`,
    [userId]
  );

  const accounts = await useQuery(
    `SELECT credit_report_id, COUNT(*) as count FROM credit_accounts WHERE user_id = ? GROUP BY credit_report_id ORDER BY credit_report_id DESC`,
    [userId]
  );

  const inquiries = await useQuery(
    `SELECT credit_report_id, COUNT(*) as count FROM credit_inquiries WHERE user_id = ? GROUP BY credit_report_id ORDER BY credit_report_id DESC`,
    [userId]
  );

  const lenderCount = await useQuery(`SELECT COUNT(*) as cnt FROM lenders`);
  const systemSettings = await useQuery(`SELECT * FROM system_settings`);

  return {
    userId,
    reports,
    scores,
    accounts,
    inquiries,
    lenderCount: lenderCount[0]?.cnt,
    systemSettings
  };
});
