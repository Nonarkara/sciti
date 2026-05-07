import React, { useState } from "react";
import type { I18nDict, Lang } from "../i18n";
import { BINGO_EN, BINGO_TH } from "../data";
import { ThaiRule } from "../ui";
import Footer from "./Footer";

interface Props {
  lang: Lang;
  t: I18nDict;
  navigate: (r: string) => void;
}

const BingoPage: React.FC<Props> = ({ lang, t, navigate }) => {
  const items = lang === "en" ? BINGO_EN : BINGO_TH;
  const [marks, setMarks] = useState<Set<number>>(() => new Set([12]));

  const toggle = (i: number) => {
    setMarks(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  return (
    <div>
      <section className="section" style={{ paddingTop: 32 }}>
        <ThaiRule>{lang === "en" ? "BINGO" : "บิงโก"}</ThaiRule>
        <h1 className="section__title serif mt-12" style={{ fontSize: "var(--t-display)", lineHeight: 1.0, marginBottom: 12 }}>
          {t.bingo_h}
        </h1>
        <p className="muted" style={{ maxWidth: "44ch", fontSize: 15 }}>{t.bingo_sub}</p>

        <div className="bingo mt-24" style={{ maxWidth: 560, margin: "24px auto 0" }}>
          {items.slice(0, 25).map((s, i) => (
            <div
              key={i}
              className={
                "bingo__cell" +
                (i === 12 ? " bingo__cell--free" : "") +
                (marks.has(i) && i !== 12 ? " is-marked" : "")
              }
              onClick={() => i !== 12 && toggle(i)}
            >
              {s}
            </div>
          ))}
        </div>
        <div className="center mt-24">
          <button className="btn btn--ghost" onClick={() => setMarks(new Set([12]))}>
            {lang === "en" ? "Reset board" : "ล้างกระดาน"}
          </button>
        </div>
      </section>
      <Footer lang={lang} t={t} navigate={navigate} />
    </div>
  );
};

export default BingoPage;
