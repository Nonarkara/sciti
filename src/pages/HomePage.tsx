import React, { useMemo } from "react";
import type { I18nDict, Lang } from "../i18n";
import { CITIES, PILLARS, REGIONS, NEWS_EN, NEWS_TH } from "../data";
import { ThaiRule, Icon, PILLAR_COLOR, cityImg } from "../ui";
import Footer from "./Footer";

const cityName = (c: (typeof CITIES)[0], lang: Lang) => c[lang].name;
const cityProvince = (c: (typeof CITIES)[0], lang: Lang) => c[lang].province;
const cityTagline = (c: (typeof CITIES)[0], lang: Lang) => c[lang].tagline ?? "";

interface Props {
  lang: Lang;
  t: I18nDict;
  navigate: (r: string) => void;
}

const HomePage: React.FC<Props> = ({ lang, t, navigate }) => {
  const pillarLeaders = useMemo(() => {
    return PILLARS.map(p => {
      let best = CITIES[0];
      for (const c of CITIES) if ((c.pillars[p.id] ?? 0) > (best.pillars[p.id] ?? 0)) best = c;
      return { pillar: p, city: best, score: best.pillars[p.id] };
    });
  }, []);

  const regionLeaders = useMemo(() => {
    return REGIONS.map(r => {
      const cs = CITIES.filter(c => c.region === r.id).sort((a, b) => b.score - a.score);
      return cs.length ? { region: r, city: cs[0] } : null;
    }).filter(Boolean) as { region: (typeof REGIONS)[0]; city: (typeof CITIES)[0] }[];
  }, []);

  const top5 = CITIES.slice(0, 5);
  const news = lang === "en" ? NEWS_EN : NEWS_TH;

  const peerGroups = [
    {
      key: "transit",
      en: "Cities betting on rail",
      th: "เมืองที่เดิมพันด้วยระบบราง",
      body_en: "Public transit projects worth treating as real — funded, breaking ground.",
      body_th: "งบประมาณเมืองอัจฉริยะของไทยส่วนใหญ่ลงไปกับระบบราง — การลงทุนที่เปลี่ยนแปลงเมืองได้จริง ในที่ที่ขุดดิน",
      ids: ["khonkaen", "phuket", "korat", "cmoldtown", "petchburi-iot"],
    },
    {
      key: "air",
      en: "Cities with air worth breathing",
      th: "เมืองที่อากาศสะอาดจริง",
      body_en: "Cleanest air in the index. Most are not Bangkok.",
      body_th: "อากาศสะอาดที่สุดในดัชนี ส่วนใหญ่ไม่ใช่กรุงเทพฯ",
      ids: ["yala", "nstham", "chiangrai", "ubon", "nan"],
    },
    {
      key: "wealth",
      en: "Cities where money lands",
      th: "เมืองที่เม็ดเงินไหลเข้า",
      body_en: "GPP per capita matters. Whether residents see it is another question.",
      body_th: "GPP ต่อหัวสูง แต่ประชาชนได้รับเท่าไรเป็นคนละเรื่อง",
      ids: ["rayong", "saimburi", "wangchan", "laemchabang"],
    },
  ];

  return (
    <div className="page-home">
      {/* HERO */}
      <section className="hero">
        <div className="hero__layout">
          <div>
            <div className="hero__eyebrow eyebrow">
              <span style={{ width: 22, height: 1, background: "currentColor", display: "inline-block" }}></span>
              {t.home_eyebrow}
            </div>
            <h1 className="hero__h serif">
              {t.home_h.split("\n").map((line, i) => (
                <span key={i} style={{ display: "block" }}>
                  {i === 1 ? <em>{line}</em> : line}
                </span>
              ))}
            </h1>
            <p className="hero__lede">{t.home_lede}</p>
            <div className="row gap-8 mt-24 wrap">
              <button className="btn btn--terra" onClick={() => navigate("rankings")}>
                {lang === "en" ? "See full rankings" : "ดูอันดับทั้งหมด"} <Icon name="arrow" size={16} />
              </button>
              <button className="btn btn--ghost" onClick={() => navigate("methodology")}>
                {lang === "en" ? "Read methodology" : "อ่านระเบียบวิธี"}
              </button>
            </div>
            <div className="row gap-8 mt-16 wrap">
              {t.hero_chips.map((c, i) => <span key={i} className="pill pill--ghost">{c}</span>)}
            </div>
          </div>

          {/* rank-1 plate */}
          <div style={{ position: "relative" }}>
            <div className="imgcard" style={{ aspectRatio: "4/5" }}>
              <div className="imgcard__media"><img src={cityImg("phuket")} alt="" /></div>
              <div className="imgcard__score">72.8</div>
              <div className="imgcard__body">
                <div className="imgcard__rank">#01 · {lang === "en" ? "OVERALL" : "อันดับรวม"}</div>
                <div className="imgcard__name serif">{cityName(CITIES[0], lang)}</div>
                <div style={{ opacity: 0.85, fontSize: 13 }}>{cityTagline(CITIES[0], lang)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="hero__stats">
          {t.stats.map((s, i) => (
            <div key={i} className="hero__stat">
              <div className="v serif">{s.v}</div>
              <div className="l">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pillar leaders */}
      <section className="section">
        <div className="section__head">
          <div>
            <ThaiRule>{t.leaders_label}</ThaiRule>
            <h2 className="section__title serif mt-12">{t.leaders_h}</h2>
          </div>
        </div>
        <div className="leaders">
          {pillarLeaders.map(({ pillar, city, score }) => (
            <button key={pillar.id} className="leadercard" onClick={() => navigate("city/" + city.id)}>
              <div>
                <div className="leadercard__pillar">
                  <span className="dot" style={{ background: PILLAR_COLOR[pillar.id] }}></span>
                  {pillar[lang]}
                </div>
                <div className="leadercard__name serif">{cityName(city, lang)}</div>
              </div>
              <div className="leadercard__score serif">{score}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Regional leaders */}
      <section className="section">
        <div className="section__head">
          <div>
            <ThaiRule>{t.region_label}</ThaiRule>
            <h2 className="section__title serif mt-12">{t.region_h}</h2>
          </div>
        </div>
        <div className="three-col">
          {regionLeaders.map(({ region, city }) => (
            <button key={region.id} className="leadercard" onClick={() => navigate("city/" + city.id)}>
              <div>
                <div className="leadercard__pillar">{region[lang]}</div>
                <div className="leadercard__name serif">{cityName(city, lang)}</div>
                <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{cityProvince(city, lang)}</div>
              </div>
              <div className="leadercard__score serif">{city.score.toFixed(1)}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured top 5 */}
      <section className="section">
        <div className="section__head">
          <div>
            <ThaiRule>{t.featured_label}</ThaiRule>
            <h2 className="section__title serif mt-12">{t.featured_h}</h2>
          </div>
        </div>
        <div className="featured-grid">
          {top5.map((c) => (
            <button
              key={c.id}
              className="imgcard"
              onClick={() => navigate("city/" + c.id)}
              style={{ all: "unset", cursor: "pointer", display: "block" }}
            >
              <div className="imgcard">
                <div className="imgcard__media"><img src={cityImg(c.id)} alt="" /></div>
                <div className="imgcard__score">{c.score.toFixed(1)}</div>
                <div className="imgcard__body">
                  <div className="imgcard__rank">{String(c.rank).padStart(2, "0")}</div>
                  <div className="imgcard__name serif">{cityName(c, lang)}</div>
                  <div style={{ opacity: 0.85, fontSize: 12 }}>
                    {((lang === "en" ? c.highlights_en : (c.highlights_th ?? c.highlights_en)) ?? []).slice(0, 2).join(" · ")}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Peer groups */}
      <section className="section">
        <div className="section__head">
          <div>
            <ThaiRule>{t.grouped_label}</ThaiRule>
            <h2 className="section__title serif mt-12">{t.grouped_h}</h2>
          </div>
        </div>
        <div className="three-col">
          {peerGroups.map(group => (
            <div key={group.key} className="card" style={{ padding: 16 }}>
              <div className="eyebrow" style={{ color: "var(--terra)" }}>{group[lang === "en" ? "en" : "th"]}</div>
              <div className="serif" style={{ fontWeight: 700, fontSize: 17, marginTop: 6, lineHeight: 1.2 }}>
                {group[lang === "en" ? "en" : "th"]}
              </div>
              <p className="muted" style={{ fontSize: 13, marginTop: 8, lineHeight: 1.5 }}>
                {group[lang === "en" ? "body_en" : "body_th"]}
              </p>
              <div className="ranklist mt-12">
                {group.ids.map(id => {
                  const c = CITIES.find(x => x.id === id);
                  if (!c) return null;
                  return (
                    <div
                      key={id}
                      className="rankrow"
                      onClick={() => navigate("city/" + id)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="rankrow__rank serif">{String(c.rank).padStart(2, "0")}</div>
                      <div>
                        <div className="rankrow__name serif">{cityName(c, lang)}</div>
                        <div className="rankrow__sub muted">{cityProvince(c, lang)}</div>
                      </div>
                      <div className="rankrow__score serif">{c.score.toFixed(1)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* News */}
      <section className="section">
        <div className="section__head">
          <div>
            <ThaiRule>{t.updates_label}</ThaiRule>
            <h2 className="section__title serif mt-12">{t.updates_h}</h2>
          </div>
        </div>
        <div className="news">
          {news.map((n, i) => (
            <article key={i} className="newsitem">
              <div className="newsitem__date">{n.date}</div>
              <div className="newsitem__city serif">{n.city}</div>
              <div className="newsitem__body">{n.body}</div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="cta">
        <ThaiRule>{lang === "en" ? "MISSING?" : "ตกหล่น?"}</ThaiRule>
        <h3 className="cta__h serif mt-12">{t.cta_h}</h3>
        <p className="cta__p">{t.cta_p}</p>
        <div className="cta__row">
          <button className="btn btn--terra">{t.cta_button}</button>
          <button className="btn btn--ghost" onClick={() => navigate("methodology")}>{t.cta_button2}</button>
        </div>
      </div>

      <Footer lang={lang} t={t} navigate={navigate} />
    </div>
  );
};

export default HomePage;
