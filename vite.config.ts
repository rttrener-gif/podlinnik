import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Сборка в один HTML-файл: игру можно открыть двойным щелчком, без сервера.
export default defineConfig(({ mode }) => ({
  plugins: [react(), ...(mode === 'production' ? [viteSingleFile()] : [])],
  base: './',
  build: { chunkSizeWarningLimit: 4000, assetsInlineLimit: 100000000 },
}));
