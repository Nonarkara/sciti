// Drop-in rows from data/incoming. A row with no source is rejected, never stored as zero.

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { missingToken, parseNumber, parseCsv } from "./lib.mjs";

const AREAS = new Set([
  "environment",
  "economy",
  "mobility",
  "energy",
  "people",
  "living",
  "governance",
  "other",
]);

const REQUIRED = ["place_id", "indicator_id", "period", "value", "unit", "as_of", "source_url", "publisher", "licence"];

export function rowsFromCsv(text) {
  const table = parseCsv(text);
  if (!table.length) return [];
  const headers = table[0].map((h) => String(h).trim());
  return table.slice(1).map((cells, index) => {
    const row = { __line: index + 2 };
    headers.forEach((h, i) => {
      row[h] = cells[i] == null ? "" : String(cells[i]).trim();
    });
    return row;
  });
}

export function rowsFromJson(text) {
  const data = JSON.parse(text);
  const list = Array.isArray(data) ? data : data && Array.isArray(data.observations) ? data.observations : null;
  if (!list) throw new Error("JSON must be an array or an object with observations");
  return list.map((row, index) => ({ ...row, __line: index + 1 }));
}

function asString(row, key) {
  const v = row[key];
  if (v == null) return "";
  return String(v).trim();
}

export function validateRow(row) {
  const missing = REQUIRED.filter((key) => asString(row, key) === "");
  if (missing.length) return { ok: false, reason: `missing ${missing.join(", ")}` };
  const placeId = asString(row, "place_id").toLowerCase();
  if (!/^th-\d{2}$/.test(placeId)) return { ok: false, reason: "place_id must look like th-10" };
  const indicatorId = asString(row, "indicator_id");
  if (!/^[a-z][a-z0-9_.]*$/.test(indicatorId)) return { ok: false, reason: "indicator_id is not a stable id" };
  const period = asString(row, "period");
  if (!/^\d{4}(-\d{2}(-\d{2}(T\d{2}(:\d{2})?(:\d{2})?)?)?)?$/.test(period)) {
    return { ok: false, reason: "period must be a year, a date, or an hour" };
  }
  const raw = row.value;
  if (missingToken(raw)) return { ok: false, reason: "value is n.a. or blank, so it stays missing" };
  const value = typeof raw === "number" ? raw : parseNumber(raw);
  if (value == null) return { ok: false, reason: "value is not a number" };
  if (indicatorId === "economy.boi_jobs" && value === 0) {
    return { ok: false, reason: "planned jobs of Thai 0 + foreign 0 are unreported, not a stored zero" };
  }
  const asOf = asString(row, "as_of");
  if (!/^\d{4}-\d{2}-\d{2}/.test(asOf)) return { ok: false, reason: "as_of must be a date" };
  const sourceUrl = asString(row, "source_url");
  if (!/^https?:\/\//.test(sourceUrl)) return { ok: false, reason: "source_url must be http or https" };
  const area = asString(row, "area");
  if (area && !AREAS.has(area)) return { ok: false, reason: "area is not one of the seven, or other" };
  const direction = asString(row, "direction");
  if (direction && direction !== "higher" && direction !== "lower") {
    return { ok: false, reason: "direction must be higher or lower" };
  }
  const nameEn = asString(row, "name_en") || indicatorId;
  const observation = {
    indicatorId,
    placeId,
    period,
    value,
    unit: asString(row, "unit"),
    asOf,
    sourceUrl,
    publisher: asString(row, "publisher"),
    licence: asString(row, "licence"),
    sourceName: asString(row, "source_name"),
    note: asString(row, "note"),
    fetchedAt: new Date().toISOString(),
    stale: false,
    incoming: true,
  };
  const indicator = {
    id: indicatorId,
    area: area || "other",
    status: "ok",
    direction: direction || "higher",
    licence: observation.licence,
    unit: { en: observation.unit, th: observation.unit, zh: observation.unit },
    name: {
      en: nameEn,
      th: asString(row, "name_th") || nameEn,
      zh: asString(row, "name_zh") || nameEn,
    },
    sourceName: {
      en: observation.publisher,
      th: observation.publisher,
      zh: observation.publisher,
    },
    sourceUrl,
    method: {
      en: observation.note || "Read from a row in data/incoming. The figure is the one in that file.",
      th: observation.note || "อ่านจากแถวใน data/incoming ตัวเลขคือตัวเลขในไฟล์นั้น",
      zh: observation.note || "读自 data/incoming 里的一行。数字就是该文件里的数字。",
    },
  };
  return { ok: true, observation, indicator };
}

export function acceptRows(rows) {
  const accepted = [];
  const rejected = [];
  const indicators = [];
  const seen = new Set();
  for (const row of rows) {
    const line = row.__line;
    const result = validateRow(row);
    if (!result.ok) {
      rejected.push({ line, reason: result.reason, indicator_id: asString(row, "indicator_id") });
      continue;
    }
    accepted.push(result.observation);
    if (!seen.has(result.indicator.id)) {
      seen.add(result.indicator.id);
      indicators.push(result.indicator);
    }
  }
  return { accepted, rejected, indicators };
}

/**
 * Incoming rows replace the same place + indicator + period.
 * They do not delete a built-in observation the file never mentions.
 */
export function mergeByKey(base, incoming) {
  const map = new Map();
  for (const o of base || []) map.set(`${o.indicatorId}|${o.placeId}|${o.period}`, o);
  for (const o of incoming || []) map.set(`${o.indicatorId}|${o.placeId}|${o.period}`, o);
  return [...map.values()];
}

export async function loadIncomingDir(dir) {
  let names = [];
  try {
    names = await readdir(dir);
  } catch {
    return { accepted: [], rejected: [], indicators: [], files: [] };
  }
  const accepted = [];
  const rejected = [];
  const indicators = [];
  const files = [];
  for (const name of names.sort()) {
    if (!/\.(csv|json)$/i.test(name)) continue;
    const full = path.join(dir, name);
    const text = await readFile(full, "utf8");
    let rows;
    try {
      rows = name.toLowerCase().endsWith(".json") ? rowsFromJson(text) : rowsFromCsv(text);
    } catch (err) {
      rejected.push({ file: name, line: 0, reason: String(err.message || err) });
      files.push(name);
      continue;
    }
    const result = acceptRows(rows);
    for (const row of result.accepted) accepted.push(row);
    for (const row of result.rejected) rejected.push({ file: name, ...row });
    for (const ind of result.indicators) {
      if (!indicators.some((i) => i.id === ind.id)) indicators.push(ind);
    }
    files.push(name);
  }
  return { accepted, rejected, indicators, files };
}
