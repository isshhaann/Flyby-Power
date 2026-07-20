import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        diagnosis: 'ai-diagnosis.html',
      },
    },
  },
});
