// Transparent lens scores. Missing stays missing. A lone yes/no does not order the map.
// A province is ranked only when it has at least this share of the inputs in the file.
// Below that, it is listed and not ordered. At or above it, a blank still sorts after
// every province that has the full set, so a missing input cannot lift the rank.

export const COVERAGE_MIN = 0.8;

function same(a, b) {
  return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
}

export function yearOf(period) {
  const m = /^(\d{4})/.exec(String(period || ""));
  if (!m) return null;
  const y = Number(m[1]);
  if (y < 1900 || y > 2100) return null;
  return y;
}

export function percentile(value, values) {
  const n = values.length;
  if (!n) return null;
  let less = 0;
  let equal = 0;
  for (const v of values) {
    if (same(v, value)) equal += 1;
    else if (v < value) less += 1;
  }
  return ((less + 0.5 * equal) / n) * 100;
}

// log(1 + value), stretched from the smallest to the largest. A zero stays 0 when the
// smallest is 0, and the largest is 100. A tiny positive stays near 0.
export function log1pMinMax(value, values) {
  if (!values.length) return null;
  const logs = values.map((v) => Math.log1p(Math.max(0, v)));
  const lo = Math.min(...logs);
  const hi = Math.max(...logs);
  const x = Math.log1p(Math.max(0, value));
  if (!(hi > lo)) return x <= 0 ? 0 : 50;
  return ((x - lo) / (hi - lo)) * 100;
}

export function orient(pct, direction) {
  if (pct == null) return null;
  return direction === "lower" ? 100 - pct : pct;
}

function indexObservations(observations) {
  const map = new Map();
  for (const o of observations || []) {
    const key = `${o.indicatorId}|${o.placeId}`;
    let list = map.get(key);
    if (!list) {
      list = [];
      map.set(key, list);
    }
    list.push(o);
  }
  return map;
}

export function latestOf(list) {
  if (!list || !list.length) return null;
  return list.slice().sort((a, b) => String(a.period).localeCompare(String(b.period)) || String(a.asOf || "").localeCompare(String(b.asOf || "")))[
    list.length - 1
  ];
}

export function computeCagr(list, options = {}) {
  const sinceYear = options.sinceYear;
  const byYear = new Map();
  for (const o of list || []) {
    const y = yearOf(o.period);
    if (y == null || !(o.value > 0)) continue;
    if (sinceYear != null && y < sinceYear) continue;
    if (!byYear.has(y)) byYear.set(y, o);
    else if (!same(byYear.get(y).value, o.value)) byYear.set(y, null);
  }
  const points = [...byYear.entries()].filter((entry) => entry[1]).sort((a, b) => a[0] - b[0]);
  if (points.length < 2) return null;
  const [fromYear, from] = points[0];
  const [toYear, to] = points[points.length - 1];
  const span = toYear - fromYear;
  if (span < 1) return null;
  return {
    value: (to.value / from.value) ** (1 / span) - 1,
    fromYear,
    toYear,
    span,
    from,
    to,
  };
}

export function computeRatio(numerator, denominator) {
  const num = latestOf(numerator);
  const den = latestOf(denominator);
  if (!num || !den || !(den.value > 0)) return null;
  return { value: num.value / den.value, numerator: num, denominator: den };
}

