<template>
  <div class="animate-fade-in space-y-6">
    <!-- 1. LOCK SCREEN / UPSELL OVERLAY FOR STANDARD TIER -->
    <div v-if="isLocked" class="max-w-4xl mx-auto bg-white border border-neutral-200 rounded-[32px] p-8 shadow-xl relative overflow-hidden">
      <!-- Background Decorative Gradients -->
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-[#00A3B0]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="relative z-10 text-center max-w-2xl mx-auto space-y-6">
        <div class="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto shadow-md">
          <i class="pi pi-lock text-3xl text-indigo-600 animate-pulse"></i>
        </div>
        <div class="space-y-2">
          <span class="text-[10px] font-extrabold tracking-widest text-indigo-600 uppercase">Premium Pro Feature</span>
          <h1 class="text-3xl font-black text-neutral-900 tracking-tight">Unlock Funding Readiness & Lender Matching</h1>
          <p class="text-xs text-neutral-500 leading-relaxed font-semibold">
            Evaluate your credit profile fundability grade, identify points-draining factors, and match with premium credit card & loan lenders.
          </p>
        </div>

        <!-- Plan comparison matrix -->
        <div class="border border-neutral-200 rounded-3xl overflow-hidden bg-neutral-50/50 backdrop-blur-sm text-left shadow-sm">
          <div class="grid grid-cols-3 bg-neutral-100/70 border-b border-neutral-200 p-4 font-bold text-xs text-neutral-700">
            <span>Features</span>
            <span class="text-center">Standard</span>
            <span class="text-center text-indigo-600">Pro (Turbo)</span>
          </div>

          <div class="divide-y divide-neutral-200 text-xs font-semibold text-neutral-600">
            <div class="grid grid-cols-3 p-4">
              <span>AI Dispute Letter Generator</span>
              <span class="text-center text-emerald-500"><i class="pi pi-check-circle text-sm"></i></span>
              <span class="text-center text-emerald-500"><i class="pi pi-check-circle text-sm"></i></span>
            </div>
            <div class="grid grid-cols-3 p-4">
              <span>15-Day Automated Follow-Up</span>
              <span class="text-center text-emerald-500"><i class="pi pi-check-circle text-sm"></i></span>
              <span class="text-center text-emerald-500"><i class="pi pi-check-circle text-sm"></i></span>
            </div>
            <div class="grid grid-cols-3 p-4">
              <span>Monthly Credit Progress Dashboard</span>
              <span class="text-center text-emerald-500"><i class="pi pi-check-circle text-sm"></i></span>
              <span class="text-center text-emerald-500"><i class="pi pi-check-circle text-sm"></i></span>
            </div>
            <div class="grid grid-cols-3 p-4">
              <span>Auto Dispute Timeline Reminders</span>
              <span class="text-center text-neutral-300"><i class="pi pi-times-circle text-sm"></i></span>
              <span class="text-center text-emerald-500"><i class="pi pi-check-circle text-sm"></i></span>
            </div>
            <div class="grid grid-cols-3 p-4 bg-indigo-500/5">
              <span class="font-extrabold text-neutral-800">Funding Readiness Score & Roadmap</span>
              <span class="text-center text-neutral-300"><i class="pi pi-times-circle text-sm"></i></span>
              <span class="text-center text-indigo-600 font-bold"><i class="pi pi-check-circle text-sm"></i></span>
            </div>
            <div class="grid grid-cols-3 p-4 bg-indigo-500/5">
              <span class="font-extrabold text-neutral-800">Fundability Score & Lender Matching</span>
              <span class="text-center text-neutral-300"><i class="pi pi-times-circle text-sm"></i></span>
              <span class="text-center text-indigo-600 font-bold"><i class="pi pi-check-circle text-sm"></i></span>
            </div>
            <div class="grid grid-cols-3 p-4">
              <span>Free Digital Credit Journal</span>
              <span class="text-center text-neutral-300"><i class="pi pi-times-circle text-sm"></i></span>
              <span class="text-center text-emerald-500"><i class="pi pi-check-circle text-sm"></i></span>
            </div>
          </div>
        </div>

        <!-- Upgrade CTA Action -->
        <div class="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <button 
            @click="upgradeToTurbo" 
            :disabled="upgrading" 
            class="px-8 py-3.5 bg-indigo-600 text-white font-extrabold rounded-2xl hover:bg-indigo-700 transition duration-300 shadow-md text-xs disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            <i v-if="upgrading" class="pi pi-spin pi-spinner text-xs"></i>
            <span>Upgrade to Pro (Turbo Plan)</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 2. ACTIVE FEATURES INTERFACE (ADMIN & TURBO) -->
    <div v-else class="space-y-6">
      
      <!-- Loading State -->
      <div v-if="loading" class="bg-white border border-neutral-200 rounded-[32px] p-12 text-center space-y-4 shadow-sm">
        <i class="pi pi-spin pi-spinner text-4xl text-[#00828E]"></i>
        <h3 class="text-lg font-bold text-neutral-800">Evaluating Profile Fundability...</h3>
        <p class="text-xs text-neutral-500 max-w-sm mx-auto">
          We are analyzing credit utilization ratios, payment history reports, inquiries count, active negative accounts, and matching card criteria.
        </p>
      </div>

      <!-- A. INITIAL / CALCULATE STATE -->
      <div v-else-if="!hasScore" class="max-w-2xl mx-auto bg-white border border-neutral-200 rounded-[32px] p-8 shadow-sm text-center space-y-6">
        <div class="w-16 h-16 rounded-3xl bg-[#00A3B0]/10 border border-[#00A3B0]/20 flex items-center justify-center mx-auto shadow-sm">
          <i class="pi pi-verified text-3xl text-[#00828E]"></i>
        </div>
        <div class="space-y-2">
          <h2 class="text-2xl font-black text-neutral-900">Calculate Funding Readiness</h2>
          <p class="text-xs text-neutral-500 leading-relaxed font-semibold max-w-md mx-auto">
            Analyze account age, inquiry load, and dispute statuses to compute your credit eligibility score and discover matched bank credit offers.
          </p>
        </div>
        <button 
          @click="calculateScore" 
          class="px-8 py-3 bg-[#00D8E6] text-neutral-900 font-extrabold rounded-2xl hover:bg-[#00A3B0] transition duration-300 shadow-md text-xs cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
        >
          <i class="pi pi-chart-pie"></i>
          Calculate Fundability Score
        </button>
      </div>

      <!-- B. RESULTS VIEW -->
      <div v-else class="space-y-6">
        <!-- Top Summary Row: Radial Dial & Highlights -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <!-- Score Gauge Card with Brand Styling -->
          <div class="bg-gradient-to-br from-[#005F6A] via-[#00828E] to-[#00A3B0] text-white rounded-[32px] p-6 shadow-[0_10px_30px_rgba(0,95,106,0.22)] border border-white/20 relative overflow-hidden flex flex-col items-center justify-center text-center space-y-4">
            <div class="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

            <h3 class="text-xs font-black text-teal-100 uppercase tracking-widest relative z-10">Fundability Index</h3>
            
            <div class="relative flex items-center justify-center z-10">
              <Knob 
                v-model="scoreData.score" 
                :min="0" 
                :max="100" 
                :size="150" 
                :strokeWidth="10" 
                :showValue="false"
                valueColor="#00D8E6" 
                rangeColor="rgba(255, 255, 255, 0.2)"
                readonly
              />
              <div class="absolute flex flex-col items-center justify-center pointer-events-none">
                <span class="text-4xl font-black text-white drop-shadow-sm">{{ scoreData.score }}</span>
                <span class="text-[10px] font-extrabold text-[#00D8E6] uppercase tracking-wider">Score</span>
              </div>
            </div>

            <div class="flex items-center gap-2 relative z-10">
              <span class="text-xs font-bold text-teal-100">Eligibility Class:</span>
              <span class="px-3.5 py-1 bg-black/20 border border-white/25 rounded-full text-xs font-black text-white uppercase backdrop-blur-sm shadow-sm">
                Grade {{ scoreData.grade }}
              </span>
            </div>
          </div>

          <!-- Factors Weight Breakdown -->
          <div class="md:col-span-2 bg-white border border-neutral-200 rounded-[32px] p-6 shadow-sm space-y-4">
            <h3 class="text-xs font-black text-neutral-400 uppercase tracking-widest">Score Factor Breakdown</h3>
            
            <div class="space-y-3.5">
              <!-- Credit Score -->
              <div class="space-y-1">
                <div class="flex justify-between text-xs font-extrabold">
                  <span class="text-neutral-700">Credit Score Alignment</span>
                  <span class="text-[#00828E]">{{ scoreData.factors?.credit_score?.points }}/40 pts</span>
                </div>
                <div class="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                  <div class="bg-[#00A3B0] h-full rounded-full" :style="{ width: scoreData.factors?.credit_score?.percentage + '%' }"></div>
                </div>
              </div>

              <!-- Account Health -->
              <div class="space-y-1">
                <div class="flex justify-between text-xs font-extrabold">
                  <span class="text-neutral-700">Credit History & Open Accounts</span>
                  <span class="text-[#00828E]">{{ scoreData.factors?.account_health?.points }}/25 pts</span>
                </div>
                <div class="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                  <div class="bg-[#00A3B0] h-full rounded-full" :style="{ width: scoreData.factors?.account_health?.percentage + '%' }"></div>
                </div>
              </div>

              <!-- Negative Items -->
              <div class="space-y-1">
                <div class="flex justify-between text-xs font-extrabold">
                  <span class="text-neutral-700">Derogatory Accounts Control</span>
                  <span class="text-[#00828E]">{{ scoreData.factors?.negative_items?.points }}/15 pts</span>
                </div>
                <div class="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                  <div class="bg-[#00A3B0] h-full rounded-full" :style="{ width: scoreData.factors?.negative_items?.percentage + '%' }"></div>
                </div>
              </div>

              <!-- Inquiries -->
              <div class="space-y-1">
                <div class="flex justify-between text-xs font-extrabold">
                  <span class="text-neutral-700">Recent Inquiry Management</span>
                  <span class="text-[#00828E]">{{ scoreData.factors?.hard_inquiries?.points }}/15 pts</span>
                </div>
                <div class="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                  <div class="bg-[#00A3B0] h-full rounded-full" :style="{ width: scoreData.factors?.hard_inquiries?.percentage + '%' }"></div>
                </div>
              </div>

              <!-- Dispute Activity -->
              <div class="space-y-1">
                <div class="flex justify-between text-xs font-extrabold">
                  <span class="text-neutral-700">Active Dispute Activity</span>
                  <span class="text-[#00828E]">{{ scoreData.factors?.dispute_activity?.points }}/5 pts</span>
                </div>
                <div class="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                  <div class="bg-[#00A3B0] h-full rounded-full" :style="{ width: scoreData.factors?.dispute_activity?.percentage + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Strengths, Weaknesses, and Recommendations -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Strengths / Weaknesses Columns -->
          <div class="lg:col-span-1 bg-white border border-neutral-200 rounded-[32px] p-6 shadow-sm space-y-6">
            <!-- Strengths -->
            <div class="space-y-3">
              <h4 class="text-xs font-black text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                <i class="pi pi-check-circle"></i> Profile Strengths
              </h4>
              <ul v-if="scoreData.strengths?.length > 0" class="space-y-2">
                <li v-for="s in scoreData.strengths" :key="s" class="text-xs font-semibold text-neutral-700 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 leading-relaxed">
                  {{ s }}
                </li>
              </ul>
              <p v-else class="text-xs text-neutral-400 font-semibold italic">No significant strengths identified yet.</p>
            </div>

            <!-- Weaknesses -->
            <div class="space-y-3">
              <h4 class="text-xs font-black text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
                <i class="pi pi-exclamation-circle"></i> Profile Weaknesses
              </h4>
              <ul v-if="scoreData.weaknesses?.length > 0" class="space-y-2">
                <li v-for="w in scoreData.weaknesses" :key="w" class="text-xs font-semibold text-neutral-700 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2 leading-relaxed">
                  {{ w }}
                </li>
              </ul>
              <p v-else class="text-xs text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">✓ No critical profile weaknesses flagged.</p>
            </div>
          </div>

          <!-- Actionable Recommendations -->
          <div class="lg:col-span-2 bg-white border border-neutral-200 rounded-[32px] p-6 shadow-sm space-y-4">
            <div class="flex justify-between items-center">
              <h3 class="text-xs font-black text-neutral-400 uppercase tracking-widest">AI Action Roadmap</h3>
              <button 
                @click="calculateScore" 
                class="px-4 py-2 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-xl text-[10px] font-extrabold text-neutral-600 transition flex items-center gap-1.5 cursor-pointer"
              >
                <i class="pi pi-refresh"></i> Re-Calculate
              </button>
            </div>

            <div class="space-y-3">
              <div 
                v-for="rec in scoreData.recommendations" 
                :key="rec.title" 
                class="flex gap-4 p-4 border border-neutral-150 rounded-2xl bg-neutral-50/30 shadow-sm relative overflow-hidden"
              >
                <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" :class="rec.priority === 'high' ? 'bg-red-500/10 border border-red-500/25 text-red-500' : 'bg-amber-500/10 border border-amber-500/25 text-amber-500'">
                  <i :class="rec.icon || 'pi pi-info-circle'" class="text-sm"></i>
                </div>
                
                <div class="space-y-1 flex-1">
                  <div class="flex justify-between items-center">
                    <span class="text-xs font-bold text-neutral-900">{{ rec.title }}</span>
                    <span class="text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full" :class="rec.priority === 'high' ? 'bg-red-50 text-red-500 border border-red-200' : 'bg-amber-50 text-amber-600 border border-amber-200'">
                      {{ rec.priority }} Priority
                    </span>
                  </div>
                  <p class="text-xs text-neutral-500 leading-normal font-semibold">{{ rec.description }}</p>
                  
                  <div v-if="rec.action_url" class="pt-2">
                    <NuxtLink :to="rec.action_url" class="inline-flex items-center gap-1 text-[10px] font-black text-[#00828E] hover:underline">
                      {{ rec.action_text || 'Fix Item' }} <i class="pi pi-arrow-right text-[8px]"></i>
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Matching Lenders / Credit Card Offers -->
        <div class="bg-white border border-neutral-200 rounded-[32px] p-6 shadow-sm space-y-6">
          <div class="border-b border-neutral-100 pb-4">
            <h3 class="font-extrabold text-lg text-neutral-900">Matched Funding Offers</h3>
            <p class="text-neutral-500 text-xs mt-1 leading-normal font-semibold">
              Based on your score and bureau profile, here are recommended credit products you have high approval odds for.
            </p>
          </div>

          <div v-if="lenderMatches.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="offer in lenderMatches" 
              :key="offer.id" 
              class="border border-neutral-200 rounded-3xl p-5 bg-white space-y-4 hover:shadow-md transition duration-300 flex flex-col justify-between"
            >
              <!-- Card Header -->
              <div class="space-y-2">
                <div class="flex justify-between items-start">
                  <div class="space-y-1">
                    <span class="text-xs font-black text-neutral-800">{{ offer.lender_name }}</span>
                    <div class="flex gap-1.5 flex-wrap">
                      <span class="text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
                        {{ offer.lender_type }}
                      </span>
                      <span class="text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                        Pull: {{ offer.bureau_pull || 'Experian' }}
                      </span>
                    </div>
                  </div>
                  <!-- Approval Badge -->
                  <span class="text-[9px] uppercase tracking-widest font-black px-2.5 py-1 rounded-full border shadow-sm shrink-0" :class="getLikelihoodClass(offer.approval_likelihood)">
                    {{ offer.approval_likelihood }} Match
                  </span>
                </div>
                
                <p class="text-xs text-neutral-500 leading-normal font-semibold">{{ offer.notes }}</p>
              </div>

              <!-- Specs Section -->
              <div class="py-3 border-y border-neutral-100 grid grid-cols-2 gap-3 text-center">
                <div class="space-y-0.5">
                  <span class="text-[9px] font-black text-neutral-400 uppercase tracking-wider block">Est. APR Range</span>
                  <span class="text-xs font-black text-neutral-800">
                    {{ offer.estimated_apr_min }}% - {{ offer.estimated_apr_max }}%
                  </span>
                </div>
                <div class="space-y-0.5 border-l border-neutral-100">
                  <span class="text-[9px] font-black text-neutral-400 uppercase tracking-wider block">Recommended Score</span>
                  <span class="text-xs font-black text-neutral-800">{{ offer.recommended_score }}</span>
                </div>
              </div>

              <!-- Match Reasons Checklist -->
              <div class="space-y-2 flex-1 pt-3">
                <span class="text-[9px] font-black text-neutral-400 uppercase tracking-wider block">Why you matched</span>
                <ul class="space-y-1">
                  <li v-for="reason in offer.match_reasons" :key="reason" class="text-[10px] text-neutral-600 font-semibold flex items-center gap-1.5">
                    <i class="pi pi-check text-emerald-500 font-bold text-[8px]"></i>
                    <span>{{ reason }}</span>
                  </li>
                </ul>
              </div>

              <!-- Requirements / Action -->
              <div class="pt-4 space-y-3">
                <div v-if="offer.requirements?.length > 0" class="text-[9px] bg-neutral-50 border border-neutral-150 p-2.5 rounded-xl text-neutral-500 font-semibold space-y-1">
                  <span class="font-extrabold text-neutral-700 block">Critical Requirements:</span>
                  <p v-for="req in offer.requirements" :key="req" class="leading-normal">• {{ req }}</p>
                </div>
                <button class="w-full py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-extrabold hover:bg-neutral-800 transition shadow-sm cursor-pointer">
                  Apply Now
                </button>
              </div>

            </div>
          </div>

          <div v-else class="py-8 text-center text-neutral-400 font-semibold bg-neutral-50 rounded-3xl border border-neutral-200">
            No compatible loan/card offers matches found for your score rating.
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const user = useCookie('auth_user');

const isLocked = computed(() => {
  if (!user.value) return true;
  return user.value.role !== 'admin' && user.value.plan_type !== 'turbo';
});

const loading = ref(false);
const upgrading = ref(false);
const hasScore = ref(false);
const scoreData = ref({});
const lenderMatches = ref([]);

// Retrieve existing score and matches
async function loadFundabilityData() {
  if (isLocked.value) return;
  loading.value = true;
  try {
    const res = await $fetch('/api/user/fundability');
    if (res.hasScore) {
      hasScore.value = true;
      scoreData.value = res.score;
      lenderMatches.value = res.matches;
    } else {
      hasScore.value = false;
    }
  } catch (err) {
    console.error('Failed to load fundability score:', err);
  } finally {
    loading.value = false;
  }
}

// Calculate the score
async function calculateScore() {
  loading.value = true;
  try {
    const res = await $fetch('/api/user/fundability-calculate', {
      method: 'POST'
    });
    if (res.success) {
      hasScore.value = true;
      scoreData.value = res.score;
      lenderMatches.value = res.matches;
    }
  } catch (err) {
    alert(err.data?.statusMessage || err.message || 'Calculation error occurred.');
  } finally {
    loading.value = false;
  }
}

// Simulate upgrading plan for pairing demo
async function upgradeToTurbo() {
  if (!user.value) return;
  upgrading.value = true;
  try {
    const res = await $fetch('/api/admin/manage-user', {
      method: 'POST',
      body: {
        action: 'update-plan',
        userId: user.value.id,
        newPlan: 'turbo'
      }
    });

    if (res.success) {
      // Update browser cookie session immediately
      const updatedUser = { ...user.value, plan_type: 'turbo' };
      user.value = updatedUser;
      
      // Load the score data
      await loadFundabilityData();
    }
  } catch (err) {
    alert(err.data?.statusMessage || err.message || 'Upgrade failed.');
  } finally {
    upgrading.value = false;
  }
}

function getLikelihoodClass(lvl) {
  if (lvl === 'high') return 'bg-emerald-50 text-emerald-600 border-emerald-200';
  if (lvl === 'medium') return 'bg-indigo-50 text-indigo-600 border-indigo-200';
  return 'bg-rose-50 text-rose-500 border-rose-200';
}

onMounted(() => {
  loadFundabilityData();
});
</script>
