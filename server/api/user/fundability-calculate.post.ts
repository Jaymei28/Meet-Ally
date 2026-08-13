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
  const matchedLenders: any[] = [];

  for (const lender of lenders) {
    let matchScore = 0;

    // Check minimum credit score (with 50pt tolerance check)
    const tolerance = 50;
    const effectiveMinScore = lender.min_credit_score - tolerance;

    if (averageCreditScore < effectiveMinScore) {
      continue; // No match
    }

    // A. Credit score alignment points (0-50 pts)
    if (averageCreditScore >= lender.min_credit_score && averageCreditScore <= lender.max_credit_score) {
      const range = lender.max_credit_score - lender.min_credit_score;
      const position = averageCreditScore - lender.min_credit_score;
      if (range > 0) {
        const scorePercentage = (position / range) * 100;
        matchScore += Math.min(50, Math.round(scorePercentage / 2));
      } else {
        matchScore += 50;
      }
    } else if (averageCreditScore > lender.max_credit_score) {
      matchScore += 50; // Over-qualified
    } else {
      // Below min, but within 50pt tolerance - penalty applied
      const pointsBelow = lender.min_credit_score - averageCreditScore;
      const penaltyPercentage = (pointsBelow / tolerance) * 100;
      const reducedPoints = 50 - Math.round(penaltyPercentage / 2);
      matchScore += Math.max(10, reducedPoints);
    }

    // B. Fundability score bonus (0-30 pts)
    matchScore += Math.round((totalScore / 100) * 30);

    // C. Account health bonus (0-10 pts)
    if (totalAccounts >= 5) matchScore += 10;
    else if (totalAccounts >= 3) matchScore += 6;
    else if (totalAccounts >= 1) matchScore += 3;

    // D. Inquiries penalty (up to -5 pts)
    if (hardInquiries > 6) matchScore -= 5;
    else if (hardInquiries > 4) matchScore -= 3;
    else if (hardInquiries > 2) matchScore -= 1;

    // E. Negative items penalty (up to -5 pts)
    if (negativeItems > 10) matchScore -= 5;
    else if (negativeItems > 5) matchScore -= 3;
    else if (negativeItems > 2) matchScore -= 1;

    matchScore = Math.max(0, Math.min(100, matchScore));

    // Approval likelihood tag
    let approvalLikelihood = 'low';
    if (matchScore >= 70) approvalLikelihood = 'high';
    else if (matchScore >= 50) approvalLikelihood = 'medium';

    // Estimated APR ranges
    const baseMin = Number(lender.min_apr || 5.99);
    const baseMax = Number(lender.max_apr || 29.99);
    let estMin = baseMin;
    let estMax = baseMax;

    if (averageCreditScore >= 750) {
      estMin = baseMin;
      estMax = baseMin + ((baseMax - baseMin) * 0.3);
    } else if (averageCreditScore >= 700) {
      estMin = baseMin + ((baseMax - baseMin) * 0.2);
      estMax = baseMin + ((baseMax - baseMin) * 0.5);
    } else if (averageCreditScore >= 650) {
      estMin = baseMin + ((baseMax - baseMin) * 0.4);
      estMax = baseMin + ((baseMax - baseMin) * 0.7);
    } else if (averageCreditScore >= 600) {
      estMin = baseMin + ((baseMax - baseMin) * 0.6);
      estMax = baseMin + ((baseMax - baseMin) * 0.9);
    } else {
      estMin = baseMin + ((baseMax - baseMin) * 0.7);
      estMax = baseMax;
    }

    // Reasons array
    const matchReasons: string[] = [];
    if (averageCreditScore >= lender.min_credit_score) {
      matchReasons.push('Your credit score meets their requirements');
    } else {
      matchReasons.push(`You're ${lender.min_credit_score - averageCreditScore} points below preferred score`);
    }

    if (lender.type === 'bank') matchReasons.push('Traditional bank with premium benefits');
    else if (lender.type === 'credit_union') matchReasons.push('Member-owned with lower APR potential');
    else matchReasons.push('Fast online validation & setup');

    if (totalScore >= 70) matchReasons.push('Strong overall fundability profile');
    else if (totalScore < 50) matchReasons.push('Improve fundability to increase odds');

    if (hardInquiries <= 2) matchReasons.push('Good inquiry profile');

    // Create the Lender Match row
    const [matchResult] = await useTransaction(async (conn) => {
      const [res] = await conn.execute(
        `INSERT INTO lender_matches (user_id, lender_id, fundability_score_id, match_score, approval_likelihood, estimated_apr_min, estimated_apr_max, match_reasons, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          user.id,
          lender.id,
          fundabilityScoreId,
          matchScore,
          approvalLikelihood,
          estMin,
          estMax,
          JSON.stringify(matchReasons)
        ]
      );
      return [res];
    });

    const matchId = (matchResult as any).insertId;

    // Push details for direct response mapping
    matchedLenders.push({
      id: matchId,
      lender_id: lender.id,
      lender_name: lender.name,
      lender_type: lender.type,
      bureau_pull: lender.bureau_pull,
      recommended_score: lender.recommended_score,
      score_model: lender.score_model,
      intro_apr_months: lender.intro_apr_months,
      min_apr: lender.min_apr,
      max_apr: lender.max_apr,
      requirements: lender.requirements ? JSON.parse(lender.requirements) : null,
      notes: lender.notes,
      match_score: matchScore,
      approval_likelihood: approvalLikelihood,
      estimated_apr_min: estMin,
      estimated_apr_max: estMax,
      match_reasons: matchReasons
    });
  }

  // Sort matched lenders highest score first
  matchedLenders.sort((a, b) => b.match_score - a.match_score);

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
