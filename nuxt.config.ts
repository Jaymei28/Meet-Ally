import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  app: {
    head: {
      title: 'Meet Ally - Credit Remedi Engine',
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'shortcut icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'apple-touch-icon', href: '/favicon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap' }
      ]
    }
  },
  
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
