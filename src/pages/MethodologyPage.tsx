import React from "react";
import type { I18nDict, Lang } from "../i18n";
import { PILLARS, METHODOLOGY_EN, METHODOLOGY_TH } from "../data";
import { ThaiRule, PILLAR_COLOR } from "../ui";
import Footer from "./Footer";

interface Props {
  lang: Lang;
  t: I18nDict;
  navigate: (r: string) => void;
}

const MethodologyPage: React.FC<Props> = ({ lang, t, navigate }) => {
  const items = lang === "en" ? METHODOLOGY_EN : METHODOLOGY_TH;

  return (
    <div>
      <section className="section" style={{ paddingTop: 32 }}>
        <ThaiRule>{lang === "en" ? "METHODOLOGY" : "ระเบียบวิธี"}</ThaiRule>
        <h1 className="section__title serif mt-12" style={{ fontSize: "var(--t-display)", lineHeight: 1.0, marginBottom: 12, textWrap: "balance", maxWidth: "20ch" }}>
          {t.method_h}
        </h1>
        <p className="muted" style={{ maxWidth: "50ch", fontSize: 15 }}>{t.method_sub}</p>

        <div className="method mt-24">
          {items.map((m, i) => (
            <div key={i} className="method__item">
              <div className="method__h serif">
                <span className="method__num mono">{String(i + 1).padStart(2, "0")}</span>
                {m.h}
              </div>
              <p className="method__p">{m.p}</p>
            </div>
          ))}
        </div>

        <h3 className="serif mt-32" style={{ fontWeight: 700, fontSize: "var(--t-headline)" }}>
          {lang === "en" ? "The seven pillars" : "เจ็ดเสาหลัก"}
        </h3>
        <div className="three-col mt-16">
          {PILLARS.map(p => (
            <div key={p.id} className="card" style={{ padding: 16 }}>
              <div className="row gap-8">
                <span className="dot" style={{ background: PILLAR_COLOR[p.id], width: 12, height: 12 }}></span>
                <div className="serif" style={{ fontWeight: 700, fontSize: 18 }}>{p[lang]}</div>
              </div>
              <p className="muted mt-8" style={{ fontSize: 13 }}>{p[`hint_${lang}` as "hint_en" | "hint_th"]}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer lang={lang} t={t} navigate={navigate} />
    </div>
  );
};

export default MethodologyPage;
