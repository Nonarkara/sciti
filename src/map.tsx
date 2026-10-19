import { fillFor } from "./fill";
import type { GeoFile, Lang, ScoreRow } from "./types";
import { t } from "./text";

export function ProvinceMap({
  geo,
  rows,
  names,
  selected,
  onSelect,
  lang,
  labelled,
}: {
  geo: GeoFile | null;
  rows: ScoreRow[];
  names: Map<string, string>;
  selected: string;
  onSelect: (id: string) => void;
  lang: Lang;
  labelled: boolean;
}) {
  const byId = new Map(rows.map((row) => [row.placeId, row]));
  const rankedCount = rows.filter((row) => row.rank != null).length;
  return (
    <div id="map">
      {geo ? (
        <svg viewBox={geo.viewBox} role="group" aria-label={t(lang, "mapLabel")} preserveAspectRatio="xMidYMid meet">
          {geo.features.map((feature) => {
            const row = byId.get(feature.id);
            const shade =
              !row || row.rank == null || rankedCount < 1
                ? null
                : rankedCount === 1
                  ? 100
                  : (100 * (rankedCount - row.rank)) / (rankedCount - 1);
            const name = names.get(feature.id) || feature.shapeName;
            return (
              <path
                key={feature.id}
                d={feature.d}
                tabIndex={0}
                role="link"
                aria-label={name}
                aria-current={selected === feature.id ? "true" : undefined}
                fill={fillFor(shade)}
                stroke="#12354e"
                strokeWidth={selected === feature.id ? 2.6 : 0.8}
                strokeDasharray={shade == null ? "3 2" : undefined}
                onClick={() => onSelect(feature.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(feature.id);
                  }
                }}
              />
            );
          })}
        </svg>
      ) : (
        <p>{t(lang, "reading")}</p>
      )}
      {geo && labelled ? <p className="attrib">{geo.attribution}</p> : null}
    </div>
  );
}
