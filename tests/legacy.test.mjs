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

test("the cloudflare redirect file keeps the old addresses", () => {
  const text = readFileSync(new URL("../public/_redirects", import.meta.url), "utf8");
  assert.match(text, /\/city\/yala\s+\/place\/th-95\s+302/);
  assert.match(text, /\/city\/reg-ayutthaya\s+\/place\/th-14\s+302/);
  assert.match(text, /\/creative-economy\s+\/about\s+302/);
  assert.match(text, /\/api\/\*\s+\/api-gone.json\s+404/);
  assert.doesNotMatch(text, /\/no-such-page/);
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
