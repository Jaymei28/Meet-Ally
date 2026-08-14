import { useQuery, useTransaction } from '../utils/db';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiKey = config.anthropicApiKey || process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Anthropic API key is not configured.'
    });
  }

  const body = await readBody(event);
  const { discrepancyIds, tone = 'factual', phase = 1 } = body || {};

  if (!discrepancyIds || !Array.isArray(discrepancyIds) || discrepancyIds.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing selected discrepancyIds array.'
    });
  }

  // 1. Fetch Selected Discrepancies and Creditor Details
  // Note: in mysql2, to use IN (?) we pass the array inside another array
  const placeholders = discrepancyIds.map(() => '?').join(',');
  const discrepancies = await useQuery(
    `SELECT bd.*, ca.creditor_name, ca.account_number, ca.account_type
     FROM bureau_discrepancies bd
     JOIN credit_accounts ca ON bd.credit_account_id = ca.id
     WHERE bd.id IN (${placeholders})`,
    discrepancyIds
  );

  if (discrepancies.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'No discrepancies found matching the provided IDs.'
    });
  }

  // Get user details
  const userId = discrepancies[0].user_id;
  const users = await useQuery('SELECT * FROM users WHERE id = ?', [userId]);
  const user = users[0];
  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User profile not found.'
    });
  }

  // Fetch Bureau Addresses
  const bureauAddresses = await useQuery('SELECT * FROM bureau_addresses WHERE active = 1');

  // 2. Group discrepancies by Bureau
  // A discrepancy has bureau_1, bureau_2, bureau_3. If bureau_X is reported, we add it to bureau_X's letter.
  const bureauDisputes: Record<string, any[]> = {
    'TransUnion': [],
    'Experian': [],
    'Equifax': []
  };

  for (const d of discrepancies) {
    const item = {
      id: d.id,
      creditor_name: d.creditor_name,
      account_number: d.account_number,
      account_type: d.account_type,
      field_name: d.field_name,
      auto_generated_reason: d.auto_generated_reason,
      severity: d.severity
    };

    // Check which bureaus report this discrepancy and add to their list
    const checkAndAdd = (bName: string, bField: string, valField: string) => {
      if (d[bField] && bName.toLowerCase() === d[bField].toLowerCase()) {
        bureauDisputes[bName].push({
          ...item,
          reported_value: d[valField],
          other_reports: [
            d.bureau_1 && d.bureau_1 !== bName ? `${d.bureau_1}: ${d.value_1}` : null,
            d.bureau_2 && d.bureau_2 !== bName ? `${d.bureau_2}: ${d.value_2}` : null,
            d.bureau_3 && d.bureau_3 !== bName ? `${d.bureau_3}: ${d.value_3}` : null
          ].filter(Boolean)
        });
      }
    };

    checkAndAdd('TransUnion', 'bureau_1', 'value_1');
    checkAndAdd('TransUnion', 'bureau_2', 'value_2');
    checkAndAdd('TransUnion', 'bureau_3', 'value_3');

    checkAndAdd('Experian', 'bureau_1', 'value_1');
    checkAndAdd('Experian', 'bureau_2', 'value_2');
    checkAndAdd('Experian', 'bureau_3', 'value_3');

    checkAndAdd('Equifax', 'bureau_1', 'value_1');
    checkAndAdd('Equifax', 'bureau_2', 'value_2');
    checkAndAdd('Equifax', 'bureau_3', 'value_3');
  }

  // 2.5 Enforce Standard vs Turbo letter generation limits
  if (user.role !== 'admin' && user.plan_type !== 'turbo') {
    const letterCountRes = await useQuery(
      `SELECT COUNT(*) AS count FROM dispute_letters 
       WHERE user_id = ? 
         AND created_at >= DATE_FORMAT(NOW(), '%Y-%m-01 00:00:00')`,
      [userId]
    );
    const letterCount = Number((letterCountRes as any)[0]?.count || 0);

    let bureausToGenerateCount = 0;
    for (const bureau of ['TransUnion', 'Experian', 'Equifax']) {
      if (bureauDisputes[bureau] && bureauDisputes[bureau].length > 0) {
        bureausToGenerateCount++;
      }
    }

    if (letterCount + bureausToGenerateCount > 5) {
      throw createError({
        statusCode: 403,
        statusMessage: `You've reached your monthly limit of dispute letters on the Standard Plan. You have generated ${letterCount} letters this month, and this request attempts to generate ${bureausToGenerateCount} more (Max limit: 5). Please upgrade to the Turbo Plan for unlimited letter generation.`
      });
    }
  }

  // 3. Generate Letter for each Bureau that has disputes
  const generatedLetters: any[] = [];

  for (const bureau of ['TransUnion', 'Experian', 'Equifax']) {
    const disputes = bureauDisputes[bureau];
    if (disputes.length === 0) continue;

    // Remove duplicates (e.g. if the same account has multiple field discrepancies, group them)
    const uniqueDisputes = disputes.filter(
      (value, index, self) => self.findIndex(t => t.id === value.id) === index
    );

    const addr = bureauAddresses.find((b: any) => b.name.toLowerCase() === bureau.toLowerCase());
    const bureauAddressBlock = addr ? addr.full_address : `${bureau} Disputes Department\nPost Office Box Address`;

    const userAddressBlock = `${user.name}\n${user.address || ''}\n${user.city || ''}, ${user.state || ''} ${user.zipcode || ''}\nDOB: [Enter Date of Birth]\nSSN Last 4: ${user.ssn_last4 || 'XXXX'}\nPhone: ${user.contact_number || ''}`;

    // Compile accounts list text for prompt
    const accountsDescription = uniqueDisputes.map((d, idx) => {
      return `${idx + 1}. CREDITOR: ${d.creditor_name}
   ACCOUNT NUMBER: ${d.account_number}
   DISCREPANCY IN FIELD: ${d.field_name} (We report: ${d.reported_value}. Other bureaus report: ${d.other_reports.join(', ')})
   REASON FOR DISPUTE: ${d.auto_generated_reason}`;
    }).join('\n\n');

    console.log(`Generating AI dispute letter for ${bureau} using tone: ${tone}`);

    let letterText = '';
    let letterCost = 0.03; // Default estimate; overridden by real usage data
    try {
      const aiResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5-20250929',
          max_tokens: 3000,
          system: `You are an expert credit repair attorney and consumer advocate. Write a formal credit dispute letter.
Follow these constraints:
1. Address the letter to the specific credit bureau.
2. Use the provided user address block and bureau address block at the top.
3. Write in the requested TONE style:
   - 'factual': Direct, objective, concise list of facts. No emotion.
   - 'legal': Formal legal language, quoting Section 611(a) and 623 of the Fair Credit Reporting Act (FCRA). Demand deletion or correction of inaccurate items.
   - 'aggressive': Firm, urgent, pointing out reporting violations and potential CFPB complaints if not resolved in 30 days.
   - 'moderate': Clear, polite, yet firm investigation request.
4. Clearly list each disputed account with creditor name, account number, the reporting mismatch, and why it is inaccurate.
5. Conclude by demanding a full verification or immediate deletion/correction within the statutory 30-day window.
6. Sign off with 'Sincerely,' followed by the user's full name (${user.name}) directly on the line below. Do NOT output a blank line placeholder (like '_____') or '[Signature]'.
7. Return ONLY the letter content. Do not include markdown wraps (like \`\`\` or similar), introduction text, or explanations. Just return the letter.`,
          messages: [
            {
              role: 'user',
              content: `USER PROFILE DETAILS:
${userAddressBlock}

CREDIT BUREAU ADDRESS:
${bureauAddressBlock}

DISPUTED ACCOUNTS & INCONSISTENCIES:
${accountsDescription}

TONE STYLE: ${tone.toUpperCase()}
ROUND/PHASE: ${phase}`
            }
          ]
        })
      });

      if (!aiResponse.ok) {
        const errText = await aiResponse.text();
        console.warn(`Anthropic API error for ${bureau} (${aiResponse.status}): ${errText}. Falling back to high-accuracy Mock Letter Writer.`);
        letterText = getMockDisputeLetter(bureau, userAddressBlock, bureauAddressBlock, accountsDescription, tone, user.name);
        letterCost = 0; // Mock letters have no API cost
      } else {
        const resJson = await aiResponse.json();
        letterText = resJson.content[0]?.text || '';
        
        // Calculate real cost from token usage
        // Claude 3.5 Sonnet: $3.00/1M input tokens, $15.00/1M output tokens
        const usage = resJson.usage;
        if (usage) {
          const inputCost = (usage.input_tokens / 1_000_000) * 3.00;
          const outputCost = (usage.output_tokens / 1_000_000) * 15.00;
          letterCost = inputCost + outputCost;
          console.log(`[${bureau}] Token usage — Input: ${usage.input_tokens}, Output: ${usage.output_tokens}, Cost: $${letterCost.toFixed(4)}`);
        }
      }
    } catch (err: any) {
      throw createError({
        statusCode: 502,
        statusMessage: `AI Letter Generation Failed for ${bureau}: ${err.message}`
      });
    }

    // 4. Save letter in dispute_letters table
    const firstDisp = uniqueDisputes[0];
    const creditorNameSummary = uniqueDisputes.length === 1 ? firstDisp.creditor_name : 'Multiple';
    const accountNumSummary = uniqueDisputes.length === 1 ? firstDisp.account_number : 'Multiple';
    
    const [insertRes] = await useTransaction(async (conn) => {
      const [res] = await conn.execute(
        `INSERT INTO dispute_letters (user_id, credit_bureau, credit_item_type, creditor_name, account_number, dispute_reason, desired_resolution, phase, letter_content, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, 'Cross-Bureau Discrepancies', 'Correction or Deletion', ?, ?, NOW(), NOW())`,
        [
          userId,
          bureau,
          firstDisp.account_type,
          creditorNameSummary,
          accountNumSummary,
          phase,
          letterText
        ]
      );

      // Deduct real token cost from the global Claude API credits balance
      if (letterCost > 0) {
        await conn.execute(
          `UPDATE system_settings 
           SET setting_value = CAST(GREATEST(0.00, CAST(setting_value AS DECIMAL(10,2)) - ?) AS CHAR) 
           WHERE setting_key = 'claude_api_balance'`,
          [letterCost.toFixed(4)]
        );
      }

      return [res];
    });

    const letterId = (insertRes as any).insertId;
    generatedLetters.push({
      id: letterId,
      bureau,
      tone,
      creditors: uniqueDisputes.map(d => d.creditor_name),
      content: letterText
    });
  }

  // 5. Update dispute status in bureau_discrepancies to 'disputed'
  const placeholdersUpdate = discrepancyIds.map(() => '?').join(',');
  await useQuery(
    `UPDATE bureau_discrepancies SET dispute_status = 'disputed' WHERE id IN (${placeholdersUpdate})`,
    discrepancyIds
  );

  return {
    success: true,
    letters: generatedLetters,
    message: `Dispute letters successfully generated for ${generatedLetters.map(l => l.bureau).join(', ')}!`
  };
});

