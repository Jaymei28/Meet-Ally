<template>
  <div class="min-h-screen bg-neutral-50 text-neutral-800 font-sans flex flex-col md:flex-row">
    <!-- Splash Screen Loader Overlay -->
    <Transition name="fade-loader">
      <div v-if="showLoader" class="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center space-y-4">
        <div class="flex flex-col items-center justify-center">
          <img src="/Meet-ally-logo.png" alt="Meet Ally Logo" class="h-16 object-contain animate-pulse-logo" />
          <div class="mt-8 w-8 h-8 border-2 border-neutral-100 border-t-[#00A3B0] rounded-full animate-spin"></div>
        </div>
      </div>
    </Transition>
    <!-- 1. DESKTOP SIDEBAR NAVIGATION (hidden on mobile, flex on desktop) -->
    <aside class="hidden md:flex flex-col w-64 bg-white border-r border-neutral-200 shrink-0 h-screen sticky top-0 no-print">
      <!-- Brand Logo / Title -->
      <div class="p-6 border-b border-neutral-200 flex items-center gap-3">
        <img src="/Meet-ally-logo.png" alt="Meet Ally Logo" class="h-10 object-contain" />
        <div>
          <h1 class="font-bold text-base leading-tight tracking-wide text-neutral-900">
            Meet Ally
          </h1>
          <span class="text-[10px] text-[#00828E] font-extrabold tracking-widest uppercase">Credit Remedi</span>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 p-4 flex flex-col gap-2">
        <NuxtLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group"
          :class="isActive(item.path) ? 'bg-[#00A3B0]/10 text-[#00828E] font-semibold border border-[#00A3B0]/20' : 'text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100/50'"
        >
          <i :class="[item.icon, 'text-lg transition-transform group-hover:scale-110']"></i>
          <span>{{ item.name }}</span>
        </NuxtLink>
      </nav>

      <!-- Footer Info (RBAC User Status & Logout) -->
      <div v-if="user" class="p-5 border-t border-neutral-200 space-y-4">
        <div class="text-xs text-neutral-500">
          <p class="font-extrabold text-neutral-800">{{ user.name }}</p>
          <p class="text-[10px] text-neutral-400 font-medium truncate">{{ user.email }}</p>
          <p class="mt-1.5 font-bold uppercase tracking-wider text-[9px]" :class="user.role === 'admin' ? 'text-slate-600' : 'text-[#00828E]'">
            {{ user.role }} Plan: {{ user.plan_type || 'None' }}
          </p>
        </div>
        <button 
          @click="handleLogout"
          class="w-full py-2 bg-neutral-50 hover:bg-red-50 text-neutral-600 hover:text-red-600 border border-neutral-200 hover:border-red-200 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <i class="pi pi-sign-out text-[10px]"></i>
          Logout
        </button>
      </div>
    </aside>

    <!-- 2. MOBILE HEADER BAR (REMOVED) -->

    <!-- 3. MAIN PAGE WRAPPER -->
    <main class="flex-1 flex flex-col min-h-0 min-w-0 pb-20 md:pb-0">
      <div class="p-4 md:p-8 max-w-7xl w-full mx-auto flex-1">
        <slot />
      </div>
    </main>

    <!-- 4. MOBILE BOTTOM NAVIGATION (hidden on desktop, fixed at bottom on mobile) -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-neutral-200 py-2 px-6 flex justify-around items-center z-40 no-print shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
      <NuxtLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-all duration-300"
        :class="isActive(item.path) ? 'text-[#00828E] font-bold' : 'text-neutral-400 hover:text-neutral-600'"
      >
        <i :class="[item.icon, 'text-xl']"></i>
        <span class="text-[10px] font-semibold">{{ item.name }}</span>
      </NuxtLink>
      <!-- Mobile Logout button -->
      <button 
        @click="handleLogout"
        class="flex flex-col items-center gap-1 py-1 px-3 text-neutral-400 hover:text-red-500 transition duration-300 cursor-pointer"
      >
        <i class="pi pi-sign-out text-xl"></i>
        <span class="text-[10px] font-semibold">Logout</span>
      </button>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const route = useRoute();
const showLoader = ref(true);
const user = useCookie('auth_user');

onMounted(() => {
  setTimeout(() => {
    showLoader.value = false;
  }, 1200); // 1.2s loading screen
});

const navItems = computed(() => {
  if (user.value && user.value.role === 'admin') {
    return [
      { name: 'Dashboard', path: '/', icon: 'pi pi-home' },
      { name: 'User Management', path: '/users', icon: 'pi pi-users' }
    ];
  }
  return [
    { name: 'Dashboard', path: '/', icon: 'pi pi-home' },
    { name: 'Upload Report', path: '/upload', icon: 'pi pi-upload' },
    { name: 'Discrepancies', path: '/discrepancies', icon: 'pi pi-table' },
    { name: 'Dispute Letters', path: '/letters', icon: 'pi pi-file-pdf' }
  ];
});

function isActive(path) {
  if (path === '/') {
    return route.path === '/';
  }
  return route.path.startsWith(path);
}

async function handleLogout() {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' });
    user.value = null; // Clear reactively
    navigateTo('/login');
  } catch (err) {
    console.error('Failed to log out:', err);
  }
}
</script>

<style>
/* Page transition settings */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Global scrollbars style */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #f1f5f9;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Loader transition and animation */
.fade-loader-enter-active,
.fade-loader-leave-active {
  transition: opacity 0.4s ease;
}
.fade-loader-enter-from,
.fade-loader-leave-to {
  opacity: 0;
}

@keyframes pulseLogo {
  0%, 100% {
    transform: scale(0.96);
    opacity: 0.85;
  }
  50% {
    transform: scale(1.04);
    opacity: 1;
  }
}
.animate-pulse-logo {
  animation: pulseLogo 1.6s ease-in-out infinite;
}
</style>
