import assert from "node:assert/strict";
import test from "node:test";
import { airQuietNote, figurePhrase, partSentence, proposedSuffix } from "../src/text.ts";

const CJK = /[\u3400-\u9FFF\uF900-\uFAFF]/;

export function asciiPunctNearCjk(text) {
  const stripped = String(text).replace(/https?:\/\/\S+/g, "");
  const hits = [];
  for (const match of stripped.matchAll(/[:(),]/g)) {
    const index = match.index ?? 0;
    const before = stripped[index - 1] || "";
    const after = stripped[index + 1] || "";
    if (CJK.test(before) || CJK.test(after)) hits.push(stripped.slice(Math.max(0, index - 12), index + 12));
  }
  return hits;
}

const growth = {
  id: "economy.gpp_real_growth",
  unit: { en: "% y/y (chain volume)", th: "% y/y (chain volume)", zh: "% y/y (chain volume)" },
  name: { en: "Real output growth", th: "การเติบโตของผลผลิตที่แท้จริง", zh: "实际产出增长" },
};

test("Chinese evidence sentences use fullwidth punctuation and no space before %", () => {
  const phrase = figurePhrase("zh", growth, { indicatorId: growth.id, placeId: "th-10", period: "2023", value: 18.6, asOf: "2023-12-31", sourceUrl: "https://example.test" }, true);
  assert.equal(phrase.includes("18.6%"), true);
  assert.equal(phrase.includes("18.6 %"), false);
  assert.equal(phrase.includes(","), false);
  const sentence = partSentence(
    "zh",
    {
      id: growth.id,
      kind: "raw",
      value: 18.6,
      state: "used",
      places: 77,
      evidence: { period: "2023", asOf: "2023-12-31", publisher: "National Statistical Office", sourceUrl: "https://example.test" },
    },
    { id: "growth", components: [{ id: growth.id, indicatorId: growth.id, name: growth.name }] },
    [growth],
  );
  assert.match(sentence, /^实际产出增长：18\.6%/);
  assert.equal(sentence.includes(":"), false);
  assert.equal(asciiPunctNearCjk(sentence).join(" | "), "");
  assert.equal(asciiPunctNearCjk(`${growth.name.zh}${proposedSuffix("zh")}`).join(" | "), "");
  assert.equal(proposedSuffix("zh"), "（提议）");
  const air = figurePhrase(
    "zh",
    { id: "env.pm25", unit: { en: "µg/m³", th: "มคก./ลบ.ม.", zh: "微克/立方米" }, name: { en: "PM2.5", th: "PM2.5", zh: "PM2.5" } },
    { indicatorId: "env.pm25", placeId: "th-70", period: "2026-09-19T20", value: 10.7, asOf: "2026-09-19T20:00:00+07:00", sourceUrl: "https://air4thai.pcd.go.th/", stations: 1 },
    true,
    false,
    airQuietNote("zh", { indicatorId: "env.pm25", asOf: "2026-09-19T20:00:00+07:00", stations: 1 }, "2026-10-19"),
  );
  assert.match(air, /自2026年9月19日起未再报告/);
  assert.equal(asciiPunctNearCjk(air).join(" | "), "");
});

test("English evidence sentences stay in ASCII", () => {
  const phrase = figurePhrase("en", growth, { indicatorId: growth.id, placeId: "th-10", period: "2023", value: 18.6, asOf: "2023-12-31", sourceUrl: "https://example.test" }, true);
  assert.match(phrase, /^18\.6 % y\/y \(chain volume\), 2023$/);
  assert.equal(
    airQuietNote("en", { indicatorId: "env.pm25", asOf: "2026-09-19T20:00:00+07:00", stations: 1 }, "2026-10-19"),
    "Not reported since 19 September 2026",
  );
  assert.equal(airQuietNote("en", { indicatorId: "env.pm25", asOf: "2026-10-19T20:00:00+07:00", stations: 1 }, "2026-10-19"), "");
  assert.equal(airQuietNote("en", { indicatorId: "env.pm25", asOf: "2026-10-06T13:00:00+07:00", stations: 2 }, "2026-10-19"), "");
});
