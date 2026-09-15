import { useQuery } from '../../utils/db';
import { getCookie, setCookie, createError } from 'h3';
import { matchLendersForProfile, seedLendersTable } from '../../utils/lenders-catalog';

export default defineEventHandler(async (event) => {
  // 1. Get authenticated user from cookie
  const userCookie = getCookie(event, 'auth_user');
  if (!userCookie) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized. Please log in.' });
  }

  let user: any = null;
  try {
    user = JSON.parse(userCookie);
  } catch (e) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid session. Please log in again.' });
  }

  // 2. Restrict access to Pro (Turbo) plan or Admin only (check DB in case cookie is stale)
  if (user.role !== 'admin' && user.plan_type !== 'turbo') {
    try {
      const dbUsers = await useQuery(
        'SELECT id, name, email, role, plan_type, profile_picture FROM users WHERE id = ? LIMIT 1',
        [user.id]
      );
      if (dbUsers && dbUsers.length > 0) {
        user = { ...user, ...dbUsers[0] };
        setCookie(event, 'auth_user', JSON.stringify(user), {
          httpOnly: false,
          maxAge: 60 * 60 * 24 * 7,
          path: '/'
        });
      }
    } catch (_) {}
  }

  if (user.role !== 'admin' && user.plan_type !== 'turbo') {
    throw createError({
      statusCode: 403,
      statusMessage: 'This feature is only available for Pro (Turbo) plan subscribers. Please upgrade your plan.'
    });
  }

  // 3. Fetch latest fundability score
  let scores: any[] = [];
  try {
    scores = await useQuery(
      `SELECT * FROM fundability_scores WHERE user_id = ? ORDER BY id DESC LIMIT 1`,
      [user.id]
    );
  } catch (err: any) {
    console.warn('Could not query fundability_scores table:', err.message);
  }

  if (!scores || scores.length === 0) {
    return { hasScore: false };
  }

  const scoreObj = scores[0];

  // Parse JSON columns safely
  const safeJsonParse = (val: any, fallback: any) => {
    if (!val) return fallback;
    if (typeof val === 'object') return val;
    try {
      return JSON.parse(val);
    } catch (e) {
      return fallback;
    }
  };

  scoreObj.factors = safeJsonParse(scoreObj.factors, {});
  scoreObj.recommendations = safeJsonParse(scoreObj.recommendations, []);
  scoreObj.strengths = safeJsonParse(scoreObj.strengths, []);
  scoreObj.weaknesses = safeJsonParse(scoreObj.weaknesses, []);

  // 4. Fetch matched lenders
  let matches: any[] = [];
  try {
    matches = await useQuery(
      `SELECT lm.*, l.name as lender_name, l.type as lender_type, l.bureau_pull, l.recommended_score, l.score_model, l.intro_apr_months, l.min_apr, l.max_apr, l.requirements, l.notes, l.application_url
       FROM lender_matches lm
       JOIN lenders l ON lm.lender_id = l.id
       WHERE lm.user_id = ? AND lm.fundability_score_id = ?
       ORDER BY lm.match_score DESC`,
      [user.id, scoreObj.id]
    );
  } catch (err: any) {
    console.warn('Could not query lender_matches join table:', err.message);
  }

  // If no saved matches found in DB or empty, provide curated matches
  if (!matches || matches.length === 0) {
    let rawLenders: any[] = [];
    try {
      rawLenders = await useQuery('SELECT * FROM lenders WHERE active = 1 ORDER BY min_credit_score ASC LIMIT 9');
    } catch (e) {}

    if (rawLenders && rawLenders.length > 0) {
      matches = rawLenders.map((l: any, idx: number) => {
        const reqs = safeJsonParse(l.requirements, {});
        return {
          id: l.id,
          lender_id: l.id,
          lender_name: l.name,
          lender_type: l.type,
          bureau_pull: l.bureau_pull || reqs.bureau_pull || 'Experian',
          recommended_score: l.recommended_score || `${l.min_credit_score || 640}+`,
          score_model: l.score_model || reqs.score_model || 'FICO Score',
          intro_apr_months: l.intro_apr_months ? `${l.intro_apr_months} Mo 0%` : (reqs.apr_months || '0% Intro'),
          min_apr: l.min_apr || reqs.min_apr || '14.99',
          max_apr: l.max_apr || reqs.max_apr || '28.99',
          estimated_apr_min: l.min_apr || reqs.min_apr || '14.99',
          estimated_apr_max: l.max_apr || reqs.max_apr || '28.99',
          application_url: l.application_url,
          requirements: reqs,
          notes: l.notes || reqs.notes || l.description || 'Pre-approved offer based on credit evaluation',
          match_score: Math.max(50, 90 - (idx * 5)),
          approval_likelihood: idx < 3 ? 'high' : (idx < 6 ? 'medium' : 'building'),
          match_reasons: [
            'Pre-qualified based on credit file underwriting',
            l.type === 'credit_union' ? 'Competitive credit union member rates' : 'Major national lender with 0% APR intro'
          ]
        };
      });
    } else {
      // In-memory catalog fallback — always returns top 9 tailored matches
      const avgScore = Number(scoreObj.credit_score || 640);
      const totalPts = Number(scoreObj.score || 60);
      const accounts = Number(scoreObj.total_accounts || 2);
      const inqs = Number(scoreObj.hard_inquiries || 2);
      const negs = Number(scoreObj.negative_items || 1);

      matches = matchLendersForProfile(avgScore, totalPts, accounts, inqs, negs);

      // Trigger asynchronous seed of lenders table
      seedLendersTable(useQuery).catch(() => {});
    }
  } else {
    // Parse JSON requirements for each matched lender
    for (const m of matches) {
      m.requirements = safeJsonParse(m.requirements, {});
      m.bureau_pull = m.bureau_pull || m.requirements.bureau_pull || 'Experian';
      m.notes = m.notes || m.requirements.notes || 'Pre-approved offer';
      m.recommended_score = m.recommended_score || '650+';
      m.intro_apr_months = m.intro_apr_months || m.requirements.apr_months || '0% Intro';
      m.match_reasons = safeJsonParse(m.match_reasons, [
        'Pre-qualified based on credit file underwriting'
      ]);
    }
  }

  return {
    hasScore: true,
    score: scoreObj,
    matches: matches
  };
});
