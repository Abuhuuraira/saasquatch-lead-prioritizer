import type { Tier } from "../types";
import { Search, Download, Flame, HalfSun, Snowflake, Layers } from "./Icons";

type FilterTier = Tier | "All";

const ICON: Record<FilterTier, (p: { size?: number }) => JSX.Element> = {
  All: Layers, Hot: Flame, Warm: HalfSun, Cold: Snowflake
};

export function FilterBar({
  active, onTier, query, onQuery, onExport, count, counts
}: {
  active: FilterTier;
  onTier: (t: FilterTier) => void;
  query: string;
  onQuery: (q: string) => void;
  onExport: () => void;
  count: number;
  counts: Record<FilterTier, number>;
}) {
  const tiers: FilterTier[] = ["All", "Hot", "Warm", "Cold"];
  return (
    <div className="toolbar">
      <div className="segmented" role="group" aria-label="Filter by tier">
        {tiers.map(t => {
          const Icon = ICON[t];
          return (
            <button key={t} className={`seg t-${t.toLowerCase()}`} aria-pressed={active === t}
              onClick={() => onTier(t)}>
              <Icon size={13} />
              {t}
              <span className="n">{counts[t]}</span>
            </button>
          );
        })}
      </div>

      <div className="search-wrap">
        <Search size={15} />
        <input className="input" type="search" value={query}
          placeholder="Search company, industry, or location"
          aria-label="Search leads"
          onChange={e => onQuery(e.target.value)} />
      </div>

      <button className="btn primary keep-label" onClick={onExport} disabled={count === 0}>
        <Download size={15} />
        <span className="btn-label">Export {count}</span>
      </button>
    </div>
  );
}
