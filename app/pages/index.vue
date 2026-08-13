<template>
  <div class="animate-fade-in">
    <!-- 1. ADMIN DASHBOARD VIEW -->
    <div v-if="isAdmin" class="space-y-6 -mx-4 md:-mx-8">
      <!-- Header Block (Indigo/Teal Gradient Banner) -->
      <div class="bg-gradient-to-br from-[#005F6A] to-[#00A3B0] text-white p-6 pb-16 rounded-b-[40px] shadow-[0_10px_30px_rgba(0,95,106,0.15)] relative">
        <!-- Top Padding Spacer -->
        <div class="pt-2"></div>

        <!-- Center Character Section -->
        <div class="flex items-center justify-between gap-4 mt-6 w-full max-w-lg mx-auto">
          <!-- Welcome Chat Bubble -->
          <div class="flex-1 bg-white/10 backdrop-blur-md border border-white/25 rounded-2xl px-4 py-3 text-[11px] md:text-xs font-semibold leading-relaxed shadow-sm text-left">
            "Hi! Here is the system overview. We currently have <span class="text-[#00D8E6] font-extrabold">{{ adminStats.totalClients }} registered clients</span> and <span class="text-[#00D8E6] font-extrabold">{{ adminStats.totalLetters }} dispute letters</span> generated."
          </div>

          <!-- Display AllyAI Image Character -->
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
          <!-- Card 1: Total Clients -->
          <div class="snap-center shrink-0 w-64 bg-white border border-neutral-200 rounded-3xl p-5 shadow-lg flex items-center justify-between">
            <div class="space-y-1.5">
              <span class="text-xs font-extrabold text-neutral-400 uppercase tracking-widest">Total Clients</span>
              <div class="flex items-baseline gap-1">
                <span class="text-3xl font-black text-neutral-900">{{ adminStats.totalClients }}</span>
                <span class="text-[10px] text-neutral-400 font-bold">Accounts</span>
              </div>
              <span class="text-[10px] px-2.5 py-0.5 rounded-full border font-bold inline-block bg-emerald-50 border-emerald-200 text-emerald-600">
                Active status
              </span>
            </div>
            <div class="shrink-0">
              <Knob :modelValue="100" :min="0" :max="100" valueColor="#00A3B0" rangeColor="#F1F5F9" :size="85" :strokeWidth="8" :showValue="false" readonly />
            </div>
          </div>

          <!-- Card 2: Standard Plan (Starter) -->
          <div class="snap-center shrink-0 w-64 bg-white border border-neutral-200 rounded-3xl p-5 shadow-lg flex items-center justify-between">
            <div class="space-y-1.5">
              <span class="text-xs font-extrabold text-neutral-400 uppercase tracking-widest">Standard (Starter)</span>
              <div class="flex items-baseline gap-1">
                <span class="text-3xl font-black text-neutral-900">{{ adminStats.starterPlanUsers }}</span>
                <span class="text-[10px] text-neutral-400 font-bold">Clients</span>
              </div>
              <span class="text-[10px] px-2.5 py-0.5 rounded-full border font-bold inline-block bg-[#00A3B0]/10 border-[#00A3B0]/20 text-[#00828E]">
                {{ starterPercentage }}% Ratio
              </span>
            </div>
            <div class="shrink-0">
              <Knob :modelValue="starterPercentage" :min="0" :max="100" valueColor="#00A3B0" rangeColor="#F1F5F9" :size="85" :strokeWidth="8" :showValue="false" readonly />
            </div>
          </div>

          <!-- Card 3: Pro Plan (Turbo) -->
          <div class="snap-center shrink-0 w-64 bg-white border border-neutral-200 rounded-3xl p-5 shadow-lg flex items-center justify-between">
            <div class="space-y-1.5">
              <span class="text-xs font-extrabold text-neutral-400 uppercase tracking-widest">Pro (Turbo)</span>
              <div class="flex items-baseline gap-1">
                <span class="text-3xl font-black text-neutral-900">{{ adminStats.turboPlanUsers }}</span>
                <span class="text-[10px] text-neutral-400 font-bold">Clients</span>
              </div>
              <span class="text-[10px] px-2.5 py-0.5 rounded-full border font-bold inline-block bg-indigo-50 border-indigo-200 text-indigo-600">
                {{ turboPercentage }}% Ratio
              </span>
            </div>
            <div class="shrink-0">
              <Knob :modelValue="turboPercentage" :min="0" :max="100" valueColor="#6366F1" rangeColor="#F1F5F9" :size="85" :strokeWidth="8" :showValue="false" readonly />
            </div>
          </div>
        </div>
      </div>

      <!-- Inner Grid Section -->
      <div class="px-4 md:px-8 space-y-6">
        <!-- Quick Stats Card Row -->
        <section class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white border border-neutral-200 rounded-2xl p-4 space-y-1 shadow-sm">
            <span class="text-[10px] text-neutral-400 font-extrabold tracking-wider uppercase">Total Clients</span>
            <div class="flex items-baseline justify-between">
              <span class="text-2xl font-black text-neutral-900">{{ adminStats.totalClients }}</span>
              <i class="pi pi-users text-neutral-400 text-sm"></i>
            </div>
          </div>
          <div class="bg-white border border-neutral-200 rounded-2xl p-4 space-y-1 shadow-sm">
            <span class="text-[10px] text-[#00828E] font-extrabold tracking-wider uppercase">Starter Plans</span>
            <div class="flex items-baseline justify-between">
              <span class="text-2xl font-black text-[#00828E]">{{ adminStats.starterPlanUsers }}</span>
              <i class="pi pi-percentage text-[#00828E]/60 text-sm"></i>
            </div>
          </div>
          <div class="bg-white border border-neutral-200 rounded-2xl p-4 space-y-1 shadow-sm">
            <span class="text-[10px] text-indigo-500 font-extrabold tracking-wider uppercase">Turbo Plans</span>
            <div class="flex items-baseline justify-between">
              <span class="text-2xl font-black text-indigo-600">{{ adminStats.turboPlanUsers }}</span>
              <i class="pi pi-bolt text-indigo-400 text-sm"></i>
            </div>
          </div>
          <div class="bg-white border border-neutral-200 rounded-2xl p-4 space-y-1 shadow-sm">
            <span class="text-[10px] text-amber-500 font-extrabold tracking-wider uppercase">Audited Files</span>
            <div class="flex items-baseline justify-between">
              <span class="text-2xl font-black text-amber-600">{{ adminStats.totalReports }}</span>
              <i class="pi pi-file-import text-amber-400 text-sm"></i>
            </div>
          </div>
        </section>

        <!-- Custom Beautiful Table (Matches example design) -->
        <div class="bg-white border border-neutral-200 rounded-[32px] p-6 shadow-sm space-y-6">
          
          <!-- Table Header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 class="font-extrabold text-xl text-neutral-900">Customers</h3>
              <p class="text-neutral-500 text-xs mt-0.5">The analysis list here shows all users</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs text-neutral-600 bg-emerald-50 border border-emerald-100 px-3.5 py-1 rounded-full font-bold flex items-center gap-1.5 shadow-sm">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {{ adminStats.totalClients }} Active Users
              </span>
            </div>
          </div>

          <!-- Table Controls (Search & Pagination) -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-neutral-100">
            <!-- Search Input Box -->
            <div class="relative w-full sm:w-64">
              <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
                <i class="pi pi-search text-xs"></i>
              </span>
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Search..." 
                class="w-full pl-9 pr-4 py-2.5 bg-neutral-50/50 border border-neutral-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A3B0]/10 focus:border-[#00A3B0] transition"
              />
            </div>

            <!-- Action Buttons and Arrow Pagination -->
            <div class="flex items-center justify-end gap-3 text-xs font-bold">
              <button 
                @click="refreshAdminData" 
                :disabled="adminLoading"
                class="p-2.5 bg-white border border-neutral-200 text-neutral-500 hover:text-neutral-700 rounded-xl hover:bg-neutral-50 transition cursor-pointer disabled:opacity-50 shadow-sm"
              >
                <i :class="['pi', adminLoading ? 'pi-spin pi-spinner' : 'pi-refresh', 'text-xs']"></i>
              </button>
              
              <span class="text-neutral-500 font-extrabold px-1">
                {{ currentPage }} of {{ totalPages || 1 }}
              </span>

              <div class="flex items-center gap-1 border border-neutral-200 rounded-xl bg-white p-1.5 shadow-sm">
                <button 
                  @click="prevPage" 
                  :disabled="currentPage === 1"
                  class="p-1 rounded-lg text-neutral-500 hover:bg-neutral-50 disabled:opacity-30 cursor-pointer"
                >
                  <i class="pi pi-chevron-left text-[10px]"></i>
                </button>
                <button 
                  @click="nextPage" 
                  :disabled="currentPage >= totalPages"
                  class="p-1 rounded-lg text-neutral-500 hover:bg-neutral-50 disabled:opacity-30 cursor-pointer"
                >
                  <i class="pi pi-chevron-right text-[10px]"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Data Grid -->
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-neutral-100 text-neutral-400 text-[10px] font-extrabold uppercase tracking-wider bg-neutral-50/30">
                  <th class="py-3 px-4">Name</th>
                  <th class="py-3 px-4 text-center">Letters Filed</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-neutral-100 text-xs font-semibold">
                <tr v-for="client in paginatedClients" :key="client.id" class="hover:bg-neutral-50/30 transition">
                  <!-- Avatar + Name + Email Column -->
                  <td class="py-4 px-4 flex items-center gap-3">
                    <div class="relative w-9 h-9 rounded-full shrink-0 flex items-center justify-center border border-neutral-100 bg-white">
                      <img v-if="client.profile_picture" :src="client.profile_picture" alt="Avatar" class="w-full h-full rounded-full object-cover" />
                      <div v-else class="w-full h-full rounded-full flex items-center justify-center font-extrabold text-[11px] uppercase" :class="getAvatarBgClass(client.name)">
                        {{ getInitials(client.name) }}
                      </div>
                      <!-- Dynamic Status indicator dot -->
                      <span 
                        class="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white"
                        :class="client.registration_status === 'completed' ? 'bg-emerald-500' : 'bg-amber-400'"
                      ></span>
                    </div>
                    <div>
                      <span class="font-extrabold text-neutral-900 block">{{ client.name }}</span>
                      <span class="text-[9px] px-2 py-0.5 rounded-full border font-extrabold uppercase tracking-widest inline-block mt-1" :class="getPlanClass(client.plan_type)">
                        {{ client.plan_type || 'None' }}
                      </span>
                    </div>
                  </td>

                  <!-- Letters Filed Badge Column -->
                  <td class="py-4 px-4 text-center">
                    <span class="inline-flex items-center gap-1.5 bg-neutral-50 border border-neutral-200 px-3 py-1 rounded-full text-[10px] font-bold text-neutral-700">
                      <i class="pi pi-envelope text-neutral-400 text-[10px]"></i>
                      {{ client.letters_filed || 0 }}
                    </span>
                  </td>
                </tr>
                <tr v-if="filteredClients.length === 0">
                  <td colspan="2" class="py-8 text-center text-neutral-400 font-semibold">
                    No clients found matching the search query.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. CLIENT DASHBOARD VIEW -->
    <div v-else class="space-y-6 -mx-4 md:-mx-8">
      <!-- Header Block (Indigo/Teal Gradient Banner) -->
      <div class="bg-gradient-to-br from-[#005F6A] to-[#00A3B0] text-white p-6 pb-16 rounded-b-[40px] shadow-[0_10px_30px_rgba(0,95,106,0.15)] relative">
        <!-- Top Padding Spacer -->
        <div class="pt-2"></div>

        <!-- Center Character Section -->
        <div class="flex items-center justify-between gap-4 mt-6 w-full max-w-lg mx-auto">
          <!-- Welcome Chat Bubble -->
          <div class="flex-1 bg-white/10 backdrop-blur-md border border-white/25 rounded-2xl px-4 py-3 text-[11px] md:text-xs font-semibold leading-relaxed shadow-sm text-left">
            "Hi! I've audited your credit reports and identified <span class="text-[#00D8E6] font-extrabold">3 reporting mismatches</span> across the bureaus. Let's start correcting them!"
          </div>

          <!-- Display AllyAI Character -->
          <img 
            src="/AllyAI.png" 
            alt="Ally AI Assistant" 
            class="h-28 w-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.25)] animate-bounce-slow shrink-0"
          />
        </div>
      </div>

      <!-- Horizontally Scrollable Bureau Cards -->
      <div class="relative z-10 -mt-12 px-6 w-full">
        <div class="flex flex-nowrap overflow-x-auto gap-4 pb-6 pt-2 scrollbar-none snap-x snap-mandatory">
          <div 
            v-for="(score, bureau) in clientData.scores" 
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
                v-model="clientData.scores[bureau]" 
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
              <span class="text-2xl font-black text-neutral-900">{{ clientData.summary.totalAccounts }}</span>
              <i class="pi pi-credit-card text-neutral-400 text-sm"></i>
            </div>
          </div>
          <div class="bg-white border border-neutral-200 rounded-2xl p-4 space-y-1 shadow-sm">
            <span class="text-[10px] text-[#00828E] font-extrabold tracking-wider uppercase">Active Negatives</span>
            <div class="flex items-baseline justify-between">
              <span class="text-2xl font-black text-[#00828E]">{{ clientData.summary.negativeAccounts }}</span>
              <i class="pi pi-exclamation-triangle text-[#00828E]/60 text-sm"></i>
            </div>
          </div>
          <div class="bg-white border border-neutral-200 rounded-2xl p-4 space-y-1 shadow-sm">
            <span class="text-[10px] text-neutral-400 font-extrabold tracking-wider uppercase">Hard Inquiries</span>
            <div class="flex items-baseline justify-between">
              <span class="text-2xl font-black text-neutral-900">{{ clientData.summary.inquiries }}</span>
              <i class="pi pi-search-plus text-neutral-400 text-sm"></i>
            </div>
          </div>
          <div class="bg-white border border-neutral-200 rounded-2xl p-4 space-y-1 shadow-sm">
            <span class="text-[10px] text-red-500 font-extrabold tracking-wider uppercase">Mismatches</span>
            <div class="flex items-baseline justify-between">
              <span class="text-2xl font-black text-red-500">{{ clientData.summary.discrepancies }}</span>
              <i class="pi pi-bolt text-red-400/60 text-sm"></i>
            </div>
          </div>
        </section>

        <!-- Personal Info & Dispute Timeline -->
        <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

            <div v-if="clientData.personalInfo" class="space-y-4">
              <div class="space-y-2">
                <span class="text-xs font-bold text-neutral-400 uppercase tracking-wide">Name Variations ({{ clientData.personalInfo.names?.length || 0 }})</span>
                <div class="flex flex-wrap gap-2">
                  <span v-for="name in clientData.personalInfo.names" :key="name" class="text-xs px-3 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-neutral-700 font-semibold">
                    {{ name }}
                  </span>
                </div>
                <p v-if="clientData.personalInfo.names?.length > 1" class="text-xs text-red-500 flex items-center gap-1.5 mt-1 font-semibold">
                  <i class="pi pi-exclamation-circle text-[10px]"></i>
                  Multiple spellings detected. Can cause mixed credit files.
                </p>
              </div>

              <div class="space-y-2 border-t border-neutral-200 pt-4">
                <span class="text-xs font-bold text-neutral-400 uppercase tracking-wide">Addresses Reported ({{ clientData.personalInfo.addresses?.length || 0 }})</span>
                <ul class="space-y-2">
                  <li v-for="addr in clientData.personalInfo.addresses" :key="addr" class="text-xs p-3 rounded-lg bg-neutral-50 border border-neutral-200 text-neutral-700">
                    {{ addr }}
                  </li>
                </ul>
                <p v-if="clientData.personalInfo.addresses?.length > 1" class="text-xs text-red-500 flex items-center gap-1.5 mt-1 font-semibold">
                  <i class="pi pi-exclamation-circle text-[10px]"></i>
                  Address formatting/spelling mismatches found. Should be unified.
                </p>
              </div>

              <div class="space-y-2 border-t border-neutral-200 pt-4">
                <span class="text-xs font-bold text-neutral-400 uppercase tracking-wide">Employers List</span>
                <div class="flex flex-wrap gap-2">
                  <span v-for="emp in clientData.personalInfo.employers" :key="emp" class="text-xs px-3 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-neutral-700">
                    {{ emp }}
                  </span>
                </div>
              </div>
            </div>
          </div>

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
              class="mt-4 w-full py-3 bg-[#00D8E6] text-neutral-900 font-extrabold rounded-xl text-center hover:bg-[#00A3B0] transition duration-300 block shadow-sm text-xs"
            >
              Inspect Conflicts Table
            </NuxtLink>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';

const user = useCookie('auth_user');
const isAdmin = computed(() => user.value?.role === 'admin');

// --- 1. ADMIN DASHBOARD DATA & ACTIONS ---
const adminStats = ref({
  totalClients: 0,
  starterPlanUsers: 0,
  turboPlanUsers: 0,
  totalReports: 0,
  totalLetters: 0
});
const clients = ref([]);
const adminLoading = ref(false);

const searchQuery = ref('');
const currentPage = ref(1);

const starterPercentage = computed(() => {
  if (!adminStats.value.totalClients) return 0;
  return Math.round((adminStats.value.starterPlanUsers / adminStats.value.totalClients) * 100);
});

const turboPercentage = computed(() => {
  if (!adminStats.value.totalClients) return 0;
  return Math.round((adminStats.value.turboPlanUsers / adminStats.value.totalClients) * 100);
});

// Client search filtering
const filteredClients = computed(() => {
  if (!searchQuery.value) return clients.value;
  const q = searchQuery.value.toLowerCase();
  return clients.value.filter(c => 
    c.name.toLowerCase().includes(q) || 
    c.email.toLowerCase().includes(q)
  );
});

// Total pages computation
const totalPages = computed(() => {
  return Math.ceil(filteredClients.value.length / 10) || 1;
});

// Paginated records computation
const paginatedClients = computed(() => {
  const start = (currentPage.value - 1) * 10;
  return filteredClients.value.slice(start, start + 10);
});

// Watch query search to reset to page 1
watch(searchQuery, () => {
  currentPage.value = 1;
});

// Pagination page changing
function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

async function refreshAdminData() {
  adminLoading.value = true;
  try {
    const res = await $fetch('/api/admin/analytics');
    if (res.success) {
      adminStats.value = res.stats;
      clients.value = res.clients;
    }
  } catch (err) {
    console.error('Failed to load admin metrics:', err);
  } finally {
    adminLoading.value = false;
  }
}

// User role pill colors
function getRoleClass(role) {
  if (role === 'admin') return 'bg-neutral-100 text-neutral-800 border-neutral-300';
  return 'bg-blue-50 text-blue-600 border-blue-100';
}

// Plan level pill colors
function getPlanClass(plan) {
  if (plan === 'starter') return 'bg-[#00A3B0]/10 text-[#00828E] border-[#00A3B0]/20';
  if (plan === 'turbo') return 'bg-indigo-50 text-indigo-600 border-indigo-200';
  return 'bg-neutral-50 text-neutral-400 border-neutral-200';
}

// Initials resolver
function getInitials(name) {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Avatar multi-color allocator
function getAvatarBgClass(name) {
  const colors = [
    'bg-indigo-50 text-indigo-700 border-indigo-100',
    'bg-[#00A3B0]/10 text-[#00828E] border-[#00A3B0]/20',
    'bg-emerald-50 text-emerald-700 border-emerald-100',
    'bg-amber-50 text-amber-700 border-amber-100',
    'bg-pink-50 text-pink-700 border-pink-100',
    'bg-rose-50 text-rose-700 border-rose-100'
  ];
  let sum = 0;
  for (let i = 0; i < (name?.length || 0); i++) {
    sum += name.charCodeAt(i);
  }
  return colors[sum % colors.length];
}

function formatDate(dateStr) {
  if (!dateStr) return '---';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function viewProfile(client) {
  alert(`Viewing credit profile details for client: ${client.name} (${client.email})`);
}

function editClient(client) {
  alert(`Editing settings for client: ${client.name}`);
}

function emailClient(client) {
  alert(`Sending direct notification email to: ${client.email}`);
}

// --- 2. CLIENT DASHBOARD DATA & ACTIONS ---
const clientData = ref({
  scores: { transunion: null, experian: null, equifax: null },
  summary: { totalAccounts: 0, negativeAccounts: 0, inquiries: 0, discrepancies: 0 },
  personalInfo: null
});

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

// --- 3. LIFECYCLE HOOK ---
onMounted(async () => {
  if (isAdmin.value) {
    await refreshAdminData();
  } else {
    try {
      const res = await $fetch('/api/dashboard-summary');
      clientData.value = res;
    } catch (err) {
      console.error('Failed to load dashboard summary:', err);
    }
  }
});
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
  -ms-overflow-style: none;
  scrollbar-width: none;
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
