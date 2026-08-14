import { useQuery } from '../../utils/db';
import bcryptjs from 'bcryptjs';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body || {};

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email and password are required.'
    });
  }

  try {
    const users = await useQuery("SELECT id, name, email, password, role, plan_type, profile_picture FROM users WHERE email = ? LIMIT 1", [email]);
    if (users.length === 0) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid email or password.'
      });
    }

    const user = users[0];
    const passwordMatch = bcryptjs.compareSync(password, user.password);
    if (!passwordMatch) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid email or password.'
      });
    }

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      plan_type: user.plan_type,
      profile_picture: user.profile_picture || null
    };

    // Set cookie that expires in 7 days
    setCookie(event, 'auth_user', JSON.stringify(userData), {
      httpOnly: false, // Must be readable by client middleware
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return {
      success: true,
      user: userData
    };
  } catch (err: any) {
    if (err.statusCode === 401) throw err;
    throw createError({
      statusCode: 500,
      statusMessage: `Database error during login: ${err.message}`
    });
  }
});
