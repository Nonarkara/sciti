import { useMemo, useState } from "react";
import { LENSES } from "./lib/lenses.mjs";
import { fillFor } from "./fill";
import { Profile } from "./profile";
import { MISSING_SERIES, RECORD_NOTES, SOURCES } from "./lib/sources.mjs";
import { figurePhrase, indicatorLabel, methodParagraphs, num, placeName, t, tr, whenPhrase } from "./text";
import type { Baseline, GeoFile, Lang, Lens, ScoreRow } from "./types";

function latest(baseline: Baseline, indicatorId: string, placeId: string) {
  const rows = baseline.observations.filter((item) => item.indicatorId === indicatorId && item.placeId === placeId);
  if (!rows.length) return null;
  return rows.slice().sort((a, b) => a.period.localeCompare(b.period))[rows.length - 1];
}

export function PlaceScreen({
  baseline,
  lang,
  lens,
  row,
  placeId,
  hrefFor,
}: {
  baseline: Baseline;
  lang: Lang;
  lens: Lens;
  row: ScoreRow | undefined;
  placeId: string;
  hrefFor: (path: string) => string;
}) {
  const place = baseline.places.find((item) => item.id === placeId);
  if (!place) return <Missing lang={lang} hrefFor={hrefFor} />;
  return (
    <article className="page">
      <Profile baseline={baseline} placeId={placeId} lang={lang} lens={lens} row={row} hrefFor={hrefFor} asPage />
      <p>
        <a href={hrefFor(`/compare`)}>{t(lang, "compareWith")}</a>
      </p>
    </article>
  );
}

