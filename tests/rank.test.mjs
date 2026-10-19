import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { computeCagr, moneyballGap, percentile, scoreLens } from "../src/lib/rank.mjs";
import { LENSES } from "../src/lib/lenses.mjs";
import { applySource, toCsv } from "../ingest/lib.mjs";
import { acceptRows, mergeByKey, rowsFromCsv, rowsFromJson } from "../ingest/incoming.mjs";

function obs(partial) {
  return {
    indicatorId: "people.population",
    placeId: "th-10",
    period: "2020",
    value: 1,
    asOf: "2020-12-31",
    sourceUrl: "https://stat.bora.dopa.go.th/example",
    publisher: "Department of Provincial Administration",
    licence: "not stated",
    ...partial,
  };
}

test("percentile puts ties in the middle and does not treat a missing city as zero", () => {
  assert.equal(percentile(2, [1, 2, 3]), 50);
  assert.equal(percentile(1, [1, 2, 3]).toFixed(3), "16.667");
  assert.equal(percentile(5, [5, 5]), 50);
});

test("compound growth needs two years and a one-year span", () => {
  const rate = computeCagr([
    obs({ period: "2014", value: 100 }),
    obs({ period: "2016", value: 121 }),
  ]);
  assert.ok(Math.abs(rate.value - 0.1) < 1e-9);
  assert.equal(computeCagr([obs({ period: "2014", value: 100 })]), null);
  assert.equal(
    computeCagr([
      obs({ period: "2014", value: 100 }),
      obs({ period: "2014", value: 110 }),
    ]),
    null,
  );
});

test("missing figures are left out of the weight, never scored as zero", () => {
  const components = [
    { id: "people.population_cagr", kind: "cagr", indicatorId: "people.population", direction: "higher", weight: 50, decisive: true },
    { id: "economy.gpp_cagr", kind: "cagr", indicatorId: "economy.gpp", direction: "higher", weight: 50, decisive: true },
  ];
  const observations = [
    obs({ placeId: "th-10", period: "2014", value: 100 }),
    obs({ placeId: "th-10", period: "2016", value: 110 }),
    obs({ placeId: "th-80", period: "2014", value: 100 }),
    obs({ placeId: "th-80", period: "2016", value: 121 }),
    obs({ indicatorId: "economy.gpp", placeId: "th-10", period: "2018", value: 200, sourceUrl: "https://example.go.th/gpp.csv" }),
    obs({ indicatorId: "economy.gpp", placeId: "th-10", period: "2020", value: 242, sourceUrl: "https://example.go.th/gpp.csv" }),
  ];
  const result = scoreLens({
    placeIds: ["th-10", "th-80"],
    observations,
    components,
    rankGate: "decisive",
  });
  assert.equal(result.contextOnly, false);
  const bangkok = result.rows.find((row) => row.placeId === "th-10");
  const nst = result.rows.find((row) => row.placeId === "th-80");
  assert.equal(bangkok.coverage.have, 2);
  assert.equal(nst.coverage.have, 1);
  assert.equal(nst.coverage.of, 2);
  assert.ok(nst.missingInFile.includes("economy.gpp_cagr"));
  assert.notEqual(nst.score, 0);
  assert.ok(nst.score > bangkok.score);
  const gppPart = nst.parts.find((part) => part.id === "economy.gpp_cagr");
  assert.equal(gppPart.state, "missing-here");
  assert.equal(gppPart.value, null);
});

test("a figure nobody has is not in the denominator", () => {
  const components = [
    { id: "env.pm25", kind: "raw", indicatorId: "env.pm25", direction: "lower", weight: 50, decisive: true },
    { id: "living.beds", kind: "raw", indicatorId: "living.beds", direction: "higher", weight: 50, decisive: false },
  ];
  const observations = [
    obs({ indicatorId: "env.pm25", placeId: "th-10", period: "2026-10-19T15", value: 40, sourceUrl: "https://air4thai.pcd.go.th/services/getNewAQI_JSON.php" }),
    obs({ indicatorId: "env.pm25", placeId: "th-80", period: "2026-10-19T15", value: 10, sourceUrl: "https://air4thai.pcd.go.th/services/getNewAQI_JSON.php" }),
  ];
  const result = scoreLens({ placeIds: ["th-10", "th-80"], observations, components, rankGate: "decisive" });
  assert.deepEqual(result.notInFile, ["living.beds"]);
  assert.equal(result.inFile.length, 1);
  const quiet = result.rows.find((row) => row.placeId === "th-80");
  const loud = result.rows.find((row) => row.placeId === "th-10");
  assert.equal(quiet.coverage.of, 1);
  assert.ok(quiet.score > loud.score);
  assert.equal(quiet.parts.find((part) => part.id === "living.beds").state, "not-in-file");
});

