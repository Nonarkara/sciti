import { fetchText, median, round1 } from "../lib.mjs";
import { assignPoint } from "../geo.mjs";

const URL = "https://air4thai.pcd.go.th/services/getNewAQI_JSON.php";

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export async function loadAir(geo) {
  const { text, tlsRelaxed } = await fetchText(URL, { timeoutMs: 40000 });
  const json = JSON.parse(text);
  const stations = Array.isArray(json.stations) ? json.stations : [];
  const byPlace = new Map();
  const plotted = [];
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
    if (!byPlace.has(code)) byPlace.set(code, { pm: [], aqi: [], stamps: [] });
    const bag = byPlace.get(code);
    if (pm != null) bag.pm.push(pm);
    if (aqi != null) bag.aqi.push(aqi);
    if (stamp) bag.stamps.push(stamp);
    if (pm != null) {
      plotted.push({
        id: s.stationID,
        placeId: code.toLowerCase(),
        nameEn: s.nameEN || s.stationID,
        nameTh: s.nameTH || s.stationID,
        lon,
        lat,
        pm25: round1(pm),
        asOf: stamp,
      });
    }
  }
  const fetchedAt = new Date().toISOString();
  const observations = [];
  for (const [code, bag] of byPlace) {
    const asOf = bag.stamps.slice().sort()[0] || fetchedAt.slice(0, 10);
    const period = asOf.slice(0, 13);
    if (bag.pm.length) {
      observations.push({
        indicatorId: "env.pm25",
        placeId: code.toLowerCase(),
        period,
        value: round1(median(bag.pm)),
        asOf,
        sourceUrl: URL,
        fetchedAt,
        stations: bag.pm.length,
      });
    }
    if (bag.aqi.length) {
      observations.push({
        indicatorId: "env.aqi",
        placeId: code.toLowerCase(),
        period,
        value: Math.round(median(bag.aqi)),
        asOf,
        sourceUrl: URL,
        fetchedAt,
        stations: bag.aqi.length,
      });
    }
  }
  return { observations, stations: plotted, tlsRelaxed, stationRows: stations.length };
}
