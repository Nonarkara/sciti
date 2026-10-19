import { fetchText, parseCsv, parseNumber, normTh } from "../lib.mjs";

const PACKAGE = "https://gdcatalog.dlt.go.th/api/3/action/package_show?id=gdpublish-dataset-1-1-04";
const FALLBACK =
  "https://gdcatalog.dlt.go.th/dataset/e8b7d87e-5a3c-4b8b-854c-974d3b600256/resource/e5a037c6-3cc2-415e-b559-e6e85cfba2ca/download/stt_car_fuel_at_25690228.csv";

function dateFromName(name) {
  const m = String(name).match(/(\d{4})(\d{2})(\d{2})/);
  if (!m) return null;
  const be = Number(m[1]);
  const year = be > 2400 ? be - 543 : be;
  if (year < 2000 || year > 2100) return null;
  return `${year}-${m[2]}-${m[3]}`;
}

export async function loadVehicles(places) {
  let csvUrl = FALLBACK;
  let asOf = dateFromName(FALLBACK) || new Date().toISOString().slice(0, 10);
  try {
    const { text } = await fetchText(PACKAGE, { accept: "application/json", timeoutMs: 30000 });
    const pkg = JSON.parse(text);
    const resources = (pkg.result && pkg.result.resources) || [];
    const csv = resources.find((r) => /csv/i.test(r.format || "") || /\.csv($|\?)/i.test(r.url || ""));
    if (csv && csv.url) {
      csvUrl = csv.url;
      asOf = dateFromName(csv.url) || dateFromName(csv.name || "") || asOf;
    }
  } catch {
    // The known file URL remains the source we try to read.
  }
  const { text } = await fetchText(csvUrl, { timeoutMs: 40000 });
  const rows = parseCsv(text);
  if (rows.length < 2) throw new Error("DLT vehicle file was empty");
  const byName = new Map(places.map((p) => [normTh(p.th), p]));
  const totals = new Map();
  for (const r of rows.slice(1)) {
    if (r.length < 5) continue;
    if (String(r[0]).trim() !== "รถยนต์") continue;
    if (!String(r[3]).trim()) continue;
    if (r.some((c) => String(c).includes("รวม"))) continue;
    const value = parseNumber(r[4]);
    if (value == null || value < 0) continue;
    const place = byName.get(normTh(r[2]));
    if (!place) continue;
    totals.set(place.code, (totals.get(place.code) || 0) + value);
  }
  if (totals.size < 70) throw new Error(`DLT file matched only ${totals.size} provinces`);
  const fetchedAt = new Date().toISOString();
  const observations = [...totals.entries()].map(([code, value]) => ({
    indicatorId: "mobility.vehicles",
    placeId: code.toLowerCase(),
    period: asOf.slice(0, 4),
    value,
    asOf,
    sourceUrl: csvUrl,
    fetchedAt,
  }));
  return { observations, sourceUrl: csvUrl, asOf };
}
