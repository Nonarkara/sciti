import { fetchText } from "../lib.mjs";

const SPARQL = `SELECT ?code ?en ?th ?zh ?zh2 ?pop ?date ?ref WHERE {
  ?item wdt:P300 ?code .
  FILTER(REGEX(STR(?code), "^TH-[0-9]{2}$"))
  OPTIONAL { ?item rdfs:label ?en FILTER(LANG(?en)="en") }
  OPTIONAL { ?item rdfs:label ?th FILTER(LANG(?th)="th") }
  OPTIONAL { ?item rdfs:label ?zh FILTER(LANG(?zh)="zh-hans") }
  OPTIONAL { ?item rdfs:label ?zh2 FILTER(LANG(?zh2)="zh") }
  OPTIONAL {
    ?item p:P1082 ?st .
    ?st ps:P1082 ?pop .
    OPTIONAL { ?st pq:P585 ?date }
    OPTIONAL {
      ?st prov:wasDerivedFrom ?der .
      OPTIONAL { ?der pr:P854 ?ref }
    }
  }
}`;

function val(b, key) {
  return b[key] && b[key].value;
}

export async function loadPopulation() {
  const endpoint = "https://query.wikidata.org/sparql?query=" + encodeURIComponent(SPARQL);
  const { text } = await fetchText(endpoint, {
    accept: "application/sparql-results+json",
    timeoutMs: 60000,
  });
  const json = JSON.parse(text);
  const rows = json.results.bindings;
  const places = new Map();
  const buckets = new Map();
  for (const b of rows) {
    const code = val(b, "code");
    if (!code) continue;
    if (!places.has(code)) {
      places.set(code, {
        code,
        en: (val(b, "en") || code).replace(/ Province$/, ""),
        th: (val(b, "th") || "").replace(/^จังหวัด/, ""),
        zh: (val(b, "zh") || val(b, "zh2") || "").replace(/府$/, ""),
      });
    } else {
      const p = places.get(code);
      if (!p.zh && (val(b, "zh") || val(b, "zh2"))) p.zh = (val(b, "zh") || val(b, "zh2")).replace(/府$/, "");
      if (!p.th && val(b, "th")) p.th = val(b, "th").replace(/^จังหวัด/, "");
    }
    const ref = val(b, "ref") || "";
    const official = /dopa\.go\.th|bora\.dopa\.go\.th/i.test(ref);
    if (!official) continue;
    const date = (val(b, "date") || "").slice(0, 10);
    const year = Number(date.slice(0, 4));
    if (!year || year < 2014 || year > 2035) continue;
    const pop = Number(val(b, "pop"));
    if (!Number.isFinite(pop) || pop < 50000 || pop > 20000000) continue;
    const key = `${code}|${year}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push({ pop, ref, date });
  }
  const observations = [];
  const fetchedAt = new Date().toISOString();
  for (const [key, list] of buckets) {
    const [code, year] = key.split("|");
    const unique = [...new Set(list.map((x) => Math.round(x.pop)))];
    if (unique.length !== 1) continue;
    const best = list[0];
    observations.push({
      indicatorId: "people.population",
      placeId: code.toLowerCase(),
      period: String(year),
      value: unique[0],
      asOf: `${year}-12-31`,
      sourceUrl: best.ref,
      fetchedAt,
    });
  }
  return { places: [...places.values()], observations };
}
