import { useQuery } from '../../utils/db';
import bcryptjs from 'bcryptjs';
import { defineEventHandler, readBody, createError } from 'h3';

// Map PayPal Plan IDs to internal Meet Ally plan types
const PLAN_MAPPING: Record<string, string> = {
  'P-5BF7297880088450BNKLEPNY': 'turbo', // $29.99 Turbo Plan
  'P-65J96582X05956354NG5CJEQ': 'starter', // Starter Plan
  'P-8UB3667587865115UNG5CKGY': 'turbo', // Premium Plan (mapped to Turbo)
};

export default defineEventHandler(async (event) => {
  let body: any;
  try {
    body = await readBody(event);
  } catch (e: any) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid JSON payload' });
  }

  if (!body || !body.event_type) {
    throw createError({ statusCode: 400, statusMessage: 'Missing event_type in webhook payload' });
  }

  const eventType = body.event_type;
  const resource = body.resource || {};
  console.log(`[PayPal Webhook] Received event: ${eventType} - Resource ID: ${resource.id}`);

  // Handle Subscription Activation / Creation / Payment Completed
  if (
    eventType === 'BILLING.SUBSCRIPTION.ACTIVATED' ||
    eventType === 'BILLING.SUBSCRIPTION.CREATED' ||
    eventType === 'PAYMENT.SALE.COMPLETED'
  ) {
    const subscriptionId = resource.id || resource.billing_agreement_id;
    const planId = resource.plan_id;
    const mappedPlan = (planId && PLAN_MAPPING[planId]) ? PLAN_MAPPING[planId] : 'turbo';

    // Extract subscriber details
    const subscriber = resource.subscriber || {};
    const email = subscriber.email_address || resource.payer_email;
    const firstName = subscriber.name?.given_name || '';
    const lastName = subscriber.name?.surname || '';
    const fullName = `${firstName} ${lastName}`.trim() || 'Valued Client';

    const addressObj = subscriber.shipping_address?.address || {};
    const address = addressObj.address_line_1 || null;
    const city = addressObj.admin_area_2 || null;
    const state = addressObj.admin_area_1 || null;
    const zipcode = addressObj.postal_code || null;

    const amountVal = parseFloat(
      resource.billing_info?.last_payment?.amount?.value ||
      resource.amount?.total ||
      '29.99'
    );

    if (!email && subscriptionId) {
      // If payment sale event doesn't carry email, try matching by paypal_subscription_id
      const existingSubUsers = await useQuery(
        "SELECT id, email, plan_type FROM users WHERE paypal_subscription_id = ? LIMIT 1",
        [subscriptionId]
      );
      if (existingSubUsers.length > 0) {
        await useQuery(
          "UPDATE users SET has_paid = 1, plan_type = ?, paid_amount = ?, pm_type = 'paypal', updated_at = NOW() WHERE id = ?",
          [mappedPlan, amountVal, existingSubUsers[0].id]
        );
        return { success: true, message: `User ${existingSubUsers[0].email} subscription refreshed.` };
      }
    }

    if (!email) {
      console.warn('[PayPal Webhook] Notice: No email found in payload, event acknowledged.');
      return { success: true, message: 'Event acknowledged (no email provided)' };
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user exists by email or subscription ID
    const existingUsers = await useQuery(
      "SELECT id, name, email, role, plan_type, has_paid, ai_credits FROM users WHERE email = ? OR paypal_subscription_id = ? LIMIT 1",
      [cleanEmail, subscriptionId]
    );

    if (existingUsers.length > 0) {
      const user = existingUsers[0];
      const creditsToAdd = (user.ai_credits && user.ai_credits > 0) ? user.ai_credits : 100;

      await useQuery(
        `UPDATE users 
         SET plan_type = ?, 
             has_paid = 1, 
             registration_status = 'completed', 
             paypal_subscription_id = ?, 
             paid_amount = ?, 
             pm_type = 'paypal',
             ai_credits = ?,
             updated_at = NOW() 
         WHERE id = ?`,
        [mappedPlan, subscriptionId, amountVal, creditsToAdd, user.id]
      );

      console.log(`[PayPal Webhook] Successfully upgraded existing user ${cleanEmail} to ${mappedPlan} (Sub: ${subscriptionId})`);
      return { success: true, action: 'upgraded', userId: user.id, email: cleanEmail };
    } else {
      // Auto-provision new user account
      const tempPassword = 'Password123!';
      const hashedPassword = bcryptjs.hashSync(tempPassword, 10);

      const insertRes = await useQuery(
        `INSERT INTO users (
          name, email, password, role, plan_type, has_paid, registration_status,
          paid_amount, pm_type, paypal_subscription_id, ai_credits,
          address, city, state, zipcode, created_at, updated_at
         )
         VALUES (?, ?, ?, 'user', ?, 1, 'completed', ?, 'paypal', ?, 100, ?, ?, ?, ?, NOW(), NOW())`,
        [
          fullName,
          cleanEmail,
          hashedPassword,
          mappedPlan,
          amountVal,
          subscriptionId,
          address,
          city,
          state,
          zipcode
        ]
      );

      const newUserId = (insertRes as any).insertId;
      console.log(`[PayPal Webhook] Successfully auto-created new user ${cleanEmail} with ID ${newUserId} (Sub: ${subscriptionId})`);
      return { success: true, action: 'created', userId: newUserId, email: cleanEmail };
    }
  }

  // Handle Subscription Cancellation, Suspension, or Expiration
  if (
    eventType === 'BILLING.SUBSCRIPTION.CANCELLED' ||
    eventType === 'BILLING.SUBSCRIPTION.SUSPENDED' ||
    eventType === 'BILLING.SUBSCRIPTION.EXPIRED'
  ) {
    const subscriptionId = resource.id;
    const subscriber = resource.subscriber || {};
    const email = (subscriber.email_address || '').toLowerCase().trim();

    if (subscriptionId || email) {
      await useQuery(
        `UPDATE users 
         SET has_paid = 0, 
             updated_at = NOW() 
         WHERE paypal_subscription_id = ? OR email = ?`,
        [subscriptionId || '', email || '']
      );
      console.log(`[PayPal Webhook] Downgraded canceled/suspended subscriber: ${subscriptionId} / ${email}`);
    }

    return { success: true, action: 'deactivated', subscriptionId };
  }

  return { success: true, message: `Event ${eventType} received and ignored.` };
});
