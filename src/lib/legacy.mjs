// Old addresses from the previous site. The award pages fold into About without keeping that copy.

export const PROVINCE_ALIASES = {
  ayutthaya: "phra nakhon si ayutthaya",
  chainat: "chai nat",
  "lop buri": "lopburi",
  sisaket: "si sa ket",
};

const ABOUT = new Set(["/bingo", "/partners", "/audit", "/creative-economy", "/why", "/showcase", "/asus", "/program", "/knowledge", "/invest"]);
const HOME = new Set(["/rankings", "/discover", "/story", "/map"]);
const METHODS = new Set(["/methodology", "/sources", "/references"]);

function provinceTarget(slug, places, redirectTable) {
  const province = redirectTable[slug];
  if (!province || !places) return "/";
  const key = PROVINCE_ALIASES[String(province).toLowerCase()] || String(province).toLowerCase();
  const place = places.find((item) => item.en.toLowerCase() === key);
  return place ? `/place/${place.id}` : "/";
}

export function legacyTarget(path, places, redirectTable) {
  const clean = String(path || "/").replace(/\/+$/, "") || "/";
  const decoded = decodeURIComponent(clean);
  if (ABOUT.has(decoded) || decoded.startsWith("/Kimi") || decoded.toLowerCase() === "/kimi") return "/about";
  if (HOME.has(decoded)) return "/";
  if (METHODS.has(decoded)) return "/methods";
  const city = /^\/(?:city|canvas)\/([^/]+)$/.exec(decoded);
  if (!city) return null;
  return provinceTarget(city[1], places, redirectTable);
}
