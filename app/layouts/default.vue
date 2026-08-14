<template>
  <div class="min-h-screen bg-neutral-50 text-neutral-800 font-sans flex flex-col md:flex-row">
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
          <div class="w-6 h-6 flex items-center justify-center shrink-0">
            <img v-if="item.icon.endsWith('.png')" :src="item.icon" alt="Icon" class="w-5 h-5 object-contain transition-transform group-hover:scale-110" />
            <i v-else :class="[item.icon, 'text-lg transition-transform group-hover:scale-110']"></i>
          </div>
          <span>{{ item.name }}</span>
        </NuxtLink>
      </nav>

      <!-- Footer Info (RBAC User Status & Logout) -->
      <div v-if="user" class="p-5 border-t border-neutral-200 space-y-4">
        <div class="flex items-center gap-3">
          <img v-if="user.profile_picture" :src="user.profile_picture" alt="Avatar" class="w-9 h-9 rounded-full object-cover border border-neutral-200 shrink-0" />
          <div v-else class="w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-[11px] shrink-0 uppercase border border-neutral-100" :class="getAvatarBgClass(user.name)">
            {{ getInitials(user.name) }}
          </div>
          <div class="text-xs text-neutral-500 min-w-0 flex-1">
            <p class="font-extrabold text-neutral-800 truncate">{{ user.name }}</p>
            <p class="text-[10px] text-neutral-400 font-medium truncate">{{ user.email }}</p>
          </div>
        </div>
        <div class="text-xs text-neutral-500">
          <p class="font-bold uppercase tracking-wider text-[9px]" :class="user.role === 'admin' ? 'text-slate-600' : 'text-[#00828E]'">
            {{ user.role }} Plan: {{ user.plan_type || 'None' }}
          </p>
        </div>
      </div>
    </aside>

    <!-- 2. MOBILE HEADER BAR (REMOVED) -->

    <!-- 3. MAIN PAGE WRAPPER -->
    <main class="flex-1 flex flex-col min-h-0 min-w-0 pb-20 md:pb-0">
      <div class="p-4 md:p-8 max-w-7xl w-full mx-auto flex-1">
        <slot />
      </div>
    </main>

    <!-- 4. MOBILE BOTTOM NAVIGATION -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-neutral-200 py-2 px-4 flex justify-around items-center z-40 no-print shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
      <NuxtLink
        v-for="item in mobileNavItems"
        :key="item.path"
        :to="item.path"
        class="flex-1 flex flex-col items-center gap-1 py-1 px-1 rounded-lg transition-all duration-300 min-w-0"
        :class="isActive(item.path) ? 'text-[#00828E] font-bold' : 'text-neutral-400 hover:text-neutral-600'"
      >
        <div class="w-6 h-6 flex items-center justify-center shrink-0">
          <img v-if="item.icon.endsWith('.png')" :src="item.icon" alt="Icon" class="w-5 h-5 object-contain" />
          <i v-else :class="[item.icon, 'text-lg']"></i>
        </div>
        <span class="text-[10px] font-semibold truncate w-full text-center">{{ item.name }}</span>
      </NuxtLink>

      <!-- More Button -->
      <button
        @click="showMoreMenu = !showMoreMenu"
        class="flex-1 flex flex-col items-center gap-1 py-1 px-1 rounded-lg transition-all duration-300 min-w-0 cursor-pointer"
        :class="showMoreMenu ? 'text-[#00828E] font-bold' : 'text-neutral-400 hover:text-neutral-600'"
      >
        <div class="w-6 h-6 flex items-center justify-center shrink-0">
          <i class="pi pi-ellipsis-h text-lg"></i>
        </div>
        <span class="text-[10px] font-semibold">More</span>
      </button>
    </nav>

    <!-- More Menu Overlay -->
    <Transition name="slide-up">
      <div v-if="showMoreMenu" class="md:hidden fixed inset-0 z-50" @click.self="showMoreMenu = false">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="showMoreMenu = false"></div>
        <!-- Drawer -->
        <div class="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl border-t border-neutral-200 shadow-xl p-5 pb-8 space-y-2">
          <div class="w-10 h-1 bg-neutral-200 rounded-full mx-auto mb-4"></div>
          <NuxtLink
            v-for="item in moreMenuItems"
            :key="item.path"
            :to="item.path"
            @click="showMoreMenu = false"
            class="flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200"
            :class="isActive(item.path) ? 'bg-[#00A3B0]/10 text-[#00828E] font-bold border border-[#00A3B0]/20' : 'text-neutral-600 hover:bg-neutral-50'"
          >
            <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" :class="isActive(item.path) ? 'bg-[#00A3B0]/15' : 'bg-neutral-100'">
              <i :class="[item.icon, 'text-base']"></i>
            </div>
            <span class="text-sm font-semibold">{{ item.name }}</span>
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const route = useRoute();
const user = useCookie('auth_user');
const showMoreMenu = ref(false);

