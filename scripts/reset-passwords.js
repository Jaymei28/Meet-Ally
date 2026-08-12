import mysql from 'mysql2/promise';
import bcryptjs from 'bcryptjs';

async function main() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'creditremedi'
  });

  console.log('Connected to creditremedi database.');

  // Generate bcrypt hash for 'password'
  const newHash = bcryptjs.hashSync('password', 10);
  console.log('New hash for "password":', newHash);

  // Update admin password
  const [res1] = await connection.query("UPDATE users SET password = ? WHERE email = 'admin@remedicredit.com'", [newHash]);
  console.log(`Updated admin password: ${res1.affectedRows} rows.`);

  // Update client password
  const [res2] = await connection.query("UPDATE users SET password = ? WHERE email = 'rmillscompany@gmail.com'", [newHash]);
  console.log(`Updated client password: ${res2.affectedRows} rows.`);

  await connection.end();
}

main().catch(err => {
  console.error('Error updating passwords:', err);
});
