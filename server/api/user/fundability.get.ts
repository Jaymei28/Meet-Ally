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
  const matches = await useQuery(
    `SELECT lm.*, l.name as lender_name, l.type as lender_type, l.bureau_pull, l.recommended_score, l.score_model, l.intro_apr_months, l.min_apr, l.max_apr, l.requirements, l.notes
     FROM lender_matches lm
     JOIN lenders l ON lm.lender_id = l.id
     WHERE lm.user_id = ? AND lm.fundability_score_id = ?
     ORDER BY lm.match_score DESC`,
    [user.id, scoreObj.id]
  );

  // Parse JSON requirements for each matched lender
  for (const m of matches) {
    if (m.requirements && typeof m.requirements === 'string') {
      m.requirements = JSON.parse(m.requirements);
    }
    if (m.match_reasons && typeof m.match_reasons === 'string') {
      m.match_reasons = JSON.parse(m.match_reasons);
    }
  }

  return {
    hasScore: true,
    score: scoreObj,
    matches: matches
  };
});
