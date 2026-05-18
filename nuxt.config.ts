// https://nuxt.com/docs/api/configuration/nuxt-config
// Suppress Node 22 DEP0155 warnings from upstream packages (iconify, vue/shared, vueuse)
process.env.NODE_OPTIONS = `${process.env.NODE_OPTIONS || ''} --no-deprecation`.trim()

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  modules: [
    "@pinia/nuxt",
    "@nuxt/ui",
    "@nuxtjs/color-mode",
    "pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/google-fonts",
  ],
  css: ["~/assets/css/main.css"],

  app: {
    head: {
      titleTemplate: "%s | BrainLib - Smart Learning Management System",
      title: "BrainLib",
      htmlAttrs: {
        lang: "id", // Indonesian language for better SEO/A11y context
      },
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { charset: "utf-8" },
        { name: "description", content: "BrainLib is a smart AI-driven Learning Management System to automate assessments, track analytics, and manage education efficiently." },
        { name: "keywords", content: "LMS, AI Learning, Education Automation, BrainLib, Smart Classroom" },
        // Open Graph / Facebook
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://brainlib.egadestaviano.my.id/" },
        { property: "og:title", content: "BrainLib - Smart Learning Management System" },
        { property: "og:description", content: "Platform pendidikan cerdas bertenaga AI untuk manajemen sekolah dan pembelajaran modern." },
        { property: "og:image", content: "/image/banner-seo.png" },
        // Twitter
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "BrainLib - Smart LMS" },
        { name: "twitter:description", content: "Automate assessment generation and track real-time analytics with BrainLib AI." },
      ],
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "alternate icon", href: "/favicon.ico" },
      ],
    },
  },

  // @ts-ignore
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700],
      Outfit: [400, 600, 700, 800],
    },
    display: 'swap',
    prefetch: true,
    preconnect: true,
    preload: true,
    download: true,
  },

  pinia: {
    storesDirs: ["./app/stores/**"],
  },

  typescript: {
    strict: true,
    typeCheck: true,
  },
  nitro: {
    compressPublicAssets: true,
    minify: true,
    typescript: {
      strict: true,
    },
  },

  experimental: {
    viewTransition: true,
    componentIslands: true,
  },

  future: {
    compatibilityVersion: 4,
  },

  runtimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY,
    geminiModel: process.env.GEMINI_MODEL || "gemini-2.0-flash",
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
      stripePublishableKey: process.env.NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
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

  devtools: { enabled: false },
  vite: {
    server: {
      allowedHosts: ["brainlib.egadestaviano.my.id"],
    },
  },
});
