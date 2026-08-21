import { useQuery } from '../../utils/db';
import bcryptjs from 'bcryptjs';
import { defineEventHandler, readBody, setCookie, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  // Extract GHL form fields (handles GHL standard & custom fields payload format)
  const email = body.email || body.contact?.email;
  const name = body.first_name ? `${body.first_name} ${body.last_name || ''}` : (body.name || body.contact?.name || 'Valued Client');
  const phone = body.phone || body.contact?.phone || '';
  const score_range = body.score_range || body.credit_score || '580-639';
  const primary_goal = body.primary_goal || body.goal || 'Credit Score & Profile Improvement';
  const has_collections = body.has_collections || body.collections || false;
  const has_late_payments = body.has_late_payments || body.late_payments || false;
  const has_inquiries = body.has_inquiries || body.inquiries || false;
  const has_chargeoffs = body.has_chargeoffs || body.chargeoffs || false;

  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email is required from GHL webhook payload.'
    });
  }

  const cleanEmail = email.toLowerCase().trim();
  const cleanName = name.trim();

  // 1. Check or Auto-Create Free Meet Ally User Account
  let userRecord: any = null;
  const existingUsers = await useQuery("SELECT id, name, email, role, plan_type, profile_picture FROM users WHERE email = ? LIMIT 1", [cleanEmail]);

  if (existingUsers.length > 0) {
    userRecord = existingUsers[0];
  } else {
    const defaultPassword = 'Password123!';
    const hashedPassword = bcryptjs.hashSync(defaultPassword, 10);

    const insertRes = await useQuery(
      `INSERT INTO users (
        name, email, password, role, plan_type, has_paid, registration_status, 
        contact_number, created_at, updated_at
       )
       VALUES (?, ?, ?, 'user', NULL, 0, 'completed', ?, NOW(), NOW())`,
      [cleanName, cleanEmail, hashedPassword, phone || null]
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

  // Set Auth Cookie to auto-login user when arriving at Meet Ally
  setCookie(event, 'auth_user', JSON.stringify(userRecord), {
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 30,
    path: '/'
  });

  // 2. Build AI Action Game Plan
  const gamePlan = {
    generatedAt: new Date().toISOString(),
    scoreRange: score_range,
    primaryGoal: primary_goal,
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

  // 3. Save or Update user_assessments table
  await useQuery(
    `INSERT INTO user_assessments (user_id, score_range, primary_goal, has_collections, has_late_payments, has_inquiries, has_chargeoffs, assessment_data, game_plan, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      userRecord.id,
      score_range,
      primary_goal,
      has_collections ? 1 : 0,
      has_late_payments ? 1 : 0,
      has_inquiries ? 1 : 0,
      has_chargeoffs ? 1 : 0,
      JSON.stringify(body),
      JSON.stringify(gamePlan)
    ]
  );

  return {
    success: true,
    message: 'GHL Assessment processed successfully. Free Meet Ally account provisioned.',
    user: userRecord,
    redirectUrl: `https://meet-ally-production.up.railway.app/assessment?email=${encodeURIComponent(cleanEmail)}`
  };
});
