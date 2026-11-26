import { defineConfig, devices } from '@playwright/test'

// End-to-end tests live in e2e/ and run against the built site: `pnpm build && pnpm e2e`.
// The site is served by `vite preview` on 127.0.0.1:$E2E_PORT (default 4173), and share.html by
// `vite` on the next port. Each run starts its own servers (--strictPort, no reuse), so a test
// never hits a server, or an old build, someone else left running.
const port = Number(process.env.E2E_PORT ?? 4173)
const sharePort = port + 1
process.env.E2E_SHARE_URL = `http://127.0.0.1:${sharePort}/share.html?theme=light`

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: `http://127.0.0.1:${port}`, trace: 'on-first-retry' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: `pnpm --filter atlas-site exec vite preview --host 127.0.0.1 --port ${port} --strictPort`,
      url: `http://127.0.0.1:${port}/`,
      reuseExistingServer: false,
      timeout: 60_000,
    },
    {
      // Dev server for share.html, the page the social cards are drawn from (e2e/share-images.spec.ts).
      command: `pnpm --filter atlas-site exec vite --host 127.0.0.1 --port ${sharePort} --strictPort`,
      url: `http://127.0.0.1:${sharePort}/share.html`,
      reuseExistingServer: false,
      timeout: 60_000,
    },
  ],
})
