<template>
  <div class="min-h-screen bg-gradient-to-br from-[#005F6A] via-[#00828E] to-[#00A3B0] flex items-center justify-center p-4 relative overflow-hidden font-sans">
    
    <!-- Background subtle floating circles -->
    <div class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5 blur-3xl"></div>
    <div class="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-white/5 blur-3xl"></div>

    <div class="w-full max-w-md bg-white rounded-[32px] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,95,106,0.25)] border border-neutral-100 relative z-10 animate-scale-up">
      
      <!-- Top Title with Logo (No capsule wrapper) -->
      <div class="flex flex-col items-center justify-center text-center space-y-4 mb-6">
        <img src="/Meet-ally-logo.png" alt="Meet Ally Logo" class="h-16 object-contain mx-auto" />
        <div>
          <h2 class="text-3xl font-black text-neutral-900 tracking-tight">Sign In</h2>
          <p class="text-neutral-500 text-sm mt-1">Welcome back! Please enter your details.</p>
        </div>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-5">
        
        <!-- Error Alert -->
        <Transition name="fade">
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2">
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
          <a href="#" class="text-[#00828E] hover:text-[#005F6A] transition">Forgot password?</a>
        </div>

        <!-- Submit Button -->
        <button 
          type="submit" 
          :disabled="loading"
          class="w-full py-3.5 bg-gradient-to-r from-[#00828E] to-[#00A3B0] text-white font-extrabold rounded-2xl hover:from-[#005F6A] hover:to-[#00828E] transition duration-300 flex items-center justify-center gap-2 shadow-[0_6px_24px_rgba(0,163,176,0.25)] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
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
        Don't have an account? <a href="#" class="text-[#00828E] hover:text-[#005F6A] transition">Sign up</a>
      </div>

      <!-- Support Footer -->
      <div class="mt-6 pt-6 border-t border-neutral-100 flex items-center justify-center gap-2 text-xs font-bold text-neutral-500">
        <i class="pi pi-info-circle text-neutral-400 text-sm"></i>
        <span>Having trouble logging in? <a href="#" class="text-[#00828E] hover:text-[#005F6A] transition">Contact Support</a></span>
      </div>

      <!-- Demo logins hint -->
      <div class="mt-6 p-4 bg-neutral-50 border border-neutral-200 rounded-2xl text-[10px] text-neutral-400 font-semibold space-y-1">
        <p class="text-neutral-600 font-extrabold">Demo logins:</p>
        <p>Admin: <span class="font-mono text-neutral-500">admin@remedicredit.com</span> / <span class="font-mono text-neutral-500">password</span></p>
        <p>Client: <span class="font-mono text-neutral-500">rmillscompany@gmail.com</span> / <span class="font-mono text-neutral-500">password</span></p>
      </div>

    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
});

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);
const error = ref('');

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
      navigateTo(res.user.role === 'admin' ? '/admin' : '/');
    }
  } catch (err) {
    error.value = err.data?.statusMessage || 'Failed to authenticate. Please check your credentials.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.animate-scale-up {
  animation: scaleUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(12px);
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
