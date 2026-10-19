import { fetchText, parseNumber, normTh } from "../lib.mjs";

const LIST = "https://gdcatalog.go.th/api/3/action/organization_list?all_fields=true&limit=300";

export async function loadCatalog(places) {
  const byName = new Map(places.map((p) => [normTh(p.th), p]));
  const orgs = [];
  for (let offset = 0; offset < 900; offset += 300) {
    const { text } = await fetchText(`${LIST}&offset=${offset}`, { accept: "application/json", timeoutMs: 40000 });
    const json = JSON.parse(text);
    const page = json.result || [];
    orgs.push(...page);
    if (page.length < 300) break;
  }
  const fetchedAt = new Date().toISOString();
  const asOf = fetchedAt.slice(0, 10);
  const observations = [];
  const seen = new Set();
  for (const org of orgs) {
    const title = org.title || "";
    if (!title.startsWith("จังหวัด") && title !== "กรุงเทพมหานคร") continue;
    const place = byName.get(normTh(title));
    if (!place || seen.has(place.code)) continue;
    const count = parseNumber(org.package_count);
    if (!Number.isFinite(count) || count < 0 || count > 100000) continue;
    seen.add(place.code);
    const orgUrl = `https://gdcatalog.go.th/organization/${org.name}`;
    observations.push({
      indicatorId: "governance.datasets",
      placeId: place.code.toLowerCase(),
      period: asOf.slice(0, 4),
      value: count,
      asOf,
      sourceUrl: orgUrl,
      fetchedAt,
    });
  }
  if (observations.length < 70) throw new Error(`GD Catalog matched ${observations.length} provinces`);
  return { observations, catalogUrl: "https://gdcatalog.go.th/" };
}
