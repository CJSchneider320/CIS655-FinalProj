// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  build: {
    transpile: ['vuetify'],
  },
  modules: ['nuxt-vuefire'],
  plugins: ['../plugins/firebase.ts'],
  hooks: {
    'vite:extendConfig'(config) {
      // @ts-expect-error
      config.plugins.push(vuetify({ autoImport: true }));
    }
  },

  vuefire: {
    config: {
      apiKey: "AIzaSyBMv1I4tEGUynCMI4UK7QPZ4uRspfvAmuU",
      authDomain: "cis655-fp.firebaseapp.com",
      projectId: "cis655-fp",
      storageBucket: "cis655-fp.firebasestorage.app",
      messagingSenderId: "1089189854369",
      appId: "1:1089189854369:web:0109f6d612f6cb4074c4e0",
      measurementId: "G-WC0RR25GES"
    },
    auth: true
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

})