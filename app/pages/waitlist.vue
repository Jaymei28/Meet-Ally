<template>
  <div class="animate-fade-in space-y-6 -mx-4 md:-mx-8">
    <!-- Header Block (Teal Gradient Banner) -->
    <div class="bg-gradient-to-br from-[#005F6A] to-[#00A3B0] text-white p-6 pb-16 rounded-b-[40px] shadow-[0_10px_30px_rgba(0,95,106,0.15)] relative">
      <div class="pt-2"></div>
      <div class="flex items-center justify-between gap-4 mt-6 w-full max-w-lg mx-auto">
        <div class="flex-1 bg-white/10 backdrop-blur-md border border-white/25 rounded-2xl px-4 py-3 text-[11px] md:text-xs font-semibold leading-relaxed shadow-sm text-left">
          "Monitor pre-launch interest. We currently have <span class="text-[#00D8E6] font-extrabold">{{ waitlistUsers.length }} users</span> on the waitlist, with <span class="text-[#00D8E6] font-extrabold">{{ qualifiedCount }} qualified leads</span>."
        </div>
        <img 
          src="/AllyAI.png" 
          alt="Ally AI Assistant" 
          class="h-28 w-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.25)] animate-bounce-slow shrink-0"
        />
      </div>
    </div>

    <!-- Content Area -->
    <div class="px-4 md:px-8 space-y-6">

      <!-- Quick Stats Card Row -->
      <section class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white border border-neutral-200 rounded-2xl p-4 space-y-1 shadow-sm">
          <span class="text-[10px] text-neutral-400 font-extrabold tracking-wider uppercase">Total Waitlist</span>
          <div class="flex items-baseline justify-between">
            <span class="text-2xl font-black text-neutral-900">{{ waitlistUsers.length }}</span>
            <i class="pi pi-users text-neutral-400 text-sm"></i>
          </div>
        </div>
        <div class="bg-white border border-neutral-200 rounded-2xl p-4 space-y-1 shadow-sm">
          <span class="text-[10px] text-[#00828E] font-extrabold tracking-wider uppercase">Qualified Leads</span>
          <div class="flex items-baseline justify-between">
            <span class="text-2xl font-black text-[#00828E]">{{ qualifiedCount }}</span>
            <i class="pi pi-verified text-[#00828E]/60 text-sm"></i>
          </div>
        </div>
        <div class="bg-white border border-neutral-200 rounded-2xl p-4 space-y-1 shadow-sm">
          <span class="text-[10px] text-indigo-500 font-extrabold tracking-wider uppercase">Total Referrals</span>
          <div class="flex items-baseline justify-between">
            <span class="text-2xl font-black text-indigo-600">{{ totalReferrals }}</span>
            <i class="pi pi-share-alt text-indigo-400 text-sm"></i>
          </div>
        </div>
        <div class="bg-white border border-neutral-200 rounded-2xl p-4 space-y-1 shadow-sm">
          <span class="text-[10px] text-amber-500 font-extrabold tracking-wider uppercase">Conversion Rate</span>
          <div class="flex items-baseline justify-between">
            <span class="text-2xl font-black text-amber-600">{{ conversionRate }}%</span>
            <i class="pi pi-percentage text-amber-400 text-sm"></i>
          </div>
        </div>
      </section>

      <!-- Waitlist Table Card -->
      <div class="bg-white border border-neutral-200 rounded-[32px] p-6 shadow-sm space-y-6">

        <!-- Card Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 class="font-extrabold text-xl text-neutral-900">Waitlist Report</h3>
            <p class="text-neutral-500 text-xs mt-0.5">Manage and review pre-launch signups and referrals</p>
          </div>
          <span class="text-xs text-neutral-600 bg-emerald-50 border border-emerald-100 px-3.5 py-1 rounded-full font-bold flex items-center gap-1.5 shadow-sm">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            {{ filteredUsers.length }} Records Found
          </span>
        </div>

        <!-- Controls -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-neutral-100">
          <div class="relative w-full sm:w-64">
            <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
              <i class="pi pi-search text-xs"></i>
            </span>
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search by name, email, challenge..." 
              class="w-full pl-9 pr-4 py-2.5 bg-neutral-50/50 border border-neutral-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A3B0]/10 focus:border-[#00A3B0] transition"
            />
          </div>
          <div class="flex items-center justify-end gap-3 text-xs font-bold">
            <button 
              @click="fetchWaitlist" 
              :disabled="loading"
              class="p-2.5 bg-white border border-neutral-200 text-neutral-500 hover:text-neutral-700 rounded-xl hover:bg-neutral-50 transition cursor-pointer disabled:opacity-50 shadow-sm"
            >
              <i :class="['pi', loading ? 'pi-spin pi-spinner' : 'pi-refresh', 'text-xs']"></i>
            </button>
            <span class="text-neutral-500 font-extrabold px-1">{{ currentPage }} of {{ totalPages || 1 }}</span>
            <div class="flex items-center gap-1 border border-neutral-200 rounded-xl bg-white p-1.5 shadow-sm">
              <button @click="prevPage" :disabled="currentPage === 1" class="p-1 rounded-lg text-neutral-500 hover:bg-neutral-50 disabled:opacity-30 cursor-pointer">
                <i class="pi pi-chevron-left text-[10px]"></i>
              </button>
              <button @click="nextPage" :disabled="currentPage >= totalPages" class="p-1 rounded-lg text-neutral-500 hover:bg-neutral-50 disabled:opacity-30 cursor-pointer">
                <i class="pi pi-chevron-right text-[10px]"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Waitlist Table (Desktop view, hidden on mobile) -->
        <div class="hidden lg:block overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-neutral-100 text-neutral-400 text-[10px] font-extrabold uppercase tracking-wider bg-neutral-50/30">
                <th class="py-3 px-4">User</th>
                <th class="py-3 px-4">Survey Details</th>
                <th class="py-3 px-4">Referrals Info</th>
                <th class="py-3 px-4 text-center">Status</th>
                <th class="py-3 px-4 text-center">Joined Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100 text-xs font-semibold">
              <tr v-for="u in paginatedUsers" :key="u.id" class="hover:bg-neutral-50/30 transition">
                <!-- User Profile -->
                <td class="py-4 px-4 flex items-center gap-3">
                  <div class="relative w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-[11px] shrink-0 uppercase border border-neutral-100" :class="getAvatarBgClass(u.name)">
                    {{ getInitials(u.name) }}
                  </div>
                  <div>
                    <span class="font-extrabold text-neutral-900 block">{{ u.name }}</span>
                    <span class="text-[10px] text-neutral-400 font-semibold block mt-0.5">{{ u.email }}</span>
                  </div>
                </td>

                <!-- Survey Answers -->
                <td class="py-4 px-4 max-w-xs">
                  <div class="space-y-1">
                    <p class="truncate"><span class="text-neutral-400 font-bold">Challenge:</span> <span class="text-neutral-700 font-medium">{{ u.challenge || '—' }}</span></p>
                    <p class="truncate"><span class="text-neutral-400 font-bold">Usage:</span> <span class="text-neutral-700 font-medium">{{ u.usage || '—' }}</span></p>
                    <p class="truncate"><span class="text-neutral-400 font-bold">Timeline:</span> <span class="text-neutral-700 font-medium">{{ u.timeline || '—' }}</span></p>
                  </div>
                </td>

                <!-- Referral info -->
                <td class="py-4 px-4">
                  <div class="space-y-1 text-[10px] text-neutral-500 font-bold">
                    <div>
                      <span class="text-neutral-400">Referrer:</span> 
                      <span v-if="u.referrer_name" class="text-neutral-800 ml-1">{{ u.referrer_name }} <span class="text-neutral-400 font-medium font-sans">({{ u.referrer_email }})</span></span>
                      <span v-else class="text-neutral-400 ml-1 italic font-medium">—</span>
                    </div>
                    <div>
                      <span class="text-[#00828E]">Code:</span> 
                      <span class="font-mono text-neutral-800 ml-1 bg-neutral-50 px-1.5 py-0.5 rounded border border-neutral-200">{{ u.referral_code || '---' }}</span>
                    </div>
                    <div>
                      <span class="text-neutral-400">Count:</span> 
                      <span class="text-neutral-800 ml-1">{{ u.referral_count || 0 }}</span>
                    </div>
                  </div>
                </td>

                <!-- Status (Qualified) -->
                <td class="py-4 px-4 text-center">
                  <span 
                    class="text-[10px] px-2.5 py-0.5 rounded-full border font-bold inline-block"
                    :class="u.is_qualified ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-neutral-50 border-neutral-200 text-neutral-400'"
                  >
                    {{ u.is_qualified ? 'Qualified' : 'Pending' }}
                  </span>
                </td>

                <!-- Date Joined -->
                <td class="py-4 px-4 text-center text-neutral-500 font-medium">
                  {{ formatDate(u.created_at) }}
                </td>
              </tr>
              <tr v-if="filteredUsers.length === 0">
                <td colspan="5" class="py-8 text-center text-neutral-400 font-semibold">
                  No waitlist users found matching the search.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile view: Stack of cards (hidden on desktop, visible on mobile) -->
        <div class="lg:hidden space-y-4">
          <div v-for="u in paginatedUsers" :key="u.id" class="bg-neutral-50/70 border border-neutral-200 rounded-3xl p-4 space-y-3">
            
            <!-- User avatar + Info header -->
            <div class="flex items-center gap-3">
              <div class="relative w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-[10px] shrink-0 uppercase border border-neutral-200 bg-white" :class="getAvatarBgClass(u.name)">
                {{ getInitials(u.name) }}
              </div>
              <div class="min-w-0">
                <span class="font-extrabold text-neutral-900 block truncate text-xs">{{ u.name }}</span>
                <span class="text-[9px] text-neutral-400 font-semibold block truncate mt-0.5">{{ u.email }}</span>
              </div>
            </div>

            <!-- Compact Details Container -->
            <div class="p-3 bg-white border border-neutral-100 rounded-2xl space-y-2.5 text-[11px]">
              <!-- Survey Details -->
              <div>
                <span class="text-[8px] text-neutral-400 font-extrabold uppercase tracking-wider block mb-1">Survey Details</span>
                <div class="space-y-0.5 text-neutral-700">
                  <div><span class="text-neutral-400 font-bold">Challenge:</span> {{ u.challenge || '—' }}</div>
                  <div><span class="text-neutral-400 font-bold">Usage:</span> {{ u.usage || '—' }}</div>
                  <div><span class="text-neutral-400 font-bold">Timeline:</span> {{ u.timeline || '—' }}</div>
                </div>
              </div>

              <!-- Referral Details -->
              <div class="border-t border-neutral-100 pt-2">
                <span class="text-[8px] text-[#00828E] font-extrabold uppercase tracking-wider block mb-1">Referral Info</span>
                <div class="grid grid-cols-2 gap-x-2 gap-y-1 text-neutral-500 font-bold">
                  <div><span class="text-neutral-400">Ref Code:</span> <span class="font-mono text-neutral-800 ml-1 bg-neutral-50 px-1 py-0.5 rounded border border-neutral-100">{{ u.referral_code || '—' }}</span></div>
                  <div><span class="text-neutral-400">Referrals:</span> <span class="text-neutral-800 ml-1">{{ u.referral_count || 0 }}</span></div>
                  <div class="col-span-2 truncate" v-if="u.referrer_name"><span class="text-neutral-400">Referred By:</span> <span class="text-neutral-800 ml-1">{{ u.referrer_name }}</span></div>
                </div>
              </div>
            </div>

            <!-- Status and date row -->
            <div class="flex items-center justify-between pt-0.5">
              <span 
                class="text-[9px] px-2 py-0.5 rounded-full border font-bold inline-block"
                :class="u.is_qualified ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-neutral-50 border-neutral-200 text-neutral-400'"
              >
                {{ u.is_qualified ? 'Qualified' : 'Pending' }}
              </span>
              <span class="text-[9px] text-neutral-400 font-medium">Joined: {{ formatDate(u.created_at) }}</span>
            </div>
          </div>
          
          <div v-if="filteredUsers.length === 0" class="py-8 text-center text-neutral-400 font-semibold bg-neutral-50 rounded-3xl border border-neutral-200">
            No waitlist users found matching the search.
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

const waitlistUsers = ref([]);
const loading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);

