import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./tests",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    workers: process.env.CI ? 1 : undefined,
    use: {
        baseURL: "http://localhost:5173"
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] }
        },
        {
            name: "firefox",
            use: { ...devices["Desktop Firefox"] }
        },
        {
            name: "webkit",
            use: { ...devices["Desktop Safari"] }
        }
    ],

    webServer: {
        command: "npm start",
        url: "http://localhost:5173",
        timeout: 5 * 1000,
        reuseExistingServer: !process.env.CI
    }
});
