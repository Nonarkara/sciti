// A province keeps the cluster around its newest station stamp.
// The pull clock must not drop that cluster: the page is a snapshot, not a live hour.

export const AIR_MAX_AGE_MS = 3 * 60 * 60 * 1000;
const CLOCK_SKEW_MS = 5 * 60 * 1000;

export function stationStamp(date, time) {
  const day = String(date || "").trim();
  const clock = String(time || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return null;
  const match = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(clock);
  if (!match) return null;
  const stamp = `${day}T${match[1]}:${match[2]}:${match[3] || "00"}+07:00`;
  return Number.isFinite(Date.parse(stamp)) ? stamp : null;
}

export function readingAgeMs(stamp, nowIso) {
  const stampMs = Date.parse(stamp);
  const nowMs = Date.parse(nowIso);
  if (!Number.isFinite(stampMs) || !Number.isFinite(nowMs)) return null;
  return nowMs - stampMs;
}

export function isFreshReading(stamp, nowIso, maxAgeMs = AIR_MAX_AGE_MS) {
  const age = readingAgeMs(stamp, nowIso);
  if (age == null) return false;
  return age >= -CLOCK_SKEW_MS && age <= maxAgeMs;
}

export function selectFreshReadings(readings, nowIso, maxAgeMs = AIR_MAX_AGE_MS) {
  const fresh = (readings || []).filter((row) => row && isFreshReading(row.stamp, nowIso, maxAgeMs));
  if (!fresh.length) return { readings: [], asOf: null };
  const asOf = fresh.map((row) => row.stamp).sort().at(-1);
  return { readings: fresh, asOf };
}

export function selectStationCluster(readings, maxAgeMs = AIR_MAX_AGE_MS) {
  const rows = (readings || []).filter((row) => row && Number.isFinite(Date.parse(row.stamp)));
  if (!rows.length) return { readings: [], asOf: null };
  const asOf = rows.map((row) => row.stamp).sort().at(-1);
  const kept = rows.filter((row) => {
    const age = readingAgeMs(row.stamp, asOf);
    return age != null && age >= -CLOCK_SKEW_MS && age <= maxAgeMs;
  });
  return { readings: kept, asOf };
}

export function observationIsCurrent(observation, maxAgeMs = AIR_MAX_AGE_MS) {
  if (!observation || observation.stale) return false;
  return isFreshReading(observation.asOf, observation.fetchedAt, maxAgeMs);
}
