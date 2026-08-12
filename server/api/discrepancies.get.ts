import { useQuery } from '../utils/db';

export default defineEventHandler(async (event) => {
  const users = await useQuery('SELECT id FROM users LIMIT 1');
  const userId = users[0]?.id || 1;

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
