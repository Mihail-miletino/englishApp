import { defineConfig } from 'vite';
import fs from "node:fs";
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
    https: {
      key: fs.readFileSync("/Users/michail/localhost+2-key.pem", "utf-8"),
      cert: fs.readFileSync("/Users/michail/localhost+2.pem", "utf-8")
    },
    proxy: {
      "/api": {
        target: "https://localhost:4000",
        changeOrigin: true,
        secure: false
      }
    }
  }
})
