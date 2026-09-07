import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3419",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npx vite --config e2e/vite.config.ts",
    url: "http://localhost:3419",
    reuseExistingServer: true,
  },
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 2,
    },
  },
});
