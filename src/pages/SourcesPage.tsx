import React from "react";
import type { I18nDict, Lang } from "../i18n";
import { SOURCES } from "../data";
import { ThaiRule } from "../ui";
import Footer from "./Footer";

interface Props {
  lang: Lang;
  t: I18nDict;
  navigate: (r: string) => void;
}

const SourcesPage: React.FC<Props> = ({ lang, t, navigate }) => (
  <div>
    <section className="section" style={{ paddingTop: 32 }}>
      <ThaiRule>{lang === "en" ? "SOURCES" : "แหล่งข้อมูล"}</ThaiRule>
      <h1 className="section__title serif mt-12" style={{ fontSize: "var(--t-display)", lineHeight: 1.0, marginBottom: 12 }}>
        {t.sources_h}
      </h1>
      <p className="muted" style={{ maxWidth: "44ch", fontSize: 15 }}>{t.sources_sub}</p>

      <table className="srctable mt-24">
        <thead>
          <tr>
            <th>{lang === "en" ? "Source" : "แหล่งข้อมูล"}</th>
            <th>{lang === "en" ? "Type" : "ประเภท"}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {SOURCES.map((s, i) => (
            <tr key={i}>
              <td className="serif" style={{ fontWeight: 700 }}>{s[lang]}</td>
              <td className="muted">{s.kind}</td>
              <td><a href={s.url} target="_blank" rel="noreferrer">{lang === "en" ? "Visit →" : "เปิด →"}</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
    <Footer lang={lang} t={t} navigate={navigate} />
  </div>
);

export default SourcesPage;
