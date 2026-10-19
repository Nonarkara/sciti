import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { INDICATORS } from "../ingest/indicators.mjs";
import { isFreshReading, observationIsCurrent, selectFreshReadings, selectStationCluster, stationStamp } from "../src/lib/fresh.mjs";

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

test("a province keeps the cluster around its newest stamp, including an old snapshot", () => {
  assert.equal(stationStamp("2026-10-19", "19:00"), "2026-10-19T19:00:00+07:00");
  assert.equal(stationStamp("2026-10-19", "19:00:00"), "2026-10-19T19:00:00+07:00");
  assert.equal(stationStamp("2026-10-19", "19:00:00:00"), null);
  const newest = "2026-09-30T23:00:00+07:00";
  const close = "2026-09-30T21:00:00+07:00";
  const older = "2026-09-30T18:00:00+07:00";
  const picked = selectStationCluster([
    { stamp: older, pm: 80 },
    { stamp: newest, pm: 15 },
    { stamp: close, pm: 12 },
  ]);
  assert.equal(picked.asOf, newest);
  assert.deepEqual(
    picked.readings.map((row) => row.pm).sort((a, b) => a - b),
    [12, 15],
  );
  const onlyOld = selectStationCluster([{ stamp: newest, pm: 15.3 }]);
  assert.equal(onlyOld.asOf, newest);
  assert.equal(onlyOld.readings.length, 1);
});

test("air is a weekly snapshot, and Bangkok plus the five quiet provinces have readings", () => {
  const pm = INDICATORS.find((item) => item.id === "env.pm25");
  const aqi = INDICATORS.find((item) => item.id === "env.aqi");
  assert.equal(/this hour/i.test(pm.name.en), false);
  assert.equal(/ชั่วโมงนี้/.test(pm.name.th), false);
  assert.equal(/本小时/.test(pm.name.zh), false);
  assert.match(pm.method.en, /snapshot/);
  assert.match(pm.method.en, /weekly/);
  assert.equal(/no current reading/i.test(pm.method.en), false);
  assert.equal(/this hour/i.test(pm.method.en), false);
  assert.match(aqi.method.en, /snapshot/);
  assert.match(aqi.method.en, /weekly/);
  const baseline = JSON.parse(readFileSync(new URL("../public/data/baseline.json", import.meta.url), "utf8"));
  const name = baseline.indicators.find((item) => item.id === "env.pm25").name.en;
  const method = baseline.indicators.find((item) => item.id === "env.pm25").method.en;
  assert.equal(/this hour/i.test(name), false);
  assert.match(method, /snapshot/);
  assert.match(method, /weekly/);
  const places = ["th-10", "th-11", "th-19", "th-20", "th-21", "th-55"];
  for (const indicatorId of ["env.pm25", "env.aqi"]) {
    for (const placeId of places) {
      const rows = baseline.observations
        .filter((row) => row.indicatorId === indicatorId && row.placeId === placeId)
        .sort((a, b) => String(a.period).localeCompare(String(b.period)));
      const latest = rows[rows.length - 1];
      assert.ok(latest, `${indicatorId} ${placeId}`);
      assert.equal(typeof latest.value, "number", `${indicatorId} ${placeId}`);
      assert.ok(latest.value >= 0, `${indicatorId} ${placeId}`);
      assert.match(latest.asOf, /^2026-10-19T/, `${indicatorId} ${placeId} ${latest.asOf}`);
      assert.equal(latest.stale, false, `${indicatorId} ${placeId}`);
    }
  }
  const patong = baseline.localities.find((item) => item.id === "hkt-patong");
  assert.equal(patong.zh, "芭东镇");
  const yala = baseline.observations.find((row) => row.indicatorId === "governance.emergency_decree" && row.placeId === "th-95");
  assert.match(yala.note, /extension 86/);
  assert.match(yala.note, /Raman/);
  assert.equal(yala.value, 1);
  assert.equal(yala.sourceUrl, "https://www.thaipbs.or.th/news/content/559232");
  assert.equal(baseline.observations.some((row) => row.indicatorId === "economy.boi_jobs" && row.value === 0), false);
  assert.equal(baseline.localities.filter((item) => !item.zh).length, 0);
  assert.equal(baseline.localities.find((item) => item.id === "skh-sadao").zh, "沙道镇");
});
