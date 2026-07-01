import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      [path.resolve(__dirname, './src/utils.js')]: path.resolve(__dirname, './src/utils.ts'),
      [path.resolve(__dirname, './src/config.js')]: path.resolve(__dirname, './src/config.ts'),
      [path.resolve(__dirname, './src/test/setup.js')]: path.resolve(__dirname, './src/test/setup.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/test/setup.ts'],
    include: ['./src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/test/**', 'src/popup.ts', 'src/background.ts'],
    },
  },
});