test("a yes or no on its own does not publish a rank", () => {
  const components = [
    { id: "economy.sez", kind: "flag", indicatorId: "economy.sez", direction: "higher", weight: 100, decisive: true },
    { id: "people.tertiary", kind: "raw", indicatorId: "people.tertiary", direction: "higher", weight: 40, decisive: true },
  ];
  const observations = [
    obs({ indicatorId: "economy.sez", placeId: "th-20", period: "2024", value: 1, sourceUrl: "https://example.go.th/sez" }),
    obs({ indicatorId: "economy.sez", placeId: "th-10", period: "2024", value: 0, sourceUrl: "https://example.go.th/sez" }),
  ];
  const result = scoreLens({ placeIds: ["th-10", "th-20"], observations, components, rankGate: "decisive" });
  assert.equal(result.contextOnly, true);
  assert.equal(result.contextReason, "no-quantitative");
  assert.ok(result.rows.every((row) => row.score == null && row.rank == null));
});

test("decisive gate withholds a ranking that would only be a proxy", () => {
  const components = [
    { id: "market.price", kind: "raw", indicatorId: "market.price", direction: "lower", weight: 50, decisive: true },
    { id: "env.pm25", kind: "raw", indicatorId: "env.pm25", direction: "lower", weight: 50, decisive: false },
  ];
  const observations = [
    obs({ indicatorId: "env.pm25", placeId: "th-10", value: 30, period: "2026-10-19T15", sourceUrl: "https://air4thai.pcd.go.th/a" }),
    obs({ indicatorId: "env.pm25", placeId: "th-83", value: 8, period: "2026-10-19T15", sourceUrl: "https://air4thai.pcd.go.th/a" }),
  ];
  const result = scoreLens({ placeIds: ["th-10", "th-83"], observations, components, rankGate: "decisive" });
  assert.equal(result.contextReason, "no-decisive");
  assert.ok(result.rows.every((row) => row.rank == null));
});

test("a zero weight stays off the score", () => {
  const components = [
    { id: "people.population_cagr", kind: "cagr", indicatorId: "people.population", direction: "higher", weight: 50, decisive: true },
    { id: "economy.investment", kind: "raw", indicatorId: "economy.investment", direction: "higher", weight: 0, decisive: false },
  ];
  const observations = [
    obs({ placeId: "th-10", period: "2018", value: 100 }),
    obs({ placeId: "th-10", period: "2020", value: 110 }),
  ];
  const result = scoreLens({ placeIds: ["th-10"], observations, components, rankGate: "decisive" });
  assert.deepEqual(result.zeroWeight, ["economy.investment"]);
  assert.equal(result.rows[0].score, 50);
});

test("the value gap is computed only when price or reputation exists", () => {
  const observations = [
    obs({ indicatorId: "market.price", placeId: "th-10", value: 100, period: "2024", sourceUrl: "https://example.go.th/price" }),
    obs({ indicatorId: "market.price", placeId: "th-80", value: 40, period: "2024", sourceUrl: "https://example.go.th/price" }),
  ];
  const gap = moneyballGap(80, observations, "th-80", "market.price");
  assert.ok(gap.gap > 0);
  assert.equal(moneyballGap(80, [], "th-80", "market.reputation"), null);
  assert.equal(moneyballGap(null, observations, "th-80", "market.price"), null);
});

test("a failed refresh keeps the last good rows and does not invent zero", () => {
  const previous = [obs({ value: 42 })];
  const failed = applySource(previous, { indicatorIds: ["people.population"], ok: false, error: "timeout", observations: [] });
  assert.equal(failed.state.usedLastGood, true);
  assert.equal(failed.observations.length, 1);
  assert.equal(failed.observations[0].value, 42);
  assert.equal(failed.observations[0].stale, true);
  const rejected = applySource(previous, {
    indicatorIds: ["people.population"],
    ok: true,
    observations: [obs({ value: 0, sourceUrl: "" })],
  });
  assert.equal(rejected.state.ok, false);
  assert.equal(rejected.observations[0].value, 42);
  assert.equal(rejected.observations[0].stale, true);
});

test("a real zero is allowed when the source is intact", () => {
  const applied = applySource([], {
    indicatorIds: ["governance.datasets"],
    ok: true,
    observations: [obs({ indicatorId: "governance.datasets", value: 0 })],
  });
  assert.equal(applied.state.ok, true);
  assert.equal(applied.observations[0].value, 0);
});

