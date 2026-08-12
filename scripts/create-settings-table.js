import mysql from 'mysql2/promise';

async function main() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'creditremedi'
  });

  console.log('Connected to database.');
  
  // 1. Create system_settings table if not exists
  await connection.query(`
    CREATE TABLE IF NOT EXISTS system_settings (
      setting_key VARCHAR(255) PRIMARY KEY,
      setting_value VARCHAR(255) NOT NULL
    )
  `);
  console.log('Created system_settings table.');

  // 2. Seed initial Claude API balance if not already set
  await connection.query(`
    INSERT IGNORE INTO system_settings (setting_key, setting_value) 
    VALUES ('claude_api_balance', '45.82')
  `);
  console.log('Seeded initial Claude API balance.');

  await connection.end();
}

main().catch(err => {
  console.error('Error running migration:', err);
});
