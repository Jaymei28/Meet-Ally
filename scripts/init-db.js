import mysql from 'mysql2/promise';

async function main() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'creditremedi'
  });

  console.log('Connected to MySQL database "creditremedi".');

  // Create credit_account_bureau_data table
  console.log('Creating table "credit_account_bureau_data"...');
  await connection.query(`
    CREATE TABLE IF NOT EXISTS credit_account_bureau_data (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      credit_account_id BIGINT UNSIGNED NOT NULL,
      bureau VARCHAR(50) NOT NULL, -- 'TransUnion', 'Experian', 'Equifax'
      balance DECIMAL(15,2) DEFAULT 0.00,
      credit_limit DECIMAL(15,2) DEFAULT 0.00,
      date_opened DATE,
      date_reported DATE,
      payment_status VARCHAR(255),
      account_status VARCHAR(255),
      comments TEXT,
      raw_data JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (credit_account_id) REFERENCES credit_accounts(id) ON DELETE CASCADE,
      UNIQUE KEY unique_account_bureau (credit_account_id, bureau)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Create bureau_discrepancies table
  console.log('Creating table "bureau_discrepancies"...');
  await connection.query(`
    CREATE TABLE IF NOT EXISTS bureau_discrepancies (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      user_id BIGINT UNSIGNED NOT NULL,
      credit_account_id BIGINT UNSIGNED,
      field_name VARCHAR(100) NOT NULL, -- 'balance', 'date_opened', 'payment_status', etc.
      bureau_1 VARCHAR(50),
      value_1 TEXT,
      bureau_2 VARCHAR(50),
      value_2 TEXT,
      bureau_3 VARCHAR(50),
      value_3 TEXT,
      dispute_priority INT DEFAULT 50, -- 0-100 score
      severity VARCHAR(50) DEFAULT 'medium', -- 'high', 'medium', 'low'
      auto_generated_reason TEXT,
      dispute_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'disputed', 'resolved', 'ignored'
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (credit_account_id) REFERENCES credit_accounts(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  console.log('Database tables successfully initialized!');
  await connection.end();
}

main().catch(err => {
  console.error('Error initializing database:', err);
  process.exit(1);
});
