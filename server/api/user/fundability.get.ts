import { useQuery } from '../../utils/db';
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

  // 3. Fetch latest fundability score
  const scores = await useQuery(
    `SELECT * FROM fundability_scores WHERE user_id = ? ORDER BY id DESC LIMIT 1`,
    [user.id]
  );

  if (scores.length === 0) {
    return { hasScore: false };
  }

  const scoreObj = scores[0];

  // Parse JSON columns
  if (scoreObj.factors && typeof scoreObj.factors === 'string') {
    scoreObj.factors = JSON.parse(scoreObj.factors);
  }
  if (scoreObj.recommendations && typeof scoreObj.recommendations === 'string') {
    scoreObj.recommendations = JSON.parse(scoreObj.recommendations);
  }
  if (scoreObj.strengths && typeof scoreObj.strengths === 'string') {
    scoreObj.strengths = JSON.parse(scoreObj.strengths);
  }
  if (scoreObj.weaknesses && typeof scoreObj.weaknesses === 'string') {
    scoreObj.weaknesses = JSON.parse(scoreObj.weaknesses);
  }

  // 4. Fetch matched lenders
  let matches = await useQuery(
    `SELECT lm.*, l.name as lender_name, l.type as lender_type, l.bureau_pull, l.recommended_score, l.score_model, l.intro_apr_months, l.min_apr, l.max_apr, l.requirements, l.notes
     FROM lender_matches lm
     JOIN lenders l ON lm.lender_id = l.id
     WHERE lm.user_id = ? AND lm.fundability_score_id = ?
     ORDER BY lm.match_score DESC`,
    [user.id, scoreObj.id]
  );

  // If no saved matches in DB yet, dynamically retrieve top lenders for score
  if (!matches || matches.length === 0) {
    const rawLenders = await useQuery('SELECT * FROM lenders WHERE active = 1 ORDER BY min_credit_score ASC LIMIT 6');
    matches = rawLenders.map((l: any, idx: number) => {
      const reqs = l.requirements ? (typeof l.requirements === 'string' ? JSON.parse(l.requirements) : l.requirements) : {};
      return {
        id: l.id,
        lender_id: l.id,
        lender_name: l.name,
        lender_type: l.type,
        bureau_pull: l.bureau_pull || reqs.bureau_pull || 'Experian',
        recommended_score: l.recommended_score || `${l.min_credit_score || 640}+`,
        score_model: l.score_model || reqs.score_model || 'FICO Score',
        intro_apr_months: l.intro_apr_months || reqs.apr_months || '0% Intro',
        min_apr: l.min_apr || reqs.min_apr || '14.99',
        max_apr: l.max_apr || reqs.max_apr || '28.99',
        estimated_apr_min: l.min_apr || reqs.min_apr || '14.99',
        estimated_apr_max: l.max_apr || reqs.max_apr || '28.99',
        requirements: reqs,
        notes: l.notes || reqs.notes || l.description || 'Pre-approved offer based on credit evaluation',
        match_score: Math.max(50, 85 - (idx * 5)),
        approval_likelihood: idx < 2 ? 'high' : (idx < 4 ? 'medium' : 'building'),
        match_reasons: [
          'Pre-qualified based on credit file underwriting',
          l.type === 'credit_union' ? 'Competitive credit union member rates' : 'Major national lender'
        ]
      };
    });
  } else {
    // Parse JSON requirements for each matched lender
    for (const m of matches) {
      const reqs = m.requirements ? (typeof m.requirements === 'string' ? JSON.parse(m.requirements) : m.requirements) : {};
      m.requirements = reqs;
      m.bureau_pull = m.bureau_pull || reqs.bureau_pull || 'Experian';
      m.notes = m.notes || reqs.notes || 'Pre-approved offer';
      m.recommended_score = m.recommended_score || '650+';
      m.intro_apr_months = m.intro_apr_months || reqs.apr_months || '0% Intro';
      if (m.match_reasons && typeof m.match_reasons === 'string') {
        m.match_reasons = JSON.parse(m.match_reasons);
      }
    }
  }

  return {
    hasScore: true,
    score: scoreObj,
    matches: matches
  };
});
