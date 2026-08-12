import mysql from 'mysql2/promise';

async function main() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'creditremedi'
  });

  console.log('Connected to creditremedi database.');

  // Update roles from 'user' to 'regular'
  const [res1] = await connection.query("UPDATE users SET role = 'regular' WHERE role = 'user'");
  console.log(`Updated legacy roles to "regular": ${res1.affectedRows} rows.`);

  // Update plan types to 'turbo'
  const [res2] = await connection.query("UPDATE users SET plan_type = 'turbo' WHERE plan_type IN ('premium', 'pro')");
  console.log(`Updated plan types to "turbo": ${res2.affectedRows} rows.`);

  // Select and output current users for verification
  const [rows] = await connection.query("SELECT id, name, email, role, plan_type FROM users");
  console.log('Current Database User State:');
  console.log(rows);

  await connection.end();
}

main().catch(err => {
  console.error('Error during database cleanup:', err);
});