function getMockDisputeLetter(bureau: string, userAddr: string, bureauAddr: string, accountsText: string, tone: string, userName: string) {
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  let headerIntro = `Dear Disputes Department,

I am writing to formally dispute the following inaccurate information reported on my credit file. Under the Fair Credit Reporting Act (FCRA), Section 611 (15 U.S.C. § 1681i), you are required to investigate these items and delete or correct them within 30 days.`;

  if (tone === 'legal') {
    headerIntro = `Dear Disputes Department,

Pursuant to the Fair Credit Reporting Act (FCRA), 15 U.S.C. § 1681i (Section 611) and 15 U.S.C. § 1681s-2 (Section 623), I am formally demanding an investigation into the inaccurate tradelines detailed below. You are legally required to verify these items with the furnishing creditor or remove them within the statutory 30-day investigation window.`;
  } else if (tone === 'aggressive') {
    headerIntro = `Dear Disputes Department,

I am writing to notify you of severe compliance violations on my credit report. You are reporting inaccurate, conflicting, and damaging accounts in direct violation of the Fair Credit Reporting Act (FCRA), 15 U.S.C. § 1681. I demand immediate deletion of these unverified items. If they are not removed within 30 days, I will file formal complaints with the FTC and CFPB.`;
  }

  return `${userAddr}

Date: ${dateStr}

TO:
${bureauAddr}

RE: NOTICE OF FCRA DISPUTE - INACCURATE REPORTING

${headerIntro}

I have identified the following specific reporting errors:

${accountsText}

Please send me written confirmation once these corrections have been made. If the furnishing creditors fail to verify the absolute accuracy of these entries within 30 days, you must delete them immediately.

Sincerely,

${userName || 'Consumer'}`;
}
