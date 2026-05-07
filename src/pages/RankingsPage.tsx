import React, { useState, useMemo } from "react";
import type { I18nDict, Lang } from "../i18n";
import { CITIES, PILLARS, REGIONS } from "../data";
import { ThaiRule, PILLAR_COLOR } from "../ui";
import Footer from "./Footer";

const cityName = (c: (typeof CITIES)[0], lang: Lang) => c[lang].name;
const cityProvince = (c: (typeof CITIES)[0], lang: Lang) => c[lang].province;

interface Props {
  lang: Lang;
  t: I18nDict;
  navigate: (r: string) => void;
}

const RankingsPage: React.FC<Props> = ({ lang, t, navigate }) => {
  const [view, setView] = useState<"table" | "cards">("table");
  const [region, setRegion] = useState("all");
  const [sortBy, setSortBy] = useState("score");

  const cities = useMemo(() => {
    let cs = [...CITIES];
    if (region !== "all") cs = cs.filter(c => c.region === region);
    if (sortBy === "score") cs.sort((a, b) => b.score - a.score);
    else cs.sort((a, b) => (b.pillars[sortBy] ?? 0) - (a.pillars[sortBy] ?? 0));
    return cs;
  }, [region, sortBy]);

  return (
    <div>
      <section className="section" style={{ paddingTop: 32 }}>
        <ThaiRule>{lang === "en" ? "RANKINGS" : "อันดับ"}</ThaiRule>
        <h1 className="section__title serif mt-12" style={{ fontSize: "var(--t-display)", lineHeight: 1.0, marginBottom: 12 }}>
          {t.rankings_h}
        </h1>
        <p className="muted" style={{ maxWidth: "44ch", fontSize: 15 }}>{t.rankings_sub}</p>

        {/* Controls */}
        <div className="row wrap gap-8 mt-24" style={{ borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)", padding: "12px 0" }}>
          <div className="row gap-8" style={{ flexWrap: "wrap" }}>
            <span className="eyebrow">{t.region}</span>
            <div className="tb-toggle" style={{ flexWrap: "wrap" }}>
              <button className={region === "all" ? "is-active" : ""} onClick={() => setRegion("all")}>{t.all}</button>
              {REGIONS.map(r => (
                <button key={r.id} className={region === r.id ? "is-active" : ""} onClick={() => setRegion(r.id)}>
                  {r[lang]}
                </button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1 }}></div>
          <div className="row gap-8">
            <span className="eyebrow">{t.sort}</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{ background: "transparent", border: "1px solid var(--rule)", borderRadius: 999, padding: "6px 12px", font: "600 12px var(--mono)", color: "var(--ink)" }}
            >
              <option value="score">{lang === "en" ? "Overall" : "คะแนนรวม"}</option>
              {PILLARS.map(p => <option key={p.id} value={p.id}>{p[lang]}</option>)}
            </select>
            <div className="tb-toggle">
              <button className={view === "table" ? "is-active" : ""} onClick={() => setView("table")}>
                {lang === "en" ? "Table" : "ตาราง"}
              </button>
              <button className={view === "cards" ? "is-active" : ""} onClick={() => setView("cards")}>
                {lang === "en" ? "Cards" : "การ์ด"}
              </button>
            </div>
          </div>
        </div>

        {view === "table" ? (
          <div className="ranklist mt-12">
            {cities.map(c => (
              <div key={c.id} className="rankrow" onClick={() => navigate("city/" + c.id)}>
                <div className="rankrow__rank serif">{String(c.rank).padStart(2, "0")}</div>
                <div>
                  <div className="rankrow__name serif">{cityName(c, lang)}</div>
                  <div className="rankrow__sub muted">
                    {cityProvince(c, lang)} · {REGIONS.find(r => r.id === c.region)?.[lang]}
                  </div>
                  <div className="bar mt-8" style={{ width: 220, maxWidth: "60vw" }}>
                    <i style={{ width: c.score + "%" }}></i>
                  </div>
                </div>
                <div className="rankrow__score serif">
                  {(sortBy === "score" ? c.score : (c.pillars[sortBy] ?? 0)).toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="three-col mt-16">
            {cities.map(c => (
              <button
                key={c.id}
                className="citycard"
                onClick={() => navigate("city/" + c.id)}
                style={{ textAlign: "left", cursor: "pointer", border: "1px solid var(--rule)" }}
              >
                <div>
                  <div className="citycard__rank">#{String(c.rank).padStart(2, "0")} · {REGIONS.find(r => r.id === c.region)?.[lang]}</div>
                  <div className="citycard__name serif">{cityName(c, lang)}</div>
                  <div className="citycard__province">{cityProvince(c, lang)}</div>
                </div>
                <div className="citycard__score serif">{c.score.toFixed(1)}</div>
                <div className="citycard__pillars">
                  {PILLARS.map(p => (
                    <span key={p.id} className="pillchip" title={p[lang]}>
                      <i style={{ background: PILLAR_COLOR[p.id], opacity: 0.3 + (c.pillars[p.id] ?? 0) / 120 }}></i>
                      {c.pillars[p.id] ?? "—"}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
      <Footer lang={lang} t={t} navigate={navigate} />
    </div>
  );
};

export default RankingsPage;
