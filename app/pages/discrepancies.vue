<template>
  <div class="space-y-8 animate-fade-in pb-28 max-w-6xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">Bureau Discrepancies</h1>
        <p class="text-xs sm:text-sm text-neutral-500 mt-1 font-medium">Cross-reference conflicts discovered across reporting credit bureaus.</p>
      </div>
      <div v-if="discrepancies && discrepancies.length > 0" class="flex items-center gap-2">
        <span class="text-xs px-3.5 py-1.5 rounded-xl bg-white border border-neutral-200 text-neutral-700 font-extrabold shadow-sm">
          <span class="text-[#00828E]">{{ selectedDiscrepancies.length }}</span> / {{ discrepancies.length }} Selected
        </span>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!discrepancies || discrepancies.length === 0" class="flex flex-col items-center justify-center p-12 sm:p-16 bg-white border border-neutral-200 rounded-3xl text-center space-y-4 shadow-sm">
      <div class="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
        <i class="pi pi-check text-2xl text-emerald-600"></i>
      </div>
      <div class="max-w-md">
        <h2 class="text-xl font-bold text-neutral-900">No Discrepancies Logged</h2>
        <p class="text-neutral-500 text-xs sm:text-sm mt-1">Great! No conflicting reporting or spelling mismatches were discovered in the database. Ensure a report is uploaded first.</p>
      </div>
      <NuxtLink to="/upload" class="px-6 py-3 bg-[#00D8E6] text-neutral-900 font-extrabold rounded-xl hover:bg-[#00A3B0] transition duration-300 shadow-sm text-xs">
        Upload Credit Report
      </NuxtLink>
    </div>

    <!-- Data Loaded State -->
    <div v-else class="space-y-6">
      <!-- Actions Bar -->
      <div class="bg-white border border-neutral-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Tone Selector -->
          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] uppercase tracking-widest text-neutral-400 font-extrabold">Dispute Tone</label>
            <select v-model="selectedTone" class="bg-neutral-50 border border-neutral-200 text-neutral-800 rounded-xl p-2.5 text-xs focus:border-[#00A3B0] focus:outline-none font-bold">
              <option value="factual">Factual (Polite list of facts)</option>
              <option value="legal">Legal (FCRA violations & codes)</option>
              <option value="aggressive">Aggressive (Demand immediate deletion)</option>
              <option value="moderate">Moderate (Standard dispute request)</option>
            </select>
          </div>

          <!-- Phase Input -->
          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] uppercase tracking-widest text-neutral-400 font-extrabold">Dispute Round</label>
            <input type="number" v-model="selectedPhase" min="1" max="5" class="bg-neutral-50 border border-neutral-200 text-neutral-800 rounded-xl p-2.5 text-xs focus:border-[#00A3B0] focus:outline-none font-bold" />
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-neutral-100">
          <div class="text-[11px] text-neutral-400 font-bold hidden sm:flex items-center gap-1.5">
            <i class="pi pi-arrows-h text-[#00828E]"></i>
            <span>Scroll horizontally on smaller screens to view all bureau columns</span>
          </div>

          <button 
            @click="generateDisputeLetters"
            :disabled="selectedDiscrepancies.length === 0 || letterLoading"
            class="w-full sm:w-auto px-6 py-3 bg-[#00D8E6] text-neutral-900 font-extrabold rounded-xl hover:bg-[#00A3B0] transition duration-300 disabled:opacity-40 disabled:pointer-events-none shadow-sm flex items-center justify-center gap-2 text-xs cursor-pointer"
          >
            <i v-if="letterLoading" class="pi pi-spin pi-spinner text-sm"></i>
            <i v-else class="pi pi-file-edit text-sm"></i>
            <span>{{ letterLoading ? 'Writing Letters...' : 'Draft Dispute Letters' }}</span>
          </button>
        </div>
      </div>

      <!-- Strategy Generation Loader -->
      <div v-if="letterLoading" class="p-8 bg-white border border-neutral-200 rounded-3xl text-center space-y-4 shadow-sm">
        <div class="flex items-center justify-center gap-3">
          <i class="pi pi-spin pi-spinner text-xl text-[#00828E]"></i>
          <span class="font-bold text-sm text-neutral-800">Dispute Strategy Agent composing dispute files...</span>
        </div>
        <p class="text-neutral-500 text-xs max-w-sm mx-auto font-medium">
          We are grouping the selected account discrepancies by bureau, selecting legal arguments under the FCRA, and formatting the mail text. This takes 10-20 seconds.
        </p>
      </div>

      <!-- Mobile View (Compact Cards - No Swiping Needed!) -->
      <div class="sm:hidden space-y-3">
        <!-- Select All Header -->
        <div class="flex items-center justify-between px-1 py-1">
          <button 
            @click="toggleSelectAll"
            class="text-xs font-extrabold text-[#00828E] flex items-center gap-1.5 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-neutral-200 shadow-sm"
          >
            <i :class="['pi', isAllSelected ? 'pi-check-square' : 'pi-stop', 'text-xs text-[#00828E]']"></i>
            <span>{{ isAllSelected ? 'Deselect All' : 'Select All Items' }}</span>
          </button>
          <span class="text-[10px] text-neutral-500 font-extrabold uppercase tracking-wider">{{ selectedDiscrepancies.length }}/{{ discrepancies.length }} selected</span>
        </div>

        <div 
          v-for="item in discrepancies" 
          :key="item.id"
          @click="toggleSelect(item)"
          class="bg-white border rounded-2xl p-4 shadow-sm transition duration-200 cursor-pointer space-y-3"
          :class="isSelected(item) ? 'border-[#00A3B0] ring-2 ring-[#00A3B0]/20 bg-teal-50/15' : 'border-neutral-200 hover:border-neutral-300'"
        >
          <!-- Card Top: Checkbox + Creditor + Severity -->
          <div class="flex items-start justify-between gap-2">
            <div class="flex items-start gap-2.5 min-w-0">
              <input 
                type="checkbox" 
                :checked="isSelected(item)"
                @click.stop="toggleSelect(item)"
                class="mt-1 rounded text-[#00A3B0] focus:ring-[#00A3B0] cursor-pointer h-4 w-4 shrink-0"
              />
              <div class="min-w-0">
                <span class="font-extrabold text-xs text-neutral-900 leading-snug block truncate">{{ item.creditor_name }}</span>
                <span class="text-[10px] text-[#00828E] font-extrabold uppercase tracking-wider block">{{ item.account_type }}</span>
                <span class="font-mono text-[10px] text-neutral-500 font-semibold block mt-0.5 truncate">{{ item.account_number || '---' }}</span>
              </div>
            </div>

            <div class="flex flex-col items-end gap-1 shrink-0">
              <span class="text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider" :class="getSeverityClass(item.severity)">
                {{ item.severity }}
              </span>
              <span class="text-[10px] font-black text-neutral-600">Priority: {{ item.dispute_priority }}</span>
            </div>
          </div>

          <!-- Mismatch Field -->
          <div class="pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
            <span class="text-[10px] font-extrabold uppercase tracking-wide text-neutral-400">Conflict Field:</span>
            <span class="px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200 text-neutral-700 text-[10px] font-black uppercase">
              {{ item.field_name.replace('_', ' ') }}
            </span>
          </div>

          <!-- Bureau Values Side-by-Side Strip -->
          <div class="grid grid-cols-3 gap-1.5 bg-neutral-50 rounded-xl p-2.5 border border-neutral-100 text-center">
            <div>
              <span class="text-[9px] uppercase font-black text-neutral-400 block">TR</span>
              <span class="text-[10px] font-bold text-red-600 truncate block mt-0.5">{{ item.value_1 || '---' }}</span>
            </div>
            <div class="border-x border-neutral-200 px-1">
              <span class="text-[9px] uppercase font-black text-neutral-400 block">EX</span>
              <span class="text-[10px] font-bold text-red-600 truncate block mt-0.5">{{ item.value_2 || '---' }}</span>
            </div>
            <div>
              <span class="text-[9px] uppercase font-black text-neutral-400 block">EQ</span>
              <span class="text-[10px] font-bold text-red-600 truncate block mt-0.5">{{ item.value_3 || '---' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop View (DataTable - Hidden on Mobile) -->
      <div class="hidden sm:block bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto w-full">
          <DataTable 
            v-model:selection="selectedDiscrepancies" 
            :value="discrepancies" 
            dataKey="id" 
            tableStyle="min-width: 860px;"
            class="p-datatable-sm"
          >
            <Column selectionMode="multiple" headerStyle="width: 3.5rem; background: #f8fafc; border-color: #e2e8f0; text-align: center;"></Column>
            
            <Column field="creditor_name" header="Creditor" sortable headerStyle="min-width: 160px; background: #f8fafc; border-color: #e2e8f0; color: #475569; font-weight: 800;">
              <template #body="{ data }">
                <span class="font-extrabold text-neutral-900 block text-xs">{{ data.creditor_name }}</span>
                <span class="text-[10px] text-[#00828E] font-bold uppercase tracking-wider block mt-0.5">{{ data.account_type }}</span>
              </template>
            </Column>
            
            <Column field="account_number" header="Account No." headerStyle="min-width: 130px; background: #f8fafc; border-color: #e2e8f0; color: #475569; font-weight: 800;">
              <template #body="{ data }">
                <span class="font-mono text-xs text-neutral-700 font-bold">{{ data.account_number || '---' }}</span>
              </template>
            </Column>

            <Column field="field_name" header="Field" headerStyle="min-width: 120px; background: #f8fafc; border-color: #e2e8f0; color: #475569; font-weight: 800;">
              <template #body="{ data }">
                <span class="px-2.5 py-1 rounded-md bg-neutral-100 border border-neutral-200 text-neutral-700 text-[10px] font-extrabold uppercase tracking-wide inline-block">
                  {{ data.field_name.replace('_', ' ') }}
                </span>
              </template>
            </Column>

            <!-- Bureau columns displaying values side-by-side -->
            <Column field="value_1" header="Reporting Values" headerStyle="min-width: 180px; background: #f8fafc; border-color: #e2e8f0; color: #475569; font-weight: 800;">
              <template #body="{ data }">
                <div class="flex flex-col gap-1.5 py-1">
                  <div v-if="data.bureau_1" class="flex items-center gap-1.5 text-xs">
                    <span class="text-[9px] uppercase font-black text-neutral-400 w-6 shrink-0">{{ data.bureau_1.slice(0, 2) }}:</span>
                    <span class="text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-100 text-[11px]">{{ data.value_1 }}</span>
                  </div>
                  <div v-if="data.bureau_2" class="flex items-center gap-1.5 text-xs">
                    <span class="text-[9px] uppercase font-black text-neutral-400 w-6 shrink-0">{{ data.bureau_2.slice(0, 2) }}:</span>
                    <span class="text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-100 text-[11px]">{{ data.value_2 }}</span>
                  </div>
                  <div v-if="data.bureau_3" class="flex items-center gap-1.5 text-xs">
                    <span class="text-[9px] uppercase font-black text-neutral-400 w-6 shrink-0">{{ data.bureau_3.slice(0, 2) }}:</span>
                    <span class="text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-100 text-[11px]">{{ data.value_3 }}</span>
                  </div>
                </div>
              </template>
            </Column>

            <Column field="severity" header="Severity" sortable headerStyle="min-width: 100px; background: #f8fafc; border-color: #e2e8f0; color: #475569; font-weight: 800;">
              <template #body="{ data }">
                <span class="text-[10px] px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-wider inline-block" :class="getSeverityClass(data.severity)">
                  {{ data.severity }}
                </span>
              </template>
            </Column>

            <Column field="dispute_priority" header="Priority" sortable headerStyle="min-width: 110px; background: #f8fafc; border-color: #e2e8f0; color: #475569; font-weight: 800;">
              <template #body="{ data }">
                <div class="flex items-center gap-2">
                  <span class="font-extrabold text-xs text-neutral-700">
                    {{ data.dispute_priority }}
                  </span>
                  <div class="w-12 bg-neutral-100 h-1.5 rounded-full overflow-hidden border border-neutral-200">
                    <div class="h-full rounded-full" :class="data.dispute_priority >= 80 ? 'bg-[#00A3B0]' : 'bg-neutral-400'" :style="{ width: data.dispute_priority + '%' }"></div>
                  </div>
                </div>
              </template>
            </Column>

            <Column field="dispute_status" header="Status" headerStyle="min-width: 100px; background: #f8fafc; border-color: #e2e8f0; color: #475569; font-weight: 800;">
              <template #body="{ data }">
                <span class="text-[10px] px-2.5 py-0.5 rounded border font-extrabold uppercase tracking-wide inline-block" :class="getStatusClass(data.dispute_status)">
                  {{ data.dispute_status }}
                </span>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data: discrepancies, refresh } = await useFetch('/api/discrepancies');

const selectedDiscrepancies = ref([]);
const selectedTone = ref('legal');
const selectedPhase = ref(1);
const letterLoading = ref(false);

function isSelected(item) {
  return selectedDiscrepancies.value.some(d => d.id === item.id);
}

function toggleSelect(item) {
  const index = selectedDiscrepancies.value.findIndex(d => d.id === item.id);
  if (index >= 0) {
    selectedDiscrepancies.value.splice(index, 1);
  } else {
    selectedDiscrepancies.value.push(item);
  }
}

const isAllSelected = computed(() => {
  if (!discrepancies.value || discrepancies.value.length === 0) return false;
  return selectedDiscrepancies.value.length === discrepancies.value.length;
});

function toggleSelectAll() {
  if (isAllSelected.value) {
    selectedDiscrepancies.value = [];
  } else {
    selectedDiscrepancies.value = [...(discrepancies.value || [])];
  }
}

function getSeverityClass(severity) {
  if (severity === 'high') return 'bg-red-50 text-red-600 border border-red-100';
  if (severity === 'medium') return 'bg-amber-50 text-amber-600 border border-amber-100';
  return 'bg-blue-50 text-blue-600 border border-blue-100';
}

function getStatusClass(status) {
  if (status === 'disputed') return 'bg-[#00A3B0]/10 text-[#00828E] border-[#00A3B0]/20';
  if (status === 'resolved') return 'bg-emerald-50 text-emerald-600 border-emerald-200';
  return 'bg-neutral-50 text-neutral-500 border-neutral-200';
}

async function generateDisputeLetters() {
  if (selectedDiscrepancies.value.length === 0) return;

  letterLoading.value = true;
  const discrepancyIds = selectedDiscrepancies.value.map(d => d.id);

  try {
    const res = await $fetch('/api/generate-letter', {
      method: 'POST',
      body: {
        discrepancyIds,
        tone: selectedTone.value,
        phase: selectedPhase.value
      }
    });

    if (res.success) {
      navigateTo('/letters');
    }
  } catch (err) {
    alert(err.data?.statusMessage || err.message || 'Failed to generate dispute letters.');
  } finally {
    letterLoading.value = false;
  }
}
</script>

<style>
/* Light theme overrides for PrimeVue DataTable */
.p-datatable {
  background: transparent !important;
  color: #1e293b !important;
  font-size: 0.825rem;
}
.p-datatable-thead > tr > th {
  color: #475569 !important;
  font-weight: 700 !important;
}
.p-datatable-tbody > tr {
  background: #ffffff !important;
  border-bottom: 1px solid #e2e8f0 !important;
  color: #1e293b !important;
  transition: background-color 0.2s;
}
.p-datatable-tbody > tr:hover {
  background: #f8fafc !important;
}
.p-datatable-tbody > tr.p-highlight {
  background: rgba(0, 163, 176, 0.05) !important;
  color: #0f172a !important;
}
.p-checkbox .p-checkbox-box {
  border-color: #cbd5e1 !important;
  background: #ffffff !important;
}
.p-checkbox.p-checkbox-checked .p-checkbox-box {
  border-color: #00A3B0 !important;
  background: #00A3B0 !important;
  color: #ffffff !important;
}
.p-checkbox .p-checkbox-box .p-checkbox-icon {
  color: #ffffff !important;
}
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
