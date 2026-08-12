<template>
  <div class="space-y-6 animate-fade-in -mx-4 md:-mx-8">
    <!-- Header Block (Indigo/Teal Gradient Banner) -->
    <div class="bg-gradient-to-br from-[#005F6A] to-[#00A3B0] text-white p-6 pb-16 rounded-b-[40px] shadow-[0_10px_30px_rgba(0,95,106,0.15)] relative">
      <!-- Top Padding Spacer -->
      <div class="pt-2"></div>

      <!-- Center Character Section (Side-by-side: Bubble Left, Ally Right) -->
      <div class="flex items-center justify-between gap-4 mt-6 w-full max-w-lg mx-auto">
        <!-- Welcome Chat Bubble (Left) -->
        <div class="flex-1 bg-white/10 backdrop-blur-md border border-white/25 rounded-2xl px-4 py-3 text-[11px] md:text-xs font-semibold leading-relaxed shadow-sm text-left">
          "Hi! I've audited your credit reports and identified <span class="text-[#00D8E6] font-extrabold">3 reporting mismatches</span> across the bureaus. Let's start correcting them!"
        </div>

        <!-- Display AllyAI Image Character (Right) -->
        <img 
          src="/AllyAI.png" 
          alt="Ally AI Assistant" 
          class="h-28 w-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.25)] animate-bounce-slow shrink-0"
        />
      </div>
    </div>

    <!-- Horizontally Scrollable Bureau Cards (Overlapping Header) -->
    <div class="relative z-10 -mt-12 px-6 w-full">
      <div class="flex flex-nowrap overflow-x-auto gap-4 pb-6 pt-2 scrollbar-none snap-x snap-mandatory">
        <div 
          v-for="(score, bureau) in data.scores" 
          :key="bureau" 
          class="snap-center shrink-0 w-64 bg-white border border-neutral-200 rounded-3xl p-5 shadow-lg flex items-center justify-between"
        >
          <div class="space-y-1.5">
            <span class="text-xs font-extrabold text-neutral-400 uppercase tracking-widest">{{ bureau }}</span>
            <div class="flex items-baseline gap-1">
              <span class="text-3xl font-black text-neutral-900">{{ score || '---' }}</span>
              <span class="text-[10px] text-neutral-400 font-bold">Vantage</span>
            </div>
            <span class="text-[10px] px-2.5 py-0.5 rounded-full border font-bold inline-block" :class="getScoreRatingClass(score)">
              {{ getScoreRating(score) }}
            </span>
          </div>

          <!-- Mini Knob widget -->
          <div class="shrink-0">
            <Knob 
              v-model="data.scores[bureau]" 
              :min="300" 
              :max="850" 
              valueColor="#00A3B0" 
              rangeColor="#F1F5F9" 
              :size="85" 
              :strokeWidth="8"
              :showValue="false"
              readonly 
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Inner Grid Section -->
    <div class="px-4 md:px-8 space-y-6">
      <!-- Quick Stats Card Row -->
      <section class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white border border-neutral-200 rounded-2xl p-4 space-y-1 shadow-sm">
          <span class="text-[10px] text-neutral-400 font-extrabold tracking-wider uppercase">Total Accounts</span>
          <div class="flex items-baseline justify-between">
            <span class="text-2xl font-black text-neutral-900">{{ data.summary.totalAccounts }}</span>
            <i class="pi pi-credit-card text-neutral-400 text-sm"></i>
          </div>
        </div>
        <div class="bg-white border border-neutral-200 rounded-2xl p-4 space-y-1 shadow-sm">
          <span class="text-[10px] text-[#00828E] font-extrabold tracking-wider uppercase">Active Negatives</span>
          <div class="flex items-baseline justify-between">
            <span class="text-2xl font-black text-[#00828E]">{{ data.summary.negativeAccounts }}</span>
            <i class="pi pi-exclamation-triangle text-[#00828E]/60 text-sm"></i>
          </div>
        </div>
        <div class="bg-white border border-neutral-200 rounded-2xl p-4 space-y-1 shadow-sm">
          <span class="text-[10px] text-neutral-400 font-extrabold tracking-wider uppercase">Hard Inquiries</span>
          <div class="flex items-baseline justify-between">
            <span class="text-2xl font-black text-neutral-900">{{ data.summary.inquiries }}</span>
            <i class="pi pi-search-plus text-neutral-400 text-sm"></i>
          </div>
        </div>
        <div class="bg-white border border-neutral-200 rounded-2xl p-4 space-y-1 shadow-sm">
          <span class="text-[10px] text-red-500 font-extrabold tracking-wider uppercase">Mismatches</span>
          <div class="flex items-baseline justify-between">
            <span class="text-2xl font-black text-red-500">{{ data.summary.discrepancies }}</span>
            <i class="pi pi-bolt text-red-400/60 text-sm"></i>
          </div>
        </div>
      </section>

      <!-- Personal Info & Dispute Timeline Grid -->
      <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Personal Info Audit Card -->
        <div class="lg:col-span-2 bg-white border border-neutral-200 rounded-3xl p-6 space-y-6 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20">
              <i class="pi pi-user text-red-500"></i>
            </div>
            <div>
              <h3 class="font-bold text-lg text-neutral-900">Personal Information Audit</h3>
              <p class="text-neutral-500 text-xs">Flagged spelling and data variances reported across bureaus.</p>
            </div>
          </div>

          <div v-if="data.personalInfo" class="space-y-4">
            <!-- Names Audit -->
            <div class="space-y-2">
              <span class="text-xs font-bold text-neutral-400 uppercase tracking-wide">Name Variations ({{ data.personalInfo.names?.length || 0 }})</span>
              <div class="flex flex-wrap gap-2">
                <span v-for="name in data.personalInfo.names" :key="name" class="text-xs px-3 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-neutral-700 font-semibold">
                  {{ name }}
                </span>
              </div>
              <p v-if="data.personalInfo.names?.length > 1" class="text-xs text-red-500 flex items-center gap-1.5 mt-1 font-semibold">
                <i class="pi pi-exclamation-circle text-[10px]"></i>
                Multiple spellings detected. Can cause mixed credit files.
              </p>
            </div>

            <!-- Addresses Audit -->
            <div class="space-y-2 border-t border-neutral-200 pt-4">
              <span class="text-xs font-bold text-neutral-400 uppercase tracking-wide">Addresses Reported ({{ data.personalInfo.addresses?.length || 0 }})</span>
              <ul class="space-y-2">
                <li v-for="addr in data.personalInfo.addresses" :key="addr" class="text-xs p-3 rounded-lg bg-neutral-50 border border-neutral-200 text-neutral-700">
                  {{ addr }}
                </li>
              </ul>
              <p v-if="data.personalInfo.addresses?.length > 1" class="text-xs text-red-500 flex items-center gap-1.5 mt-1 font-semibold">
                <i class="pi pi-exclamation-circle text-[10px]"></i>
                Address formatting/spelling mismatches found. Should be unified.
              </p>
            </div>

            <!-- Employers Audit -->
            <div class="space-y-2 border-t border-neutral-200 pt-4">
              <span class="text-xs font-bold text-neutral-400 uppercase tracking-wide">Employers List</span>
              <div class="flex flex-wrap gap-2">
                <span v-for="emp in data.personalInfo.employers" :key="emp" class="text-xs px-3 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-neutral-700">
                  {{ emp }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Strategy Round Timeline -->
        <div class="bg-white border border-neutral-200 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
          <div class="space-y-6">
            <h3 class="font-bold text-lg text-neutral-900">Dispute Timeline</h3>
            <p class="text-neutral-500 text-xs">Phased progression tracking for account verification and correction.</p>
            
            <div class="timeline-container pl-2">
              <Timeline :value="disputeTimeline">
                <template #content="slotProps">
                  <div class="ml-4 space-y-1 mb-6">
                    <h4 class="text-xs font-bold text-neutral-900 leading-none">{{ slotProps.item.status }}</h4>
                    <span class="text-[9px] font-bold text-[#00828E] uppercase">{{ slotProps.item.step }}</span>
                    <p class="text-[10px] text-neutral-500 leading-normal mt-0.5">{{ slotProps.item.desc }}</p>
                  </div>
                </template>
                <template #marker="slotProps">
                  <span class="flex w-6 h-6 items-center justify-center rounded-full text-xs shrink-0 border" :class="slotProps.item.completed ? 'bg-[#00A3B0] text-white border-[#00A3B0]' : 'bg-neutral-50 text-neutral-400 border-neutral-200'">
                    <i :class="[slotProps.item.icon, 'text-[10px]']"></i>
                  </span>
                </template>
              </Timeline>
            </div>
          </div>

          <NuxtLink 
            to="/discrepancies" 
            class="mt-4 w-full py-3 bg-[#00D8E6] text-neutral-900 font-extrabold rounded-xl text-center hover:bg-[#00A3B0] transition duration-300 block shadow-sm"
          >
            Inspect Conflicts Table
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
const { data, refresh } = await useFetch('/api/dashboard-summary');

const disputeTimeline = [
  { status: 'Auditing & Ingestion', step: 'Step 1: Complete', icon: 'pi pi-check', completed: true, desc: 'AI parsed credit report and mapped inconsistencies.' },
  { status: 'Drafting Dispute Files', step: 'Step 2: Active', icon: 'pi pi-file-edit', completed: true, desc: 'Select conflicting fields and draft letters.' },
  { status: 'Bureau Mail Status', step: 'Step 3: Pending', icon: 'pi pi-envelope', completed: false, desc: 'Mail dispute letters to bureaus.' },
  { status: '30-Day Response Audit', step: 'Step 4: Pending', icon: 'pi pi-calendar', completed: false, desc: 'Track response letters and verify corrections.' }
];

function getScoreRating(score) {
  if (score >= 781) return 'Excellent';
  if (score >= 661) return 'Good';
  if (score >= 601) return 'Fair';
  if (score >= 501) return 'Poor';
  return 'Very Poor';
}

function getScoreRatingClass(score) {
  if (score >= 781) return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600';
  if (score >= 661) return 'bg-[#00A3B0]/10 border-[#00A3B0]/20 text-[#00828E]';
  if (score >= 601) return 'bg-amber-500/10 border-amber-500/20 text-amber-600';
  return 'bg-red-500/10 border-red-500/20 text-red-600';
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.animate-bounce-slow {
  animation: bounceSlow 3s ease-in-out infinite;
}

@keyframes bounceSlow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}
</style>
