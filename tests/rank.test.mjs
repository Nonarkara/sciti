import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { computeCagr, moneyballGap, percentile, scoreLens } from "../src/lib/rank.mjs";
import { LENSES } from "../src/lib/lenses.mjs";
import { applySource, sumComplete, toCsv } from "../ingest/lib.mjs";
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
  assert.equal(nst.score, null);
  assert.equal(nst.rank, null);
  assert.equal(bangkok.rank, 1);
  const gppPart = nst.parts.find((part) => part.id === "economy.gpp_cagr");
  assert.equal(gppPart.state, "missing-here");
  assert.equal(gppPart.value, null);
});

test("a partial row cannot outrank a province with every input", () => {
  const components = [1, 2, 3, 4, 5].map((n) => ({
    id: `c${n}`,
    kind: "raw",
    indicatorId: `c${n}`,
    direction: "higher",
    weight: 20,
    decisive: true,
  }));
  const observations = [];
  for (const n of [1, 2, 3, 4, 5]) {
    observations.push(obs({ indicatorId: `c${n}`, placeId: "th-10", period: "2024", value: 10, sourceUrl: "https://example.go.th/a" }));
    if (n < 5) observations.push(obs({ indicatorId: `c${n}`, placeId: "th-80", period: "2024", value: 100, sourceUrl: "https://example.go.th/a" }));
  }
  const result = scoreLens({ placeIds: ["th-10", "th-80"], observations, components, rankGate: "decisive" });
  const full = result.rows.find((row) => row.placeId === "th-10");
  const partial = result.rows.find((row) => row.placeId === "th-80");
  assert.equal(partial.coverage.have, 4);
  assert.equal(partial.coverage.of, 5);
  assert.ok(partial.score > full.score);
  assert.ok(partial.rank > full.rank);
  assert.equal(full.rank, 1);
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

test("n.a. is missing and is never summed as zero", () => {
  assert.equal(sumComplete(["n.a.", "n.a.", "n.a.", "n.a."]), null);
  assert.equal(sumComplete([1403642, "n.a.", 1426598, "N/A"]), null);
  assert.equal(sumComplete([1, 2, 3]), 6);
  assert.equal(sumComplete([0, 0]), 0);
  const csv = rowsFromCsv("place_id,indicator_id,period,value,unit,as_of,source_url,publisher,licence\nth-33,people.unregistered_share,2025,n.a.,percent,2025-12-31,https://catalogapi.nso.go.th/api/index?table=MIG_01_0049_3&format=json,NSO,not stated\n");
  const bad = acceptRows(csv);
  assert.equal(bad.accepted.length, 0);
  assert.match(bad.rejected[0].reason, /n\.a\./);
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
  assert.equal(result.accepted.length, 3389);
  assert.equal(result.accepted.some((row) => row.indicatorId === "economy.boi_jobs" && row.value === 0), false);
  assert.equal(result.accepted.some((row) => row.indicatorId === "people.unregistered_share" && row.placeId === "th-33"), false);
  assert.equal(result.accepted.some((row) => row.indicatorId === "people.unregistered_share" && row.value === 0), false);
  assert.equal(result.accepted.some((row) => String(row.sourceUrl).includes("dataset_12_026")), false);
  assert.ok(result.accepted.some((row) => String(row.sourceUrl).includes("dataset_12_0111")));
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

test("the emergency decree marks the deep south and is not a crime count", async () => {
  const { decreeObservations } = await import("../ingest/sources/security.mjs");
  const text = await readFile(new URL("../data/incoming/sciti_incoming.csv", import.meta.url), "utf8");
  const incoming = acceptRows(rowsFromCsv(text)).accepted;
  const placeIds = [...new Set(incoming.map((row) => row.placeId))].sort();
  const decree = decreeObservations(placeIds);
  assert.equal(decree.length, 77);
  assert.equal(decree.find((row) => row.placeId === "th-95").value, 1);
  assert.equal(decree.find((row) => row.placeId === "th-94").value, 1);
  assert.equal(decree.find((row) => row.placeId === "th-96").value, 1);
  assert.equal(decree.find((row) => row.placeId === "th-90").value, 0);
  assert.equal(decree.find((row) => row.placeId === "th-10").value, 0);
  assert.equal(decree.filter((row) => row.value === 1).length, 3);
  assert.match(decree[0].note, /extension 86/);
  assert.match(decree[0].note, /Raman/);
  assert.doesNotMatch(decree[0].note, /extension 85/);
  assert.doesNotMatch(decree[0].note, /19 October 2569/);
  assert.equal(decree[0].sourceUrl, "https://www.thaipbs.or.th/news/content/559232");
  assert.equal(decree[0].period, "2026-10-20");
  const observations = incoming.concat(decree);
  assert.equal(observations.some((row) => row.indicatorId === "governance.crime"), false);
  for (const lensId of ["quiet", "families", "remote", "tourism"]) {
    const lens = LENSES.find((item) => item.id === lensId);
    assert.equal(lens.components.some((item) => item.id === "governance.emergency_decree" && item.weight === 40), true);
    const scored = scoreLens({ placeIds, observations, components: lens.components, rankGate: lens.rankGate });
    if (lensId === "families") assert.equal(scored.notInFile.includes("governance.crime"), true);
    if (lensId === "quiet") assert.equal(scored.notInFile.includes("living.density"), true);
    assert.equal(scored.contextOnly, false);
    const yala = scored.rows.find((row) => row.placeId === "th-95");
    const pattani = scored.rows.find((row) => row.placeId === "th-94");
    const nst = scored.rows.find((row) => row.placeId === "th-80");
    const part = yala.parts.find((item) => item.id === "governance.emergency_decree");
    assert.equal(part.state, "flag-used");
    assert.equal(part.value, 1);
    assert.ok(part.oriented < 10);
    assert.ok(yala.rank > 10);
    assert.ok(pattani.rank > 10);
    assert.ok(nst.rank < yala.rank);
    assert.ok(nst.score > yala.score);
    if (lensId === "remote") assert.ok(yala.rank >= 30 && yala.rank <= 45);
  }
});

test("talent ranks on students, and a missing checkpoint scores zero only on the border lenses", () => {
  const talent = LENSES.find((lens) => lens.id === "talent");
  const combo = LENSES.find((lens) => lens.id === "talent-border");
  const border = LENSES.find((lens) => lens.id === "border");
  const industry = LENSES.find((lens) => lens.id === "industry");
  assert.equal(talent.components.some((item) => item.id === "economy.border_trade"), false);
  assert.equal(industry.components.some((item) => item.id === "economy.border_trade"), false);
  assert.equal(combo.components.find((item) => item.id === "economy.border_trade").missingAsZero, true);
  assert.equal(combo.components.find((item) => item.id === "economy.border_trade").scale, "log1p-minmax");
  assert.equal(border.components.find((item) => item.id === "economy.border_trade").missingAsZero, true);
  assert.equal(border.components.find((item) => item.id === "economy.border_trade").scale, "log1p-minmax");
  const observations = [
    obs({ indicatorId: "people.tertiary_per_1000", placeId: "th-10", period: "2025", value: 80, sourceUrl: "https://data.go.th/dataset/univ_std_11_011" }),
    obs({ indicatorId: "people.tertiary_per_1000", placeId: "th-27", period: "2025", value: 10, sourceUrl: "https://data.go.th/dataset/univ_std_11_011" }),
    obs({ indicatorId: "economy.border_trade", placeId: "th-27", period: "2024", value: 100, sourceUrl: "https://data.go.th/dataset/ctm_06_08" }),
    obs({ indicatorId: "economy.sez", placeId: "th-10", period: "2026", value: 0, sourceUrl: "https://www.boi.go.th/th/SEZ_policy" }),
    obs({ indicatorId: "economy.sez", placeId: "th-27", period: "2026", value: 1, sourceUrl: "https://www.boi.go.th/th/SEZ_policy" }),
    obs({ indicatorId: "economy.eec", placeId: "th-10", period: "2026", value: 0, sourceUrl: "https://www.eeco.or.th/th" }),
    obs({ indicatorId: "economy.eec", placeId: "th-27", period: "2026", value: 0, sourceUrl: "https://www.eeco.or.th/th" }),
    obs({ indicatorId: "economy.investment", placeId: "th-10", period: "2025", value: 10, sourceUrl: "https://www.boi.go.th/" }),
    obs({ indicatorId: "economy.investment", placeId: "th-27", period: "2025", value: 5, sourceUrl: "https://www.boi.go.th/" }),
    obs({ indicatorId: "people.population", placeId: "th-10", period: "2025", value: 100, sourceUrl: "https://stat.bora.dopa.go.th/" }),
    obs({ indicatorId: "people.population", placeId: "th-27", period: "2025", value: 100, sourceUrl: "https://stat.bora.dopa.go.th/" }),
    obs({ indicatorId: "energy.electricity", placeId: "th-10", period: "2023", value: 10, sourceUrl: "https://www.eppo.go.th/" }),
    obs({ indicatorId: "energy.electricity", placeId: "th-27", period: "2023", value: 5, sourceUrl: "https://www.eppo.go.th/" }),
    obs({ indicatorId: "people.labour_force", placeId: "th-10", period: "2025", value: 10, sourceUrl: "https://www.nso.go.th/" }),
    obs({ indicatorId: "people.labour_force", placeId: "th-27", period: "2025", value: 5, sourceUrl: "https://www.nso.go.th/" }),
    obs({ indicatorId: "economy.minimum_wage", placeId: "th-10", period: "2025", value: 400, sourceUrl: "https://www.mol.go.th/" }),
    obs({ indicatorId: "economy.minimum_wage", placeId: "th-27", period: "2025", value: 350, sourceUrl: "https://www.mol.go.th/" }),
  ];
  const talentScore = scoreLens({ placeIds: ["th-10", "th-27"], observations, components: talent.components, rankGate: talent.rankGate });
  assert.notEqual(talentScore.rows.find((row) => row.placeId === "th-10").rank, null);
  const borderScore = scoreLens({ placeIds: ["th-10", "th-27"], observations, components: border.components, rankGate: border.rankGate });
  const bangkok = borderScore.rows.find((row) => row.placeId === "th-10");
  const part = bangkok.parts.find((item) => item.id === "economy.border_trade");
  assert.equal(part.state, "used");
  assert.equal(part.value, 0);
  assert.equal(part.evidence.absentAsZero, true);
  assert.notEqual(bangkok.score, null);
  const sakaeo = borderScore.rows.find((row) => row.placeId === "th-27");
  assert.equal(sakaeo.parts.find((item) => item.id === "economy.border_trade").value, 100);
  assert.equal(sakaeo.parts.find((item) => item.id === "economy.border_trade").evidence.absentAsZero, undefined);
  const comboScore = scoreLens({ placeIds: ["th-10", "th-27"], observations, components: combo.components, rankGate: combo.rankGate });
  const comboBangkok = comboScore.rows.find((row) => row.placeId === "th-10");
  assert.equal(comboBangkok.parts.find((item) => item.id === "economy.border_trade").value, 0);
  assert.notEqual(comboBangkok.rank, null);
  const industryScore = scoreLens({ placeIds: ["th-10", "th-27"], observations, components: industry.components, rankGate: industry.rankGate });
  assert.equal(industryScore.rows.every((row) => row.parts.every((item) => item.id !== "economy.border_trade")), true);
  assert.notEqual(industryScore.rows.find((row) => row.placeId === "th-10").rank, null);
});

test("a BOI jobs cell of zero is unreported and is not stored", () => {
  const csv = rowsFromCsv(
    "place_id,indicator_id,period,value,unit,as_of,source_url,publisher,licence\nth-15,economy.boi_jobs,2025,0,jobs,2025-12-31,https://ipstat.boi.go.th/pubrpt/rep08qtrprovince.php,BOI,not stated\n",
  );
  const bad = acceptRows(csv);
  assert.equal(bad.accepted.length, 0);
  assert.match(bad.rejected[0].reason, /unreported/);
});

test("border trade uses log1p min-max so a tiny checkpoint stays small", () => {
  const border = LENSES.find((lens) => lens.id === "border");
  const zeros = Array.from({ length: 52 }, (_, i) => `z${String(i).padStart(2, "0")}`);
  const placeIds = ["big", "tiny", ...zeros];
  const observations = [
    obs({ indicatorId: "economy.border_trade", placeId: "big", period: "2024", value: 1000000, sourceUrl: "https://data.go.th/dataset/ctm_06_08" }),
    obs({ indicatorId: "economy.border_trade", placeId: "tiny", period: "2024", value: 1, sourceUrl: "https://data.go.th/dataset/ctm_06_08" }),
    ...placeIds.map((placeId) =>
      obs({ indicatorId: "economy.sez", placeId, period: "2026", value: 0, sourceUrl: "https://www.boi.go.th/th/SEZ_policy" }),
    ),
  ];
  const scored = scoreLens({ placeIds, observations, components: border.components, rankGate: border.rankGate });
  const mark = (id) => scored.rows.find((row) => row.placeId === id).parts.find((part) => part.id === "economy.border_trade").percentile;
  assert.equal(mark("z00"), 0);
  assert.equal(mark("big"), 100);
  assert.ok(mark("tiny") > 0);
  assert.ok(mark("tiny") < 15);
});

test("csv quoting keeps a comma inside the publisher", () => {
  const csv = toCsv([{ place_id: "th-10", publisher: "A, B", value: 1 }]);
  assert.match(csv, /"A, B"/);
});
