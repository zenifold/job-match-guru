import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        background: path.resolve(__dirname, 'chrome-extension/background.js'),
        popup: path.resolve(__dirname, 'chrome-extension/popup.js'),
        content: path.resolve(__dirname, 'chrome-extension/content.js')
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'background' || 
              chunkInfo.name === 'popup' || 
              chunkInfo.name === 'content') {
            return `chrome-extension/${chunkInfo.name}.js`;
          }
          return 'assets/[name]-[hash].js';
        },
      },
    },
  },
}));