import { useQuery } from '../utils/db';
import { getCookie, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const userCookie = getCookie(event, 'auth_user');
  if (!userCookie) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const loggedInUser = JSON.parse(userCookie);
  const userId = loggedInUser.id;

  // Fetch latest user assessment (non-fatal)
  let latestAssessment = null;
  try {
    const userAssessments = await useQuery(
      `SELECT * FROM user_assessments WHERE user_id = ? ORDER BY id DESC LIMIT 1`,
      [userId]
    );
    latestAssessment = userAssessments.length > 0 ? userAssessments[0] : null;
  } catch (_) {}

  // Fetch the latest credit report
  let reports: any[] = [];
  try {
    reports = await useQuery(
      `SELECT * FROM credit_reports WHERE user_id = ? ORDER BY id DESC LIMIT 1`,
      [userId]
    );
  } catch (_) {}

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

  // Fetch credit scores (non-fatal)
  const scoresMap = { transunion: 0, experian: 0, equifax: 0 };
  try {
    const scores = await useQuery(
      `SELECT bureau, score FROM credit_scores WHERE credit_report_id = ?`,
      [report.id]
    );
    for (const s of scores) {
      const key = s.bureau ? s.bureau.toLowerCase() : '';
      if (key === 'transunion') scoresMap.transunion = s.score;
      else if (key === 'experian') scoresMap.experian = s.score;
      else if (key === 'equifax') scoresMap.equifax = s.score;
    }
  } catch (_) {}

  // Fetch discrepancy count (non-fatal)
  let discrepanciesCount = 0;
  try {
    const res = await useQuery(
      `SELECT COUNT(*) as count FROM bureau_discrepancies WHERE user_id = ?`,
      [userId]
    );
    discrepanciesCount = res[0]?.count || 0;
  } catch (_) {}

  // Fetch total letter count (non-fatal)
  let lettersCount = 0;
  try {
    const res = await useQuery(
      `SELECT COUNT(*) as count FROM dispute_letters WHERE user_id = ?`,
      [userId]
    );
    lettersCount = res[0]?.count || 0;
  } catch (_) {}

  // Mailed letters — safe fallback if posted_1/sent columns missing
  let mailedLettersCount = 0;
  try {
    const res = await useQuery(
      `SELECT COUNT(*) as count FROM dispute_letters WHERE user_id = ? AND (posted_1 = 1 OR sent = 1)`,
      [userId]
    );
    mailedLettersCount = res[0]?.count || 0;
  } catch (_) {}

  // Fetch negative accounts (non-fatal)
  let negativeItems: any[] = [];
  try {
    negativeItems = await useQuery(
      `SELECT id, creditor_name, account_number, account_type, account_status, payment_status, current_balance, is_negative, bureau
       FROM credit_accounts
       WHERE user_id = ? AND credit_report_id = ? AND (is_negative = 1 OR LOWER(payment_status) LIKE '%late%' OR LOWER(account_status) LIKE '%collection%' OR LOWER(account_status) LIKE '%charge%')
       ORDER BY id DESC`,
      [userId, report.id]
    );
  } catch (_) {}

  return {
    hasReport: true,
    reportId: report.id,
    originalFilename: report.original_filename,
    uploadedAt: report.created_at,
    personalInfo: report.personal_info ? JSON.parse(report.personal_info) : null,
    scores: scoresMap,
    negativeItems,
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
      discrepancies: discrepanciesCount,
      lettersCount,
      mailedLettersCount
    }
  };
});
