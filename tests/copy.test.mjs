import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { INDICATORS } from "../ingest/indicators.mjs";
import { LENSES } from "../src/lib/lenses.mjs";
import { PLACE_NOTES } from "../src/lib/notes.mjs";
import { PUBLISHERS, publisherName } from "../src/lib/publishers.mjs";
import { MISSING_SERIES, RECORD_NOTES, SOURCES } from "../src/lib/sources.mjs";

function thaiYears(value, found, key = "") {
  if (typeof value === "string") {
    if (key === "th" && /\b20\d\d\b/.test(value)) found.push(value.slice(0, 160));
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) thaiYears(item, found, key);
    return;
  }
  if (value && typeof value === "object") {
    for (const [next, item] of Object.entries(value)) thaiYears(item, found, next);
  }
}

test("every observation publisher has a Thai and Chinese name", () => {
  const baseline = JSON.parse(readFileSync("public/data/baseline.json", "utf8"));
  const names = [...new Set(baseline.observations.map((row) => row.publisher).filter(Boolean))];
  assert.ok(names.length > 20);
  for (const name of names) {
    assert.ok(PUBLISHERS[name], name);
    assert.equal(publisherName("en", name), name);
    assert.notEqual(publisherName("th", name), name);
    assert.notEqual(publisherName("zh", name), name);
    assert.equal(publisherName("zh", name), PUBLISHERS[name].zh);
  }
  assert.equal(publisherName("th", "Unlisted office"), "Unlisted office");
});

test("Thai copy uses Buddhist years, not a Western year beside them", () => {
  const baseline = JSON.parse(readFileSync("public/data/baseline.json", "utf8"));
  const found = [];
  for (const bundle of [baseline, LENSES, PLACE_NOTES, RECORD_NOTES, SOURCES, MISSING_SERIES, INDICATORS]) {
    thaiYears(bundle, found);
  }
  assert.deepEqual(found, []);
});
