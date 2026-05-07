import React from "react";
import type { I18nDict, Lang } from "../i18n";
import { ThaiRule } from "../ui";
import Footer from "./Footer";

interface Props {
  lang: Lang;
  t: I18nDict;
  navigate: (r: string) => void;
}

const AboutPage: React.FC<Props> = ({ lang, t, navigate }) => (
  <div>
    <section className="section" style={{ paddingTop: 32 }}>
      <ThaiRule>{lang === "en" ? "ABOUT" : "เกี่ยวกับ"}</ThaiRule>
      <h1 className="section__title serif mt-12" style={{ fontSize: "var(--t-display)", lineHeight: 1.0, marginBottom: 12 }}>
        {t.about_h}
      </h1>
      <div style={{ maxWidth: "62ch" }}>
        <p className="serif" style={{ fontSize: 19, lineHeight: 1.55, color: "var(--ink-2)" }}>{t.about_p1}</p>
        <p className="muted mt-16" style={{ fontSize: 15, lineHeight: 1.6 }}>{t.about_p2}</p>
      </div>

      <div className="three-col mt-32">
        <div className="card" style={{ padding: 18 }}>
          <div className="eyebrow">{lang === "en" ? "INDEPENDENCE" : "ความเป็นอิสระ"}</div>
          <div className="serif mt-8" style={{ fontWeight: 700, fontSize: 18 }}>
            {lang === "en" ? "No paid placements." : "ไม่รับเงินซื้ออันดับ"}
          </div>
          <p className="muted mt-8" style={{ fontSize: 13 }}>
            {lang === "en"
              ? "Cities and vendors cannot pay to be added, removed, or repositioned."
              : "เมืองและผู้ขายไม่สามารถจ่ายเพื่อเพิ่ม ลบ หรือเลื่อนอันดับ"}
          </p>
        </div>
        <div className="card" style={{ padding: 18 }}>
          <div className="eyebrow">{lang === "en" ? "CADENCE" : "รอบการอัปเดต"}</div>
          <div className="serif mt-8" style={{ fontWeight: 700, fontSize: 18 }}>
            {lang === "en" ? "Annual, with mid-year notes." : "ปีละครั้ง พร้อมบันทึกกลางปี"}
          </div>
          <p className="muted mt-8" style={{ fontSize: 13 }}>
            {lang === "en"
              ? "Major release each January. Significant news triggers an interim revision."
              : "เผยแพร่หลักทุกมกราคม มีการแก้ไขเมื่อมีเหตุสำคัญ"}
          </p>
        </div>
        <div className="card" style={{ padding: 18 }}>
          <div className="eyebrow">{lang === "en" ? "OPEN DATA" : "ข้อมูลเปิด"}</div>
          <div className="serif mt-8" style={{ fontWeight: 700, fontSize: 18 }}>
            {lang === "en" ? "Indicators downloadable." : "ดาวน์โหลดข้อมูลได้"}
          </div>
          <p className="muted mt-8" style={{ fontSize: 13 }}>
            {lang === "en"
              ? "Raw indicator scores released as CSV under CC BY 4.0."
              : "คะแนนดิบเผยแพร่เป็น CSV ภายใต้ CC BY 4.0"}
          </p>
        </div>
      </div>
    </section>
    <Footer lang={lang} t={t} navigate={navigate} />
  </div>
);

export default AboutPage;
