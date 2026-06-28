import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ZSMART OSS — frontend dev/build config
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
});
