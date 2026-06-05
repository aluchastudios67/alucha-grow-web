import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig(({ isSsrBuild }) => {
  const isServer = isSsrBuild;

  return {
    plugins: [
      tsconfigPaths({ projects: ["./tsconfig.json"] }),
      tanstackStart(),
      nitro({ preset: "vercel" }),
      react(),
      tailwindcss(),
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
      // Don't bundle React/ReactDOM — let Node.js handle the CJS modules
      noExternal: ["@tanstack/react-start", "@tanstack/react-router"],
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "nodemailer",
      ],
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
