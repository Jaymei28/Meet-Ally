import { defineEventHandler, readBody, getCookie, setCookie, createError } from 'h3';
import { useQuery } from '../../utils/db';
import bcryptjs from 'bcryptjs';

export default defineEventHandler(async (event) => {
  const userCookie = getCookie(event, 'auth_user');
  if (!userCookie) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized. Please sign in.'
    });
  }

  let sessionUser: any = null;
  try {
    sessionUser = JSON.parse(userCookie);
  } catch (e) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid session cookie.'
    });
  }

  const body = await readBody(event);
  const { 
    name, email, password, address, city, state, zipcode, contact_number, 
    identityiq_username, identityiq_password, identityiq_secret_answer 
  } = body || {};

  if (!name || !email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name and email are required.'
    });
  }

  try {
    // Check if email is already taken by another user
    const existingUsers = await useQuery(
      'SELECT id FROM users WHERE email = ? AND id != ? LIMIT 1',
      [email, sessionUser.id]
    );

    if (existingUsers.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email address is already in use by another account.'
      });
    }

    // Build update query dynamically
    let queryFields = [
      'name = ?', 'email = ?', 'address = ?', 'city = ?', 'state = ?', 
      'zipcode = ?', 'contact_number = ?', 'identityiq_username = ?', 
      'identityiq_password = ?', 'identityiq_secret_answer = ?'
    ];
    let queryParams = [
      name, email, address || null, city || null, state || null, 
      zipcode || null, contact_number || null, identityiq_username || null,
      identityiq_password || null, identityiq_secret_answer || null
    ];

    if (password && password.length >= 6) {
      const hash = bcryptjs.hashSync(password, 10);
      queryFields.push('password = ?');
      queryParams.push(hash);
    } else if (password && password.length < 6) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Password must be at least 6 characters.'
      });
    }

    // Add userId to parameters
    queryParams.push(sessionUser.id);

    const updateQuery = `UPDATE users SET ${queryFields.join(', ')} WHERE id = ?`;
    await useQuery(updateQuery, queryParams);

    // Fetch updated user to update cookie and return
    const updatedRows = await useQuery(
      'SELECT id, name, email, role, plan_type, profile_picture FROM users WHERE id = ? LIMIT 1',
      [sessionUser.id]
    );

    const updatedUser = updatedRows[0];
    const newUserData = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      plan_type: updatedUser.plan_type,
      profile_picture: updatedUser.profile_picture
    };

    // Update the auth cookie
    setCookie(event, 'auth_user', JSON.stringify(newUserData), {
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    });

    return {
      success: true,
      user: newUserData,
      message: 'Profile updated successfully!'
    };
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || `Failed to update profile: ${err.message}`
    });
  }
});