function evidenceFrom(kind, resolved) {
  if (kind === "cagr") {
    return {
      period: `${resolved.fromYear} to ${resolved.toYear}`,
      asOf: resolved.to.asOf,
      sourceUrl: resolved.to.sourceUrl,
      publisher: resolved.to.publisher || "",
      licence: resolved.to.licence || "",
      stale: !!(resolved.to.stale || resolved.from.stale),
      fromYear: resolved.fromYear,
      toYear: resolved.toYear,
      fromValue: resolved.from.value,
      toValue: resolved.to.value,
      earlierSourceUrl: resolved.from.sourceUrl,
    };
  }
  if (kind === "ratio") {
    return {
      period: `${resolved.numerator.period} / ${resolved.denominator.period}`,
      asOf: resolved.numerator.asOf,
      sourceUrl: resolved.numerator.sourceUrl,
      publisher: resolved.numerator.publisher || "",
      licence: resolved.numerator.licence || "",
      stale: !!(resolved.numerator.stale || resolved.denominator.stale),
      denominatorSourceUrl: resolved.denominator.sourceUrl,
      denominatorAsOf: resolved.denominator.asOf,
      denominatorPublisher: resolved.denominator.publisher || "",
      numeratorValue: resolved.numerator.value,
      denominatorValue: resolved.denominator.value,
    };
  }
  return {
    period: resolved.period,
    asOf: resolved.asOf,
    sourceUrl: resolved.sourceUrl,
    publisher: resolved.publisher || "",
    licence: resolved.licence || "",
    stale: !!resolved.stale,
  };
}

function resolvePlace(component, placeId, index) {
  if (component.kind === "cagr") {
    const cagr = computeCagr(index.get(`${component.indicatorId}|${placeId}`), { sinceYear: component.sinceYear });
    if (!cagr) return null;
    return { value: cagr.value, evidence: evidenceFrom("cagr", cagr) };
  }
  if (component.kind === "ratio") {
    const ratio = computeRatio(index.get(`${component.numeratorId}|${placeId}`), index.get(`${component.denominatorId}|${placeId}`));
    if (!ratio) return null;
    return { value: ratio.value, evidence: evidenceFrom("ratio", ratio) };
  }
  const latest = latestOf(index.get(`${component.indicatorId}|${placeId}`));
  if (!latest || !Number.isFinite(latest.value)) return null;
  return { value: latest.value, evidence: evidenceFrom(component.kind, latest) };
}

function round4(n) {
  return Math.round(n * 10000) / 10000;
}

