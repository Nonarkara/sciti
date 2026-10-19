import { useEffect, useState, type MouseEvent } from "react";
import { legacyTarget } from "./lib/legacy.mjs";
import { LENSES, lensById, withWeights } from "./lib/lenses.mjs";
import { scoreLens } from "./lib/rank.mjs";
import redirects from "./data/redirects.json";
import { Home } from "./home";
import { AboutScreen, CompareScreen, CoverageScreen, IndicatorScreen, MethodsScreen, Missing, PlaceScreen, ReadingShell } from "./screens";
import { t } from "./text";
import type { Baseline, GeoFile, Lang, Lens, ScoreCard } from "./types";

const redirectTable = redirects as Record<string, string>;

function basePath(): string {
  return import.meta.env.BASE_URL.replace(/\/$/, "");
}

function barePath(pathname: string): string {
  const base = basePath();
  let path = pathname;
  if (base && path.startsWith(base)) path = path.slice(base.length) || "/";
  if (!path.startsWith("/")) path = `/${path}`;
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

function toHref(path: string, params: URLSearchParams): string {
  const q = params.toString();
  const bare = path.startsWith("/") ? path : `/${path}`;
  return `${basePath()}${bare}${q ? `?${q}` : ""}`;
}

function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}

function readLang(params: URLSearchParams): Lang {
  const query = params.get("lang");
  if (query === "en" || query === "th" || query === "zh") return query;
  try {
    const stored = localStorage.getItem("sciti-lang");
    if (stored === "en" || stored === "th" || stored === "zh") return stored;
  } catch {
    /* ignore */
  }
  return "en";
}

function readLens(params: URLSearchParams): string {
  const query = params.get("lens");
  return LENSES.some((lens) => lens.id === query) ? String(query) : "growth";
}

