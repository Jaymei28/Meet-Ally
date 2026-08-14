import { useQuery } from '../../utils/db';
import bcryptjs from 'bcryptjs';
import { defineEventHandler, readBody, createError, setCookie } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { 
    name, 
    email, 
    password, 
    plan_type, 
    contact_number,
    card_number,
    cardholder_name,
    address,
    city,
    state,
    zipcode
  } = body || {};

  if (!name || !email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name, email, and password are required.'
    });
  }

  const selectedPlan = (plan_type === 'turbo' || plan_type === 'pro') ? 'turbo' : 'starter';
  const paidAmount = selectedPlan === 'turbo' ? 69.99 : 49.99;
  const cleanCardNum = (card_number || '4242').replace(/\s+/g, '');
  const lastFour = cleanCardNum.length >= 4 ? cleanCardNum.slice(-4) : '4242';

  try {
    // Check if email already exists
    const existingUsers = await useQuery("SELECT id FROM users WHERE email = ? LIMIT 1", [email.toLowerCase().trim()]);
    if (existingUsers.length > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: 'An account with this email already exists. Please sign in instead.'
      });
    }

    // Hash password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Insert user with payment method record
    const insertRes = await useQuery(
      `INSERT INTO users (
        name, email, password, role, plan_type, has_paid, registration_status, 
        paid_amount, contact_number, pm_type, pm_last_four, payment_attempted_at,
        address, city, state, zipcode, created_at, updated_at
       )
       VALUES (?, ?, ?, 'user', ?, 1, 'completed', ?, ?, 'card', ?, NOW(), ?, ?, ?, ?, NOW(), NOW())`,
      [
        name.trim(),
        email.toLowerCase().trim(),
        hashedPassword,
        selectedPlan,
        paidAmount,
        contact_number || null,
        lastFour,
        address || null,
        city || null,
        state || null,
        zipcode || null
      ]
    );

    const newUserId = (insertRes as any).insertId;

    const userData = {
      id: newUserId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: 'user',
      plan_type: selectedPlan
    };

    // Set auth cookie
    setCookie(event, 'auth_user', JSON.stringify(userData), {
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    });

    return {
      success: true,
      user: userData
    };
  } catch (err: any) {
    if (err.statusCode) throw err;
    throw createError({
      statusCode: 500,
      statusMessage: `Registration failed: ${err.message}`
    });
  }
});
