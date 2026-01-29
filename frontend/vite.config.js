import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "node:path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: "camelCase"
    }
  },
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "components"),
      "@hooks": path.resolve(__dirname, "hooks")
    }
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: true
      }
    }
  }
})
