import { useQuery } from '../utils/db';
import bcryptjs from 'bcryptjs';

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

    // Ensure default admin and client exist with valid 60-character bcrypt hashes for 'password'
    const defaultPasswordHash = bcryptjs.hashSync('password', 10);

    const adminRows = await useQuery(`SELECT id FROM users WHERE email = 'admin@remedicredit.com'`);
    if (adminRows.length === 0) {
      await useQuery(`
        INSERT INTO users (name, email, password, role, plan_type, registration_status)
        VALUES ('Admin Strategist', 'admin@remedicredit.com', ?, 'admin', 'turbo', 'completed')
      `, [defaultPasswordHash]);
    } else {
      await useQuery(`
        UPDATE users SET password = ?, role = 'admin', registration_status = 'completed' WHERE email = 'admin@remedicredit.com'
      `, [defaultPasswordHash]);
    }

    const clientRows = await useQuery(`SELECT id FROM users WHERE email = 'rmillscompany@gmail.com'`);
    if (clientRows.length === 0) {
      await useQuery(`
        INSERT INTO users (name, email, password, role, plan_type, registration_status)
        VALUES ('Rasheda Mills', 'rmillscompany@gmail.com', ?, 'client', 'turbo', 'completed')
      `, [defaultPasswordHash]);
    } else {
      await useQuery(`
        UPDATE users SET password = ?, registration_status = 'completed' WHERE email = 'rmillscompany@gmail.com'
      `, [defaultPasswordHash]);
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
        original_filename VARCHAR(255) NOT NULL DEFAULT '',
        file_path VARCHAR(255) NOT NULL DEFAULT '',
        extracted_text LONGTEXT NULL,
        action_plan LONGTEXT NULL,
        action_plan_ts TIMESTAMP NULL DEFAULT NULL,
        personal_info LONGTEXT NULL,
        total_accounts_count INT NULL,
        open_accounts_count INT NULL,
        negative_accounts_count INT NULL,
        hard_inquiries_count INT NULL,
        raw_text LONGTEXT NULL,
        parsed_data JSON NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Ensure all required columns exist on credit_reports (safe migration for live DB)
    const safeAddCreditReportColumn = async (colDef: string) => {
      try {
        await useQuery(`ALTER TABLE credit_reports ADD COLUMN ${colDef}`);
      } catch (e) {
        // Ignore if column already exists
      }
    };

    await safeAddCreditReportColumn(`original_filename VARCHAR(255) NOT NULL DEFAULT '' AFTER user_id`);
    await safeAddCreditReportColumn(`file_path VARCHAR(255) NOT NULL DEFAULT '' AFTER original_filename`);
    await safeAddCreditReportColumn(`extracted_text LONGTEXT NULL`);
    await safeAddCreditReportColumn(`action_plan LONGTEXT NULL`);
    await safeAddCreditReportColumn(`action_plan_ts TIMESTAMP NULL DEFAULT NULL`);
    await safeAddCreditReportColumn(`personal_info LONGTEXT NULL`);
    await safeAddCreditReportColumn(`total_accounts_count INT NULL`);
    await safeAddCreditReportColumn(`open_accounts_count INT NULL`);
    await safeAddCreditReportColumn(`negative_accounts_count INT NULL`);
    await safeAddCreditReportColumn(`hard_inquiries_count INT NULL`);

    // 4. Ensure `credit_scores` table exists
    await useQuery(`
      CREATE TABLE IF NOT EXISTS credit_scores (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT UNSIGNED NOT NULL,
        credit_report_id BIGINT UNSIGNED NOT NULL,
        bureau VARCHAR(50) NOT NULL,
        score INT NULL,
        score_model VARCHAR(100) NULL,
        score_scale VARCHAR(50) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (credit_report_id) REFERENCES credit_reports(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 5. Ensure `credit_inquiries` table exists
    await useQuery(`
      CREATE TABLE IF NOT EXISTS credit_inquiries (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT UNSIGNED NOT NULL,
        credit_report_id BIGINT UNSIGNED NOT NULL,
        bureau VARCHAR(50) NOT NULL,
        creditor_name VARCHAR(255) NULL,
        business_type VARCHAR(100) NULL,
        inquiry_type VARCHAR(50) NULL DEFAULT 'Hard',
        inquiry_date DATE NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (credit_report_id) REFERENCES credit_reports(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 6. Ensure `credit_accounts` table exists
    await useQuery(`
      CREATE TABLE IF NOT EXISTS credit_accounts (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT UNSIGNED NOT NULL,
        credit_report_id BIGINT UNSIGNED NOT NULL,
        bureau VARCHAR(255) NULL,
        creditor_name VARCHAR(255) NOT NULL,
        account_number VARCHAR(100) NULL,
        account_type VARCHAR(100) NULL,
        account_status VARCHAR(100) NULL,
        date_opened DATE NULL,
        date_reported DATE NULL,
        credit_limit DECIMAL(15,2) DEFAULT 0.00,
        current_balance DECIMAL(15,2) DEFAULT 0.00,
        payment_status VARCHAR(255) NULL,
        is_negative TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (credit_report_id) REFERENCES credit_reports(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 7. Ensure `credit_account_bureau_data` table exists
    await useQuery(`
      CREATE TABLE IF NOT EXISTS credit_account_bureau_data (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        credit_account_id BIGINT UNSIGNED NOT NULL,
        bureau VARCHAR(50) NOT NULL,
        balance DECIMAL(15,2) DEFAULT 0.00,
        credit_limit DECIMAL(15,2) DEFAULT 0.00,
        date_opened DATE NULL,
        date_reported DATE NULL,
        payment_status VARCHAR(255) NULL,
        account_status VARCHAR(255) NULL,
        comments TEXT NULL,
        raw_data JSON NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (credit_account_id) REFERENCES credit_accounts(id) ON DELETE CASCADE,
        UNIQUE KEY unique_account_bureau (credit_account_id, bureau)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 8. Ensure `bureau_discrepancies` table exists
    await useQuery(`
      CREATE TABLE IF NOT EXISTS bureau_discrepancies (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT UNSIGNED NOT NULL,
        credit_account_id BIGINT UNSIGNED NULL,
        field_name VARCHAR(100) NOT NULL,
        bureau_1 VARCHAR(50) NULL,
        value_1 TEXT NULL,
        bureau_2 VARCHAR(50) NULL,
        value_2 TEXT NULL,
        bureau_3 VARCHAR(50) NULL,
        value_3 TEXT NULL,
        dispute_priority INT DEFAULT 50,
        severity VARCHAR(50) DEFAULT 'medium',
        auto_generated_reason TEXT NULL,
        dispute_status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (credit_account_id) REFERENCES credit_accounts(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 9. Ensure legacy `discrepancies` table exists (for backward compatibility)
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

    // 10. Ensure `system_settings` table exists
    await useQuery(`
      CREATE TABLE IF NOT EXISTS system_settings (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) NOT NULL UNIQUE,
        setting_value TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Seed default claude_api_balance setting if not present
    const balanceSetting = await useQuery(`SELECT id FROM system_settings WHERE setting_key = 'claude_api_balance'`);
    if (balanceSetting.length === 0) {
      await useQuery(`INSERT INTO system_settings (setting_key, setting_value) VALUES ('claude_api_balance', '10.0000')`);
    }

    // 11. Ensure `dispute_letters` table exists
    await useQuery(`
      CREATE TABLE IF NOT EXISTS dispute_letters (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT UNSIGNED NOT NULL,
        credit_bureau VARCHAR(100) NULL,
        credit_item_type VARCHAR(100) NULL,
        creditor_name VARCHAR(255) NULL,
        account_number VARCHAR(100) NULL,
        dispute_reason TEXT NULL,
        desired_resolution TEXT NULL,
        phase INT NOT NULL DEFAULT 1,
        letter_content LONGTEXT NOT NULL DEFAULT '',
        posted_1 TINYINT(1) NOT NULL DEFAULT 0,
        posted_1_ts TIMESTAMP NULL DEFAULT NULL,
        sent TINYINT(1) NOT NULL DEFAULT 0,
        sent_ts TIMESTAMP NULL DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Safe-migrate dispute_letters for existing live tables
    const safeAddDisputeLetterCol = async (colDef: string) => {
      try { await useQuery(`ALTER TABLE dispute_letters ADD COLUMN ${colDef}`); } catch (e) {}
    };
    await safeAddDisputeLetterCol(`credit_bureau VARCHAR(100) NULL`);
    await safeAddDisputeLetterCol(`credit_item_type VARCHAR(100) NULL`);
    await safeAddDisputeLetterCol(`creditor_name VARCHAR(255) NULL`);
    await safeAddDisputeLetterCol(`account_number VARCHAR(100) NULL`);
    await safeAddDisputeLetterCol(`dispute_reason TEXT NULL`);
    await safeAddDisputeLetterCol(`desired_resolution TEXT NULL`);
    await safeAddDisputeLetterCol(`phase INT NOT NULL DEFAULT 1`);
    await safeAddDisputeLetterCol(`letter_content LONGTEXT NOT NULL DEFAULT ''`);
    await safeAddDisputeLetterCol(`posted_1 TINYINT(1) NOT NULL DEFAULT 0`);
    await safeAddDisputeLetterCol(`posted_1_ts TIMESTAMP NULL DEFAULT NULL`);
    await safeAddDisputeLetterCol(`sent TINYINT(1) NOT NULL DEFAULT 0`);
    await safeAddDisputeLetterCol(`sent_ts TIMESTAMP NULL DEFAULT NULL`);

    // 11. Ensure `lenders` table exists
    await useQuery(`
      CREATE TABLE IF NOT EXISTS lenders (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(255) NOT NULL DEFAULT 'bank',
        bureau_pull VARCHAR(255) NULL,
        description TEXT NULL,
        min_credit_score INT NOT NULL DEFAULT 0,
        max_credit_score INT NOT NULL DEFAULT 850,
        recommended_score VARCHAR(255) NULL,
        score_model VARCHAR(255) NULL,
        min_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        max_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        min_apr DECIMAL(5,2) NULL,
        max_apr DECIMAL(5,2) NULL,
        intro_apr_months INT NULL,
        income_sensitivity VARCHAR(255) NULL,
        inquiry_sensitivity VARCHAR(255) NULL,
        application_url VARCHAR(255) NULL,
        requirements LONGTEXT NULL,
        notes TEXT NULL,
        active TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP NULL DEFAULT NULL,
        updated_at TIMESTAMP NULL DEFAULT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Seed lenders if table is empty
    const lenderCount = await useQuery('SELECT COUNT(*) as cnt FROM lenders');
    if (lenderCount[0].cnt === 0) {
      await useQuery(`INSERT INTO lenders (id,name,type,bureau_pull,description,min_credit_score,max_credit_score,recommended_score,score_model,min_amount,max_amount,min_apr,max_apr,intro_apr_months,income_sensitivity,inquiry_sensitivity,application_url,requirements,notes,active,created_at,updated_at) VALUES
(1,'Wells Fargo Reflect','bank','Experian','Strong for long 0% strategies. Up to 21 months 0% intro APR.',680,850,'680-700+','FICO (primary)',0.00,15000.00,0.00,29.99,21,'Medium','Medium','https://www.wellsfargo.com/credit-cards/reflect/','{"bureau": "Experian", "score_model": "FICO", "income_sensitivity": "Medium", "inquiry_sensitivity": "Medium"}','Strong for long 0% strategies',1,'2025-12-18 17:47:34','2026-01-04 06:31:46'),
(2,'Wells Fargo Active Cash','bank','Experian','Cashback + easier approvals. 15 months 0% intro APR.',670,850,'670+','FICO (primary)',0.00,15000.00,0.00,29.99,15,'Medium','Medium','https://www.wellsfargo.com/credit-cards/active-cash/','{"bureau": "Experian", "score_model": "FICO", "income_sensitivity": "Medium", "inquiry_sensitivity": "Medium"}','Cashback + easier approvals',1,'2025-12-18 17:47:34','2026-01-04 06:31:46'),
(3,'Wells Fargo Autograph','bank','Experian','Travel & lifestyle card. 12-15 months 0% intro APR.',670,850,'670+','FICO (primary)',0.00,15000.00,0.00,29.99,15,'Medium','Medium','https://www.wellsfargo.com/credit-cards/autograph/','{"bureau": "Experian", "score_model": "FICO", "income_sensitivity": "Medium", "inquiry_sensitivity": "Medium"}','Travel & lifestyle card',1,'2025-12-18 17:47:34','2026-01-04 06:31:46'),
(4,'Citi Simplicity','bank','Experian / Equifax','BT-focused, no late fees. Up to 21 months 0% intro APR.',680,850,'680+','FICO (primary)',0.00,20000.00,0.00,29.99,21,'Medium','Medium','https://www.citi.com/credit-cards/citi-simplicity-credit-card','{"bureau": "Experian/Equifax", "score_model": "FICO", "income_sensitivity": "Medium", "inquiry_sensitivity": "Medium"}','BT-focused, no late fees',1,'2025-12-18 17:47:34','2026-01-04 06:31:46'),
(5,'Citi Diamond Preferred','bank','Experian / Equifax','BT-friendly. Up to 21 months 0% intro APR.',680,850,'680+','FICO (primary)',0.00,20000.00,0.00,29.99,21,'Medium','Medium','https://www.citi.com/credit-cards/citi-diamond-preferred-credit-card','{"bureau": "Experian/Equifax", "score_model": "FICO", "income_sensitivity": "Medium", "inquiry_sensitivity": "Medium"}','BT-friendly',1,'2025-12-18 17:47:34','2026-01-04 06:31:46'),
(6,'Citi Double Cash','bank','Experian / Equifax','Strong BT option. 18 months 0% intro APR.',680,850,'680+','FICO (primary)',0.00,20000.00,0.00,29.99,18,'Medium','Medium','https://www.citi.com/credit-cards/citi-double-cash-credit-card','{"bureau": "Experian/Equifax", "score_model": "FICO", "income_sensitivity": "Medium", "inquiry_sensitivity": "Medium"}','Strong BT option',1,'2025-12-18 17:47:34','2026-01-04 06:31:46'),
(7,'Citi Custom Cash','bank','Experian','Category-based rewards. 15 months 0% intro APR.',680,850,'680+','FICO (primary)',0.00,20000.00,0.00,29.99,15,'Medium','Medium','https://www.citi.com/credit-cards/citi-custom-cash-credit-card','{"bureau": "Experian", "score_model": "FICO", "income_sensitivity": "Medium", "inquiry_sensitivity": "Medium"}','Category-based rewards',1,'2025-12-18 17:47:34','2026-01-04 06:31:46'),
(8,'Discover it Cash Back','bank','Experian','Rebuild-friendly. 15 months 0% intro APR.',660,850,'660-680+','FICO (primary)',0.00,15000.00,0.00,27.99,15,'Low-Medium','Low-Medium','https://www.discover.com/credit-cards/cash-back/','{"bureau": "Experian", "score_model": "FICO", "income_sensitivity": "Low-Medium", "inquiry_sensitivity": "Low-Medium"}','Rebuild-friendly',1,'2025-12-18 17:47:34','2026-01-04 06:31:46'),
(9,'Discover it Chrome','bank','Experian','Lower barrier to entry. 15 months 0% intro APR.',660,850,'660+','FICO (primary)',0.00,15000.00,0.00,27.99,15,'Low-Medium','Low-Medium','https://www.discover.com/credit-cards/chrome/','{"bureau": "Experian", "score_model": "FICO", "income_sensitivity": "Low-Medium", "inquiry_sensitivity": "Low-Medium"}','Lower barrier',1,'2025-12-18 17:47:34','2026-01-04 06:31:46'),
(10,'Chase Freedom Unlimited','bank','Experian (varies)','5/24 rule applies. 15 months 0% intro APR.',690,850,'690+','FICO (primary)',0.00,25000.00,0.00,29.99,15,'Medium','High','https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited','{"notes": "5/24 rule applies", "bureau": "Experian (varies)", "score_model": "FICO", "income_sensitivity": "Medium", "inquiry_sensitivity": "High"}','5/24 rule applies',1,'2025-12-18 17:47:34','2026-01-04 06:31:46'),
(11,'Chase Freedom Flex','bank','Experian (varies)','5/24 rule applies. 15 months 0% intro APR.',690,850,'690+','FICO (primary)',0.00,25000.00,0.00,29.99,15,'Medium','High','https://creditcards.chase.com/cash-back-credit-cards/freedom/flex','{"notes": "5/24 rule applies", "bureau": "Experian (varies)", "score_model": "FICO", "income_sensitivity": "Medium", "inquiry_sensitivity": "High"}','5/24 rule applies',1,'2025-12-18 17:47:34','2026-01-04 06:31:46'),
(12,'Chase Slate Edge','bank','Experian','BT-focused. 18 months 0% intro APR.',680,850,'680+','FICO (primary)',0.00,25000.00,0.00,29.99,18,'Medium','High','https://creditcards.chase.com/balance-transfer-credit-cards/slate-edge','{"bureau": "Experian", "score_model": "FICO", "income_sensitivity": "Medium", "inquiry_sensitivity": "High"}','BT-focused',1,'2025-12-18 17:47:34','2026-01-04 06:31:46'),
(13,'Chase Ink Cash (Business)','bank','Experian','Business card. EIN-friendly. 12 months 0% intro APR.',700,850,'700+','FICO (primary)',0.00,30000.00,0.00,29.99,12,'Medium','High','https://creditcards.chase.com/small-business-credit-cards/ink/cash','{"type": "Business", "bureau": "Experian", "score_model": "FICO", "income_sensitivity": "Medium", "inquiry_sensitivity": "High"}','Business card, EIN-friendly',1,'2025-12-18 17:47:34','2026-01-04 06:31:46'),
(14,'Chase Ink Unlimited (Business)','bank','Experian','Business card. 12 months 0% intro APR.',700,850,'700+','FICO (primary)',0.00,30000.00,0.00,29.99,12,'Medium','High','https://creditcards.chase.com/small-business-credit-cards/ink/unlimited','{"type": "Business", "bureau": "Experian", "score_model": "FICO", "income_sensitivity": "Medium", "inquiry_sensitivity": "High"}','Business card',1,'2025-12-18 17:47:34','2026-01-04 06:31:46'),
(15,'Capital One Quicksilver','bank','All Three','Triple pull common. 15 months 0% intro APR.',670,850,'670+','FICO (primary)',0.00,20000.00,0.00,29.99,15,'Medium-High','High','https://www.capitalone.com/credit-cards/quicksilver/','{"bureau": "All Three", "score_model": "FICO", "income_sensitivity": "Medium-High", "inquiry_sensitivity": "High"}','Triple pull common',1,'2025-12-18 17:47:34','2026-01-04 06:31:46'),
(16,'Capital One SavorOne','bank','All Three','Triple pull common. 15 months 0% intro APR.',680,850,'680+','FICO (primary)',0.00,20000.00,0.00,29.99,15,'Medium-High','High','https://www.capitalone.com/credit-cards/savorone-dining-rewards/','{"bureau": "All Three", "score_model": "FICO", "income_sensitivity": "Medium-High", "inquiry_sensitivity": "High"}','Triple pull common',1,'2025-12-18 17:47:34','2026-01-04 06:31:46'),
(17,'Amex Blue Business Cash','bank','Experian','Soft pulls after relationship. 12 months 0% intro APR.',680,850,'680-700+','FICO (primary)',0.00,25000.00,0.00,29.99,12,'Medium','Low','https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/american-express-blue-business-cash-credit-card/','{"type": "Business", "bureau": "Experian", "score_model": "FICO", "income_sensitivity": "Medium", "inquiry_sensitivity": "Low"}','Soft pulls after relationship',1,'2025-12-18 17:47:34','2026-01-04 06:31:46'),
(18,'Navy Federal Platinum','credit_union','TransUnion','Membership required. 12 months 0% intro APR.',660,850,'660+','FICO (primary)',0.00,15000.00,0.00,18.00,12,'Low-Medium','Low','https://www.navyfederal.org/loans-cards/credit-cards/platinum-credit-card.html','{"bureau": "TransUnion", "membership": "Military affiliation required", "score_model": "FICO", "income_sensitivity": "Low-Medium", "inquiry_sensitivity": "Low"}','Membership required',1,'2025-12-18 17:47:34','2026-01-04 06:31:46'),
(19,'U.S. Bank Visa Platinum','bank','TransUnion (state-based)','State-sensitive pulls. 18 months 0% intro APR.',680,850,'680+','FICO (primary)',0.00,15000.00,0.00,29.99,18,'Medium','Medium','https://www.usbank.com/credit-cards/visa-platinum-credit-card.html','{"bureau": "TransUnion (state-based)", "score_model": "FICO", "income_sensitivity": "Medium", "inquiry_sensitivity": "Medium"}','State-sensitive pulls',1,'2025-12-18 17:47:34','2026-01-04 06:31:46'),
(20,'PNC Visa Platinum','bank','Experian','Regional bank. 15 months 0% intro APR.',680,850,'680+','FICO (primary)',0.00,15000.00,0.00,24.99,15,'Medium','Medium','https://www.pnc.com/en/personal-banking/banking/credit-cards/pnc-points-visa-credit-card.html','{"bureau": "Experian", "score_model": "FICO", "income_sensitivity": "Medium", "inquiry_sensitivity": "Medium"}','Regional bank',1,'2025-12-18 17:47:34','2026-01-04 06:31:46'),
(21,'Synchrony Premier Mastercard','bank','TransUnion','Lower score approvals.',640,850,'640-660+','FICO (primary)',0.00,10000.00,29.99,29.99,NULL,'Low','Low','https://www.synchrony.com','{"bureau": "TransUnion", "score_model": "FICO", "income_sensitivity": "Low", "inquiry_sensitivity": "Low"}','Lower score approvals',1,'2025-12-18 17:47:34','2026-01-04 06:31:46'),
(22,'PayPal Cashback Mastercard','bank','TransUnion','Issued by Synchrony. 12 months 0% intro APR.',660,850,'660+','FICO (primary)',0.00,15000.00,0.00,29.99,12,'Medium','Medium','https://www.paypal.com/us/digital-wallet/manage-money/paypal-cashback-mastercard','{"bureau": "TransUnion", "score_model": "FICO", "income_sensitivity": "Medium", "inquiry_sensitivity": "Medium"}','Issued by Synchrony',1,'2025-12-18 17:47:34','2026-01-04 06:31:46'),
(23,'Bank of America Customized Cash','bank','Experian','Strong national issuer. 15 months 0% intro APR.',670,850,'670+','FICO (primary)',0.00,20000.00,0.00,29.99,15,'Medium','Medium','https://www.bankofamerica.com/credit-cards/products/customized-cash-rewards-credit-card/','{"bureau": "Experian", "score_model": "FICO", "income_sensitivity": "Medium", "inquiry_sensitivity": "Medium"}','Strong national issuer',1,'2025-12-18 17:47:34','2026-01-04 06:31:46'),
(24,'Bank of America Unlimited Cash','bank','Experian','Straightforward underwriting. 15 months 0% intro APR.',670,850,'670+','FICO (primary)',0.00,20000.00,0.00,29.99,15,'Medium','Medium','https://www.bankofamerica.com/credit-cards/products/unlimited-cash-back-credit-card/','{"bureau": "Experian", "score_model": "FICO", "income_sensitivity": "Medium", "inquiry_sensitivity": "Medium"}','Straightforward underwriting',1,'2025-12-18 17:47:34','2026-01-04 06:31:46'),
(25,'Truist Enjoy Cash','bank','Experian / Equifax','Regional variability. 15 months 0% intro APR.',660,850,'660-680+','FICO (primary)',0.00,15000.00,0.00,29.99,15,'Medium','Medium','https://www.truist.com/credit-cards/enjoy-cash','{"bureau": "Experian/Equifax", "score_model": "FICO", "income_sensitivity": "Medium", "inquiry_sensitivity": "Medium"}','Regional variability',1,'2025-12-18 17:47:34','2026-01-04 06:31:46')
      `);
    }

    // 12. Ensure `fundability_scores` table exists
    await useQuery(`
      CREATE TABLE IF NOT EXISTS fundability_scores (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT UNSIGNED NOT NULL,
        score INT NOT NULL DEFAULT 0,
        grade VARCHAR(5) NOT NULL DEFAULT 'F',
        factors JSON NULL,
        recommendations JSON NULL,
        strengths JSON NULL,
        weaknesses JSON NULL,
        credit_score INT NULL,
        total_accounts INT NULL,
        open_accounts INT NULL,
        hard_inquiries INT NULL,
        negative_items INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 13. Ensure `lender_matches` table exists
    await useQuery(`
      CREATE TABLE IF NOT EXISTS lender_matches (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT UNSIGNED NOT NULL,
        lender_id BIGINT UNSIGNED NOT NULL,
        fundability_score_id BIGINT UNSIGNED NULL,
        match_score INT NOT NULL DEFAULT 0,
        approval_likelihood VARCHAR(50) NULL,
        estimated_apr_min DECIMAL(5,2) NULL,
        estimated_apr_max DECIMAL(5,2) NULL,
        match_reasons JSON NULL,
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
