import { useTransaction } from '../utils/db';

export default defineEventHandler(async (event) => {
  // Auth guard
  const userCookie = getCookie(event, 'auth_user');
  if (!userCookie) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const body = await readBody(event);
  const { id, content, posted_1, sent } = body || {};
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing letter ID.'
    });
  }

  await useTransaction(async (conn) => {
    if (content !== undefined) {
      await conn.execute(
        `UPDATE dispute_letters SET letter_content = ?, updated_at = NOW() WHERE id = ?`,
        [content, id]
      );
    }
    if (posted_1 !== undefined) {
      await conn.execute(
        `UPDATE dispute_letters SET posted_1 = ?, posted_1_ts = NOW(), updated_at = NOW() WHERE id = ?`,
        [posted_1, id]
      );
    }
    if (sent !== undefined) {
      await conn.execute(
        `UPDATE dispute_letters SET sent = ?, sent_ts = NOW(), updated_at = NOW() WHERE id = ?`,
        [sent, id]
      );
    }
  });

  return { success: true, message: 'Letter successfully updated.' };
});
