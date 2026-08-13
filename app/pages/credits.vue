<template>
  <div class="animate-fade-in space-y-6">
      
      <!-- Balance & Generations Row -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- API Balance -->
        <div class="bg-white border border-neutral-200 rounded-3xl p-6 shadow-md flex items-center justify-between">
          <div class="space-y-1.5">
            <span class="text-xs font-extrabold text-neutral-400 uppercase tracking-widest">Claude API Balance</span>
            <div class="flex items-baseline gap-1">
              <span class="text-3xl font-black text-neutral-900">${{ balance.toFixed(2) }}</span>
              <span class="text-[10px] text-neutral-400 font-bold">USD</span>
            </div>
            <span class="text-[10px] px-2.5 py-0.5 rounded-full border font-bold inline-block" :class="balance > 5 ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-red-50 border-red-200 text-red-600'">
              {{ balance > 5 ? 'Healthy Balance' : 'Low Balance' }}
            </span>
          </div>
          <div class="w-14 h-14 rounded-2xl bg-[#00A3B0]/10 flex items-center justify-center text-[#00828E] border border-[#00A3B0]/20 shadow-inner">
            <i class="pi pi-wallet text-2xl"></i>
          </div>
        </div>

        <!-- Est. Generations -->
        <div class="bg-white border border-neutral-200 rounded-3xl p-6 shadow-md flex items-center justify-between">
          <div class="space-y-1.5">
            <span class="text-xs font-extrabold text-neutral-400 uppercase tracking-widest">Est. Generations Left</span>
            <div class="flex items-baseline gap-1">
              <span class="text-3xl font-black text-neutral-900">~{{ Math.floor(balance / 0.03) }}</span>
              <span class="text-[10px] text-[#00828E] font-bold">Dispute Letters</span>
            </div>
            <span class="text-[10px] px-2.5 py-0.5 rounded-full border font-bold inline-block bg-indigo-50 border-indigo-200 text-indigo-600">
              Avg ~$0.03 / generation
            </span>
          </div>
          <div class="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 border border-indigo-100 shadow-inner">
            <i class="pi pi-file-pdf text-2xl"></i>
          </div>
        </div>
      </div>

      <!-- Add Funds & Sync Section -->
      <div class="bg-white border border-neutral-200 rounded-[32px] p-6 md:p-8 shadow-sm space-y-8">

        <!-- Step 1: Add Funds on Anthropic -->
        <div class="space-y-4">
          <div class="flex items-start gap-4">
            <div class="w-9 h-9 rounded-xl bg-[#00A3B0]/10 border border-[#00A3B0]/20 flex items-center justify-center text-[#00828E] shrink-0 mt-0.5">
              <span class="font-black text-sm">1</span>
            </div>
            <div class="space-y-1.5 flex-1">
              <h4 class="font-extrabold text-neutral-900 text-base">Add Funds on Anthropic Console</h4>
              <p class="text-xs text-neutral-500 font-semibold leading-relaxed">
                Open the Claude platform dashboard to purchase API credits with your payment method. Once funds are added, come back here and sync the amount.
              </p>
            </div>
          </div>
          <a 
            href="https://console.anthropic.com/settings/billing" 
            target="_blank" 
            rel="noopener noreferrer"
            class="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-2xl text-xs font-extrabold hover:bg-neutral-800 transition cursor-pointer shadow-sm"
          >
            <i class="pi pi-external-link text-[10px]"></i>
            Open Anthropic Billing Console
          </a>
        </div>

        <div class="border-t border-neutral-100"></div>

        <!-- Step 2: Sync Balance -->
        <div class="space-y-4">
          <div class="flex items-start gap-4">
            <div class="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
              <span class="font-black text-sm">2</span>
            </div>
            <div class="space-y-1.5 flex-1">
              <h4 class="font-extrabold text-neutral-900 text-base">Sync Your New Balance</h4>
              <p class="text-xs text-neutral-500 font-semibold leading-relaxed">
                After adding funds, enter the amount you added below to keep the dashboard in sync. Or set your exact current console balance directly.
              </p>
            </div>
          </div>

          <!-- Sync Mode Toggle -->
          <div class="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-2xl p-1.5 w-full sm:w-fit">
            <button 
              @click="syncMode = 'add'" 
              class="px-4 py-2 rounded-xl text-[10px] font-extrabold transition cursor-pointer"
              :class="syncMode === 'add' ? 'bg-white text-neutral-900 shadow-sm border border-neutral-200' : 'text-neutral-500 hover:text-neutral-700'"
            >
              I Added Funds
            </button>
            <button 
              @click="syncMode = 'set'" 
              class="px-4 py-2 rounded-xl text-[10px] font-extrabold transition cursor-pointer"
              :class="syncMode === 'set' ? 'bg-white text-neutral-900 shadow-sm border border-neutral-200' : 'text-neutral-500 hover:text-neutral-700'"
            >
              Set Exact Balance
            </button>
          </div>

          <!-- Input & Action -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
            <div class="flex-1 space-y-1.5">
              <label class="text-[9px] font-extrabold text-neutral-500 uppercase tracking-wider">
                {{ syncMode === 'add' ? 'Amount Added (USD)' : 'Current Console Balance (USD)' }}
              </label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-extrabold text-sm">$</span>
                <input 
                  v-model.number="syncAmount" 
                  type="number" 
                  step="0.01" 
                  min="0.01"
                  :placeholder="syncMode === 'add' ? '20.00' : '40.00'"
                  class="w-full pl-9 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#00A3B0]/10 focus:border-[#00A3B0] transition"
                />
              </div>
            </div>
            <button 
              @click="submitSync" 
              :disabled="loading || !syncAmount || syncAmount <= 0"
              class="px-6 py-3 bg-gradient-to-r from-[#00828E] to-[#00A3B0] text-white rounded-2xl text-xs font-extrabold hover:from-[#005F6A] hover:to-[#00828E] transition duration-300 flex items-center justify-center gap-1.5 shadow-md disabled:opacity-40 cursor-pointer whitespace-nowrap"
            >
              <i v-if="loading" class="pi pi-spin pi-spinner text-[10px]"></i>
              <span>{{ syncMode === 'add' ? 'Add to Balance' : 'Set Balance' }}</span>
            </button>
          </div>

          <!-- Success Message -->
          <Transition name="fade">
            <p v-if="successMsg" class="text-xs font-bold px-3 py-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center gap-2">
              <i class="pi pi-check-circle text-xs"></i>
              {{ successMsg }}
            </p>
          </Transition>
        </div>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const balance = ref(0);
