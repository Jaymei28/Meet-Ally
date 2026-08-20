<template>
  <div class="space-y-6 max-w-6xl mx-auto pb-12">
    
    <!-- Hero Header Banner -->
    <div class="bg-gradient-to-r from-[#005F6A] via-[#00828E] to-[#00A3B0] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
      <div class="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
      <div class="relative z-10 space-y-2">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-teal-100 border border-white/20">
          <i class="pi pi-book text-xs"></i>
          <span>Knowledge & Compliance Hub</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-black tracking-tight">Resource Center</h1>
        <p class="text-teal-50 text-xs sm:text-sm font-medium max-w-2xl leading-relaxed">
          Master federal consumer protection laws (FCRA, FDCPA), access direct credit bureau directories, download dispute checklists, and follow proven credit rebuilding strategies.
        </p>
      </div>
    </div>

    <!-- Category Tabs Navigation -->
    <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="activeTab = tab.id"
        class="px-4 py-2.5 rounded-2xl text-xs font-bold transition duration-200 flex items-center gap-2 whitespace-nowrap cursor-pointer shrink-0 shadow-xs"
        :class="activeTab === tab.id 
          ? 'bg-neutral-900 text-white font-extrabold shadow-sm' 
          : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50 hover:text-neutral-900'"
      >
        <i :class="[tab.icon, 'text-xs']"></i>
        <span>{{ tab.name }}</span>
      </button>
    </div>

    <!-- TAB 1: CONSUMER PROTECTION LAWS (FCRA / FDCPA / GLBA) -->
    <div v-if="activeTab === 'laws' || activeTab === 'all'" class="space-y-4">
      <div class="space-y-1">
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="text-base sm:text-lg font-black text-neutral-900 tracking-tight">Federal Consumer Protection Laws</h2>
          <span class="text-[10px] font-extrabold bg-[#00828E]/10 text-[#00828E] px-2.5 py-0.5 rounded-full border border-[#00828E]/20 whitespace-nowrap">4 Statutes</span>
        </div>
        <p class="text-xs text-neutral-500 font-semibold">Statutory legal codes that empower consumers to dispute inaccurate or unverifiable data.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          v-for="law in consumerLaws" 
          :key="law.code"
          class="bg-white border border-neutral-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm hover:border-[#00A3B0]/40 transition duration-200 flex flex-col justify-between"
        >
          <div class="space-y-2.5">
            <div class="flex items-start justify-between gap-2">
              <span class="px-2.5 py-1 bg-neutral-100 text-neutral-700 text-[10px] font-black uppercase rounded-lg border border-neutral-200">
                {{ law.code }}
              </span>
              <span class="text-[10px] font-bold text-neutral-400 font-mono">{{ law.citation }}</span>
            </div>
            <h3 class="text-sm font-black text-neutral-900">{{ law.title }}</h3>
            <p class="text-xs text-neutral-600 font-medium leading-relaxed">{{ law.summary }}</p>
          </div>

          <div class="pt-3 border-t border-neutral-100 flex items-center justify-between">
            <span class="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
              <i class="pi pi-shield text-[10px]"></i> {{ law.benefit }}
            </span>
            <button 
              @click="copyCitation(law.citationText)"
              class="text-[10px] font-extrabold text-[#00828E] hover:text-[#005F6A] flex items-center gap-1 cursor-pointer"
            >
              <i class="pi pi-copy text-[10px]"></i>
              <span>Copy Citation</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: CREDIT BUREAU DIRECTORY -->
    <div v-if="activeTab === 'bureaus' || activeTab === 'all'" class="space-y-4 pt-2">
      <div class="space-y-1">
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="text-base sm:text-lg font-black text-neutral-900 tracking-tight">Bureau Mailing & Dispute Directory</h2>
          <span class="text-[10px] font-extrabold bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full border border-amber-200 whitespace-nowrap">Certified Mail</span>
        </div>
        <p class="text-xs text-neutral-500 font-semibold">Official verified postal addresses, phone numbers, and online dispute portals.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          v-for="bureau in bureaus" 
          :key="bureau.name"
          class="bg-white border border-neutral-200 rounded-3xl p-5 space-y-4 shadow-sm hover:border-[#00828E]/40 transition flex flex-col justify-between"
        >
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-black px-2.5 py-0.5 rounded-full text-white" :class="bureau.bgClass">
                {{ bureau.name }}
              </span>
              <span class="text-[10px] font-bold text-neutral-400">{{ bureau.category }}</span>
            </div>

            <div class="space-y-1.5 text-xs">
              <div class="space-y-0.5">
                <span class="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">Dispute Mailing Address:</span>
                <p class="font-semibold text-neutral-800 leading-snug whitespace-pre-line bg-neutral-50 p-2.5 rounded-xl border border-neutral-200 font-mono text-[11px] select-all">
                  {{ bureau.address }}
                </p>
              </div>

              <div class="flex items-center justify-between pt-1">
                <span class="text-[10px] text-neutral-500 font-bold">Support Phone:</span>
                <span class="font-bold text-neutral-900 text-xs font-mono">{{ bureau.phone }}</span>
              </div>
            </div>
          </div>

          <div class="pt-2 border-t border-neutral-100">
            <a 
              :href="bureau.onlineUrl" 
              target="_blank" 
              rel="noopener noreferrer"
              class="w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <span>Online Portal</span>
              <i class="pi pi-external-link text-[10px]"></i>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 3: DISPUTE STRATEGY PLAYBOOK -->
    <div v-if="activeTab === 'strategy' || activeTab === 'all'" class="space-y-4 pt-2">
      <div>
        <h2 class="text-lg font-black text-neutral-900 tracking-tight">Dispute Strategy Playbook</h2>
        <p class="text-xs text-neutral-500 font-semibold">Step-by-step 3-phase methodology executed by AI Credit Strategist.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <!-- Phase 1 Card -->
        <div class="bg-white border border-teal-200 rounded-3xl p-5 space-y-3 shadow-sm relative overflow-hidden">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#00828E] text-white">Phase 1: Days 1–30</span>
            <i class="pi pi-filter text-teal-600 text-sm"></i>
          </div>
          <h3 class="text-sm font-black text-neutral-900">Clean & Challenge</h3>
          <p class="text-xs text-neutral-600 font-medium leading-relaxed">
            Audit and cleanse all name spelling variations, obsolete previous addresses, unverified phone records, and unattached hard inquiries.
          </p>
          <div class="p-2.5 rounded-xl bg-teal-50 text-[11px] font-semibold text-[#005F6A] space-y-1">
            <p><strong>Goal:</strong> Break bureau automated matching linkages before disputing major accounts.</p>
          </div>
        </div>

        <!-- Phase 2 Card -->
        <div class="bg-white border border-neutral-200 rounded-3xl p-5 space-y-3 shadow-sm relative overflow-hidden">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-neutral-900 text-white">Phase 2: Days 31–60</span>
            <i class="pi pi-shield text-neutral-700 text-sm"></i>
          </div>
          <h3 class="text-sm font-black text-neutral-900">Core Factual Battle</h3>
          <p class="text-xs text-neutral-600 font-medium leading-relaxed">
            Target charge-offs, third-party collections, repossession entries, and discrepancies across bureaus using precise FCRA § 611 and § 623 grounds.
          </p>
          <div class="p-2.5 rounded-xl bg-neutral-100 text-[11px] font-semibold text-neutral-700 space-y-1">
            <p><strong>Goal:</strong> Demand complete validation or statutory deletion of non-compliant tradelines.</p>
          </div>
        </div>

        <!-- Phase 3 Card -->
        <div class="bg-white border border-neutral-200 rounded-3xl p-5 space-y-3 shadow-sm relative overflow-hidden">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-indigo-600 text-white">Phase 3: Days 61–90</span>
            <i class="pi pi-star text-indigo-600 text-sm"></i>
          </div>
          <h3 class="text-sm font-black text-neutral-900">Goodwill & Polish</h3>
          <p class="text-xs text-neutral-600 font-medium leading-relaxed">
            Send Method of Verification (MOV) requests for uncorrected items, goodwill adjustments for historical late payments, and CFPB agency escalations.
          </p>
          <div class="p-2.5 rounded-xl bg-indigo-50 text-[11px] font-semibold text-indigo-800 space-y-1">
            <p><strong>Goal:</strong> Finalize tradeline updates and unlock maximum FICO fundability rating.</p>
          </div>
        </div>

      </div>
    </div>

    <!-- TAB 4: FAQS ACCORDION -->
    <div v-if="activeTab === 'faqs' || activeTab === 'all'" class="space-y-4 pt-2">
      <div>
        <h2 class="text-lg font-black text-neutral-900 tracking-tight">Frequently Asked Questions</h2>
        <p class="text-xs text-neutral-500 font-semibold">Answers to common credit restoration, timing, and legal questions.</p>
      </div>

      <div class="space-y-3">
        <div 
          v-for="(faq, idx) in faqs" 
          :key="idx"
          class="bg-white border border-neutral-200 rounded-2xl overflow-hidden transition duration-200"
        >
          <button 
            @click="faq.open = !faq.open"
            class="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left font-extrabold text-xs sm:text-sm text-neutral-800 hover:bg-neutral-50 transition cursor-pointer"
          >
            <span>{{ faq.question }}</span>
            <i :class="['pi', faq.open ? 'pi-chevron-up text-[#00828E]' : 'pi-chevron-down text-neutral-400', 'text-xs shrink-0']"></i>
          </button>
          <div v-if="faq.open" class="px-5 pb-5 pt-1 text-xs text-neutral-600 font-medium leading-relaxed border-t border-neutral-100 bg-neutral-50/50">
            {{ faq.answer }}
          </div>
        </div>
      </div>
    </div>

    <!-- Need Help / Support Banner -->
    <div class="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      <div class="flex items-center gap-3.5">
        <div class="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[#00828E] shrink-0">
          <i class="pi pi-comments text-xl"></i>
        </div>
        <div>
          <h4 class="text-sm font-black text-neutral-900">Have Questions or Need Additional Guidance?</h4>
          <p class="text-xs text-neutral-500 font-semibold">Our dedicated support specialists and compliance team are available to help.</p>
        </div>
      </div>
      <a 
        href="mailto:help@creditremedi.com?subject=Meet%20Ally%20Support%20Inquiry" 
        class="px-5 py-2.5 bg-gradient-to-r from-[#00828E] to-[#00A3B0] text-white font-extrabold rounded-xl hover:from-[#005F6A] hover:to-[#00828E] transition text-xs flex items-center gap-2 shadow-xs shrink-0 cursor-pointer"
      >
        <i class="pi pi-envelope text-xs"></i>
        <span>Contact help@creditremedi.com</span>
      </a>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';

