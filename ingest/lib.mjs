// Shared ingest helpers. No network here, so tests can call them directly.

export const UA = "sciti-baseline/2.0 (public civic baseline; +https://github.com/Nonarkara/sciti)";

export function normTh(name) {
  return String(name || "")
    .replace(/^จังหวัด/, "")
    .replace(/\s+/g, "")
    .replace(/ฯ/g, "")
    .trim();
}

export function beToCe(year) {
  const y = Number(year);
  if (!Number.isFinite(y)) return null;
  if (y > 2400 && y < 2700) return y - 543;
  if (y >= 1990 && y <= 2100) return y;
  return null;
}

const MISSING_TOKEN = /^(n\.?a\.?|n\/a|na|null|none|—|-|\.{1,3})$/i;

/** n.a., N/A, a blank, or a dash. Never a number, and never coerced to 0. */
export function missingToken(raw) {
  if (raw == null) return true;
  const s = String(raw).trim();
  if (!s) return true;
  return MISSING_TOKEN.test(s);
}

export function parseNumber(raw) {
  if (missingToken(raw)) return null;
  const s = String(raw).trim().replace(/,/g, "").replace(/"/g, "");
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/**
 * Sum only when every cell is a real number.
 * One n.a. makes the whole sum missing. It is not skipped, and it is not zero.
 */
export function sumComplete(raws) {
  if (!raws || !raws.length) return null;
  let total = 0;
  for (const raw of raws) {
    if (missingToken(raw)) return null;
    const n = parseNumber(raw);
    if (n == null) return null;
    total += n;
  }
  return total;
}

// RFC-style CSV, enough for the Thai open-data files we read.
export function parseCsv(text) {
  const src = String(text).replace(/^\uFEFF/, "");
  const rows = [];
  let row = [];
  let cell = "";
  let q = false;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (q) {
      if (c === '"') {
        if (src[i + 1] === '"') {
          cell += '"';
          i++;
        } else q = false;
      } else cell += c;
    } else if (c === '"') q = true;
    else if (c === ",") {
      row.push(cell);
      cell = "";
    } else if (c === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (c !== "\r") cell += c;
  }
  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => String(c).trim() !== ""));
}

export function colIndex(headers, needles) {
  return headers.findIndex((h) => needles.some((n) => String(h).includes(n)));
}

export function observationOk(o) {
  if (!o || typeof o !== "object") return "empty";
  if (typeof o.indicatorId !== "string" || !o.indicatorId) return "indicator";
  if (typeof o.placeId !== "string" || !o.placeId) return "place";
  if (typeof o.value !== "number" || !Number.isFinite(o.value)) return "value";
  if (typeof o.sourceUrl !== "string" || !/^https?:\/\//.test(o.sourceUrl)) return "sourceUrl";
  if (typeof o.asOf !== "string" || o.asOf.length < 4) return "asOf";
  if (typeof o.period !== "string" || !o.period) return "period";
  return null;
}

export function assertProvenance(observations) {
  const bad = [];
  for (const o of observations) {
    const why = observationOk(o);
    if (why) bad.push({ why, o });
  }
  return bad;
}

/**
 * Replace one source's observations.
 * On failure, keep the previous observations for those indicators and mark them stale.
 * A failed source never invents a zero.
 */
export function applySource(prevObservations, result) {
  const ids = new Set(result.indicatorIds || []);
  const prev = Array.isArray(prevObservations) ? prevObservations : [];
  const others = prev.filter((o) => !ids.has(o.indicatorId));
  if (!result.ok) {
    const kept = prev
      .filter((o) => ids.has(o.indicatorId))
      .map((o) => ({
        ...o,
        stale: true,
        staleReason: result.error || "refresh failed",
      }));
    return {
      observations: [...others, ...kept],
      state: {
        ok: false,
        error: result.error || "refresh failed",
        usedLastGood: kept.length > 0,
        count: kept.length,
      },
    };
  }
  const bad = assertProvenance(result.observations || []);
  if (bad.length) {
    const kept = prev
      .filter((o) => ids.has(o.indicatorId))
      .map((o) => ({ ...o, stale: true, staleReason: "rejected: missing provenance" }));
    return {
      observations: [...others, ...kept],
      state: {
        ok: false,
        error: `rejected ${bad.length} observations without provenance`,
        usedLastGood: kept.length > 0,
        count: kept.length,
      },
    };
  }
  const fresh = (result.observations || []).map((o) => ({ ...o, stale: false }));
  return {
    observations: [...others, ...fresh],
    state: { ok: true, error: null, usedLastGood: false, count: fresh.length },
  };
}

export const CSV_HEADERS = [
  "place_id",
  "indicator_id",
  "period",
  "value",
  "unit",
  "as_of",
  "source_url",
  "publisher",
  "licence",
  "source_name",
  "note",
  "area",
  "direction",
  "name_en",
  "name_th",
  "name_zh",
  "place_en",
  "place_th",
  "place_zh",
  "stale",
  "fetched_at",
];

export function toCsv(rows, headers = CSV_HEADERS) {
  const esc = (v) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.join(",")];
  for (const r of rows) lines.push(headers.map((h) => esc(r[h])).join(","));
  return lines.join("\n") + "\n";
}

