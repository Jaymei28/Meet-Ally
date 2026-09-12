// Curated Lenders & Credit Card Offers Catalog
// Fallback and database seeding for Fundability & Lender Matching

export interface LenderItem {
  id: number;
  name: string;
  type: string;
  bureau_pull: string;
  description: string;
  min_credit_score: number;
  max_credit_score: number;
  recommended_score: string;
  score_model: string;
  min_amount: number;
  max_amount: number;
  min_apr: number;
  max_apr: number;
  intro_apr_months: number;
  income_sensitivity: string;
  inquiry_sensitivity: string;
  application_url: string;
  requirements: any;
  notes: string;
  active: number;
}

export const CURATED_LENDERS: LenderItem[] = [
  {
    "id": 1,
    "name": "Wells Fargo Reflect",
    "type": "bank",
    "bureau_pull": "Experian",
    "description": "Strong for long 0% strategies. Up to 21 months 0% intro APR.",
    "min_credit_score": 680,
    "max_credit_score": 850,
    "recommended_score": "680-700+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 15000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 21,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "Medium",
    "application_url": "https://www.wellsfargo.com/credit-cards/reflect/",
    "requirements": {
      "bureau": "Experian",
      "score_model": "FICO",
      "income_sensitivity": "Medium",
      "inquiry_sensitivity": "Medium"
    },
    "notes": "Strong for long 0% strategies",
    "active": 1
  },
  {
    "id": 2,
    "name": "Wells Fargo Active Cash",
    "type": "bank",
    "bureau_pull": "Experian",
    "description": "Cashback + easier approvals. 15 months 0% intro APR.",
    "min_credit_score": 670,
    "max_credit_score": 850,
    "recommended_score": "670+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 15000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 15,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "Medium",
    "application_url": "https://www.wellsfargo.com/credit-cards/active-cash/",
    "requirements": {
      "bureau": "Experian",
      "score_model": "FICO",
      "income_sensitivity": "Medium",
      "inquiry_sensitivity": "Medium"
    },
    "notes": "Cashback + easier approvals",
    "active": 1
  },
  {
    "id": 3,
    "name": "Wells Fargo Autograph",
    "type": "bank",
    "bureau_pull": "Experian",
    "description": "Travel & lifestyle card. 12-15 months 0% intro APR.",
    "min_credit_score": 670,
    "max_credit_score": 850,
    "recommended_score": "670+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 15000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 15,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "Medium",
    "application_url": "https://www.wellsfargo.com/credit-cards/autograph/",
    "requirements": {
      "bureau": "Experian",
      "score_model": "FICO",
      "income_sensitivity": "Medium",
      "inquiry_sensitivity": "Medium"
    },
    "notes": "Travel & lifestyle card",
    "active": 1
  },
  {
    "id": 4,
    "name": "Citi Simplicity",
    "type": "bank",
    "bureau_pull": "Experian / Equifax",
    "description": "BT-focused, no late fees. Up to 21 months 0% intro APR.",
    "min_credit_score": 680,
    "max_credit_score": 850,
    "recommended_score": "680+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 20000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 21,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "Medium",
    "application_url": "https://www.citi.com/credit-cards/citi-simplicity-credit-card",
    "requirements": {
      "bureau": "Experian/Equifax",
      "score_model": "FICO",
      "income_sensitivity": "Medium",
      "inquiry_sensitivity": "Medium"
    },
    "notes": "BT-focused, no late fees",
    "active": 1
  },
  {
    "id": 5,
    "name": "Citi Diamond Preferred",
    "type": "bank",
    "bureau_pull": "Experian / Equifax",
    "description": "BT-friendly. Up to 21 months 0% intro APR.",
    "min_credit_score": 680,
    "max_credit_score": 850,
    "recommended_score": "680+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 20000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 21,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "Medium",
    "application_url": "https://www.citi.com/credit-cards/citi-diamond-preferred-credit-card",
    "requirements": {
      "bureau": "Experian/Equifax",
      "score_model": "FICO",
      "income_sensitivity": "Medium",
      "inquiry_sensitivity": "Medium"
    },
    "notes": "BT-friendly",
    "active": 1
  },
  {
    "id": 6,
    "name": "Citi Double Cash",
    "type": "bank",
    "bureau_pull": "Experian / Equifax",
    "description": "Strong BT option. 18 months 0% intro APR.",
    "min_credit_score": 680,
    "max_credit_score": 850,
    "recommended_score": "680+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 20000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 18,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "Medium",
    "application_url": "https://www.citi.com/credit-cards/citi-double-cash-credit-card",
    "requirements": {
      "bureau": "Experian/Equifax",
      "score_model": "FICO",
      "income_sensitivity": "Medium",
      "inquiry_sensitivity": "Medium"
    },
    "notes": "Strong BT option",
    "active": 1
  },
  {
    "id": 7,
    "name": "Citi Custom Cash",
    "type": "bank",
    "bureau_pull": "Experian",
    "description": "Category-based rewards. 15 months 0% intro APR.",
    "min_credit_score": 680,
    "max_credit_score": 850,
    "recommended_score": "680+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 20000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 15,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "Medium",
    "application_url": "https://www.citi.com/credit-cards/citi-custom-cash-credit-card",
    "requirements": {
      "bureau": "Experian",
      "score_model": "FICO",
      "income_sensitivity": "Medium",
      "inquiry_sensitivity": "Medium"
    },
    "notes": "Category-based rewards",
    "active": 1
  },
  {
    "id": 8,
    "name": "Discover it Cash Back",
    "type": "bank",
    "bureau_pull": "Experian",
    "description": "Rebuild-friendly. 15 months 0% intro APR.",
    "min_credit_score": 660,
    "max_credit_score": 850,
    "recommended_score": "660-680+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 15000,
    "min_apr": 0,
    "max_apr": 27.99,
    "intro_apr_months": 15,
    "income_sensitivity": "Low-Medium",
    "inquiry_sensitivity": "Low-Medium",
    "application_url": "https://www.discover.com/credit-cards/cash-back/",
    "requirements": {
      "bureau": "Experian",
      "score_model": "FICO",
      "income_sensitivity": "Low-Medium",
      "inquiry_sensitivity": "Low-Medium"
    },
    "notes": "Rebuild-friendly",
    "active": 1
  },
  {
    "id": 9,
    "name": "Discover it Chrome",
    "type": "bank",
    "bureau_pull": "Experian",
    "description": "Lower barrier to entry. 15 months 0% intro APR.",
    "min_credit_score": 660,
    "max_credit_score": 850,
    "recommended_score": "660+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 15000,
    "min_apr": 0,
    "max_apr": 27.99,
    "intro_apr_months": 15,
    "income_sensitivity": "Low-Medium",
    "inquiry_sensitivity": "Low-Medium",
    "application_url": "https://www.discover.com/credit-cards/chrome/",
    "requirements": {
      "bureau": "Experian",
      "score_model": "FICO",
      "income_sensitivity": "Low-Medium",
      "inquiry_sensitivity": "Low-Medium"
    },
    "notes": "Lower barrier",
    "active": 1
  },
  {
    "id": 10,
    "name": "Chase Freedom Unlimited",
    "type": "bank",
    "bureau_pull": "Experian (varies)",
    "description": "5/24 rule applies. 15 months 0% intro APR.",
    "min_credit_score": 690,
    "max_credit_score": 850,
    "recommended_score": "690+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 25000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 15,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "High",
    "application_url": "https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited",
    "requirements": {
      "notes": "5/24 rule applies",
      "bureau": "Experian (varies)",
      "score_model": "FICO",
      "income_sensitivity": "Medium",
      "inquiry_sensitivity": "High"
    },
    "notes": "5/24 rule applies",
    "active": 1
  },
  {
    "id": 11,
    "name": "Chase Freedom Flex",
    "type": "bank",
    "bureau_pull": "Experian (varies)",
    "description": "5/24 rule applies. 15 months 0% intro APR.",
    "min_credit_score": 690,
    "max_credit_score": 850,
    "recommended_score": "690+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 25000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 15,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "High",
    "application_url": "https://creditcards.chase.com/cash-back-credit-cards/freedom/flex",
    "requirements": {
      "notes": "5/24 rule applies",
      "bureau": "Experian (varies)",
      "score_model": "FICO",
      "income_sensitivity": "Medium",
      "inquiry_sensitivity": "High"
    },
    "notes": "5/24 rule applies",
    "active": 1
  },
  {
    "id": 12,
    "name": "Chase Slate Edge",
    "type": "bank",
    "bureau_pull": "Experian",
    "description": "BT-focused. 18 months 0% intro APR.",
    "min_credit_score": 680,
    "max_credit_score": 850,
    "recommended_score": "680+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 25000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 18,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "High",
    "application_url": "https://creditcards.chase.com/balance-transfer-credit-cards/slate-edge",
    "requirements": {
      "bureau": "Experian",
      "score_model": "FICO",
      "income_sensitivity": "Medium",
      "inquiry_sensitivity": "High"
    },
    "notes": "BT-focused",
    "active": 1
  },
  {
    "id": 13,
    "name": "Chase Ink Cash (Business)",
    "type": "bank",
    "bureau_pull": "Experian",
    "description": "Business card. EIN-friendly. 12 months 0% intro APR.",
    "min_credit_score": 700,
    "max_credit_score": 850,
    "recommended_score": "700+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 30000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 12,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "High",
    "application_url": "https://creditcards.chase.com/small-business-credit-cards/ink/cash",
    "requirements": {
      "type": "Business",
      "bureau": "Experian",
      "score_model": "FICO",
      "income_sensitivity": "Medium",
      "inquiry_sensitivity": "High"
    },
    "notes": "Business card, EIN-friendly",
    "active": 1
  },
  {
    "id": 14,
    "name": "Chase Ink Unlimited (Business)",
    "type": "bank",
    "bureau_pull": "Experian",
    "description": "Business card. 12 months 0% intro APR.",
    "min_credit_score": 700,
    "max_credit_score": 850,
    "recommended_score": "700+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 30000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 12,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "High",
    "application_url": "https://creditcards.chase.com/small-business-credit-cards/ink/unlimited",
    "requirements": {
      "type": "Business",
      "bureau": "Experian",
      "score_model": "FICO",
      "income_sensitivity": "Medium",
      "inquiry_sensitivity": "High"
    },
    "notes": "Business card",
    "active": 1
  },
  {
    "id": 15,
    "name": "Capital One Quicksilver",
    "type": "bank",
    "bureau_pull": "All Three",
    "description": "Triple pull common. 15 months 0% intro APR.",
    "min_credit_score": 670,
    "max_credit_score": 850,
    "recommended_score": "670+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 20000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 15,
    "income_sensitivity": "Medium-High",
    "inquiry_sensitivity": "High",
    "application_url": "https://www.capitalone.com/credit-cards/quicksilver/",
    "requirements": {
      "bureau": "All Three",
      "score_model": "FICO",
      "income_sensitivity": "Medium-High",
      "inquiry_sensitivity": "High"
    },
    "notes": "Triple pull common",
    "active": 1
  },
  {
    "id": 16,
    "name": "Capital One SavorOne",
    "type": "bank",
    "bureau_pull": "All Three",
    "description": "Triple pull common. 15 months 0% intro APR.",
    "min_credit_score": 680,
    "max_credit_score": 850,
    "recommended_score": "680+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 20000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 15,
    "income_sensitivity": "Medium-High",
    "inquiry_sensitivity": "High",
    "application_url": "https://www.capitalone.com/credit-cards/savorone-dining-rewards/",
    "requirements": {
      "bureau": "All Three",
      "score_model": "FICO",
      "income_sensitivity": "Medium-High",
      "inquiry_sensitivity": "High"
    },
    "notes": "Triple pull common",
    "active": 1
  },
  {
    "id": 17,
    "name": "Amex Blue Business Cash",
    "type": "bank",
    "bureau_pull": "Experian",
    "description": "Soft pulls after relationship. 12 months 0% intro APR.",
    "min_credit_score": 680,
    "max_credit_score": 850,
    "recommended_score": "680-700+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 25000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 12,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "Low",
    "application_url": "https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/american-express-blue-business-cash-credit-card/",
    "requirements": {
      "type": "Business",
      "bureau": "Experian",
      "score_model": "FICO",
      "income_sensitivity": "Medium",
      "inquiry_sensitivity": "Low"
    },
    "notes": "Soft pulls after relationship",
    "active": 1
  },
  {
    "id": 18,
    "name": "Navy Federal Platinum",
    "type": "credit_union",
    "bureau_pull": "TransUnion",
    "description": "Membership required. 12 months 0% intro APR.",
    "min_credit_score": 660,
    "max_credit_score": 850,
    "recommended_score": "660+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 15000,
    "min_apr": 0,
    "max_apr": 18,
    "intro_apr_months": 12,
    "income_sensitivity": "Low-Medium",
    "inquiry_sensitivity": "Low",
    "application_url": "https://www.navyfederal.org/loans-cards/credit-cards/platinum-credit-card.html",
    "requirements": {
      "bureau": "TransUnion",
      "membership": "Military affiliation required",
      "score_model": "FICO",
      "income_sensitivity": "Low-Medium",
      "inquiry_sensitivity": "Low"
    },
    "notes": "Membership required",
    "active": 1
  },
  {
    "id": 19,
    "name": "U.S. Bank Visa Platinum",
    "type": "bank",
    "bureau_pull": "TransUnion (state-based)",
    "description": "State-sensitive pulls. 18 months 0% intro APR.",
    "min_credit_score": 680,
    "max_credit_score": 850,
    "recommended_score": "680+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 15000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 18,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "Medium",
    "application_url": "https://www.usbank.com/credit-cards/visa-platinum-credit-card.html",
    "requirements": {
      "bureau": "TransUnion (state-based)",
      "score_model": "FICO",
      "income_sensitivity": "Medium",
      "inquiry_sensitivity": "Medium"
    },
    "notes": "State-sensitive pulls",
    "active": 1
  },
  {
    "id": 20,
    "name": "PNC Visa Platinum",
    "type": "bank",
    "bureau_pull": "Experian",
    "description": "Regional bank. 15 months 0% intro APR.",
    "min_credit_score": 680,
    "max_credit_score": 850,
    "recommended_score": "680+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 15000,
    "min_apr": 0,
    "max_apr": 24.99,
    "intro_apr_months": 15,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "Medium",
    "application_url": "https://www.pnc.com/en/personal-banking/banking/credit-cards/pnc-points-visa-credit-card.html",
    "requirements": {
      "bureau": "Experian",
      "score_model": "FICO",
      "income_sensitivity": "Medium",
      "inquiry_sensitivity": "Medium"
    },
    "notes": "Regional bank",
    "active": 1
  },
  {
    "id": 21,
    "name": "Synchrony Premier Mastercard",
    "type": "bank",
    "bureau_pull": "TransUnion",
    "description": "Lower score approvals. Promo-based 0% intro APR.",
    "min_credit_score": 640,
    "max_credit_score": 850,
    "recommended_score": "640-660+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 10000,
    "min_apr": 29.99,
    "max_apr": 29.99,
    "intro_apr_months": 0,
    "income_sensitivity": "Low",
    "inquiry_sensitivity": "Low",
    "application_url": "https://www.synchrony.com",
    "requirements": {
      "bureau": "TransUnion",
      "score_model": "FICO",
      "income_sensitivity": "Low",
      "inquiry_sensitivity": "Low"
    },
    "notes": "Lower score approvals",
    "active": 1
  },
  {
    "id": 22,
    "name": "PayPal Cashback Mastercard",
    "type": "bank",
    "bureau_pull": "TransUnion",
    "description": "Issued by Synchrony. 12 months 0% intro APR (targeted).",
    "min_credit_score": 660,
    "max_credit_score": 850,
    "recommended_score": "660+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 15000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 12,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "Medium",
    "application_url": "https://www.paypal.com/us/digital-wallet/manage-money/paypal-cashback-mastercard",
    "requirements": {
      "bureau": "TransUnion",
      "score_model": "FICO",
      "income_sensitivity": "Medium",
      "inquiry_sensitivity": "Medium"
    },
    "notes": "Issued by Synchrony",
    "active": 1
  },
  {
    "id": 23,
    "name": "Bank of America Customized Cash",
    "type": "bank",
    "bureau_pull": "Experian",
    "description": "Strong national issuer. 15 months 0% intro APR.",
    "min_credit_score": 670,
    "max_credit_score": 850,
    "recommended_score": "670+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 20000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 15,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "Medium",
    "application_url": "https://www.bankofamerica.com/credit-cards/products/customized-cash-rewards-credit-card/",
    "requirements": {
      "bureau": "Experian",
      "score_model": "FICO",
      "income_sensitivity": "Medium",
      "inquiry_sensitivity": "Medium"
    },
    "notes": "Strong national issuer",
    "active": 1
  },
  {
    "id": 24,
    "name": "Bank of America Unlimited Cash",
    "type": "bank",
    "bureau_pull": "Experian",
    "description": "Straightforward underwriting. 15 months 0% intro APR.",
    "min_credit_score": 670,
    "max_credit_score": 850,
    "recommended_score": "670+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 20000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 15,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "Medium",
    "application_url": "https://www.bankofamerica.com/credit-cards/products/unlimited-cash-back-credit-card/",
    "requirements": {
      "bureau": "Experian",
      "score_model": "FICO",
      "income_sensitivity": "Medium",
      "inquiry_sensitivity": "Medium"
    },
    "notes": "Straightforward underwriting",
    "active": 1
  },
  {
    "id": 25,
    "name": "Truist Enjoy Cash",
    "type": "bank",
    "bureau_pull": "Experian / Equifax",
    "description": "Regional variability. 15 months 0% intro APR.",
    "min_credit_score": 660,
    "max_credit_score": 850,
    "recommended_score": "660-680+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 15000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 15,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "Medium",
    "application_url": "https://www.truist.com/credit-cards/enjoy-cash",
    "requirements": {
      "bureau": "Experian/Equifax",
      "score_model": "FICO",
      "income_sensitivity": "Medium",
      "inquiry_sensitivity": "Medium"
    },
    "notes": "Regional variability",
    "active": 1
  },
  {
    "id": 26,
    "name": "Wells Fargo Reflect",
    "type": "bank",
    "bureau_pull": "Experian",
    "description": "Strong for long 0% strategies. Bureau Pull: Experian. Recommended Score: 680-700+. FICO (primary). 0% APR Months: Up to 21. Income Sensitivity: Medium. Inquiry Sensitivity: Medium.",
    "min_credit_score": 680,
    "max_credit_score": 850,
    "recommended_score": "680+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 20000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 0,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "Medium",
    "application_url": "",
    "requirements": {
      "notes": "Strong for long 0% strategies",
      "apr_months": "Up to 21",
      "bureau_pull": "Experian",
      "score_model": "FICO (primary)",
      "income_sensitivity": "Medium",
      "inquiry_sensitivity": "Medium"
    },
    "notes": "Strong for long 0% strategies. Bureau Pull: Experian. Recommended Score: 680-700+. FICO (primary). 0% APR Months: Up to 21. Income Sensitivity: Medium. Inquiry Sensitivity: Medium.",
    "active": 1
  },
  {
    "id": 27,
    "name": "Citi Simplicity",
    "type": "bank",
    "bureau_pull": "Experian / Equifax",
    "description": "BT-focused, no late fees. Bureau Pull: Experian / Equifax. Recommended Score: 680+. FICO (primary). 0% APR Months: Up to 21. Income Sensitivity: Medium. Inquiry Sensitivity: Medium.",
    "min_credit_score": 680,
    "max_credit_score": 850,
    "recommended_score": "680+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 20000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 0,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "Medium",
    "application_url": "",
    "requirements": {
      "notes": "BT-focused, no late fees",
      "apr_months": "Up to 21",
      "bureau_pull": "Experian / Equifax",
      "score_model": "FICO (primary)",
      "income_sensitivity": "Medium",
      "inquiry_sensitivity": "Medium"
    },
    "notes": "BT-focused, no late fees. Bureau Pull: Experian / Equifax. Recommended Score: 680+. FICO (primary). 0% APR Months: Up to 21. Income Sensitivity: Medium. Inquiry Sensitivity: Medium.",
    "active": 1
  },
  {
    "id": 28,
    "name": "Citi Diamond Preferred",
    "type": "bank",
    "bureau_pull": "Experian / Equifax",
    "description": "BT-friendly. Bureau Pull: Experian / Equifax. Recommended Score: 680+. FICO (primary). 0% APR Months: Up to 21. Income Sensitivity: Medium. Inquiry Sensitivity: Medium.",
    "min_credit_score": 680,
    "max_credit_score": 850,
    "recommended_score": "680+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 20000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 0,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "Medium",
    "application_url": "",
    "requirements": {
      "notes": "BT-friendly",
      "apr_months": "Up to 21",
      "bureau_pull": "Experian / Equifax",
      "score_model": "FICO (primary)",
      "income_sensitivity": "Medium",
      "inquiry_sensitivity": "Medium"
    },
    "notes": "BT-friendly. Bureau Pull: Experian / Equifax. Recommended Score: 680+. FICO (primary). 0% APR Months: Up to 21. Income Sensitivity: Medium. Inquiry Sensitivity: Medium.",
    "active": 1
  },
  {
    "id": 29,
    "name": "Wells Fargo Active Cash",
    "type": "bank",
    "bureau_pull": "Experian",
    "description": "Cashback + easier approvals. Bureau Pull: Experian. Recommended Score: 670+. FICO (primary). 0% APR Months: 15. Income Sensitivity: Medium. Inquiry Sensitivity: Medium.",
    "min_credit_score": 670,
    "max_credit_score": 850,
    "recommended_score": "670+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 20000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 0,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "Medium",
    "application_url": "",
    "requirements": {
      "notes": "Cashback + easier approvals",
      "apr_months": "15",
      "bureau_pull": "Experian",
      "score_model": "FICO (primary)",
      "income_sensitivity": "Medium",
      "inquiry_sensitivity": "Medium"
    },
    "notes": "Cashback + easier approvals. Bureau Pull: Experian. Recommended Score: 670+. FICO (primary). 0% APR Months: 15. Income Sensitivity: Medium. Inquiry Sensitivity: Medium.",
    "active": 1
  },
  {
    "id": 30,
    "name": "Wells Fargo Autograph",
    "type": "bank",
    "bureau_pull": "Experian",
    "description": "Travel & lifestyle card. Bureau Pull: Experian. Recommended Score: 670+. FICO (primary). 0% APR Months: 12-15. Income Sensitivity: Medium. Inquiry Sensitivity: Medium.",
    "min_credit_score": 670,
    "max_credit_score": 850,
    "recommended_score": "670+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 20000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 0,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "Medium",
    "application_url": "",
    "requirements": {
      "notes": "Travel & lifestyle card",
      "apr_months": "12-15",
      "bureau_pull": "Experian",
      "score_model": "FICO (primary)",
      "income_sensitivity": "Medium",
      "inquiry_sensitivity": "Medium"
    },
    "notes": "Travel & lifestyle card. Bureau Pull: Experian. Recommended Score: 670+. FICO (primary). 0% APR Months: 12-15. Income Sensitivity: Medium. Inquiry Sensitivity: Medium.",
    "active": 1
  },
  {
    "id": 31,
    "name": "Citi Double Cash",
    "type": "bank",
    "bureau_pull": "Experian / Equifax",
    "description": "Strong BT option. Bureau Pull: Experian / Equifax. Recommended Score: 680+. FICO (primary). 0% APR Months: 18 (BT). Income Sensitivity: Medium. Inquiry Sensitivity: Medium.",
    "min_credit_score": 680,
    "max_credit_score": 850,
    "recommended_score": "680+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 20000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 0,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "Medium",
    "application_url": "",
    "requirements": {
      "notes": "Strong BT option",
      "apr_months": "18 (BT)",
      "bureau_pull": "Experian / Equifax",
      "score_model": "FICO (primary)",
      "income_sensitivity": "Medium",
      "inquiry_sensitivity": "Medium"
    },
    "notes": "Strong BT option. Bureau Pull: Experian / Equifax. Recommended Score: 680+. FICO (primary). 0% APR Months: 18 (BT). Income Sensitivity: Medium. Inquiry Sensitivity: Medium.",
    "active": 1
  },
  {
    "id": 32,
    "name": "Citi Custom Cash",
    "type": "bank",
    "bureau_pull": "Experian",
    "description": "Category-based rewards. Bureau Pull: Experian. Recommended Score: 680+. FICO (primary). 0% APR Months: 15. Income Sensitivity: Medium. Inquiry Sensitivity: Medium.",
    "min_credit_score": 680,
    "max_credit_score": 850,
    "recommended_score": "680+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 20000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 0,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "Medium",
    "application_url": "",
    "requirements": {
      "notes": "Category-based rewards",
      "apr_months": "15",
      "bureau_pull": "Experian",
      "score_model": "FICO (primary)",
      "income_sensitivity": "Medium",
      "inquiry_sensitivity": "Medium"
    },
    "notes": "Category-based rewards. Bureau Pull: Experian. Recommended Score: 680+. FICO (primary). 0% APR Months: 15. Income Sensitivity: Medium. Inquiry Sensitivity: Medium.",
    "active": 1
  },
  {
    "id": 33,
    "name": "Discover it Cash Back",
    "type": "bank",
    "bureau_pull": "Experian",
    "description": "Rebuild-friendly. Bureau Pull: Experian. Recommended Score: 660-680+. FICO (primary). 0% APR Months: 15. Income Sensitivity: Low-Medium. Inquiry Sensitivity: Low-Medium.",
    "min_credit_score": 660,
    "max_credit_score": 850,
    "recommended_score": "660+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 20000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 0,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "Medium",
    "application_url": "",
    "requirements": {
      "notes": "Rebuild-friendly",
      "apr_months": "15",
      "bureau_pull": "Experian",
      "score_model": "FICO (primary)",
      "income_sensitivity": "Low-Medium",
      "inquiry_sensitivity": "Low-Medium"
    },
    "notes": "Rebuild-friendly. Bureau Pull: Experian. Recommended Score: 660-680+. FICO (primary). 0% APR Months: 15. Income Sensitivity: Low-Medium. Inquiry Sensitivity: Low-Medium.",
    "active": 1
  },
  {
    "id": 34,
    "name": "Discover it Chrome",
    "type": "bank",
    "bureau_pull": "Experian",
    "description": "Lower barrier. Bureau Pull: Experian. Recommended Score: 660+. FICO (primary). 0% APR Months: 15. Income Sensitivity: Low-Medium. Inquiry Sensitivity: Low-Medium.",
    "min_credit_score": 660,
    "max_credit_score": 850,
    "recommended_score": "660+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 20000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 0,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "Medium",
    "application_url": "",
    "requirements": {
      "notes": "Lower barrier",
      "apr_months": "15",
      "bureau_pull": "Experian",
      "score_model": "FICO (primary)",
      "income_sensitivity": "Low-Medium",
      "inquiry_sensitivity": "Low-Medium"
    },
    "notes": "Lower barrier. Bureau Pull: Experian. Recommended Score: 660+. FICO (primary). 0% APR Months: 15. Income Sensitivity: Low-Medium. Inquiry Sensitivity: Low-Medium.",
    "active": 1
  },
  {
    "id": 35,
    "name": "Chase Freedom Unlimited",
    "type": "bank",
    "bureau_pull": "Experian (varies)",
    "description": "5/24 rule applies. Bureau Pull: Experian (varies). Recommended Score: 690+. FICO (primary). 0% APR Months: 15. Income Sensitivity: Medium. Inquiry Sensitivity: High.",
    "min_credit_score": 690,
    "max_credit_score": 850,
    "recommended_score": "690+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 20000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 0,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "Medium",
    "application_url": "",
    "requirements": {
      "notes": "5/24 rule applies",
      "apr_months": "15",
      "bureau_pull": "Experian (varies)",
      "score_model": "FICO (primary)",
      "income_sensitivity": "Medium",
      "inquiry_sensitivity": "High"
    },
    "notes": "5/24 rule applies. Bureau Pull: Experian (varies). Recommended Score: 690+. FICO (primary). 0% APR Months: 15. Income Sensitivity: Medium. Inquiry Sensitivity: High.",
    "active": 1
  },
  {
    "id": 36,
    "name": "Chase Freedom Flex",
    "type": "bank",
    "bureau_pull": "Experian (varies)",
    "description": "5/24 rule applies. Bureau Pull: Experian (varies). Recommended Score: 690+. FICO (primary). 0% APR Months: 15. Income Sensitivity: Medium. Inquiry Sensitivity: High.",
    "min_credit_score": 690,
    "max_credit_score": 850,
    "recommended_score": "690+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 20000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 0,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "Medium",
    "application_url": "",
    "requirements": {
      "notes": "5/24 rule applies",
      "apr_months": "15",
      "bureau_pull": "Experian (varies)",
      "score_model": "FICO (primary)",
      "income_sensitivity": "Medium",
      "inquiry_sensitivity": "High"
    },
    "notes": "5/24 rule applies. Bureau Pull: Experian (varies). Recommended Score: 690+. FICO (primary). 0% APR Months: 15. Income Sensitivity: Medium. Inquiry Sensitivity: High.",
    "active": 1
  },
  {
    "id": 37,
    "name": "Chase Slate Edge",
    "type": "bank",
    "bureau_pull": "Experian",
    "description": "BT-focused. Bureau Pull: Experian. Recommended Score: 680+. FICO (primary). 0% APR Months: 18. Income Sensitivity: Medium. Inquiry Sensitivity: High.",
    "min_credit_score": 680,
    "max_credit_score": 850,
    "recommended_score": "680+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 20000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 0,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "Medium",
    "application_url": "",
    "requirements": {
      "notes": "BT-focused",
      "apr_months": "18",
      "bureau_pull": "Experian",
      "score_model": "FICO (primary)",
      "income_sensitivity": "Medium",
      "inquiry_sensitivity": "High"
    },
    "notes": "BT-focused. Bureau Pull: Experian. Recommended Score: 680+. FICO (primary). 0% APR Months: 18. Income Sensitivity: Medium. Inquiry Sensitivity: High.",
    "active": 1
  },
  {
    "id": 38,
    "name": "Capital One Quicksilver",
    "type": "bank",
    "bureau_pull": "All Three",
    "description": "Triple pull common. Bureau Pull: All Three. Recommended Score: 670+. FICO (primary). 0% APR Months: 15. Income Sensitivity: Medium-High. Inquiry Sensitivity: High.",
    "min_credit_score": 670,
    "max_credit_score": 850,
    "recommended_score": "670+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 20000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 0,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "Medium",
    "application_url": "",
    "requirements": {
      "notes": "Triple pull common",
      "apr_months": "15",
      "bureau_pull": "All Three",
      "score_model": "FICO (primary)",
      "income_sensitivity": "Medium-High",
      "inquiry_sensitivity": "High"
    },
    "notes": "Triple pull common. Bureau Pull: All Three. Recommended Score: 670+. FICO (primary). 0% APR Months: 15. Income Sensitivity: Medium-High. Inquiry Sensitivity: High.",
    "active": 1
  },
  {
    "id": 39,
    "name": "Capital One SavorOne",
    "type": "bank",
    "bureau_pull": "All Three",
    "description": "Triple pull common. Bureau Pull: All Three. Recommended Score: 680+. FICO (primary). 0% APR Months: 15. Income Sensitivity: Medium-High. Inquiry Sensitivity: High.",
    "min_credit_score": 680,
    "max_credit_score": 850,
    "recommended_score": "680+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 20000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 0,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "Medium",
    "application_url": "",
    "requirements": {
      "notes": "Triple pull common",
      "apr_months": "15",
      "bureau_pull": "All Three",
      "score_model": "FICO (primary)",
      "income_sensitivity": "Medium-High",
      "inquiry_sensitivity": "High"
    },
    "notes": "Triple pull common. Bureau Pull: All Three. Recommended Score: 680+. FICO (primary). 0% APR Months: 15. Income Sensitivity: Medium-High. Inquiry Sensitivity: High.",
    "active": 1
  },
  {
    "id": 40,
    "name": "Chase Ink Cash (Business)",
    "type": "bank",
    "bureau_pull": "Experian",
    "description": "Business card, EIN-friendly. Bureau Pull: Experian. Recommended Score: 700+. FICO (primary). 0% APR Months: 12. Income Sensitivity: Medium. Inquiry Sensitivity: High.",
    "min_credit_score": 700,
    "max_credit_score": 850,
    "recommended_score": "700+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 20000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 0,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "Medium",
    "application_url": "",
    "requirements": {
      "notes": "Business card, EIN-friendly",
      "apr_months": "12",
      "bureau_pull": "Experian",
      "score_model": "FICO (primary)",
      "income_sensitivity": "Medium",
      "inquiry_sensitivity": "High"
    },
    "notes": "Business card, EIN-friendly. Bureau Pull: Experian. Recommended Score: 700+. FICO (primary). 0% APR Months: 12. Income Sensitivity: Medium. Inquiry Sensitivity: High.",
    "active": 1
  },
  {
    "id": 41,
    "name": "Chase Ink Unlimited (Business)",
    "type": "bank",
    "bureau_pull": "Experian",
    "description": "Business card. Bureau Pull: Experian. Recommended Score: 700+. FICO (primary). 0% APR Months: 12. Income Sensitivity: Medium. Inquiry Sensitivity: High.",
    "min_credit_score": 700,
    "max_credit_score": 850,
    "recommended_score": "700+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 20000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 0,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "Medium",
    "application_url": "",
    "requirements": {
      "notes": "Business card",
      "apr_months": "12",
      "bureau_pull": "Experian",
      "score_model": "FICO (primary)",
      "income_sensitivity": "Medium",
      "inquiry_sensitivity": "High"
    },
    "notes": "Business card. Bureau Pull: Experian. Recommended Score: 700+. FICO (primary). 0% APR Months: 12. Income Sensitivity: Medium. Inquiry Sensitivity: High.",
    "active": 1
  },
  {
    "id": 42,
    "name": "Amex Blue Business Cash",
    "type": "bank",
    "bureau_pull": "Experian",
    "description": "Soft pulls after relationship. Bureau Pull: Experian. Recommended Score: 680-700+. FICO (primary). 0% APR Months: 12. Income Sensitivity: Medium. Inquiry Sensitivity: Low.",
    "min_credit_score": 680,
    "max_credit_score": 850,
    "recommended_score": "680+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 20000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 0,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "Medium",
    "application_url": "",
    "requirements": {
      "notes": "Soft pulls after relationship",
      "apr_months": "12",
      "bureau_pull": "Experian",
      "score_model": "FICO (primary)",
      "income_sensitivity": "Medium",
      "inquiry_sensitivity": "Low"
    },
    "notes": "Soft pulls after relationship. Bureau Pull: Experian. Recommended Score: 680-700+. FICO (primary). 0% APR Months: 12. Income Sensitivity: Medium. Inquiry Sensitivity: Low.",
    "active": 1
  },
  {
    "id": 43,
    "name": "Navy Federal Platinum",
    "type": "credit_union",
    "bureau_pull": "TransUnion",
    "description": "Membership required. Bureau Pull: TransUnion. Recommended Score: 660+. FICO (primary). 0% APR Months: 12. Income Sensitivity: Low-Medium. Inquiry Sensitivity: Low.",
    "min_credit_score": 660,
    "max_credit_score": 850,
    "recommended_score": "660+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 20000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 0,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "Medium",
    "application_url": "",
    "requirements": {
      "notes": "Membership required",
      "apr_months": "12",
      "bureau_pull": "TransUnion",
      "score_model": "FICO (primary)",
      "income_sensitivity": "Low-Medium",
      "inquiry_sensitivity": "Low"
    },
    "notes": "Membership required. Bureau Pull: TransUnion. Recommended Score: 660+. FICO (primary). 0% APR Months: 12. Income Sensitivity: Low-Medium. Inquiry Sensitivity: Low.",
    "active": 1
  },
  {
    "id": 44,
    "name": "U.S. Bank Visa Platinum",
    "type": "bank",
    "bureau_pull": "TransUnion (state-based)",
    "description": "State-sensitive pulls. Bureau Pull: TransUnion (state-based). Recommended Score: 680+. FICO (primary). 0% APR Months: 18. Income Sensitivity: Medium. Inquiry Sensitivity: Medium.",
    "min_credit_score": 680,
    "max_credit_score": 850,
    "recommended_score": "680+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 20000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 0,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "Medium",
    "application_url": "",
    "requirements": {
      "notes": "State-sensitive pulls",
      "apr_months": "18",
      "bureau_pull": "TransUnion (state-based)",
      "score_model": "FICO (primary)",
      "income_sensitivity": "Medium",
      "inquiry_sensitivity": "Medium"
    },
    "notes": "State-sensitive pulls. Bureau Pull: TransUnion (state-based). Recommended Score: 680+. FICO (primary). 0% APR Months: 18. Income Sensitivity: Medium. Inquiry Sensitivity: Medium.",
    "active": 1
  },
  {
    "id": 45,
    "name": "PNC Visa Platinum",
    "type": "bank",
    "bureau_pull": "Experian",
    "description": "Regional bank. Bureau Pull: Experian. Recommended Score: 680+. FICO (primary). 0% APR Months: 15. Income Sensitivity: Medium. Inquiry Sensitivity: Medium.",
    "min_credit_score": 680,
    "max_credit_score": 850,
    "recommended_score": "680+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 20000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 0,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "Medium",
    "application_url": "",
    "requirements": {
      "notes": "Regional bank",
      "apr_months": "15",
      "bureau_pull": "Experian",
      "score_model": "FICO (primary)",
      "income_sensitivity": "Medium",
      "inquiry_sensitivity": "Medium"
    },
    "notes": "Regional bank. Bureau Pull: Experian. Recommended Score: 680+. FICO (primary). 0% APR Months: 15. Income Sensitivity: Medium. Inquiry Sensitivity: Medium.",
    "active": 1
  },
  {
    "id": 46,
    "name": "Synchrony Premier Mastercard",
    "type": "online",
    "bureau_pull": "TransUnion",
    "description": "Lower score approvals. Bureau Pull: TransUnion. Recommended Score: 640-660+. FICO (primary). 0% APR Months: Promo-based. Income Sensitivity: Low. Inquiry Sensitivity: Low.",
    "min_credit_score": 640,
    "max_credit_score": 850,
    "recommended_score": "640+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 20000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 0,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "Medium",
    "application_url": "",
    "requirements": {
      "notes": "Lower score approvals",
      "apr_months": "Promo-based",
      "bureau_pull": "TransUnion",
      "score_model": "FICO (primary)",
      "income_sensitivity": "Low",
      "inquiry_sensitivity": "Low"
    },
    "notes": "Lower score approvals. Bureau Pull: TransUnion. Recommended Score: 640-660+. FICO (primary). 0% APR Months: Promo-based. Income Sensitivity: Low. Inquiry Sensitivity: Low.",
    "active": 1
  },
  {
    "id": 47,
    "name": "PayPal Cashback Mastercard",
    "type": "online",
    "bureau_pull": "TransUnion",
    "description": "Issued by Synchrony. Bureau Pull: TransUnion. Recommended Score: 660+. FICO (primary). 0% APR Months: 12 (targeted). Income Sensitivity: Medium. Inquiry Sensitivity: Medium.",
    "min_credit_score": 660,
    "max_credit_score": 850,
    "recommended_score": "660+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 20000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 0,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "Medium",
    "application_url": "",
    "requirements": {
      "notes": "Issued by Synchrony",
      "apr_months": "12 (targeted)",
      "bureau_pull": "TransUnion",
      "score_model": "FICO (primary)",
      "income_sensitivity": "Medium",
      "inquiry_sensitivity": "Medium"
    },
    "notes": "Issued by Synchrony. Bureau Pull: TransUnion. Recommended Score: 660+. FICO (primary). 0% APR Months: 12 (targeted). Income Sensitivity: Medium. Inquiry Sensitivity: Medium.",
    "active": 1
  },
  {
    "id": 48,
    "name": "Bank of America Customized Cash",
    "type": "bank",
    "bureau_pull": "Experian",
    "description": "Strong national issuer. Bureau Pull: Experian. Recommended Score: 670+. FICO (primary). 0% APR Months: 15. Income Sensitivity: Medium. Inquiry Sensitivity: Medium.",
    "min_credit_score": 670,
    "max_credit_score": 850,
    "recommended_score": "670+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 20000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 0,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "Medium",
    "application_url": "",
    "requirements": {
      "notes": "Strong national issuer",
      "apr_months": "15",
      "bureau_pull": "Experian",
      "score_model": "FICO (primary)",
      "income_sensitivity": "Medium",
      "inquiry_sensitivity": "Medium"
    },
    "notes": "Strong national issuer. Bureau Pull: Experian. Recommended Score: 670+. FICO (primary). 0% APR Months: 15. Income Sensitivity: Medium. Inquiry Sensitivity: Medium.",
    "active": 1
  },
  {
    "id": 49,
    "name": "Bank of America Unlimited Cash",
    "type": "bank",
    "bureau_pull": "Experian",
    "description": "Straightforward underwriting. Bureau Pull: Experian. Recommended Score: 670+. FICO (primary). 0% APR Months: 15. Income Sensitivity: Medium. Inquiry Sensitivity: Medium.",
    "min_credit_score": 670,
    "max_credit_score": 850,
    "recommended_score": "670+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 20000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 0,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "Medium",
    "application_url": "",
    "requirements": {
      "notes": "Straightforward underwriting",
      "apr_months": "15",
      "bureau_pull": "Experian",
      "score_model": "FICO (primary)",
      "income_sensitivity": "Medium",
      "inquiry_sensitivity": "Medium"
    },
    "notes": "Straightforward underwriting. Bureau Pull: Experian. Recommended Score: 670+. FICO (primary). 0% APR Months: 15. Income Sensitivity: Medium. Inquiry Sensitivity: Medium.",
    "active": 1
  },
  {
    "id": 50,
    "name": "Truist Enjoy Cash",
    "type": "bank",
    "bureau_pull": "Experian / Equifax",
    "description": "Regional variability. Bureau Pull: Experian / Equifax. Recommended Score: 660-680+. FICO (primary). 0% APR Months: 15. Income Sensitivity: Medium. Inquiry Sensitivity: Medium.",
    "min_credit_score": 660,
    "max_credit_score": 850,
    "recommended_score": "660+",
    "score_model": "FICO (primary)",
    "min_amount": 0,
    "max_amount": 20000,
    "min_apr": 0,
    "max_apr": 29.99,
    "intro_apr_months": 0,
    "income_sensitivity": "Medium",
    "inquiry_sensitivity": "Medium",
    "application_url": "",
    "requirements": {
      "notes": "Regional variability",
      "apr_months": "15",
      "bureau_pull": "Experian / Equifax",
      "score_model": "FICO (primary)",
      "income_sensitivity": "Medium",
      "inquiry_sensitivity": "Medium"
    },
    "notes": "Regional variability. Bureau Pull: Experian / Equifax. Recommended Score: 660-680+. FICO (primary). 0% APR Months: 15. Income Sensitivity: Medium. Inquiry Sensitivity: Medium.",
    "active": 1
  }
];

