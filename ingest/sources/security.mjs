// Legal geography of the serious emergency decree. Not a crime series.
// In force on 19 October 2569: Cabinet, 14 July 2569, extension 85.
// https://www.thaigov.go.th/th/news/166390

const SOURCE_URL = "https://www.thaigov.go.th/th/news/166390";
const AS_OF = "2026-10-19";
const PERIOD = "2026-10-19";

// Any district still designated. A 0 is not a claim that the province is safe.
const DESIGNATED = new Set(["th-94", "th-95", "th-96"]);

const NOTE =
  "1 if any district is inside the serious-emergency area in force on 19 October 2569 (Cabinet extension 85, 20 July through 19 October 2569): Narathiwat except Yi-ngo, Waeng and Sukhirin; Pattani except Yaring, Panare, Mayo, Mai Kaen, Thung Yang Daeng, Kapho and Mae Lan; Yala except Betong, Yaha, Kabang and Krong Pinang. The 6 October 2569 Cabinet resolution continues the three provinces from 20 October 2569 and adds Raman to Yala's exceptions. Songkhla is 0. This is not a count of incidents.";

export function decreeObservations(placeIds) {
  const ids = [...new Set(placeIds)].filter((id) => /^th-\d{2}$/.test(id)).sort();
  if (ids.length !== 77) {
    throw new Error(`emergency decree needs all 77 provinces, got ${ids.length}`);
  }
  return ids.map((placeId) => ({
    indicatorId: "governance.emergency_decree",
    placeId,
    period: PERIOD,
    value: DESIGNATED.has(placeId) ? 1 : 0,
    unit: "1 = designated in part",
    asOf: AS_OF,
    sourceUrl: SOURCE_URL,
    publisher: "Cabinet of Thailand",
    licence: "not stated",
    sourceName: "Cabinet resolution, 14 July 2569, emergency-decree extension 85",
    note: NOTE,
    fetchedAt: "2026-10-19T12:00:00.000Z",
  }));
}
