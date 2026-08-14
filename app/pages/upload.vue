<template>
  <div class="space-y-8 animate-fade-in pb-12 max-w-5xl mx-auto no-print">
    
    <!-- 1. Meet Ally Coaching Header -->
    <div class="bg-gradient-to-br from-[#005F6A] via-[#00828E] to-[#00A3B0] text-white rounded-3xl p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,95,106,0.25)] relative overflow-hidden border border-white/20">
      <div class="absolute -right-16 -bottom-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
        <!-- Ally Avatar -->
        <div class="relative shrink-0">
          <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/15 border-2 border-white/80 p-1 shadow-[0_4px_20px_rgba(0,0,0,0.2)] flex items-center justify-center backdrop-blur-md">
            <img 
              src="/AllyAI.png" 
              alt="Ally AI" 
              class="w-full h-full object-contain drop-shadow-md"
            />
          </div>
          <span class="absolute bottom-0 right-0 w-5 h-5 bg-emerald-400 border-2 border-[#005F6A] rounded-full shadow-sm"></span>
        </div>

        <!-- Title & Subtitle -->
        <div class="text-center sm:text-left space-y-1.5 flex-1">
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
            Meet Ally: Your Credit Game Plan
          </h1>
          <p class="text-xs sm:text-sm text-teal-50/90 font-medium leading-relaxed max-w-2xl">
            Let's tackle your disputes in rounds to weaken reporting credibility and maximize deletions.
          </p>
        </div>

        <!-- Re-upload or switch view button if report exists -->
        <div v-if="hasReport" class="shrink-0">
          <button 
            @click="showUploadModal = !showUploadModal" 
            class="px-4 py-2.5 bg-white/15 hover:bg-white/25 border border-white/30 rounded-xl text-xs font-bold text-white transition flex items-center gap-2 backdrop-blur-md cursor-pointer shadow-sm"
          >
            <i :class="['pi', showUploadModal ? 'pi-list' : 'pi-upload']"></i>
            {{ showUploadModal ? 'View Game Plan' : 'Upload New Report' }}
          </button>
        </div>
      </div>

      <!-- Audit Metrics Strip (shown if report exists and not in upload mode) -->
      <div v-if="hasReport && !showUploadModal" class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/20">
        <div class="bg-black/15 border border-white/15 rounded-2xl p-3.5 backdrop-blur-sm">
          <span class="text-[10px] uppercase font-bold tracking-wider text-teal-100/80 block">Total Accounts</span>
          <div class="text-xl font-black text-white mt-0.5">{{ summaryData.totalAccounts || 0 }}</div>
        </div>
        <div class="bg-black/15 border border-white/15 rounded-2xl p-3.5 backdrop-blur-sm">
          <span class="text-[10px] uppercase font-bold tracking-wider text-teal-100/80 block">Negative Items</span>
          <div class="text-xl font-black text-rose-200 mt-0.5">{{ summaryData.negativeAccounts || 0 }}</div>
        </div>
        <div class="bg-black/15 border border-white/15 rounded-2xl p-3.5 backdrop-blur-sm">
          <span class="text-[10px] uppercase font-bold tracking-wider text-teal-100/80 block">Active Letters</span>
          <div class="text-xl font-black text-amber-200 mt-0.5">{{ letters.length }}</div>
        </div>
        <div class="bg-black/15 border border-white/15 rounded-2xl p-3.5 backdrop-blur-sm">
          <span class="text-[10px] uppercase font-bold tracking-wider text-teal-100/80 block">Current Phase</span>
          <div class="text-xl font-black text-emerald-200 mt-0.5">{{ activePhaseName }}</div>
        </div>
      </div>
    </div>

    <!-- 2. "📋 How to Use Your Game Plan" Guide -->
    <div class="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-xl bg-[#00A3B0]/10 border border-[#00A3B0]/20 flex items-center justify-center text-[#00828E]">
          <i class="pi pi-compass text-sm"></i>
        </div>
        <div>
          <h2 class="text-base font-extrabold text-neutral-900">How to Use Your Game Plan</h2>
          <p class="text-xs text-neutral-500 font-medium">Follow this 4-step phased protocol for optimal deletion success.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        <!-- Step 1 -->
        <div class="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2 hover:border-[#00A3B0]/40 transition duration-300">
          <div class="flex items-center gap-2.5">
            <span class="w-6 h-6 rounded-full bg-[#00828E] text-white text-[11px] font-black flex items-center justify-center shrink-0">1</span>
            <h3 class="text-xs font-bold text-neutral-900">Download & Mail</h3>
          </div>
          <p class="text-[11px] text-neutral-600 leading-relaxed font-medium">
            Click <strong class="text-neutral-800">Print / Mail</strong> for active dispute letters, print them, and mail them to each respective credit bureau.
          </p>
        </div>

        <!-- Step 2 -->
        <div class="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2 hover:border-[#00A3B0]/40 transition duration-300">
          <div class="flex items-center gap-2.5">
            <span class="w-6 h-6 rounded-full bg-[#00828E] text-white text-[11px] font-black flex items-center justify-center shrink-0">2</span>
            <h3 class="text-xs font-bold text-neutral-900">Mark as Mailed</h3>
          </div>
          <p class="text-[11px] text-neutral-600 leading-relaxed font-medium">
            Click <strong class="text-neutral-800">Mark as Mailed</strong> after posting. This logs the statutory timeline and unlocks subsequent phases.
          </p>
        </div>

        <!-- Step 3 -->
        <div class="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2 hover:border-[#00A3B0]/40 transition duration-300">
          <div class="flex items-center gap-2.5">
            <span class="w-6 h-6 rounded-full bg-[#00828E] text-white text-[11px] font-black flex items-center justify-center shrink-0">3</span>
            <h3 class="text-xs font-bold text-neutral-900">30-Day Clock</h3>
          </div>
          <p class="text-[11px] text-neutral-600 leading-relaxed font-medium">
            Credit bureaus have 30 statutory days under FCRA § 611 to investigate, verify, or permanently delete disputed records.
          </p>
        </div>

        <!-- Step 4 -->
        <div class="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2 hover:border-[#00A3B0]/40 transition duration-300">
          <div class="flex items-center gap-2.5">
            <span class="w-6 h-6 rounded-full bg-[#00828E] text-white text-[11px] font-black flex items-center justify-center shrink-0">4</span>
            <h3 class="text-xs font-bold text-neutral-900">Update Report</h3>
          </div>
          <p class="text-[11px] text-neutral-600 leading-relaxed font-medium">
            When responses arrive, upload your updated credit report. Ally automatically recalculates your score and generates the next round.
          </p>
        </div>
      </div>
    </div>

    <!-- 3. UPLOAD DROPZONE (Shown if no report yet OR user toggled "Upload New Report") -->
    <div v-if="!hasReport || showUploadModal" class="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-extrabold text-neutral-900">
            {{ hasReport ? 'Upload Updated Credit Report' : 'Upload Your First Credit Report' }}
          </h2>
          <p class="text-xs text-neutral-500 font-semibold mt-0.5">
            Ally parses 3-bureau records, flags reporting conflicts, and formats your game plan automatically.
          </p>
        </div>
      </div>

      <!-- Drag & Drop Area -->
      <div 
        @dragover.prevent="dragOver = true"
        @dragleave.prevent="dragOver = false"
        @drop.prevent="handleDrop"
        class="border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition duration-300 relative overflow-hidden"
        :class="[
          dragOver ? 'border-[#00828E] bg-[#00A3B0]/5' : 'border-neutral-200 bg-neutral-50 hover:border-neutral-400 hover:bg-white shadow-inner',
          loading ? 'opacity-50 pointer-events-none' : ''
        ]"
      >
        <input 
          type="file" 
          ref="fileInput" 
          @change="handleFileSelect" 
          accept=".pdf,.html,.htm,.png,.jpg,.jpeg,image/png,image/jpeg,text/html,application/pdf" 
          class="hidden" 
          id="report-file-upload"
        />

        <label for="report-file-upload" class="cursor-pointer flex flex-col items-center justify-center space-y-4">
          <div class="w-16 h-16 rounded-2xl bg-white flex items-center justify-center border border-neutral-200 shadow-sm">
            <i class="pi pi-cloud-upload text-2xl text-[#00828E]"></i>
          </div>
          <div>
            <span class="text-base font-bold text-neutral-800 block">
              Drag & Drop credit report here
            </span>
            <span class="text-xs text-[#00828E] font-bold mt-1 inline-block">
              or click to browse local files
            </span>
          </div>
          <div class="flex items-center gap-2 pt-1">
            <span class="text-[10px] bg-white border px-2 py-0.5 rounded-md text-neutral-500 font-bold">PDF</span>
            <span class="text-[10px] bg-white border px-2 py-0.5 rounded-md text-neutral-500 font-bold">HTML</span>
            <span class="text-[10px] bg-white border px-2 py-0.5 rounded-md text-neutral-500 font-bold">JPG / PNG</span>
          </div>
        </label>

        <!-- Selected File Pill -->
        <div v-if="selectedFile" class="mt-6 inline-flex items-center gap-3 px-4 py-2 bg-white border border-[#00A3B0]/40 shadow-sm rounded-full text-xs animate-fade-in">
          <i :class="['pi', getFileIcon(selectedFile.name), 'text-[#00828E] font-bold']"></i>
          <span class="font-bold text-neutral-800 truncate max-w-[240px]">{{ selectedFile.name }}</span>
          <span class="text-[10px] text-neutral-400 font-mono">({{ formatBytes(selectedFile.size) }})</span>
          <button @click.prevent="clearFile" class="text-neutral-400 hover:text-red-500 transition cursor-pointer">
            <i class="pi pi-times-circle"></i>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 text-center space-y-4 shadow-sm animate-fade-in">
        <div class="flex items-center justify-center gap-3">
          <i class="pi pi-spin pi-spinner text-xl text-[#00828E]"></i>
          <span class="font-extrabold text-sm text-neutral-800">Ally AI Parsing Credit Report...</span>
        </div>
        <p class="text-neutral-500 text-xs max-w-md mx-auto leading-relaxed">
          Ingesting document structure, reading 3-bureau trade lines, cross-validating inquiries, and building your personalized dispute game plan.
        </p>
        <div class="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
          <div class="bg-gradient-to-r from-[#00D8E6] to-[#00A3B0] h-full animate-loader"></div>
        </div>
      </div>

      <!-- Action Button -->
      <div v-else class="flex justify-end gap-3">
        <button 
          v-if="hasReport && showUploadModal"
          @click="showUploadModal = false"
          class="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-xl text-xs transition cursor-pointer"
        >
          Cancel
        </button>
        <button 
          @click="uploadReport"
          :disabled="!selectedFile"
          class="px-6 py-3 bg-[#00D8E6] text-neutral-900 font-extrabold rounded-xl hover:bg-[#00A3B0] transition duration-300 disabled:opacity-40 disabled:pointer-events-none shadow-sm flex items-center gap-2.5 text-xs cursor-pointer"
        >
          <img src="/AllyAI.png" alt="Ally" class="w-5 h-5 object-contain shrink-0" />
          <span>Let Ally Analyze</span>
        </button>
      </div>

      <!-- Error Alert -->
      <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 animate-fade-in">
        <i class="pi pi-exclamation-circle text-red-500 mt-0.5"></i>
        <div>
          <span class="text-xs font-bold text-red-700 block">Upload Error</span>
          <p class="text-xs text-neutral-700 mt-1 leading-normal font-semibold">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- 4. PHASED DISPUTE LANES (Shown when report is uploaded and not in modal view) -->
    <div v-if="hasReport && !showUploadModal" class="space-y-6">
      
      <!-- Phase 1 Lane -->
      <div class="border border-neutral-200 rounded-3xl overflow-hidden bg-white shadow-sm">
        <div class="bg-[#0FA99C] text-white p-5 sm:px-6 flex items-center justify-between flex-wrap gap-3">
          <div class="space-y-0.5">
            <div class="flex items-center gap-2">
              <span class="text-base">⚡</span>
              <h3 class="text-base font-extrabold">Phase 1: Clean & Challenge</h3>
            </div>
            <p class="text-xs text-white/90 font-medium">Personal Information audits, Unverified Inquiries, and Initial Collections.</p>
          </div>
          <span class="bg-white/20 backdrop-blur-sm text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
            Active Phase
          </span>
        </div>

        <div class="p-5 sm:p-6 space-y-4">
          <div v-if="phase1Letters.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="letter in phase1Letters" 
              :key="letter.id"
              class="border border-neutral-200 rounded-2xl p-4.5 bg-neutral-50/50 hover:bg-white transition duration-300 flex flex-col justify-between gap-4 shadow-sm"
            >
              <div class="space-y-2">
                <div class="flex items-center justify-between gap-2">
                  <span class="text-xs font-black tracking-wider uppercase text-[#00828E]">{{ letter.credit_bureau }}</span>
                  <div class="flex items-center gap-1.5">
                    <span 
                      class="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border"
                      :class="letter.posted_1 ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-amber-50 border-amber-200 text-amber-600'"
                    >
                      {{ letter.posted_1 ? 'Mailed' : 'Draft' }}
                    </span>
                    <span class="text-[9px] bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded-full text-neutral-500 font-bold">
                      Round {{ letter.phase }}
                    </span>
                  </div>
                </div>
                <div>
                  <h4 class="text-xs font-extrabold text-neutral-900 truncate">{{ letter.creditor_name }}</h4>
                  <p class="text-[11px] text-neutral-500 font-medium mt-0.5 line-clamp-2">
                    {{ letter.dispute_reason || 'Cross-Bureau Inconsistency Audit' }}
                  </p>
                </div>
              </div>

              <div class="flex items-center justify-between gap-2 pt-2 border-t border-neutral-200/60">
                <button 
                  @click="toggleLetterStatus(letter)"
                  :disabled="actionLoadingId === letter.id"
                  class="text-xs font-extrabold px-3 py-1.5 rounded-lg border transition duration-300 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  :class="letter.posted_1 ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100' : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'"
                >
                  <i :class="['pi', actionLoadingId === letter.id ? 'pi-spin pi-spinner' : (letter.posted_1 ? 'pi-check-circle' : 'pi-send'), 'text-[11px]']"></i>
                  {{ letter.posted_1 ? 'Mailed' : 'Mark as Mailed' }}
                </button>

                <button 
                  @click="printLetter(letter)"
                  class="text-xs font-bold px-3 py-1.5 bg-[#00D8E6] text-neutral-900 rounded-lg hover:bg-[#00A3B0] transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <i class="pi pi-print text-[11px]"></i> Print / Mail
                </button>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-10 px-4 border border-dashed border-neutral-200 rounded-2xl space-y-2 bg-neutral-50/50">
            <i class="pi pi-inbox text-2xl text-neutral-400"></i>
            <h4 class="text-xs font-bold text-neutral-800">No Phase 1 Letters Generated</h4>
            <p class="text-[11px] text-neutral-500 max-w-sm mx-auto font-medium">
              You have not generated any dispute letters for Round 1 yet. Visit the Discrepancies table to select conflicts and draft documents.
            </p>
            <NuxtLink to="/discrepancies" class="inline-block mt-2 px-4 py-2 bg-[#00D8E6] text-neutral-900 rounded-xl text-xs font-extrabold hover:bg-[#00A3B0] transition">
              View Discrepancies Table
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Phase 2 Lane -->
      <div 
        class="border border-neutral-200 rounded-3xl overflow-hidden bg-white shadow-sm transition duration-300"
        :class="isPhase1Complete ? 'opacity-100' : 'opacity-85'"
      >
        <div class="bg-[#15141C] text-white p-5 sm:px-6 flex items-center justify-between flex-wrap gap-3">
          <div class="space-y-0.5">
            <div class="flex items-center gap-2">
              <span class="text-base">🛠️</span>
              <h3 class="text-base font-extrabold">Phase 2: Core Battle</h3>
            </div>
            <p class="text-xs text-white/80 font-medium">Charge-offs, Collections verification, and Repossession accounts.</p>
          </div>
          <span 
            class="text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border"
            :class="isPhase1Complete ? 'bg-[#00D8E6]/20 text-[#00D8E6] border-[#00D8E6]/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'"
          >
            {{ isPhase1Complete ? 'Active' : 'Locked' }}
          </span>
        </div>

        <!-- Warning Advisory -->
        <div v-if="!isPhase1Complete" class="bg-amber-50/80 border-b border-amber-200/80 px-6 py-3 flex items-center gap-2.5 text-xs text-amber-800 font-medium">
          <i class="pi pi-exclamation-triangle text-amber-600 text-sm shrink-0"></i>
          <span>
            <strong class="font-bold">Ally advises:</strong> Complete Phase 1 disputes (mark all Phase 1 letters as Mailed) before proceeding to Phase 2. This isolates charge-offs for higher deletion probability.
          </span>
        </div>

        <div class="p-5 sm:p-6 space-y-4">
          <div v-if="phase2Letters.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="letter in phase2Letters" 
              :key="letter.id"
              class="border border-neutral-200 rounded-2xl p-4.5 bg-neutral-50/50 hover:bg-white transition duration-300 flex flex-col justify-between gap-4 shadow-sm"
              :class="!isPhase1Complete ? 'opacity-70 pointer-events-none' : ''"
            >
              <div class="space-y-2">
                <div class="flex items-center justify-between gap-2">
                  <span class="text-xs font-black tracking-wider uppercase text-[#00828E]">{{ letter.credit_bureau }}</span>
                  <div class="flex items-center gap-1.5">
                    <span 
                      class="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border"
                      :class="letter.posted_1 ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-amber-50 border-amber-200 text-amber-600'"
                    >
                      {{ letter.posted_1 ? 'Mailed' : 'Draft' }}
                    </span>
                    <span class="text-[9px] bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded-full text-neutral-500 font-bold">
                      Round {{ letter.phase }}
                    </span>
                  </div>
                </div>
                <div>
                  <h4 class="text-xs font-extrabold text-neutral-900 truncate">{{ letter.creditor_name }}</h4>
                  <p class="text-[11px] text-neutral-500 font-medium mt-0.5 line-clamp-2">
                    {{ letter.dispute_reason || 'Charge-Off / Repossession Investigation' }}
                  </p>
                </div>
              </div>

              <div class="flex items-center justify-between gap-2 pt-2 border-t border-neutral-200/60">
                <button 
                  @click="toggleLetterStatus(letter)"
                  :disabled="actionLoadingId === letter.id || !isPhase1Complete"
                  class="text-xs font-extrabold px-3 py-1.5 rounded-lg border transition duration-300 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  :class="letter.posted_1 ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100' : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'"
                >
                  <i :class="['pi', actionLoadingId === letter.id ? 'pi-spin pi-spinner' : (letter.posted_1 ? 'pi-check-circle' : 'pi-send'), 'text-[11px]']"></i>
                  {{ letter.posted_1 ? 'Mailed' : 'Mark as Mailed' }}
                </button>

                <button 
                  @click="printLetter(letter)"
                  :disabled="!isPhase1Complete"
                  class="text-xs font-bold px-3 py-1.5 bg-[#00D8E6] text-neutral-900 rounded-lg hover:bg-[#00A3B0] transition flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <i class="pi pi-print text-[11px]"></i> Print / Mail
                </button>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-10 px-4 border border-dashed border-neutral-200 rounded-2xl space-y-2 bg-neutral-50/50">
            <i class="pi pi-info-circle text-2xl text-neutral-400"></i>
            <h4 class="text-xs font-bold text-neutral-800">No Phase 2 Letters Generated</h4>
            <p class="text-[11px] text-neutral-500 max-w-sm mx-auto font-medium">
              Phase 2 targets Charge-offs and Repossessions. If your report does not contain these specific accounts, you can proceed directly to Phase 3.
            </p>
          </div>
        </div>
      </div>

      <!-- Phase 3 Lane -->
      <div 
        class="border border-neutral-200 rounded-3xl overflow-hidden bg-white shadow-sm transition duration-300"
        :class="isPhase2Complete ? 'opacity-100' : 'opacity-85'"
      >
        <div class="bg-[#15141C] text-white p-5 sm:px-6 flex items-center justify-between flex-wrap gap-3">
          <div class="space-y-0.5">
            <div class="flex items-center gap-2">
              <span class="text-base">✨</span>
              <h3 class="text-base font-extrabold">Phase 3: Goodwill & Polish</h3>
            </div>
            <p class="text-xs text-white/80 font-medium">Late Payment history adjustments and Goodwill creditor outreach.</p>
          </div>
          <span 
            class="text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border"
            :class="isPhase2Complete ? 'bg-[#00D8E6]/20 text-[#00D8E6] border-[#00D8E6]/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'"
          >
            {{ isPhase2Complete ? 'Active' : 'Locked' }}
          </span>
        </div>

        <!-- Warning Advisory -->
        <div v-if="!isPhase2Complete" class="bg-amber-50/80 border-b border-amber-200/80 px-6 py-3 flex items-center gap-2.5 text-xs text-amber-800 font-medium">
          <i class="pi pi-exclamation-triangle text-amber-600 text-sm shrink-0"></i>
          <span>
            <strong class="font-bold">Ally advises:</strong> Finish your Phase 2 disputes before starting late payment adjustments to keep dispute history credible.
          </span>
        </div>

        <div class="p-5 sm:p-6 space-y-4">
          <div v-if="phase3Letters.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="letter in phase3Letters" 
              :key="letter.id"
              class="border border-neutral-200 rounded-2xl p-4.5 bg-neutral-50/50 hover:bg-white transition duration-300 flex flex-col justify-between gap-4 shadow-sm"
              :class="!isPhase2Complete ? 'opacity-70 pointer-events-none' : ''"
            >
              <div class="space-y-2">
                <div class="flex items-center justify-between gap-2">
                  <span class="text-xs font-black tracking-wider uppercase text-[#00828E]">{{ letter.credit_bureau }}</span>
                  <div class="flex items-center gap-1.5">
                    <span 
                      class="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border"
                      :class="letter.posted_1 ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-amber-50 border-amber-200 text-amber-600'"
                    >
                      {{ letter.posted_1 ? 'Mailed' : 'Draft' }}
                    </span>
                    <span class="text-[9px] bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded-full text-neutral-500 font-bold">
                      Round {{ letter.phase }}
                    </span>
                  </div>
                </div>
                <div>
                  <h4 class="text-xs font-extrabold text-neutral-900 truncate">{{ letter.creditor_name }}</h4>
                  <p class="text-[11px] text-neutral-500 font-medium mt-0.5 line-clamp-2">
                    {{ letter.dispute_reason || 'Goodwill & Late Payment Adjustment' }}
                  </p>
                </div>
              </div>

              <div class="flex items-center justify-between gap-2 pt-2 border-t border-neutral-200/60">
                <button 
                  @click="toggleLetterStatus(letter)"
                  :disabled="actionLoadingId === letter.id || !isPhase2Complete"
                  class="text-xs font-extrabold px-3 py-1.5 rounded-lg border transition duration-300 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  :class="letter.posted_1 ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100' : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'"
                >
                  <i :class="['pi', actionLoadingId === letter.id ? 'pi-spin pi-spinner' : (letter.posted_1 ? 'pi-check-circle' : 'pi-send'), 'text-[11px]']"></i>
                  {{ letter.posted_1 ? 'Mailed' : 'Mark as Mailed' }}
                </button>

                <button 
                  @click="printLetter(letter)"
                  :disabled="!isPhase2Complete"
                  class="text-xs font-bold px-3 py-1.5 bg-[#00D8E6] text-neutral-900 rounded-lg hover:bg-[#00A3B0] transition flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <i class="pi pi-print text-[11px]"></i> Print / Mail
                </button>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-10 px-4 border border-dashed border-neutral-200 rounded-2xl space-y-2 bg-neutral-50/50">
            <i class="pi pi-check-circle text-2xl text-neutral-400"></i>
            <h4 class="text-xs font-bold text-neutral-800">No Phase 3 Letters Generated</h4>
            <p class="text-[11px] text-neutral-500 max-w-sm mx-auto font-medium">
              Phase 3 targets Late Payment adjustments. If your accounts are up to date, your credit cleanup cycle is successfully complete!
            </p>
          </div>
        </div>
      </div>

    </div>

  </div>

  <!-- PRINT ONLY TARGET BLOCK (hidden on display screen, only visible inside print frames) -->
  <div v-if="activePrintingLetter" class="hidden print-only w-full max-w-4xl p-12 text-black bg-white font-mono text-xs leading-relaxed whitespace-pre-wrap">
    {{ activePrintingLetter.letter_content }}
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';

