// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["nuxt-auth-utils", "@pinia/nuxt", "@nuxt/icon"],
  app: {
    head: {
      title: "Workle Tourism Team",
    },
  },
  runtimeConfig: {
    mongoUri: process.env.MONGODB_URI,
    secretKey: process.env.SECRET_KEY,
    session: {
      maxAge: 60 * 60 * 24 * 7,
    },
  },
  css: ["~/assets/styles/main.scss"],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @use "sass:math";
          @use "@/assets/styles/variables.scss" as *;
          `,
        },
      },
    },
  },
});
