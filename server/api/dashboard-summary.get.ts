import { useQuery } from '../utils/db';
import { getCookie, createError } from 'h3';

// Safe query wrapper — returns fallback value instead of throwing
async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (_) {
    return fallback;
  }
}

export default defineEventHandler(async (event) => {
  const userCookie = getCookie(event, 'auth_user');
  if (!userCookie) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const loggedInUser = JSON.parse(userCookie);
  const userId = loggedInUser.id;

  // Fetch latest user assessment (non-fatal if table missing)
  const userAssessments = await safeQuery(
    () => useQuery(`SELECT * FROM user_assessments WHERE user_id = ? ORDER BY id DESC LIMIT 1`, [userId]),
    []
  );
  const latestAssessment = userAssessments.length > 0 ? userAssessments[0] : null;

  // Fetch the latest credit report
  const reports = await safeQuery(
    () => useQuery(`SELECT * FROM credit_reports WHERE user_id = ? ORDER BY id DESC LIMIT 1`, [userId]),
    []
  );

  if (reports.length === 0) {
    return {
      hasReport: false,
      scores: { transunion: 0, experian: 0, equifax: 0 },
      assessment: latestAssessment ? {
        scoreRange: latestAssessment.score_range,
        primaryGoal: latestAssessment.primary_goal,
        hasCollections: !!latestAssessment.has_collections,
        hasLatePayments: !!latestAssessment.has_late_payments,
        hasInquiries: !!latestAssessment.has_inquiries,
        hasChargeoffs: !!latestAssessment.has_chargeoffs,
        gamePlan: latestAssessment.game_plan ? JSON.parse(latestAssessment.game_plan) : null,
        createdAt: latestAssessment.created_at
      } : null,
      summary: { totalAccounts: 0, negativeAccounts: 0, inquiries: 0, discrepancies: 0, lettersCount: 0, mailedLettersCount: 0 }
    };
  }

  const report = reports[0];

  // Fetch credit scores
  const scores = await safeQuery(
    () => useQuery(`SELECT bureau, score FROM credit_scores WHERE credit_report_id = ?`, [report.id]),
    []
  );

  const scoresMap = { transunion: 0, experian: 0, equifax: 0 };
  for (const s of scores) {
    const key = s.bureau?.toLowerCase?.() || '';
    if (key === 'transunion') scoresMap.transunion = s.score;
    else if (key === 'experian') scoresMap.experian = s.score;
    else if (key === 'equifax') scoresMap.equifax = s.score;
  }

  // Fetch count of active discrepancies (non-fatal)
  const discrepanciesCount = await safeQuery(
    () => useQuery(`SELECT COUNT(*) as count FROM bureau_discrepancies WHERE user_id = ?`, [userId]),
    [{ count: 0 }]
  );

  // Fetch letter counts (non-fatal — columns may not exist yet)
  const lettersCountRes = await safeQuery(
    () => useQuery(`SELECT COUNT(*) as count FROM dispute_letters WHERE user_id = ?`, [userId]),
    [{ count: 0 }]
  );

  // Mailed letters — safe fallback if posted_1/sent columns missing
  const mailedLettersCountRes = await safeQuery(
    () => useQuery(`SELECT COUNT(*) as count FROM dispute_letters WHERE user_id = ? AND (posted_1 = 1 OR sent = 1)`, [userId]),
    [{ count: 0 }]
  );

  // Fetch negative accounts
  const negativeItems = await safeQuery(
    () => useQuery(
      `SELECT id, creditor_name, account_number, account_type, account_status, payment_status, current_balance, is_negative, bureau
       FROM credit_accounts
       WHERE user_id = ? AND credit_report_id = ? AND (is_negative = 1 OR LOWER(payment_status) LIKE '%late%' OR LOWER(account_status) LIKE '%collection%' OR LOWER(account_status) LIKE '%charge%')
       ORDER BY id DESC`,
      [userId, report.id]
    ),
    []
  );

  return {
    hasReport: true,
    reportId: report.id,
    originalFilename: report.original_filename,
    uploadedAt: report.created_at,
    personalInfo: report.personal_info ? JSON.parse(report.personal_info) : null,
    scores: scoresMap,
    negativeItems: negativeItems || [],
    assessment: latestAssessment ? {
      scoreRange: latestAssessment.score_range,
      primaryGoal: latestAssessment.primary_goal,
      hasCollections: !!latestAssessment.has_collections,
      hasLatePayments: !!latestAssessment.has_late_payments,
      hasInquiries: !!latestAssessment.has_inquiries,
      hasChargeoffs: !!latestAssessment.has_chargeoffs,
      gamePlan: latestAssessment.game_plan ? JSON.parse(latestAssessment.game_plan) : null,
      createdAt: latestAssessment.created_at
    } : null,
    summary: {
      totalAccounts: report.total_accounts_count || 0,
      negativeAccounts: negativeItems.length || report.negative_accounts_count || 0,
      inquiries: report.hard_inquiries_count || 0,
      discrepancies: discrepanciesCount[0]?.count || 0,
      lettersCount: lettersCountRes[0]?.count || 0,
      mailedLettersCount: mailedLettersCountRes[0]?.count || 0
    }
  };
});
