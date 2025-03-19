import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export const STORAGE_STATE_PATH = ".auth/"

export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  // globalSetup: require.resolve('./tests/baseTest'),
  // path to the global setup files.
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['list'],
    ['junit', {  outputFile: 'test-results/junit.xml' }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL,
    
    // Populates context with given storage state. See https://playwright.dev/docs/api/class-browsercontext#browsercontextstoragesnapshot
    // storageState: "state.json",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    headless: true,
    testIdAttribute: "data-testid",
  },

  /* Configure projects for major browsers */
  projects: [
    // Setup project
    {
      name: 'setup', testMatch: /.*\.setup\.ts/, fullyParallel: true
    },

    {
      name: "chromium",
      use: { 
        ...devices["Desktop Chrome"],
        // Use prepared auth state.
        storageState:STORAGE_STATE_PATH + process.env.STORAGE_STATE_FILE,
       },
      dependencies: ['setup'],
      
    },

    {
      name: "firefox",
      use: { 
        ...devices["Desktop Firefox"],
      storageState:STORAGE_STATE_PATH + process.env.STORAGE_STATE_FILE,
     },
     dependencies: ["setup"],
        
    },

    {
      name: "webkit",
      use: { 
        ...devices["Desktop Safari"],
        storageState:STORAGE_STATE_PATH + process.env.STORAGE_STATE_FILE,
       },
       dependencies: ["setup"],
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
