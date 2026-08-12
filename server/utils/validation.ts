export interface BureauData {
  bureau: string;
  balance: number;
  credit_limit: number;
  date_opened: string;
  date_reported: string;
  payment_status: string;
  account_status: string;
  comments: string;
}

export interface ExtractedAccount {
  creditor_name: string;
  account_number: string;
  account_type: string;
  is_negative: boolean;
  bureau_data: BureauData[];
}

export interface DiscrepancyResult {
  field_name: string;
  bureau_1: string;
  value_1: string;
  bureau_2: string;
  value_2: string;
  bureau_3?: string;
  value_3?: string;
  dispute_priority: number;
  severity: 'high' | 'medium' | 'low';
  auto_generated_reason: string;
}

/**
 * Normalizes account numbers (last 4 characters) to match across bureaus
 */
export function normalizeAccountNumber(accNum: string): string {
  if (!accNum) return '';
  const cleaned = accNum.replace(/[^a-zA-Z0-9]/g, '');
  return cleaned.slice(-4);
}

/**
 * Normalizes creditor names for comparison (stripping common suffixes like INC, LTD, LLC, BANK, etc.)
 */
export function normalizeCreditorName(name: string): string {
  if (!name) return '';
  return name
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .replace(/(?:FSB|BANK|NA|INC|LTD|LLC|CORP|SERVICES|FINANCIAL|CARD|SYSTEMS)\b/g, '')
    .trim();
}

/**
 * Runs cross-bureau validation logic on parsed account details
 */
