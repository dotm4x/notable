import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'source/index.ts',
    'source/components/index.ts',
    'source/icons/index.ts',
    'source/data-table/index.ts',
    'source/components/code-block/highlighter.tsx',
  ],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom', '@tanstack/react-table', 'shiki'],
  outDir: 'dist',
  onSuccess:
    'cat dist/components/index.css source/data-table/data-table.css >> dist/index.css',
});
