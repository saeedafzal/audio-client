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

    await expect(page.getByRole("heading", { name: "file-a.mp3" })).toBeVisible();
    await expect(page.locator("audio")).toHaveAttribute("src", "/api/directory/file?path=/path/file-a.mp3");
    await expect(page.getByRole("listitem").first()).toHaveClass("active");
});

test("when audio is loaded, clicking on another track loads it", async ({ page }) => {
    await page.getByRole("button").click();
    await page.getByRole("listitem").first().click();
    await page.getByRole("listitem").nth(1).click();

    await expect(page.getByRole("heading", { name: "file-a.mp3" })).not.toBeVisible();
    await expect(page.getByRole("heading", { name: "file-b.mp3" })).toBeVisible();
    await expect(page.locator("audio")).toHaveAttribute("src", "/api/directory/file?path=/path/file-b.mp3");
    await expect(page.getByRole("listitem").first()).not.toHaveClass("active");
    await expect(page.getByRole("listitem").nth(1)).toHaveClass("active");
});
