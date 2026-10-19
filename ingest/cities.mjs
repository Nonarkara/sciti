import { readFile } from "node:fs/promises";
import { missingToken, parseCsv, parseNumber } from "./lib.mjs";

function num(value) {
  if (missingToken(value)) return null;
  return parseNumber(value);
}

export function citiesFromCsv(text) {
  const table = parseCsv(text);
  if (!table.length) return [];
  const headers = table[0].map((h) => String(h).trim());
  return table.slice(1).map((cells) => {
    const row = {};
    headers.forEach((h, i) => {
      row[h] = cells[i] == null ? "" : String(cells[i]).trim();
    });
    return {
      id: row.city_id,
      en: row.city_name_en,
      th: row.city_name_th,
      zh: row.city_name_zh,
      adminLevel: row.admin_level,
      provinceCode: row.province_code,
      provinceName: row.province_name_en,
      lat: num(row.lat),
      lon: num(row.lon),
      wikidata: row.wikidata,
      population: num(row.population_dec2568),
      smartCityStatus: row.smart_city_status,
      smartCityProjects: row.smart_city_projects,
      smartCitySource: row.smart_city_source,
      borderSez: row.border_sez,
      eec: row.eec,
      zoneSource: row.zone_source,
      nameSource: row.name_source,
      notes: row.notes,
    };
  });
}

export async function loadCityFile(file) {
  try {
    const text = await readFile(file, "utf8");
    const rows = citiesFromCsv(text).filter((row) => row.id);
    const byId = new Map(rows.map((row) => [row.id.toLowerCase(), row]));
    const localities = rows
      .filter((row) => row.adminLevel && row.adminLevel !== "province")
      .map((row) => ({
        id: row.id,
        en: row.en,
        th: row.th,
        zh: row.zh,
        adminLevel: row.adminLevel,
        provinceId: row.provinceCode ? `th-${row.provinceCode}` : "",
        provinceName: row.provinceName,
        population: row.population,
        smartCityStatus: row.smartCityStatus,
        smartCityProjects: row.smartCityProjects,
        smartCitySource: row.smartCitySource,
        nameSource: row.nameSource,
      }));
    return { byId, localities };
  } catch {
    return { byId: new Map(), localities: [] };
  }
}
