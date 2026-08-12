<template>
  <div class="min-h-screen bg-neutral-900 text-white font-sans flex flex-col md:flex-row">
    <!-- 1. DESKTOP SIDEBAR NAVIGATION (hidden on mobile, flex on desktop) -->
    <aside class="hidden md:flex flex-col w-64 bg-neutral-950 border-r border-neutral-800 shrink-0 h-screen sticky top-0 no-print">
      <!-- Brand Logo / Title -->
      <div class="p-6 border-b border-neutral-800 flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-[#00D8E6] flex items-center justify-center shadow-[0_0_15px_rgba(0,216,230,0.4)]">
          <i class="pi pi-shield text-neutral-900 font-bold"></i>
        </div>
        <div>
          <h1 class="font-bold text-lg leading-tight tracking-wide bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Credit Remedi
          </h1>
          <span class="text-xs text-[#00D8E6] font-medium tracking-widest uppercase">Engine v2</span>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 p-4 flex flex-col gap-2">
        <NuxtLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group"
          :class="isActive(item.path) ? 'bg-[#00D8E6]/10 text-[#00D8E6] font-semibold border border-[#00D8E6]/20' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'"
        >
          <i :class="[item.icon, 'text-lg transition-transform group-hover:scale-110']"></i>
          <span>{{ item.name }}</span>
        </NuxtLink>
      </nav>

      <!-- Footer Info -->
      <div class="p-6 border-t border-neutral-800 text-xs text-neutral-500">
        <p>Logged in as Customer</p>
        <p class="mt-1">Status: Active Plan</p>
      </div>
    </aside>

    <!-- 2. MOBILE HEADER BAR -->
    <header class="md:hidden bg-neutral-950 border-b border-neutral-800 px-6 py-4 flex items-center justify-between no-print sticky top-0 z-40">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-[#00D8E6] flex items-center justify-center">
          <i class="pi pi-shield text-neutral-900 font-bold"></i>
        </div>
        <span class="font-bold text-lg">Credit Remedi</span>
      </div>
      <span class="text-xs px-2 py-1 rounded bg-neutral-900 text-[#00D8E6] border border-[#00D8E6]/20">Active</span>
    </header>

    <!-- 3. MAIN PAGE WRAPPER -->
    <main class="flex-1 flex flex-col min-h-0 min-w-0 pb-20 md:pb-0">
      <div class="p-4 md:p-8 max-w-7xl w-full mx-auto flex-1">
        <slot />
      </div>
    </main>

    <!-- 4. MOBILE BOTTOM NAVIGATION (hidden on desktop, fixed at bottom on mobile) -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-neutral-950/90 backdrop-blur-md border-t border-neutral-800 py-2 px-6 flex justify-around items-center z-40 no-print">
      <NuxtLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-all duration-300"
        :class="isActive(item.path) ? 'text-[#00D8E6]' : 'text-neutral-500 hover:text-neutral-300'"
      >
        <i :class="[item.icon, 'text-xl']"></i>
        <span class="text-[10px] font-medium">{{ item.name }}</span>
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup>
const route = useRoute();

const navItems = [
  { name: 'Dashboard', path: '/', icon: 'pi pi-home' },
  { name: 'Upload Report', path: '/upload', icon: 'pi pi-upload' },
  { name: 'Discrepancies', path: '/discrepancies', icon: 'pi pi-table' },
  { name: 'Dispute Letters', path: '/letters', icon: 'pi pi-file-pdf' }
];

function isActive(path) {
  if (path === '/') {
    return route.path === '/';
  }
  return route.path.startsWith(path);
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
  background: #111827;
}
::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #4b5563;
}
</style>
