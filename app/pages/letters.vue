<template>
  <div class="space-y-8 animate-fade-in no-print">
    <!-- Header -->
    <div class="border-b border-neutral-200 pb-6">
      <h1 class="text-3xl font-extrabold tracking-tight text-neutral-900">Dispute Letters</h1>
      <p class="text-neutral-500 mt-1">Review, refine, and print your customized bureau dispute documents.</p>
    </div>

    <!-- Empty State -->
    <div v-if="!letters || letters.length === 0" class="flex flex-col items-center justify-center p-16 bg-white border border-neutral-200 rounded-3xl text-center space-y-4 shadow-sm">
      <div class="w-16 h-16 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center">
        <i class="pi pi-folder-open text-2xl text-neutral-400"></i>
      </div>
      <div class="max-w-md">
        <h2 class="text-xl font-bold text-neutral-900">No Letters Drafted</h2>
        <p class="text-neutral-500 mt-1">You haven't generated any dispute letters yet. Select conflicts from the table to begin writing.</p>
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
              <span class="text-[9px] bg-neutral-100 border px-1.5 py-0.5 rounded text-neutral-500 font-bold">
                Rd {{ letter.phase }}
              </span>
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
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
            <div>
              <h2 class="text-lg font-bold uppercase tracking-wider text-[#00828E]">{{ selectedLetter.credit_bureau }} Dispute Form</h2>
              <p class="text-neutral-500 text-xs font-semibold">Round {{ selectedLetter.phase }} • Dispute for: {{ selectedLetter.creditor_name }}</p>
            </div>
            <div class="flex items-center gap-2">
              <button 
                @click="toggleEdit"
                class="px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition duration-300 flex items-center gap-2"
              >
                <i :class="['pi', isEditing ? 'pi-eye' : 'pi-pencil']"></i>
                {{ isEditing ? 'Preview Letter' : 'Edit Text' }}
              </button>
              
              <button 
                @click="printActiveLetter"
                class="px-4 py-2 bg-[#00D8E6] text-neutral-900 font-extrabold rounded-lg text-xs hover:bg-[#00A3B0] transition duration-300 flex items-center gap-2 shadow-sm"
              >
                <i class="pi pi-print"></i> Print / Mail
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
</template>

<script setup>
const { data: letters, refresh } = await useFetch('/api/letters');

const selectedLetter = ref(null);
const isEditing = ref(false);
const editorContent = ref('');
const saveLoading = ref(false);

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
