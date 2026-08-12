import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  css: [
    '~/assets/css/main.css',
    'primeicons/primeicons.css'
  ],

  modules: [
    '@primevue/nuxt-module'
  ],

  vite: {
    plugins: [
      tailwindcss()
    ]
  },

  primevue: {
    options: {
      ripple: true,
      theme: {
        preset: 'Aura'
      }
    }
  },

  runtimeConfig: {
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || ''
  }
})
