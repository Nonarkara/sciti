// Legal geography of the serious emergency decree. Not a crime series.
// Extension 86, Cabinet 6 October 2569, in force 20 October 2569 through 19 January 2570.
// Cited from the Thai PBS report. A Royal Gazette notice for extension 86 was not found.
// https://www.thaipbs.or.th/news/content/559232

const SOURCE_URL = "https://www.thaipbs.or.th/news/content/559232";
const AS_OF = "2026-10-20";
const PERIOD = "2026-10-20";

// Any district still designated. A 0 is not a claim that the province is safe.
// Raman is an additional Yala exception. The province stays 1.
const DESIGNATED = new Set(["th-94", "th-95", "th-96"]);

const NOTE =
  "1 if any district is inside the serious-emergency area under extension 86, in force 20 October 2026 through 19 January 2027 (Cabinet, 6 October 2026): Narathiwat except Yi-ngo, Waeng and Sukhirin; Pattani except Yaring, Panare, Mayo, Mai Kaen, Thung Yang Daeng, Kapho and Mae Lan; Yala except Betong, Yaha, Kabang, Krong Pinang and Raman. Songkhla is 0. This is not a count of incidents.";

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
    sourceName: "Thai PBS report of the Cabinet resolution, 6 October 2026, emergency-decree extension 86",
    note: NOTE,
    fetchedAt: "2026-10-19T12:00:00.000Z",
  }));
}
