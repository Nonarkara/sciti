import React, { useState } from "react";
import type { I18nDict, Lang } from "../i18n";
import { CITIES } from "../data";
import { ThaiRule } from "../ui";
import Footer from "./Footer";

const cityName = (c: (typeof CITIES)[0], lang: Lang) => c[lang].name;
const cityProvince = (c: (typeof CITIES)[0], lang: Lang) => c[lang].province;

interface Props {
  lang: Lang;
  t: I18nDict;
  navigate: (r: string) => void;
}

const POS: Record<string, { x: number; y: number }> = {
  phuket:         { x: 130, y: 530 },
  saimburi:       { x: 215, y: 360 },
  khonkaen:       { x: 252, y: 280 },
  cmu:            { x: 168, y: 170 },
  cmoldtown:      { x: 178, y: 175 },
  bangsaen:       { x: 232, y: 380 },
  rayong:         { x: 250, y: 395 },
  korat:          { x: 240, y: 320 },
  yala:           { x: 175, y: 580 },
  nstham:         { x: 165, y: 510 },
  chiangrai:      { x: 178, y: 130 },
  ubon:           { x: 290, y: 320 },
  nan:            { x: 200, y: 165 },
  nonthaburi:     { x: 210, y: 365 },
  "petchburi-iot":{ x: 200, y: 410 },
  laemchabang:    { x: 250, y: 388 },
  wangchan:       { x: 258, y: 392 },
  khlongtoei:     { x: 218, y: 366 },
  saraburi:       { x: 222, y: 340 },
  udonthani:      { x: 248, y: 250 },
  songkhla:       { x: 175, y: 555 },
  trang:          { x: 158, y: 540 },
  samutprakan:    { x: 220, y: 372 },
  ayutthaya:      { x: 218, y: 350 },
  krabi:          { x: 145, y: 530 },
  kanchanaburi:   { x: 175, y: 360 },
  phitsanulok:    { x: 210, y: 230 },
  lampang:        { x: 185, y: 195 },
  buriram:        { x: 260, y: 320 },
  loei:           { x: 220, y: 240 },
  phrae:          { x: 195, y: 195 },
  tak:            { x: 165, y: 250 },
  "hua-hin":      { x: 195, y: 440 },
  samutsongkhram: { x: 205, y: 400 },
  satun:          { x: 158, y: 580 },
  mukdahan:       { x: 290, y: 290 },
  narathiwat:     { x: 188, y: 595 },
};

const MapPage: React.FC<Props> = ({ lang, t, navigate }) => {
  const [hoverId, setHoverId] = useState<string | null>(null);

  return (
    <div>
      <section className="section" style={{ paddingTop: 32 }}>
        <ThaiRule>{lang === "en" ? "MAP" : "แผนที่"}</ThaiRule>
        <h1 className="section__title serif mt-12" style={{ fontSize: "var(--t-display)", lineHeight: 1.0, marginBottom: 12 }}>
          {t.map_h}
        </h1>
        <p className="muted" style={{ maxWidth: "44ch", fontSize: 15 }}>{t.map_sub}</p>

        <div className="two-col mt-24">
          <div className="map-wrap">
            <svg viewBox="0 0 400 700" style={{ background: "var(--bg)" }}>
              {/* abstract Thailand silhouette — stylized */}
              <path
                d="M170 70 C 200 60, 220 90, 215 130 C 240 140, 255 170, 240 200 C 270 220, 280 250, 260 280 C 290 290, 305 320, 285 340 C 305 350, 305 380, 280 400 C 270 420, 240 410, 220 425 C 215 460, 195 480, 200 510 C 175 530, 165 560, 175 590 C 180 620, 165 650, 175 680 C 165 690, 145 680, 145 660 C 150 620, 145 580, 155 540 C 145 510, 155 480, 170 450 C 150 430, 130 420, 145 390 C 165 370, 180 340, 175 310 C 155 300, 145 270, 165 240 C 150 220, 140 190, 160 160 C 150 130, 155 90, 170 70 Z"
                fill="var(--bg-2)" stroke="var(--rule)" strokeWidth="1"
              />
              {CITIES.map(c => {
                const p = POS[c.id];
                if (!p) return null;
                const isLead = c.rank <= 3;
                const isHover = hoverId === c.id;
                return (
                  <g
                    key={c.id}
                    className={"pin " + (isLead ? "pin--lead" : "")}
                    transform={`translate(${p.x}, ${p.y})`}
                    onMouseEnter={() => setHoverId(c.id)}
                    onMouseLeave={() => setHoverId(null)}
                    onClick={() => navigate("city/" + c.id)}
                  >
                    <circle
                      className="pin__dot"
                      r={isLead ? 12 : 8}
                      style={isHover ? { fill: "var(--ink)" } : {}}
                    />
                    <text className="pin__rank" textAnchor="middle" dy={isLead ? 4 : 3}>{c.rank}</text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div>
            <div className="eyebrow">{lang === "en" ? "TOP 10" : "10 อันดับแรก"}</div>
            <div className="ranklist mt-12">
              {CITIES.slice(0, 10).map(c => (
                <div
                  key={c.id}
                  className="rankrow"
                  onClick={() => navigate("city/" + c.id)}
                  onMouseEnter={() => setHoverId(c.id)}
                  onMouseLeave={() => setHoverId(null)}
                >
                  <div className="rankrow__rank serif">{String(c.rank).padStart(2, "0")}</div>
                  <div>
                    <div className="rankrow__name serif">{cityName(c, lang)}</div>
                    <div className="rankrow__sub muted">{cityProvince(c, lang)}</div>
                  </div>
                  <div className="rankrow__score serif">{c.score.toFixed(1)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer lang={lang} t={t} navigate={navigate} />
    </div>
  );
};

export default MapPage;
