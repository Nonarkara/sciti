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

const ENGLISH_KEYS = new Set(["en", "note", "sourceName", "publisher", "smartCityStatus"]);

function englishYears(value, found, key = "") {
  if (typeof value === "string") {
    if (ENGLISH_KEYS.has(key) && !/[\u0E00-\u0E7F\u4E00-\u9FFF]/.test(value)) {
      const bare = value
        .replace(/https?:\/\/\S+/g, "")
        .replace(/selectyear=\d+/g, "")
        .replace(/\[[^\]]*\]/g, "")
        .replace(/\b\d{1,4}\/(?:25|26)\d{2}\b/g, "");
      const years = [...bare.matchAll(/\b(?:25|26)\d{2}\b/g)].filter((match) => {
        const index = match.index ?? 0;
        const year = match[0];
        const wrapped = bare[index - 1] === "(" && bare[index + year.length] === ")";
        const before = bare.slice(Math.max(0, index - 24), index);
        const gloss = /20\d{2}|period|January|February|March|April|May|June|July|August|September|October|November|December/.test(before);
        return !(wrapped && !gloss);
      });
      if (years.length || /B\.E\./.test(bare)) found.push(`${key}: ${value.slice(0, 180)}`);
    }
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) englishYears(item, found, key);
    return;
  }
  if (value && typeof value === "object") {
    for (const [next, item] of Object.entries(value)) englishYears(item, found, next);
  }
}

function zhPunctuation(value, found, key = "") {
  if (typeof value === "string") {
    if (key === "zh") {
      const stripped = value
        .replace(/https?:\/\/\S+/g, "")
        .replace(/\bn\.a\./g, "")
        .replace(/\b[A-Za-z0-9_]+(?:\.[A-Za-z0-9_]+)+\b/g, "")
        .replace(/\d+\.\d+/g, "")
        .replace(/\d{1,2}:\d{2}/g, "");
      if (/[,.:()]/.test(stripped)) found.push(value.slice(0, 180));
    }
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) zhPunctuation(item, found, key);
    return;
  }
  if (value && typeof value === "object") {
    for (const [next, item] of Object.entries(value)) zhPunctuation(item, found, next);
  }
}

test("English copy uses Gregorian years", () => {
  const baseline = JSON.parse(readFileSync("public/data/baseline.json", "utf8"));
  const found = [];
  for (const bundle of [baseline, LENSES, PLACE_NOTES, RECORD_NOTES, SOURCES, MISSING_SERIES, INDICATORS]) {
    englishYears(bundle, found);
  }
  assert.deepEqual(found, []);
});

test("Chinese sentences use fullwidth punctuation", () => {
  const baseline = JSON.parse(readFileSync("public/data/baseline.json", "utf8"));
  const found = [];
  for (const bundle of [baseline, LENSES, PLACE_NOTES, RECORD_NOTES, SOURCES, MISSING_SERIES, INDICATORS]) {
    zhPunctuation(bundle, found);
  }
  assert.deepEqual(found, []);
});