import http from "node:http";
import https from "node:https";

function requestOnce(url, { insecure = false, timeoutMs = 25000, accept } = {}) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("http:") ? http : https;
    const req = lib.get(
      url,
      {
        headers: { "user-agent": UA, accept: accept || "*/*" },
        rejectUnauthorized: !insecure,
        timeout: timeoutMs,
      },
      (res) => {
        const status = res.statusCode || 0;
        if (status >= 300 && status < 400 && res.headers.location) {
          res.resume();
          const next = new URL(res.headers.location, url).href;
          requestOnce(next, { insecure, timeoutMs, accept }).then(resolve, reject);
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          resolve({
            status,
            ok: status >= 200 && status < 300,
            text: () => Promise.resolve(Buffer.concat(chunks).toString("utf8")),
            tlsRelaxed: insecure,
          });
        });
      },
    );
    req.on("timeout", () => {
      req.destroy(new Error(`timeout for ${url}`));
    });
    req.on("error", reject);
  });
}

export async function fetchRetry(url, { retries = 3, timeoutMs = 25000, accept } = {}) {
  let lastErr;
  let insecure = false;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await requestOnce(url, { insecure, timeoutMs, accept });
      if (res.status === 403 || res.status === 404) {
        const err = new Error(`HTTP ${res.status} for ${url}`);
        err.status = res.status;
        throw err;
      }
      if (res.status === 429 || res.status >= 500) throw new Error(`HTTP ${res.status} for ${url}`);
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      return res;
    } catch (err) {
      lastErr = err;
      const cause = err && err.cause ? String(err.cause.code || err.cause.message || err.cause) : "";
      const msg = `${err && err.message ? err.message : err} ${cause}`;
      const cert = /certificate|UNABLE_TO_VERIFY|SELF_SIGNED|unable to get local issuer|UNABLE_TO_VERIFY_LEAF_SIGNATURE/i.test(msg);
      if (cert && !insecure) {
        insecure = true;
        attempt -= 1;
        continue;
      }
      if (err && (err.status === 403 || err.status === 404)) throw err;
      if (attempt < retries) await new Promise((r) => setTimeout(r, 400 * 2 ** (attempt - 1)));
    }
  }
  throw lastErr;
}

export async function fetchText(url, opts) {
  const res = await fetchRetry(url, opts);
  const text = await res.text();
  return { text, tlsRelaxed: !!res.tlsRelaxed, status: res.status };
}

export function median(values) {
  const xs = values.filter((n) => Number.isFinite(n)).sort((a, b) => a - b);
  if (!xs.length) return null;
  const mid = Math.floor(xs.length / 2);
  if (xs.length % 2) return xs[mid];
  return (xs[mid - 1] + xs[mid]) / 2;
}

export function round1(n) {
  return Math.round(n * 10) / 10;
}
