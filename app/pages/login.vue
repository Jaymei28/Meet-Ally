<template>
  <div class="min-h-screen bg-gradient-to-br from-[#005F6A] via-[#00828E] to-[#00A3B0] flex items-center justify-center p-4 py-8 relative overflow-hidden font-sans">
    
    <!-- Background subtle floating glowing circles -->
    <div class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>

    <!-- 1. LOGIN VIEW -->
    <div 
      v-if="currentView === 'login'" 
      class="w-full max-w-md bg-white rounded-[32px] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,95,106,0.25)] border border-neutral-100 relative z-10 animate-scale-up"
    >
      <!-- Top Title with Logo -->
      <div class="flex flex-col items-center justify-center text-center space-y-4 mb-6">
        <img src="/Meet-ally-logo.png" alt="Meet Ally Logo" class="h-16 object-contain mx-auto drop-shadow-sm" />
        <div>
          <h2 class="text-3xl font-black text-neutral-900 tracking-tight">Sign In</h2>
          <p class="text-neutral-500 text-sm mt-1">Welcome back! Please enter your details.</p>
        </div>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-5">
        
        <!-- Error Alert -->
        <Transition name="fade">
          <div v-if="error" class="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <i class="pi pi-exclamation-circle text-base shrink-0"></i>
            <span>{{ error }}</span>
          </div>
        </Transition>

        <!-- Email Input -->
        <div class="space-y-1.5">
          <label for="email" class="text-xs font-extrabold text-neutral-700 uppercase tracking-wider">Email Address</label>
          <div class="relative">
            <input 
              v-model="email"
              type="email" 
              id="email" 
              required
              placeholder="Enter your email"
              class="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 text-neutral-900 rounded-2xl font-semibold placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#00A3B0]/20 focus:border-[#00A3B0] transition"
            />
          </div>
        </div>

        <!-- Password Input -->
        <div class="space-y-1.5">
          <label for="password" class="text-xs font-extrabold text-neutral-700 uppercase tracking-wider">Password</label>
          <div class="relative">
            <input 
              v-model="password"
              :type="showPassword ? 'text' : 'password'" 
              id="password" 
              required
              placeholder="Enter your password"
              class="w-full pl-4 pr-10 py-3 bg-neutral-50 border border-neutral-200 text-neutral-900 rounded-2xl font-semibold placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#00A3B0]/20 focus:border-[#00A3B0] transition"
            />
            <span 
              @click="showPassword = !showPassword" 
              class="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
            >
              <i :class="['pi', showPassword ? 'pi-eye-slash' : 'pi-eye']"></i>
            </span>
          </div>
        </div>

        <!-- Remember Me / Forgot Password -->
        <div class="flex items-center justify-between text-xs font-bold pt-1">
          <label class="flex items-center gap-2 text-neutral-600 cursor-pointer select-none">
            <input type="checkbox" class="w-4 h-4 rounded border-neutral-300 text-[#00A3B0] focus:ring-[#00A3B0]" />
            <span>Remember me</span>
          </label>
          <button 
            type="button" 
            @click="currentView = 'forgot'" 
            class="text-[#00828E] hover:text-[#005F6A] transition cursor-pointer underline-offset-2 hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <!-- Submit Button -->
        <button 
          type="submit" 
          :disabled="loading"
          class="w-full py-3.5 bg-gradient-to-r from-[#00828E] to-[#00A3B0] text-white font-extrabold rounded-2xl hover:from-[#005F6A] hover:to-[#00828E] transition duration-300 flex items-center justify-center gap-2 shadow-[0_6px_24px_rgba(0,163,176,0.25)] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm active:scale-[0.98]"
        >
          <i v-if="loading" class="pi pi-spin pi-spinner text-sm"></i>
          <span>{{ loading ? 'Signing in...' : 'Sign In' }}</span>
        </button>

      </form>

      <!-- Divider -->
      <div class="flex items-center gap-4 my-6">
        <div class="flex-1 h-[1px] bg-neutral-200"></div>
        <span class="text-xs font-extrabold text-neutral-400 uppercase tracking-widest">or</span>
        <div class="flex-1 h-[1px] bg-neutral-200"></div>
      </div>

      <!-- Sign Up link -->
      <div class="text-center text-xs font-bold text-neutral-600">
        Don't have an account? 
        <button 
          @click="currentView = 'plans'" 
          class="text-[#00828E] hover:text-[#005F6A] font-extrabold transition cursor-pointer ml-1 underline-offset-2 hover:underline"
        >
          Sign up
        </button>
      </div>

      <!-- Support Footer -->
      <div class="mt-6 pt-6 border-t border-neutral-100 flex items-center justify-center gap-2 text-xs font-bold text-neutral-500">
        <i class="pi pi-envelope text-neutral-400 text-sm"></i>
        <span>Having trouble logging in? 
          <a href="mailto:help@creditremedi.com" class="text-[#00828E] hover:text-[#005F6A] transition ml-1 underline">
            Contact Support
          </a>
        </span>
      </div>
    </div>


    <!-- 2. CHOOSE YOUR PLAN VIEW -->
    <div 
      v-else-if="currentView === 'plans'" 
      class="w-full max-w-4xl space-y-6 relative z-10 animate-scale-up"
    >
      <!-- Plan Header -->
      <div class="text-center space-y-2 text-white">
        <img src="/Meet-ally-logo.png" alt="Meet Ally Logo" class="h-16 object-contain mx-auto drop-shadow-md brightness-0 invert" />
        <h1 class="text-3xl sm:text-4xl font-black tracking-tight">Choose Your Plan</h1>
        <p class="text-teal-100 text-sm font-semibold max-w-md mx-auto">
          Select a tailored subscription plan to proceed with registration and unlock automated credit remediation.
        </p>
      </div>

      <!-- 2 Plan Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        
        <!-- Starter Plan Card -->
        <div class="bg-white rounded-[32px] p-6 sm:p-8 border border-neutral-200 shadow-xl flex flex-col justify-between space-y-6 relative">
          <div class="space-y-5">
            <!-- Header -->
            <div class="text-center space-y-1">
              <h3 class="text-lg font-black text-neutral-800">Standard Plan (Starter)</h3>
              <div class="flex items-baseline justify-center gap-1">
                <span class="text-3xl sm:text-4xl font-black text-neutral-900">$49.99</span>
                <span class="text-xs font-bold text-neutral-400">/month</span>
              </div>
            </div>

            <!-- IdentityIQ Requirement Alert -->
            <div class="bg-[#00828E]/10 border border-[#00828E]/25 rounded-2xl p-3 text-[11px] font-semibold text-[#005F6A] flex items-start gap-2">
              <i class="pi pi-check text-[#00828E] text-xs mt-0.5 shrink-0"></i>
              <span>IdentityIQ credit monitoring is required for accurate tracking & results</span>
            </div>

            <!-- Features Breakdown -->
            <div class="space-y-4 text-xs">
              <!-- Category: Core AI -->
              <div class="space-y-2">
                <span class="text-[10px] font-black text-neutral-400 uppercase tracking-widest block border-b border-neutral-100 pb-1">Core AI Tools</span>
                <div class="space-y-1.5">
                  <div class="flex items-center gap-2 text-neutral-700 font-medium">
                    <i class="pi pi-check-circle text-emerald-500 text-xs shrink-0"></i>
                    <span>AI-Powered Dispute Letter Generator</span>
                  </div>
                  <div class="flex items-center gap-2 text-neutral-700 font-medium">
                    <i class="pi pi-check-circle text-emerald-500 text-xs shrink-0"></i>
                    <span>Consumer Law Citation Assistance</span>
                  </div>
                  <div class="flex items-center gap-2 text-neutral-700 font-medium">
                    <i class="pi pi-check-circle text-emerald-500 text-xs shrink-0"></i>
                    <span>Guided Step-by-Step Workflows</span>
                  </div>
                </div>
              </div>

              <!-- Category: Automation -->
              <div class="space-y-2">
                <span class="text-[10px] font-black text-neutral-400 uppercase tracking-widest block border-b border-neutral-100 pb-1">Automation & Tracking</span>
                <div class="space-y-1.5">
                  <div class="flex items-center gap-2 text-neutral-700 font-medium">
                    <i class="pi pi-check-circle text-emerald-500 text-xs shrink-0"></i>
                    <span>15-Day Automated Follow-Up Letters</span>
                  </div>
                  <div class="flex items-center gap-2 text-neutral-400 line-through">
                    <i class="pi pi-times-circle text-neutral-300 text-xs shrink-0"></i>
                    <span>Auto Dispute Timeline Reminders</span>
                  </div>
                  <div class="flex items-center gap-2 text-neutral-700 font-medium">
                    <i class="pi pi-check-circle text-emerald-500 text-xs shrink-0"></i>
                    <span>Monthly Credit Progress Dashboard</span>
                  </div>
                </div>
              </div>

              <!-- Category: Support & Access -->
              <div class="space-y-2">
                <span class="text-[10px] font-black text-neutral-400 uppercase tracking-widest block border-b border-neutral-100 pb-1">Support & Additional</span>
                <div class="space-y-1.5">
                  <div class="flex items-center gap-2 text-neutral-700 font-medium">
                    <i class="pi pi-check-circle text-emerald-500 text-xs shrink-0"></i>
                    <span>AI Chat Assistant (24/7)</span>
                  </div>
                  <div class="flex items-center gap-2 text-neutral-700 font-medium">
                    <i class="pi pi-check-circle text-emerald-500 text-xs shrink-0"></i>
                    <span>Direct Bureau & Regulator Filing Access</span>
                  </div>
                  <div class="flex items-center gap-2 text-neutral-400 line-through">
                    <i class="pi pi-times-circle text-neutral-300 text-xs shrink-0"></i>
                    <span>Fundability Score & Lender Matching</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Select Button -->
          <button 
            @click="selectPlan('starter')"
            class="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold rounded-2xl transition duration-200 shadow-md cursor-pointer text-xs active:scale-[0.98]"
          >
            Choose Starter ($49.99/mo)
          </button>
        </div>

        <!-- Pro (Turbo) Plan Card -->
        <div class="bg-white rounded-[32px] p-6 sm:p-8 border-2 border-[#00D8E6] shadow-2xl flex flex-col justify-between space-y-6 relative ring-4 ring-[#00D8E6]/20">
          
          <!-- Most Popular Badge -->
          <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#00828E] to-[#00D8E6] text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-md flex items-center gap-1">
            <span>🔥 MOST POPULAR</span>
          </div>

          <div class="space-y-5">
            <!-- Header -->
            <div class="text-center space-y-1 pt-1">
              <h3 class="text-lg font-black text-[#005F6A]">Pro Plan (Turbo)</h3>
              <div class="flex items-baseline justify-center gap-1">
                <span class="text-3xl sm:text-4xl font-black text-neutral-900">$29.99</span>
                <span class="text-xs font-bold text-neutral-400">/month</span>
              </div>
            </div>

            <!-- IdentityIQ Requirement Alert -->
            <div class="bg-[#00828E]/10 border border-[#00828E]/25 rounded-2xl p-3 text-[11px] font-semibold text-[#005F6A] flex items-start gap-2">
              <i class="pi pi-check text-[#00828E] text-xs mt-0.5 shrink-0"></i>
              <span>IdentityIQ credit monitoring is required for accurate tracking & results</span>
            </div>

            <!-- Features Breakdown -->
            <div class="space-y-4 text-xs">
              <!-- Category: Core AI -->
              <div class="space-y-2">
                <span class="text-[10px] font-black text-[#00828E] uppercase tracking-widest block border-b border-teal-100 pb-1">Everything in Starter Plus:</span>
                <div class="space-y-1.5">
                  <div class="flex items-center gap-2 text-neutral-800 font-bold">
                    <i class="pi pi-check-circle text-emerald-500 text-xs shrink-0"></i>
                    <span>Fundability Score & Lender Matching</span>
                  </div>
                  <div class="flex items-center gap-2 text-neutral-800 font-bold">
                    <i class="pi pi-check-circle text-emerald-500 text-xs shrink-0"></i>
                    <span>Funding Readiness Score + Approval Roadmap</span>
                  </div>
                  <div class="flex items-center gap-2 text-neutral-800 font-bold">
                    <i class="pi pi-check-circle text-emerald-500 text-xs shrink-0"></i>
                    <span>Auto Dispute Timeline Reminders</span>
                  </div>
                </div>
              </div>

              <!-- Category: Premium Privileges -->
              <div class="space-y-2">
                <span class="text-[10px] font-black text-neutral-400 uppercase tracking-widest block border-b border-neutral-100 pb-1">Exclusive VIP Features</span>
                <div class="space-y-1.5">
                  <div class="flex items-center gap-2 text-neutral-700 font-medium">
                    <i class="pi pi-check-circle text-emerald-500 text-xs shrink-0"></i>
                    <span>Priority Updates & Feature Access</span>
                  </div>
                  <div class="flex items-center gap-2 text-neutral-700 font-medium">
                    <i class="pi pi-check-circle text-emerald-500 text-xs shrink-0"></i>
                    <span>Private Community Access</span>
                  </div>
                  <div class="flex items-center gap-2 text-neutral-700 font-medium">
                    <i class="pi pi-check-circle text-emerald-500 text-xs shrink-0"></i>
                    <span>Free Digital Credit Journal (Downloadable)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Select Button -->
          <button 
            @click="selectPlan('turbo')"
            class="w-full py-3.5 bg-gradient-to-r from-[#00828E] to-[#00A3B0] hover:from-[#005F6A] hover:to-[#00828E] text-white font-black rounded-2xl transition duration-200 shadow-lg cursor-pointer text-xs active:scale-[0.98]"
          >
            Choose Premium Turbo ($29.99/mo)
          </button>
        </div>

      </div>

      <!-- Back to Login -->
      <div class="text-center pt-2">
        <button 
          @click="currentView = 'login'" 
          class="text-xs text-white/90 hover:text-white font-bold transition flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
        >
          <i class="pi pi-arrow-left text-[10px]"></i>
          <span>Already have an account? Sign in</span>
        </button>
      </div>
    </div>


    <!-- 3. REGISTRATION & CHECKOUT FORM VIEW -->
    <div 
      v-else-if="currentView === 'register'" 
      class="w-full max-w-xl bg-white rounded-[32px] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,95,106,0.25)] border border-neutral-100 relative z-10 animate-scale-up"
    >
      <!-- Top Title with Logo -->
      <div class="flex flex-col items-center justify-center text-center space-y-2 mb-5">
        <img src="/Meet-ally-logo.png" alt="Meet Ally Logo" class="h-12 object-contain mx-auto drop-shadow-sm" />
        <div>
          <h2 class="text-2xl font-black text-neutral-900 tracking-tight">Create Account & Checkout</h2>
          <p class="text-neutral-500 text-xs mt-0.5">Secure registration powered by Meet Ally.</p>
        </div>
      </div>

      <!-- Selected Plan Summary Banner -->
      <div class="mb-5 p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-between shadow-xs">
        <div class="space-y-0.5">
          <span class="text-[9px] uppercase font-black tracking-widest text-[#00828E] block">Selected Membership</span>
          <div class="flex items-baseline gap-1.5">
            <span class="text-sm font-black text-neutral-900">
              {{ selectedPlan === 'turbo' ? 'Pro Plan (Turbo)' : 'Standard Plan (Starter)' }}
            </span>
            <span class="text-xs font-black text-[#00828E]">
              {{ selectedPlan === 'turbo' ? '$69.99/mo' : '$49.99/mo' }}
            </span>
          </div>
        </div>
        <button 
          @click="currentView = 'plans'" 
          class="text-xs font-extrabold text-[#00828E] hover:underline bg-white px-3 py-1.5 rounded-xl border border-teal-200 shadow-xs cursor-pointer"
        >
          Change Plan
        </button>
      </div>

      <!-- Registration Form -->
      <form @submit.prevent="handleRegister" class="space-y-5">
        
        <!-- Error Alert -->
        <Transition name="fade">
          <div v-if="error" class="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <i class="pi pi-exclamation-circle text-base shrink-0"></i>
            <span>{{ error }}</span>
          </div>
        </Transition>

        <!-- Section 1: Account Info -->
        <div class="space-y-3">
          <span class="text-[10px] font-black text-neutral-400 uppercase tracking-widest block border-b border-neutral-100 pb-1">1. Account Details</span>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <!-- Full Name -->
            <div class="space-y-1">
              <label for="reg-name" class="text-[11px] font-extrabold text-neutral-700 uppercase tracking-wider">Full Legal Name</label>
              <input 
                v-model="regName"
                type="text" 
                id="reg-name" 
                required
                placeholder="First and Last Name"
                class="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 text-neutral-900 rounded-xl font-semibold text-xs placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#00A3B0]/20 focus:border-[#00A3B0] transition"
              />
            </div>

            <!-- Email Address -->
            <div class="space-y-1">
              <label for="reg-email" class="text-[11px] font-extrabold text-neutral-700 uppercase tracking-wider">Email Address</label>
              <input 
                v-model="regEmail"
                type="email" 
                id="reg-email" 
                required
                placeholder="name@example.com"
                class="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 text-neutral-900 rounded-xl font-semibold text-xs placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#00A3B0]/20 focus:border-[#00A3B0] transition"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <!-- Phone Number -->
            <div class="space-y-1">
              <label for="reg-phone" class="text-[11px] font-extrabold text-neutral-700 uppercase tracking-wider">Phone <span class="text-neutral-400 font-normal">(Optional)</span></label>
              <input 
                v-model="regPhone"
                type="tel" 
                id="reg-phone" 
                placeholder="(555) 000-0000"
                class="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 text-neutral-900 rounded-xl font-semibold text-xs placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#00A3B0]/20 focus:border-[#00A3B0] transition"
              />
            </div>

            <!-- Password -->
            <div class="space-y-1">
              <label for="reg-password" class="text-[11px] font-extrabold text-neutral-700 uppercase tracking-wider">Password</label>
              <div class="relative">
                <input 
                  v-model="regPassword"
                  :type="showRegPassword ? 'text' : 'password'" 
                  id="reg-password" 
                  required
                  placeholder="Create password"
                  class="w-full pl-3.5 pr-9 py-2.5 bg-neutral-50 border border-neutral-200 text-neutral-900 rounded-xl font-semibold text-xs placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#00A3B0]/20 focus:border-[#00A3B0] transition"
                />
                <span 
                  @click="showRegPassword = !showRegPassword" 
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                >
                  <i :class="['pi', showRegPassword ? 'pi-eye-slash' : 'pi-eye', 'text-xs']"></i>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 2: Payment Method Details -->
        <div class="space-y-3 pt-2">
          <div class="flex items-center justify-between border-b border-neutral-100 pb-1">
            <span class="text-[10px] font-black text-neutral-400 uppercase tracking-widest block">2. Payment Method (Card)</span>
            <span class="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
              <i class="pi pi-lock text-[9px]"></i> 256-Bit SSL Encrypted
            </span>
          </div>

          <!-- Cardholder Name -->
          <div class="space-y-1">
            <label for="card-name" class="text-[11px] font-extrabold text-neutral-700 uppercase tracking-wider">Cardholder Name</label>
            <input 
              v-model="cardName"
              type="text" 
              id="card-name" 
              required
              placeholder="Name on card"
              class="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 text-neutral-900 rounded-xl font-semibold text-xs placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#00A3B0]/20 focus:border-[#00A3B0] transition"
            />
          </div>

          <!-- Card Number -->
          <div class="space-y-1">
            <label for="card-number" class="text-[11px] font-extrabold text-neutral-700 uppercase tracking-wider">Card Number</label>
            <div class="relative">
              <input 
                v-model="cardNumber"
                type="text" 
                id="card-number" 
                maxlength="19"
                required
                placeholder="4242 •••• •••• ••••"
                class="w-full pl-3.5 pr-24 py-2.5 bg-neutral-50 border border-neutral-200 text-neutral-900 rounded-xl font-semibold text-xs placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#00A3B0]/20 focus:border-[#00A3B0] transition font-mono"
              />
              <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-neutral-400">
                <i class="pi pi-credit-card text-base text-[#00828E]"></i>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <!-- Expiration Date -->
            <div class="space-y-1">
              <label for="card-exp" class="text-[11px] font-extrabold text-neutral-700 uppercase tracking-wider">Expires</label>
              <input 
                v-model="cardExp"
                type="text" 
                id="card-exp" 
                maxlength="5"
                required
                placeholder="MM/YY"
                class="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 text-neutral-900 rounded-xl font-semibold text-xs placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#00A3B0]/20 focus:border-[#00A3B0] transition font-mono"
              />
            </div>

            <!-- CVC -->
            <div class="space-y-1">
              <label for="card-cvc" class="text-[11px] font-extrabold text-neutral-700 uppercase tracking-wider">CVC</label>
              <input 
                v-model="cardCvc"
                type="password" 
                id="card-cvc" 
                maxlength="4"
                required
                placeholder="CVC"
                class="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 text-neutral-900 rounded-xl font-semibold text-xs placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#00A3B0]/20 focus:border-[#00A3B0] transition font-mono"
              />
            </div>
          </div>

          <!-- Billing ZIP / Address -->
          <div class="grid grid-cols-3 gap-2 pt-1">
            <div class="col-span-2 space-y-1">
              <label for="bill-city" class="text-[10px] font-extrabold text-neutral-700 uppercase tracking-wider">City</label>
              <input 
                v-model="billCity"
                type="text" 
                id="bill-city" 
                placeholder="City"
                class="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 text-neutral-900 rounded-xl font-semibold text-xs placeholder:text-neutral-400 focus:outline-none focus:border-[#00A3B0] transition"
              />
            </div>
            <div class="space-y-1">
              <label for="bill-zip" class="text-[10px] font-extrabold text-neutral-700 uppercase tracking-wider">ZIP Code</label>
              <input 
                v-model="billZip"
                type="text" 
                id="bill-zip" 
                placeholder="ZIP"
                class="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 text-neutral-900 rounded-xl font-semibold text-xs placeholder:text-neutral-400 focus:outline-none focus:border-[#00A3B0] transition"
              />
            </div>
          </div>
        </div>

        <!-- Submit Payment Button -->
        <button 
          type="submit" 
          :disabled="regLoading"
          class="w-full mt-4 py-3.5 bg-gradient-to-r from-[#00828E] to-[#00A3B0] text-white font-black rounded-xl hover:from-[#005F6A] hover:to-[#00828E] transition duration-200 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs active:scale-[0.98]"
        >
          <i v-if="regLoading" class="pi pi-spin pi-spinner text-xs"></i>
          <i v-else class="pi pi-lock text-xs"></i>
          <span>{{ regLoading ? 'Processing Payment & Creating Account...' : (selectedPlan === 'turbo' ? 'Pay $69.99 & Start Membership' : 'Pay $49.99 & Start Membership') }}</span>
        </button>

      </form>

      <!-- Back to Login -->
      <div class="text-center text-xs font-bold text-neutral-600 mt-5 pt-4 border-t border-neutral-100">
        Already have an account? 
        <button 
          @click="currentView = 'login'" 
          class="text-[#00828E] hover:text-[#005F6A] font-extrabold transition cursor-pointer ml-1 underline-offset-2 hover:underline"
        >
          Sign in
        </button>
      </div>
    </div>

    <!-- 4. FORGOT PASSWORD VIEW -->
    <div 
      v-else-if="currentView === 'forgot'" 
      class="w-full max-w-md bg-white rounded-[32px] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,95,106,0.25)] border border-neutral-100 relative z-10 animate-scale-up space-y-6"
    >
      <div class="flex flex-col items-center justify-center text-center space-y-3">
        <div class="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[#00828E]">
          <i class="pi pi-lock text-xl"></i>
        </div>
        <div>
          <h2 class="text-2xl font-black text-neutral-900 tracking-tight">Account Recovery</h2>
          <p class="text-neutral-500 text-xs mt-1">Need help accessing your Meet Ally account?</p>
        </div>
      </div>

      <div class="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs text-neutral-600 space-y-2">
        <p class="font-medium leading-relaxed">
          For security and identity protection, account resets are verified by our support specialists.
        </p>
        <p class="font-medium leading-relaxed">
          Please contact our support desk directly at <strong class="text-neutral-900">help@creditremedi.com</strong> from your registered email address to initiate a password reset.
        </p>
      </div>

      <!-- Direct Email Support Button -->
      <a 
        href="mailto:help@creditremedi.com?subject=Meet%20Ally%20Password%20Reset%20Request"
        class="w-full py-3 bg-gradient-to-r from-[#00828E] to-[#00A3B0] text-white font-black rounded-xl hover:from-[#005F6A] hover:to-[#00828E] transition flex items-center justify-center gap-2 text-xs shadow-md cursor-pointer block text-center"
      >
        <i class="pi pi-envelope"></i>
        <span>Email help@creditremedi.com</span>
      </a>

      <!-- Back to Sign In -->
      <div class="text-center pt-2">
        <button 
          @click="currentView = 'login'" 
          class="text-xs text-neutral-500 hover:text-neutral-800 font-bold transition flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
        >
          <i class="pi pi-arrow-left text-[10px]"></i>
          <span>Back to Sign In</span>
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';

