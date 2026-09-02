<template>
  <Transition name="slide-down">
    <div 
      v-if="announcement && !dismissed" 
      class="w-full px-4 sm:px-6 py-2.5 sm:py-3 shadow-md transition-all duration-300 relative z-30 border-b backdrop-blur-md"
      :class="bannerBgClass"
    >
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        
        <!-- Left: Icon + Badge + Message -->
        <div class="flex items-center gap-2.5 min-w-0 flex-1 w-full sm:w-auto text-left">
          <div class="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 shadow-xs" :class="iconBgClass">
            <i :class="[bannerIcon, 'text-[11px] font-bold']"></i>
          </div>

          <div class="flex flex-wrap items-center gap-2 min-w-0 flex-1">
            <span v-if="announcement.title" class="font-extrabold uppercase tracking-wider text-[9px] px-2.5 py-0.5 rounded-full shrink-0 shadow-2xs" :class="badgeClass">
              {{ announcement.title }}
            </span>
            <p class="font-semibold text-xs leading-snug truncate sm:whitespace-normal" :class="textColorClass">
              {{ announcement.message }}
            </p>
          </div>
        </div>

        <!-- Right: CTA Button + Dismiss -->
        <div class="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
          <a 
            v-if="announcement.cta_label && announcement.cta_url" 
            :href="announcement.cta_url"
            :target="announcement.cta_url.startsWith('http') ? '_blank' : '_self'"
            rel="noopener noreferrer"
            class="px-4 py-1.5 rounded-xl font-extrabold text-xs transition-all duration-200 shadow-sm flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] cursor-pointer w-full sm:w-auto text-center"
            :class="btnClass"
          >
            <span>{{ cleanCtaLabel(announcement.cta_label) }}</span>
            <i class="pi pi-arrow-right text-[10px]"></i>
          </a>

          <button 
            @click="dismissBanner" 
            class="p-1 rounded-lg opacity-70 hover:opacity-100 hover:bg-white/10 transition cursor-pointer shrink-0"
            :class="textColorClass"
            title="Dismiss Announcement"
          >
            <i class="pi pi-times text-xs"></i>
          </button>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const announcement = ref(null);
const dismissed = ref(false);

async function fetchAnnouncement() {
  try {
    const res = await $fetch('/api/announcements/active');
    if (res.success && res.announcement) {
      announcement.value = res.announcement;
      // Check session storage if previously dismissed for this session
      const dismissedId = sessionStorage.getItem('dismissed_announcement_id');
      if (dismissedId === String(res.announcement.id)) {
        dismissed.value = true;
      }
    }
  } catch (err) {
    // Non-fatal
  }
}

function dismissBanner() {
  dismissed.value = true;
  if (announcement.value) {
    sessionStorage.setItem('dismissed_announcement_id', String(announcement.value.id));
  }
}

function cleanCtaLabel(label) {
  if (!label) return '';
  return label.replace(/\s*(?:→|->|›|>)\s*$/g, '').trim();
}

const bannerBgClass = computed(() => {
  switch (announcement.value?.alert_type) {
    case 'promo':
      return 'bg-gradient-to-r from-[#005F6A] via-[#00828E] to-[#00A3B0] text-white border-b border-teal-400/30';
    case 'warning':
      return 'bg-amber-500 text-neutral-900 border-b border-amber-600/30';
    case 'info':
      return 'bg-indigo-600 text-white border-b border-indigo-500/30';
    case 'success':
      return 'bg-emerald-600 text-white border-b border-emerald-500/30';
    default:
      return 'bg-neutral-900 text-white border-b border-neutral-700';
  }
});

const iconBgClass = computed(() => {
  switch (announcement.value?.alert_type) {
    case 'promo': return 'bg-white/20 text-[#00D8E6]';
    case 'warning': return 'bg-neutral-900/20 text-neutral-900';
    case 'info': return 'bg-white/20 text-indigo-100';
    case 'success': return 'bg-white/20 text-emerald-100';
    default: return 'bg-white/10 text-white';
  }
});

const bannerIcon = computed(() => {
  switch (announcement.value?.alert_type) {
    case 'promo': return 'pi pi-bolt';
    case 'warning': return 'pi pi-exclamation-triangle';
    case 'info': return 'pi pi-megaphone';
    case 'success': return 'pi pi-check-circle';
    default: return 'pi pi-bell';
  }
});

const badgeClass = computed(() => {
  switch (announcement.value?.alert_type) {
    case 'promo': return 'bg-white/20 text-white border border-white/20';
    case 'warning': return 'bg-neutral-900 text-amber-300';
    case 'info': return 'bg-white/20 text-white';
    case 'success': return 'bg-white/20 text-white';
    default: return 'bg-white/20 text-white';
  }
});

const textColorClass = computed(() => {
  switch (announcement.value?.alert_type) {
    case 'warning': return 'text-neutral-900';
    default: return 'text-white';
  }
});

const btnClass = computed(() => {
  switch (announcement.value?.alert_type) {
    case 'promo':
      return 'bg-[#00D8E6] text-neutral-900 hover:bg-white';
    case 'warning':
      return 'bg-neutral-900 text-white hover:bg-neutral-800';
    case 'info':
    case 'success':
      return 'bg-white text-neutral-900 hover:bg-neutral-100';
    default:
      return 'bg-white text-neutral-900 hover:bg-neutral-100';
  }
});

onMounted(() => {
  fetchAnnouncement();
});
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
</style>
