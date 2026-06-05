import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import path from "node:path";

export default defineConfig(({ isSsrBuild }) => {
  const isServer = isSsrBuild;

  return {
    plugins: [
      tsconfigPaths({ projects: ["./tsconfig.json"] }),
      tanstackStart({
        server: { entry: "server" },
      }),
      react(),
      tailwindcss(),
      nitro({
        preset: "vercel",
        externals: {
          traceInclude: ["nodemailer"],
        },
      }),
    ],
    build: {
      rollupOptions: {
        external: !isServer
          ? [
              "nodemailer",
              "node:fs/promises",
              "node:path",
              "fs",
              "path",
              "https",
              "dns",
              "net",
              "tls",
            ]
          : [],
      },
    },
    ssr: {
      noExternal: true,
    },
    optimizeDeps: {
      exclude: ["nodemailer"],
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
