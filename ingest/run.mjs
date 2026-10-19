import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { applySource, toCsv } from "./lib.mjs";
import { loadIncomingDir, mergeByKey } from "./incoming.mjs";
import { regionOf } from "./regions.mjs";
import { loadBoundaries, projectCollection, projectPoint } from "./geo.mjs";
import { INDICATORS, AREAS } from "./indicators.mjs";
import { applyLabels } from "./labels.mjs";
import { loadCityFile } from "./cities.mjs";
import { loadPopulation } from "./sources/population.mjs";
import { loadAir } from "./sources/air.mjs";
import { loadVehicles } from "./sources/vehicles.mjs";
import { loadGpp } from "./sources/gpp.mjs";
import { loadCatalog } from "./sources/catalog.mjs";
import { checkGaps } from "./sources/gaps.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lastGoodPath = path.join(root, "data/last-good/baseline.json");

function mergeAirHistory(previous, fresh) {
  const prev = (previous || []).filter((o) => o.indicatorId === "env.pm25" || o.indicatorId === "env.aqi");
  const map = new Map();
  for (const o of prev) map.set(`${o.indicatorId}|${o.placeId}|${o.period}`, o);
  for (const o of fresh) map.set(`${o.indicatorId}|${o.placeId}|${o.period}`, { ...o, stale: false });
  const periods = [...new Set([...map.values()].map((o) => o.period))].sort();
  const allow = new Set(periods.slice(-48));
  return [...map.values()].filter((o) => allow.has(o.period));
}

async function readLastGood() {
  try {
    return JSON.parse(await readFile(lastGoodPath, "utf8"));
  } catch {
    return { observations: [], places: [], stations: [] };
  }
}

async function main() {
  const previous = await readLastGood();
  let observations = previous.observations || [];
  const runs = [];

  const pop = await trySource("people.population", ["people.population"], () => loadPopulation());
  runs.push(pop.state);
  if (pop.result) {
    const applied = applySource(observations, {
      indicatorIds: ["people.population"],
      ok: true,
      observations: pop.result.observations,
    });
    observations = applied.observations;
    runs[runs.length - 1] = { ...pop.state, ...applied.state, id: "people.population" };
  } else {
    const applied = applySource(observations, {
      indicatorIds: ["people.population"],
      ok: false,
      error: pop.error,
      observations: [],
    });
    observations = applied.observations;
    runs[runs.length - 1] = { ...applied.state, id: "people.population" };
  }

  const places = buildPlaces(pop.result ? pop.result.places : [], previous.places || []);

  const geo = await loadBoundaries(root);
  const drawn = projectCollection(geo);

  const air = await trySource("env.pm25", ["env.pm25", "env.aqi"], () => loadAir(geo));
  if (air.result) {
    const history = mergeAirHistory(observations, air.result.observations);
    observations = observations
      .filter((o) => o.indicatorId !== "env.pm25" && o.indicatorId !== "env.aqi")
      .concat(history);
    runs.push({
      id: "air4thai",
      ok: true,
      count: history.length,
      tlsRelaxed: !!air.result.tlsRelaxed,
      stations: air.result.stationRows,
    });
  } else {
    const applied = applySource(observations, {
      indicatorIds: ["env.pm25", "env.aqi"],
      ok: false,
      error: air.error,
      observations: [],
    });
    observations = applied.observations;
    runs.push({ id: "air4thai", ...applied.state });
  }

  const vehicles = await trySource("mobility.vehicles", ["mobility.vehicles"], () => loadVehicles(places));
  observations = commit(observations, ["mobility.vehicles"], vehicles, runs);

  const gpp = await trySource("economy.gpp", ["economy.gpp"], () => loadGpp(places));
  observations = commit(observations, ["economy.gpp"], gpp, runs);

  const catalog = await trySource("governance.datasets", ["governance.datasets"], () => loadCatalog(places));
  observations = commit(observations, ["governance.datasets"], catalog, runs);

  const gaps = await checkGaps().catch((err) => [{ id: "gaps", error: String(err.message || err) }]);

  const incoming = await loadIncomingDir(path.join(root, "data/incoming"));
  const indicatorList = INDICATORS.map((indicator) => ({ ...indicator, licence: indicator.licence || "not stated" }));
  for (const extra of incoming.indicators) {
    if (!indicatorList.some((indicator) => indicator.id === extra.id)) indicatorList.push(extra);
  }
  observations = mergeByKey(observations, incoming.accepted);
  // The cited national series is the one to show. A later year from a two-province catalog
  // would otherwise become the latest figure for that province.
  if (incoming.accepted.some((row) => row.indicatorId === "economy.gpp")) {
    const keep = new Set(
      incoming.accepted.filter((row) => row.indicatorId === "economy.gpp").map((row) => `${row.placeId}|${row.period}`),
    );
    observations = observations.filter((row) => row.indicatorId !== "economy.gpp" || keep.has(`${row.placeId}|${row.period}`));
  }
  applyLabels(indicatorList);
  const cityFile = await loadCityFile(path.join(root, "data/research/cities.csv"));
  observations = observations.map((observation) => {
    const indicator = indicatorList.find((item) => item.id === observation.indicatorId);
    return {
      ...observation,
      publisher: observation.publisher || (indicator ? indicator.sourceName.en : ""),
      licence: observation.licence || (indicator ? indicator.licence : "not stated"),
      unit: observation.unit || (indicator ? indicator.unit.en : ""),
    };
  });

  const stations = air.result
    ? air.result.stations.map((s) => {
        const [x, y] = projectPoint(s.lon, s.lat, drawn.projection);
        return { ...s, x, y };
      })
    : previous.stations || [];

  const generatedAt = new Date().toISOString();
  const doc = {
    version: "2.0.0",
    generatedAt,
    places: places.map((p) => decoratePlace(p, cityFile.byId.get(p.code.toLowerCase()))),
    localities: cityFile.localities,
    areas: AREAS,
    indicators: indicatorList,
    observations,
    stations,
    runs,
    gaps,
    incoming: { files: incoming.files, accepted: incoming.accepted.length, rejected: incoming.rejected },
  };

  const csvRows = observations.map((o) => {
    const place = doc.places.find((p) => p.id === o.placeId);
    const indicator = indicatorList.find((i) => i.id === o.indicatorId);
    return {
      place_id: o.placeId,
      indicator_id: o.indicatorId,
      period: o.period,
      value: o.value,
      unit: o.unit || (indicator ? indicator.unit.en : ""),
      as_of: o.asOf,
      source_url: o.sourceUrl,
      publisher: o.publisher || "",
      licence: o.licence || "",
      source_name: o.sourceName || (indicator ? indicator.sourceName.en : ""),
      note: o.note || "",
      area: indicator ? indicator.area : "",
      direction: indicator ? indicator.direction || "" : "",
      name_en: indicator ? indicator.name.en : "",
      name_th: indicator ? indicator.name.th : "",
      name_zh: indicator ? indicator.name.zh : "",
      place_en: place ? place.en : "",
      place_th: place ? place.th : "",
      place_zh: place ? place.zh : "",
      stale: o.stale ? "yes" : "no",
      fetched_at: o.fetchedAt || "",
    };
  });

  await mkdir(path.dirname(lastGoodPath), { recursive: true });
  await mkdir(path.join(root, "public/data"), { recursive: true });
  await mkdir(path.join(root, "public/geo"), { recursive: true });
  const json = JSON.stringify(doc);
  await writeFile(lastGoodPath, JSON.stringify(doc, null, 2));
  await writeFile(path.join(root, "public/data/baseline.json"), json);
  const csv = toCsv(csvRows);
  await writeFile(path.join(root, "public/data/baseline.csv"), csv);
  const { projection, ...publicGeo } = drawn;
  void projection;
  const geoJson = JSON.stringify(publicGeo);
  await writeFile(path.join(root, "public/geo/provinces.json"), geoJson);

  const byIndicator = {};
  for (const ind of indicatorList) {
    const rows = observations.filter((o) => o.indicatorId === ind.id);
    const placesWith = new Set(rows.map((r) => r.placeId));
    byIndicator[ind.id] = { observations: rows.length, places: placesWith.size, status: ind.status };
  }
  console.log(JSON.stringify({ generatedAt, places: doc.places.length, byIndicator, runs, gaps }, null, 2));
}