async function fetchWaitlist() {
  loading.value = true;
  try {
    const res = await $fetch('/api/admin/waitlist');
    if (res.success) {
      waitlistUsers.value = res.users;
    }
  } catch (err) {
    console.error('Failed to fetch waitlist users:', err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchWaitlist();
});

const qualifiedCount = computed(() => {
  return waitlistUsers.value.filter(u => u.is_qualified).length;
});

const totalReferrals = computed(() => {
  return waitlistUsers.value.reduce((sum, u) => sum + (u.referral_count || 0), 0);
});

const conversionRate = computed(() => {
  if (waitlistUsers.value.length === 0) return 0;
  return Math.round((qualifiedCount.value / waitlistUsers.value.length) * 100);
});

const filteredUsers = computed(() => {
  if (!searchQuery.value) return waitlistUsers.value;
  const q = searchQuery.value.toLowerCase();
  return waitlistUsers.value.filter(u => 
    u.name.toLowerCase().includes(q) ||
    u.email.toLowerCase().includes(q) ||
    (u.challenge && u.challenge.toLowerCase().includes(q)) ||
    (u.usage && u.usage.toLowerCase().includes(q)) ||
    (u.timeline && u.timeline.toLowerCase().includes(q)) ||
    (u.referrer_name && u.referrer_name.toLowerCase().includes(q))
  );
});

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / 10) || 1;
});

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * 10;
  return filteredUsers.value.slice(start, start + 10);
});

// Watch query search to reset to page 1
watch(searchQuery, () => {
  currentPage.value = 1;
});

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

function getInitials(name) {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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
