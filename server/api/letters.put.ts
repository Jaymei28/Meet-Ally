import { useTransaction } from '../utils/db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id, content } = body || {};

  if (!id || !content) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing letter ID or content.'
    });
  }

  await useTransaction(async (conn) => {
    await conn.execute(
      `UPDATE dispute_letters SET letter_content = ?, updated_at = NOW() WHERE id = ?`,
      [content, id]
    );
  });

  return { success: true, message: 'Letter successfully updated.' };
});