function decoratePlace(p, city) {
  const base = {
    id: p.code.toLowerCase(),
    code: p.code,
    en: p.en,
    th: p.th || p.en,
    zh: p.zh || "",
    region: regionOf(p.code),
  };
  if (!city) return base;
  return {
    ...base,
    en: city.en || base.en,
    th: city.th || base.th,
    zh: city.zh || base.zh,
    lat: city.lat,
    lon: city.lon,
    smartCityStatus: city.smartCityStatus,
    smartCityProjects: city.smartCityProjects,
    smartCitySource: city.smartCitySource,
    borderSez: city.borderSez,
    eec: city.eec,
    zoneSource: city.zoneSource,
    nameSource: city.nameSource,
    notes: city.notes,
  };
}

function buildPlaces(fromWiki, previous) {
  const map = new Map();
  for (const p of previous) {
    if (!p.code && p.id) map.set(p.id.toUpperCase(), { code: p.id.toUpperCase(), en: p.en, th: p.th, zh: p.zh || "" });
    else if (p.code) map.set(p.code, { code: p.code, en: p.en, th: p.th, zh: p.zh || "" });
  }
  for (const p of fromWiki) {
    const prev = map.get(p.code);
    map.set(p.code, {
      code: p.code,
      en: p.en || (prev && prev.en) || p.code,
      th: p.th || (prev && prev.th) || "",
      zh: p.zh || (prev && prev.zh) || "",
    });
  }
  return [...map.values()].filter((p) => /^TH-\d{2}$/.test(p.code)).sort((a, b) => a.code.localeCompare(b.code));
}

async function trySource(id, indicatorIds, fn) {
  try {
    const result = await fn();
    return { result, state: { id, ok: true, indicatorIds }, error: null };
  } catch (err) {
    return { result: null, state: { id, ok: false, error: String(err.message || err).slice(0, 300) }, error: String(err.message || err).slice(0, 300) };
  }
}

function commit(observations, indicatorIds, attempt, runs) {
  const applied = applySource(observations, {
    indicatorIds,
    ok: !!attempt.result,
    error: attempt.error,
    observations: attempt.result ? attempt.result.observations : [],
  });
  runs.push({ id: indicatorIds[0], ...applied.state, extra: attempt.result ? { ...attempt.result, observations: undefined, stations: undefined } : null });
  return applied.observations;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
