import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Separate from vite.config.ts so tests never load the Sentry upload plugin.
// Tests live next to the code they cover: src/**/*.test.ts(x). See CLAUDE.md "Testing".
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
