import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { legacyTarget } from "../src/lib/legacy.mjs";

const redirects = JSON.parse(readFileSync(new URL("../src/data/redirects.json", import.meta.url), "utf8"));
const places = [
  { id: "th-83", en: "Phuket" },
  { id: "th-80", en: "Nakhon Si Thammarat" },
  { id: "th-14", en: "Phra Nakhon Si Ayutthaya" },
  { id: "th-33", en: "Si Sa Ket" },
];

test("old award and story addresses leave that copy behind", () => {
  assert.equal(legacyTarget("/bingo", places, redirects), "/about");
  assert.equal(legacyTarget("/partners/", places, redirects), "/about");
  assert.equal(legacyTarget("/audit", places, redirects), "/about");
  assert.equal(legacyTarget("/creative-economy", places, redirects), "/about");
  assert.equal(legacyTarget("/asus", places, redirects), "/about");
  assert.equal(legacyTarget("/why", places, redirects), "/about");
  assert.equal(legacyTarget("/showcase/", places, redirects), "/about");
  assert.equal(legacyTarget("/invest", places, redirects), "/about");
  assert.equal(legacyTarget("/program", places, redirects), "/about");
  assert.equal(legacyTarget("/knowledge", places, redirects), "/about");
  assert.equal(legacyTarget("/kimi", places, redirects), "/about");
  assert.equal(legacyTarget("/rankings", places, redirects), "/");
  assert.equal(legacyTarget("/discover", places, redirects), "/");
  assert.equal(legacyTarget("/story/", places, redirects), "/");
  assert.equal(legacyTarget("/methodology", places, redirects), "/methods");
  assert.equal(legacyTarget("/sources", places, redirects), "/methods");
  assert.equal(legacyTarget("/references", places, redirects), "/methods");
  assert.equal(legacyTarget("/map", places, redirects), "/");
});

function redirectRules(text) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const bits = line.split(/\s+/);
      return { from: bits[0], to: bits[1], status: Number(bits[2]) };
    });
}

function resolveRedirect(rules, start) {
  let path = start;
  for (let hop = 0; hop < 6; hop++) {
    const exact = rules.find((rule) => !rule.from.includes("*") && rule.from === path);
    const dynamic = rules.find((rule) => {
      if (!rule.from.includes("*")) return false;
      const body = rule.from.replace("*", "");
      return path.startsWith(body) && path.length > body.length;
    });
    const rule = exact || dynamic;
    if (!rule) return { path, status: path === "/" ? 200 : 404 };
    if (rule.status === 200) return { path: rule.to === "/" ? path : rule.to, status: 200 };
    path = rule.to;
  }
  return { path, status: 500 };
}

test("the cloudflare redirect file keeps the old addresses", () => {
  const text = readFileSync(new URL("../public/_redirects", import.meta.url), "utf8");
  const rules = redirectRules(text);
  const dynamicAt = rules.findIndex((rule) => rule.from.includes("*"));
  assert.ok(dynamicAt > 0);
  assert.ok(rules.slice(0, dynamicAt).every((rule) => !rule.from.includes("*")));
  assert.ok(rules.slice(dynamicAt).every((rule) => rule.from.includes("*")));
  assert.ok(rules.filter((rule) => rule.from.includes("*")).length < 100);
  assert.ok(rules.filter((rule) => !rule.from.includes("*")).length <= 2000);
  assert.equal(rules.some((rule) => rule.status === 404), false);
  const place = rules.find((rule) => rule.from === "/place/*");
  assert.equal(place.to, "/");
  assert.equal(place.status, 200);
  assert.ok(rules.some((rule) => rule.from === "/city/yala/" && rule.to === "/place/th-95" && rule.status === 302));
  assert.match(text, /\/city\/yala\s+\/place\/th-95\s+302/);
  assert.match(text, /\/city\/reg-ayutthaya\s+\/place\/th-14\s+302/);
  assert.match(text, /\/creative-economy\s+\/about\s+302/);
  assert.doesNotMatch(text, /\/api\/\*/);
  assert.doesNotMatch(text, /\/no-such-page/);

  const pages = ["/", "/about", "/rankings", "/methodology", "/story", "/why", "/showcase", "/creative-economy", "/partners", "/map", "/program", "/knowledge", "/discover", "/invest", "/compare", "/references", "/audit"];
  const cities = Object.keys(redirects).map((slug) => `/city/${slug}`);
  const sitemap = pages.concat(cities);
  assert.equal(sitemap.length, 135);
  const failed = sitemap.filter((url) => resolveRedirect(rules, url).status !== 200);
  assert.deepEqual(failed, []);
  assert.equal(resolveRedirect(rules, "/api/cities").status, 404);
  assert.equal(resolveRedirect(rules, "/place/th-10").status, 200);
  assert.equal(resolveRedirect(rules, "/city/phuket/").status, 200);
  console.log(`redirects: ${rules.length} rules, static ${dynamicAt}, dynamic ${rules.length - dynamicAt}, sitemap 135 -> 200, /api/cities -> 404`);
});

test("an old city slug opens the province, without the old score", () => {
  assert.equal(legacyTarget("/city/phuket", places, redirects), "/place/th-83");
  assert.equal(legacyTarget("/city/nakhon-si-thammarat", places, redirects), "/place/th-80");
  assert.equal(legacyTarget("/canvas/phuket", places, redirects), "/place/th-83");
  assert.equal(legacyTarget("/city/not-a-city", places, redirects), "/");
  assert.equal(legacyTarget("/canvas/not-a-city", places, redirects), "/");
  assert.equal(legacyTarget("/city/reg-ayutthaya", places, redirects), "/place/th-14");
  assert.equal(legacyTarget("/city/reg-sisaket", places, redirects), "/place/th-33");
  assert.equal(legacyTarget("/place/th-10", places, redirects), null);
});
