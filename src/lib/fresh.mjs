// A station reading is current only against the time it was fetched, and only for about three hours.
// An old stamp must not become the province's hour, and it must not be labelled as this hour later.

export const AIR_MAX_AGE_MS = 3 * 60 * 60 * 1000;
const CLOCK_SKEW_MS = 5 * 60 * 1000;

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

export function observationIsCurrent(observation, maxAgeMs = AIR_MAX_AGE_MS) {
  if (!observation || observation.stale) return false;
  return isFreshReading(observation.asOf, observation.fetchedAt, maxAgeMs);
}
