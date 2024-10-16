import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.route("/api/directory/music", async route => {
        const json = ["/path/file-a.mp3", "/path/file-b.mp3", "/path/file-c.mp3"];
        await route.fulfill({ json });
    });

    await page.goto("/");
});

test("has title", async ({ page }) => {
    await expect(page).toHaveTitle("Audio Client");
});

test("clicking load music directory button shows items", async ({ page }) => {
    await page.getByRole("button").click();

    await expect(page.getByRole("listitem")).toHaveCount(3);
    await expect(page.locator("strong")).toHaveText(["file-a.mp3", "file-b.mp3", "file-c.mp3"]);
});

test("clicking on playlist item loads audio source", async ({ page }) => {
    await page.getByRole("button").click();
    await page.getByRole("listitem").first().click();

    // await expect(page.getByRole("listitem")).first().toHaveClass("active");
    await expect(page.getByRole("footer")).toContain("file-a.mp3");
    // await expect(page.getByRole("audio")).toHaveAttribute("src", "/api/directory/audio?path=/path/file-a.mp3");
});