const loading = ref(false);
const syncMode = ref('add'); // 'add' or 'set'
const syncAmount = ref(null);
const successMsg = ref('');

async function fetchCredits() {
  try {
    const res = await $fetch('/api/admin/get-agent-credits');
    if (res.success) {
      balance.value = res.balance;
    }
  } catch (err) {
    console.error('Failed to fetch credits:', err);
  }
}

async function submitSync() {
  loading.value = true;
  successMsg.value = '';
  try {
    if (syncMode.value === 'add') {
      const res = await $fetch('/api/admin/topup-agent-credits', {
        method: 'POST',
        body: { amount: syncAmount.value }
      });
      if (res.success) {
        balance.value = res.balance;
        successMsg.value = `Added $${syncAmount.value.toFixed(2)} — new balance: $${res.balance.toFixed(2)}`;
      }
    } else {
      const res = await $fetch('/api/admin/set-agent-credits', {
        method: 'POST',
        body: { balance: syncAmount.value }
      });
      if (res.success) {
        balance.value = res.balance;
        successMsg.value = `Balance set to $${res.balance.toFixed(2)}`;
      }
    }
    syncAmount.value = null;
    setTimeout(() => { successMsg.value = ''; }, 4000);
  } catch (err) {
    alert(err.data?.statusMessage || 'Failed to sync balance.');
  } finally {
    loading.value = false;
  }
}

onMounted(() => { fetchCredits(); });
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-bounce-slow {
  animation: bounceSlow 3s ease-in-out infinite;
}
@keyframes bounceSlow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
