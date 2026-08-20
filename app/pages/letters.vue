<template>
  <div class="space-y-8 animate-fade-in no-print">
    <!-- Header -->
    <div class="border-b border-neutral-200 pb-6 space-y-4">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-neutral-900">Dispute Letters</h1>
        <p class="text-neutral-500 mt-1">Review, refine, and print your customized bureau dispute documents.</p>
      </div>

      <!-- Submission Options Callout Banner -->
      <div class="p-4 bg-gradient-to-r from-[#00828E]/10 via-[#00A3B0]/10 to-teal-50 border border-[#00A3B0]/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-xl bg-[#00828E] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            <i class="pi pi-send text-xs"></i>
          </div>
          <div>
            <h4 class="text-xs font-black text-neutral-900 uppercase tracking-wide">Ready to submit your dispute?</h4>
            <p class="text-xs text-neutral-600 font-medium leading-relaxed mt-0.5">
              You can mail your dispute or, when available, submit it through the credit bureau’s online dispute portal.
            </p>
          </div>
        </div>

        <button 
          @click="showSubmissionModal = true"
          class="text-xs font-extrabold text-[#00828E] hover:text-[#005F6A] flex items-center gap-1.5 shrink-0 cursor-pointer bg-white px-3.5 py-2 rounded-xl border border-[#00828E]/20 shadow-xs hover:shadow transition active:scale-[0.98]"
        >
          <span>Learn about your submission options →</span>
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!letters || letters.length === 0" class="flex flex-col items-center justify-center p-16 bg-white border border-neutral-200 rounded-3xl text-center space-y-4 shadow-sm">
      <div class="w-16 h-16 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center">
        <i class="pi pi-folder-open text-2xl text-neutral-400"></i>
      </div>
      <div class="max-w-md">
        <h2 class="text-xl font-bold text-neutral-900">No Letters Drafted</h2>
        <p class="text-neutral-500 mt-1">You haven't generated any dispute letters yet. Select credit findings from the table to begin writing.</p>
      </div>
      <NuxtLink to="/discrepancies" class="px-5 py-2.5 bg-[#00D8E6] text-neutral-900 font-extrabold rounded-xl hover:bg-[#00A3B0] transition duration-300 shadow-sm">
        Review Discrepancies Table
      </NuxtLink>
    </div>

    <!-- Letters Loaded State -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- 1. Left Sidebar - Letters List -->
      <div class="lg:col-span-1 space-y-3">
        <span class="text-[10px] uppercase font-bold tracking-widest text-neutral-400 block px-1">Active Letters</span>
        <div class="flex flex-col gap-2">
          <button 
            v-for="letter in letters" 
            :key="letter.id"
            @click="selectLetter(letter)"
            class="w-full text-left p-4 rounded-2xl border transition duration-300 flex flex-col gap-1.5 shadow-sm"
            :class="selectedLetter?.id === letter.id ? 'bg-[#00A3B0]/10 border-[#00A3B0]/30 text-neutral-900' : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'"
          >
            <div class="flex justify-between items-center w-full">
              <span class="font-extrabold text-xs uppercase tracking-wider" :class="selectedLetter?.id === letter.id ? 'text-[#00828E]' : 'text-neutral-700'">
                {{ letter.credit_bureau }}
              </span>
              <div class="flex items-center gap-1.5">
                <span v-if="letter.posted_1" class="text-[8px] bg-emerald-50 border border-emerald-250 px-1 py-0.5 rounded-full text-emerald-600 font-black uppercase tracking-wider">
                  Mailed
                </span>
                <span class="text-[9px] bg-neutral-100 border px-1.5 py-0.5 rounded text-neutral-500 font-bold">
                  Rd {{ letter.phase }}
                </span>
              </div>
            </div>
            <span class="text-xs font-bold truncate w-full text-neutral-800">{{ letter.creditor_name }}</span>
            <span class="text-[9px] text-neutral-400 font-semibold">Generated {{ formatDate(letter.created_at) }}</span>
          </button>
        </div>
      </div>

      <!-- 2. Right Area - Editor and Preview -->
      <div class="lg:col-span-3 space-y-4">
        <div v-if="selectedLetter" class="bg-white border border-neutral-200 rounded-3xl p-6 space-y-6 shadow-sm">
          <!-- Editor Title & Status Actions -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
            <div class="space-y-0.5">
              <div class="flex items-center gap-2 flex-wrap">
                <h2 class="text-base sm:text-lg font-black uppercase tracking-wider text-[#005F6A]">{{ selectedLetter.credit_bureau }} Dispute Form</h2>
                <span class="text-[10px] bg-neutral-100 border border-neutral-200 text-neutral-600 font-extrabold px-2.5 py-0.5 rounded-full">
                  Round {{ selectedLetter.phase }}
                </span>
              </div>
              <p class="text-neutral-500 text-xs font-semibold">Creditor Target: {{ selectedLetter.creditor_name }}</p>
            </div>
            
            <!-- Sleek, Responsive Action Buttons -->
            <div class="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <button 
                @click="toggleEdit"
                class="flex-1 sm:flex-initial px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap active:scale-95"
              >
                <i :class="['pi', isEditing ? 'pi-eye text-[#00828E]' : 'pi-pencil text-neutral-500', 'text-[11px]']"></i>
                <span>{{ isEditing ? 'Preview' : 'Edit Text' }}</span>
              </button>
              
              <button 
                @click="toggleMailedStatus"
                :disabled="statusLoading"
                class="flex-1 sm:flex-initial px-3.5 py-2 border rounded-xl text-xs font-bold transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50 whitespace-nowrap active:scale-95"
                :class="selectedLetter.posted_1 ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100' : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'"
              >
                <i :class="['pi', statusLoading ? 'pi-spin pi-spinner' : (selectedLetter.posted_1 ? 'pi-check-circle' : 'pi-send'), 'text-[11px]']"></i>
                <span>{{ selectedLetter.posted_1 ? 'Mailed' : 'Mark as Mailed' }}</span>
              </button>

              <button 
                @click="printActiveLetter"
                class="flex-1 sm:flex-initial px-4 py-2 bg-[#00D8E6] text-neutral-900 font-extrabold rounded-xl text-xs hover:bg-[#00A3B0] transition duration-200 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer whitespace-nowrap active:scale-95"
              >
                <i class="pi pi-print text-[11px]"></i>
                <span>Print / Mail</span>
              </button>
            </div>
          </div>

          <!-- Edit Mode Textarea -->
          <div v-if="isEditing" class="space-y-4">
            <textarea 
              v-model="editorContent" 
              class="w-full h-[500px] bg-neutral-50 border border-neutral-200 rounded-2xl p-6 text-xs font-mono leading-relaxed text-neutral-800 focus:border-[#00A3B0] focus:outline-none resize-none shadow-inner"
            ></textarea>
            <div class="flex justify-end gap-3">
              <button 
                @click="saveChanges"
                :disabled="saveLoading"
                class="px-4 py-2 bg-neutral-100 border border-neutral-200 rounded-xl text-xs font-extrabold hover:bg-neutral-200 text-neutral-700 transition duration-300 flex items-center gap-2"
              >
                <i v-if="saveLoading" class="pi pi-spin pi-spinner"></i>
                <i v-else class="pi pi-save"></i>
                Save Changes
              </button>
            </div>
          </div>

          <!-- Preview Mode Layout -->
          <div v-else class="p-6 bg-neutral-50 border border-neutral-200 rounded-2xl max-w-3xl mx-auto overflow-auto max-h-[500px] scrollbar-thin shadow-inner">
            <pre class="font-mono text-[11px] leading-relaxed text-neutral-700 whitespace-pre-wrap select-text select-all font-semibold">{{ selectedLetter.letter_content }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- PRINT ONLY TARGET BLOCK (hidden on display screen, only visible inside print frames) -->
  <div v-if="selectedLetter" class="hidden print-only w-full max-w-4xl p-12 text-black bg-white font-mono text-xs leading-relaxed whitespace-pre-wrap">
    {{ selectedLetter.letter_content }}
  </div>

  <!-- Submission Options Educational Modal -->
  <Transition name="fade">
    <div v-if="showSubmissionModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="showSubmissionModal = false">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showSubmissionModal = false"></div>

      <div class="relative bg-white rounded-3xl border border-neutral-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 animate-scale-up z-10">
        <!-- Modal Header -->
        <div class="flex items-start justify-between border-b border-neutral-100 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-[#00A3B0]/10 border border-[#00A3B0]/20 flex items-center justify-center shrink-0 text-[#00828E]">
              <i class="pi pi-send text-base"></i>
            </div>
            <div>
              <h3 class="text-lg font-black text-neutral-900">Dispute Submission Options</h3>
              <p class="text-xs text-neutral-500 font-medium">How to submit your dispute letters to the credit bureaus</p>
            </div>
          </div>
          <button @click="showSubmissionModal = false" class="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-xl hover:bg-neutral-100 transition cursor-pointer">
            <i class="pi pi-times text-sm"></i>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="space-y-5">
          <!-- 1. Mail Your Dispute -->
          <div class="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-[#00828E] text-white text-[11px] font-black flex items-center justify-center shrink-0">1</span>
              <h4 class="text-xs font-extrabold text-neutral-900 uppercase tracking-wide">Mail Your Dispute</h4>
            </div>
            <p class="text-xs text-neutral-600 leading-relaxed font-medium pl-8">
              Print your letter and supporting documents and mail them certified to the appropriate credit bureau. Keep copies of everything submitted and proof of mailing.
            </p>
          </div>

          <!-- 2. Submit Online -->
          <div class="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-3">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-[#00828E] text-white text-[11px] font-black flex items-center justify-center shrink-0">2</span>
              <h4 class="text-xs font-extrabold text-neutral-900 uppercase tracking-wide">Submit Online</h4>
            </div>
            <p class="text-xs text-neutral-600 leading-relaxed font-medium pl-8">
              The three major credit bureaus offer online dispute options. Click below to access each official portal directly:
            </p>

            <!-- Bureau Online Dispute Links -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 pl-8">
              <a 
                href="https://www.equifax.com/personal/disputes/" 
                target="_blank" 
                rel="noopener noreferrer"
                class="p-3 rounded-xl bg-white border border-neutral-200 hover:border-red-400 hover:bg-red-50/20 text-center transition flex flex-col items-center gap-1 group shadow-2xs"
              >
                <span class="text-xs font-black text-red-600">Equifax</span>
                <span class="text-[9px] font-bold text-neutral-500 group-hover:text-red-700 flex items-center gap-0.5">
                  Online Portal <i class="pi pi-external-link text-[8px]"></i>
                </span>
              </a>

              <a 
                href="https://www.experian.com/disputes/main.html" 
                target="_blank" 
                rel="noopener noreferrer"
                class="p-3 rounded-xl bg-white border border-neutral-200 hover:border-blue-400 hover:bg-blue-50/20 text-center transition flex flex-col items-center gap-1 group shadow-2xs"
              >
                <span class="text-xs font-black text-blue-600">Experian</span>
                <span class="text-[9px] font-bold text-neutral-500 group-hover:text-blue-700 flex items-center gap-0.5">
                  Online Portal <i class="pi pi-external-link text-[8px]"></i>
                </span>
              </a>

              <a 
                href="https://www.transunion.com/credit-disputes/dispute-your-credit" 
                target="_blank" 
                rel="noopener noreferrer"
                class="p-3 rounded-xl bg-white border border-neutral-200 hover:border-teal-400 hover:bg-teal-50/20 text-center transition flex flex-col items-center gap-1 group shadow-2xs"
              >
                <span class="text-xs font-black text-teal-700">TransUnion</span>
                <span class="text-[9px] font-bold text-neutral-500 group-hover:text-teal-800 flex items-center gap-0.5">
                  Online Portal <i class="pi pi-external-link text-[8px]"></i>
                </span>
              </a>
            </div>
          </div>
        </div>

        <!-- Close Button -->
        <div class="pt-2 text-right">
          <button 
            @click="showSubmissionModal = false"
            class="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold rounded-xl text-xs transition duration-200 cursor-pointer shadow-sm"
          >
            Got it, Close
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const { data: letters, refresh } = await useFetch('/api/letters');

const selectedLetter = ref(null);
const isEditing = ref(false);
const editorContent = ref('');
const saveLoading = ref(false);
const statusLoading = ref(false);
const showSubmissionModal = ref(false);

async function toggleMailedStatus() {
  if (!selectedLetter.value) return;

  statusLoading.value = true;
  const newStatus = selectedLetter.value.posted_1 ? 0 : 1;

  try {
    const res = await $fetch('/api/letters', {
      method: 'PUT',
      body: {
        id: selectedLetter.value.id,
        posted_1: newStatus,
        sent: newStatus
      }
    });

    if (res.success) {
      selectedLetter.value.posted_1 = newStatus;
      selectedLetter.value.sent = newStatus;
      refresh();
    }
  } catch (err) {
    alert(err.message || 'Failed to update letter status.');
  } finally {
    statusLoading.value = false;
  }
}

// Auto-select the first letter when loaded
watch(letters, (newVal) => {
  if (newVal && newVal.length > 0 && !selectedLetter.value) {
    selectLetter(newVal[0]);
  }
}, { immediate: true });

function selectLetter(letter) {
  selectedLetter.value = letter;
  editorContent.value = letter.letter_content;
  isEditing.value = false;
}

function toggleEdit() {
  isEditing.value = !isEditing.value;
  if (isEditing.value) {
    editorContent.value = selectedLetter.value.letter_content;
  }
}

async function saveChanges() {
  if (!selectedLetter.value) return;

  saveLoading.value = true;
  try {
    const res = await $fetch('/api/letters', {
      method: 'PUT',
      body: {
        id: selectedLetter.value.id,
        content: editorContent.value
      }
    });

    if (res.success) {
      selectedLetter.value.letter_content = editorContent.value;
      isEditing.value = false;
      refresh();
    }
  } catch (err) {
    alert(err.message || 'Failed to save edits to dispute letter.');
  } finally {
    saveLoading.value = false;
  }
}

function printActiveLetter() {
  window.print();
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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

/* Printing styling helpers */
@media print {
  .no-print {
    display: none !important;
  }
  .print-only {
    display: block !important;
    white-space: pre-wrap;
    word-break: break-all;
  }
}
</style>
