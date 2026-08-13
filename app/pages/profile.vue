<template>
  <div class="animate-fade-in space-y-6 -mx-4 md:-mx-8">
    <!-- Header Block (Teal Gradient Banner) -->
    <div class="bg-gradient-to-br from-[#005F6A] to-[#00A3B0] text-white p-6 pb-16 rounded-b-[40px] shadow-[0_10px_30px_rgba(0,95,106,0.15)] relative">
      <div class="pt-2"></div>
      <div class="flex items-center justify-between gap-4 mt-6 w-full max-w-lg mx-auto">
        <div class="flex-1 bg-white/10 backdrop-blur-md border border-white/25 rounded-2xl px-4 py-3 text-[11px] md:text-xs font-semibold leading-relaxed shadow-sm text-left">
          "Hi, <span class="text-[#00D8E6] font-extrabold">{{ form.name }}</span>! You can review your account information, update your password, or change your profile picture here."
        </div>
        <img 
          src="/AllyAI.png" 
          alt="Ally AI Assistant" 
          class="h-28 w-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.25)] animate-bounce-slow shrink-0"
        />
      </div>
    </div>

    <!-- Content Area -->
    <div class="px-4 md:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Left Side: Profile Picture and Account Stats (1 Col) -->
        <div class="space-y-6">
          
          <!-- Avatar Card -->
          <div class="bg-white border border-neutral-200 rounded-[32px] p-6 shadow-sm flex flex-col items-center text-center space-y-6">
            <h3 class="font-extrabold text-lg text-neutral-900 self-start">Profile Picture</h3>
            
            <!-- Avatar Display -->
            <div class="relative group">
              <img 
                v-if="profilePicturePreview || form.profile_picture" 
                :src="profilePicturePreview || form.profile_picture" 
                alt="Profile picture" 
                class="w-32 h-32 rounded-full object-cover border-4 border-[#00A3B0]/10 shadow-md transition group-hover:scale-105 duration-300"
              />
              <div 
                v-else 
                class="w-32 h-32 rounded-full flex items-center justify-center font-black text-4xl border-4 border-[#00A3B0]/10 shadow-md uppercase"
                :class="getAvatarBgClass(form.name)"
              >
                {{ getInitials(form.name) }}
              </div>
            </div>

            <!-- Upload Controls -->
            <div class="w-full space-y-2">
              <label 
                for="avatar-upload" 
                class="w-full py-2.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border border-neutral-200 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <i class="pi pi-image text-[10px]"></i>
                Choose Photo
              </label>
              <input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                class="hidden" 
                @change="handleFileChange"
              />
              
              <button 
                v-if="selectedFile"
                @click="uploadAvatar"
                :disabled="uploading"
                class="w-full py-2.5 bg-gradient-to-r from-[#00828E] to-[#00A3B0] text-white rounded-xl text-xs font-extrabold hover:from-[#005F6A] hover:to-[#00828E] transition flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
              >
                <i :class="['pi', uploading ? 'pi-spin pi-spinner' : 'pi-upload', 'text-[10px]']"></i>
                Save Photo
              </button>
            </div>

            <!-- Role Badge -->
            <div class="pt-4 border-t border-neutral-100 w-full flex justify-between items-center text-xs font-bold text-neutral-500">
              <span>Account Plan:</span>
              <span class="px-2.5 py-0.5 rounded-full border bg-indigo-50 border-indigo-200 text-indigo-600 uppercase text-[9px] tracking-wider font-extrabold">
                {{ form.role === 'admin' ? 'Admin' : (form.plan_type || 'Starter') }}
              </span>
            </div>
          </div>
        </div>

        <!-- Right Side: Edit Form (2 Cols) -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white border border-neutral-200 rounded-[32px] p-6 md:p-8 shadow-sm space-y-6">
            <div>
              <h3 class="font-extrabold text-xl text-neutral-900">Personal Information</h3>
              <p class="text-neutral-500 text-xs mt-0.5">Edit your account details and password below</p>
            </div>

            <!-- Form -->
            <form @submit.prevent="updateProfile" class="space-y-4 pt-2 border-t border-neutral-100">
              
              <!-- Success/Error alert box -->
              <Transition name="fade">
                <div v-if="alertMsg" class="p-4 rounded-2xl text-xs font-bold border" :class="alertSuccess ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'">
                  <div class="flex items-center gap-2">
                    <i :class="['pi', alertSuccess ? 'pi-check-circle' : 'pi-exclamation-circle']"></i>
                    <span>{{ alertMsg }}</span>
                  </div>
                </div>
              </Transition>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Name -->
                <div class="space-y-1">
                  <label class="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider">Full Name</label>
                  <input 
                    v-model="form.name" 
                    type="text" 
                    required
                    placeholder="John Doe"
                    class="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A3B0]/10 focus:border-[#00A3B0] transition"
                  />
                </div>

                <!-- Email -->
                <div class="space-y-1">
                  <label class="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider">Email Address</label>
                  <input 
                    v-model="form.email" 
                    type="email" 
                    required
                    placeholder="johndoe@example.com"
                    class="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A3B0]/10 focus:border-[#00A3B0] transition"
                  />
                </div>

                <!-- Contact Number -->
                <div class="space-y-1">
                  <label class="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider">Contact Number</label>
                  <input 
                    v-model="form.contact_number" 
                    type="text" 
                    placeholder="(555) 000-0000"
                    class="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A3B0]/10 focus:border-[#00A3B0] transition"
                  />
                </div>

                <!-- SSN Last 4 (Read Only) -->
                <div class="space-y-1">
                  <label class="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider">SSN (Last 4 digits)</label>
                  <input 
                    :value="form.ssn_last4 ? `***-**-${form.ssn_last4}` : 'Not Registered'" 
                    type="text" 
                    disabled
                    class="w-full px-4 py-3 bg-neutral-100 border border-neutral-200 rounded-2xl text-sm font-semibold text-neutral-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <!-- Address Section -->
              <div class="space-y-1 pt-2">
                <label class="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider">Street Address</label>
                <input 
                  v-model="form.address" 
                  type="text" 
                  placeholder="123 Main St"
                  class="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A3B0]/10 focus:border-[#00A3B0] transition"
                />
              </div>

              <div class="grid grid-cols-3 gap-4">
                <div class="col-span-1 space-y-1">
                  <label class="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider">City</label>
                  <input 
                    v-model="form.city" 
                    type="text" 
                    placeholder="New York"
                    class="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A3B0]/10 focus:border-[#00A3B0] transition"
                  />
                </div>
                <div class="col-span-1 space-y-1">
                  <label class="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider">State</label>
                  <input 
                    v-model="form.state" 
                    type="text" 
                    placeholder="NY"
                    class="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A3B0]/10 focus:border-[#00A3B0] transition"
                  />
                </div>
                <div class="col-span-1 space-y-1">
                  <label class="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider">Zip Code</label>
                  <input 
                    v-model="form.zipcode" 
                    type="text" 
                    placeholder="10001"
                    class="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A3B0]/10 focus:border-[#00A3B0] transition"
                  />
                </div>
              </div>

              <!-- IdentityIQ credentials (if not admin) -->
              <div v-if="form.role !== 'admin'" class="space-y-4 pt-4 border-t border-neutral-100">
                <h4 class="font-extrabold text-sm text-neutral-800">IdentityIQ Integration</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="space-y-1">
                    <label class="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider">IQ Username</label>
                    <input 
                      v-model="form.identityiq_username" 
                      type="text" 
                      class="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A3B0]/10 focus:border-[#00A3B0] transition"
                    />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider">IQ Password</label>
                    <input 
                      v-model="form.identityiq_password" 
                      type="password" 
                      class="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A3B0]/10 focus:border-[#00A3B0] transition"
                    />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider">IQ Secret Answer</label>
                    <input 
                      v-model="form.identityiq_secret_answer" 
                      type="text" 
                      class="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A3B0]/10 focus:border-[#00A3B0] transition"
                    />
                  </div>
                </div>
              </div>

              <!-- Password Reset Section -->
              <div class="space-y-4 pt-4 border-t border-neutral-100">
                <h4 class="font-extrabold text-sm text-neutral-800">Change Password</h4>
                <div class="space-y-1">
                  <label class="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider">New Password (Leave blank to keep current)</label>
                  <input 
                    v-model="form.password" 
                    type="password" 
                    placeholder="Min 6 characters"
                    class="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A3B0]/10 focus:border-[#00A3B0] transition"
                  />
                </div>
              </div>

              <!-- Action buttons -->
              <div class="pt-6 border-t border-neutral-100 flex justify-end">
                <button 
                  type="submit" 
                  :disabled="updating"
                  class="px-8 py-3 bg-[#00D8E6] text-neutral-900 font-extrabold rounded-2xl hover:bg-[#00A3B0] transition duration-300 shadow-sm text-xs disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <i v-if="updating" class="pi pi-spin pi-spinner text-xs"></i>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const form = ref({
  name: '',
  email: '',
  role: 'regular',
  plan_type: null,
  profile_picture: null,
  address: '',
  city: '',
  state: '',
  zipcode: '',
  contact_number: '',
  ssn_last4: '',
  identityiq_username: '',
  identityiq_password: '',
  identityiq_secret_answer: '',
  password: ''
});

