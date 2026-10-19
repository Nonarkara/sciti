import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { legacyTarget } from "../src/lib/legacy.mjs";

const redirects = JSON.parse(readFileSync(new URL("../src/data/redirects.json", import.meta.url), "utf8"));
const places = [
  { id: "th-83", en: "Phuket" },
  { id: "th-80", en: "Nakhon Si Thammarat" },
];

test("old award and story addresses leave that copy behind", () => {
  assert.equal(legacyTarget("/bingo", places, redirects), "/about");
  assert.equal(legacyTarget("/partners/", places, redirects), "/about");
  assert.equal(legacyTarget("/audit", places, redirects), "/about");
  assert.equal(legacyTarget("/rankings", places, redirects), "/");
  assert.equal(legacyTarget("/discover", places, redirects), "/");
  assert.equal(legacyTarget("/story/", places, redirects), "/");
  assert.equal(legacyTarget("/methodology", places, redirects), "/methods");
  assert.equal(legacyTarget("/sources", places, redirects), "/methods");
  assert.equal(legacyTarget("/map", places, redirects), "/");
});

test("an old city slug opens the province, without the old score", () => {
  assert.equal(legacyTarget("/city/phuket", places, redirects), "/place/th-83");
  assert.equal(legacyTarget("/city/nakhon-si-thammarat", places, redirects), "/place/th-80");
  assert.equal(legacyTarget("/city/not-a-city", places, redirects), "/");
  assert.equal(legacyTarget("/place/th-10", places, redirects), null);
});
