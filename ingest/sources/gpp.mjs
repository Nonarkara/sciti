import { fetchText, parseCsv, parseNumber, normTh, colIndex, beToCe } from "../lib.mjs";

const SEARCH = "https://gdcatalog.go.th/api/3/action/package_search";
const MAX_DATASETS = 40;
const MAX_BYTES = 2_000_000;

function skipTitle(title) {
  const t = title || "";
  return /เกษตร|ต่อหัว|ต่อประชากร|per capita|รายสาขา/i.test(t);
}

export async function loadGpp(places) {
  const byName = new Map(places.map((p) => [normTh(p.th), p]));
  const found = [];
  for (let start = 0; start < 80 && found.length < MAX_DATASETS; start += 20) {
    const url = `${SEARCH}?q=${encodeURIComponent("ผลิตภัณฑ์มวลรวมจังหวัด")}&rows=20&start=${start}`;
    const { text } = await fetchText(url, { accept: "application/json", timeoutMs: 30000 });
    const json = JSON.parse(text);
    const results = (json.result && json.result.results) || [];
    if (!results.length) break;
    for (const pkg of results) {
      if (found.length >= MAX_DATASETS) break;
      if (skipTitle(pkg.title)) continue;
      const csv = (pkg.resources || []).find((r) => /csv/i.test(r.format || "") || /\.csv($|\?)/i.test(r.url || ""));
      if (!csv || !csv.url) continue;
      found.push({ title: pkg.title || "", url: csv.url, org: (pkg.organization && pkg.organization.title) || "" });
    }
    if (results.length < 20) break;
  }
  const fetchedAt = new Date().toISOString();
  const bucket = new Map();
  const filesRead = [];
  for (const file of found) {
    try {
      const { text } = await fetchText(file.url, { timeoutMs: 25000, retries: 2 });
      if (text.length > MAX_BYTES) continue;
      const rows = parseCsv(text);
      if (rows.length < 2) continue;
      const head = rows[0].map((h) => String(h).trim());
      const iYear = colIndex(head, ["ปี"]);
      const iProv = colIndex(head, ["จังหวัด"]);
      const iItem = colIndex(head, ["รายการ"]);
      const iVal = colIndex(head, ["ค่าข้อมูล", "มูลค่า"]);
      const iKind = colIndex(head, ["ประเภท"]);
      if (iYear < 0 || iVal < 0) continue;
      let kept = 0;
      for (const r of rows.slice(1)) {
        const item = iItem >= 0 ? String(r[iItem] || "") : "";
        const kind = iKind >= 0 ? String(r[iKind] || "") : "";
        const blob = `${item} ${kind} ${file.title}`;
        if (!/มูลค่า/.test(item) && !/มูลค่า/.test(kind)) continue;
        if (/ร้อยละ|ต่อหัว|ต่อประชากร|เกษตร|สัดส่วน|อัตรา/.test(blob)) continue;
        const year = beToCe(String(r[iYear]).trim());
        const value = parseNumber(r[iVal]);
        if (!year || value == null || value < 1000 || value > 20000000) continue;
        const provName = iProv >= 0 ? r[iProv] : "";
        const place = byName.get(normTh(provName)) || byName.get(normTh(file.org)) || byName.get(normTh(file.title));
        if (!place) continue;
        const key = `${place.code}|${year}`;
        if (!bucket.has(key)) bucket.set(key, []);
        bucket.get(key).push({ value, url: file.url, year });
        kept++;
      }
      if (kept) filesRead.push(file.url);
    } catch {
      // One provincial file failing does not fail the source.
    }
  }
  const observations = [];
  for (const [key, list] of bucket) {
    const values = [...new Set(list.map((x) => x.value))];
    if (values.length !== 1) continue;
    const [code, year] = key.split("|");
    observations.push({
      indicatorId: "economy.gpp",
      placeId: code.toLowerCase(),
      period: String(year),
      value: values[0],
      asOf: `${year}-12-31`,
      sourceUrl: list[0].url,
      fetchedAt,
    });
  }
  if (!observations.length) throw new Error("No provincial GPP rows parsed from GD Catalog");
  return { observations, filesRead: filesRead.length, datasetsSeen: found.length };
}
