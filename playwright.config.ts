import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 1,
  reporter: 'html',
  timeout: 60 * 60 * 1000,
  use: {
    trace: 'on-first-retry',
    baseURL: 'https://neal.fun/stimulation-clicker/'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ]
});
