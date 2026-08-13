<template>
  <div class="animate-fade-in space-y-6 -mx-4 md:-mx-8">
    <!-- Header Block (Teal Gradient Banner) -->
    <div class="bg-gradient-to-br from-[#005F6A] to-[#00A3B0] text-white p-6 pb-16 rounded-b-[40px] shadow-[0_10px_30px_rgba(0,95,106,0.15)] relative">
      <div class="pt-2"></div>
      <div class="flex items-center justify-between gap-4 mt-6 w-full max-w-lg mx-auto">
        <div class="flex-1 bg-white/10 backdrop-blur-md border border-white/25 rounded-2xl px-4 py-3 text-[11px] md:text-xs font-semibold leading-relaxed shadow-sm text-left">
          "Manage client accounts, reset passwords, and update subscription plans from this panel."
        </div>
        <img 
          src="/AllyAI.png" 
          alt="Ally AI Assistant" 
          class="h-28 w-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.25)] animate-bounce-slow shrink-0"
        />
      </div>
    </div>

    <!-- Content Area -->
    <div class="px-4 md:px-8 space-y-6">

      <!-- User Management Table Card -->
      <div class="bg-white border border-neutral-200 rounded-[32px] p-6 shadow-sm space-y-6">

        <!-- Card Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 class="font-extrabold text-xl text-neutral-900">User Management</h3>
            <p class="text-neutral-500 text-xs mt-0.5">Reset passwords, update plans, and manage accounts</p>
          </div>
          <span class="text-xs text-neutral-600 bg-emerald-50 border border-emerald-100 px-3.5 py-1 rounded-full font-bold flex items-center gap-1.5 shadow-sm">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            {{ users.length }} Accounts
          </span>
        </div>

        <!-- Controls -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-neutral-100">
          <div class="relative w-full sm:w-64">
            <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
              <i class="pi pi-search text-xs"></i>
            </span>
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search by name or email..." 
              class="w-full pl-9 pr-4 py-2.5 bg-neutral-50/50 border border-neutral-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A3B0]/10 focus:border-[#00A3B0] transition"
            />
          </div>
          <div class="flex items-center justify-end gap-3 text-xs font-bold">
            <button 
              @click="loadUsers" 
              :disabled="loading"
              class="p-2.5 bg-white border border-neutral-200 text-neutral-500 hover:text-neutral-700 rounded-xl hover:bg-neutral-50 transition cursor-pointer disabled:opacity-50 shadow-sm"
            >
              <i :class="['pi', loading ? 'pi-spin pi-spinner' : 'pi-refresh', 'text-xs']"></i>
            </button>
            <span class="text-neutral-500 font-extrabold px-1">{{ currentPage }} of {{ totalPages || 1 }}</span>
            <div class="flex items-center gap-1 border border-neutral-200 rounded-xl bg-white p-1.5 shadow-sm">
              <button @click="prevPage" :disabled="currentPage === 1" class="p-1 rounded-lg text-neutral-500 hover:bg-neutral-50 disabled:opacity-30 cursor-pointer">
                <i class="pi pi-chevron-left text-[10px]"></i>
              </button>
              <button @click="nextPage" :disabled="currentPage >= totalPages" class="p-1 rounded-lg text-neutral-500 hover:bg-neutral-50 disabled:opacity-30 cursor-pointer">
                <i class="pi pi-chevron-right text-[10px]"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- User List (Desktop view, hidden on mobile) -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-neutral-100 text-neutral-400 text-[10px] font-extrabold uppercase tracking-wider bg-neutral-50/30">
                <th class="py-3 px-4">User</th>
                <th class="py-3 px-4">IdentityIQ Credentials</th>
                <th class="py-3 px-4 text-center">Manage</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100 text-xs font-semibold">
              <tr v-for="u in paginatedUsers" :key="u.id" class="hover:bg-neutral-50/30 transition">
                <!-- Avatar + Name + Plan -->
                <td class="py-4 px-4 flex items-center gap-3">
                  <div class="relative w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-[11px] shrink-0 uppercase border border-neutral-100" :class="getAvatarBgClass(u.name)">
                    {{ getInitials(u.name) }}
                    <span 
                      class="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white"
                      :class="u.registration_status === 'completed' ? 'bg-emerald-500' : 'bg-amber-400'"
                    ></span>
                  </div>
                  <div>
                    <span class="font-extrabold text-neutral-900 block">{{ u.name }}</span>
                    <span class="text-[10px] text-neutral-400 font-semibold block mt-0.5">{{ u.email }}</span>
                  </div>
                </td>

                <!-- IdentityIQ Credentials Column -->
                <td class="py-4 px-4">
                  <div v-if="u.role === 'admin'" class="text-[10px] text-neutral-400 font-semibold italic">
                    Administrator Account
                  </div>
                  <div v-else-if="u.identityiq_username || u.identityiq_password" class="space-y-1 text-[10px] text-neutral-500 font-bold">
                    <div>
                      <span class="text-neutral-400">User:</span> 
                      <span class="font-mono text-neutral-800 ml-1">{{ u.identityiq_username || '---' }}</span>
                    </div>
                    <div>
                      <span class="text-[#00828E]">Pass:</span> 
                      <span class="font-mono text-neutral-800 ml-1 bg-neutral-50 px-1.5 py-0.5 rounded border border-neutral-200">{{ u.identityiq_password || '---' }}</span>
                    </div>
                    <div v-if="u.identityiq_secret_answer">
                      <span class="text-neutral-400">Secret:</span> 
                      <span class="font-mono text-neutral-800 ml-1">{{ u.identityiq_secret_answer }}</span>
                    </div>
                  </div>
                  <div v-else class="text-[10px] text-neutral-400 font-semibold italic">
                    No credentials registered
                  </div>
                </td>

                <!-- Management Actions -->
                <td class="py-4 px-4 text-center">
                  <div class="flex items-center justify-center gap-2 flex-wrap">
                    <button 
                      @click="openResetPassword(u)" 
                      class="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-xl text-[10px] font-extrabold transition cursor-pointer flex items-center gap-1"
                    >
                      <i class="pi pi-lock text-[10px]"></i>
                      Reset PW
                    </button>
                    <button 
                      v-if="u.role !== 'admin'"
                      @click="openChangePlan(u)" 
                      class="px-2.5 py-1.5 bg-[#00A3B0]/10 hover:bg-[#00A3B0]/20 text-[#00828E] border border-[#00A3B0]/20 rounded-xl text-[10px] font-extrabold transition cursor-pointer flex items-center gap-1"
                    >
                      <i class="pi pi-sync text-[10px]"></i>
                      Plan
                    </button>
                    <button 
                      v-if="u.role !== 'admin'"
                      @click="confirmDelete(u)" 
                      class="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-[10px] font-extrabold transition cursor-pointer flex items-center gap-1"
                    >
                      <i class="pi pi-trash text-[10px]"></i>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredUsers.length === 0">
                <td colspan="3" class="py-8 text-center text-neutral-400 font-semibold">
                  No users found matching the search.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile view: Stack of user info cards (hidden on desktop, visible on mobile) -->
        <div class="md:hidden space-y-4">
          <div v-for="u in paginatedUsers" :key="u.id" class="bg-neutral-50/70 border border-neutral-200 rounded-3xl p-5 space-y-4">
            
            <!-- User avatar + Info header -->
            <div class="flex items-center gap-3">
              <div class="relative w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 uppercase border border-neutral-200 bg-white" :class="getAvatarBgClass(u.name)">
                {{ getInitials(u.name) }}
                <span 
                  class="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white"
                  :class="u.registration_status === 'completed' ? 'bg-emerald-500' : 'bg-amber-400'"
                ></span>
              </div>
              <div class="min-w-0">
                <span class="font-extrabold text-neutral-900 block truncate">{{ u.name }}</span>
                <span class="text-[10px] text-neutral-400 font-semibold block truncate mt-0.5">{{ u.email }}</span>
              </div>
            </div>

            <!-- Credentials Block -->
            <div class="p-3.5 bg-white border border-neutral-100 rounded-2xl space-y-2">
              <span class="text-[9px] text-neutral-400 font-extrabold uppercase tracking-wider block">IdentityIQ Credentials</span>
              <div v-if="u.role === 'admin'" class="text-[10px] text-neutral-400 font-semibold italic pt-1">
                Administrator Account
              </div>
              <div v-else-if="u.identityiq_username || u.identityiq_password" class="space-y-1.5 text-[10px] text-neutral-500 font-bold pt-1">
                <div class="flex justify-between">
                  <span class="text-neutral-400">Username:</span> 
                  <span class="font-mono text-neutral-800">{{ u.identityiq_username || '---' }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-neutral-400">Password:</span> 
                  <span class="font-mono text-neutral-800 bg-neutral-50 px-1.5 py-0.5 rounded border border-neutral-200">{{ u.identityiq_password || '---' }}</span>
                </div>
                <div v-if="u.identityiq_secret_answer" class="flex justify-between">
                  <span class="text-neutral-400">Secret Answer:</span> 
                  <span class="font-mono text-neutral-800">{{ u.identityiq_secret_answer }}</span>
                </div>
              </div>
              <div v-else class="text-[10px] text-neutral-400 font-semibold italic pt-1">
                No credentials registered
              </div>
            </div>

            <!-- Action buttons grid -->
            <div class="flex items-center gap-2 pt-1.5">
              <button 
                @click="openResetPassword(u)" 
                class="flex-1 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-xl text-[10px] font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <i class="pi pi-lock text-[10px]"></i>
                Reset PW
              </button>
              <button 
                v-if="u.role !== 'admin'"
                @click="openChangePlan(u)" 
                class="flex-1 py-2 bg-[#00A3B0]/10 hover:bg-[#00A3B0]/20 text-[#00828E] border border-[#00A3B0]/20 rounded-xl text-[10px] font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <i class="pi pi-sync text-[10px]"></i>
                Plan
              </button>
              <button 
                v-if="u.role !== 'admin'"
                @click="confirmDelete(u)" 
                class="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-[10px] font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <i class="pi pi-trash text-[10px]"></i>
                Delete
              </button>
            </div>
          </div>
          
          <div v-if="filteredUsers.length === 0" class="py-8 text-center text-neutral-400 font-semibold bg-neutral-50 rounded-3xl border border-neutral-200">
            No users found matching the search.
          </div>
        </div>
      </div>

      <!-- Reset Password Modal -->
      <Teleport to="body">
        <Transition name="fade">
          <div v-if="showResetModal" class="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showResetModal = false">
            <div class="bg-white rounded-[28px] p-8 w-full max-w-md shadow-2xl space-y-5 animate-scale-up">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                  <i class="pi pi-lock text-amber-600"></i>
                </div>
                <div>
                  <h4 class="font-extrabold text-neutral-900">Reset Password</h4>
                  <p class="text-[10px] text-neutral-500 font-semibold">{{ selectedUser?.name }} ({{ selectedUser?.email }})</p>
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-extrabold text-neutral-700 uppercase tracking-wider">New Password</label>
                <input 
                  v-model="newPassword" 
                  type="password" 
                  placeholder="Min 6 characters"
                  class="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>

              <Transition name="fade">
                <p v-if="modalMessage" class="text-xs font-bold px-3 py-2 rounded-xl" :class="modalSuccess ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'">
                  {{ modalMessage }}
                </p>
              </Transition>

              <div class="flex gap-3">
                <button @click="showResetModal = false" class="flex-1 py-2.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-extrabold text-neutral-600 hover:bg-neutral-100 transition cursor-pointer">Cancel</button>
                <button @click="submitResetPassword" :disabled="actionLoading" class="flex-1 py-2.5 bg-amber-500 text-white rounded-2xl text-xs font-extrabold hover:bg-amber-600 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5">
                  <i v-if="actionLoading" class="pi pi-spin pi-spinner text-[10px]"></i>
                  Reset
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- Change Plan Modal -->
      <Teleport to="body">
        <Transition name="fade">
          <div v-if="showPlanModal" class="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showPlanModal = false">
            <div class="bg-white rounded-[28px] p-8 w-full max-w-md shadow-2xl space-y-5 animate-scale-up">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-[#00A3B0]/10 border border-[#00A3B0]/20 flex items-center justify-center">
                  <i class="pi pi-sync text-[#00828E]"></i>
                </div>
                <div>
                  <h4 class="font-extrabold text-neutral-900">Change Plan</h4>
                  <p class="text-[10px] text-neutral-500 font-semibold">{{ selectedUser?.name }} — Current: <span class="uppercase font-extrabold text-neutral-700">{{ selectedUser?.plan_type || 'None' }}</span></p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <button 
                  @click="selectedPlan = 'starter'" 
                  class="p-4 border-2 rounded-2xl text-center transition cursor-pointer"
                  :class="selectedPlan === 'starter' ? 'border-[#00A3B0] bg-[#00A3B0]/5' : 'border-neutral-200 hover:border-neutral-300'"
                >
                  <span class="text-xs font-extrabold text-neutral-900 block">Standard</span>
                  <span class="text-[10px] text-neutral-500 font-semibold">Starter Plan</span>
                </button>
                <button 
                  @click="selectedPlan = 'turbo'" 
                  class="p-4 border-2 rounded-2xl text-center transition cursor-pointer"
                  :class="selectedPlan === 'turbo' ? 'border-indigo-500 bg-indigo-50/50' : 'border-neutral-200 hover:border-neutral-300'"
                >
                  <span class="text-xs font-extrabold text-neutral-900 block">Pro</span>
                  <span class="text-[10px] text-neutral-500 font-semibold">Turbo Plan</span>
                </button>
              </div>

              <Transition name="fade">
                <p v-if="modalMessage" class="text-xs font-bold px-3 py-2 rounded-xl" :class="modalSuccess ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'">
                  {{ modalMessage }}
                </p>
              </Transition>

              <div class="flex gap-3">
                <button @click="showPlanModal = false" class="flex-1 py-2.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-extrabold text-neutral-600 hover:bg-neutral-100 transition cursor-pointer">Cancel</button>
                <button @click="submitChangePlan" :disabled="actionLoading" class="flex-1 py-2.5 bg-gradient-to-r from-[#00828E] to-[#00A3B0] text-white rounded-2xl text-xs font-extrabold hover:from-[#005F6A] hover:to-[#00828E] transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5">
                  <i v-if="actionLoading" class="pi pi-spin pi-spinner text-[10px]"></i>
                  Update Plan
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- Delete Confirmation Modal -->
      <Teleport to="body">
        <Transition name="fade">
          <div v-if="showDeleteModal" class="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showDeleteModal = false">
            <div class="bg-white rounded-[28px] p-8 w-full max-w-md shadow-2xl space-y-5 animate-scale-up">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center">
                  <i class="pi pi-trash text-red-600"></i>
                </div>
                <div>
                  <h4 class="font-extrabold text-neutral-900">Delete Account</h4>
                  <p class="text-[10px] text-neutral-500 font-semibold">This action cannot be undone.</p>
                </div>
              </div>

              <p class="text-xs text-neutral-700 font-semibold bg-red-50 border border-red-100 p-3 rounded-2xl">
                Are you sure you want to permanently delete <span class="font-extrabold text-red-600">{{ selectedUser?.name }}</span> ({{ selectedUser?.email }})?
              </p>

              <Transition name="fade">
                <p v-if="modalMessage" class="text-xs font-bold px-3 py-2 rounded-xl" :class="modalSuccess ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'">
                  {{ modalMessage }}
                </p>
              </Transition>

              <div class="flex gap-3">
                <button @click="showDeleteModal = false" class="flex-1 py-2.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-extrabold text-neutral-600 hover:bg-neutral-100 transition cursor-pointer">Cancel</button>
                <button @click="submitDelete" :disabled="actionLoading" class="flex-1 py-2.5 bg-red-500 text-white rounded-2xl text-xs font-extrabold hover:bg-red-600 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5">
                  <i v-if="actionLoading" class="pi pi-spin pi-spinner text-[10px]"></i>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

const users = ref([]);
const loading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);

// Modal states
const showResetModal = ref(false);
const showPlanModal = ref(false);
const showDeleteModal = ref(false);
const selectedUser = ref(null);
const newPassword = ref('');
const selectedPlan = ref('starter');
const actionLoading = ref(false);
const modalMessage = ref('');
const modalSuccess = ref(false);

// Load users from admin analytics endpoint
async function loadUsers() {
  loading.value = true;
  try {
    const res = await $fetch('/api/admin/analytics');
    if (res.success) {
      users.value = res.clients;
    }
  } catch (err) {
    console.error('Failed to load users:', err);
  } finally {
    loading.value = false;
  }
}

// Search & pagination
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;
  const q = searchQuery.value.toLowerCase();
  return users.value.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
});

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / 10) || 1);
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * 10;
  return filteredUsers.value.slice(start, start + 10);
});

