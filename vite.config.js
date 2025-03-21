import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://charityserver.runasp.net", // استخدام القيمة من .env
      },
    },
  },
  plugins: [react()],
});
