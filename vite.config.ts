import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Use relative paths so the build works under any hosting sub-path
  base: "/",
  server: {
    host: "::",
    port: 8080,
    // SPA fallback for the dev server — refreshes on /shop, /product/... etc. won't 404
    historyApiFallback: true,
  },
  preview: {
    host: "::",
    port: 8080,
    historyApiFallback: true,
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
