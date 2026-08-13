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

  const discrepancies = await useQuery(
    `SELECT bd.*, ca.creditor_name, ca.account_number, ca.account_type
     FROM bureau_discrepancies bd
     JOIN credit_accounts ca ON bd.credit_account_id = ca.id
     WHERE bd.user_id = ?
     ORDER BY bd.dispute_priority DESC`,
    [userId]
  );

  return discrepancies;
});
