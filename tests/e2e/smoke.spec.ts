import { expect, test, type Page } from "@playwright/test";

async function expectNamedFields(page: Page) {
  const problems = await page.evaluate(() =>
    [...document.querySelectorAll("input, select, textarea")].flatMap((node) => {
      const el = node as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      const id = el.id;
      const name = el.getAttribute("name") || "";
      const labelText = el.labels
        ? [...el.labels]
            .map((label) => (label.textContent || "").replace(/\s+/g, " ").trim())
            .filter(Boolean)
            .join(" ")
        : "";
      const aria = (el.getAttribute("aria-label") || el.getAttribute("aria-labelledby") || "").trim();
      const issues: string[] = [];
      if (!id) issues.push("id");
      if (!name) issues.push("name");
      if (!labelText && !aria) issues.push("accessible name");
      return issues.length ? [`${el.tagName.toLowerCase()}#${id || "?"} missing ${issues.join(", ")}`] : [];
    }),
  );
  expect(problems).toEqual([]);
}

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
  await expect(page.getByRole("heading", { name: "Sources" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Treasury Department" })).toBeVisible();
  await expect(page.getByText("renewal not found").first()).toBeVisible();
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Undervalued for its fundamentals" })).toBeVisible();
  await page.goto("/methods/growth");
  await expect(page.getByText("Growth seekers")).toBeVisible();
  await page.goto("/methods/families");
  await expect(page.getByRole("heading", { name: "Families (proposed)" })).toBeVisible();
  await page.goto("/compare?a=th-95&b=th-10");
  await expect(page.locator("table")).toBeVisible();
  await expect(page.getByRole("link", { name: "New companies registered" })).toBeVisible();
  await expect(page.locator("table")).not.toContainText("economy.new_firms");
  await expect(page.locator("table")).not.toContainText("1 =");
  await expect(page.locator("table")).not.toContainText(/\d{4}-\d{2}-\d{2}T/);
  await expect(page.locator("table")).toContainText("yes");
  await expect(page.locator("table")).toContainText("no");
  await page.goto("/compare?a=th-15&b=th-35");
  await expect(page.locator("table")).toContainText("Jobs not reported");
  await expect(page.locator("table")).toContainText("Not in the BOI table");
  await expect(page.locator("table")).not.toContainText("Published zero in the BOI table");
  await page.goto("/");
  await page.locator("#map path").first().click();
  await expect(page).toHaveURL(/\/place\/th-/);
  await page.goto("/place/th-10");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Bangkok");
  await page.goto("/indicator/env.pm25");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("PM2.5");
  await expect(page.getByRole("heading", { level: 1 })).not.toContainText("this hour");
  await expect(page.getByText(/snapshot as of \d{2}:\d{2} ICT/).first()).toBeVisible();
  await expect(page.getByText(/refreshes weekly/i)).toBeVisible();
  await expect(page.getByText("No current reading")).toHaveCount(0);
  await page.goto("/bingo");
  await expect(page).toHaveURL(/\/about$/);
  await page.goto("/creative-economy");
  await expect(page).toHaveURL(/\/about$/);
  await page.goto("/asus");
  await expect(page).toHaveURL(/\/about$/);
  await page.goto("/references");
  await expect(page).toHaveURL(/\/methods$/);
  await page.goto("/city/phuket");
  await expect(page).toHaveURL(/\/place\/th-83/);
  await page.goto("/canvas/yala");
  await expect(page).toHaveURL(/\/place\/th-95/);
  await page.goto("/?lens=quiet");
  await expect(page.getByText("Security data missing.")).toBeVisible();
  await expect(page.getByText("extension 86")).toBeVisible();
  await page.goto("/?lens=families");
  await expect(page.getByText("Security data missing.")).toBeVisible();
  await page.goto("/rankings");
  await expect(page.locator("#map svg")).toBeVisible();
  await page.goto("/no-such-page");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page is not on the site.");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
  expect(overflow).toBe(false);
});

test("polish at 1440: title, fields, singular units, titled links, one border label", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page).toHaveTitle("Growth seekers · sciti");
  await expect(page.locator("#lens")).toHaveAttribute("name", "lens");
  await expect(page.locator("label[for=lens]")).toContainText("Lens");
  await expect(page.locator("#province")).toHaveAttribute("name", "province");
  await expect(page.locator("label[for=province]")).toContainText("Choose a province");
  await expect(page.locator("#site-menu")).toHaveAttribute("name", "menu");
  await expect(page.locator("label[for=site-menu]")).toContainText("Menu");
  await expect(page.locator(".attrib")).toContainText("geoBoundaries");
  await page.goto("/?lens=quiet");
  await expect(page).toHaveTitle("Quiet retirement · sciti");
  await expect(page.getByRole("link", { name: "Manager Online: Cambodia border trade was 0 baht in November 2025" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Thai PBS Policy Watch: the Cambodia border is not what it was" })).toBeVisible();
  await expect(page.getByText("https://mgronline.com")).toHaveCount(0);
  await expect(page.getByText("https://policywatch.thaipbs.or.th")).toHaveCount(0);
  const marks = (await page.locator(".ranks").allInnerTexts()).join("\n");
  expect(marks).toContain("Cambodia border paused");
  expect(marks).not.toMatch(/Cambodia border(?! paused)/);
  await page.goto("/");
  await page.locator("details summary").click();
  await expectNamedFields(page);
  await page.goto("/compare");
  await expect(page.locator("#compare-a")).toHaveAttribute("name", "compare-a");
  await expect(page.locator("label[for=compare-a]")).toContainText("First place");
  await expect(page.locator("#compare-b")).toHaveAttribute("name", "compare-b");
  await expect(page.locator("label[for=compare-b]")).toContainText("Second place");
  await expectNamedFields(page);
  await page.goto("/place/th-10");
  await expect(page).toHaveTitle("Bangkok · Growth seekers · sciti");
  const bangkok = await page.locator("#profile").innerText();
  expect(bangkok).toContain("[1/2564]");
  expect(bangkok.replace(/\[[^\]]*\]/g, "").replace(/\b\d{1,4}\/25\d\d\b/g, "")).not.toMatch(/\b25\d\d\b/);
  expect(bangkok).toContain("1 dataset,");
  expect(bangkok).not.toContain("1 datasets");
  await page.goto("/place/th-70");
  await expect(page.locator("#profile")).toContainText("not reported since 19 September 2026");
  await page.goto("/place/th-63");
  await expect(page.locator("#profile")).toContainText("not reported since 6 October 2026");
  await page.goto("/place/th-73");
  await expect(page.locator("#profile")).toContainText("not reported since 13 October 2026");
  await page.goto("/place/th-11");
  await expect(page.locator("#profile")).toContainText("1 area,");
  await expect(page.locator("#profile")).not.toContainText("1 areas");
  await page.goto("/?lang=th");
  await expect(page.locator(".attrib")).toContainText("ขอบเขต: geoBoundaries ระดับจังหวัด");
  await page.goto("/place/th-10?lang=th");
  await expect(page).toHaveTitle("กรุงเทพมหานคร · คนที่ตามการเติบโต · sciti");
  const thai = await page.locator("#profile").innerText();
  expect(thai).toContain("กรมการปกครอง");
  expect(thai).not.toContain("Department of Provincial Administration");
  expect(thai).not.toMatch(/\b20\d\d\b/);
  expect(thai).toMatch(/\b25[6-7]\d\b/);
  await page.goto("/?lang=th&lens=border");
  await expect(page).toHaveTitle("การค้าชายแดน · sciti");
  await expect(page.getByText("ชายแดนกัมพูชาหยุด").first()).toBeVisible();
  await expect(page.getByText("การค้าชายแดนกัมพูชาหยุด")).toHaveCount(0);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
  expect(overflow).toBe(false);
});

test("chinese at 390: title, credit, titled link, one border label", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?lang=zh&lens=quiet");
  await expect(page).toHaveTitle("安静退休 · sciti");
  await expect(page.locator("html")).toHaveAttribute("lang", "zh");
  await expect(page.locator(".attrib")).toContainText("边界：geoBoundaries");
  await expect(page.getByRole("link", { name: "Manager Online：佛历 2568 年 11 月对柬埔寨边境贸易为零铢" })).toBeVisible();
  await expect(page.getByText("https://mgronline.com")).toHaveCount(0);
  await expect(page.getByText("柬埔寨边境暂停").first()).toBeVisible();
  const quietOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
  expect(quietOverflow).toBe(false);
  const wrappedDate = await page.evaluate(() =>
    [...document.querySelectorAll(".nowrap")].some((node) => /\d{4}\s*年/.test(node.textContent || "")),
  );
  expect(wrappedDate).toBe(true);
  await page.goto("/place/th-32?lang=zh&lens=quiet");
  await expect(page).toHaveTitle("素林府 · 安静退休 · sciti");
  await expect(page.locator("#profile")).toContainText("国家统计局");
  await expect(page.locator("#profile")).not.toContainText("National Statistical Office");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
  expect(overflow).toBe(false);
  await page.goto("/place/th-10?lang=zh");
  await expectNoAsciiPunctNearCjk(page);
  const zhProfile = await page.locator("#profile").innerText();
  expect(zhProfile).toContain("实际产出增长：5.2%，2023");
  expect(zhProfile).not.toMatch(/\d\s+%/);
  await page.goto("/methods?lang=zh");
  await expectNoAsciiPunctNearCjk(page);
  await expectDatesDoNotWrap(page);
  await expect(page.getByText("（提议）").first()).toBeVisible();
  await page.goto("/methods/quiet?lang=zh");
  await expectNoAsciiPunctNearCjk(page);
  await expectDatesDoNotWrap(page);
});

