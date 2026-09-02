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
        has_paid TINYINT(1) DEFAULT 0,
        paid_amount DECIMAL(10,2) NULL,
        contact_number VARCHAR(100) NULL,
        pm_type VARCHAR(50) NULL,
        pm_last_four VARCHAR(10) NULL,
        payment_attempted_at DATETIME NULL,
        address VARCHAR(255) NULL,
        city VARCHAR(100) NULL,
        state VARCHAR(100) NULL,
        zipcode VARCHAR(20) NULL,
        profile_picture VARCHAR(255) NULL,
        registration_status VARCHAR(50) NOT NULL DEFAULT 'completed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Ensure columns exist on existing table
    const safeAddColumn = async (colDef: string) => {
      try {
        await useQuery(`ALTER TABLE users ADD COLUMN ${colDef}`);
      } catch (e) {
        // Ignore if column already exists
      }
    };

    await safeAddColumn(`has_paid TINYINT(1) DEFAULT 0`);
    await safeAddColumn(`paid_amount DECIMAL(10,2) NULL`);
    await safeAddColumn(`contact_number VARCHAR(100) NULL`);
    await safeAddColumn(`pm_type VARCHAR(50) NULL`);
    await safeAddColumn(`pm_last_four VARCHAR(10) NULL`);
    await safeAddColumn(`payment_attempted_at DATETIME NULL`);
    await safeAddColumn(`address VARCHAR(255) NULL`);
    await safeAddColumn(`city VARCHAR(100) NULL`);
    await safeAddColumn(`state VARCHAR(100) NULL`);
    await safeAddColumn(`zipcode VARCHAR(20) NULL`);
    await safeAddColumn(`profile_picture VARCHAR(255) NULL`);

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

    // 6. Ensure `system_announcements` table exists
    await useQuery(`
      CREATE TABLE IF NOT EXISTS system_announcements (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NULL,
        message TEXT NOT NULL,
        alert_type VARCHAR(50) NOT NULL DEFAULT 'promo',
        cta_label VARCHAR(100) NULL,
        cta_url VARCHAR(500) NULL,
        target_audience VARCHAR(50) NOT NULL DEFAULT 'all',
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    const announcementRows = await useQuery(`SELECT id FROM system_announcements LIMIT 1`);
    if (announcementRows.length === 0) {
      await useQuery(`
        INSERT INTO system_announcements (title, message, alert_type, cta_label, cta_url, target_audience, is_active)
        VALUES (
          'Special Turbo Offer',
          '🔥 Upgrade to Pro Plan (Turbo) today to unlock automated FCRA deletion letters, 3-bureau dispute sync, and lender matching!',
          'promo',
          'Subscribe with PayPal ($29.99/mo) →',
          'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-5BF7297880088450BNKLEPNY',
          'free_only',
          1
        )
      `);
    }

    console.log('✅ Auto-database initialization completed successfully.');
  } catch (err) {
    console.error('⚠️ DB Auto-Init Warning:', err.message);
  }
});