test("incoming rows without a source url are rejected and not stored as zero", () => {
  const csv = rowsFromCsv("place_id,indicator_id,period,value,unit,as_of,source_url,publisher,licence\nth-10,people.tertiary,2024,1000,people,2024-12-31,,A university,not stated\n");
  const bad = acceptRows(csv);
  assert.equal(bad.accepted.length, 0);
  assert.match(bad.rejected[0].reason, /source_url/);
  const json = rowsFromJson(JSON.stringify({
    observations: [
      {
        place_id: "th-83",
        indicator_id: "people.tertiary",
        period: "2024",
        value: "1,200",
        unit: "people",
        as_of: "2024-06-01",
        source_url: "https://example.ac.th/students.csv",
        publisher: "Example university",
        licence: "CC-BY-4.0",
        name_en: "Tertiary students",
      },
    ],
  }));
  const good = acceptRows(json);
  assert.equal(good.accepted.length, 1);
  assert.equal(good.accepted[0].value, 1200);
  assert.equal(good.accepted[0].placeId, "th-83");
  const merged = mergeByKey([obs({ indicatorId: "people.tertiary", placeId: "th-83", period: "2023", value: 900 })], good.accepted);
  assert.equal(merged.length, 2);
});

test("population growth can ignore years before a cutoff", () => {
  const rate = computeCagr(
    [
      obs({ period: "2014", value: 100 }),
      obs({ period: "2022", value: 100 }),
      obs({ period: "2024", value: 121 }),
    ],
    { sinceYear: 2022 },
  );
  assert.ok(Math.abs(rate.value - 0.1) < 1e-9);
  assert.equal(rate.fromYear, 2022);
});

test("the cited incoming file is accepted in full", async () => {
  const text = await readFile(new URL("../data/incoming/sciti_incoming.csv", import.meta.url), "utf8");
  const result = acceptRows(rowsFromCsv(text));
  assert.equal(result.rejected.length, 0);
  assert.equal(result.accepted.length, 3400);
  const growth = LENSES.find((lens) => lens.id === "growth");
  const scored = scoreLens({
    placeIds: ["th-10", "th-83"],
    observations: result.accepted,
    components: growth.components,
    rankGate: growth.rankGate,
  });
  assert.equal(scored.contextOnly, false);
  assert.ok(scored.rows.every((row) => row.rank != null));
  const quiet = LENSES.find((lens) => lens.id === "quiet");
  const quietScore = scoreLens({
    placeIds: [...new Set(result.accepted.map((row) => row.placeId))],
    observations: result.accepted,
    components: quiet.components,
    rankGate: quiet.rankGate,
  });
  assert.equal(quietScore.notInFile.includes("living.density"), true);
  assert.ok(quietScore.rows.some((row) => row.rank != null));
  const blankBorder = quietScore.rows.find((row) => row.placeId === "th-10");
  assert.ok(blankBorder);
});

test("a province with no border checkpoint is not scored as zero trade", () => {
  const talent = LENSES.find((lens) => lens.id === "talent");
  const observations = [
    obs({ indicatorId: "people.tertiary_per_1000", placeId: "th-10", period: "2025", value: 80, sourceUrl: "https://data.go.th/dataset/univ_std_11_011" }),
    obs({ indicatorId: "people.tertiary_per_1000", placeId: "th-27", period: "2025", value: 10, sourceUrl: "https://data.go.th/dataset/univ_std_11_011" }),
    obs({ indicatorId: "economy.border_trade", placeId: "th-27", period: "2024", value: 100, sourceUrl: "https://data.go.th/dataset/ctm_06_08" }),
    obs({ indicatorId: "economy.sez", placeId: "th-10", period: "2026", value: 0, sourceUrl: "https://www.boi.go.th/th/SEZ_policy" }),
    obs({ indicatorId: "economy.sez", placeId: "th-27", period: "2026", value: 1, sourceUrl: "https://www.boi.go.th/th/SEZ_policy" }),
    obs({ indicatorId: "economy.eec", placeId: "th-10", period: "2026", value: 0, sourceUrl: "https://www.eeco.or.th/th" }),
    obs({ indicatorId: "economy.eec", placeId: "th-27", period: "2026", value: 0, sourceUrl: "https://www.eeco.or.th/th" }),
  ];
  const result = scoreLens({ placeIds: ["th-10", "th-27"], observations, components: talent.components, rankGate: talent.rankGate });
  const bangkok = result.rows.find((row) => row.placeId === "th-10");
  assert.equal(bangkok.parts.find((part) => part.id === "economy.border_trade").state, "missing-here");
  assert.equal(bangkok.parts.find((part) => part.id === "economy.border_trade").value, null);
  assert.notEqual(bangkok.score, null);
});

test("csv quoting keeps a comma inside the publisher", () => {
  const csv = toCsv([{ place_id: "th-10", publisher: "A, B", value: 1 }]);
  assert.match(csv, /"A, B"/);
});
