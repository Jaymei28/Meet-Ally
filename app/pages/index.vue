<template>
  <div class="animate-fade-in">
    <!-- 1. ADMIN DASHBOARD VIEW -->
    <div v-if="isAdmin" class="space-y-6 -mx-4 md:-mx-8">
      <!-- Header Block (Indigo/Teal Gradient Banner) -->
      <div class="bg-gradient-to-br from-[#005F6A] to-[#00A3B0] text-white p-6 pb-16 rounded-b-[40px] shadow-[0_10px_30px_rgba(0,95,106,0.15)] relative">
        <!-- Top Padding Spacer -->
        <div class="pt-2"></div>

        <!-- Center Character Section -->
        <div class="flex items-center justify-between gap-4 mt-6 w-full max-w-lg mx-auto">
          <!-- Welcome Chat Bubble -->
          <div class="flex-1 bg-white/10 backdrop-blur-md border border-white/25 rounded-2xl px-4 py-3 text-[11px] md:text-xs font-semibold leading-relaxed shadow-sm text-left">
            "Hi! Here is the system overview. We currently have <span class="text-[#00D8E6] font-extrabold">{{ adminStats.totalClients }} registered clients</span> and <span class="text-[#00D8E6] font-extrabold">{{ adminStats.totalLetters }} dispute letters</span> generated."
          </div>

          <!-- Display AllyAI Image Character -->
          <img 
            src="/AllyAI.png" 
            alt="Ally AI Assistant" 
            class="h-28 w-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.25)] animate-bounce-slow shrink-0"
          />
        </div>
      </div>

      <!-- Horizontally Scrollable Bureau Cards (Overlapping Header) -->
      <div class="relative z-10 -mt-12 px-6 w-full">
        <div class="flex flex-nowrap overflow-x-auto gap-4 pb-6 pt-2 scrollbar-none snap-x snap-mandatory">
          <!-- Card 1: Total Clients -->
          <div class="snap-center shrink-0 w-64 bg-white border border-neutral-200 rounded-3xl p-5 shadow-lg flex items-center justify-between">
            <div class="space-y-1.5">
              <span class="text-xs font-extrabold text-neutral-400 uppercase tracking-widest">Total Clients</span>
              <div class="flex items-baseline gap-1">
                <span class="text-3xl font-black text-neutral-900">{{ adminStats.totalClients }}</span>
                <span class="text-[10px] text-neutral-400 font-bold">Accounts</span>
              </div>
              <span class="text-[10px] px-2.5 py-0.5 rounded-full border font-bold inline-block bg-emerald-50 border-emerald-200 text-emerald-600">
                Active status
              </span>
            </div>
            <div class="shrink-0">
              <Knob :modelValue="100" :min="0" :max="100" valueColor="#00A3B0" rangeColor="#F1F5F9" :size="85" :strokeWidth="8" :showValue="false" readonly />
            </div>
          </div>

          <!-- Card 2: Standard Plan (Starter) -->
          <div class="snap-center shrink-0 w-64 bg-white border border-neutral-200 rounded-3xl p-5 shadow-lg flex items-center justify-between">
            <div class="space-y-1.5">
              <span class="text-xs font-extrabold text-neutral-400 uppercase tracking-widest">Standard (Starter)</span>
              <div class="flex items-baseline gap-1">
                <span class="text-3xl font-black text-neutral-900">{{ adminStats.starterPlanUsers }}</span>
                <span class="text-[10px] text-neutral-400 font-bold">Clients</span>
              </div>
              <span class="text-[10px] px-2.5 py-0.5 rounded-full border font-bold inline-block bg-[#00A3B0]/10 border-[#00A3B0]/20 text-[#00828E]">
                {{ starterPercentage }}% Ratio
              </span>
            </div>
            <div class="shrink-0">
              <Knob :modelValue="starterPercentage" :min="0" :max="100" valueColor="#00A3B0" rangeColor="#F1F5F9" :size="85" :strokeWidth="8" :showValue="false" readonly />
            </div>
          </div>

          <!-- Card 3: Pro Plan (Turbo) -->
          <div class="snap-center shrink-0 w-64 bg-white border border-neutral-200 rounded-3xl p-5 shadow-lg flex items-center justify-between">
            <div class="space-y-1.5">
              <span class="text-xs font-extrabold text-neutral-400 uppercase tracking-widest">Pro (Turbo)</span>
              <div class="flex items-baseline gap-1">
                <span class="text-3xl font-black text-neutral-900">{{ adminStats.turboPlanUsers }}</span>
                <span class="text-[10px] text-neutral-400 font-bold">Clients</span>
              </div>
              <span class="text-[10px] px-2.5 py-0.5 rounded-full border font-bold inline-block bg-indigo-50 border-indigo-200 text-indigo-600">
                {{ turboPercentage }}% Ratio
              </span>
            </div>
            <div class="shrink-0">
              <Knob :modelValue="turboPercentage" :min="0" :max="100" valueColor="#6366F1" rangeColor="#F1F5F9" :size="85" :strokeWidth="8" :showValue="false" readonly />
            </div>
          </div>
        </div>
      </div>

      <!-- Inner Grid Section -->
      <div class="px-4 md:px-8 space-y-6">
        <!-- Quick Stats Card Row -->
        <section class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white border border-neutral-200 rounded-2xl p-4 space-y-1 shadow-sm">
            <span class="text-[10px] text-neutral-400 font-extrabold tracking-wider uppercase">Total Clients</span>
            <div class="flex items-baseline justify-between">
              <span class="text-2xl font-black text-neutral-900">{{ adminStats.totalClients }}</span>
              <i class="pi pi-users text-neutral-400 text-sm"></i>
            </div>
          </div>
          <div class="bg-white border border-neutral-200 rounded-2xl p-4 space-y-1 shadow-sm">
            <span class="text-[10px] text-[#00828E] font-extrabold tracking-wider uppercase">Starter Plans</span>
            <div class="flex items-baseline justify-between">
              <span class="text-2xl font-black text-[#00828E]">{{ adminStats.starterPlanUsers }}</span>
              <i class="pi pi-percentage text-[#00828E]/60 text-sm"></i>
            </div>
          </div>
          <div class="bg-white border border-neutral-200 rounded-2xl p-4 space-y-1 shadow-sm">
            <span class="text-[10px] text-indigo-500 font-extrabold tracking-wider uppercase">Turbo Plans</span>
            <div class="flex items-baseline justify-between">
              <span class="text-2xl font-black text-indigo-600">{{ adminStats.turboPlanUsers }}</span>
              <i class="pi pi-bolt text-indigo-400 text-sm"></i>
            </div>
          </div>
          <div class="bg-white border border-neutral-200 rounded-2xl p-4 space-y-1 shadow-sm">
            <span class="text-[10px] text-amber-500 font-extrabold tracking-wider uppercase">Audited Files</span>
            <div class="flex items-baseline justify-between">
              <span class="text-2xl font-black text-amber-600">{{ adminStats.totalReports }}</span>
              <i class="pi pi-file-import text-amber-400 text-sm"></i>
            </div>
          </div>
        </section>

        <!-- Custom Beautiful Table (Matches example design) -->
        <div class="bg-white border border-neutral-200 rounded-[32px] p-6 shadow-sm space-y-6">
          
          <!-- Table Header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 class="font-extrabold text-xl text-neutral-900">Customers</h3>
              <p class="text-neutral-500 text-xs mt-0.5">The analysis list here shows all users</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs text-neutral-600 bg-emerald-50 border border-emerald-100 px-3.5 py-1 rounded-full font-bold flex items-center gap-1.5 shadow-sm">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {{ adminStats.totalClients }} Active Users
              </span>
            </div>
          </div>

          <!-- Table Controls (Search & Pagination) -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-neutral-100">
            <!-- Search Input Box -->
            <div class="relative w-full sm:w-64">
              <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
                <i class="pi pi-search text-xs"></i>
              </span>
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Search..." 
                class="w-full pl-9 pr-4 py-2.5 bg-neutral-50/50 border border-neutral-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A3B0]/10 focus:border-[#00A3B0] transition"
              />
            </div>

            <!-- Action Buttons and Arrow Pagination -->
            <div class="flex items-center justify-end gap-3 text-xs font-bold">
              <button 
                @click="refreshAdminData" 
                :disabled="adminLoading"
                class="p-2.5 bg-white border border-neutral-200 text-neutral-500 hover:text-neutral-700 rounded-xl hover:bg-neutral-50 transition cursor-pointer disabled:opacity-50 shadow-sm"
              >
                <i :class="['pi', adminLoading ? 'pi-spin pi-spinner' : 'pi-refresh', 'text-xs']"></i>
              </button>
              
              <span class="text-neutral-500 font-extrabold px-1">
                {{ currentPage }} of {{ totalPages || 1 }}
              </span>

              <div class="flex items-center gap-1 border border-neutral-200 rounded-xl bg-white p-1.5 shadow-sm">
                <button 
                  @click="prevPage" 
                  :disabled="currentPage === 1"
                  class="p-1 rounded-lg text-neutral-500 hover:bg-neutral-50 disabled:opacity-30 cursor-pointer"
                >
                  <i class="pi pi-chevron-left text-[10px]"></i>
                </button>
                <button 
                  @click="nextPage" 
                  :disabled="currentPage >= totalPages"
                  class="p-1 rounded-lg text-neutral-500 hover:bg-neutral-50 disabled:opacity-30 cursor-pointer"
                >
                  <i class="pi pi-chevron-right text-[10px]"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Data Grid -->
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-neutral-100 text-neutral-400 text-[10px] font-extrabold uppercase tracking-wider bg-neutral-50/30">
                  <th class="py-3 px-4">Name</th>
                  <th class="py-3 px-4 text-center">Letters Filed</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-neutral-100 text-xs font-semibold">
                <tr v-for="client in paginatedClients" :key="client.id" class="hover:bg-neutral-50/30 transition">
                  <!-- Avatar + Name + Email Column -->
                  <td class="py-4 px-4 flex items-center gap-3">
                    <div class="relative w-9 h-9 rounded-full shrink-0 flex items-center justify-center border border-neutral-100 bg-white">
                      <img v-if="client.profile_picture" :src="client.profile_picture" alt="Avatar" class="w-full h-full rounded-full object-cover" />
                      <div v-else class="w-full h-full rounded-full flex items-center justify-center font-extrabold text-[11px] uppercase" :class="getAvatarBgClass(client.name)">
                        {{ getInitials(client.name) }}
                      </div>
                      <!-- Dynamic Status indicator dot -->
                      <span 
                        class="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white"
                        :class="client.registration_status === 'completed' ? 'bg-emerald-500' : 'bg-amber-400'"
                      ></span>
                    </div>
                    <div>
                      <span class="font-extrabold text-neutral-900 block">{{ client.name }}</span>
                      <span class="text-[9px] px-2 py-0.5 rounded-full border font-extrabold uppercase tracking-widest inline-block mt-1" :class="getPlanClass(client.plan_type)">
                        {{ client.plan_type || 'None' }}
                      </span>
                    </div>
                  </td>

                  <!-- Letters Filed Badge Column -->
                  <td class="py-4 px-4 text-center">
                    <span class="inline-flex items-center gap-1.5 bg-neutral-50 border border-neutral-200 px-3 py-1 rounded-full text-[10px] font-bold text-neutral-700">
                      <i class="pi pi-envelope text-neutral-400 text-[10px]"></i>
                      {{ client.letters_filed || 0 }}
                    </span>
                  </td>
                </tr>
                <tr v-if="filteredClients.length === 0">
                  <td colspan="2" class="py-8 text-center text-neutral-400 font-semibold">
                    No clients found matching the search query.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. CLIENT DASHBOARD VIEW -->
    <div v-else class="space-y-6 -mx-4 md:-mx-8">
      <!-- Prominent Immediate Upgrade Banner (for Free Users) -->
      <div v-if="!user?.plan_type" class="mx-6 p-6 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white rounded-3xl shadow-xl border border-amber-500/30 space-y-4">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Free Ally Account — Upgrade Recommended
              </span>
            </div>
            <h3 class="text-xl font-black text-white tracking-tight">Unlock Full AI Credit Restoration & Dispute Engine</h3>
            <p class="text-xs text-neutral-300 font-medium max-w-2xl leading-relaxed">
              You are currently on the Free plan. Upgrade to DIY Ally (Turbo at <strong class="text-amber-300 font-black">$29.99</strong>), book a 1-on-1 strategy call, or work directly with Credit Remedi.
            </p>
          </div>

          <NuxtLink 
            to="/profile" 
            class="px-6 py-3.5 bg-gradient-to-r from-[#00828E] via-[#00A3B0] to-[#00D8E6] text-neutral-900 font-black rounded-2xl text-xs transition duration-200 shadow-lg hover:brightness-110 shrink-0 text-center cursor-pointer"
          >
            Upgrade Account Now ($29.99 Turbo) →
          </NuxtLink>
        </div>

        <!-- The 3 Core Upgrade Options Strip -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/10">
          <!-- 1. DIY Ally Engine -->
          <NuxtLink 
            to="/upload" 
            class="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition group text-left block"
          >
            <div class="flex items-center justify-between">
              <span class="text-xs font-black text-[#00D8E6]">1. Use DIY Ally Engine</span>
              <i class="pi pi-bolt text-xs text-[#00D8E6] group-hover:translate-x-1 transition"></i>
            </div>
            <p class="text-[10px] text-neutral-400 mt-1 font-medium leading-normal">
              Upload 3-bureau report & generate FCRA deletion letters ($29.99 Turbo).
            </p>
          </NuxtLink>

          <!-- 2. 1-on-1 Strategy Call -->
          <a 
            href="https://pci.jotform.com/form/240096301428046" 
            target="_blank" 
            rel="noopener noreferrer"
            class="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition group text-left block"
          >
            <div class="flex items-center justify-between">
              <span class="text-xs font-black text-amber-300">2. Book 1-on-1 Strategy Call</span>
              <i class="pi pi-calendar text-xs text-amber-300 group-hover:translate-x-1 transition"></i>
            </div>
            <p class="text-[10px] text-neutral-400 mt-1 font-medium leading-normal">
              Book a personal credit review consultation with an expert strategist.
            </p>
          </a>

          <!-- 3. Work with Credit Remedi -->
          <a 
            href="https://www.creditremedi.store" 
            target="_blank" 
            rel="noopener noreferrer"
            class="p-3.5 rounded-2xl bg-white/10 border border-emerald-500/30 hover:bg-emerald-500/10 transition group text-left block"
          >
            <div class="flex items-center justify-between">
              <span class="text-xs font-black text-emerald-400">3. Work with Credit Remedi</span>
              <i class="pi pi-external-link text-xs text-emerald-400 group-hover:translate-x-1 transition"></i>
            </div>
            <p class="text-[10px] text-neutral-300 mt-1 font-medium leading-normal">
              Done-For-You credit repair services & full dispute management.
            </p>
          </a>
        </div>
      </div>

      <!-- Header Block (Indigo/Teal Gradient Banner) -->
      <div class="bg-gradient-to-br from-[#005F6A] to-[#00A3B0] text-white p-6 pb-16 rounded-b-[40px] shadow-[0_10px_30px_rgba(0,95,106,0.15)] relative">
        <!-- Top Padding Spacer -->
        <div class="pt-2"></div>

        <!-- Center Character Section -->
        <div class="flex items-center justify-between gap-4 mt-6 w-full max-w-lg mx-auto">
          <!-- Welcome Chat Bubble -->
          <div class="flex-1 bg-white/10 backdrop-blur-md border border-white/25 rounded-2xl px-4 py-3 text-[11px] md:text-xs font-semibold leading-relaxed shadow-sm text-left">
            "Hi! As your <span class="text-[#00D8E6] font-extrabold">AI Credit Strategist</span>, I've audited your credit reports and mapped your discrepancies. You are currently active in <span class="text-[#00D8E6] font-extrabold">Phase {{ currentPhase }}</span>."
          </div>

          <!-- Display AllyAI Character -->
          <img 
            src="/AllyAI.png" 
            alt="AI Credit Strategist" 
            class="h-28 w-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.25)] animate-bounce-slow shrink-0"
          />
        </div>
      </div>

      <!-- Horizontally Scrollable Bureau Cards -->
      <div class="relative z-10 -mt-12 px-6 w-full">
        <div class="flex flex-nowrap overflow-x-auto gap-4 pb-6 pt-2 scrollbar-none snap-x snap-mandatory">
          <div 
            v-for="(score, bureau) in clientData.scores" 
            :key="bureau" 
            class="snap-center shrink-0 w-64 bg-white border border-neutral-200 rounded-3xl p-5 shadow-lg flex items-center justify-between"
          >
            <div class="space-y-1.5">
              <span class="text-xs font-extrabold text-neutral-400 uppercase tracking-widest">{{ bureau }}</span>
              <div class="flex items-baseline gap-1">
                <span class="text-3xl font-black text-neutral-900">{{ score || '---' }}</span>
                <span class="text-[10px] text-neutral-400 font-bold">Vantage</span>
              </div>
              <span class="text-[10px] px-2.5 py-0.5 rounded-full border font-bold inline-block" :class="getScoreRatingClass(score)">
                {{ getScoreRating(score) }}
              </span>
            </div>

            <!-- Mini Knob widget -->
            <div class="shrink-0">
              <Knob 
                v-model="clientData.scores[bureau]" 
                :min="300" 
                :max="850" 
                valueColor="#00A3B0" 
                rangeColor="#F1F5F9" 
                :size="85" 
                :strokeWidth="8" 
                :showValue="false"
                readonly 
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Inner Grid Section -->
      <div class="px-4 md:px-8 space-y-6">
        <!-- Quick Stats Card Row -->
        <section class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white border border-neutral-200 rounded-2xl p-4 space-y-1 shadow-sm">
            <span class="text-[10px] text-neutral-400 font-extrabold tracking-wider uppercase">Total Accounts</span>
            <div class="flex items-baseline justify-between">
              <span class="text-2xl font-black text-neutral-900">{{ clientData.summary.totalAccounts }}</span>
              <i class="pi pi-credit-card text-neutral-400 text-sm"></i>
            </div>
          </div>
          <div class="bg-white border border-neutral-200 rounded-2xl p-4 space-y-1 shadow-sm">
            <span class="text-[10px] text-[#00828E] font-extrabold tracking-wider uppercase">Active Negatives</span>
            <div class="flex items-baseline justify-between">
              <span class="text-2xl font-black text-[#00828E]">{{ clientData.summary.negativeAccounts }}</span>
              <i class="pi pi-exclamation-triangle text-[#00828E]/60 text-sm"></i>
            </div>
          </div>
          <div class="bg-white border border-neutral-200 rounded-2xl p-4 space-y-1 shadow-sm">
            <span class="text-[10px] text-neutral-400 font-extrabold tracking-wider uppercase">Hard Inquiries</span>
            <div class="flex items-baseline justify-between">
              <span class="text-2xl font-black text-neutral-900">{{ clientData.summary.inquiries }}</span>
              <i class="pi pi-search-plus text-neutral-400 text-sm"></i>
            </div>
          </div>
          <div class="bg-white border border-neutral-200 rounded-2xl p-4 space-y-1 shadow-sm">
            <span class="text-[10px] text-red-500 font-extrabold tracking-wider uppercase">Mismatches</span>
            <div class="flex items-baseline justify-between">
              <span class="text-2xl font-black text-red-500">{{ clientData.summary.discrepancies }}</span>
              <i class="pi pi-bolt text-red-400/60 text-sm"></i>
            </div>
          </div>
        </section>

        <!-- Saved Assessment & AI Action Game Plan Section (Shown if assessment exists) -->
        <section v-if="clientData.assessment" class="bg-white border border-neutral-200 rounded-3xl p-5 sm:p-6 space-y-5 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-[#00828E]/10 border border-[#00828E]/20 flex items-center justify-center shrink-0 text-[#00828E]">
                <i class="pi pi-compass text-base"></i>
              </div>
              <div>
                <h3 class="font-extrabold text-base sm:text-lg text-neutral-900 leading-tight">Your Saved Assessment & AI Game Plan</h3>
                <p class="text-neutral-500 text-xs mt-0.5">Custom resolution roadmap generated by AI Credit Strategist.</p>
              </div>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <span class="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-teal-50 text-[#00828E] border border-teal-200">
                AI Roadmap Active
              </span>
            </div>
          </div>

          <!-- Assessment Summary Strip -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-0.5">
              <span class="text-[9px] font-black uppercase text-neutral-400 block">Target Goal</span>
              <span class="text-xs font-black text-neutral-900 block truncate">{{ clientData.assessment.primaryGoal }}</span>
            </div>
            <div class="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-0.5">
              <span class="text-[9px] font-black uppercase text-neutral-400 block">Score Range</span>
              <span class="text-xs font-black text-[#00828E] block uppercase">{{ clientData.assessment.scoreRange }}</span>
            </div>
            <div class="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-0.5">
              <span class="text-[9px] font-black uppercase text-neutral-400 block">Est. Resolution</span>
              <span class="text-xs font-black text-neutral-900 block">{{ clientData.assessment.gamePlan?.estimatedResolutionDays || '60-90 Days' }}</span>
            </div>
          </div>

          <!-- Action Steps List -->
          <div v-if="clientData.assessment.gamePlan?.actionSteps" class="space-y-2.5">
            <h4 class="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Recommended Action Sequence</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div 
                v-for="(stepItem, idx) in clientData.assessment.gamePlan.actionSteps" 
                :key="stepItem.title"
                class="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-1"
              >
                <div class="flex items-center gap-2">
                  <span class="w-5 h-5 rounded-full bg-[#00828E] text-white text-[10px] font-black flex items-center justify-center shrink-0">{{ idx + 1 }}</span>
                  <span class="font-extrabold text-xs text-neutral-900 truncate">{{ stepItem.title }}</span>
                </div>
                <p class="text-[11px] text-neutral-600 font-medium leading-relaxed pl-7">{{ stepItem.desc }}</p>
              </div>
            </div>
          </div>

          <!-- The 3 Core Upgrade Options Strip for Free Accounts -->
          <div class="p-5 rounded-2xl bg-neutral-900 text-white space-y-3">
            <h4 class="text-xs font-extrabold text-white">Upgrade & Dispute Options:</h4>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <NuxtLink 
                to="/upload" 
                class="p-3 rounded-xl bg-white/10 hover:bg-white/15 transition flex flex-col justify-between space-y-1 group"
              >
                <span class="text-xs font-black text-[#00D8E6]">1. Use DIY Ally Engine</span>
                <span class="text-[10px] text-neutral-300 font-medium">Upload report & draft FCRA deletion letters ($29.99 Turbo).</span>
              </NuxtLink>

              <a 
                href="https://pci.jotform.com/form/240096301428046" 
                target="_blank" 
                rel="noopener noreferrer"
                class="p-3 rounded-xl bg-white/10 hover:bg-white/15 transition flex flex-col justify-between space-y-1 group"
              >
                <span class="text-xs font-black text-amber-300">2. Book 1-on-1 Strategy Call</span>
                <span class="text-[10px] text-neutral-300 font-medium">Book a personal consultation call with an expert.</span>
              </a>

              <a 
                href="https://www.creditremedi.store" 
                target="_blank" 
                rel="noopener noreferrer"
                class="p-3 rounded-xl bg-white/10 hover:bg-white/15 transition flex flex-col justify-between space-y-1 group"
              >
                <span class="text-xs font-black text-emerald-400">3. Work with Credit Remedi</span>
                <span class="text-[10px] text-neutral-300 font-medium">Full-service credit repair & done-for-you dispute services.</span>
              </a>
            </div>
          </div>
        </section>

        <!-- Negative Accounts & Flagged Collections Section -->
        <section class="bg-white border border-neutral-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
          <div class="flex items-center justify-between gap-3 border-b border-neutral-100 pb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center shrink-0 text-red-600">
                <i class="pi pi-exclamation-triangle text-base"></i>
              </div>
              <div>
                <h3 class="font-extrabold text-base sm:text-lg text-neutral-900 leading-tight">Flagged Negative & Collection Accounts</h3>
                <p class="text-neutral-500 text-xs mt-0.5">Identified derogatory tradelines, collections, late payments, and charge-offs requiring dispute action.</p>
              </div>
            </div>
            <span v-if="clientData.negativeItems?.length > 0" class="text-xs px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 font-extrabold shrink-0">
              {{ clientData.negativeItems.length }} Derogatory Items Found
            </span>
          </div>

          <!-- Negative Accounts Grid -->
          <div v-if="clientData.negativeItems && clientData.negativeItems.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            <div 
              v-for="item in clientData.negativeItems" 
              :key="item.id"
              class="p-4 rounded-2xl bg-neutral-50/90 border border-red-100 space-y-3 relative overflow-hidden"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0">
                  <span class="font-extrabold text-xs text-neutral-900 block truncate">{{ item.creditor_name }}</span>
                  <span class="font-mono text-[10px] text-neutral-400 font-semibold block">{{ item.account_number || 'XXXX-XXXX' }}</span>
                </div>
                <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200 shrink-0">
                  {{ item.account_status || 'Derogatory' }}
                </span>
              </div>

              <div class="pt-2 border-t border-neutral-200/60 flex items-center justify-between text-xs">
                <div class="space-y-0.5">
                  <span class="text-[9px] font-black uppercase text-neutral-400 block">Payment Status</span>
                  <span class="font-bold text-red-600 text-[11px] block">{{ item.payment_status }}</span>
                </div>
                <div class="text-right space-y-0.5">
                  <span class="text-[9px] font-black uppercase text-neutral-400 block">Balance</span>
                  <span class="font-extrabold text-neutral-900 text-[11px] block">${{ item.current_balance || 0 }}</span>
                </div>
              </div>

              <div v-if="item.bureau" class="pt-1.5 flex items-center gap-1.5 text-[9px] text-neutral-500 font-bold">
                <i class="pi pi-building text-[10px] text-[#00828E]"></i>
                <span>Reported on: {{ item.bureau }}</span>
              </div>
            </div>
          </div>

          <!-- Empty Clean State -->
          <div v-else class="p-6 bg-emerald-50/50 border border-emerald-200/60 rounded-2xl text-center space-y-2">
            <i class="pi pi-check-circle text-2xl text-emerald-600"></i>
            <h4 class="text-xs font-black text-emerald-950 uppercase tracking-wide">No Active Collections Found</h4>
            <p class="text-xs text-emerald-800 font-medium">Your credit report contains zero flagged collection or charge-off records.</p>
          </div>
        </section>

        <!-- Credit Building Recommendation Banner (Shown when positive history is needed) -->
        <section v-if="needsCreditBuilding" class="bg-gradient-to-r from-[#005F6A] via-[#00828E] to-[#00A3B0] text-white rounded-3xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/20">
          <div class="space-y-1 max-w-xl">
            <div class="flex items-center gap-2">
              <span class="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/20 text-[#00D8E6] border border-white/20">
                Action Roadmap Recommendation
              </span>
            </div>
            <h3 class="text-lg font-black tracking-tight text-white">Build Positive Credit History</h3>
            <p class="text-xs text-teal-100/90 font-medium leading-relaxed">
              Your AI Credit Strategist determined that your credit profile needs additional positive revolving trade lines to boost your credit mix and accelerate score recovery.
            </p>
          </div>

          <NuxtLink 
            to="/resources#strategy" 
            class="px-5 py-3 bg-white hover:bg-teal-50 text-[#005F6A] font-black rounded-2xl transition duration-200 text-xs shadow-md shrink-0 active:scale-[0.98] text-center"
          >
            View Credit-Building Options →
          </NuxtLink>
        </section>

        <!-- Personal Info & Dispute Timeline -->
        <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 bg-white border border-neutral-200 rounded-3xl p-5 sm:p-6 space-y-5 shadow-sm">
            <!-- Header -->
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20 shrink-0">
                  <i class="pi pi-user text-rose-500 text-sm"></i>
                </div>
                <div>
                  <h3 class="font-extrabold text-base sm:text-lg text-neutral-900 leading-tight">Personal Information Audit</h3>
                  <p class="text-neutral-500 text-xs mt-0.5">Flagged spelling and data variances reported across bureaus.</p>
                </div>
              </div>
              
              <div v-if="clientData.personalInfo" class="shrink-0 hidden sm:block">
                <span class="text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                  {{ (clientData.personalInfo.names?.length || 0) + (clientData.personalInfo.addresses?.length || 0) }} Variances
                </span>
              </div>
            </div>

            <!-- Content Grid -->
            <div v-if="clientData.personalInfo" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <!-- 1. Name Variations Box -->
                <div class="bg-neutral-50/80 border border-neutral-200 rounded-2xl p-4 space-y-2.5 flex flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                        Name Variations ({{ clientData.personalInfo.names?.length || 0 }})
                      </span>
                      <span class="text-[9px] font-extrabold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md sm:hidden">
                        {{ clientData.personalInfo.names?.length || 0 }} names
                      </span>
                    </div>

                    <div class="flex flex-wrap gap-1.5">
                      <span 
                        v-for="(name, idx) in clientData.personalInfo.names" 
                        :key="name" 
                        class="text-[11px] px-2.5 py-1 rounded-lg font-semibold border shadow-xs transition"
                        :class="idx === 0 ? 'bg-white border-[#00A3B0]/40 text-[#005F6A] font-bold' : 'bg-white border-neutral-200 text-neutral-700'"
                      >
                        <i v-if="idx === 0" class="pi pi-check text-[9px] text-[#00828E] mr-1"></i>
                        {{ name }}
                      </span>
                    </div>
                  </div>

                  <p v-if="clientData.personalInfo.names?.length > 1" class="text-[11px] text-rose-600 flex items-center gap-1.5 pt-1 font-semibold border-t border-neutral-200/60">
                    <i class="pi pi-exclamation-circle text-xs shrink-0"></i>
                    <span>Multiple spellings detected. Can cause mixed files.</span>
                  </p>
                </div>

                <!-- 2. Addresses Reported Box -->
                <div class="bg-neutral-50/80 border border-neutral-200 rounded-2xl p-4 space-y-2.5 flex flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                        Addresses Reported ({{ clientData.personalInfo.addresses?.length || 0 }})
                      </span>
                      <span class="text-[9px] font-extrabold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md sm:hidden">
                        {{ clientData.personalInfo.addresses?.length || 0 }} reported
                      </span>
                    </div>

                    <!-- Compact Scrollable Address List -->
                    <ul class="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      <li 
                        v-for="(addr, idx) in clientData.personalInfo.addresses" 
                        :key="addr" 
                        class="text-[11px] px-2.5 py-1.5 rounded-lg bg-white border border-neutral-200 text-neutral-700 flex items-start gap-2 leading-tight shadow-xs"
                      >
                        <i class="pi pi-map-marker text-[10px] text-[#00828E] mt-0.5 shrink-0"></i>
                        <span class="font-medium truncate flex-1" :title="addr">{{ addr }}</span>
                      </li>
                    </ul>
                  </div>

                  <p v-if="clientData.personalInfo.addresses?.length > 1" class="text-[11px] text-rose-600 flex items-center gap-1.5 pt-1 font-semibold border-t border-neutral-200/60">
                    <i class="pi pi-exclamation-circle text-xs shrink-0"></i>
                    <span>Address mismatches found. Recommend unifying.</span>
                  </p>
                </div>

              </div>

              <!-- 3. Employers List (if present) -->
              <div v-if="clientData.personalInfo.employers?.length > 0" class="pt-2 flex items-center gap-2 flex-wrap text-xs text-neutral-500">
                <span class="text-[10px] font-black text-neutral-400 uppercase tracking-widest shrink-0">Employers:</span>
                <span 
                  v-for="emp in clientData.personalInfo.employers" 
                  :key="emp" 
                  class="text-[11px] px-2.5 py-0.5 rounded-md bg-neutral-100 border border-neutral-200 text-neutral-700 font-semibold"
                >
                  {{ emp }}
                </span>
              </div>
            </div>
          </div>

          <div class="bg-white border border-neutral-200 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
            <div class="space-y-6">
              <h3 class="font-bold text-lg text-neutral-900">Dispute Timeline</h3>
              <p class="text-neutral-500 text-xs">Phased progression tracking for account verification and correction.</p>
              
              <div class="timeline-container pl-2">
                <Timeline :value="disputeTimeline">
                  <template #content="slotProps">
                    <div class="ml-4 space-y-1 mb-6">
                      <h4 class="text-xs font-bold text-neutral-900 leading-none">{{ slotProps.item.status }}</h4>
                      <span class="text-[9px] font-bold text-[#00828E] uppercase">{{ slotProps.item.step }}</span>
                      <p class="text-[10px] text-neutral-500 leading-normal mt-0.5">{{ slotProps.item.desc }}</p>
                    </div>
                  </template>
                  <template #marker="slotProps">
                    <span class="flex w-6 h-6 items-center justify-center rounded-full text-xs shrink-0 border" :class="slotProps.item.completed ? 'bg-[#00A3B0] text-white border-[#00A3B0]' : 'bg-neutral-50 text-neutral-400 border-neutral-200'">
                      <i :class="[slotProps.item.icon, 'text-[10px]']"></i>
                    </span>
                  </template>
                </Timeline>
              </div>
            </div>

            <NuxtLink 
              :to="`/discrepancies?phase=${currentPhase}`" 
              class="mt-4 w-full py-3.5 bg-gradient-to-r from-[#00828E] to-[#00A3B0] text-white font-black rounded-xl text-center hover:from-[#005F6A] hover:to-[#00828E] transition duration-300 block shadow-sm text-xs"
            >
              Go to Current Phase (Phase {{ currentPhase }}: Credit Findings) →
            </NuxtLink>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';

const user = useCookie('auth_user');
const isAdmin = computed(() => user.value?.role === 'admin');

// --- 1. ADMIN DASHBOARD DATA & ACTIONS ---
const adminStats = ref({
  totalClients: 0,
  starterPlanUsers: 0,
  turboPlanUsers: 0,
  totalReports: 0,
  totalLetters: 0
});
const clients = ref([]);
const adminLoading = ref(false);

const searchQuery = ref('');
const currentPage = ref(1);

const starterPercentage = computed(() => {
  if (!adminStats.value.totalClients) return 0;
  return Math.round((adminStats.value.starterPlanUsers / adminStats.value.totalClients) * 100);
});

const turboPercentage = computed(() => {
  if (!adminStats.value.totalClients) return 0;
  return Math.round((adminStats.value.turboPlanUsers / adminStats.value.totalClients) * 100);
});

// Client search filtering
const filteredClients = computed(() => {
  if (!searchQuery.value) return clients.value;
  const q = searchQuery.value.toLowerCase();
  return clients.value.filter(c => 
    c.name.toLowerCase().includes(q) || 
    c.email.toLowerCase().includes(q)
  );
});

// Total pages computation
const totalPages = computed(() => {
  return Math.ceil(filteredClients.value.length / 10) || 1;
});

// Paginated records computation
const paginatedClients = computed(() => {
  const start = (currentPage.value - 1) * 10;
  return filteredClients.value.slice(start, start + 10);
});

// Watch query search to reset to page 1
watch(searchQuery, () => {
  currentPage.value = 1;
});

// Pagination page changing
function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

async function refreshAdminData() {
  adminLoading.value = true;
  try {
    const res = await $fetch('/api/admin/analytics');
    if (res.success) {
      adminStats.value = res.stats;
      clients.value = res.clients;
    }
  } catch (err) {
    console.error('Failed to load admin metrics:', err);
  } finally {
    adminLoading.value = false;
  }
}

// User role pill colors
function getRoleClass(role) {
  if (role === 'admin') return 'bg-neutral-100 text-neutral-800 border-neutral-300';
  return 'bg-blue-50 text-blue-600 border-blue-100';
}

// Plan level pill colors
function getPlanClass(plan) {
  if (plan === 'starter') return 'bg-[#00A3B0]/10 text-[#00828E] border-[#00A3B0]/20';
  if (plan === 'turbo') return 'bg-indigo-50 text-indigo-600 border-indigo-200';
  return 'bg-neutral-50 text-neutral-400 border-neutral-200';
}

// Initials resolver
function getInitials(name) {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Avatar multi-color allocator
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

function formatDate(dateStr) {
  if (!dateStr) return '---';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function viewProfile(client) {
  alert(`Viewing credit profile details for client: ${client.name} (${client.email})`);
}

function editClient(client) {
  alert(`Editing settings for client: ${client.name}`);
}

function emailClient(client) {
  alert(`Sending direct notification email to: ${client.email}`);
}

// --- 2. CLIENT DASHBOARD DATA & ACTIONS ---
const clientData = ref({
  scores: { transunion: null, experian: null, equifax: null },
  summary: { totalAccounts: 0, negativeAccounts: 0, inquiries: 0, discrepancies: 0 },
  personalInfo: null
});

const currentPhase = computed(() => {
  const lettersCount = clientData.value.summary?.lettersCount || 0;
  const mailedCount = clientData.value.summary?.mailedLettersCount || 0;
  if (mailedCount >= 3) return 3;
  if (lettersCount >= 1 || mailedCount >= 1) return 2;
  return 1;
});

const needsCreditBuilding = computed(() => {
  if (!clientData.value?.hasReport) return false;
  const total = clientData.value.summary?.totalAccounts || 0;
  const negatives = clientData.value.summary?.negativeAccounts || 0;
  const scores = clientData.value.scores || {};
  const avgScore = ((scores.transunion || 600) + (scores.experian || 600) + (scores.equifax || 600)) / 3;
  return total < 4 || negatives > 0 || avgScore < 680;
});

const disputeTimeline = computed(() => {
  const hasReport = clientData.value.hasReport;
  const lettersCount = clientData.value.summary?.lettersCount || 0;
  const mailedCount = clientData.value.summary?.mailedLettersCount || 0;

  // Step 1: Auditing & Ingestion
  const s1Complete = hasReport;
  const s1Step = s1Complete ? 'Step 1: Complete' : 'Step 1: Active';
  const s1Icon = s1Complete ? 'pi pi-check' : 'pi pi-spin pi-spinner';

  // Step 2: Drafting Dispute Files
  const s2Complete = s1Complete && lettersCount > 0;
  const s2Active = s1Complete && lettersCount === 0;
  const s2Step = s2Complete ? 'Step 2: Complete' : (s2Active ? 'Step 2: Active' : 'Step 2: Pending');
  const s2Icon = s2Complete ? 'pi pi-check' : 'pi pi-file-edit';

  // Step 3: Bureau Mail Status
  const s3Complete = s2Complete && mailedCount > 0 && mailedCount >= lettersCount;
  const s3Active = s2Complete && mailedCount < lettersCount;
  const s3Step = s3Complete ? 'Step 3: Complete' : (s3Active ? 'Step 3: Active' : 'Step 3: Pending');
  const s3Icon = s3Complete ? 'pi pi-check' : 'pi pi-envelope';

  // Step 4: 30-Day Response Audit
  const s4Complete = false;
  const s4Active = s3Complete;
  const s4Step = s4Complete ? 'Step 4: Complete' : (s4Active ? 'Step 4: Active' : 'Step 4: Pending');
  const s4Icon = s4Active ? 'pi pi-hourglass' : 'pi pi-calendar';

  return [
    { 
      status: 'Auditing & Ingestion', 
      step: s1Step, 
      icon: s1Icon, 
      completed: s1Complete, 
      desc: s1Complete ? 'AI parsed credit report and mapped inconsistencies.' : 'Upload your credit report to start the AI audit.' 
    },
    { 
      status: 'Drafting Dispute Files', 
      step: s2Step, 
      icon: s2Icon, 
      completed: s2Complete, 
      desc: s2Complete ? `Generated ${lettersCount} dispute letters.` : (s2Active ? 'Select conflicting fields and draft letters.' : 'Upload credit report first.')
    },
    { 
      status: 'Bureau Mail Status', 
      step: s3Step, 
      icon: s3Icon, 
      completed: s3Complete, 
      desc: s3Complete ? 'All dispute letters have been mailed.' : (s3Active ? `Mailed ${mailedCount} of ${lettersCount} letters. Mark remaining as sent in Letters tab.` : 'Draft your dispute letters first.')
    },
    { 
      status: '30-Day Response Audit', 
      step: s4Step, 
      icon: s4Icon, 
      completed: s4Complete, 
      desc: s4Active ? 'Awaiting credit bureau responses (FCRA statutory 30-day limit).' : 'Pending bureau mail completion.'
    }
  ];
});

function getScoreRating(score) {
  if (score >= 781) return 'Excellent';
  if (score >= 661) return 'Good';
  if (score >= 601) return 'Fair';
  if (score >= 501) return 'Poor';
  return 'Very Poor';
}

function getScoreRatingClass(score) {
  if (score >= 781) return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600';
  if (score >= 661) return 'bg-[#00A3B0]/10 border-[#00A3B0]/20 text-[#00828E]';
  if (score >= 601) return 'bg-amber-500/10 border-amber-500/20 text-amber-600';
  return 'bg-red-500/10 border-red-500/20 text-red-600';
}

// --- 3. LIFECYCLE HOOK ---
onMounted(async () => {
  if (isAdmin.value) {
    await refreshAdminData();
  } else {
    try {
      const res = await $fetch('/api/dashboard-summary');
      clientData.value = res;
    } catch (err) {
      console.error('Failed to load dashboard summary:', err);
    }
  }
});

function downloadPDF() {
  window.print();
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

.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
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