watch(searchQuery, () => { currentPage.value = 1; });
function prevPage() { if (currentPage.value > 1) currentPage.value--; }
function nextPage() { if (currentPage.value < totalPages.value) currentPage.value++; }

// Modal openers
function openResetPassword(user) {
  selectedUser.value = user;
  newPassword.value = '';
  modalMessage.value = '';
  showResetModal.value = true;
}

function openChangePlan(user) {
  selectedUser.value = user;
  selectedPlan.value = user.plan_type || 'starter';
  modalMessage.value = '';
  showPlanModal.value = true;
}

function confirmDelete(user) {
  selectedUser.value = user;
  modalMessage.value = '';
  showDeleteModal.value = true;
}

// API actions
async function submitResetPassword() {
  actionLoading.value = true;
  modalMessage.value = '';
  try {
    const res = await $fetch('/api/admin/manage-user', {
      method: 'POST',
      body: { action: 'reset-password', userId: selectedUser.value.id, newPassword: newPassword.value }
    });
    modalSuccess.value = true;
    modalMessage.value = res.message;
    setTimeout(() => { showResetModal.value = false; }, 1200);
  } catch (err) {
    modalSuccess.value = false;
    modalMessage.value = err.data?.statusMessage || 'Failed to reset password.';
  } finally {
    actionLoading.value = false;
  }
}

