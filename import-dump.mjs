import mysql from 'mysql2/promise';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

async function runImport() {
  const host = process.env.DB_HOST || '127.0.0.1';
  const port = Number(process.env.DB_PORT) || 3306;
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_DATABASE || 'creditremedi';

  console.log(`Connecting to DB ${user}@${host}:${port}/${database}...`);

  try {
    const conn = await mysql.createConnection({
      host,
      port,
      user,
      password,
      database,
      multipleStatements: true
    });

    console.log('✅ Connected to database. Reading creditremedi_dump.sql...');
    const sql = fs.readFileSync('creditremedi_dump.sql', 'utf8');

    console.log('Executing SQL import...');
    await conn.query(sql);

    console.log('🎉 Database import completed successfully!');
    await conn.end();
  } catch (err) {
    console.error('❌ DB Import Error:', err.message);
  }
}

runImport();