export function CompareScreen({
  baseline,
  lang,
  hrefFor,
  initialA,
  initialB,
}: {
  baseline: Baseline;
  lang: Lang;
  hrefFor: (path: string) => string;
  initialA: string;
  initialB: string;
}) {
  const [a, setA] = useState(initialA);
  const [b, setB] = useState(initialB);
  const options = baseline.places;
  return (
    <article className="page">
      <h1>{t(lang, "compare")}</h1>
      <div className="row">
        <select aria-label={t(lang, "compare")} value={a} onChange={(event) => setA(event.target.value)}>
          {options.map((place) => (
            <option key={place.id} value={place.id}>
              {placeName(place, lang)}
            </option>
          ))}
        </select>
        <span>{t(lang, "and")}</span>
        <select aria-label={t(lang, "compare")} value={b} onChange={(event) => setB(event.target.value)}>
          {options.map((place) => (
            <option key={place.id} value={place.id}>
              {placeName(place, lang)}
            </option>
          ))}
        </select>
      </div>
      {a === b ? <p>{t(lang, "samePlace")}</p> : null}
      <div className="scroll">
        <table>
          <thead>
            <tr>
              <th>{t(lang, "profile")}</th>
              <th>{placeName(options.find((place) => place.id === a), lang)}</th>
              <th>{placeName(options.find((place) => place.id === b), lang)}</th>
            </tr>
          </thead>
          <tbody>
            {baseline.indicators.map((indicator) => {
              const left = latest(baseline, indicator.id, a);
              const right = latest(baseline, indicator.id, b);
              const published = baseline.observations.some((item) => item.indicatorId === indicator.id);
              const inBoi = (placeId: string) =>
                baseline.observations.some(
                  (item) => item.placeId === placeId && (item.indicatorId === "economy.investment" || item.indicatorId === "economy.boi_projects"),
                );
              const cell = (value: typeof left, placeId: string) =>
                figurePhrase(lang, indicator, value, published, indicator.id === "economy.boi_jobs" && inBoi(placeId));
              return (
                <tr key={indicator.id}>
                  <td>
                    <a href={hrefFor(`/indicator/${indicator.id}`)}>{indicatorLabel(lang, indicator)}</a>
                  </td>
                  <td>{cell(left, a)}</td>
                  <td>{cell(right, b)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </article>
  );
}

export function CoverageScreen({ baseline, geo, lang, hrefFor }: { baseline: Baseline; geo: GeoFile | null; lang: Lang; hrefFor: (path: string) => string }) {
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const place of baseline.places) {
      let n = 0;
      for (const area of baseline.areas) {
        const ids = baseline.indicators.filter((item) => item.area === area.id).map((item) => item.id);
        if (baseline.observations.some((item) => item.placeId === place.id && ids.includes(item.indicatorId))) n += 1;
      }
      map.set(place.id, n);
    }
    return map;
  }, [baseline]);
  const max = baseline.areas.length || 1;
  return (
    <article className="page">
      <h1>{t(lang, "coverage")}</h1>
      <p>
        {lang === "th"
          ? "สีเข้มคือจังหวัดที่มีตัวเลขครบหลายด้านมากขึ้น เส้นประคือยังไม่มีตัวเลขในทั้งเจ็ดด้าน"
          : lang === "zh"
            ? "颜色更深，表示七个方面里已有数字的方面更多。虚线表示七个方面都还没有数字。"
            : "A darker province has a published figure in more of the seven areas. A dashed edge has none."}
      </p>
      <div className="coverage-map" style={{ height: "70dvh" }}>
        {geo ? (
          <svg viewBox={geo.viewBox} role="group" aria-label={t(lang, "mapLabel")} preserveAspectRatio="xMidYMid meet">
            {geo.features.map((feature) => {
              const count = counts.get(feature.id) || 0;
              return <path key={feature.id} d={feature.d} fill={count ? fillFor((count / max) * 100) : "none"} stroke="#12354e" strokeWidth={0.8} strokeDasharray={count ? undefined : "3 2"} />;
            })}
          </svg>
        ) : (
          <p>{t(lang, "reading")}</p>
        )}
      </div>
      {baseline.localities && baseline.localities.length ? (
        <details>
          <summary>
            {baseline.localities.length}{" "}
            {lang === "th" ? "เทศบาลและพื้นที่โครงการ" : lang === "zh" ? "个市镇和项目片区" : "municipalities and project areas"}
          </summary>
          <p>{t(lang, "localitiesNote")}</p>
          <ul className="plain">
            {baseline.localities.map((item) => (
              <li key={item.id}>
                {placeName(item, lang)}
                {item.provinceId ? ` · ${placeName(baseline.places.find((place) => place.id === item.provinceId), lang)}` : ""}
                {item.population != null ? ` · ${num(item.population, 0)}` : ""}
                {item.smartCityStatus
                  ? ` · ${/renewal not found/i.test(item.smartCityStatus) ? t(lang, "renewalShort") : /renewed\/new/i.test(item.smartCityStatus) ? t(lang, "renewedShort") : ""}`
                  : ""}
              </li>
            ))}
          </ul>
        </details>
      ) : null}
      <div className="scroll">
        <table>
          <thead>
            <tr>
              <th>{t(lang, "profile")}</th>
              <th>{t(lang, "provinces")}</th>
              <th>{t(lang, "asOf")}</th>
            </tr>
          </thead>
          <tbody>
            {baseline.indicators.map((indicator) => {
              const rows = baseline.observations.filter((item) => item.indicatorId === indicator.id);
              const places = new Set(rows.map((item) => item.placeId));
              const newest = rows.slice().sort((a, b) => String(b.asOf).localeCompare(String(a.asOf)))[0];
              return (
                <tr key={indicator.id}>
                  <td>
                    <a href={hrefFor(`/indicator/${indicator.id}`)}>{indicatorLabel(lang, indicator)}</a>
                  </td>
                  <td>
                    {lang === "th" ? `${places.size} จาก ${baseline.places.length}` : lang === "zh" ? `${places.size} / ${baseline.places.length}` : `${places.size} of ${baseline.places.length}`}
                  </td>
                  <td>{newest ? whenPhrase(lang, newest.asOf) : t(lang, "notInFile")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </article>
  );
}

export function MethodsScreen({
  baseline,
  lang,
  lensId,
  hrefFor,
}: {
  baseline: Baseline | null;
  lang: Lang;
  lensId: string;
  hrefFor: (path: string) => string;
}) {
  const lens = LENSES.find((item) => item.id === lensId);
  return (
    <article className="page">
      <h1>{t(lang, "methods")}</h1>
      {!lens ? (
        <div>
          <p>{t(lang, "normalisationTitle")}</p>
          {methodParagraphs.map((paragraph) => (
            <p key={paragraph.en}>{tr(lang, paragraph)}</p>
          ))}
          <ul className="plain">
            {LENSES.map((item) => (
              <li key={item.id}>
                <a href={hrefFor(`/methods/${item.id}`)}>
                  {tr(lang, item.name)}
                  {item.proposed ? ` (${t(lang, "proposed")})` : ""}
                </a>
              </li>
            ))}
          </ul>
          {RECORD_NOTES.map((note) => (
            <p key={note.en}>{tr(lang, note)}</p>
          ))}
          <h2>{t(lang, "stillMissing")}</h2>
          <ul className="plain">
            {MISSING_SERIES.map((item) => (
              <li key={item.id}>
                <a href={hrefFor(`/indicator/${item.id}`)}>{tr(lang, item)}</a>
              </li>
            ))}
          </ul>
          <h2 id="sources">{t(lang, "sourcesTitle")}</h2>
          <p>{t(lang, "notDepa")}</p>
          {SOURCES.map((source) => (
            <p key={source.id}>
              <a href={source.url}>{tr(lang, source.publisher)}</a>. {tr(lang, source.dataset)}. {tr(lang, source.usedFor)}. {tr(lang, source.licence)}
            </p>
          ))}
          {baseline ? (
            <div>
              <h2>{t(lang, "profile")}</h2>
              <ul className="plain">
                {baseline.indicators.map((indicator) => (
                  <li key={indicator.id}>
                    <a href={hrefFor(`/indicator/${indicator.id}`)}>{indicatorLabel(lang, indicator)}</a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : (
        <div>
          <h2>
            {tr(lang, lens.name)}
            {lens.proposed ? ` (${t(lang, "proposed")})` : ""}
          </h2>
          <p>{tr(lang, lens.question)}</p>
          <p>{tr(lang, lens.caveat)}</p>
          <p>{t(lang, "notDepa")}</p>
          {methodParagraphs.map((paragraph) => (
            <p key={paragraph.en}>{tr(lang, paragraph)}</p>
          ))}
          <ul className="plain">
            {lens.components.map((component) => (
              <li key={component.id}>
                <strong>{tr(lang, component.name)}</strong> {component.weight} {t(lang, "weightOf")}. {component.direction === "lower" ? t(lang, "lower") : t(lang, "higher")}. {tr(lang, component.note)}
              </li>
            ))}
          </ul>
          <p>
            <a href={hrefFor("/methods")}>{t(lang, "methods")}</a>
          </p>
        </div>
      )}
    </article>
  );
}

export function IndicatorScreen({
  baseline,
  lang,
  indicatorId,
  hrefFor,
}: {
  baseline: Baseline;
  lang: Lang;
  indicatorId: string;
  hrefFor: (path: string) => string;
}) {
  const indicator = baseline.indicators.find((item) => item.id === indicatorId);
  if (!indicator) return <Missing lang={lang} hrefFor={hrefFor} />;
  const rows = baseline.observations.filter((item) => item.indicatorId === indicator.id);
  const byPlace = new Map<string, (typeof rows)[number]>();
  for (const row of rows) {
    const prev = byPlace.get(row.placeId);
    if (!prev || row.period > prev.period) byPlace.set(row.placeId, row);
  }
  const tls = baseline.runs?.some((run) => run.tlsRelaxed) && (indicator.id === "env.pm25" || indicator.id === "env.aqi");
  return (
    <article className="page">
      <h1>{indicatorLabel(lang, indicator)}</h1>
      <p>{tr(lang, indicator.method)}</p>
      <p>
        <a href={indicator.sourceUrl}>{tr(lang, indicator.sourceName)}</a>
      </p>
      <p className="meta">
        {indicator.licence || "not stated"}
        {indicator.direction === "lower" ? `. ${t(lang, "lower")}` : indicator.direction === "higher" ? `. ${t(lang, "higher")}` : ""}
      </p>
      {tls ? <p>{t(lang, "airCert")}</p> : null}
      {byPlace.size ? (
        <div className="scroll">
          <table>
            <tbody>
              {[...byPlace.entries()]
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([placeId, row]) => {
                  const phrase = figurePhrase(lang, indicator, row, true);
                  const current = phrase !== t(lang, "noCurrentReading");
                  return (
                  <tr key={placeId}>
                    <td>
                      <a href={hrefFor(`/place/${placeId}`)}>{placeName(baseline.places.find((place) => place.id === placeId), lang)}</a>
                    </td>
                    <td>
                      {current ? `${phrase}. ${whenPhrase(lang, row.asOf)}.` : `${phrase}.`}
                    </td>
                    <td>
                      <a href={row.sourceUrl}>{t(lang, "source")}</a>
                      {row.stale && current ? ` ${t(lang, "lastGood")}` : ""}
                    </td>
                  </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      ) : (
        <p>{t(lang, "notInFile")}.</p>
      )}
    </article>
  );
}

export function AboutScreen({ baseline, lang, asset }: { baseline: Baseline | null; lang: Lang; asset: (path: string) => string }) {
  const when = baseline ? whenPhrase(lang, baseline.generatedAt) : "";
  return (
    <article className="page">
      <h1>sciti</h1>
      <p>{t(lang, "tenetShort")}</p>
      <p>{t(lang, "tenetLong")}</p>
      {baseline ? (
        <p>
          {lang === "th"
            ? `ไฟล์นี้จัดเมื่อ ${when} รุ่น ${baseline.version} แต่ละตัวเลขมีแหล่งและวันที่ ถ้าไม่มีไฟล์ จะเว้นว่างไว้`
            : lang === "zh"
              ? `这份文件生成于 ${when}，版本 ${baseline.version}。每个数字都有来源和日期。没有文件的地方就空着。`
              : `This file was built on ${when}, version ${baseline.version}. Every figure has a source and a date. Where no file was read, the cell stays empty.`}
        </p>
      ) : (
        <p>{t(lang, "reading")}</p>
      )}
      <p>
        <a href={asset("data/baseline.json")}>{t(lang, "json")}</a> · <a href={asset("data/baseline.csv")}>{t(lang, "csv")}</a>
      </p>
      <p>
        {lang === "th"
          ? "ขอบเขตจังหวัดมาจาก geoBoundaries ซึ่งสร้างจาก OpenStreetMap ภายใต้สัญญาอนุญาต ODbL ตัวเลขเป็นของหน่วยงานที่เผยแพร่ รหัสของเว็บนี้อยู่ภายใต้ MIT"
          : lang === "zh"
            ? "府界来自 geoBoundaries，基于 OpenStreetMap，许可为 ODbL。数字属于公布它们的机构。这个网站的代码使用 MIT 许可。"
            : "Province boundaries are from geoBoundaries, built from OpenStreetMap under the ODbL. The figures belong to the offices that published them. The code of this site is MIT."}
      </p>
      <p>
        {lang === "th"
          ? "ไฟล์ใหม่ที่มีคอลัมน์ place_id, indicator_id, period, value, unit, as_of, source_url, publisher และ licence จะถูกอ่านจาก data/incoming ตาม schema ในคลัง"
          : lang === "zh"
            ? "带有 place_id、indicator_id、period、value、unit、as_of、source_url、publisher 和 licence 这些列的新文件，会按仓库里的 schema 从 data/incoming 读入。"
            : "A new file with the columns place_id, indicator_id, period, value, unit, as_of, source_url, publisher and licence is read from data/incoming, using the schema in the repository."}
      </p>
    </article>
  );
}

export function Missing({ lang, hrefFor }: { lang: Lang; hrefFor: (path: string) => string }) {
  return (
    <article className="page">
      <h1>{t(lang, "missingPage")}</h1>
      <p>
        <a href={hrefFor("/")}>{t(lang, "home")}</a>
      </p>
    </article>
  );
}

export function ReadingShell({ lang, message }: { lang: Lang; message: "reading" | "failed" }) {
  return (
    <article className="page">
      <h1>{t(lang, "question")}</h1>
      <p>{t(lang, message)}</p>
    </article>
  );
}
