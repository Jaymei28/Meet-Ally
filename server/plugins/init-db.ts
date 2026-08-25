import { useQuery } from '../utils/db';

export default defineNitroPlugin(async () => {
  try {
    // 1. Ensure `users` table exists
    await useQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'client',
        plan_type VARCHAR(50) NULL DEFAULT NULL,
        registration_status VARCHAR(50) NOT NULL DEFAULT 'completed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Ensure default admin and client exist
    const adminRows = await useQuery(`SELECT id FROM users WHERE email = 'admin@remedicredit.com'`);
    if (adminRows.length === 0) {
      await useQuery(`
        INSERT INTO users (name, email, password, role, plan_type, registration_status)
        VALUES ('Admin Strategist', 'admin@remedicredit.com', '$2b$10$w09Zk/K.6t8.LzG6q3bW5e7i/sV/9G7M3SgH2g.aY7eY', 'admin', 'turbo', 'completed')
      `);
    }

    const clientRows = await useQuery(`SELECT id FROM users WHERE email = 'rmillscompany@gmail.com'`);
    if (clientRows.length === 0) {
      await useQuery(`
        INSERT INTO users (name, email, password, role, plan_type, registration_status)
        VALUES ('Rasheda Mills', 'rmillscompany@gmail.com', '$2b$10$w09Zk/K.6t8.LzG6q3bW5e7i/sV/9G7M3SgH2g.aY7eY', 'client', 'turbo', 'completed')
      `);
    }

    // 2. Ensure `user_assessments` table exists
    await useQuery(`
      CREATE TABLE IF NOT EXISTS user_assessments (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT UNSIGNED NOT NULL,
        score_range VARCHAR(50) NULL,
        primary_goal VARCHAR(255) NULL,
        has_collections TINYINT(1) DEFAULT 0,
        has_late_payments TINYINT(1) DEFAULT 0,
        has_inquiries TINYINT(1) DEFAULT 0,
        has_chargeoffs TINYINT(1) DEFAULT 0,
        assessment_data JSON NULL,
        game_plan JSON NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 3. Ensure `credit_reports` table exists
    await useQuery(`
      CREATE TABLE IF NOT EXISTS credit_reports (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT UNSIGNED NOT NULL,
        raw_text LONGTEXT NULL,
        parsed_data JSON NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 4. Ensure `discrepancies` table exists
    await useQuery(`
      CREATE TABLE IF NOT EXISTS discrepancies (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT UNSIGNED NOT NULL,
        bureau VARCHAR(50) NOT NULL,
        creditor_name VARCHAR(255) NOT NULL,
        account_number VARCHAR(100) NULL,
        issue_type VARCHAR(100) NOT NULL,
        severity VARCHAR(50) NOT NULL DEFAULT 'medium',
        phase INT NOT NULL DEFAULT 1,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        details TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 5. Ensure `letters` table exists
    await useQuery(`
      CREATE TABLE IF NOT EXISTS letters (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT UNSIGNED NOT NULL,
        title VARCHAR(255) NOT NULL,
        bureau VARCHAR(50) NOT NULL,
        creditor_name VARCHAR(255) NULL,
        content LONGTEXT NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    console.log('✅ Auto-database initialization completed successfully.');
  } catch (err) {
    console.error('⚠️ DB Auto-Init Warning:', err.message);
  }
});
