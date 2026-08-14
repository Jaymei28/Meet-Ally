import { useQuery, useTransaction } from '../../utils/db';
import { getCookie, createError } from 'h3';

export default defineEventHandler(async (event) => {
  // 1. Get authenticated user from cookie
  const userCookie = getCookie(event, 'auth_user');
  if (!userCookie) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized. Please log in.' });
  }

  const user = JSON.parse(userCookie);

  // 2. Restrict access to Pro (Turbo) plan or Admin only
  if (user.role !== 'admin' && user.plan_type !== 'turbo') {
    throw createError({
      statusCode: 403,
      statusMessage: 'This feature is only available for Pro (Turbo) plan subscribers. Please upgrade your plan.'
    });
  }

  // 3. Fetch latest credit report
  const reports = await useQuery(
    `SELECT * FROM credit_reports WHERE user_id = ? ORDER BY id DESC LIMIT 1`,
    [user.id]
  );

  if (reports.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No credit report found. Please upload a credit report first to run the analysis.'
    });
  }

  const report = reports[0];

  // 4. Fetch details for calculation
  // A. Average Credit Score
  const scores = await useQuery(
    `SELECT score FROM credit_scores WHERE credit_report_id = ?`,
    [report.id]
  );
  let averageCreditScore = 0;
  if (scores.length > 0) {
    const sum = scores.reduce((acc, s) => acc + s.score, 0);
    averageCreditScore = Math.round(sum / scores.length);
  }

  // B. Total & Open Accounts
  const accounts = await useQuery(
    `SELECT account_status FROM credit_accounts WHERE credit_report_id = ?`,
    [report.id]
  );
  const totalAccounts = accounts.length;
  const openAccounts = accounts.filter(a => a.account_status?.toLowerCase() === 'open').length;

  // C. Hard Inquiries
  const inquiries = await useQuery(
    `SELECT id FROM credit_inquiries WHERE credit_report_id = ?`,
    [report.id]
  );
  const hardInquiries = inquiries.length;

  // D. Negative Items count (total negative accounts in credit_accounts)
  const negatives = await useQuery(
    `SELECT id FROM credit_accounts WHERE credit_report_id = ? AND is_negative = 1`,
    [report.id]
  );
  const negativeItems = negatives.length;

  // E. Completed/generated disputes
  const disputes = await useQuery(
    `SELECT id FROM dispute_letters WHERE user_id = ?`,
    [user.id]
  );
  const disputeCount = disputes.length;

  // 5. Points calculation
  let creditScorePoints = 0;
  let accountHealthPoints = 0;
  let inquiryPoints = 0;
  let negativeItemsPoints = 0;
  let disputeActivityPoints = 0;

  // Credit Score Component (40 points max)
  if (averageCreditScore >= 750) creditScorePoints = 40;
  else if (averageCreditScore >= 700) creditScorePoints = 35;
  else if (averageCreditScore >= 650) creditScorePoints = 28;
  else if (averageCreditScore >= 600) creditScorePoints = 20;
  else if (averageCreditScore >= 550) creditScorePoints = 12;
  else creditScorePoints = 5;

  // Account Health Component (25 points max)
  if (totalAccounts >= 10 && openAccounts >= 3) accountHealthPoints = 25;
  else if (totalAccounts >= 5 && openAccounts >= 2) accountHealthPoints = 18;
  else if (totalAccounts >= 3) accountHealthPoints = 12;
  else if (totalAccounts >= 1) accountHealthPoints = 6;

  // Hard Inquiries Component (15 points max)
  if (hardInquiries === 0) inquiryPoints = 15;
  else if (hardInquiries <= 2) inquiryPoints = 12;
  else if (hardInquiries <= 4) inquiryPoints = 8;
  else if (hardInquiries <= 6) inquiryPoints = 4;
  else inquiryPoints = 0;

  // Negative Items Component (15 points max)
  if (negativeItems === 0) negativeItemsPoints = 15;
  else if (negativeItems <= 2) negativeItemsPoints = 10;
  else if (negativeItems <= 5) negativeItemsPoints = 6;
  else if (negativeItems <= 10) negativeItemsPoints = 3;
  else negativeItemsPoints = 0;

  // Dispute Activity (5 points max)
  if (disputeCount >= 5) disputeActivityPoints = 5;
  else if (disputeCount >= 3) disputeActivityPoints = 3;
  else if (disputeCount >= 1) disputeActivityPoints = 2;

  const totalScore = creditScorePoints + accountHealthPoints + inquiryPoints + negativeItemsPoints + disputeActivityPoints;

  // Grade allocator
  let grade = 'F';
  if (totalScore >= 80) grade = 'A';
  else if (totalScore >= 70) grade = 'B';
  else if (totalScore >= 60) grade = 'C';
  else if (totalScore >= 50) grade = 'D';

  // Factors mapping
  const factors = {
    credit_score: {
      value: averageCreditScore,
      points: creditScorePoints,
      max_points: 40,
      percentage: Math.round((creditScorePoints / 40) * 100)
    },
    account_health: {
      total_accounts: totalAccounts,
      open_accounts: openAccounts,
      points: accountHealthPoints,
      max_points: 25,
      percentage: Math.round((accountHealthPoints / 25) * 100)
    },
    hard_inquiries: {
      count: hardInquiries,
      points: inquiryPoints,
      max_points: 15,
      percentage: Math.round((inquiryPoints / 15) * 100)
    },
    negative_items: {
      count: negativeItems,
      points: negativeItemsPoints,
      max_points: 15,
      percentage: Math.round((negativeItemsPoints / 15) * 100)
    },
    dispute_activity: {
      completed: disputeCount,
      points: disputeActivityPoints,
      max_points: 5,
      percentage: Math.round((disputeActivityPoints / 5) * 100)
    }
  };

  // Strengths and weaknesses lists
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (averageCreditScore >= 700) strengths.push(`Excellent credit score (${averageCreditScore})`);
  else if (averageCreditScore < 600) weaknesses.push(`Credit score needs improvement (${averageCreditScore})`);

  if (totalAccounts >= 5) strengths.push(`Good credit history with ${totalAccounts} accounts`);
  else if (totalAccounts < 3) weaknesses.push('Limited credit history');

  if (hardInquiries <= 2) strengths.push('Few recent credit inquiries');
  else if (hardInquiries > 4) weaknesses.push(`Too many recent credit inquiries (${hardInquiries})`);

  if (negativeItems === 0) strengths.push('No negative items on report');
  else if (negativeItems > 5) weaknesses.push('Multiple negative items need attention');

  if (disputeCount >= 3) strengths.push('Actively working on credit repair disputes');

  // Recommendations builder
  const recommendations: any[] = [];
  if (averageCreditScore < 650) {
    recommendations.push({
      title: 'Improve Your Credit Score',
      description: 'Focus on paying bills on time and reducing credit utilization to boost your score.',
      priority: 'high',
      icon: 'pi pi-chart-line'
    });
  }
  if (negativeItems > 0) {
    recommendations.push({
      title: 'Dispute Negative Items',
      description: `You have ${negativeItems} items that could be disputed. Use our AI-powered dispute tool to challenge inaccurate items.`,
      priority: 'high',
      icon: 'pi pi-shield',
      action_url: '/discrepancies',
      action_text: 'Inspect Mismatches'
    });
  }
  if (hardInquiries > 4) {
    recommendations.push({
      title: 'Reduce Credit Inquiries',
      description: 'Avoid applying for new credit for the next 6 months to let inquiries age off.',
      priority: 'medium',
      icon: 'pi pi-ban'
    });
  }
  if (totalAccounts < 5) {
    recommendations.push({
      title: 'Build Credit History',
      description: 'Consider adding a secured credit card or becoming an authorized user to diversify your credit mix.',
      priority: 'medium',
      icon: 'pi pi-credit-card'
    });
  }
  recommendations.push({
    title: 'Maintain On-Time Payments',
    description: 'Payment history makes up 35% of your credit score. Set up automatic payments to never miss a due date.',
    priority: 'high',
    icon: 'pi pi-calendar'
  });

  // 6. Save or update score
  const [dbResult] = await useTransaction(async (conn) => {
    // Delete existing matches first
    await conn.execute('DELETE FROM fundability_scores WHERE user_id = ?', [user.id]);

    const [res] = await conn.execute(
      `INSERT INTO fundability_scores (user_id, score, grade, factors, recommendations, strengths, weaknesses, credit_score, total_accounts, open_accounts, hard_inquiries, negative_items, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        user.id,
        totalScore,
        grade,
        JSON.stringify(factors),
        JSON.stringify(recommendations),
        JSON.stringify(strengths),
        JSON.stringify(weaknesses),
        averageCreditScore,
        totalAccounts,
        openAccounts,
        hardInquiries,
        negativeItems
      ]
    );
    return [res];
  });

  const fundabilityScoreId = (dbResult as any).insertId;

  // 7. Lender Matching
  const lenders = await useQuery('SELECT * FROM lenders WHERE active = 1');
  const allCalculatedLenders: any[] = [];

  for (const lender of lenders) {
    let matchScore = 0;
    const reqs = lender.requirements ? (typeof lender.requirements === 'string' ? JSON.parse(lender.requirements) : lender.requirements) : {};
    const minScore = Number(lender.min_credit_score || 640);
    const maxScore = Number(lender.max_credit_score || 850);

    // A. Credit score proximity points (0-50 pts)
    if (averageCreditScore >= minScore) {
      const range = Math.max(1, maxScore - minScore);
      const position = Math.min(range, averageCreditScore - minScore);
      matchScore += Math.min(50, 25 + Math.round((position / range) * 25));
    } else {
      const pointsBelow = minScore - averageCreditScore;
      // Proximity score: closer gets higher score
      const proximityScore = Math.max(10, 45 - Math.round(pointsBelow * 0.25));
      matchScore += proximityScore;
    }

    // B. Fundability score contribution (0-30 pts)
    matchScore += Math.round((totalScore / 100) * 30);

    // C. Account health bonus (0-10 pts)
    if (totalAccounts >= 5) matchScore += 10;
    else if (totalAccounts >= 3) matchScore += 7;
    else if (totalAccounts >= 1) matchScore += 4;

    // D. Inquiries penalty / bonus (up to +/- 5 pts)
    if (hardInquiries <= 2) matchScore += 5;
    else if (hardInquiries > 5) matchScore -= 5;

    // E. Negative items penalty
    if (negativeItems > 5) matchScore -= 5;
    else if (negativeItems === 0) matchScore += 5;

    matchScore = Math.max(15, Math.min(99, matchScore));

    // Approval likelihood tag
    let approvalLikelihood = 'low';
    if (matchScore >= 75 && averageCreditScore >= minScore) approvalLikelihood = 'high';
    else if (matchScore >= 55) approvalLikelihood = 'medium';
    else approvalLikelihood = 'building';

    // Estimated APR ranges
    const baseMin = Number(lender.min_apr || reqs.min_apr || 12.99);
    const baseMax = Number(lender.max_apr || reqs.max_apr || 29.99);
    let estMin = baseMin;
    let estMax = baseMax;

    if (averageCreditScore >= 720) {
      estMin = baseMin;
      estMax = baseMin + ((baseMax - baseMin) * 0.35);
    } else if (averageCreditScore >= 660) {
      estMin = baseMin + ((baseMax - baseMin) * 0.25);
      estMax = baseMin + ((baseMax - baseMin) * 0.65);
    } else {
      estMin = baseMin + ((baseMax - baseMin) * 0.45);
      estMax = baseMax;
    }

    // Match Reasons
    const matchReasons: string[] = [];
    if (averageCreditScore >= minScore) {
      matchReasons.push('Your credit score meets their underwriting baseline');
    } else {
      matchReasons.push(`Target goal: ${minScore} recommended score (${minScore - averageCreditScore} pts away)`);
    }

    if (lender.type === 'bank') matchReasons.push('Major national bank with cash-back perks');
    else if (lender.type === 'credit_union') matchReasons.push('Credit union with competitive rate ceiling');
    else matchReasons.push('Fintech / online issuer with flexible approval paths');

    if (totalScore >= 65) matchReasons.push('Solid overall fundability profile');
    if (hardInquiries <= 2) matchReasons.push('Low hard inquiry load');

    const bureauPull = lender.bureau_pull || reqs.bureau_pull || 'Experian';
    const notes = lender.notes || reqs.notes || lender.description || 'Pre-qualified offer';
    const recommendedScore = lender.recommended_score || `${minScore}+`;
    const introAprMonths = lender.intro_apr_months || reqs.apr_months || '0% Promo';

    allCalculatedLenders.push({
      lender_id: lender.id,
      lender_name: lender.name,
      lender_type: lender.type,
      bureau_pull: bureauPull,
      recommended_score: recommendedScore,
      score_model: lender.score_model || reqs.score_model || 'FICO Score',
      intro_apr_months: introAprMonths,
      min_apr: estMin.toFixed(2),
      max_apr: estMax.toFixed(2),
      requirements: reqs,
      notes: notes,
      match_score: matchScore,
      approval_likelihood: approvalLikelihood,
      estimated_apr_min: estMin.toFixed(2),
      estimated_apr_max: estMax.toFixed(2),
      match_reasons: matchReasons
    });
  }

  // Sort highest match score first and take top recommendations
  allCalculatedLenders.sort((a, b) => b.match_score - a.match_score);
  const matchedLenders = allCalculatedLenders.slice(0, 9);

  // Save top matched lenders to database
  for (const m of matchedLenders) {
    await useTransaction(async (conn) => {
      const [res] = await conn.execute(
        `INSERT INTO lender_matches (user_id, lender_id, fundability_score_id, match_score, approval_likelihood, estimated_apr_min, estimated_apr_max, match_reasons, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          user.id,
          m.lender_id,
          fundabilityScoreId,
          m.match_score,
          m.approval_likelihood,
          m.estimated_apr_min,
          m.estimated_apr_max,
          JSON.stringify(m.match_reasons)
        ]
      );
      m.id = (res as any).insertId;
      return [res];
    });
  }

  return {
    success: true,
    score: {
      id: fundabilityScoreId,
      score: totalScore,
      grade,
      factors,
      recommendations,
      strengths,
      weaknesses,
      credit_score: averageCreditScore,
      total_accounts: totalAccounts,
      open_accounts: openAccounts,
      hard_inquiries: hardInquiries,
      negative_items: negativeItems
    },
    matches: matchedLenders
  };
});
