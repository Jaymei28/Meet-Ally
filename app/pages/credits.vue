<template>
  <div class="animate-fade-in space-y-6 -mx-4 md:-mx-8">
    <!-- Header Block (Teal Gradient Banner) -->
    <div class="bg-gradient-to-br from-[#005F6A] to-[#00A3B0] text-white p-6 pb-16 rounded-b-[40px] shadow-[0_10px_30px_rgba(0,95,106,0.15)] relative">
      <div class="pt-2"></div>
      <div class="flex items-center justify-between gap-4 mt-6 w-full max-w-lg mx-auto">
        <div class="flex-1 bg-white/10 backdrop-blur-md border border-white/25 rounded-2xl px-4 py-3 text-[11px] md:text-xs font-semibold leading-relaxed shadow-sm text-left">
          "Hi! Need more credit for your AI Agent? Top up here to keep me working on parsing reports and generating dispute letters."
        </div>
        <img 
          src="/AllyAI.png" 
          alt="Ally AI Assistant" 
          class="h-28 w-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.25)] animate-bounce-slow shrink-0"
        />
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="px-4 md:px-8 space-y-6 relative z-10 -mt-10">
      
      <!-- Balance & Status Cards Row -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Credit Balance -->
        <div class="bg-white border border-neutral-200 rounded-3xl p-6 shadow-md flex items-center justify-between">
          <div class="space-y-1.5">
            <span class="text-xs font-extrabold text-neutral-400 uppercase tracking-widest">Agent Credits</span>
            <div class="flex items-baseline gap-1">
              <span class="text-3xl font-black text-neutral-900">{{ balance }}</span>
              <span class="text-[10px] text-neutral-400 font-bold">Credits</span>
            </div>
            <span class="text-[10px] px-2.5 py-0.5 rounded-full border font-bold inline-block bg-emerald-50 border-emerald-200 text-emerald-600">
              Active Balance
            </span>
          </div>
          <div class="w-14 h-14 rounded-2xl bg-[#00A3B0]/10 flex items-center justify-center text-[#00828E] border border-[#00A3B0]/20 shadow-inner">
            <i class="pi pi-sparkles text-2xl"></i>
          </div>
        </div>

        <!-- Agent Status -->
        <div class="bg-white border border-neutral-200 rounded-3xl p-6 shadow-md flex items-center justify-between">
          <div class="space-y-1.5">
            <span class="text-xs font-extrabold text-neutral-400 uppercase tracking-widest">Agent Status</span>
            <div class="flex items-baseline gap-1">
              <span class="text-3xl font-black text-neutral-900">Ready</span>
              <span class="text-[10px] text-[#00828E] font-bold">Sonnet 3.5</span>
            </div>
            <span class="text-[10px] px-2.5 py-0.5 rounded-full border font-bold inline-block bg-indigo-50 border-indigo-200 text-indigo-600">
              Model Online
            </span>
          </div>
          <div class="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 border border-indigo-100 shadow-inner">
            <i class="pi pi-bolt text-2xl animate-pulse"></i>
          </div>
        </div>
      </div>

      <!-- Pricing Plans Grid -->
      <div class="bg-white border border-neutral-200 rounded-[32px] p-6 md:p-8 shadow-sm space-y-6">
        <div class="text-center max-w-md mx-auto space-y-1">
          <h3 class="font-extrabold text-xl text-neutral-900">Purchase Agent Credits</h3>
          <p class="text-neutral-500 text-xs font-semibold">Choose a package to top up your agent credits. Credits do not expire.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <!-- Pack 1 -->
          <div class="border border-neutral-200 rounded-3xl p-6 flex flex-col justify-between hover:border-neutral-300 hover:shadow-lg transition duration-300 relative bg-neutral-50/20">
            <div class="space-y-4">
              <div class="space-y-1">
                <span class="text-[9px] font-extrabold uppercase tracking-widest text-neutral-400">Starter Topup</span>
                <h4 class="text-lg font-black text-neutral-900">50 Agent Credits</h4>
              </div>
              <div class="flex items-baseline text-neutral-900">
                <span class="text-2xl font-black">$</span>
                <span class="text-4xl font-black tracking-tight">10</span>
                <span class="text-xs font-semibold text-neutral-400 ml-1">/ one-time</span>
              </div>
              <ul class="space-y-2.5 text-xs text-neutral-600 font-semibold pt-2">
                <li class="flex items-center gap-2">
                  <i class="pi pi-check text-[10px] text-[#00828E]"></i>
                  <span>50 dispute generation actions</span>
                </li>
                <li class="flex items-center gap-2">
                  <i class="pi pi-check text-[10px] text-[#00828E]"></i>
                  <span>Valid for all 3 bureaus</span>
                </li>
              </ul>
            </div>
            <button @click="openPaymentModal(50, 10)" class="mt-6 w-full py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-extrabold hover:bg-neutral-800 transition cursor-pointer shadow-sm">
              Buy 50 Credits
            </button>
          </div>

          <!-- Pack 2 -->
          <div class="border-2 border-[#00A3B0] rounded-3xl p-6 flex flex-col justify-between hover:shadow-lg transition duration-300 relative bg-gradient-to-br from-white to-[#00A3B0]/5">
            <div class="absolute -top-3.5 right-6 bg-[#00A3B0] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border-2 border-white shadow-sm">
              Popular
            </div>
            <div class="space-y-4">
              <div class="space-y-1">
                <span class="text-[9px] font-extrabold uppercase tracking-widest text-[#00828E]">Standard Topup</span>
                <h4 class="text-lg font-black text-neutral-900">150 Agent Credits</h4>
              </div>
              <div class="flex items-baseline text-neutral-900">
                <span class="text-2xl font-black">$</span>
                <span class="text-4xl font-black tracking-tight">25</span>
                <span class="text-xs font-semibold text-neutral-400 ml-1">/ one-time</span>
              </div>
              <ul class="space-y-2.5 text-xs text-neutral-600 font-semibold pt-2">
                <li class="flex items-center gap-2">
                  <i class="pi pi-check text-[10px] text-[#00828E]"></i>
                  <span>150 dispute generation actions</span>
                </li>
                <li class="flex items-center gap-2">
                  <i class="pi pi-check text-[10px] text-[#00828E]"></i>
                  <span>High-Priority API processing</span>
                </li>
                <li class="flex items-center gap-2">
                  <i class="pi pi-check text-[10px] text-[#00828E]"></i>
                  <span>Save up to 16% on credits</span>
                </li>
              </ul>
            </div>
            <button @click="openPaymentModal(150, 25)" class="mt-6 w-full py-2.5 bg-gradient-to-r from-[#00828E] to-[#00A3B0] text-white rounded-xl text-xs font-extrabold hover:from-[#005F6A] hover:to-[#00828E] transition cursor-pointer shadow-md">
              Buy 150 Credits
            </button>
          </div>

          <!-- Pack 3 -->
          <div class="border border-neutral-200 rounded-3xl p-6 flex flex-col justify-between hover:border-neutral-300 hover:shadow-lg transition duration-300 relative bg-neutral-50/20">
            <div class="space-y-4">
              <div class="space-y-1">
                <span class="text-[9px] font-extrabold uppercase tracking-widest text-neutral-400">Power Topup</span>
                <h4 class="text-lg font-black text-neutral-900">400 Agent Credits</h4>
              </div>
              <div class="flex items-baseline text-neutral-900">
                <span class="text-2xl font-black">$</span>
                <span class="text-4xl font-black tracking-tight">50</span>
                <span class="text-xs font-semibold text-neutral-400 ml-1">/ one-time</span>
              </div>
              <ul class="space-y-2.5 text-xs text-neutral-600 font-semibold pt-2">
                <li class="flex items-center gap-2">
                  <i class="pi pi-check text-[10px] text-[#00828E]"></i>
                  <span>400 dispute generation actions</span>
                </li>
                <li class="flex items-center gap-2">
                  <i class="pi pi-check text-[10px] text-[#00828E]"></i>
                  <span>Factual, aggressives, & custom tones</span>
                </li>
                <li class="flex items-center gap-2">
                  <i class="pi pi-check text-[10px] text-[#00828E]"></i>
                  <span>Save up to 37% on credits</span>
                </li>
              </ul>
            </div>
            <button @click="openPaymentModal(400, 50)" class="mt-6 w-full py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-extrabold hover:bg-neutral-800 transition cursor-pointer shadow-sm">
              Buy 400 Credits
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Credit Card Payment Modal -->
    <Transition name="fade">
      <div v-if="showPaymentModal" class="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showPaymentModal = false">
        <div class="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl space-y-6 relative overflow-hidden animate-scale-up border border-neutral-100">
          
          <!-- Success State -->
          <div v-if="success" class="flex flex-col items-center justify-center py-6 text-center space-y-4">
            <div class="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center text-emerald-500 animate-scale-up">
              <i class="pi pi-check text-2xl font-black"></i>
            </div>
            <div class="space-y-1">
              <h4 class="text-lg font-black text-neutral-900">Payment Successful!</h4>
              <p class="text-neutral-500 text-xs font-semibold">Topped up {{ selectedAmount }} credits to your AI Agent.</p>
            </div>
          </div>

          <!-- Input Form State -->
          <div v-else class="space-y-5">
            <!-- Modal Header -->
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-[#00A3B0]/10 border border-[#00A3B0]/20 flex items-center justify-center text-[#00828E]">
                <i class="pi pi-credit-card text-lg"></i>
              </div>
              <div>
                <h4 class="font-extrabold text-neutral-900 text-base">Topup AI Agent</h4>
                <p class="text-[10px] text-neutral-500 font-semibold">Adding {{ selectedAmount }} Credits for ${{ selectedPrice }}.00</p>
              </div>
            </div>

            <!-- Card Inputs Form -->
            <form @submit.prevent="submitPayment" class="space-y-4 pt-1">
              
              <!-- Cardholder Name -->
              <div class="space-y-1.5">
                <label class="text-[9px] font-extrabold text-neutral-500 uppercase tracking-wider">Cardholder Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="John Doe" 
                  class="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A3B0]/10 focus:border-[#00A3B0] transition"
                />
              </div>

              <!-- Card Number -->
              <div class="space-y-1.5">
                <label class="text-[9px] font-extrabold text-neutral-500 uppercase tracking-wider">Card Number</label>
                <input 
                  type="text" 
                  required
                  v-maska="'#### #### #### ####'"
                  placeholder="4111 2222 3333 4444" 
                  class="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A3B0]/10 focus:border-[#00A3B0] transition"
                />
              </div>

              <!-- Expiry & CVC Grid -->
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="text-[9px] font-extrabold text-neutral-500 uppercase tracking-wider">Expiry Date</label>
                  <input 
                    type="text" 
                    required
                    placeholder="MM/YY" 
                    class="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A3B0]/10 focus:border-[#00A3B0] transition"
                  />
                </div>
                <div class="space-y-1.5">
                  <label class="text-[9px] font-extrabold text-neutral-500 uppercase tracking-wider">CVC</label>
                  <input 
                    type="text" 
                    required
                    placeholder="123" 
                    class="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A3B0]/10 focus:border-[#00A3B0] transition"
                  />
                </div>
              </div>

              <!-- Action buttons -->
              <div class="flex gap-3 pt-3">
                <button type="button" @click="showPaymentModal = false" class="flex-1 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-extrabold text-neutral-600 hover:bg-neutral-100 transition cursor-pointer">
                  Cancel
                </button>
                <button type="submit" :disabled="loading" class="flex-1 py-3 bg-gradient-to-r from-[#00828E] to-[#00A3B0] text-white rounded-2xl text-xs font-extrabold hover:from-[#005F6A] hover:to-[#00828E] transition duration-300 flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50 cursor-pointer">
                  <i v-if="loading" class="pi pi-spin pi-spinner text-[10px]"></i>
                  <span>{{ loading ? 'Processing...' : 'Pay Now' }}</span>
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const balance = ref(100);
const loading = ref(false);
const success = ref(false);

const showPaymentModal = ref(false);
const selectedAmount = ref(0);
const selectedPrice = ref(0);

async function fetchCredits() {
  try {
    const res = await $fetch('/api/auth/get-credits');
    if (res.success) {
      balance.value = res.credits;
    }
  } catch (err) {
    console.error('Failed to fetch credits:', err);
  }
}

function openPaymentModal(amount, price) {
  selectedAmount.value = amount;
  selectedPrice.value = price;
  success.value = false;
  showPaymentModal.value = true;
}

async function submitPayment() {
  loading.value = true;
  try {
    const res = await $fetch('/api/auth/topup-credits', {
      method: 'POST',
      body: { amount: selectedAmount.value }
    });
    if (res.success) {
      balance.value = res.credits; // Update balance reactively
      success.value = true;
      setTimeout(() => {
        showPaymentModal.value = false;
      }, 1500); // Close modal automatically
    }
  } catch (err) {
    alert(err.data?.statusMessage || 'Payment transaction failed.');
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchCredits();
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-scale-up {
  animation: scaleUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.92) translateY(12px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
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