const activeTab = ref('all');

const tabs = [
  { id: 'all', name: 'All Resources', icon: 'pi pi-th-large' },
  { id: 'laws', name: 'Consumer Laws', icon: 'pi pi-balance-scale' },
  { id: 'bureaus', name: 'Bureau Directory', icon: 'pi pi-building' },
  { id: 'strategy', name: 'Dispute Playbook', icon: 'pi pi-map' },
  { id: 'faqs', name: 'FAQs', icon: 'pi pi-question-circle' }
];

const consumerLaws = [
  {
    code: 'FCRA § 611',
    citation: '15 U.S.C. § 1681i',
    title: 'Procedure in Case of Disputed Accuracy',
    summary: 'Mandates that credit reporting agencies must conduct a prompt investigation and verify or delete disputed items within 30 days of receiving consumer notice.',
    benefit: 'Mandatory 30-day deletion rule',
    citationText: 'Pursuant to the Fair Credit Reporting Act, 15 U.S.C. § 1681i(a)(1), you are required to conduct a reasonable reinvestigation within 30 days and promptly delete any information found to be inaccurate, incomplete, or unverifiable.'
  },
  {
    code: 'FCRA § 623',
    citation: '15 U.S.C. § 1681s-2',
    title: 'Responsibilities of Furnishers of Information',
    summary: 'Prohibits banks and collection agencies from reporting information they have reason to know is inaccurate, and requires them to investigate disputed items directly.',
    benefit: 'Furnisher verification duty',
    citationText: 'Under 15 U.S.C. § 1681s-2(b), upon receipt of a dispute, furnishers are legally obligated to review all relevant information, complete an investigation, and report the results to the consumer reporting agencies.'
  },
  {
    code: 'FDCPA § 809',
    citation: '15 U.S.C. § 1692g',
    title: 'Validation of Debts by Collection Agencies',
    summary: 'If a consumer disputes a debt within 30 days of notice, the debt collector must cease all collection activities until they verify and mail written verification of the debt.',
    benefit: 'Debt collection freeze upon dispute',
    citationText: 'Under the Fair Debt Collection Practices Act, 15 U.S.C. § 1692g(b), you must cease collection of the debt until you obtain and mail verification of the debt or a copy of a judgment to the consumer.'
  },
  {
    code: 'FCRA § 605B',
    citation: '15 U.S.C. § 1681c-2',
    title: 'Block of Information Resulting from Identity Theft',
    summary: 'Requires credit bureaus to block the reporting of any fraudulent tradeline or inquiry within 4 business days after receiving an official identity theft report.',
    benefit: '4-day rapid fraud tradeline block',
    citationText: 'Pursuant to 15 U.S.C. § 1681c-2, consumer reporting agencies shall block the reporting of any information identified as resulting from identity theft within 4 business days of receipt of proper documentation.'
  }
];

