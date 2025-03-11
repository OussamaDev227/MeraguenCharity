import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://applicable-gaby-oussama01-baf39923.koyeb.app", // استخدام القيمة من .env
      },
    },
  },
  plugins: [react()],
});