export function scoreLens({ placeIds, observations, components, rankGate }) {
  const index = indexObservations(observations);
  const active = (components || []).filter((c) => c.weight > 0);
  const zeroWeight = (components || []).filter((c) => !(c.weight > 0)).map((c) => c.id);
  const byComponent = new Map();
  for (const component of active) {
    const found = new Map();
    for (const placeId of placeIds) {
      const resolved = resolvePlace(component, placeId, index);
      if (resolved && Number.isFinite(resolved.value)) found.set(placeId, resolved);
    }
    if (component.missingAsZero && found.size > 0) {
      const sample = found.values().next().value;
      for (const placeId of placeIds) {
        if (found.has(placeId)) continue;
        found.set(placeId, {
          value: 0,
          evidence: { ...sample.evidence, stale: false, absentAsZero: true },
        });
      }
    }
    byComponent.set(component.id, found);
  }
  const inFile = active.filter((c) => byComponent.get(c.id).size > 0);
  const notInFile = active.filter((c) => byComponent.get(c.id).size === 0).map((c) => c.id);
  const quantitative = inFile.filter((c) => c.kind !== "flag");
  let contextOnly = quantitative.length === 0;
  let contextReason = contextOnly ? "no-quantitative" : null;
  if (!contextOnly && rankGate === "decisive" && !quantitative.some((c) => c.decisive)) {
    contextOnly = true;
    contextReason = "no-decisive";
  }
  const scoring = contextOnly ? [] : inFile.filter((c) => c.kind !== "flag" || quantitative.length > 0);
  const percentiles = new Map();
  for (const component of scoring) {
    const values = [...byComponent.get(component.id).values()].map((r) => r.value);
    const table = new Map();
    const scale = component.scale === "log1p-minmax" ? log1pMinMax : percentile;
    for (const [placeId, resolved] of byComponent.get(component.id)) {
      table.set(placeId, scale(resolved.value, values));
    }
    percentiles.set(component.id, table);
  }
  const rows = placeIds.map((placeId) => {
    const present = scoring.filter((c) => byComponent.get(c.id).has(placeId));
    const weightSum = present.reduce((sum, c) => sum + c.weight, 0);
    const rawScore =
      !contextOnly && weightSum > 0
        ? round4(
            present.reduce((sum, c) => {
              const oriented = orient(percentiles.get(c.id).get(placeId), c.direction);
              return sum + (c.weight / weightSum) * oriented;
            }, 0),
          )
        : null;
    const have = present.length;
    const of = scoring.length;
    const enough = of > 0 && have / of + 1e-9 >= COVERAGE_MIN;
    const score = enough ? rawScore : null;
    const parts = (components || []).map((component) => {
      const found = byComponent.get(component.id);
      const resolved = found ? found.get(placeId) : null;
      const inThisFile = inFile.some((c) => c.id === component.id);
      let state = "zero-weight";
      if (component.weight > 0 && !inThisFile) state = "not-in-file";
      else if (component.weight > 0 && !resolved) state = "missing-here";
      else if (component.weight > 0 && component.kind === "flag" && contextOnly) state = "flag-held";
      else if (component.weight > 0 && resolved && scoring.some((c) => c.id === component.id) && present.some((c) => c.id === component.id)) {
        state = component.kind === "flag" ? "flag-used" : "used";
      } else if (component.weight > 0 && resolved && contextOnly) state = "held";
      const pct = state === "used" || state === "flag-used" ? percentiles.get(component.id).get(placeId) : null;
      const oriented = pct == null ? null : orient(pct, component.direction);
      const contribution = score == null || oriented == null || !weightSum ? null : round4((component.weight / weightSum) * oriented);
      return {
        id: component.id,
        weight: component.weight,
        direction: component.direction,
        kind: component.kind,
        decisive: !!component.decisive,
        state,
        value: resolved ? resolved.value : null,
        percentile: pct,
        oriented,
        contribution,
        places: found ? found.size : 0,
        evidence: resolved ? resolved.evidence : null,
      };
    });
    return {
      placeId,
      score,
      rank: null,
      coverage: { have, of },
      partial: of > 0 ? have < of : notInFile.length > 0,
      missingInFile: scoring.filter((c) => !byComponent.get(c.id).has(placeId)).map((c) => c.id),
      notInFile,
      parts,
    };
  });
  const ranked = rows.filter((row) => row.score != null).sort((a, b) => {
    const aFull = a.coverage.have === a.coverage.of ? 1 : 0;
    const bFull = b.coverage.have === b.coverage.of ? 1 : 0;
    if (aFull !== bFull) return bFull - aFull;
    return b.score - a.score || a.placeId.localeCompare(b.placeId);
  });
  let seen = 0;
  let previous = null;
  let rank = 0;
  for (const row of ranked) {
    seen += 1;
    if (previous == null || !same(row.score, previous)) rank = seen;
    row.rank = rank;
    previous = row.score;
  }
  return {
    contextOnly,
    contextReason,
    inFile: inFile.map((c) => ({ id: c.id, places: byComponent.get(c.id).size, kind: c.kind, decisive: !!c.decisive })),
    notInFile,
    zeroWeight,
    rows,
  };
}

export function latestValue(observations, indicatorId, placeId) {
  return latestOf((observations || []).filter((o) => o.indicatorId === indicatorId && o.placeId === placeId));
}

/** Fundamentals percentile minus the price or reputation percentile. Null when either side is absent. */
export function moneyballGap(score, observations, placeId, indicatorId) {
  if (score == null) return null;
  const latest = new Map();
  for (const o of observations || []) {
    if (o.indicatorId !== indicatorId) continue;
    const prev = latest.get(o.placeId);
    if (!prev || String(o.period) > String(prev.period)) latest.set(o.placeId, o);
  }
  const mine = latest.get(placeId);
  if (!mine || !Number.isFinite(mine.value)) return null;
  const values = [...latest.values()].map((o) => o.value);
  const pct = percentile(mine.value, values);
  return {
    gap: round4(score - pct),
    percentile: pct,
    places: values.length,
    observation: mine,
  };
}
