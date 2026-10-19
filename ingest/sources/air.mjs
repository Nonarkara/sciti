import { fetchText, median, missingToken, round1 } from "../lib.mjs";
import { assignPoint } from "../geo.mjs";
import { selectFreshReadings } from "../../src/lib/fresh.mjs";

const URL = "https://air4thai.pcd.go.th/services/getNewAQI_JSON.php";

function num(v) {
  if (missingToken(v)) return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export async function loadAir(geo) {
  const { text, tlsRelaxed } = await fetchText(URL, { timeoutMs: 40000 });
  const json = JSON.parse(text);
  const stations = Array.isArray(json.stations) ? json.stations : [];
  const fetchedAt = new Date().toISOString();
  const byPlace = new Map();
  for (const s of stations) {
    const lon = Number(s.long);
    const lat = Number(s.lat);
    if (!Number.isFinite(lon) || !Number.isFinite(lat)) continue;
    const code = assignPoint(geo, lon, lat);
    if (!code) continue;
    const last = s.AQILast || {};
    const pm = num(last.PM25 && last.PM25.value);
    const aqi = num(last.AQI && last.AQI.aqi);
    const stamp = last.date && last.time ? `${last.date}T${last.time}:00+07:00` : null;
    if (!stamp || (pm == null && aqi == null)) continue;
    if (!byPlace.has(code)) byPlace.set(code, []);
    byPlace.get(code).push({
      stamp,
      pm,
      aqi,
      id: s.stationID,
      nameEn: s.nameEN || s.stationID,
      nameTh: s.nameTH || s.stationID,
      lon,
      lat,
    });
  }
  const observations = [];
  const plotted = [];
  for (const [code, readings] of byPlace) {
    const fresh = selectFreshReadings(readings, fetchedAt);
    if (!fresh.asOf) continue;
    const asOf = fresh.asOf;
    const period = asOf.slice(0, 13);
    const pm = fresh.readings.map((row) => row.pm).filter((value) => value != null);
    const aqi = fresh.readings.map((row) => row.aqi).filter((value) => value != null);
    for (const row of fresh.readings) {
      if (row.pm == null) continue;
      plotted.push({
        id: row.id,
        placeId: code.toLowerCase(),
        nameEn: row.nameEn,
        nameTh: row.nameTh,
        lon: row.lon,
        lat: row.lat,
        pm25: round1(row.pm),
        asOf: row.stamp,
      });
    }
    if (pm.length) {
      observations.push({
        indicatorId: "env.pm25",
        placeId: code.toLowerCase(),
        period,
        value: round1(median(pm)),
        asOf,
        sourceUrl: URL,
        fetchedAt,
        stations: pm.length,
      });
    }
    if (aqi.length) {
      observations.push({
        indicatorId: "env.aqi",
        placeId: code.toLowerCase(),
        period,
        value: Math.round(median(aqi)),
        asOf,
        sourceUrl: URL,
        fetchedAt,
        stations: aqi.length,
      });
    }
  }
  return { observations, stations: plotted, tlsRelaxed, stationRows: stations.length };
}
