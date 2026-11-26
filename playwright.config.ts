import { defineConfig, devices } from '@playwright/test'

// End-to-end tests live in e2e/ and run against the built site: `pnpm build && pnpm e2e`.
// The site is served by `vite preview` on 127.0.0.1:4173, and share.html by `vite` on 4174
// (open ones are reused locally).
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: 'http://127.0.0.1:4173', trace: 'on-first-retry' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'pnpm --filter atlas-site preview --strictPort',
      url: 'http://127.0.0.1:4173/',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
    {
      // Dev server for share.html, the page the social cards are drawn from (e2e/share-images.spec.ts).
      command: 'pnpm --filter atlas-site exec vite --host 127.0.0.1 --port 4174 --strictPort',
      url: 'http://127.0.0.1:4174/share.html',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
  ],
})
