import { useEffect } from "react";
import { LENSES } from "./lib/lenses.mjs";
import { moneyballGap } from "./lib/rank.mjs";
import { ProvinceMap } from "./map";
import { Profile } from "./profile";
import { DateText, LinkedText } from "./linked";
import { coveragePhrase, gapSentence, namesFor, partSentence, placeName, t, topParts, tr } from "./text";
import type { Baseline, GeoFile, Lang, Lens, ScoreCard, ScoreRow } from "./types";

const APPRAISAL_ID = "living.land_price";
const UNDERVALUED_GAP = 5;

function Appraisal({
  baseline,
  lang,
  scored,
  selectedRow,
  names,
}: {
  baseline: Baseline;
  lang: Lang;
  scored: ScoreCard;
  selectedRow: ScoreCard["rows"][number] | undefined;
  names: Map<string, string>;
}) {
  const hasAppraisal = baseline.observations.some((item) => item.indicatorId === APPRAISAL_ID);
  if (!hasAppraisal) return <p className="meta">{t(lang, "gapNone")}</p>;
  const ranked = scored.rows
    .filter((row) => row.score != null)
    .map((row) => ({ row, gap: moneyballGap(row.score, baseline.observations, row.placeId, APPRAISAL_ID) }))
    .filter((item): item is { row: (typeof item)["row"]; gap: NonNullable<(typeof item)["gap"]> } => !!item.gap && item.gap.gap >= UNDERVALUED_GAP)
    .sort((a, b) => b.gap.gap - a.gap.gap || a.row.placeId.localeCompare(b.row.placeId))
    .slice(0, 8);
  const selectedGap = selectedRow && selectedRow.score != null ? moneyballGap(selectedRow.score, baseline.observations, selectedRow.placeId, APPRAISAL_ID) : null;
  return (
    <div>
      <h2>{t(lang, "undervalued")}</h2>
      <p>{t(lang, "appraisalCaveat")}</p>
      {selectedGap && selectedGap.percentile != null ? (
        <p>
          {selectedGap.gap >= UNDERVALUED_GAP ? `${t(lang, "undervalued")}. ` : ""}
          <DateText
            text={gapSentence(lang, "appraisal", selectedGap.gap, selectedGap.percentile, selectedGap.places, selectedGap.observation.publisher || "", selectedGap.observation.asOf)}
          />{" "}
          <a href={selectedGap.observation.sourceUrl}>{t(lang, "source")}</a>
        </p>
      ) : null}
      {ranked.length ? (
        <ol className="ranks">
          {ranked.map(({ row, gap }) => (
            <li key={row.placeId}>
              {names.get(row.placeId)} · {gap.gap.toFixed(1)}
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}

export function Home({
  lang,
  baseline,
  geo,
  lens,
  scored,
  selected,
  setSelected,
  setLens,
  setWeight,
  resetWeights,
  hrefFor,
  asset,
  openPlace,
}: {
  lang: Lang;
  baseline: Baseline;
  geo: GeoFile | null;
  lens: Lens;
  scored: ScoreCard;
  selected: string;
  setSelected: (id: string) => void;
  setLens: (id: string) => void;
  setWeight: (id: string, value: number) => void;
  resetWeights: () => void;
  hrefFor: (path: string) => string;
  asset: (path: string) => string;
  openPlace: (id: string) => void;
}) {
  const names = new Map(baseline.places.map((place) => [place.id, placeName(place, lang)]));
  const selectedRow = scored.rows.find((row) => row.placeId === selected);
  const ranked = scored.rows.filter((row) => row.rank != null).slice().sort((a, b) => (a.rank || 0) - (b.rank || 0) || a.placeId.localeCompare(b.placeId));
  const held = scored.rows.filter((row) => row.rank == null);
  const decreeOn = (row: ScoreRow) => row.parts.some((part) => part.id === "governance.emergency_decree" && part.value === 1);
  const borderLens = lens.components.some((component) => component.id === "economy.border_trade" && component.weight > 0);
  const cambodiaOn = (row: ScoreRow) => borderLens && (row.placeId === "th-23" || row.placeId === "th-27");
  const quietCambodia = (row: ScoreRow) => lens.id === "quiet" && (row.placeId === "th-32" || row.placeId === "th-33");
  const airGap = (row: ScoreRow) => row.missingInFile.includes("env.pm25_bad_days");
  const marks = (row: ScoreRow) => {
    const bits = [];
    if (decreeOn(row)) bits.push(t(lang, "decreeMark"));
    if (cambodiaOn(row) || quietCambodia(row)) bits.push(t(lang, "cambodiaMark"));
    if (airGap(row)) bits.push(t(lang, "noAirStation"));
    return bits.length ? ` · ${bits.join(" · ")}` : "";
  };

  useEffect(() => {
    if (!selected || window.innerWidth >= 801) return;
    document.getElementById("profile")?.scrollIntoView({ block: "start" });
  }, [selected, lens.id]);

  return (
    <div className="home">
      <div className="column">
        <div className="lede">
          <h1>{t(lang, "question")}</h1>
          <p>{t(lang, "tenetShort")}</p>
          <label className="stack" htmlFor="lens">
            <span>{t(lang, "lensLabel")}</span>
            <select id="lens" name="lens" value={lens.id} onChange={(event) => setLens(event.target.value)}>
              {LENSES.map((item) => (
                <option key={item.id} value={item.id}>
                  {tr(lang, item.name)}
                  {item.proposed ? ` (${t(lang, "proposed")})` : ""}
                </option>
              ))}
            </select>
          </label>
          {ranked.length ? (
            <ol className="ranks tight">
              {ranked.slice(0, 3).map((row) => {
                const place = baseline.places.find((item) => item.id === row.placeId);
                return (
                  <li key={row.placeId}>
                    <a href={hrefFor(`/place/${row.placeId}`)}>
                      {row.rank}. {placeName(place, lang)}
                      {marks(row)}
                    </a>
                    <span className="meta"> {coveragePhrase(lang, row.coverage.have, row.coverage.of)}</span>
                  </li>
                );
              })}
            </ol>
          ) : null}
        </div>
        <div className="rail">
          <p>{t(lang, "tenetLong")}</p>
          <p>{tr(lang, lens.question)}</p>
          {lens.proposed ? <p className="meta">{t(lang, "proposed")}</p> : null}
          <p>
            <LinkedText lang={lang} text={tr(lang, lens.caveat)} />
          </p>
          <p className="legend">{t(lang, "dashed")}</p>
          {scored.contextOnly ? <p>{scored.contextReason === "no-decisive" ? t(lang, "withheldProxy") : t(lang, "withheldEmpty")}</p> : null}
          <Appraisal baseline={baseline} lang={lang} scored={scored} selectedRow={selectedRow} names={names} />
          {baseline.runs?.some((run) => run.tlsRelaxed) && lens.components.some((component) => component.id === "env.pm25" && component.weight > 0) ? (
            <p className="meta">{t(lang, "airCert")}</p>
          ) : null}
          <details>
            <summary>{t(lang, "weights")}</summary>
            {lens.components.map((component) => {
              const name = tr(lang, component.name);
              const field = `weight-${component.id}`;
              return (
                <label key={component.id} className="row" htmlFor={field}>
                  <span className="visually-hidden">{name}</span>
                  <span aria-hidden="true">{name}</span>
                  <input
                    id={field}
                    name={field}
                    type="range"
                    min={0}
                    max={100}
                    value={component.weight}
                    onChange={(event) => setWeight(component.id, Number(event.target.value))}
                  />
                  <span className="weight-readout" aria-hidden="true">
                    {component.weight} {t(lang, "weightOf")}
                  </span>
                </label>
              );
            })}
            <button type="button" onClick={resetWeights}>
              {t(lang, "reset")}
            </button>
          </details>
          <p>
            <a href={hrefFor(`/methods/${lens.id}`)}>{t(lang, "openMethods")}</a>
          </p>
          <label className="stack" htmlFor="province">
            <span>{t(lang, "chooseProvince")}</span>
            <select id="province" name="province" value={selected} onChange={(event) => setSelected(event.target.value)}>
              <option value="">{t(lang, "chooseProvince")}</option>
              {baseline.places.map((place) => (
                <option key={place.id} value={place.id}>
                  {placeName(place, lang)}
                </option>
              ))}
            </select>
          </label>
          {selected ? <Profile baseline={baseline} placeId={selected} lang={lang} lens={lens} row={selectedRow} hrefFor={hrefFor} /> : null}
          {ranked.length ? (
            <ol className="ranks">
              {ranked.map((row) => {
                const place = baseline.places.find((item) => item.id === row.placeId);
                const lead = topParts(row)[0];
                return (
                  <li key={row.placeId}>
                    <a href={hrefFor(`/place/${row.placeId}`)}>
                      {row.rank}. {placeName(place, lang)}
                      {marks(row)}
                    </a>
                    <p className="meta">{coveragePhrase(lang, row.coverage.have, row.coverage.of)}</p>
                    {lead ? (
                      <p>
                        <DateText text={partSentence(lang, lead, lens, baseline.indicators)} />{" "}
                        {lead.evidence ? <a href={lead.evidence.sourceUrl}>{t(lang, "source")}</a> : null}
                      </p>
                    ) : null}
                    {airGap(row) ? <p className="meta">{t(lang, "noAirStation")}.</p> : null}
                    {row.missingInFile.filter((id) => id !== "env.pm25_bad_days").length ? (
                      <p className="meta">
                        {t(lang, "notHere")}: {namesFor(lang, lens, row.missingInFile.filter((id) => id !== "env.pm25_bad_days"))}.
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          ) : null}
          {held.length && !scored.contextOnly ? (
            <div>
              <h2>{t(lang, "notScored")}</h2>
              <ul className="plain">
                {held.map((row) => (
                  <li key={row.placeId}>
                    <a href={hrefFor(`/place/${row.placeId}`)}>{names.get(row.placeId)}</a>
                    {marks(row)}
                    <span className="meta"> {coveragePhrase(lang, row.coverage.have, row.coverage.of)}</span>
                    {airGap(row) ? <span className="meta"> {t(lang, "noAirStation")}.</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <p className="meta">
            <a href={asset("data/baseline.json")}>{t(lang, "json")}</a> · <a href={asset("data/baseline.csv")}>{t(lang, "csv")}</a>
          </p>
        </div>
      </div>
      <ProvinceMap geo={geo} rows={scored.rows} names={names} selected={selected} onSelect={openPlace} lang={lang} labelled />
    </div>
  );
}
