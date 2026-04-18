const { test, expect } = require("@playwright/test");

test.describe("Toaster Movie site", () => {
  test("desktop homepage renders key SEO and archive content", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Toaster Movie/i);
    await expect(page.locator("h1")).toHaveText("Toaster Movie");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /official Toaster movie stills/i);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://toastermovie.lol/");
    await expect(page.getByText("Independent editorial archive. Not an official Netflix website.")).toBeVisible();
    await expect(page.getByRole("link", { name: "Watch on Netflix" })).toHaveAttribute("href", /netflix\.com\/title\/81779444/);

    const cards = page.locator(".gallery-card");
    await expect(cards).toHaveCount(7);

    await page.getByRole("button", { name: "Title Art" }).click();
    await expect(page.locator(".gallery-card:not([hidden])")).toHaveCount(2);
    await expect(page.locator("[data-results-count]")).toHaveText("Showing 2 archive items");

    await page.getByRole("button", { name: "Stills" }).click();
    await expect(page.locator(".gallery-card:not([hidden])")).toHaveCount(2);

    await page.getByRole("button", { name: "All" }).click();
    await expect(page.locator(".gallery-card:not([hidden])")).toHaveCount(7);

    const ldJsonTexts = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(ldJsonTexts.some((text) => text.includes('"@type": "Movie"'))).toBe(true);
    expect(ldJsonTexts.some((text) => text.includes('"@type": "FAQPage"'))).toBe(true);

    const imagesLoaded = await page.evaluate(() =>
      Array.from(document.images).every((image) => image.complete && image.naturalWidth > 0)
    );
    expect(imagesLoaded).toBe(true);
  });

  test("mobile layout stays within the viewport and keeps archive reachable", async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true
    });
    const page = await context.newPage();

    await page.goto("/");

    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByRole("link", { name: "Browse Official Stills" })).toBeVisible();
    await page.getByRole("link", { name: "Browse Official Stills" }).click();
    await expect(page.locator("#stills")).toBeInViewport();

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);

    await expect(page.locator(".gallery-card")).toHaveCount(7);
    await context.close();
  });
});
