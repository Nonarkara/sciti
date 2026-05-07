import React, { useState } from "react";
import type { I18nDict, Lang } from "../i18n";
import { CITIES, PILLARS } from "../data";
import { ThaiRule } from "../ui";
import Footer from "./Footer";

const cityName = (c: (typeof CITIES)[0], lang: Lang) => c[lang].name;

interface Props {
  lang: Lang;
  t: I18nDict;
  navigate: (r: string) => void;
}

const ComparePage: React.FC<Props> = ({ lang, t, navigate }) => {
  const [a, setA] = useState("phuket");
  const [b, setB] = useState("khonkaen");

  const A = CITIES.find(c => c.id === a)!;
  const B = CITIES.find(c => c.id === b)!;

  return (
    <div>
      <section className="section" style={{ paddingTop: 32 }}>
        <ThaiRule>{lang === "en" ? "COMPARE" : "เปรียบเทียบ"}</ThaiRule>
        <h1 className="section__title serif mt-12" style={{ fontSize: "var(--t-display)", lineHeight: 1.0, marginBottom: 12 }}>
          {t.compare_h}
        </h1>
        <p className="muted" style={{ maxWidth: "44ch", fontSize: 15 }}>{t.compare_sub}</p>

        <div className="cmp-pickers mt-24">
          <div className="cmp-picker">
            <div className="eyebrow">A</div>
            <select value={a} onChange={e => setA(e.target.value)}>
              {CITIES.map(c => <option key={c.id} value={c.id}>{cityName(c, lang)}</option>)}
            </select>
          </div>
          <div className="cmp-picker">
            <div className="eyebrow">B</div>
            <select value={b} onChange={e => setB(e.target.value)}>
              {CITIES.map(c => <option key={c.id} value={c.id}>{cityName(c, lang)}</option>)}
            </select>
          </div>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <div className="cmp-row">
            <div className={"cmp-row__v is-left serif" + (A.score > B.score ? " is-win" : "")}>
              {A.score.toFixed(1)}
            </div>
            <div className="cmp-row__label">{lang === "en" ? "Overall" : "รวม"}</div>
            <div className={"cmp-row__v serif" + (B.score > A.score ? " is-win" : "")}>
              {B.score.toFixed(1)}
            </div>
          </div>
          <div className="cmp-row">
            <div className="cmp-row__v is-left serif">#{A.rank}</div>
            <div className="cmp-row__label">{t.rank}</div>
            <div className="cmp-row__v serif">#{B.rank}</div>
          </div>
          {PILLARS.map(p => {
            const av = A.pillars[p.id] ?? 0;
            const bv = B.pillars[p.id] ?? 0;
            return (
              <div key={p.id} className="cmp-row">
                <div className={"cmp-row__v is-left serif" + (av > bv ? " is-win" : "")}>{av}</div>
                <div className="cmp-row__label">{p[lang]}</div>
                <div className={"cmp-row__v serif" + (bv > av ? " is-win" : "")}>{bv}</div>
              </div>
            );
          })}
        </div>
      </section>
      <Footer lang={lang} t={t} navigate={navigate} />
    </div>
  );
};

export default ComparePage;
