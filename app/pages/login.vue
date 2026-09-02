<template>
  <div class="min-h-screen bg-gradient-to-br from-[#005F6A] via-[#00828E] to-[#00A3B0] flex items-center justify-center p-4 py-8 relative overflow-hidden font-sans">
    
    <!-- Background subtle floating glowing circles -->
    <div class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>

    <!-- 1. LOGIN VIEW -->
    <div 
      v-if="currentView === 'login'" 
      class="w-full max-w-md bg-white rounded-[32px] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,95,106,0.25)] border border-neutral-100 relative z-10 animate-scale-up"
    >
      <!-- Top Title with Logo -->
      <div class="flex flex-col items-center justify-center text-center space-y-4 mb-6">
        <img src="/Meet-ally-logo.png" alt="Meet Ally Logo" class="h-16 object-contain mx-auto drop-shadow-sm" />
        <div>
          <h2 class="text-3xl font-black text-neutral-900 tracking-tight">Sign In</h2>
          <p class="text-neutral-500 text-sm mt-1">Welcome back! Please enter your details.</p>
        </div>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-5">
        
        <!-- Error Alert -->
        <Transition name="fade">
          <div v-if="error" class="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <i class="pi pi-exclamation-circle text-base shrink-0"></i>
            <span>{{ error }}</span>
          </div>
        </Transition>

        <!-- Email Input -->
        <div class="space-y-1.5">
          <label for="email" class="text-xs font-extrabold text-neutral-700 uppercase tracking-wider">Email Address</label>
          <div class="relative">
            <input 
              v-model="email"
              type="email" 
              id="email" 
              required
              placeholder="Enter your email"
              class="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 text-neutral-900 rounded-2xl font-semibold placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#00A3B0]/20 focus:border-[#00A3B0] transition"
            />
          </div>
        </div>

        <!-- Password Input -->
        <div class="space-y-1.5">
          <label for="password" class="text-xs font-extrabold text-neutral-700 uppercase tracking-wider">Password</label>
          <div class="relative">
            <input 
              v-model="password"
              :type="showPassword ? 'text' : 'password'" 
              id="password" 
              required
              placeholder="Enter your password"
              class="w-full pl-4 pr-10 py-3 bg-neutral-50 border border-neutral-200 text-neutral-900 rounded-2xl font-semibold placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#00A3B0]/20 focus:border-[#00A3B0] transition"
            />
            <span 
              @click="showPassword = !showPassword" 
              class="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
            >
              <i :class="['pi', showPassword ? 'pi-eye-slash' : 'pi-eye']"></i>
            </span>
          </div>
        </div>

        <!-- Remember Me / Forgot Password -->
        <div class="flex items-center justify-between text-xs font-bold pt-1">
          <label class="flex items-center gap-2 text-neutral-600 cursor-pointer select-none">
            <input type="checkbox" class="w-4 h-4 rounded border-neutral-300 text-[#00A3B0] focus:ring-[#00A3B0]" />
            <span>Remember me</span>
          </label>
          <button 
            type="button" 
            @click="currentView = 'forgot'" 
            class="text-[#00828E] hover:text-[#005F6A] transition cursor-pointer underline-offset-2 hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <!-- Submit Button -->
        <button 
          type="submit" 
          :disabled="loading"
          class="w-full py-3.5 bg-gradient-to-r from-[#00828E] to-[#00A3B0] text-white font-extrabold rounded-2xl hover:from-[#005F6A] hover:to-[#00828E] transition duration-300 flex items-center justify-center gap-2 shadow-[0_6px_24px_rgba(0,163,176,0.25)] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm active:scale-[0.98]"
        >
          <i v-if="loading" class="pi pi-spin pi-spinner text-sm"></i>
          <span>{{ loading ? 'Signing in...' : 'Sign In' }}</span>
        </button>

      </form>

      <!-- Divider -->
      <div class="flex items-center gap-4 my-6">
        <div class="flex-1 h-[1px] bg-neutral-200"></div>
        <span class="text-xs font-extrabold text-neutral-400 uppercase tracking-widest">or</span>
        <div class="flex-1 h-[1px] bg-neutral-200"></div>
      </div>

      <!-- Sign Up link -->
      <div class="text-center text-xs font-bold text-neutral-600">
        Don't have an account? 
        <NuxtLink 
          to="/plans" 
          class="text-[#00828E] hover:text-[#005F6A] font-extrabold transition cursor-pointer ml-1 underline-offset-2 hover:underline"
        >
          Sign up
        </NuxtLink>
      </div>

      <!-- Support Footer -->
      <div class="mt-6 pt-6 border-t border-neutral-100 flex items-center justify-center gap-2 text-xs font-bold text-neutral-500">
        <i class="pi pi-envelope text-neutral-400 text-sm"></i>
        <span>Having trouble logging in? 
          <a href="mailto:support@meetallycredit.com" class="text-[#00828E] hover:text-[#005F6A] transition ml-1 underline">
            Contact Support
          </a>
        </span>
      </div>
    </div>


    <!-- 2. REGISTRATION & CHECKOUT FORM VIEW -->
    <div 
      v-else-if="currentView === 'register'" 
      class="w-full max-w-xl bg-white rounded-[32px] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,95,106,0.25)] border border-neutral-100 relative z-10 animate-scale-up"
    >
      <!-- Top Title with Logo -->
      <div class="flex flex-col items-center justify-center text-center space-y-2 mb-5">
        <img src="/Meet-ally-logo.png" alt="Meet Ally Logo" class="h-12 object-contain mx-auto drop-shadow-sm" />
        <div>
          <h2 class="text-2xl font-black text-neutral-900 tracking-tight">Create Account</h2>
          <p class="text-neutral-500 text-xs mt-0.5">Secure registration powered by Meet Ally.</p>
        </div>
      </div>

      <!-- Selected Plan Summary Banner -->
      <div class="mb-5 p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-between shadow-xs">
        <div class="space-y-0.5">
          <span class="text-[9px] uppercase font-black tracking-widest text-[#00828E] block">Selected Membership</span>
          <div class="flex items-baseline gap-1.5">
            <span class="text-sm font-black text-neutral-900">
              {{ selectedPlan === 'turbo' ? 'Pro Plan (Turbo)' : 'Free Ally Account' }}
            </span>
            <span class="text-xs font-black text-[#00828E]">
              {{ selectedPlan === 'turbo' ? '$29.99/mo' : '$0 / forever' }}
            </span>
          </div>
        </div>
        <NuxtLink 
          to="/plans" 
          class="text-xs font-extrabold text-[#00828E] hover:underline bg-white px-3 py-1.5 rounded-xl border border-teal-200 shadow-xs cursor-pointer"
        >
          Change Plan
        </NuxtLink>
      </div>

      <!-- Registration Form -->
      <form @submit.prevent="handleRegister" class="space-y-5">
        
        <!-- Error Alert -->
        <Transition name="fade">
          <div v-if="error" class="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <i class="pi pi-exclamation-circle text-base shrink-0"></i>
            <span>{{ error }}</span>
          </div>
        </Transition>

        <!-- Section 1: Account Info -->
        <div class="space-y-3">
          <span class="text-[10px] font-black text-neutral-400 uppercase tracking-widest block border-b border-neutral-100 pb-1">1. Account Details</span>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <!-- Full Name -->
            <div class="space-y-1">
              <label for="reg-name" class="text-[11px] font-extrabold text-neutral-700 uppercase tracking-wider">Full Legal Name</label>
              <input 
                v-model="regName"
                type="text" 
                id="reg-name" 
                required
                placeholder="First and Last Name"
                class="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 text-neutral-900 rounded-xl font-semibold text-xs placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#00A3B0]/20 focus:border-[#00A3B0] transition"
              />
            </div>

            <!-- Email Address -->
            <div class="space-y-1">
              <label for="reg-email" class="text-[11px] font-extrabold text-neutral-700 uppercase tracking-wider">Email Address</label>
              <input 
                v-model="regEmail"
                type="email" 
                id="reg-email" 
                required
                placeholder="name@example.com"
                class="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 text-neutral-900 rounded-xl font-semibold text-xs placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#00A3B0]/20 focus:border-[#00A3B0] transition"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <!-- Phone Number -->
            <div class="space-y-1">
              <label for="reg-phone" class="text-[11px] font-extrabold text-neutral-700 uppercase tracking-wider">Phone <span class="text-neutral-400 font-normal">(Optional)</span></label>
              <input 
                v-model="regPhone"
                type="tel" 
                id="reg-phone" 
                placeholder="(555) 000-0000"
                class="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 text-neutral-900 rounded-xl font-semibold text-xs placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#00A3B0]/20 focus:border-[#00A3B0] transition"
              />
            </div>

            <!-- Password -->
            <div class="space-y-1">
              <label for="reg-password" class="text-[11px] font-extrabold text-neutral-700 uppercase tracking-wider">Password</label>
              <div class="relative">
                <input 
                  v-model="regPassword"
                  :type="showRegPassword ? 'text' : 'password'" 
                  id="reg-password" 
                  required
                  placeholder="Create password"
                  class="w-full pl-3.5 pr-9 py-2.5 bg-neutral-50 border border-neutral-200 text-neutral-900 rounded-xl font-semibold text-xs placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#00A3B0]/20 focus:border-[#00A3B0] transition"
                />
                <span 
                  @click="showRegPassword = !showRegPassword" 
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                >
                  <i :class="['pi', showRegPassword ? 'pi-eye-slash' : 'pi-eye', 'text-xs']"></i>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 2: Payment Method Details (Only for paid plans) -->
        <div v-if="selectedPlan !== 'free'" class="space-y-3 pt-2">
          <div class="flex items-center justify-between border-b border-neutral-100 pb-1">
            <span class="text-[10px] font-black text-neutral-400 uppercase tracking-widest block">2. Payment Method (PayPal)</span>
            <span class="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
              <i class="pi pi-lock text-[9px]"></i> 256-Bit SSL Encrypted
            </span>
          </div>

          <!-- PayPal Subscription Card -->
          <div class="p-4 rounded-2xl bg-[#00828E]/10 border border-[#00828E]/20 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-black text-[#005F6A] flex items-center gap-1.5">
                <i class="pi pi-paypal text-sm text-[#00828E]"></i>
                PayPal Auto-Billing Plan
              </span>
              <span class="text-xs font-black text-neutral-900">$29.99 / month</span>
            </div>
            <p class="text-[11px] text-neutral-600 font-medium leading-relaxed">
              You will be redirected to PayPal to authorize your subscription after setting up your account credentials. You can cancel anytime.
            </p>
          </div>
        </div>

        <!-- Submit Payment Button -->
        <button 
          type="submit" 
          :disabled="regLoading"
          class="w-full mt-4 py-3.5 bg-gradient-to-r from-[#00828E] to-[#00A3B0] text-white font-black rounded-xl hover:from-[#005F6A] hover:to-[#00828E] transition duration-200 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs active:scale-[0.98]"
        >
          <i v-if="regLoading" class="pi pi-spin pi-spinner text-xs"></i>
          <i v-else-if="selectedPlan !== 'free'" class="pi pi-paypal text-xs"></i>
          <i v-else class="pi pi-user-plus text-xs"></i>
          <span>{{ regLoading ? 'Processing Account...' : (selectedPlan === 'free' ? 'Create Free Account ($0)' : 'Continue to PayPal Subscription ($29.99/mo)') }}</span>
        </button>

      </form>

      <!-- Back to Login -->
      <div class="text-center text-xs font-bold text-neutral-600 mt-5 pt-4 border-t border-neutral-100">
        Already have an account? 
        <button 
          @click="currentView = 'login'" 
          class="text-[#00828E] hover:text-[#005F6A] font-extrabold transition cursor-pointer ml-1 underline-offset-2 hover:underline"
        >
          Sign in
        </button>
      </div>
    </div>

    <!-- 3. FORGOT PASSWORD VIEW -->
    <div 
      v-else-if="currentView === 'forgot'" 
      class="w-full max-w-md bg-white rounded-[32px] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,95,106,0.25)] border border-neutral-100 relative z-10 animate-scale-up space-y-6"
    >
      <!-- Top Title with Logo -->
      <div class="flex flex-col items-center justify-center text-center space-y-4 mb-2">
        <img src="/Meet-ally-logo.png" alt="Meet Ally Logo" class="h-16 object-contain mx-auto drop-shadow-sm" />
        <div>
          <h2 class="text-2xl font-black text-neutral-900 tracking-tight">Forgot Password</h2>
          <p class="text-neutral-500 text-xs mt-1">Need to reset your credentials?</p>
        </div>
      </div>

      <!-- Instructions Box -->
      <div class="bg-[#00828E]/10 border border-[#00828E]/20 rounded-2xl p-4 text-xs font-medium text-[#005F6A] leading-relaxed space-y-2">
        <p>
          Please contact our support desk directly at <strong class="text-neutral-900">support@meetallycredit.com</strong> from your registered email address to initiate a password reset.
        </p>
      </div>

      <!-- Action / Back to Login -->
      <div class="space-y-3 pt-2">
        <a 
          href="mailto:support@meetallycredit.com?subject=Meet%20Ally%20Password%20Reset%20Request"
          class="w-full py-3.5 bg-gradient-to-r from-[#00828E] to-[#00A3B0] text-white font-extrabold rounded-2xl hover:from-[#005F6A] hover:to-[#00828E] transition duration-300 flex items-center justify-center gap-2 text-xs shadow-md cursor-pointer"
        >
          <i class="pi pi-envelope text-xs"></i>
          <span>Email support@meetallycredit.com</span>
        </a>

        <button 
          @click="currentView = 'login'" 
          class="w-full py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-extrabold rounded-2xl transition duration-200 text-xs flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <i class="pi pi-arrow-left text-[10px]"></i>
          <span>Back to Sign In</span>
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