async function submitChangePlan() {
  actionLoading.value = true;
  modalMessage.value = '';
  try {
    const res = await $fetch('/api/admin/manage-user', {
      method: 'POST',
      body: { action: 'update-plan', userId: selectedUser.value.id, newPlan: selectedPlan.value }
    });
    modalSuccess.value = true;
    modalMessage.value = res.message;
    await loadUsers(); // Refresh list
    setTimeout(() => { showPlanModal.value = false; }, 1200);
  } catch (err) {
    modalSuccess.value = false;
    modalMessage.value = err.data?.statusMessage || 'Failed to update plan.';
  } finally {
    actionLoading.value = false;
  }
}

async function submitDelete() {
  actionLoading.value = true;
  modalMessage.value = '';
  try {
    const res = await $fetch('/api/admin/manage-user', {
      method: 'POST',
      body: { action: 'delete', userId: selectedUser.value.id }
    });
    modalSuccess.value = true;
    modalMessage.value = res.message;
    await loadUsers(); // Refresh list
    setTimeout(() => { showDeleteModal.value = false; }, 1200);
  } catch (err) {
    modalSuccess.value = false;
    modalMessage.value = err.data?.statusMessage || 'Failed to delete user.';
  } finally {
    actionLoading.value = false;
  }
}

// Avatar helpers
function getInitials(name) {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
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
  for (let i = 0; i < (name?.length || 0); i++) sum += name.charCodeAt(i);
  return colors[sum % colors.length];
}

onMounted(() => { loadUsers(); });
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
  animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
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