definePageMeta({
  layout: false
});

// View management: 'login' | 'plans' | 'register' | 'forgot'
const currentView = ref('login');
const selectedPlan = ref('turbo');

// Login Form State
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);
const error = ref('');

// Registration & Payment Form State
const regName = ref('');
const regEmail = ref('');
const regPhone = ref('');
const regPassword = ref('');
const showRegPassword = ref(false);
const cardName = ref('');
const cardNumber = ref('');
const cardExp = ref('');
const cardCvc = ref('');
const billCity = ref('');
const billZip = ref('');
const regLoading = ref(false);

function selectPlan(plan) {
  selectedPlan.value = plan;
  error.value = '';
  currentView.value = 'register';
}

async function handleLogin() {
  loading.value = true;
  error.value = '';
  try {
    const res = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value
      }
    });

    if (res.success) {
      navigateTo('/');
    }
  } catch (err) {
    error.value = formatErrorMessage(err, 'Failed to authenticate. Please check your email and password.');
  } finally {
    loading.value = false;
  }
}

async function handleRegister() {
  regLoading.value = true;
  error.value = '';
  try {
    const res = await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        name: regName.value,
        email: regEmail.value,
        password: regPassword.value,
        plan_type: selectedPlan.value,
        contact_number: regPhone.value,
        cardholder_name: cardName.value,
        card_number: cardNumber.value,
        city: billCity.value,
        zipcode: billZip.value
      }
    });

    if (res.success) {
      navigateTo('/');
    }
  } catch (err) {
    error.value = formatErrorMessage(err, 'Registration failed. Please check your information and try again.');
  } finally {
    regLoading.value = false;
  }
}
</script>

<style scoped>
.animate-scale-up {
  animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.94) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