// --- DATA FETCHING ---
const { data: dashboardData, refresh: refreshDashboard } = await useFetch('/api/dashboard-summary');
const { data: lettersData, refresh: refreshLetters } = await useFetch('/api/letters');

const letters = computed(() => lettersData.value || []);
const hasReport = computed(() => Boolean(dashboardData.value?.hasReport));
const summaryData = computed(() => dashboardData.value?.summary || {});

const showUploadModal = ref(false);
const dragOver = ref(false);
const selectedFile = ref(null);
const fileInput = ref(null);
const loading = ref(false);
const error = ref(null);
const actionLoadingId = ref(null);
const activePrintingLetter = ref(null);

// Group letters by Phase
const phase1Letters = computed(() => letters.value.filter(l => Number(l.phase) === 1 || !l.phase));
const phase2Letters = computed(() => letters.value.filter(l => Number(l.phase) === 2));
const phase3Letters = computed(() => letters.value.filter(l => Number(l.phase) === 3));

// Check completion status for phase unlocking
const isPhase1Complete = computed(() => {
  if (phase1Letters.value.length === 0) return true;
  return phase1Letters.value.every(l => l.posted_1 === 1 || l.sent === 1);
});

const isPhase2Complete = computed(() => {
  if (!isPhase1Complete.value) return false;
  if (phase2Letters.value.length === 0) return true;
  return phase2Letters.value.every(l => l.posted_1 === 1 || l.sent === 1);
});

