import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { INDICATORS } from "../ingest/indicators.mjs";
import { isFreshReading, observationIsCurrent, selectFreshReadings } from "../src/lib/fresh.mjs";

test("an old air station does not set the province hour", () => {
  const now = "2026-10-19T09:00:00.000Z";
  const fresh = "2026-10-19T15:00:00+07:00";
  const old = "2026-09-30T23:00:00+07:00";
  assert.equal(isFreshReading(fresh, now), true);
  assert.equal(isFreshReading(old, now), false);
  const picked = selectFreshReadings(
    [
      { stamp: old, pm: 10 },
      { stamp: fresh, pm: 40 },
    ],
    now,
  );
  assert.equal(picked.asOf, fresh);
  assert.equal(picked.readings.length, 1);
  assert.equal(picked.readings[0].pm, 40);
  const none = selectFreshReadings([{ stamp: old, pm: 80 }], now);
  assert.equal(none.asOf, null);
  assert.equal(none.readings.length, 0);
  assert.equal(observationIsCurrent({ asOf: old, fetchedAt: now, stale: false }), false);
  assert.equal(observationIsCurrent({ asOf: fresh, fetchedAt: now }), true);
  assert.equal(observationIsCurrent({ asOf: fresh, fetchedAt: now, stale: true }), false);
});

test("the hourly air name does not say this hour, and a stale pull is marked", () => {
  const pm = INDICATORS.find((item) => item.id === "env.pm25");
  const aqi = INDICATORS.find((item) => item.id === "env.aqi");
  assert.equal(/this hour/i.test(pm.name.en), false);
  assert.equal(/ชั่วโมงนี้/.test(pm.name.th), false);
  assert.equal(/本小时/.test(pm.name.zh), false);
  assert.match(pm.method.en, /latest/);
  assert.match(pm.method.en, /three hours/);
  assert.equal(/this hour/i.test(aqi.name.en), false);
  const baseline = JSON.parse(readFileSync(new URL("../public/data/baseline.json", import.meta.url), "utf8"));
  const name = baseline.indicators.find((item) => item.id === "env.pm25").name.en;
  assert.equal(/this hour/i.test(name), false);
  const bangkok = baseline.observations
    .filter((row) => row.indicatorId === "env.pm25" && row.placeId === "th-10")
    .sort((a, b) => String(a.period).localeCompare(String(b.period)));
  const latest = bangkok[bangkok.length - 1];
  assert.equal(observationIsCurrent(latest), false);
  assert.equal(latest.stale, true);
  const patong = baseline.localities.find((item) => item.id === "hkt-patong");
  assert.equal(patong.zh, "芭东镇");
  const yala = baseline.observations.find((row) => row.indicatorId === "governance.emergency_decree" && row.placeId === "th-95");
  assert.match(yala.note, /extension 86/);
  assert.match(yala.note, /Raman/);
  assert.equal(yala.value, 1);
  assert.equal(yala.sourceUrl, "https://www.thaigov.go.th/th/news/169828");
});
