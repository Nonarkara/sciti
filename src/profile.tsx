import type { Baseline, Lang, Lens, ScoreRow } from "./types";
import { placeNote } from "./lib/notes.mjs";
import { DateText, LinkedText } from "./linked";
import { publisherName } from "./lib/publishers.mjs";
import { airQuietNote, coveragePhrase, depaSentence, figurePhrase, gregorianProse, indicatorLabel, namesFor, newestAirDay, outOf100, partSentence, placeName, regions, t, topParts, tr, whenPhrase } from "./text";

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
  const note = placeNote(placeId);
  const anyHere = (id: string) => baseline.observations.some((item) => item.indicatorId === id);
  const airDay = newestAirDay(baseline.observations);
  const colon = lang === "zh" ? "：" : ": ";
  const stop = lang === "zh" ? "。" : ". ";
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
      {depaSentence(lang, place.smartCityStatus) ? (
        <p>
          {depaSentence(lang, place.smartCityStatus)}
          {place.smartCityProjects ? ` ${lang === "th" ? place.smartCityProjects : gregorianProse(place.smartCityProjects)}.` : ""}{" "}
          {place.smartCitySource ? <a href={place.smartCitySource.split(";")[0].trim()}>{t(lang, "source")}</a> : null}
        </p>
      ) : null}
      {place.borderSez ? (
        <p>
          {place.borderSez}.
          {place.zoneSource ? (
            <>
              {" "}
              <a href={place.zoneSource.split(";")[0].trim()}>{t(lang, "source")}</a>
            </>
          ) : null}
        </p>
      ) : null}
      {place.eec ? <p>{t(lang, "eecHere")}</p> : null}
      {note ? (
        <p>
          <LinkedText lang={lang} text={tr(lang, note)} />
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
              <DateText text={partSentence(lang, part, lens, baseline.indicators)} />{" "}
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
                const inBoi =
                  indicator.id === "economy.boi_jobs" &&
                  baseline.observations.some(
                    (item) => item.placeId === placeId && (item.indicatorId === "economy.investment" || item.indicatorId === "economy.boi_projects"),
                  );
                const phrase = figurePhrase(lang, indicator, value, anyHere(indicator.id), inBoi, airQuietNote(lang, value, airDay));
                const air = indicator.id === "env.pm25" || indicator.id === "env.aqi";
                return (
                  <li key={indicator.id}>
                    <a href={hrefFor(`/indicator/${indicator.id}`)}>
                      {indicatorLabel(lang, indicator)}
                    </a>
                    {colon}
                    <DateText text={phrase} />
                    {value ? (
                      <>
                        {stop}
                        {value.publisher ? publisherName(lang, value.publisher) : tr(lang, indicator.sourceName)}
                        {air ? stop : <DateText text={lang === "zh" ? `，${whenPhrase(lang, value.asOf)}。` : `, ${whenPhrase(lang, value.asOf)}. `} />}
                        <a href={value.sourceUrl}>{t(lang, "source")}</a>
                        {value.stale ? ` ${t(lang, "lastGood")}` : ""}
                      </>
                    ) : (
                      lang === "zh" ? "。" : "."
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
