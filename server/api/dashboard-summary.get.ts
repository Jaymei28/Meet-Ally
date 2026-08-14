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

  // Fetch the latest credit report
  const reports = await useQuery(
    `SELECT * FROM credit_reports WHERE user_id = ? ORDER BY id DESC LIMIT 1`,
    [userId]
  );
  
  if (reports.length === 0) {
    return {
      hasReport: false,
      scores: { transunion: 0, experian: 0, equifax: 0 },
      summary: { totalAccounts: 0, negativeAccounts: 0, inquiries: 0, discrepancies: 0, lettersCount: 0, mailedLettersCount: 0 }
    };
  }

  const report = reports[0];

  // Fetch the scores
  const scores = await useQuery(
    `SELECT bureau, score FROM credit_scores WHERE credit_report_id = ?`,
    [report.id]
  );

  const scoresMap = { transunion: 0, experian: 0, equifax: 0 };
  for (const s of scores) {
    const key = s.bureau.toLowerCase();
    if (key === 'transunion') scoresMap.transunion = s.score;
    else if (key === 'experian') scoresMap.experian = s.score;
    else if (key === 'equifax') scoresMap.equifax = s.score;
  }

  // Fetch count of active discrepancies
  const discrepanciesCount = await useQuery(
    `SELECT COUNT(*) as count FROM bureau_discrepancies WHERE user_id = ?`,
    [userId]
  );

  // Fetch counts of generated and mailed dispute letters
  const lettersCountRes = await useQuery(
    `SELECT COUNT(*) as count FROM dispute_letters WHERE user_id = ?`,
    [userId]
  );

  const mailedLettersCountRes = await useQuery(
    `SELECT COUNT(*) as count FROM dispute_letters WHERE user_id = ? AND (posted_1 = 1 OR sent = 1)`,
    [userId]
  );

  return {
    hasReport: true,
    reportId: report.id,
    originalFilename: report.original_filename,
    uploadedAt: report.created_at,
    personalInfo: report.personal_info ? JSON.parse(report.personal_info) : null,
    scores: scoresMap,
    summary: {
      totalAccounts: report.total_accounts_count || 0,
      negativeAccounts: report.negative_accounts_count || 0,
      inquiries: report.hard_inquiries_count || 0,
      discrepancies: discrepanciesCount[0]?.count || 0,
      lettersCount: lettersCountRes[0]?.count || 0,
      mailedLettersCount: mailedLettersCountRes[0]?.count || 0
    }
  };
});