export function runCrossBureauValidation(
  userId: number,
  accountId: number,
  creditorName: string,
  bureauData: BureauData[]
): DiscrepancyResult[] {
  const discrepancies: DiscrepancyResult[] = [];
  if (!bureauData || bureauData.length < 2) {
    return discrepancies; // Needs at least 2 bureaus to compare
  }

  // Helper to get value for a bureau
  const getVal = (bureau: string, field: keyof BureauData) => {
    const data = bureauData.find(b => b.bureau.toLowerCase() === bureau.toLowerCase());
    return data ? data[field] : undefined;
  };

  const bureaus = ['TransUnion', 'Experian', 'Equifax'];

  // 1. Check Balance Mismatches
  const balances = bureaus.map(b => ({ bureau: b, val: getVal(b, 'balance') as number | undefined }));
  const activeBalances = balances.filter(b => b.val !== undefined);
  if (activeBalances.length >= 2) {
    const firstVal = activeBalances[0].val!;
    const hasMismatch = activeBalances.some(b => b.val! !== firstVal);
    if (hasMismatch) {
      const diff = Math.max(...activeBalances.map(b => b.val!)) - Math.min(...activeBalances.map(b => b.val!));
      const severity = diff >= 500 ? 'high' : 'medium';
      const priority = diff >= 500 ? 90 : 70;
      
      discrepancies.push({
        field_name: 'balance',
        bureau_1: activeBalances[0].bureau,
        value_1: `$${activeBalances[0].val}`,
        bureau_2: activeBalances[1].bureau,
        value_2: `$${activeBalances[1].val}`,
        bureau_3: activeBalances[2]?.bureau,
        value_3: activeBalances[2] ? `$${activeBalances[2].val}` : undefined,
        dispute_priority: priority,
        severity,
        auto_generated_reason: `The balance for ${creditorName} is reported inconsistently across credit bureaus. The discrepancy of $${diff.toFixed(2)} violating FCRA guidelines requiring absolute accuracy in reporting.`
      });
    }
  }

  // 2. Check Date Opened Mismatches
  const dates = bureaus.map(b => ({ bureau: b, val: getVal(b, 'date_opened') as string | undefined }));
  const activeDates = dates.filter(d => d.val !== undefined && d.val !== '');
  if (activeDates.length >= 2) {
    const firstVal = activeDates[0].val!;
    const hasMismatch = activeDates.some(d => d.val! !== firstVal);
    if (hasMismatch) {
      discrepancies.push({
        field_name: 'date_opened',
        bureau_1: activeDates[0].bureau,
        value_1: activeDates[0].val!,
        bureau_2: activeDates[1].bureau,
        value_2: activeDates[1].val!,
        bureau_3: activeDates[2]?.bureau,
        value_3: activeDates[2]?.val,
        dispute_priority: 85,
        severity: 'high',
        auto_generated_reason: `The open date for ${creditorName} is reported inconsistently. One bureau reports ${activeDates[0].val} while another reports ${activeDates[1].val}. This inaccurate date reporting is a clear violation of FCRA compliance.`
      });
    }
  }

  // 3. Check Account Status Mismatches
  const statuses = bureaus.map(b => ({ bureau: b, val: getVal(b, 'account_status') as string | undefined }));
  const activeStatuses = statuses.filter(s => s.val !== undefined && s.val !== '');
  if (activeStatuses.length >= 2) {
    const firstVal = activeStatuses[0].val!.toLowerCase();
    const hasMismatch = activeStatuses.some(s => s.val!.toLowerCase() !== firstVal);
    if (hasMismatch) {
      discrepancies.push({
        field_name: 'account_status',
        bureau_1: activeStatuses[0].bureau,
        value_1: activeStatuses[0].val!,
        bureau_2: activeStatuses[1].bureau,
        value_2: activeStatuses[1].val!,
        bureau_3: activeStatuses[2]?.bureau,
        value_3: activeStatuses[2]?.val,
        dispute_priority: 80,
        severity: 'high',
        auto_generated_reason: `Account status conflict for ${creditorName}. It is reported as '${activeStatuses[0].val}' on ${activeStatuses[0].bureau} and '${activeStatuses[1].val}' on ${activeStatuses[1].bureau}. Standardized credit standards require bureaus to match account status.`
      });
    }
  }

  // 4. Check Credit Limit Mismatches
  const limits = bureaus.map(b => ({ bureau: b, val: getVal(b, 'credit_limit') as number | undefined }));
  const activeLimits = limits.filter(l => l.val !== undefined);
  if (activeLimits.length >= 2) {
    const firstVal = activeLimits[0].val!;
    const hasMismatch = activeLimits.some(l => l.val! !== firstVal);
    if (hasMismatch) {
      discrepancies.push({
        field_name: 'credit_limit',
        bureau_1: activeLimits[0].bureau,
        value_1: `$${activeLimits[0].val}`,
        bureau_2: activeLimits[1].bureau,
        value_2: `$${activeLimits[1].val}`,
        bureau_3: activeLimits[2]?.bureau,
        value_3: activeLimits[2] ? `$${activeLimits[2].val}` : undefined,
        dispute_priority: 70,
        severity: 'medium',
        auto_generated_reason: `Inconsistent credit limit reporting for ${creditorName} across bureaus. This variance directly impacts credit utilization and scoring formulas incorrectly.`
      });
    }
  }

  // 5. Check Payment Status (e.g. Current vs Late)
  const paymentStatuses = bureaus.map(b => ({ bureau: b, val: getVal(b, 'payment_status') as string | undefined }));
  const activePaymentStatuses = paymentStatuses.filter(p => p.val !== undefined && p.val !== '');
  if (activePaymentStatuses.length >= 2) {
    const firstVal = activePaymentStatuses[0].val!.toLowerCase();
    const hasMismatch = activePaymentStatuses.some(p => p.val!.toLowerCase() !== firstVal);
    if (hasMismatch) {
      discrepancies.push({
        field_name: 'payment_status',
        bureau_1: activePaymentStatuses[0].bureau,
        value_1: activePaymentStatuses[0].val!,
        bureau_2: activePaymentStatuses[1].bureau,
        value_2: activePaymentStatuses[1].val!,
        bureau_3: activePaymentStatuses[2]?.bureau,
        value_3: activePaymentStatuses[2]?.val,
        dispute_priority: 90,
        severity: 'high',
        auto_generated_reason: `Highly damaging discrepancy: Payment history status for ${creditorName} reports '${activePaymentStatuses[0].val}' vs '${activePaymentStatuses[1].val}'. Payment status must be reported accurately and identically across all reporting bureaus.`
      });
    }
  }

  return discrepancies;
}
