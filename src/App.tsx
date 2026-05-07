import { useState, useMemo, useRef, useEffect } from "react";
import { I18N } from "./i18n";
import type { Lang } from "./i18n";
import { TopBar, Icon } from "./ui";
import HomePage from "./pages/HomePage";
import RankingsPage from "./pages/RankingsPage";
import CityPage from "./pages/CityPage";
import MapPage from "./pages/MapPage";
import MethodologyPage from "./pages/MethodologyPage";
import SourcesPage from "./pages/SourcesPage";
import ComparePage from "./pages/ComparePage";
import BingoPage from "./pages/BingoPage";
import AboutPage from "./pages/AboutPage";

const NAV_ITEMS = [
  { id: "home",        ico: "home" },
  { id: "rankings",    ico: "list" },
  { id: "map",         ico: "map" },
  { id: "compare",     ico: "layers" },
  { id: "methodology", ico: "book" },
  { id: "sources",     ico: "grid" },
  { id: "bingo",       ico: "spark" },
  { id: "about",       ico: "info" },
];

function useIsDesktop() {
  const [desk, setDesk] = useState(typeof window !== "undefined" ? window.innerWidth >= 1024 : false);
  useEffect(() => {
    const fn = () => setDesk(window.innerWidth >= 1024);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return desk;
}

function App() {
  const [route, setRoute] = useState("home");
  const [lang, setLang] = useState<Lang>("en");
  const [theme, setTheme] = useState("light");
  const [menuOpen, setMenuOpen] = useState(false);
  const isDesktop = useIsDesktop();
  const scrollerRef = useRef<HTMLElement>(null);
  const t = I18N[lang];

  const navigate = (r: string) => {
    setRoute(r);
    setMenuOpen(false);
    if (scrollerRef.current) scrollerRef.current.scrollTop = 0;
  };

  const [base, sub] = route.split("/");

  const Page = useMemo(() => {
    if (base === "home")        return <HomePage lang={lang} t={t} navigate={navigate} />;
    if (base === "rankings")    return <RankingsPage lang={lang} t={t} navigate={navigate} />;
    if (base === "city")        return <CityPage id={sub} lang={lang} t={t} navigate={navigate} />;
    if (base === "map")         return <MapPage lang={lang} t={t} navigate={navigate} />;
    if (base === "methodology") return <MethodologyPage lang={lang} t={t} navigate={navigate} />;
    if (base === "sources")     return <SourcesPage lang={lang} t={t} navigate={navigate} />;
    if (base === "compare")     return <ComparePage lang={lang} t={t} navigate={navigate} />;
    if (base === "bingo")       return <BingoPage lang={lang} t={t} navigate={navigate} />;
    if (base === "about")       return <AboutPage lang={lang} t={t} navigate={navigate} />;
    return <HomePage lang={lang} t={t} navigate={navigate} />;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, sub, lang]);

  return (
    <div className="app" data-theme={theme} lang={lang === "th" ? "th" : "en"}>
      <div className="shell">
        <TopBar
          lang={lang} setLang={setLang}
          theme={theme} setTheme={setTheme}
          t={t}
          onMenu={() => setMenuOpen(o => !o)}
          isDesktop={isDesktop}
        />

        {isDesktop && (
          <aside className="sidenav">
            <div className="sidenav__group">{lang === "en" ? "Index" : "ดัชนี"}</div>
            {NAV_ITEMS.slice(0, 4).map(n => (
              <button key={n.id} className={base === n.id ? "is-active" : ""} onClick={() => navigate(n.id)}>
                <Icon name={n.ico} size={18} /> {t.nav[n.id as keyof typeof t.nav]}
              </button>
            ))}
            <div className="sidenav__group">{lang === "en" ? "Process" : "กระบวนการ"}</div>
            {NAV_ITEMS.slice(4, 7).map(n => (
              <button key={n.id} className={base === n.id ? "is-active" : ""} onClick={() => navigate(n.id)}>
                <Icon name={n.ico} size={18} /> {t.nav[n.id as keyof typeof t.nav]}
              </button>
            ))}
            <div className="sidenav__group">{lang === "en" ? "About" : "เกี่ยวกับ"}</div>
            {NAV_ITEMS.slice(7).map(n => (
              <button key={n.id} className={base === n.id ? "is-active" : ""} onClick={() => navigate(n.id)}>
                <Icon name={n.ico} size={18} /> {t.nav[n.id as keyof typeof t.nav]}
              </button>
            ))}
          </aside>
        )}

        <main className="scroll-area" ref={scrollerRef} style={{ overflowY: "auto", minHeight: 0 }}>
          {Page}
        </main>
      </div>

      {/* Mobile bottom nav */}
      {!isDesktop && (
        <nav className="botnav">
          {[
            { id: "home",     ico: "home" },
            { id: "rankings", ico: "list" },
            { id: "map",      ico: "map" },
            { id: "compare",  ico: "layers" },
            { id: "about",    ico: "info" },
          ].map(n => (
            <button key={n.id} className={base === n.id ? "is-active" : ""} onClick={() => navigate(n.id)}>
              <Icon name={n.ico} size={20} />
              {t.nav[n.id as keyof typeof t.nav]}
            </button>
          ))}
        </nav>
      )}

      {/* Mobile slide-out menu */}
      {!isDesktop && menuOpen && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 50 }}
          onClick={() => setMenuOpen(false)}
        >
          <div
            style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "78%", background: "var(--bg)", borderRight: "1px solid var(--rule)", padding: 20, display: "flex", flexDirection: "column", gap: 4, overflowY: "auto" }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: 18, marginBottom: 16 }}>
              {t.brand_a} {t.brand_b}
            </div>
            {NAV_ITEMS.map(n => (
              <button
                key={n.id}
                className={base === n.id ? "is-active" : ""}
                onClick={() => navigate(n.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 14px", borderRadius: 8, border: 0,
                  background: base === n.id ? "var(--ink)" : "transparent",
                  color: base === n.id ? "var(--bg)" : "var(--ink)",
                  textAlign: "left", font: "600 14px var(--sans)", cursor: "pointer",
                }}
              >
                <Icon name={n.ico} size={18} /> {t.nav[n.id as keyof typeof t.nav]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