/**
 * Match lenders based on credit profile metrics
 */
export function matchLendersForProfile(
  averageCreditScore = 650,
  totalScore = 60,
  totalAccounts = 2,
  hardInquiries = 2,
  negativeItems = 1
) {
  const allCalculated: any[] = [];

  for (const lender of CURATED_LENDERS) {
    let matchScore = 0;
    const reqs = lender.requirements || {};
    const minScore = Number(lender.min_credit_score || 640);
    const maxScore = Number(lender.max_credit_score || 850);

    // Credit score proximity
    if (averageCreditScore >= minScore) {
      const range = Math.max(1, maxScore - minScore);
      const position = Math.min(range, averageCreditScore - minScore);
      matchScore += Math.min(50, 25 + Math.round((position / range) * 25));
    } else {
      const pointsBelow = minScore - averageCreditScore;
      const proximityScore = Math.max(10, 45 - Math.round(pointsBelow * 0.25));
      matchScore += proximityScore;
    }

    // Fundability score contribution
    matchScore += Math.round((totalScore / 100) * 30);

    // Accounts bonus
    if (totalAccounts >= 5) matchScore += 10;
    else if (totalAccounts >= 3) matchScore += 7;
    else if (totalAccounts >= 1) matchScore += 4;

    // Inquiries penalty / bonus
    if (hardInquiries <= 2) matchScore += 5;
    else if (hardInquiries > 5) matchScore -= 5;

    // Negative items penalty
    if (negativeItems > 5) matchScore -= 5;
    else if (negativeItems === 0) matchScore += 5;

    matchScore = Math.max(15, Math.min(99, matchScore));

    // Approval likelihood
    let approvalLikelihood = 'low';
    if (matchScore >= 70 && averageCreditScore >= (minScore - 15)) approvalLikelihood = 'high';
    else if (matchScore >= 50) approvalLikelihood = 'medium';
    else approvalLikelihood = 'building';

    // APR ranges
    const baseMin = Number(lender.min_apr || 12.99);
    const baseMax = Number(lender.max_apr || 29.99);
    let estMin = baseMin;
    let estMax = baseMax;

    if (averageCreditScore >= 720) {
      estMin = baseMin;
      estMax = baseMin + ((baseMax - baseMin) * 0.35);
    } else if (averageCreditScore >= 660) {
      estMin = baseMin + ((baseMax - baseMin) * 0.25);
      estMax = baseMin + ((baseMax - baseMin) * 0.65);
    } else {
      estMin = baseMin + ((baseMax - baseMin) * 0.45);
      estMax = baseMax;
    }

    const matchReasons: string[] = [];
    if (averageCreditScore >= minScore) {
      matchReasons.push('Your credit score meets their underwriting baseline');
    } else {
      matchReasons.push(`Target goal: ${minScore} recommended score (${minScore - averageCreditScore} pts away)`);
    }

    if (lender.type === 'bank') matchReasons.push('Major national bank with cash-back perks');
    else if (lender.type === 'credit_union') matchReasons.push('Credit union with competitive rate ceiling');
    else matchReasons.push('Fintech / online issuer with flexible approval paths');

    if (totalScore >= 60) matchReasons.push('Good overall fundability profile');
    if (hardInquiries <= 2) matchReasons.push('Low hard inquiry load');

    allCalculated.push({
      lender_id: lender.id,
      lender_name: lender.name,
      lender_type: lender.type,
      bureau_pull: lender.bureau_pull || reqs.bureau_pull || 'Experian',
      recommended_score: lender.recommended_score || `${minScore}+`,
      score_model: lender.score_model || 'FICO Score',
      intro_apr_months: lender.intro_apr_months ? `${lender.intro_apr_months} Mo 0%` : '0% Intro',
      min_apr: estMin.toFixed(2),
      max_apr: estMax.toFixed(2),
      estimated_apr_min: estMin.toFixed(2),
      estimated_apr_max: estMax.toFixed(2),
      application_url: lender.application_url,
      requirements: reqs,
      notes: lender.notes || lender.description || 'Pre-qualified card offer',
      match_score: matchScore,
      approval_likelihood: approvalLikelihood,
      match_reasons: matchReasons
    });
  }

  allCalculated.sort((a, b) => b.match_score - a.match_score);
  return allCalculated.slice(0, 9);
}

