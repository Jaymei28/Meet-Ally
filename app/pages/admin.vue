<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Header -->
    <div class="border-b border-neutral-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-neutral-900">Admin Portal</h1>
        <p class="text-neutral-500 mt-1">Database metrics aggregation, subscriber management, and system reports.</p>
      </div>
      <div>
        <button 
          @click="refreshData" 
          :disabled="loading"
          class="px-4 py-2 bg-[#00D8E6] text-neutral-900 font-extrabold rounded-xl hover:bg-[#00A3B0] transition duration-300 flex items-center gap-2 shadow-sm disabled:opacity-50"
        >
          <i :class="['pi', loading ? 'pi-spin pi-spinner' : 'pi-refresh']"></i>
          Refresh Stats
        </button>
      </div>
    </div>

    <!-- Stats Cards Grid -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      <!-- Card 1: Clients -->
      <div class="bg-white border border-neutral-200 rounded-3xl p-6 space-y-3 shadow-sm relative overflow-hidden group hover:border-neutral-300 transition duration-300">
        <span class="text-[10px] text-neutral-400 font-bold tracking-wider uppercase">Total Clients</span>
        <div class="flex items-baseline justify-between">
          <span class="text-3xl font-black text-neutral-900">{{ stats.totalClients }}</span>
          <div class="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-500">
            <i class="pi pi-users text-sm"></i>
          </div>
        </div>
      </div>

      <!-- Card 2: Starter Tiers -->
      <div class="bg-white border border-neutral-200 rounded-3xl p-6 space-y-3 shadow-sm relative overflow-hidden group hover:border-neutral-300 transition duration-300">
        <span class="text-[10px] text-[#00828E] font-bold tracking-wider uppercase">Standard Plan (Starter)</span>
        <div class="flex items-baseline justify-between">
          <span class="text-3xl font-black text-[#00828E]">{{ stats.starterPlanUsers }}</span>
          <div class="w-8 h-8 rounded-lg bg-[#00A3B0]/10 border border-[#00A3B0]/20 flex items-center justify-center text-[#00828E]">
            <i class="pi pi-percentage text-sm"></i>
          </div>
        </div>
      </div>

      <!-- Card 3: Turbo Tiers -->
      <div class="bg-white border border-neutral-200 rounded-3xl p-6 space-y-3 shadow-sm relative overflow-hidden group hover:border-neutral-300 transition duration-300">
        <span class="text-[10px] text-indigo-500 font-bold tracking-wider uppercase">Pro Plan (Turbo)</span>
        <div class="flex items-baseline justify-between">
          <span class="text-3xl font-black text-indigo-600">{{ stats.turboPlanUsers }}</span>
          <div class="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500">
            <i class="pi pi-bolt text-sm"></i>
          </div>
        </div>
      </div>

      <!-- Card 4: Audited Reports -->
      <div class="bg-white border border-neutral-200 rounded-3xl p-6 space-y-3 shadow-sm relative overflow-hidden group hover:border-neutral-300 transition duration-300">
        <span class="text-[10px] text-amber-500 font-bold tracking-wider uppercase">Audited Files</span>
        <div class="flex items-baseline justify-between">
          <span class="text-3xl font-black text-amber-600">{{ stats.totalReports }}</span>
          <div class="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
            <i class="pi pi-file-import text-sm"></i>
          </div>
        </div>
      </div>

      <!-- Card 5: Letters Generated -->
      <div class="bg-white border border-neutral-200 rounded-3xl p-6 space-y-3 shadow-sm relative overflow-hidden group hover:border-neutral-300 transition duration-300">
        <span class="text-[10px] text-pink-500 font-bold tracking-wider uppercase">Letters Mailed</span>
        <div class="flex items-baseline justify-between">
          <span class="text-3xl font-black text-pink-600">{{ stats.totalLetters }}</span>
          <div class="w-8 h-8 rounded-lg bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-500">
            <i class="pi pi-envelope text-sm"></i>
          </div>
        </div>
      </div>
    </section>

    <!-- Plan Ratio / Progress visualization -->
    <div class="bg-white border border-neutral-200 rounded-3xl p-6 space-y-4 shadow-sm">
      <h3 class="font-bold text-sm text-neutral-800 uppercase tracking-wide">Client Plan Distribution Ratio</h3>
      <div class="space-y-3">
        <!-- Starter Ratio -->
        <div class="space-y-1">
          <div class="flex justify-between text-xs font-semibold text-neutral-600">
            <span>Standard (Starter)</span>
            <span>{{ starterPercentage }}% ({{ stats.starterPlanUsers }} / {{ stats.totalClients }})</span>
          </div>
          <div class="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden border border-neutral-200">
            <div class="bg-[#00A3B0] h-full rounded-full" :style="{ width: starterPercentage + '%' }"></div>
          </div>
        </div>
        <!-- Turbo Ratio -->
        <div class="space-y-1">
          <div class="flex justify-between text-xs font-semibold text-neutral-600">
            <span>Pro (Turbo)</span>
            <span>{{ turboPercentage }}% ({{ stats.turboPlanUsers }} / {{ stats.totalClients }})</span>
          </div>
          <div class="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden border border-neutral-200">
            <div class="bg-indigo-500 h-full rounded-full" :style="{ width: turboPercentage + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Client Management Table -->
    <div class="space-y-4">
      <div class="flex items-center justify-between px-1">
        <h3 class="font-bold text-lg text-neutral-900">System User Index</h3>
        <span class="text-xs text-neutral-500 bg-neutral-100 border border-neutral-200 px-3 py-1 rounded-full font-bold">
          {{ clients.length }} Total Records
        </span>
      </div>

      <!-- PrimeVue DataTable -->
      <div class="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm">
        <DataTable 
          :value="clients" 
          dataKey="id" 
          responsiveLayout="scroll"
          class="p-datatable-sm"
          :paginator="true"
          :rows="10"
        >
          <Column field="id" header="ID" sortable headerStyle="width: 5rem; background: #f8fafc; border-color: #e2e8f0; color: #475569;"></Column>
          
          <Column field="name" header="Full Name" sortable headerStyle="background: #f8fafc; border-color: #e2e8f0; color: #475569;">
            <template #body="{ data }">
              <span class="font-extrabold text-neutral-900 block">{{ data.name }}</span>
            </template>
          </Column>

          <Column field="email" header="Email Address" sortable headerStyle="background: #f8fafc; border-color: #e2e8f0; color: #475569;">
            <template #body="{ data }">
              <span class="font-mono text-xs text-neutral-700 font-semibold">{{ data.email }}</span>
            </template>
          </Column>

          <Column field="role" header="Account Role" sortable headerStyle="background: #f8fafc; border-color: #e2e8f0; color: #475569;">
            <template #body="{ data }">
              <span class="text-[9px] px-2 py-0.5 rounded border font-extrabold uppercase tracking-wide" :class="getRoleClass(data.role)">
                {{ data.role }}
              </span>
            </template>
          </Column>

          <Column field="plan_type" header="Plan Level" sortable headerStyle="background: #f8fafc; border-color: #e2e8f0; color: #475569;">
            <template #body="{ data }">
              <span class="text-[9px] px-2.5 py-0.5 rounded border font-extrabold uppercase tracking-widest" :class="getPlanClass(data.plan_type)">
                {{ data.plan_type || 'None' }}
              </span>
            </template>
          </Column>

          <Column field="registration_status" header="Setup Status" sortable headerStyle="background: #f8fafc; border-color: #e2e8f0; color: #475569;">
            <template #body="{ data }">
              <span class="text-[9px] px-2 py-0.5 rounded border font-extrabold uppercase tracking-wide" :class="getStatusClass(data.registration_status)">
                {{ data.registration_status }}
              </span>
            </template>
          </Column>

          <Column field="created_at" header="Joined Date" sortable headerStyle="background: #f8fafc; border-color: #e2e8f0; color: #475569;">
            <template #body="{ data }">
              <span class="text-xs text-neutral-500 font-semibold">{{ formatDate(data.created_at) }}</span>
            </template>
          </Column>

          <Column header="Actions" headerStyle="width: 6rem; background: #f8fafc; border-color: #e2e8f0; color: #475569;">
            <template #body="{ data }">
              <button 
                @click="viewProfile(data)"
                class="p-2 bg-neutral-50 hover:bg-neutral-100 text-[#00828E] rounded-lg border border-neutral-200 shadow-sm transition"
                title="View Profile Details"
              >
                <i class="pi pi-external-link text-xs"></i>
              </button>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup>