const activePhaseName = computed(() => {
  if (!isPhase1Complete.value) return 'Phase 1';
  if (!isPhase2Complete.value) return 'Phase 2';
  return 'Phase 3';
});

// File icon helper
function getFileIcon(filename) {
  if (!filename) return 'pi-file';
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'pi-file-pdf';
  if (['png', 'jpg', 'jpeg'].includes(ext)) return 'pi-image';
  if (['html', 'htm'].includes(ext)) return 'pi-code';
  return 'pi-file';
}

function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function handleFileSelect(e) {
  const file = e.target.files[0];
  validateAndSetFile(file);
}

function handleDrop(e) {
  dragOver.value = false;
  const file = e.dataTransfer.files[0];
  validateAndSetFile(file);
}

function validateAndSetFile(file) {
  if (!file) return;
  const ext = file.name.split('.').pop()?.toLowerCase();
  const validExtensions = ['pdf', 'html', 'htm', 'png', 'jpg', 'jpeg'];
  
  if (validExtensions.includes(ext) || file.type.includes('pdf') || file.type.includes('html') || file.type.includes('image')) {
    selectedFile.value = file;
    error.value = null;
  } else {
    error.value = 'Please select a valid PDF, HTML, or JPG/PNG image file.';
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
      await refreshDashboard();
      await refreshLetters();
      showUploadModal.value = false;
      selectedFile.value = null;
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

async function toggleLetterStatus(letter) {
  actionLoadingId.value = letter.id;
  const newStatus = letter.posted_1 ? 0 : 1;

  try {
    const res = await $fetch('/api/letters', {
      method: 'PUT',
      body: {
        id: letter.id,
        posted_1: newStatus,
        sent: newStatus
      }
    });

    if (res.success) {
      letter.posted_1 = newStatus;
      letter.sent = newStatus;
      await refreshLetters();
      await refreshDashboard();
    }
  } catch (err) {
    alert(err.message || 'Failed to update letter status.');
  } finally {
    actionLoadingId.value = null;
  }
}

function printLetter(letter) {
  activePrintingLetter.value = letter;
  nextTick(() => {
    window.print();
  });
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
