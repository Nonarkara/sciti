import React from "react";
import type { I18nDict, Lang } from "./i18n";

// ---- Icon ----------------------------------------------------------------
interface IconProps { name: string; size?: number; }
export const Icon: React.FC<IconProps> = ({ name, size = 20 }) => {
  const map: Record<string, React.ReactNode> = {
    home:     <path d="M3 11l9-8 9 8v9a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2v-9z" />,
    list:     <g><path d="M8 5h13M8 12h13M8 19h13" /><circle cx="4" cy="5" r="1.5" /><circle cx="4" cy="12" r="1.5" /><circle cx="4" cy="19" r="1.5" /></g>,
    map:      <g><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6z" /><path d="M9 4v16M15 6v16" /></g>,
    book:     <path d="M4 4h7a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H4V4zm16 0h-3a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h4V4z" />,
    layers:   <g><path d="M12 3l9 5-9 5-9-5 9-5z" /><path d="M3 13l9 5 9-5M3 18l9 5 9-5" /></g>,
    grid:     <g><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></g>,
    info:     <g><circle cx="12" cy="12" r="9" /><path d="M12 8v.01M11 12h1v5h1" /></g>,
    sun:      <g><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5" /></g>,
    moon:     <path d="M21 13a8 8 0 1 1-9-10 6 6 0 0 0 9 10z" />,
    arrow:    <path d="M5 12h14M13 6l6 6-6 6" />,
    search:   <g><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.5-4.5" /></g>,
    close:    <path d="M6 6l12 12M18 6L6 18" />,
    check:    <path d="M5 12l4 4L19 6" />,
    download: <g><path d="M12 4v12M6 12l6 6 6-6" /><path d="M4 20h16" /></g>,
    flag:     <g><path d="M5 3v18M5 4h13l-2 4 2 4H5" /></g>,
    spark:    <path d="M3 17l5-7 4 5 3-4 6 8" />,
  };
  return (
    <svg className="ico" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {map[name] ?? null}
    </svg>
  );
};

// ---- Ornament ------------------------------------------------------------
export const Ornament: React.FC<{ className?: string }> = ({ className = "ornament" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
    <path d="M12 2c0 4 4 6 4 10s-4 6-4 10c0-4-4-6-4-10s4-6 4-10z" />
    <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
  </svg>
);

// ---- ThaiRule ------------------------------------------------------------
export const ThaiRule: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="thai-rule">
    <Ornament className="ornament" />
    <span>{children}</span>
    <Ornament className="ornament" />
  </div>
);

// ---- TopBar --------------------------------------------------------------
interface TopBarProps {
  lang: Lang;
  setLang: (l: Lang) => void;
  theme: string;
  setTheme: (t: string) => void;
  t: I18nDict;
  onMenu: () => void;
  isDesktop: boolean;
}
export const TopBar: React.FC<TopBarProps> = ({ lang, setLang, theme, setTheme, t, onMenu, isDesktop }) => (
  <header className="topbar">
    <div className="topbar__brand">
      {!isDesktop && (
        <button className="icon-btn" onClick={onMenu} aria-label="menu">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      )}
      <div className="topbar__brand-mark serif">ส</div>
      <div className="topbar__title serif">
        {t.brand_a}<span style={{ display: "inline-block", width: 6 }}></span>{t.brand_b}
        <small>{t.edition}</small>
      </div>
    </div>
    <div className="row gap-8">
      <div className="tb-toggle" role="tablist" aria-label="language">
        <button className={lang === "en" ? "is-active" : ""} onClick={() => setLang("en")}>EN</button>
        <button className={lang === "th" ? "is-active" : ""} onClick={() => setLang("th")}>ไทย</button>
      </div>
      <button className="icon-btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="theme">
        <Icon name={theme === "dark" ? "sun" : "moon"} size={18} />
      </button>
    </div>
  </header>
);

// ---- PILLAR_COLOR --------------------------------------------------------
export const PILLAR_COLOR: Record<string, string> = {
  livability:  "#2C5777",
  economy:     "#B5872A",
  safety:      "#6F4A2B",
  wellbeing:   "#2F5D4F",
  environment: "#5C8A3A",
  civic:       "#8E2F1A",
  digital:     "#3F4A8C",
};

// ---- cityImg -------------------------------------------------------------
const CITY_IMG: Record<string, string> = {
  phuket:     "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=1200&q=70",
  saimburi:   "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=70",
  khonkaen:   "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=1200&q=70",
  cmu:        "https://images.unsplash.com/photo-1528181304800-259b08848526?w=1200&q=70",
  bangsaen:   "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&q=70",
  rayong:     "https://images.unsplash.com/photo-1473042904451-00171c69419d?w=1200&q=70",
  korat:      "https://images.unsplash.com/photo-1528181304800-259b08848526?w=1200&q=70",
  cmoldtown:  "https://images.unsplash.com/photo-1528181304800-259b08848526?w=1200&q=70",
  yala:       "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=70",
  nstham:     "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&q=70",
  chiangrai:  "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=1200&q=70",
  ubon:       "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=70",
  nan:        "https://images.unsplash.com/photo-1528181304800-259b08848526?w=1200&q=70",
  nonthaburi: "https://images.unsplash.com/photo-1545569310-49eb1a01ae26?w=1200&q=70",
  laemchabang:"https://images.unsplash.com/photo-1473042904451-00171c69419d?w=1200&q=70",
};

export const cityImg = (id: string): string =>
  CITY_IMG[id] ?? "https://images.unsplash.com/photo-1528181304800-259b08848526?w=1200&q=70";

// ---- scoreClass ----------------------------------------------------------
export const scoreClass = (s: number): string => s >= 70 ? "good" : s >= 60 ? "warn" : "bad";
