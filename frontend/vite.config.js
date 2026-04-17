import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 3027,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
