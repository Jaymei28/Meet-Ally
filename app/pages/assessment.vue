<template>
  <div class="min-h-screen bg-[#F2F0F7] text-[#15141C] font-sans antialiased flex flex-col justify-between p-4 sm:p-8 no-print">
    <!-- Header Bar -->
    <header class="max-w-4xl mx-auto w-full flex items-center justify-between py-4 border-b border-[#E4E1EE]">
      <NuxtLink to="/" class="flex items-center gap-3 cursor-pointer">
        <img src="/AllyAI.png" alt="Meet Ally" class="h-10 w-auto object-contain" />
        <div>
          <span class="text-base font-black tracking-tight text-[#15141C] block font-serif">Meet Ally</span>
          <span class="text-[9px] font-extrabold text-[#0FA99C] uppercase tracking-widest block">AI Credit Strategist</span>
        </div>
      </NuxtLink>

      <NuxtLink to="/login" class="text-xs font-extrabold text-[#15141C] hover:text-[#0FA99C] transition bg-white px-4 py-2 rounded-xl border border-[#E4E1EE] shadow-xs">
        Client Login
      </NuxtLink>
    </header>

    <!-- Main Container -->
    <main class="max-w-3xl mx-auto w-full my-8">
      
      <!-- INTRO SCREEN -->
      <div v-if="view === 'intro'" class="bg-[#0B0B10] text-white rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 animate-fade-in relative overflow-hidden">
        <div class="space-y-4">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22D3C5]/10 border border-[#22D3C5]/20 text-[#22D3C5] text-[10px] font-extrabold uppercase tracking-widest">
            <span>✨ AI Financial Health Audit</span>
          </div>

          <h1 class="text-3xl sm:text-4xl font-bold font-serif leading-tight text-white">
            Discover What's Holding Your Credit Back
          </h1>
          <p class="text-xs sm:text-sm text-[#A9A6B8] leading-relaxed font-medium max-w-xl">
            Meet Ally analyzes your credit profile using Rasheda’s hard-coded dispute methodology — personal info cleanup, collection validation, charge-off age checks, and tradeline leverage.
          </p>
        </div>

        <!-- Ally Character Teaser -->
        <div class="flex items-center gap-4 p-4 rounded-2xl bg-[#151519] border border-white/10">
          <img src="/AllyAI.png" alt="Ally Strategist" class="h-16 w-auto object-contain shrink-0" />
          <div class="text-xs text-white/90 leading-relaxed font-medium">
            "Answer a few quick questions to generate your personalized action game plan. No AI guessing — just proven statutory credit strategy."
          </div>
        </div>

        <button 
          @click="view = 'questions'"
          class="w-full sm:w-auto px-8 py-4 bg-[#22D3C5] hover:bg-[#0FA99C] text-[#0B0B10] font-black rounded-2xl text-xs sm:text-sm transition duration-200 shadow-xl cursor-pointer uppercase tracking-wider"
        >
          Start My Credit Audit →
        </button>
      </div>

      <!-- QUESTIONS WIZARD -->
      <div v-else-if="view === 'questions'" class="bg-white rounded-3xl p-6 sm:p-10 border border-[#E4E1EE] shadow-xl space-y-8 animate-fade-in">
        
        <!-- Progress Bar -->
        <div class="space-y-2">
          <div class="flex justify-between items-center text-xs font-black text-[#8B879A]">
            <span class="uppercase tracking-widest text-[9px] text-[#0FA99C]">{{ currentQuestion.section }}</span>
            <span>Question {{ currentQuestionIndex + 1 }} of {{ activeQuestions.length }}</span>
          </div>
          <div class="w-full bg-[#F2F0F7] h-2 rounded-full overflow-hidden">
            <div class="bg-[#22D3C5] h-full rounded-full transition-all duration-300" :style="{ width: ((currentQuestionIndex + 1) / activeQuestions.length) * 100 + '%' }"></div>
          </div>
        </div>

        <!-- Current Question Prompt -->
        <div class="space-y-2">
          <h2 class="text-xl sm:text-2xl font-bold font-serif text-[#15141C]">
            {{ currentQuestion.prompt }}
          </h2>
          <p v-if="currentQuestion.sub" class="text-xs text-[#8B879A] font-medium">
            {{ currentQuestion.sub }}
          </p>
        </div>

        <!-- Options Container -->
        <div class="space-y-3">
          <!-- Single Choice -->
          <template v-if="!currentQuestion.multi">
            <button 
              v-for="opt in currentQuestion.options" 
              :key="opt.v"
              @click="answerSingle(currentQuestion.id, opt.v)"
              class="w-full p-4 rounded-2xl border text-left transition duration-200 cursor-pointer flex items-center justify-between group"
              :class="answers[currentQuestion.id] === opt.v ? 'bg-[#15141C] border-[#15141C] text-white shadow-md' : 'bg-white border-[#E4E1EE] text-[#15141C] hover:border-[#22D3C5] hover:bg-[#F2F0F7]/50'"
            >
              <span class="font-bold text-xs sm:text-sm">{{ opt.label }}</span>
              <i class="pi pi-chevron-right text-xs opacity-40 group-hover:translate-x-1 transition"></i>
            </button>
          </template>

          <!-- Multi Choice -->
          <template v-else>
            <label 
              v-for="opt in currentQuestion.options" 
              :key="opt.v"
              @click="toggleMulti(currentQuestion.id, opt.v, opt.exclusive)"
              class="p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition duration-200"
              :class="isMultiSelected(currentQuestion.id, opt.v) ? 'bg-[#15141C] border-[#15141C] text-white shadow-md' : 'bg-white border-[#E4E1EE] text-[#15141C] hover:border-[#22D3C5]'"
            >
              <div class="flex items-center gap-3">
                <div class="w-5 h-5 rounded-md border flex items-center justify-center shrink-0" :class="isMultiSelected(currentQuestion.id, opt.v) ? 'bg-[#22D3C5] border-[#22D3C5] text-[#0B0B10]' : 'border-[#8B879A]'">
                  <i v-if="isMultiSelected(currentQuestion.id, opt.v)" class="pi pi-check text-[10px] font-bold"></i>
                </div>
                <span class="font-bold text-xs sm:text-sm">{{ opt.label }}</span>
              </div>
            </label>

            <button 
              @click="nextQuestion"
              class="mt-4 w-full py-3.5 bg-[#22D3C5] hover:bg-[#0FA99C] text-[#0B0B10] font-black rounded-2xl text-xs uppercase tracking-wider transition shadow-md"
            >
              Continue →
            </button>
          </template>
        </div>

        <!-- Back Button -->
        <div class="pt-4 border-t border-[#E4E1EE]" v-if="currentQuestionIndex > 0">
          <button @click="prevQuestion" class="px-5 py-2.5 bg-[#F2F0F7] hover:bg-[#E4E1EE] text-[#15141C] font-bold rounded-xl text-xs transition">
            ← Back
          </button>
        </div>
      </div>

      <!-- LEAD CAPTURE & FREE ACCOUNT PROVISIONING -->
      <div v-else-if="view === 'capture'" class="bg-white rounded-3xl p-6 sm:p-10 border border-[#E4E1EE] shadow-xl space-y-6 animate-fade-in">
        <div class="space-y-2">
          <span class="text-[10px] font-black text-[#0FA99C] uppercase tracking-widest block">Final Step — Save Audit Results</span>
          <h2 class="text-2xl font-bold font-serif text-[#15141C]">Where should we deliver your credit game plan?</h2>
          <p class="text-xs text-[#8B879A] font-medium leading-relaxed">
            Your results will be automatically saved into your permanent Free Meet Ally Account dashboard.
          </p>
        </div>

        <form @submit.prevent="submitLead" class="space-y-4">
          <div class="space-y-1">
            <label class="text-[10px] font-black uppercase text-[#8B879A] tracking-wider">Full Name *</label>
            <input 
              type="text" 
              v-model="leadData.name" 
              required 
              placeholder="e.g. Rasheda Mills"
              class="w-full px-4 py-3 rounded-xl bg-[#F2F0F7] border border-[#E4E1EE] text-[#15141C] text-xs font-semibold focus:ring-2 focus:ring-[#22D3C5] outline-none"
            />
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-black uppercase text-[#8B879A] tracking-wider">Email Address *</label>
            <input 
              type="email" 
              v-model="leadData.email" 
              required 
              placeholder="e.g. name@example.com"
              class="w-full px-4 py-3 rounded-xl bg-[#F2F0F7] border border-[#E4E1EE] text-[#15141C] text-xs font-semibold focus:ring-2 focus:ring-[#22D3C5] outline-none"
            />
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-black uppercase text-[#8B879A] tracking-wider">Phone Number (Optional)</label>
            <input 
              type="tel" 
              v-model="leadData.phone" 
              placeholder="(555) 000-0000"
              class="w-full px-4 py-3 rounded-xl bg-[#F2F0F7] border border-[#E4E1EE] text-[#15141C] text-xs font-semibold focus:ring-2 focus:ring-[#22D3C5] outline-none"
            />
          </div>

          <div v-if="error" class="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            {{ error }}
          </div>

          <button 
            type="submit" 
            :disabled="loading"
            class="w-full py-4 bg-[#22D3C5] hover:bg-[#0FA99C] text-[#0B0B10] font-black rounded-2xl text-xs uppercase tracking-wider transition duration-200 shadow-xl flex items-center justify-center gap-2 cursor-pointer"
          >
            <i v-if="loading" class="pi pi-spin pi-spinner text-xs"></i>
            <span>{{ loading ? 'Generating AI Strategy & Free Account...' : 'Generate Strategy & Access Free Account →' }}</span>
          </button>
        </form>
      </div>

      <!-- RESULTS & ACTION ROADMAP VIEW -->
      <div v-else-if="view === 'results'" class="space-y-6 animate-fade-in">
        <!-- Top Hero Result Banner -->
        <div class="bg-[#0B0B10] text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl relative overflow-hidden">
          <div class="flex items-center justify-between">
            <span class="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-[#22D3C5]/20 text-[#22D3C5] border border-[#22D3C5]/30">
              Free Account Auto-Created
            </span>
            <span class="text-xs font-bold text-[#A9A6B8]">Client: {{ leadData.name }}</span>
          </div>

          <h2 class="text-2xl sm:text-3xl font-bold font-serif text-white leading-tight">
            Your Audit Game Plan Is Ready
          </h2>
          <p class="text-xs text-[#A9A6B8] leading-relaxed font-medium max-w-xl">
            We identified {{ calculatedFindings.length }} strategic action items based on Rasheda's credit repair methodology.
          </p>

          <div class="pt-2 flex items-center gap-3">
            <NuxtLink 
              to="/" 
              class="px-6 py-3 bg-[#22D3C5] hover:bg-[#0FA99C] text-[#0B0B10] font-black rounded-2xl text-xs transition duration-200 shadow-xl cursor-pointer"
            >
              Go Directly to My Free Dashboard →
            </NuxtLink>
          </div>
        </div>

        <!-- Audit Findings List -->
        <div class="space-y-4">
          <h3 class="text-xs font-black uppercase tracking-widest text-[#8B879A]">Identified Action Steps</h3>
          
          <div class="space-y-3">
            <div 
              v-for="(item, idx) in calculatedFindings" 
              :key="idx"
              class="p-5 rounded-2xl bg-white border border-[#E4E1EE] space-y-2 shadow-xs"
            >
              <div class="flex items-center justify-between gap-2">
                <span class="text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#22D3C5]/10 text-[#0FA99C]">
                  {{ item.tag }}
                </span>
                <span class="text-[10px] font-bold text-[#8B879A]">{{ item.timeline }}</span>
              </div>
              <h4 class="text-sm font-bold text-[#15141C] font-serif">{{ item.title }}</h4>
              <p class="text-xs text-[#3A3844] leading-relaxed font-medium">{{ item.why }}</p>
            </div>
          </div>
        </div>

        <!-- The 3 Core Upgrade Options -->
        <div class="p-6 rounded-3xl bg-[#0B0B10] text-white space-y-4 shadow-xl">
          <h3 class="text-sm font-bold text-white font-serif">Upgrade Options to Execute Your Plan</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <!-- 1. DIY Ally Engine -->
            <a 
              :href="CTA_LINKS.diy" 
              target="_blank" 
              rel="noopener noreferrer"
              class="p-4 rounded-2xl bg-[#151519] border border-white/10 hover:border-[#22D3C5] transition space-y-1 block group"
            >
              <div class="flex justify-between items-center">
                <span class="font-black text-xs text-[#22D3C5]">1. Use DIY Ally Engine</span>
                <i class="pi pi-arrow-right text-xs text-[#22D3C5] group-hover:translate-x-1 transition"></i>
              </div>
              <p class="text-[11px] text-[#A9A6B8]">Upload report & draft FCRA deletion letters ($29.99 Turbo).</p>
            </a>

            <!-- 2. 1-on-1 Strategy Call -->
            <a 
              :href="CTA_LINKS.powerPlan" 
              target="_blank" 
              rel="noopener noreferrer"
              class="p-4 rounded-2xl bg-[#151519] border border-white/10 hover:border-amber-400 transition space-y-1 block group"
            >
              <div class="flex justify-between items-center">
                <span class="font-black text-xs text-amber-300">2. Book 1-on-1 Strategy Call</span>
                <i class="pi pi-calendar text-xs text-amber-300 group-hover:translate-x-1 transition"></i>
              </div>
              <p class="text-[11px] text-[#A9A6B8]">Book a personal consultation call with a credit strategist.</p>
            </a>

            <!-- 3. Work with Credit Remedi -->
            <a 
              :href="CTA_LINKS.team" 
              target="_blank" 
              rel="noopener noreferrer"
              class="p-4 rounded-2xl bg-[#151519] border border-white/10 hover:border-emerald-400 transition space-y-1 block group"
            >
              <div class="flex justify-between items-center">
                <span class="font-black text-xs text-emerald-400">3. Work with Credit Remedi</span>
                <i class="pi pi-external-link text-xs text-emerald-400 group-hover:translate-x-1 transition"></i>
              </div>
              <p class="text-[11px] text-[#A9A6B8]">Full-service credit repair & done-for-you dispute management.</p>
            </a>
          </div>
        </div>

      </div>
    </main>

    <!-- Footer -->
    <footer class="max-w-4xl mx-auto w-full text-center py-4 border-t border-[#E4E1EE] text-[10px] text-[#8B879A] font-semibold no-print">
      © {{ new Date().getFullYear() }} Credit Remedi · Meet Ally AI Credit Engine. Registered Support: help@creditremedi.com
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';

definePageMeta({ layout: false });

const view = ref('intro'); // 'intro' | 'questions' | 'capture' | 'results'
const currentQuestionIndex = ref(0);
const loading = ref(false);
const error = ref('');

const CTA_LINKS = {
  diy: "https://remedicredit.com/plans",
  powerPlan: "https://pci.jotform.com/form/240096301428046",
  team: "https://www.creditremedi.store"
};

const GHL_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/7rjBToyV0KOYs53VHTvR/webhook-trigger/65b4c880-8d8b-48fe-9917-2265cf298347";

const answers = reactive({
  score: 'sub580',
  goal: 'home',
  identifiers: ['namevar', 'oldaddr'],
  negatives: ['collections', 'chargeoffs'],
  co_count: 'one',
  co_status: 'remarked',
  late_count: 'one_two',
  utilization: '30to70',
  mix: '1to2'
});

const leadData = reactive({
  name: '',
  email: '',
  phone: ''
});

const QUESTIONS = [
  {
    id: "score", section: "BASELINE",
    prompt: "Where does your credit score sit right now?",
    sub: "A ballpark is fine — this calibrates everything else.",
    options: [
      { v: "unknown", label: "Honestly not sure" },
      { v: "sub580",  label: "Below 580" },
      { v: "580_669", label: "580 – 669" },
      { v: "670_739", label: "670 – 739" },
      { v: "740plus", label: "740 or above" },
    ],
  },
  {
    id: "goal", section: "YOUR GOAL",
    prompt: "What's your #1 credit goal in the next 12 months?",
    sub: "Your plan changes depending on your goal.",
    options: [
      { v: "home",    label: "Buy a home" },
      { v: "funding", label: "Business funding & higher limits" },
      { v: "auto",    label: "Vehicle at a better rate" },
      { v: "health",  label: "Stronger, cleaner profile overall" },
    ],
  },
  {
    id: "identifiers", section: "PERSONAL INFO", multi: true,
    prompt: "Does your report show any of this?",
    sub: "This is where every audit starts — before touching a single account.",
    options: [
      { v: "namevar",  label: "Name variations (middle initial, nicknames, etc.)" },
      { v: "oldaddr",  label: "Old or unfamiliar addresses" },
      { v: "otherid",  label: "Wrong employer, phone, or email on file" },
      { v: "none",     label: "None that I've noticed", exclusive: true },
    ],
  },
  {
    id: "negatives", section: "YOUR REPORT", multi: true,
    prompt: "What negative items are currently on your report?",
    sub: "Select all that apply — no judgment, just data.",
    options: [
      { v: "collections", label: "Collections" },
      { v: "chargeoffs",  label: "Charge-offs" },
      { v: "lates",       label: "Late payments" },
      { v: "repo",        label: "Repossession" },
      { v: "inquiries",   label: "Excessive hard inquiries" },
      { v: "none",        label: "None / not sure", exclusive: true },
    ],
  },
  {
    id: "co_count", section: "YOUR REPORT",
    showIf: (a) => a.negatives?.includes("chargeoffs"),
    prompt: "How many charge-offs are on your report?",
    sub: "This changes whether we can give you one answer or several.",
    options: [
      { v: "one",       label: "Just one" },
      { v: "two_plus",  label: "Two or more" },
    ],
  },
  {
    id: "co_status", section: "YOUR REPORT",
    showIf: (a) => a.negatives?.includes("chargeoffs") && a.co_count === "one",
    prompt: "What's happening with that charge-off?",
    sub: "This single answer decides whether we dispute it or leave it alone.",
    options: [
      { v: "under6",      label: "Charged off in the last 6 months" },
      { v: "remarked",    label: "My report says it was written off as a loss" },
      { v: "stopped",     label: "Older, and reporting has stopped updating" },
      { v: "activeold",   label: "Older, but still updating every month" },
      { v: "unsure",      label: "Not sure — haven't checked closely" },
    ],
  },
  {
    id: "late_count", section: "YOUR REPORT",
    showIf: (a) => a.negatives?.includes("lates"),
    prompt: "On your worst account, how many late payments show?",
    sub: "The number changes the entire approach.",
    options: [
      { v: "one_two",  label: "1 – 2 lates" },
      { v: "three_plus", label: "3 or more lates" },
    ],
  },
  {
    id: "utilization", section: "YOUR LEVERS",
    prompt: "How much of your credit card limits are you currently using?",
    sub: "One of the fastest-moving factors in your score.",
    options: [
      { v: "nocards", label: "I don't have open credit cards" },
      { v: "under10", label: "Under 10%" },
      { v: "10to30",  label: "10% – 30%" },
      { v: "30to70",  label: "30% – 70%" },
      { v: "maxed",   label: "Near maxed out" },
    ],
  },
  {
    id: "mix", section: "YOUR LEVERS",
    prompt: "How many accounts are reporting positively right now?",
    sub: "You can't dispute your way to a strong profile — you have to build one too.",
    options: [
      { v: "none",  label: "None" },
      { v: "1to2",  label: "1 – 2 accounts" },
      { v: "3plus", label: "3 or more" },
    ],
  },
];

const activeQuestions = computed(() => {
  return QUESTIONS.filter(q => !q.showIf || q.showIf(answers));
});

const currentQuestion = computed(() => {
  return activeQuestions.value[currentQuestionIndex.value] || QUESTIONS[0];
});

function answerSingle(id, val) {
  answers[id] = val;
  nextQuestion();
}

function isMultiSelected(id, val) {
  const current = answers[id] || [];
  return current.includes(val);
}

function toggleMulti(id, val, exclusive) {
  let current = Array.isArray(answers[id]) ? [...answers[id]] : [];
  if (exclusive) {
    answers[id] = [val];
    return;
  }
  current = current.filter(x => x !== 'none');
  if (current.includes(val)) {
    current = current.filter(x => x !== val);
  } else {
    current.push(val);
  }
  answers[id] = current;
}

function nextQuestion() {
  if (currentQuestionIndex.value < activeQuestions.value.length - 1) {
    currentQuestionIndex.value++;
  } else {
    view.value = 'capture';
  }
}

function prevQuestion() {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
  }
}

const calculatedFindings = computed(() => {
  const f = [];
  const neg = answers.negatives || [];
  const ids = answers.identifiers || [];

  if (ids.includes("namevar") || ids.includes("oldaddr") || ids.includes("otherid")) {
    f.push({
      tag: "PERSONAL INFO — FIX FIRST", timeline: "Step 1",
      title: "Clean up your personal info before anything else",
      why: "Fixing name variations and outdated addresses comes before touching any negative account. Unifying personal info weakens the creditor's reporting accuracy."
    });
  }

  if (neg.includes("collections")) {
    f.push({
      tag: "COLLECTIONS — CHALLENGE THESE", timeline: "Step 2",
      title: "Challenge your collection accounts — your easiest win",
      why: "Collection debt buyers often lack full statutory assignment paperwork required by FCRA § 611 and FDCPA § 809."
    });
  }

  if (neg.includes("inquiries")) {
    f.push({
      tag: "INQUIRIES — CHALLENGE EARLY", timeline: "Step 1",
      title: "Challenge hard inquiries alongside personal info",
      why: "Unattached inquiries without open tradelines are challenged early to unburden your file."
    });
  }

  if (neg.includes("chargeoffs")) {
    if (answers.co_count === "two_plus") {
      f.push({
        tag: "MULTIPLE CHARGE-OFFS", timeline: "Individual Review",
        title: "Each charge-off requires account-by-account strategy",
        why: "Charge-offs vary by age and reporting status. Each account receives an individualized legal dispute plan."
      });
    } else if (answers.co_status === "remarked" || answers.co_status === "stopped") {
      f.push({
        tag: "CHARGE-OFF — CHALLENGE IT", timeline: "Ready to dispute",
        title: "Your written-off charge-off is ready to dispute",
        why: "Static charge-offs written off as a loss provide ideal grounds for accuracy disputes under FCRA regulations."
      });
    }
  }

  if (answers.utilization === "maxed" || answers.utilization === "30to70") {
    f.push({
      tag: "CARD BALANCES — FAST WIN", timeline: "~30 days",
      title: "Pay down revolving balances to unlock fast score jumps",
      why: "Lowering credit utilization below 10-30% yields immediate score improvements on the next reporting cycle."
    });
  }

  return f;
});

async function submitLead() {
  loading.value = true;
  error.value = '';

  try {
    // 1. Fire to Rasheda's GHL Inbound Webhook
    if (GHL_WEBHOOK_URL) {
      try {
        await $fetch(GHL_WEBHOOK_URL, {
          method: 'POST',
          body: {
            name: leadData.name,
            email: leadData.email,
            phone: leadData.phone,
            answers: answers,
            findings: calculatedFindings.value,
            source: 'Meet Ally Financial Health Audit v4'
          }
        });
      } catch (ghlErr) {
        console.warn('GHL Webhook notification notice:', ghlErr.message);
      }
    }

    // 2. Submit to Meet Ally Internal API (Auto-Provisions Free Account)
    const res = await $fetch('/api/assessment/submit', {
      method: 'POST',
      body: {
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        score_range: answers.score,
        primary_goal: answers.goal,
        has_collections: answers.negatives.includes('collections'),
        has_late_payments: answers.negatives.includes('lates'),
        has_inquiries: answers.negatives.includes('inquiries'),
        has_chargeoffs: answers.negatives.includes('chargeoffs'),
        assessment_details: answers
      }
    });

    if (res.success) {
      view.value = 'results';
    } else {
      error.value = 'Failed to generate strategy.';
    }
  } catch (err) {
    error.value = err.data?.statusMessage || err.message || 'An error occurred during submission.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
