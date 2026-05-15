import type { Plugin } from "vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/** Serve public/pitchdeck/index.html for /pitchdeck (and trailing slash) in dev. */
function pitchdeckPublicRoute(): Plugin {
  return {
    name: "pitchdeck-public-route",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const path = req.url?.split("?")[0] ?? "";
        if (path === "/pitchdeck" || path === "/pitchdeck/") {
          req.url = "/pitchdeck/index.html";
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), pitchdeckPublicRoute()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8787",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
