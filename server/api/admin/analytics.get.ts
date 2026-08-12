import { useQuery } from '../../utils/db';

export default defineEventHandler(async (event) => {
  try {
    // 1. Fetch total registered users (excluding administrators)
    const userCountRes = await useQuery("SELECT COUNT(*) AS count FROM users WHERE role != 'admin'");
    const totalClients = userCountRes[0]?.count || 0;

    // 2. Fetch Starter plan users
    const starterCountRes = await useQuery("SELECT COUNT(*) AS count FROM users WHERE plan_type = 'starter' AND role != 'admin'");
    const starterPlanUsers = starterCountRes[0]?.count || 0;

    // 3. Fetch Turbo plan users
    const turboCountRes = await useQuery("SELECT COUNT(*) AS count FROM users WHERE plan_type = 'turbo' AND role != 'admin'");
    const turboPlanUsers = turboCountRes[0]?.count || 0;

    // 4. Fetch total audited credit reports
    const reportCountRes = await useQuery("SELECT COUNT(*) AS count FROM credit_reports");
    const totalReports = reportCountRes[0]?.count || 0;

    // 5. Fetch total generated dispute letters
    const letterCountRes = await useQuery("SELECT COUNT(*) AS count FROM dispute_letters");
    const totalLetters = letterCountRes[0]?.count || 0;

    // 6. Fetch client list with metadata (sorted by ID descending)
    const clientList = await useQuery("SELECT id, name, email, role, plan_type, registration_status, created_at FROM users ORDER BY id DESC");

    return {
      success: true,
      stats: {
        totalClients,
        starterPlanUsers,
        turboPlanUsers,
        totalReports,
        totalLetters
      },
      clients: clientList
    };
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch admin analytics: ${err.message}`
    });
  }
});
