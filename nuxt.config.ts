// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss','nuxt-icon'],
  runtimeConfig: {
    public:{
      ipBE: process.env.NUXT_IP_BE,
    }
  },
  app: {
    head:{
      title:"Arek SC",
      meta:[
        {name:"description", content:"Website Arek SC"},
      ],
    }
  },
})