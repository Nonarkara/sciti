import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { gregorianProse } from "../src/lib/era.mjs";

test("era conversion changes dates and periods, not announcement numbers", () => {
  assert.equal(gregorianProse("20 October 2569"), "20 October 2026");
  assert.equal(gregorianProse("December 2568"), "December 2025");
  assert.equal(gregorianProse("B.E. 2561"), "2018");
  assert.equal(gregorianProse("labelled in 2564–2566"), "labelled in 2021–2023");
  assert.equal(gregorianProse("source period: 2564-2568"), "source period: 2021-2025");
  assert.equal(gregorianProse("[1/2564]"), "[1/2564]");
  assert.equal(gregorianProse("BOI announcement 19/2565, Border SEZ measures"), "BOI announcement 19/2565, Border SEZ measures");
  assert.equal(gregorianProse("No. 1/2564"), "No. 1/2564");
  assert.equal(gregorianProse("announcements 1/2564-1/2566"), "announcements 1/2564-1/2566");
  assert.equal(
    gregorianProse("see https://www.boi.go.th/upload/content/19_2565.pdf and selectyear=2568"),
    "see https://www.boi.go.th/upload/content/19_2565.pdf and selectyear=2568",
  );
});

test("stored document numbers keep the Buddhist year", () => {
  const baseline = JSON.parse(readFileSync("public/data/baseline.json", "utf8"));
  const sez = baseline.observations.find((row) => row.indicatorId === "economy.sez");
  const smart = baseline.observations.find((row) => row.indicatorId === "governance.smart_city_areas");
  assert.match(sez.sourceName, /19\/2565/);
  assert.doesNotMatch(sez.sourceName, /19\/2022/);
  assert.match(sez.sourceUrl, /19_2565\.pdf/);
  assert.match(smart.sourceName, /1\/2564/);
  assert.match(smart.note, /1\/2564-1\/2566/);
  assert.match(smart.note, /source period: 2021-2025/);
  const bangkok = baseline.places.find((place) => place.id === "th-10");
  assert.match(bangkok.smartCityProjects, /\[1\/2564\]/);
  assert.equal(gregorianProse(bangkok.smartCityProjects).includes("[1/2021]"), false);
  assert.match(gregorianProse(bangkok.smartCityProjects), /\[1\/2564\]/);
});