const bureaus = [
  {
    name: 'Equifax',
    category: 'Major Bureau',
    bgClass: 'bg-[#C8102E]',
    address: 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374-0256',
    phone: '1-866-349-5191',
    onlineUrl: 'https://www.equifax.com/personal/disputes/'
  },
  {
    name: 'Experian',
    category: 'Major Bureau',
    bgClass: 'bg-[#002D62]',
    address: 'Experian Dispute Department\nP.O. Box 4500\nAllen, TX 75013',
    phone: '1-888-397-3742',
    onlineUrl: 'https://www.experian.com/disputes/main.html'
  },
  {
    name: 'TransUnion',
    category: 'Major Bureau',
    bgClass: 'bg-[#00A3E0]',
    address: 'TransUnion Consumer Solutions\nP.O. Box 2000\nChester, PA 19016-2000',
    phone: '1-800-916-8800',
    onlineUrl: 'https://www.transunion.com/credit-disputes/dispute-your-credit'
  }
];

const faqs = ref([
  {
    question: 'How long do credit reporting agencies have to respond to dispute letters?',
    answer: 'Under FCRA § 611 (15 U.S.C. § 1681i), credit bureaus have 30 calendar days from the date they receive your dispute to investigate and respond. If they fail to provide verified proof within this statutory window, the disputed tradeline must be permanently removed.',
    open: true
  },
  {
    question: 'Why should I send dispute letters via Certified Mail with Return Receipt?',
    answer: 'Certified Mail with Return Receipt provides legal, time-stamped proof of delivery signed by bureau personnel. This establishes the exact 30-day countdown clock for statutory compliance under federal law.',
    open: false
  },
  {
    question: 'What is the difference between a Hard Inquiry and a Soft Inquiry?',
    answer: 'A Hard Inquiry occurs when a lender checks your credit for a lending decision (such as a mortgage or auto loan) and can impact your score for 12 months. A Soft Inquiry (such as checking your own score or pre-approvals) has zero impact on your credit score.',
    open: false
  },
  {
    question: 'Will paying off an old charged-off account automatically delete it?',
    answer: 'No. Paying a charged-off account or collection typically updates the status to "Paid Collection" or "Paid Charge-Off", but the negative historical mark remains unless successfully disputed for reporting errors or negotiated via a pay-for-delete agreement.',
    open: false
  }
]);

function copyCitation(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
    alert('Citation copied to clipboard!');
  }
}
</script>