const stats = ref({
  totalClients: 0,
  starterPlanUsers: 0,
  turboPlanUsers: 0,
  totalReports: 0,
  totalLetters: 0
});
const clients = ref([]);
const loading = ref(false);

const starterPercentage = computed(() => {
  if (!stats.value.totalClients) return 0;
  return Math.round((stats.value.starterPlanUsers / stats.value.totalClients) * 100);
});

const turboPercentage = computed(() => {
  if (!stats.value.totalClients) return 0;
  return Math.round((stats.value.turboPlanUsers / stats.value.totalClients) * 100);
});

async function refreshData() {
  loading.value = true;
  try {
    const res = await $fetch('/api/admin/analytics');
    if (res.success) {
      stats.value = res.stats;
      clients.value = res.clients;
    }
  } catch (err) {
    console.error('Failed to load admin metrics:', err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  refreshData();
});

function getRoleClass(role) {
  if (role === 'admin') return 'bg-neutral-100 text-neutral-800 border-neutral-300';
  return 'bg-blue-50 text-blue-600 border-blue-100';
}

function getPlanClass(plan) {
  if (plan === 'starter') return 'bg-[#00A3B0]/10 text-[#00828E] border-[#00A3B0]/20';
  if (plan === 'turbo') return 'bg-indigo-50 text-indigo-600 border-indigo-200';
  return 'bg-neutral-50 text-neutral-400 border-neutral-200';
}

function getStatusClass(status) {
  if (status === 'completed') return 'bg-emerald-50 text-emerald-600 border-emerald-200';
  if (status === 'failed') return 'bg-red-50 text-red-600 border-red-200';
  return 'bg-amber-50 text-amber-600 border-amber-200';
}

function formatDate(dateStr) {
  if (!dateStr) return '---';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function viewProfile(client) {
  alert(`Viewing credit profile details for client: ${client.name} (${client.email})`);
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
</style>
