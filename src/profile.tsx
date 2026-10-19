import type { Baseline, Lang, Lens, ScoreRow } from "./types";
import { coveragePhrase, day, namesFor, num, outOf100, partSentence, placeName, regions, t, topParts, tr } from "./text";

function latest(baseline: Baseline, indicatorId: string, placeId: string) {
  const rows = baseline.observations.filter((item) => item.indicatorId === indicatorId && item.placeId === placeId);
  if (!rows.length) return null;
  return rows.slice().sort((a, b) => a.period.localeCompare(b.period))[rows.length - 1];
}

export function Profile({
  baseline,
  placeId,
  lang,
  lens,
  row,
  hrefFor,
  asPage,
}: {
  baseline: Baseline;
  placeId: string;
  lang: Lang;
  lens: Lens;
  row: ScoreRow | undefined;
  hrefFor: (path: string) => string;
  asPage?: boolean;
}) {
  const place = baseline.places.find((item) => item.id === placeId);
  if (!place) return null;
  const region = regions[place.region];
  const anyHere = (id: string) => baseline.observations.some((item) => item.indicatorId === id);
  return (
    <section id="profile">
      {asPage ? (
        <h1>
          {placeName(place, lang)} {t(lang, "profile")}
        </h1>
      ) : (
        <h2>
          {placeName(place, lang)} {t(lang, "profile")}
        </h2>
      )}
      {region ? (
        <p className="meta">
          {tr(lang, region)}. {t(lang, "areasLabel")}
        </p>
      ) : null}
      {row && row.score != null ? (
        <p>
          {row.rank}. {coveragePhrase(lang, row.coverage.have, row.coverage.of)}. {outOf100(lang, row.score)}.
        </p>
      ) : null}
      {row ? (
        <div>
          <h3>{t(lang, "why")}</h3>
          {topParts(row).map((part) => (
            <p key={part.id}>
              {partSentence(lang, part, lens, baseline.indicators)}{" "}
              {part.evidence ? (
                <a href={part.evidence.sourceUrl}>{t(lang, "source")}</a>
              ) : null}
            </p>
          ))}
          {row.parts.some((part) => part.state === "missing-here") ? (
            <p>
              {t(lang, "notHere")}: {namesFor(lang, lens, row.parts.filter((part) => part.state === "missing-here").map((part) => part.id))}.
            </p>
          ) : null}
          {row.parts.some((part) => part.state === "not-in-file") ? (
            <p>
              {t(lang, "notInFile")}: {namesFor(lang, lens, row.parts.filter((part) => part.state === "not-in-file").map((part) => part.id))}.
            </p>
          ) : null}
          {row.parts.some((part) => part.state === "zero-weight") ? (
            <p>
              {t(lang, "zeroWeight")}: {namesFor(lang, lens, row.parts.filter((part) => part.state === "zero-weight").map((part) => part.id))}.
            </p>
          ) : null}
        </div>
      ) : null}
      {baseline.areas.map((area) => {
        const indicators = baseline.indicators.filter((item) => item.area === area.id);
        if (!indicators.length) return null;
        return (
          <div key={area.id}>
            <h3>{tr(lang, area)}</h3>
            <ul className="plain">
              {indicators.map((indicator) => {
                const value = latest(baseline, indicator.id, placeId);
                return (
                  <li key={indicator.id}>
                    <a href={hrefFor(`/indicator/${indicator.id}`)}>
                      {tr(lang, indicator.name)}
                    </a>
                    {value ? (
                      <>
                        {": "}
                        {num(value.value, Number.isInteger(value.value) ? 0 : 1)} {tr(lang, indicator.unit)}, {value.period}. {value.publisher || tr(lang, indicator.sourceName)}, {day(value.asOf)}.{" "}
                        <a href={value.sourceUrl}>{t(lang, "source")}</a>
                        {value.stale ? ` ${t(lang, "lastGood")}` : ""}
                      </>
                    ) : (
                      <>: {anyHere(indicator.id) ? t(lang, "notHere") : t(lang, "notInFile")}.</>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </section>
  );
}
