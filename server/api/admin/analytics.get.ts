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

    // 6. Fetch client list with metadata and dispute letters count (sorted by ID descending)
    const clientList = await useQuery(`
      SELECT id, name, email, role, plan_type, registration_status, created_at,
             (SELECT COUNT(*) FROM dispute_letters WHERE user_id = users.id) AS letters_filed
      FROM users ORDER BY id DESC
    `);

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
