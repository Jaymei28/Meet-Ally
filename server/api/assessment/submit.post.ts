import { useQuery } from '../../utils/db';
import bcryptjs from 'bcryptjs';
import { defineEventHandler, readBody, createError, setCookie } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { 
    name, 
    email, 
    phone, 
    score_range, 
    primary_goal, 
    has_collections, 
    has_late_payments, 
    has_inquiries, 
    has_chargeoffs,
    assessment_details
  } = body || {};

  if (!name || !email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name and email are required to generate your AI credit game plan.'
    });
  }

  const cleanEmail = email.toLowerCase().trim();
  const cleanName = name.trim();

  // 1. Send Lead Data to GoHighLevel Webhook (if configured)
  const ghlWebhookUrl = process.env.GHL_WEBHOOK_URL;
  if (ghlWebhookUrl) {
    try {
      await $fetch(ghlWebhookUrl, {
        method: 'POST',
        body: {
          name: cleanName,
          email: cleanEmail,
          phone: phone || '',
          score_range: score_range || '',
          primary_goal: primary_goal || '',
          has_collections: !!has_collections,
          has_late_payments: !!has_late_payments,
          has_inquiries: !!has_inquiries,
          has_chargeoffs: !!has_chargeoffs,
          source: 'Meet Ally Free Credit Assessment'
        }
      });
    } catch (e: any) {
      console.warn('GHL Webhook notification notice:', e.message);
    }
  }

  // 2. Build Customized AI Action Game Plan
  const gamePlan = {
    generatedAt: new Date().toISOString(),
    scoreRange: score_range || '580-639',
    primaryGoal: primary_goal || 'Credit Score & Profile Improvement',
    estimatedResolutionDays: has_collections || has_chargeoffs ? '60 - 90 Days' : '30 - 60 Days',
    recommendedStartingPhase: 'Phase 1: Personal Info & Bureau Audit',
    actionSteps: [
      {
        title: 'Step 1: FCRA Personal Data Audit',
        desc: 'Identify and challenge spelling variations, unverified addresses, and outdated employers across TransUnion, Experian, and Equifax.'
      },
      {
        title: 'Step 2: Derogatory & Collection Dispute File',
        desc: has_collections || has_chargeoffs 
          ? 'Prepare statutory dispute letters requesting full verification under FCRA § 611 and FDCPA § 809.'
          : 'Audit payment status consistency across reporting credit bureaus.'
      },
      {
        title: 'Step 3: Positive Tradeline & Credit Mix Optimization',
        desc: 'Add positive revolving trade lines to optimize credit utilization and accelerate score recovery.'
      }
    ]
  };

  // 3. Auto-provision Free Meet Ally Account & Login in DB
  let userRecord: any = null;

  try {
    const existingUsers = await useQuery("SELECT id, name, email, role, plan_type, profile_picture FROM users WHERE email = ? LIMIT 1", [cleanEmail]);

    if (existingUsers && existingUsers.length > 0) {
      userRecord = existingUsers[0];
    } else {
      const defaultPassword = 'Password123!';
      const hashedPassword = bcryptjs.hashSync(defaultPassword, 10);

      // Simple insert compatible with all DB schema states
      const insertRes = await useQuery(
        `INSERT INTO users (name, email, password, role, plan_type, registration_status, created_at, updated_at)
         VALUES (?, ?, ?, 'user', NULL, 'completed', NOW(), NOW())`,
        [cleanName, cleanEmail, hashedPassword]
      );

      const newUserId = (insertRes as any).insertId;
      userRecord = {
        id: newUserId,
        name: cleanName,
        email: cleanEmail,
        role: 'user',
        plan_type: null,
        profile_picture: null
      };
    }

    // Set Auth Cookie
    setCookie(event, 'auth_user', JSON.stringify(userRecord), {
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 30,
      path: '/'
    });

    // Save Assessment in user_assessments table
    try {
      await useQuery(
        `INSERT INTO user_assessments (user_id, score_range, primary_goal, has_collections, has_late_payments, has_inquiries, has_chargeoffs, assessment_data, game_plan, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          userRecord.id,
          score_range || null,
          primary_goal || null,
          has_collections ? 1 : 0,
          has_late_payments ? 1 : 0,
          has_inquiries ? 1 : 0,
          has_chargeoffs ? 1 : 0,
          JSON.stringify(assessment_details || {}),
          JSON.stringify(gamePlan)
        ]
      );
    } catch (assErr: any) {
      console.warn('user_assessments insert warning (non-fatal):', assErr.message);
    }

    return {
      success: true,
      user: userRecord,
      gamePlan
    };
  } catch (err: any) {
    console.error('Assessment submit DB error:', err.message);
    throw createError({
      statusCode: 500,
      statusMessage: `Assessment submission failed: ${err.message}`
    });
  }
});