// Sidebar nav (desktop) — full list
const navItems = computed(() => {
  if (user.value && user.value.role === 'admin') {
    return [
      { name: 'Dashboard', path: '/', icon: 'pi pi-home' },
      { name: 'Ally', path: '/credits', icon: '/AllyAI.png' },
      { name: 'User', path: '/users', icon: 'pi pi-users' },
      { name: 'Waitlist', path: '/waitlist', icon: 'pi pi-list' },
      { name: 'Resources', path: '/resources', icon: 'pi pi-book' },
      { name: 'Profile', path: '/profile', icon: 'pi pi-user' }
    ];
  }
  return [
    { name: 'Dashboard', path: '/', icon: 'pi pi-home' },
    { name: 'Ally', path: '/upload', icon: '/AllyAI.png' },
    { name: 'Conflicts', path: '/discrepancies', icon: 'pi pi-table' },
    { name: 'Letters', path: '/letters', icon: 'pi pi-file-pdf' },
    { name: 'Fundability', path: '/fundability', icon: 'pi pi-verified' },
    { name: 'Resources', path: '/resources', icon: 'pi pi-book' },
    { name: 'Profile', path: '/profile', icon: 'pi pi-user' }
  ];
});

// Mobile bottom bar — compact 5 items with short labels
const mobileNavItems = computed(() => {
  if (user.value && user.value.role === 'admin') {
    return [
      { name: 'Home', path: '/', icon: 'pi pi-home' },
      { name: 'Ally', path: '/credits', icon: '/AllyAI.png' },
      { name: 'Users', path: '/users', icon: 'pi pi-users' },
      { name: 'Resources', path: '/resources', icon: 'pi pi-book' },
      { name: 'Profile', path: '/profile', icon: 'pi pi-user' }
    ];
  }
  return [
    { name: 'Home', path: '/', icon: 'pi pi-home' },
    { name: 'Ally', path: '/upload', icon: '/AllyAI.png' },
    { name: 'Conflicts', path: '/discrepancies', icon: 'pi pi-table' },
    { name: 'Letters', path: '/letters', icon: 'pi pi-file-pdf' },
    { name: 'Funding', path: '/fundability', icon: 'pi pi-verified' }
  ];
});

// Items shown in the "More" slide-up drawer on mobile
const moreMenuItems = computed(() => {
  if (user.value && user.value.role === 'admin') {
    return [
      { name: 'Waitlist', path: '/waitlist', icon: 'pi pi-list' },
    ];
  }
  return [
    { name: 'Resources', path: '/resources', icon: 'pi pi-book' },
    { name: 'Profile', path: '/profile', icon: 'pi pi-user' },
  ];
});

function isActive(path) {
  if (path === '/') {
    return route.path === '/';
  }
  return route.path.startsWith(path);
}


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

/* Slide-up transition for More menu */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(100%);
}
</style>
