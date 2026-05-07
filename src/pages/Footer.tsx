import React from "react";
import type { I18nDict } from "../i18n";

interface FooterProps {
  lang: string;
  t: I18nDict;
  navigate: (r: string) => void;
}

const Footer: React.FC<FooterProps> = ({ lang, t, navigate }) => (
  <footer className="footer">
    <div className="footer__brand">{t.brand_a} {t.brand_b}</div>
    <div className="muted mt-8" style={{ fontSize: 12 }}>{t.edition} · {t.updated_l} {t.updated_v}</div>
    <div className="footer__cols mt-16">
      <div>
        <div className="eyebrow mb-8">{lang === "en" ? "Index" : "ดัชนี"}</div>
        <a onClick={() => navigate("rankings")}>{t.nav.rankings}</a>
        <a onClick={() => navigate("map")}>{t.nav.map}</a>
        <a onClick={() => navigate("compare")}>{t.nav.compare}</a>
      </div>
      <div>
        <div className="eyebrow mb-8">{lang === "en" ? "Process" : "กระบวนการ"}</div>
        <a onClick={() => navigate("methodology")}>{t.nav.methodology}</a>
        <a onClick={() => navigate("sources")}>{t.nav.sources}</a>
        <a onClick={() => navigate("about")}>{t.nav.about}</a>
      </div>
      <div>
        <div className="eyebrow mb-8">{lang === "en" ? "Fun" : "เล่น ๆ"}</div>
        <a onClick={() => navigate("bingo")}>{t.nav.bingo}</a>
      </div>
      <div>
        <div className="eyebrow mb-8">{lang === "en" ? "Contact" : "ติดต่อ"}</div>
        <a>editors@sciti.in.th</a>
        <a>@sciti_th</a>
      </div>
    </div>
    <div className="muted mt-24" style={{ fontSize: 11 }}>
      © 2026 SCITI · {lang === "en" ? "Independent. Annually updated." : "อิสระ อัปเดตประจำปี"}
    </div>
  </footer>
);

export default Footer;
