import mysql from 'mysql2/promise';

async function main() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'creditremedi'
  });

  console.log('Connected to creditremedi database.');
  try {
    await connection.query('ALTER TABLE users ADD COLUMN ai_credits int(11) NOT NULL DEFAULT 100');
    console.log('Successfully added ai_credits column to users table.');
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('ai_credits column already exists.');
    } else {
      throw err;
    }
  }
  await connection.end();
}

main().catch(err => {
  console.error('Error running migration:', err);
});