function readWeightStore(): Record<string, Record<string, number>> {
  try {
    const raw = localStorage.getItem("sciti-weights-v2");
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, Record<string, number>>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function paramsFor(lang: Lang, lensId: string): URLSearchParams {
  const params = new URLSearchParams();
  if (lang !== "en") params.set("lang", lang);
  if (lensId !== "growth") params.set("lens", lensId);
  return params;
}

export default function App() {
  const [loc, setLoc] = useState(() => window.location.pathname + window.location.search);
  const [baseline, setBaseline] = useState<Baseline | null>(null);
  const [geo, setGeo] = useState<GeoFile | null>(null);
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState("");
  const [weights, setWeights] = useState(readWeightStore);

  const search = new URLSearchParams(loc.split("?")[1] || "");
  const rawPath = barePath(loc.split("?")[0] || "/");
  const path = rawPath.startsWith("/city/") && !baseline ? rawPath : legacyTarget(rawPath, baseline?.places || [], redirectTable) || rawPath;
  const lang = readLang(search);
  const lensId = readLens(search);
  const lens = withWeights(lensById(lensId), weights[lensId]) as Lens;

  useEffect(() => {
    const onPop = () => setLoc(window.location.pathname + window.location.search);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    let gone = false;
    Promise.all([fetch(asset("data/baseline.json")), fetch(asset("geo/provinces.json"))])
      .then(async ([dataRes, geoRes]) => {
        if (!dataRes.ok || !geoRes.ok) throw new Error("missing file");
        const data = (await dataRes.json()) as Baseline;
        const drawn = (await geoRes.json()) as GeoFile;
        if (!gone) {
          setBaseline(data);
          setGeo(drawn);
        }
      })
      .catch(() => {
        if (!gone) setError(true);
      });
    return () => {
      gone = true;
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = lang === "th" ? "sciti เมืองไหน" : lang === "zh" ? "sciti 哪些城市" : "sciti Which cities";
  }, [lang]);

  useEffect(() => {
    if (path === rawPath) return;
    const next = toHref(path, paramsFor(lang, lensId));
    if (window.location.pathname + window.location.search !== next) window.history.replaceState(null, "", next);
  }, [path, rawPath, lang, lensId]);

  const scored: ScoreCard | null = baseline
    ? (scoreLens({
        placeIds: baseline.places.map((place) => place.id),
        observations: baseline.observations,
        components: lens.components,
        rankGate: lens.rankGate,
      }) as ScoreCard)
    : null;

  function go(next: string) {
    window.history.pushState(null, "", next);
    setLoc(window.location.pathname + window.location.search);
    window.scrollTo(0, 0);
  }

  function hrefFor(target: string): string {
    return toHref(target, paramsFor(lang, lensId));
  }

  function setLang(next: Lang) {
    try {
      localStorage.setItem("sciti-lang", next);
    } catch {
      /* ignore */
    }
    go(toHref(path, paramsFor(next, lensId)));
  }

  function setLens(next: string) {
    go(toHref(path === "/" ? "/" : path, paramsFor(lang, next)));
  }

  function setWeight(id: string, value: number) {
    const clamped = Math.max(0, Math.min(100, Math.round(value)));
    setWeights((prev) => {
      const next = { ...prev, [lensId]: { ...prev[lensId], [id]: clamped } };
      try {
        localStorage.setItem("sciti-weights-v2", JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  function resetWeights() {
    setWeights((prev) => {
      const next = { ...prev };
      delete next[lensId];
      try {
        localStorage.setItem("sciti-weights-v2", JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  function onClick(event: MouseEvent) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const anchor = (event.target as HTMLElement).closest("a");
    if (!anchor) return;
    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("http") || href.startsWith("mailto:")) return;
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return;
    const bare = barePath(url.pathname);
    if (bare.startsWith("/data/") || bare.startsWith("/geo/") || bare.startsWith("/fonts/")) return;
    event.preventDefault();
    go(url.pathname + url.search + url.hash);
  }

  const section = path.startsWith("/compare")
    ? "/compare"
    : path.startsWith("/coverage")
      ? "/coverage"
      : path.startsWith("/methods")
        ? "/methods"
        : path.startsWith("/about")
          ? "/about"
          : "/";

  let body: React.ReactNode;
  if (error || (baseline && !scored)) body = <ReadingShell lang={lang} message="failed" />;
  else if (!baseline || !scored) body = <ReadingShell lang={lang} message="reading" />;
  else if (path === "/") {
    body = (
      <Home
        lang={lang}
        baseline={baseline}
        geo={geo}
        lens={lens}
        scored={scored}
        selected={selected}
        setSelected={setSelected}
        setLens={setLens}
        setWeight={setWeight}
        resetWeights={resetWeights}
        hrefFor={hrefFor}
        asset={asset}
      />
    );
  } else if (path.startsWith("/place/")) {
    const placeId = path.slice("/place/".length);
    body = (
      <PlaceScreen
        baseline={baseline}
        lang={lang}
        lens={lens}
        row={scored.rows.find((row) => row.placeId === placeId)}
        placeId={placeId}
        hrefFor={hrefFor}
      />
    );
  } else if (path === "/compare") {
    const first = baseline.places[0]?.id || "";
    const second = baseline.places.find((place) => place.id === "th-80")?.id || baseline.places[1]?.id || first;
    body = <CompareScreen baseline={baseline} lang={lang} hrefFor={hrefFor} initialA={search.get("a") || selected || first} initialB={search.get("b") || second} />;
  } else if (path === "/coverage") body = <CoverageScreen baseline={baseline} geo={geo} lang={lang} hrefFor={hrefFor} />;
  else if (path === "/methods") body = <MethodsScreen baseline={baseline} lang={lang} lensId="" hrefFor={hrefFor} />;
  else if (path.startsWith("/methods/")) body = <MethodsScreen baseline={baseline} lang={lang} lensId={path.slice("/methods/".length)} hrefFor={hrefFor} />;
  else if (path.startsWith("/indicator/")) body = <IndicatorScreen baseline={baseline} lang={lang} indicatorId={path.slice("/indicator/".length)} hrefFor={hrefFor} />;
  else if (path === "/about") body = <AboutScreen baseline={baseline} lang={lang} asset={asset} />;
  else body = <Missing lang={lang} hrefFor={hrefFor} />;

  const links = [
    ["/", t(lang, "cities")],
    ["/compare", t(lang, "compare")],
    ["/coverage", t(lang, "coverage")],
    ["/methods", t(lang, "methods")],
    ["/about", t(lang, "about")],
  ] as const;

  return (
    <div onClick={onClick}>
      <a className="skip" href={path === "/" ? "#map" : "#main"}>
        {t(lang, "skip")}
      </a>
      <header className="bar">
        <a className="word" href={hrefFor("/")}>
          sciti
        </a>
        <nav className="nav-wide" aria-label={t(lang, "menu")}>
          {links.map(([href, label]) => (
            <a key={href} href={hrefFor(href)} aria-current={section === href ? "page" : undefined}>
              {label}
            </a>
          ))}
        </nav>
        <select
          className="nav-narrow"
          aria-label={t(lang, "menu")}
          value={section}
          onChange={(event) => go(hrefFor(event.target.value))}
        >
          {links.map(([href, label]) => (
            <option key={href} value={href}>
              {label}
            </option>
          ))}
        </select>
        <span className="spacer" />
        <span className="langs">
          {(["en", "th", "zh"] as const).map((code) => (
            <button key={code} type="button" aria-pressed={lang === code} onClick={() => setLang(code)}>
              {code === "en" ? "EN" : code === "th" ? "TH" : "ZH"}
            </button>
          ))}
        </span>
      </header>
      <main id="main">{body}</main>
    </div>
  );
}