/**
 * Ensures the lenders table is populated in the database
 */
export async function seedLendersTable(useQueryFn: (sql: string, params?: any[]) => Promise<any[]>) {
  try {
    // Ensure table exists first
    await useQueryFn(`
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
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    const existing = await useQueryFn('SELECT id FROM lenders LIMIT 1');
    if (!existing || existing.length === 0) {
      console.log('Seeding lenders into database table...');
      for (const l of CURATED_LENDERS) {
        try {
          await useQueryFn(`
            INSERT INTO lenders (id, name, type, bureau_pull, description, min_credit_score, max_credit_score, recommended_score, score_model, min_amount, max_amount, min_apr, max_apr, intro_apr_months, income_sensitivity, inquiry_sensitivity, application_url, requirements, notes, active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
            ON DUPLICATE KEY UPDATE name = VALUES(name)
          `, [
            l.id, l.name, l.type, l.bureau_pull, l.description, l.min_credit_score, l.max_credit_score,
            l.recommended_score, l.score_model, l.min_amount, l.max_amount, l.min_apr, l.max_apr,
            l.intro_apr_months, l.income_sensitivity, l.inquiry_sensitivity, l.application_url,
            typeof l.requirements === 'object' ? JSON.stringify(l.requirements) : l.requirements,
            l.notes
          ]);
        } catch (insertErr: any) {
          // Continue inserting others
        }
      }
      console.log('Lenders seeded successfully.');
    }
  } catch (err: any) {
    console.warn('Lender auto-seed warning:', err.message);
  }
}
