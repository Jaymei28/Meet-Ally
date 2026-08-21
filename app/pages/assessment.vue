<template>
  <div class="min-h-screen bg-neutral-900 text-white flex flex-col justify-between p-4 sm:p-8 no-print">
    <!-- Header Bar -->
    <header class="max-w-4xl mx-auto w-full flex items-center justify-between py-4 border-b border-white/10">
      <NuxtLink to="/" class="flex items-center gap-2.5 cursor-pointer">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00828E] to-[#00A3B0] p-1 flex items-center justify-center shadow-md">
          <img src="/AllyAI.png" alt="AI Credit Strategist" class="w-full h-full object-contain" />
        </div>
        <div>
          <span class="text-base font-black tracking-tight text-white block">Meet Ally</span>
          <span class="text-[9px] font-extrabold text-[#00D8E6] uppercase tracking-widest block">AI Credit Strategist</span>
        </div>
      </NuxtLink>

      <NuxtLink to="/login" class="text-xs font-bold text-teal-100 hover:text-white transition bg-white/10 px-4 py-2 rounded-xl border border-white/15">
        Client Login
      </NuxtLink>
    </header>

    <!-- Main Container -->
    <main class="max-w-2xl mx-auto w-full my-8">
      
      <!-- WIZARD STEP VIEWS (Before Submission) -->
      <div v-if="!submitted" class="bg-white/5 border border-white/15 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl space-y-8 animate-fade-in">
        <!-- Progress Bar -->
        <div class="space-y-2">
          <div class="flex justify-between items-center text-xs font-extrabold text-teal-100">
            <span class="uppercase tracking-widest text-[10px]">Free Credit Audit Wizard</span>
            <span>Step {{ step }} of 4</span>
          </div>
          <div class="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <div class="bg-gradient-to-r from-[#00828E] to-[#00D8E6] h-full rounded-full transition-all duration-300" :style="{ width: (step / 4) * 100 + '%' }"></div>
          </div>
        </div>

        <!-- STEP 1: SCORE RANGE -->
        <div v-if="step === 1" class="space-y-6 animate-fade-in">
          <div class="space-y-2">
            <span class="text-[10px] font-black text-[#00D8E6] uppercase tracking-widest block">Step 1 — Baseline Check</span>
            <h2 class="text-2xl font-black text-white tracking-tight">What is your current estimated credit score?</h2>
            <p class="text-xs text-neutral-400 font-medium">Select your estimated credit score range to calibrate your audit strategy.</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button 
              v-for="range in scoreRanges" 
              :key="range.value"
              @click="selectScoreRange(range.value)"
              class="p-4 rounded-2xl border text-left transition duration-200 cursor-pointer flex items-center justify-between group"
              :class="formData.score_range === range.value ? 'bg-[#00828E] border-[#00D8E6] text-white shadow-lg' : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'"
            >
              <div>
                <span class="font-extrabold text-sm block">{{ range.label }}</span>
                <span class="text-[10px] opacity-80 font-medium block mt-0.5">{{ range.desc }}</span>
              </div>
              <i class="pi pi-chevron-right text-xs opacity-60 group-hover:translate-x-1 transition"></i>
            </button>
          </div>
        </div>

        <!-- STEP 2: NEGATIVE ITEMS -->
        <div v-if="step === 2" class="space-y-6 animate-fade-in">
          <div class="space-y-2">
            <span class="text-[10px] font-black text-[#00D8E6] uppercase tracking-widest block">Step 2 — Negative Derogatory Audit</span>
            <h2 class="text-2xl font-black text-white tracking-tight">Which items are currently affecting your credit?</h2>
            <p class="text-xs text-neutral-400 font-medium">Check all negative items appearing on your Equifax, Experian, or TransUnion reports.</p>
          </div>

          <div class="space-y-2.5">
            <label 
              v-for="item in negativeOptions" 
              :key="item.key"
              class="p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition duration-200"
              :class="formData[item.key] ? 'bg-[#00828E]/40 border-[#00D8E6] text-white' : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'"
            >
              <div class="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  v-model="formData[item.key]" 
                  class="rounded text-[#00D8E6] focus:ring-[#00D8E6] h-4 w-4 shrink-0"
                />
                <div>
                  <span class="font-extrabold text-xs block">{{ item.label }}</span>
                  <span class="text-[10px] text-neutral-400 block mt-0.5">{{ item.desc }}</span>
                </div>
              </div>
              <i :class="['pi', item.icon, 'text-sm text-[#00D8E6]']"></i>
            </label>
          </div>

          <div class="flex justify-between pt-4 border-t border-white/10">
            <button @click="step--" class="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl text-xs transition">
              Back
            </button>
            <button @click="step++" class="px-6 py-2.5 bg-gradient-to-r from-[#00828E] to-[#00A3B0] text-white font-extrabold rounded-xl text-xs shadow-md transition hover:from-[#005F6A] hover:to-[#00828E]">
              Continue →
            </button>
          </div>
        </div>

        <!-- STEP 3: PRIMARY GOAL -->
        <div v-if="step === 3" class="space-y-6 animate-fade-in">
          <div class="space-y-2">
            <span class="text-[10px] font-black text-[#00D8E6] uppercase tracking-widest block">Step 3 — Target Goal</span>
            <h2 class="text-2xl font-black text-white tracking-tight">What is your primary financial goal?</h2>
            <p class="text-xs text-neutral-400 font-medium">Ally customizes your dispute sequence based on your target outcome.</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button 
              v-for="goal in goals" 
              :key="goal"
              @click="selectGoal(goal)"
              class="p-4 rounded-2xl border text-left transition duration-200 cursor-pointer flex items-center justify-between group"
              :class="formData.primary_goal === goal ? 'bg-[#00828E] border-[#00D8E6] text-white shadow-lg' : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'"
            >
              <span class="font-extrabold text-xs leading-snug">{{ goal }}</span>
              <i class="pi pi-[#00D8E6] pi-check text-xs" v-if="formData.primary_goal === goal"></i>
            </button>
          </div>

          <div class="flex justify-start pt-4 border-t border-white/10">
            <button @click="step--" class="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl text-xs transition">
              Back
            </button>
          </div>
        </div>

        <!-- STEP 4: CONTACT & FREE ACCOUNT CREATION -->
        <div v-if="step === 4" class="space-y-6 animate-fade-in">
          <div class="space-y-2">
            <span class="text-[10px] font-black text-[#00D8E6] uppercase tracking-widest block">Final Step — Generate & Save Strategy</span>
            <h2 class="text-2xl font-black text-white tracking-tight">Where should we deliver & save your AI Game Plan?</h2>
            <p class="text-xs text-neutral-400 font-medium">Your customized audit results will be automatically saved into your permanent Free Meet Ally Account.</p>
          </div>

          <form @submit.prevent="submitAssessment" class="space-y-4">
            <div class="space-y-1">
              <label class="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Full Name *</label>
              <input 
                type="text" 
                v-model="formData.name" 
                required 
                placeholder="e.g. Rasheda Mills"
                class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white text-xs font-semibold focus:ring-2 focus:ring-[#00D8E6] outline-none"
              />
            </div>

            <div class="space-y-1">
              <label class="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Email Address *</label>
              <input 
                type="email" 
                v-model="formData.email" 
                required 
                placeholder="e.g. name@example.com"
                class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white text-xs font-semibold focus:ring-2 focus:ring-[#00D8E6] outline-none"
              />
            </div>

            <div class="space-y-1">
              <label class="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Phone Number (Optional)</label>
              <input 
                type="tel" 
                v-model="formData.phone" 
                placeholder="(555) 000-0000"
                class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white text-xs font-semibold focus:ring-2 focus:ring-[#00D8E6] outline-none"
              />
            </div>

            <div v-if="error" class="p-3.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-xs font-semibold">
              {{ error }}
            </div>

            <div class="flex justify-between pt-4 border-t border-white/10">
              <button type="button" @click="step--" class="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl text-xs transition">
                Back
              </button>
              <button 
                type="submit" 
                :disabled="loading"
                class="px-8 py-3.5 bg-gradient-to-r from-[#00828E] via-[#00A3B0] to-[#00D8E6] text-neutral-900 font-black rounded-xl text-xs shadow-xl transition hover:brightness-110 flex items-center gap-2 cursor-pointer"
              >
                <i v-if="loading" class="pi pi-spin pi-spinner text-xs"></i>
                <span>{{ loading ? 'Generating AI Game Plan...' : 'Generate My AI Game Plan & Account →' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- RESULTS & AI GAME PLAN VIEW (After Submission) -->
      <div v-else class="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 text-neutral-900 shadow-2xl space-y-8 animate-fade-in">
        
        <!-- Top Success Header -->
        <div class="bg-gradient-to-br from-[#005F6A] to-[#00828E] text-white rounded-2xl p-6 relative overflow-hidden space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full bg-white/20 text-[#00D8E6]">
              Free Account Auto-Created
            </span>
            <span class="text-xs font-bold text-teal-100">Welcome, {{ formData.name }}!</span>
          </div>

          <h2 class="text-2xl font-black text-white tracking-tight">Your Custom AI Credit Game Plan</h2>
          <p class="text-xs text-teal-100/90 leading-relaxed font-medium">
            Your free assessment has been analyzed by AI Credit Strategist and saved permanently into your Free Meet Ally account.
          </p>

          <div class="pt-2 flex flex-wrap gap-2">
            <button 
              @click="downloadPDF" 
              class="px-4 py-2 bg-white text-[#005F6A] font-extrabold rounded-xl text-xs shadow-md hover:bg-teal-50 transition flex items-center gap-1.5 cursor-pointer"
            >
              <i class="pi pi-download text-xs"></i>
              <span>Download Game Plan (PDF)</span>
            </button>
            
            <NuxtLink 
              to="/" 
              class="px-5 py-2 bg-[#00D8E6] text-neutral-900 font-black rounded-xl text-xs shadow-md hover:bg-[#00A3B0] transition flex items-center gap-1.5"
            >
              <span>Enter My Free Ally Dashboard →</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Strategy Summary Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-center space-y-1">
            <span class="text-[9px] font-black uppercase text-neutral-400 block">Est. Resolution Timeline</span>
            <span class="text-base font-black text-[#00828E] block">{{ gamePlan.estimatedResolutionDays }}</span>
          </div>

          <div class="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-center space-y-1">
            <span class="text-[9px] font-black uppercase text-neutral-400 block">Recommended Starting Point</span>
            <span class="text-xs font-extrabold text-neutral-900 block leading-tight">{{ gamePlan.recommendedStartingPhase }}</span>
          </div>

          <div class="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-center space-y-1">
            <span class="text-[9px] font-black uppercase text-neutral-400 block">Primary Target Goal</span>
            <span class="text-xs font-extrabold text-neutral-900 block leading-tight">{{ gamePlan.primaryGoal }}</span>
          </div>
        </div>

        <!-- Action Plan Steps -->
        <div class="space-y-4">
          <h3 class="text-xs font-black uppercase tracking-widest text-neutral-400">Your Phased AI Action Roadmap</h3>
          
          <div class="space-y-3">
            <div 
              v-for="(stepItem, idx) in gamePlan.actionSteps" 
              :key="stepItem.title"
              class="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-start gap-3"
            >
              <div class="w-7 h-7 rounded-full bg-[#00828E] text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                {{ idx + 1 }}
              </div>
              <div class="space-y-0.5">
                <h4 class="text-xs font-extrabold text-neutral-900">{{ stepItem.title }}</h4>
                <p class="text-xs text-neutral-600 font-medium leading-relaxed">{{ stepItem.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Ecosystem Nurturing Options (Upgrade / Consultation / DIY) -->
        <div class="p-6 rounded-3xl bg-neutral-900 text-white space-y-4">
          <h3 class="text-sm font-extrabold text-white">Next Steps to Accelerate Your Credit Recovery</h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <NuxtLink 
              to="/upload" 
              class="p-4 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/20 transition space-y-1 text-left block"
            >
              <div class="flex justify-between items-center">
                <span class="font-extrabold text-xs text-[#00D8E6]">Option A: DIY Ally Engine</span>
                <i class="pi pi-arrow-right text-xs text-[#00D8E6]"></i>
              </div>
              <p class="text-[11px] text-neutral-300">Upload your 3-bureau report to generate automated dispute letters instantly.</p>
            </NuxtLink>

            <a 
              href="mailto:help@creditremedi.com?subject=Done-For-You%20Credit%20Repair%20Inquiry"
              class="p-4 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/20 transition space-y-1 text-left block"
            >
              <div class="flex justify-between items-center">
                <span class="font-extrabold text-xs text-teal-200">Option B: Strategy & DFY Service</span>
                <i class="pi pi-envelope text-xs text-teal-200"></i>
              </div>
              <p class="text-[11px] text-neutral-300">Book a strategy consultation or request Done-For-You credit restoration.</p>
            </a>
          </div>
        </div>

      </div>
    </main>

    <!-- Footer -->
    <footer class="max-w-4xl mx-auto w-full text-center py-4 border-t border-white/10 text-[10px] text-neutral-500 font-semibold no-print">
      © {{ new Date().getFullYear() }} Meet Ally Credit Engine. All rights reserved. Registered Support: help@creditremedi.com
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

definePageMeta({
  layout: false
});

const step = ref(1);
const loading = ref(false);
const submitted = ref(false);
const error = ref('');

const formData = reactive({
  score_range: '580-639',
  has_collections: false,
  has_late_payments: false,
  has_inquiries: false,
  has_chargeoffs: false,
  primary_goal: 'Buying a Home (Mortgage Approval)',
  name: '',
  email: '',
  phone: ''
});

const gamePlan = ref(null);

const scoreRanges = [
  { label: 'Under 580', desc: 'Needs significant negative item removal & tradelines', value: 'under-580' },
  { label: '580 - 639', desc: 'Moderate derogatory accounts requiring dispute strategy', value: '580-639' },
  { label: '640 - 690', desc: 'Minor mismatches & inquiry removal for prime rates', value: '640-690' },
  { label: '700+', desc: 'Optimizing credit mix & high-limit funding eligibility', value: '700-plus' }
];

const negativeOptions = [
  { key: 'has_collections', label: 'Collection Accounts', desc: 'Third-party debt collection agencies', icon: 'pi-exclamation-triangle' },
  { key: 'has_late_payments', label: 'Late Payments (30/60/90 Days)', desc: 'Delinquent payment history on tradelines', icon: 'pi-clock' },
  { key: 'has_inquiries', label: 'Hard Inquiries', desc: 'Excessive credit application inquiries', icon: 'pi-search' },
  { key: 'has_chargeoffs', label: 'Charge-Offs & Written Off Accounts', desc: 'Severe derogatory creditor status', icon: 'pi-[#00828E] pi-times-circle' }
];

const goals = [
  'Buying a Home (Mortgage Approval)',
  'Buying or Leasing a Vehicle',
  'Higher Limit Credit Cards',
  'Business Funding & Capital',
  'General Profile Cleanup'
];

function selectScoreRange(val) {
  formData.score_range = val;
  step.value = 2;
}

function selectGoal(val) {
  formData.primary_goal = val;
  step.value = 4;
}

async function submitAssessment() {
  loading.value = true;
  error.value = '';

  try {
    const res = await $fetch('/api/assessment/submit', {
      method: 'POST',
      body: formData
    });

    if (res.success) {
      gamePlan.value = res.gamePlan;
      submitted.value = true;
    } else {
      error.value = 'Failed to process assessment.';
    }
  } catch (err) {
    error.value = err.data?.statusMessage || err.message || 'An error occurred during submission.';
  } finally {
    loading.value = false;
  }
}

function downloadPDF() {
  window.print();
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