const loading = ref(false);
const updating = ref(false);
const uploading = ref(false);
const alertMsg = ref('');
const alertSuccess = ref(false);

const selectedFile = ref(null);
const profilePicturePreview = ref(null);

async function fetchProfile() {
  loading.value = true;
  try {
    const res = await $fetch('/api/user/profile');
    if (res.success) {
      // Map properties to form
      Object.assign(form.value, res.user);
      form.value.password = ''; // Keep password blank
    }
  } catch (err) {
    console.error('Failed to load profile:', err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchProfile();
});

async function updateProfile() {
  updating.value = true;
  alertMsg.value = '';
  try {
    const res = await $fetch('/api/user/profile', {
      method: 'PUT',
      body: form.value
    });
    if (res.success) {
      alertSuccess.value = true;
      alertMsg.value = 'Profile details updated successfully!';
      form.value.password = '';
      
      // Reactive reload page data
      const userCookie = useCookie('auth_user');
      userCookie.value = res.user;
    }
  } catch (err) {
    alertSuccess.value = false;
    alertMsg.value = err.data?.statusMessage || 'Failed to update profile details.';
  } finally {
    updating.value = false;
  }
}

function handleFileChange(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alertSuccess.value = false;
    alertMsg.value = 'Only image files are allowed.';
    return;
  }

  selectedFile.value = file;
  profilePicturePreview.value = URL.createObjectURL(file);
}

async function uploadAvatar() {
  if (!selectedFile.value) return;

  uploading.value = true;
  alertMsg.value = '';

  const formData = new FormData();
  formData.append('avatar', selectedFile.value);

  try {
    const res = await $fetch('/api/user/upload-avatar', {
      method: 'POST',
      body: formData
    });

    if (res.success) {
      alertSuccess.value = true;
      alertMsg.value = 'Profile picture updated successfully!';
      form.value.profile_picture = res.profile_picture;
      selectedFile.value = null;
      profilePicturePreview.value = null;

      // Update cookie reactively
      const userCookie = useCookie('auth_user');
      userCookie.value = res.user;
    }
  } catch (err) {
    alertSuccess.value = false;
    alertMsg.value = err.data?.statusMessage || 'Failed to upload profile picture.';
  } finally {
    uploading.value = false;
  }
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

<style scoped>
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

.animate-bounce-slow {
  animation: bounceSlow 3s ease-in-out infinite;
}

@keyframes bounceSlow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}
</style>
