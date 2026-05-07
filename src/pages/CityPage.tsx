import React from "react";
import type { I18nDict, Lang } from "../i18n";
import { CITIES, PILLARS, REGIONS } from "../data";
import { Ornament, PILLAR_COLOR, cityImg } from "../ui";
import Footer from "./Footer";

const cityName = (c: (typeof CITIES)[0], lang: Lang) => c[lang].name;
const cityProvince = (c: (typeof CITIES)[0], lang: Lang) => c[lang].province;
const cityTagline = (c: (typeof CITIES)[0], lang: Lang) => c[lang].tagline ?? "";

interface Props {
  id: string;
  lang: Lang;
  t: I18nDict;
  navigate: (r: string) => void;
}

const CityPage: React.FC<Props> = ({ id, lang, t, navigate }) => {
  const c = CITIES.find(x => x.id === id);
  if (!c) return <div className="section"><p>Not found.</p></div>;

  const region = REGIONS.find(r => r.id === c.region);
  const moves = lang === "en" ? c.moves_en : c.moves_th;
  const highlights = lang === "en" ? c.highlights_en : (c.highlights_th ?? c.highlights_en);
  const verdict = lang === "en" ? c.verdict_en : c.verdict_th;
  const peers = CITIES.filter(x => x.region === c.region && x.id !== c.id).slice(0, 3);

  const buildingTag = lang === "en" ? "Building" : "กำลังก่อสร้าง";

  return (
    <div>
      {/* Hero image */}
      <div style={{ position: "relative", aspectRatio: "16/8", maxHeight: 360, overflow: "hidden", borderBottom: "1px solid var(--rule)" }}>
        <img src={cityImg(c.id)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(20,15,10,.2) 0%, rgba(20,15,10,.65) 100%)" }}></div>
        <div style={{ position: "absolute", inset: "auto 0 0 0", padding: "24px var(--pad-x)", color: "#F4EFE6" }}>
          <button
            className="pill"
            style={{ background: "rgba(255,255,255,.12)", borderColor: "rgba(255,255,255,.3)", color: "#F4EFE6", marginBottom: 12 }}
            onClick={() => navigate("rankings")}
          >
            ← {lang === "en" ? "All rankings" : "ดูอันดับทั้งหมด"}
          </button>
          <div className="eyebrow" style={{ color: "rgba(255,255,255,.85)" }}>
            #{String(c.rank).padStart(2, "0")} · {region?.[lang]} · {cityProvince(c, lang)}
          </div>
          <div className="serif" style={{ fontSize: "var(--t-display)", fontWeight: 700, lineHeight: 1.0, marginTop: 8, letterSpacing: "-0.01em", textWrap: "balance" }}>
            {cityName(c, lang)}
          </div>
          <div style={{ marginTop: 8, fontSize: 16, opacity: 0.9, maxWidth: "44ch" }}>{cityTagline(c, lang)}</div>
        </div>
      </div>

      <section className="section">
        <div className="city-layout">
          <div>
            {/* Score header card */}
            <div className="card" style={{ padding: 18, display: "grid", gridTemplateColumns: "1fr auto", gap: 18, alignItems: "center" }}>
              <div>
                <div className="eyebrow">{lang === "en" ? "Overall score" : "คะแนนรวม"}</div>
                <div className="serif" style={{ fontWeight: 700, fontSize: 56, lineHeight: 1, marginTop: 6, letterSpacing: "-0.01em" }}>
                  {c.score.toFixed(1)}<span style={{ color: "var(--ink-3)", fontSize: ".4em", fontWeight: 400 }}> / 100</span>
                </div>
                <div className="muted mt-8" style={{ fontSize: 13 }}>
                  {lang === "en" ? "Field-verified · Updated 2 weeks ago" : "ลงพื้นที่ตรวจสอบ · อัปเดต 2 สัปดาห์ก่อน"}
                </div>
              </div>
              <div className="radial" style={{ "--p": c.score } as React.CSSProperties}>
                <div className="radial__num">{c.score.toFixed(0)}</div>
                <div className="radial__lab">{lang === "en" ? "OVERALL" : "รวม"}</div>
              </div>
            </div>

            {/* Pillars */}
            <h3 className="serif mt-32" style={{ fontWeight: 700, fontSize: "var(--t-headline)", margin: "32px 0 16px" }}>
              {t.pillars_h}
            </h3>
            <div className="card" style={{ padding: "16px 18px" }}>
              {PILLARS.map(p => {
                const v = c.pillars[p.id] ?? 0;
                return (
                  <div key={p.id} className="pillarrow">
                    <div>
                      <div className="pillarrow__name serif">
                        <span className="dot" style={{ background: PILLAR_COLOR[p.id], marginRight: 8 }}></span>
                        {p[lang]}
                      </div>
                      <div className="pillarrow__hint">{p[`hint_${lang}` as "hint_en" | "hint_th"]}</div>
                    </div>
                    <div className="pillarrow__score serif">{v}</div>
                    <div className="pillarrow__bar">
                      <div className="bar"><i style={{ width: v + "%", background: PILLAR_COLOR[p.id] }}></i></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Moves */}
            {moves && moves.length > 0 && (
              <>
                <h3 className="serif" style={{ fontWeight: 700, fontSize: "var(--t-headline)", margin: "32px 0 16px" }}>
                  {t.moves_h}
                </h3>
                <div className="card" style={{ padding: "16px 18px" }}>
                  {moves.map((m, i) => (
                    <div key={i} className="move">
                      <div className={"move__bullet" + (m.tag === buildingTag ? " move__bullet--ghost" : "")}></div>
                      <div>
                        <span className={"pill " + (m.tag !== buildingTag ? "pill--good" : "pill--warn")} style={{ marginBottom: 6 }}>
                          {m.tag}
                        </span>
                        <div className="move__title serif">{m.title}</div>
                        <div className="move__body">{m.body}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <aside>
            {/* Highlights */}
            <h3 className="serif" style={{ fontWeight: 700, fontSize: "var(--t-headline)", margin: "0 0 16px" }}>
              {t.highlights}
            </h3>
            <div className="card" style={{ padding: "8px 18px" }}>
              {(highlights ?? []).map((h, i) => (
                <div key={i} style={{ padding: "12px 0", borderTop: i ? "1px solid var(--rule)" : "0", display: "flex", gap: 10, alignItems: "baseline" }}>
                  <Ornament className="ornament" />
                  <span className="serif" style={{ fontWeight: 700, fontSize: 16 }}>{h}</span>
                </div>
              ))}
            </div>

            {verdict && (
              <>
                <h3 className="serif" style={{ fontWeight: 700, fontSize: "var(--t-headline)", margin: "32px 0 16px" }}>
                  {t.verdict}
                </h3>
                <div className="card" style={{ padding: 18, borderLeft: "3px solid var(--terra)", borderRadius: "0 8px 8px 0" }}>
                  <div className="serif" style={{ fontSize: 18, lineHeight: 1.4, fontStyle: "italic", color: "var(--ink-2)" }}>
                    "{verdict}"
                  </div>
                  <div className="eyebrow mt-12">— {lang === "en" ? "SCITI editors" : "บรรณาธิการ SCITI"}</div>
                </div>
              </>
            )}

            {peers.length > 0 && (
              <>
                <h3 className="serif" style={{ fontWeight: 700, fontSize: "var(--t-headline)", margin: "32px 0 16px" }}>
                  {t.sister}
                </h3>
                <div className="card" style={{ padding: "8px 18px" }}>
                  {peers.map(p => (
                    <button key={p.id} className="rankrow" onClick={() => navigate("city/" + p.id)} style={{ width: "100%" }}>
                      <div className="rankrow__rank serif">{String(p.rank).padStart(2, "0")}</div>
                      <div>
                        <div className="rankrow__name serif">{cityName(p, lang)}</div>
                        <div className="rankrow__sub muted">{cityProvince(p, lang)}</div>
                      </div>
                      <div className="rankrow__score serif">{p.score.toFixed(1)}</div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </aside>
        </div>
      </section>
      <Footer lang={lang} t={t} navigate={navigate} />
    </div>
  );
};

export default CityPage;
