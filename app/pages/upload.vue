<template>
  <div class="max-w-2xl mx-auto space-y-8 animate-fade-in">
    <!-- Header -->
    <div class="border-b border-neutral-200 pb-6">
      <h1 class="text-3xl font-extrabold tracking-tight text-neutral-900">Upload Credit Report</h1>
      <p class="text-neutral-500 mt-1">Upload a 3-bureau report PDF to extract records and evaluate data conflicts.</p>
    </div>

    <!-- Upload Box Area -->
    <div class="space-y-6">
      <div 
        @dragover.prevent="dragOver = true"
        @dragleave.prevent="dragOver = false"
        @drop.prevent="handleDrop"
        class="border-2 border-dashed rounded-3xl p-12 text-center transition duration-300 relative overflow-hidden"
        :class="[
          dragOver ? 'border-[#00828E] bg-[#00A3B0]/5' : 'border-neutral-200 bg-white hover:border-neutral-400 shadow-sm',
          loading ? 'opacity-50 pointer-events-none' : ''
        ]"
      >
        <input 
          type="file" 
          ref="fileInput" 
          @change="handleFileSelect" 
          accept=".pdf" 
          class="hidden" 
          id="pdf-upload"
        />

        <label for="pdf-upload" class="cursor-pointer flex flex-col items-center justify-center space-y-4">
          <div class="w-16 h-16 rounded-2xl bg-neutral-50 flex items-center justify-center border border-neutral-200 shadow-sm">
            <i class="pi pi-file-pdf text-2xl text-neutral-500"></i>
          </div>
          <div>
            <span class="text-base font-bold text-neutral-800 block">
              Drag & Drop credit report here
            </span>
            <span class="text-xs text-[#00828E] font-bold mt-1 inline-block">
              or click to browse local files
            </span>
          </div>
          <span class="text-[10px] text-neutral-400 uppercase tracking-widest block font-bold">
            Accepted Format: PDF Only
          </span>
        </label>

        <!-- Selected File Bubble -->
        <div v-if="selectedFile" class="mt-6 inline-flex items-center gap-3 px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-full text-xs">
          <i class="pi pi-file-pdf text-[#00828E]"></i>
          <span class="font-semibold text-neutral-700 truncate max-w-[200px]">{{ selectedFile.name }}</span>
          <button @click.prevent="clearFile" class="text-neutral-400 hover:text-red-500">
            <i class="pi pi-times-circle"></i>
          </button>
        </div>
      </div>

      <!-- Action / Progress Bar -->
      <div v-if="loading" class="bg-white border border-neutral-200 rounded-2xl p-6 text-center space-y-4 shadow-sm">
        <div class="flex items-center justify-center gap-3">
          <i class="pi pi-spin pi-spinner text-xl text-[#00828E]"></i>
          <span class="font-bold text-sm text-neutral-800">AI Engine Parsing Credit Report...</span>
        </div>
        <p class="text-neutral-500 text-xs max-w-sm mx-auto">
          We are analyzing the document layout, extracting credit scores, logging tradeline details, and validating accounts. This takes 10-20 seconds.
        </p>
        <div class="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
          <div class="bg-gradient-to-r from-[#00D8E6] to-[#00A3B0] h-full animate-loader"></div>
        </div>
      </div>

      <div v-else class="flex justify-end gap-3">
        <button 
          @click="uploadReport"
          :disabled="!selectedFile"
          class="px-6 py-3 bg-[#00D8E6] text-neutral-900 font-extrabold rounded-xl hover:bg-[#00A3B0] transition duration-300 disabled:opacity-40 disabled:pointer-events-none shadow-sm flex items-center gap-2"
        >
          <i class="pi pi-check-circle"></i> Run AI Extraction
        </button>
      </div>

      <!-- Message Alert -->
      <div v-if="error" class="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3">
        <i class="pi pi-exclamation-circle text-red-500 mt-0.5"></i>
        <div>
          <span class="text-xs font-bold text-red-600 block">Parsing Error</span>
          <p class="text-xs text-neutral-700 mt-1 leading-normal font-semibold">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const dragOver = ref(false);
const selectedFile = ref(null);
const fileInput = ref(null);
const loading = ref(false);
const error = ref(null);

function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file && file.type === 'application/pdf') {
    selectedFile.value = file;
    error.value = null;
  } else {
    error.value = 'Please select a valid PDF file.';
  }
}

function handleDrop(e) {
  dragOver.value = false;
  const file = e.dataTransfer.files[0];
  if (file && file.type === 'application/pdf') {
    selectedFile.value = file;
    error.value = null;
  } else {
    error.value = 'Only PDF credit reports are supported.';
  }
}

function clearFile() {
  selectedFile.value = null;
  if (fileInput.value) fileInput.value.value = '';
}

async function uploadReport() {
  if (!selectedFile.value) return;

  loading.value = true;
  error.value = null;

  const formData = new FormData();
  formData.append('report', selectedFile.value);

  try {
    const res = await $fetch('/api/parse-report', {
      method: 'POST',
      body: formData
    });

    if (res.success) {
      navigateTo('/discrepancies');
    } else {
      error.value = res.message || 'Unknown error occurred while parsing report.';
    }
  } catch (err) {
    error.value = err.data?.statusMessage || err.message || 'Server error encountered during upload.';
  } finally {
    loading.value = false;
  }
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

.animate-loader {
  width: 0%;
  animation: load 15s linear infinite;
}

@keyframes load {
  0% { width: 0%; }
  50% { width: 75%; }
  100% { width: 95%; }
}
</style>