async function expectNoAsciiPunctNearCjk(page: Page) {
  const hits = await page.evaluate(() => {
    const cjk = /[\u3400-\u9FFF\uF900-\uFAFF]/;
    const text = (document.body.innerText || "").replace(/https?:\/\/\S+/g, "");
    const found: string[] = [];
    for (const match of text.matchAll(/[:(),]/g)) {
      const index = match.index ?? 0;
      const before = text[index - 1] || "";
      const after = text[index + 1] || "";
      if (cjk.test(before) || cjk.test(after)) found.push(text.slice(Math.max(0, index - 16), index + 16));
    }
    return found.slice(0, 8);
  });
  expect(hits).toEqual([]);
}

async function expectDatesDoNotWrap(page: Page) {
  const wrapped = await page.evaluate(() => {
    const re = /(?:佛历\s*)?\d{4}(?:\s*[、和–—-]\s*\d{4})*\s*年(?:\s*第[一二三四]季度|\s*学年(?:第一学期)?)?(?:\s*\d{1,2}\s*月(?:\s*\d{1,2}\s*日)?)?(?:\s*[至到]\s*\d{1,2}\s*月(?:\s*\d{1,2}\s*日)?)?/g;
    const out: string[] = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node: Node | null;
    while ((node = walker.nextNode())) {
      const text = node.textContent || "";
      for (const match of text.matchAll(re)) {
        const range = document.createRange();
        range.setStart(node, match.index ?? 0);
        range.setEnd(node, (match.index ?? 0) + match[0].length);
        const tops = new Set([...range.getClientRects()].map((rect) => Math.round(rect.top)));
        if (tops.size > 1) out.push(match[0]);
      }
    }
    return out;
  });
  expect(wrapped).toEqual([]);
}

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
