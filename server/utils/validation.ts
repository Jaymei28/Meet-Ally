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

  // 1. Check Balance Mismatches (Only flag significant balance variances >= $100 to avoid minor date reporting noise)
  const balances = bureaus.map(b => ({ bureau: b, val: getVal(b, 'balance') as number | undefined }));
  const activeBalances = balances.filter(b => b.val !== undefined);
  if (activeBalances.length >= 2) {
    const firstVal = activeBalances[0].val!;
    const diff = Math.max(...activeBalances.map(b => b.val!)) - Math.min(...activeBalances.map(b => b.val!));
    
    // Ignore minor balance fluctuations under $100
    if (diff >= 100) {
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
        auto_generated_reason: `Significant balance inconsistency detected for ${creditorName} across credit bureaus (discrepancy of $${diff.toFixed(2)}). FCRA regulations require exact reporting accuracy across all bureaus.`
      });
    }
  }

  // 2. Check Account Status Mismatches (High Impact: Open vs Closed vs Collection vs Charge-Off)
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
        dispute_priority: 95,
        severity: 'high',
        auto_generated_reason: `Critical account status conflict for ${creditorName}. Reported as '${activeStatuses[0].val}' on ${activeStatuses[0].bureau} vs '${activeStatuses[1].val}' on ${activeStatuses[1].bureau}. Standard FCRA rules mandate identical status reporting.`
      });
    }
  }

  // 3. Check Payment Status Mismatches (Highest Priority: Late vs Current, Collection vs Paid)
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
        dispute_priority: 99,
        severity: 'high',
        auto_generated_reason: `Critical derogatory payment status discrepancy for ${creditorName}: Payment history reports '${activePaymentStatuses[0].val}' on ${activePaymentStatuses[0].bureau} vs '${activePaymentStatuses[1].val}' on ${activePaymentStatuses[1].bureau}. This directly harms credit scoring.`
      });
    }
  }

  // 4. Check Credit Limit Mismatches (Medium Impact on Utilization)
  const limits = bureaus.map(b => ({ bureau: b, val: getVal(b, 'credit_limit') as number | undefined }));
  const activeLimits = limits.filter(l => l.val !== undefined && l.val > 0);
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
        dispute_priority: 65,
        severity: 'medium',
        auto_generated_reason: `Inconsistent credit limit reporting for ${creditorName} across reporting bureaus, distorting credit utilization ratios.`
      });
    }
  }

  return discrepancies;
}
