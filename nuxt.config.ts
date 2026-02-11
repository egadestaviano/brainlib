// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  modules: [
    "@pinia/nuxt",
    "@nuxt/ui",
    "@nuxtjs/color-mode",
    "pinia-plugin-persistedstate/nuxt",
  ],
  css: ["~/assets/css/main.css"],

  app: {
    head: {
      title: "Ims Portofolio",
      meta: [{ name: "description", content: "ims Portofolio" }],
      link: [{ rel: "preload", as: "style", href: "/assets/css/main.css" }],
    },
  },

  pinia: {
    storesDirs: ["./app/stores/**"],
  },

  typescript: {
    strict: true,
    typeCheck: true,
  },
  nitro: {
    typescript: {
      strict: true,
    },
  },

  runtimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY,
    geminiModel: process.env.GEMINI_MODEL || "gemini-2.0-flash",
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
    },
  },

  colorMode: {
    preference: "light",
    fallback: "light",
    classSuffix: "",
    storageKey: "nuxt-color-mode",
    storage: "localStorage",
  },
  ui: {
    colorMode: false,
  },

  devtools: { enabled: true },
  vite: {
    server: {
      allowedHosts: ["mentora.allfilldev.com"],
    },
  },
});
