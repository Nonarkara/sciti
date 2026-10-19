// Old addresses from the previous site. The award pages fold into About without keeping that copy.

export function legacyTarget(path, places, redirectTable) {
  const clean = String(path || "/").replace(/\/+$/, "") || "/";
  const decoded = decodeURIComponent(clean);
  if (decoded === "/bingo" || decoded === "/partners" || decoded === "/audit" || decoded.startsWith("/Kimi")) return "/about";
  if (decoded === "/rankings" || decoded === "/discover" || decoded === "/story" || decoded === "/map") return "/";
  if (decoded === "/methodology" || decoded === "/sources") return "/methods";
  const city = /^\/city\/([^/]+)$/.exec(decoded);
  if (!city) return null;
  const province = redirectTable[city[1]];
  if (!province || !places) return "/";
  const place = places.find((item) => item.en.toLowerCase() === String(province).toLowerCase());
  return place ? `/place/${place.id}` : "/";
}
