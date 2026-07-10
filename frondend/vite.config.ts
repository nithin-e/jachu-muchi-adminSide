import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: "/admin/",

  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@app": path.resolve(__dirname, "./src/app"),
      "@lib": path.resolve(__dirname, "./src/lib"),
    },
  },

  build: {
    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true,
  },
});