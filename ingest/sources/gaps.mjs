import { fetchText } from "../lib.mjs";

// These sources were checked. They do not currently yield a province baseline,
// so the indicators stay empty. The attempt is recorded; nothing is filled in.

export async function checkGaps() {
  const checks = [
    {
      id: "energy.electricity",
      url: "https://www.eppo.go.th/data-energy-statistic/energy-statistic/electric-energy-stat/%E0%B9%84%E0%B8%9F%E0%B8%9F%E0%B9%89%E0%B8%B2-2/",
    },
    {
      id: "living.beds",
      url: "https://catalogapi.nso.go.th/api/index?table=PHS_26_01&format=csv",
    },
    {
      id: "data.go.th",
      url: "https://data.go.th/",
    },
  ];
  const out = [];
  for (const c of checks) {
    try {
      const res = await fetchText(c.url, { timeoutMs: 20000, retries: 1 });
      out.push({ id: c.id, url: c.url, status: res.status || 200, bytes: res.text.length });
    } catch (err) {
      out.push({ id: c.id, url: c.url, status: err.status || 0, error: String(err.message || err).slice(0, 180) });
    }
  }
  return out;
}