definePageMeta({
  layout: false
});

const route = useRoute();

// View management: 'login' | 'register' | 'forgot'
const currentView = ref(route.query.view === 'register' ? 'register' : 'login');
const selectedPlan = ref(route.query.plan || 'turbo');

onMounted(() => {
  if (route.query.view === 'plans') {
    navigateTo('/plans');
  } else if (route.query.view === 'register') {
    currentView.value = 'register';
    if (route.query.plan) {
      selectedPlan.value = route.query.plan;
    }
  }
});

watch(() => route.query, (newQuery) => {
  if (newQuery.view === 'plans') {
    navigateTo('/plans');
  } else if (newQuery.view === 'register') {
    currentView.value = 'register';
    if (newQuery.plan) {
      selectedPlan.value = newQuery.plan;
    }
  }
});

// Login Form State
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);
const error = ref('');

// Registration & Payment Form State
const regName = ref('');
const regEmail = ref('');
const regPhone = ref('');
const regPassword = ref('');
const showRegPassword = ref(false);
const regLoading = ref(false);

function selectPlan(plan) {
  selectedPlan.value = plan;
  error.value = '';
  currentView.value = 'register';
}

async function handleLogin() {
  loading.value = true;
  error.value = '';
  try {
    const res = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value
      }
    });

    if (res.success) {
      navigateTo('/');
    }
  } catch (err) {
    error.value = formatErrorMessage(err, 'Failed to authenticate. Please check your email and password.');
  } finally {
    loading.value = false;
  }
}

async function handleRegister() {
  regLoading.value = true;
  error.value = '';
  try {
    const res = await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        name: regName.value,
        email: regEmail.value,
        password: regPassword.value,
        plan_type: selectedPlan.value,
        contact_number: regPhone.value
      }
    });

    if (res.success) {
      if (selectedPlan.value === 'turbo') {
        window.location.href = 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-5BF7297880088450BNKLEPNY';
      } else {
        navigateTo('/');
      }
    }
  } catch (err) {
    error.value = formatErrorMessage(err, 'Registration failed. Please check your information and try again.');
  } finally {
    regLoading.value = false;
  }
}
</script>

<style scoped>
.animate-scale-up {
  animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.94) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
