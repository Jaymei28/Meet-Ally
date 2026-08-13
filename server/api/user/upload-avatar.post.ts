import { defineEventHandler, readMultipartFormData, getCookie, setCookie, createError } from 'h3';
import { useQuery } from '../../utils/db';
import fs from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
  const userCookie = getCookie(event, 'auth_user');
  if (!userCookie) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
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

  const files = await readMultipartFormData(event);
  if (!files || files.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No files uploaded.'
    });
  }

  const avatarFile = files.find(f => f.name === 'avatar');
  if (!avatarFile) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing file input with name "avatar".'
    });
  }

  // Validate mimetype
  if (!avatarFile.type?.startsWith('image/')) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Only image files are allowed.'
    });
  }

  // Get extension
  const ext = path.extname(avatarFile.filename || '').toLowerCase() || '.png';
  const filename = `avatar_${sessionUser.id}_${Date.now()}${ext}`;

  // Make sure upload directory exists
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, filename);
  fs.writeFileSync(filePath, avatarFile.data);

  const profilePictureUrl = `/uploads/${filename}`;

  try {
    // Update in database
    await useQuery('UPDATE users SET profile_picture = ? WHERE id = ?', [profilePictureUrl, sessionUser.id]);

    // Update session cookie
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

    setCookie(event, 'auth_user', JSON.stringify(newUserData), {
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    });

    return {
      success: true,
      profile_picture: profilePictureUrl,
      message: 'Profile picture uploaded successfully!'
    };
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to save profile picture: ${err.message}`
    });
  }
});
