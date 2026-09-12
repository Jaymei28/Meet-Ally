import { useQuery } from '../../utils/db';
import { getCookie, createError } from 'h3';

/**
 * DELETE /api/user/clear-report
 * Clears all credit report data for the current user so they can re-upload cleanly.
 * Useful when a previous upload failed mid-transaction and left orphaned rows.
 */
export default defineEventHandler(async (event) => {
  const userCookie = getCookie(event, 'auth_user');
  if (!userCookie) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized. Please log in.' });
  }

  const user = JSON.parse(userCookie);
  const userId = user.id;

  // Delete in correct FK order
  await useQuery(`DELETE FROM bureau_discrepancies WHERE user_id = ?`, [userId]);
  await useQuery(`DELETE bd FROM credit_account_bureau_data bd
    INNER JOIN credit_accounts ca ON bd.credit_account_id = ca.id
    WHERE ca.user_id = ?`, [userId]);
  await useQuery(`DELETE FROM credit_accounts WHERE user_id = ?`, [userId]);
  await useQuery(`DELETE FROM credit_inquiries WHERE user_id = ?`, [userId]);
  await useQuery(`DELETE FROM credit_scores WHERE user_id = ?`, [userId]);
  await useQuery(`DELETE FROM credit_reports WHERE user_id = ?`, [userId]);

  return { success: true, message: 'Report data cleared. You can now re-upload your credit report.' };
});
