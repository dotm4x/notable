import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      // Resolve the workspace package to source so library edits hot-reload here.
      {
        find: /^@dotm4x\/notable\/styles\.css$/,
        replacement: fileURLToPath(
          new URL(
            '../../packages/components/react/source/styles/index.css',
            import.meta.url,
          ),
        ),
      },
      {
        find: /^@dotm4x\/notable$/,
        replacement: fileURLToPath(
          new URL(
            '../../packages/components/react/source/index.ts',
            import.meta.url,
          ),
        ),
      },
    ],
  },
});
