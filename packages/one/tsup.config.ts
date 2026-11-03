import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['source/index.ts', 'source/icons/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: ['react'],
  outDir: 'dist',
});
