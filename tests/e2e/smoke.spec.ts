import { expect, test } from "@playwright/test";

const viewports = [
  { width: 1440, height: 900 },
  { width: 1024, height: 768 },
  { width: 390, height: 844 },
];

const langs = [
  { code: "en", h1: "Which cities?", query: "/" },
  { code: "th", h1: "เมืองไหน", query: "/?lang=th" },
  { code: "zh", h1: "哪些城市？", query: "/?lang=zh" },
];

for (const viewport of viewports) {
  for (const lang of langs) {
    test(`chooser ${viewport.width} ${lang.code}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(lang.query);
      await expect(page.locator("#map svg")).toBeVisible();
      await expect(page.locator("h1")).toHaveText(lang.h1);
      await expect(page.locator("dialog")).toHaveCount(0);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
      expect(overflow).toBe(false);
      await expect(page.getByText(/red dot|creative economy|bingo/i)).toHaveCount(0);
    });
  }
}

test("coverage, methods, compare, place and old addresses", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.getByRole("link", { name: "Coverage", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Coverage");
  await page.goto("/methods");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Methods");
  await page.goto("/methods/growth");
  await expect(page.getByText("Growth seekers")).toBeVisible();
  await page.goto("/methods/families");
  await expect(page.getByText("proposed")).toBeVisible();
  await page.goto("/compare");
  await expect(page.locator("table")).toBeVisible();
  await page.goto("/place/th-10");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Bangkok");
  await page.goto("/indicator/env.pm25");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("PM2.5");
  await page.goto("/bingo");
  await expect(page).toHaveURL(/\/about$/);
  await page.goto("/city/phuket");
  await expect(page).toHaveURL(/\/place\/th-83/);
  await page.goto("/rankings");
  await expect(page.locator("#map svg")).toBeVisible();
  await page.goto("/no-such-page");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page is not on the site.");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
  expect(overflow).toBe(false);
});

test("thai and chinese routes stay in that language", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/methods?lang=th");
  await expect(page.locator("html")).toHaveAttribute("lang", "th");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("วิธี");
  await page.goto("/about?lang=zh");
  await expect(page.locator("html")).toHaveAttribute("lang", "zh");
  await expect(page.getByText("城市就是经济")).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
  expect(overflow).toBe(false);
});
