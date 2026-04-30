import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("@shikijs/langs/dist/typescript")) {
            return "shiki-lang-typescript";
          }
          if (id.includes("@shikijs/langs/dist/tsx")) {
            return "shiki-lang-tsx";
          }
          if (id.includes("@shikijs/langs/dist/jsx")) {
            return "shiki-lang-jsx";
          }
          if (id.includes("@shikijs/langs/dist/javascript")) {
            return "shiki-lang-javascript";
          }
          if (id.includes("@shikijs/langs/dist/graphql")) {
            return "shiki-lang-graphql";
          }
          if (id.includes("@shikijs/langs/dist/json")) {
            return "shiki-lang-json";
          }
        },
      },
    },
  },
})
