import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fetchText } from "./lib.mjs";

const GEO_URL =
  "https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/THA/ADM1/geoBoundaries-THA-ADM1.geojson";

const LAT0 = (13 * Math.PI) / 180;

function rdp(points, eps) {
  if (points.length < 3) return points;
  let max = 0;
  let idx = 0;
  const end = points.length - 1;
  for (let i = 1; i < end; i++) {
    const d = perp(points[i], points[0], points[end]);
    if (d > max) {
      max = d;
      idx = i;
    }
  }
  if (max > eps) {
    const left = rdp(points.slice(0, idx + 1), eps);
    const right = rdp(points.slice(idx), eps);
    return left.slice(0, -1).concat(right);
  }
  return [points[0], points[end]];
}

function perp(p, a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  return Math.abs(dy * p[0] - dx * p[1] + b[0] * a[1] - b[1] * a[0]) / len;
}

function ring(coords, eps) {
  if (!coords || coords.length < 4) return coords;
  const closed =
    coords[0][0] === coords[coords.length - 1][0] && coords[0][1] === coords[coords.length - 1][1];
  const open = closed ? coords.slice(0, -1) : coords.slice();
  let simple = rdp(open, eps);
  if (simple.length < 8) simple = rdp(open, eps / 5);
  if (simple.length < 8) {
    const step = Math.max(1, Math.floor(open.length / 60));
    simple = open.filter((_, i) => i % step === 0);
  }
  if (closed && simple.length) simple = simple.concat([simple[0]]);
  return simple;
}

export function pointInRing(lon, lat, ringCoords) {
  let inside = false;
  for (let i = 0, j = ringCoords.length - 1; i < ringCoords.length; j = i++) {
    const xi = ringCoords[i][0];
    const yi = ringCoords[i][1];
    const xj = ringCoords[j][0];
    const yj = ringCoords[j][1];
    const intersect = yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi + 0.0) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export function featureContains(feature, lon, lat) {
  const g = feature.geometry;
  const polys = g.type === "Polygon" ? [g.coordinates] : g.type === "MultiPolygon" ? g.coordinates : [];
  for (const poly of polys) {
    if (!poly[0] || !pointInRing(lon, lat, poly[0])) continue;
    let inHole = false;
    for (let h = 1; h < poly.length; h++) {
      if (pointInRing(lon, lat, poly[h])) inHole = true;
    }
    if (!inHole) return true;
  }
  return false;
}

export async function loadBoundaries(root) {
  const cache = path.join(root, "data/cache/tha-adm1.geojson");
  await mkdir(path.dirname(cache), { recursive: true });
  try {
    const { text } = await fetchText(GEO_URL, { timeoutMs: 60000, retries: 2 });
    await writeFile(cache, text);
    return JSON.parse(text);
  } catch (err) {
    try {
      const text = await readFile(cache, "utf8");
      return JSON.parse(text);
    } catch {
      throw err;
    }
  }
}

export function projectCollection(geo, eps = 0.02) {
  const cos = Math.cos(LAT0);
  const raw = [];
  for (const f of geo.features) {
    const code = f.properties.shapeISO;
    if (!code || !code.startsWith("TH-")) continue;
    const g = f.geometry;
    const polys = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
    const projected = [];
    for (const poly of polys) {
      const rings = poly.map((coords) => ring(coords, eps).map(([lon, lat]) => [lon * cos, -lat]));
      projected.push(rings);
    }
    raw.push({ code, shapeName: f.properties.shapeName, polys: projected });
  }
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const f of raw) {
    for (const poly of f.polys) {
      for (const r of poly) {
        for (const [x, y] of r) {
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
    }
  }
  const scale = 1000 / (maxX - minX || 1);
  const height = (maxY - minY) * scale;
  const features = raw.map((f) => {
    let bminX = Infinity, bminY = Infinity, bmaxX = -Infinity, bmaxY = -Infinity;
    const parts = [];
    for (const poly of f.polys) {
      const rings = poly.map((r) =>
        r.map(([x, y]) => {
          const X = (x - minX) * scale;
          const Y = (y - minY) * scale;
          if (X < bminX) bminX = X;
          if (Y < bminY) bminY = Y;
          if (X > bmaxX) bmaxX = X;
          if (Y > bmaxY) bmaxY = Y;
          return [Math.round(X * 10) / 10, Math.round(Y * 10) / 10];
        }),
      );
      parts.push(rings);
    }
    const d = parts
      .map((rings) => rings.map((r) => r.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join("") + "Z").join(""))
      .join("");
    return {
      id: f.code.toLowerCase(),
      code: f.code,
      shapeName: f.shapeName,
      d,
      bbox: [round(bminX), round(bminY), round(bmaxX), round(bmaxY)],
    };
  });
  return {
    attribution: "Boundaries: geoBoundaries ADM1, built from OpenStreetMap (ODbL). Simplified for display.",
    sourceUrl: GEO_URL,
    viewBox: `0 0 1000 ${Math.round(height)}`,
    width: 1000,
    height: Math.round(height),
    projection: { lat0: 13, minX, minY, scale },
    features,
  };
}

export function projectPoint(lon, lat, projection) {
  const x = lon * Math.cos((projection.lat0 * Math.PI) / 180);
  const y = -lat;
  return [
    Math.round((x - projection.minX) * projection.scale * 10) / 10,
    Math.round((y - projection.minY) * projection.scale * 10) / 10,
  ];
}

function round(n) {
  return Math.round(n * 10) / 10;
}

export function assignPoint(geo, lon, lat) {
  const hits = geo.features.filter((f) => featureContains(f, lon, lat));
  if (!hits.length) return null;
  if (hits.length === 1) return hits[0].properties.shapeISO;
  // Border points go to the smaller polygon so a station is not given to a neighbour by draw order.
  const area = (f) => {
    const g = f.geometry;
    const polys = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
    let a = 0;
    for (const poly of polys) {
      const r = poly[0];
      for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
        a += r[j][0] * r[i][1] - r[i][0] * r[j][1];
      }
    }
    return Math.abs(a);
  };
  hits.sort((a, b) => area(a) - area(b));
  return hits[0].properties.shapeISO;
}
