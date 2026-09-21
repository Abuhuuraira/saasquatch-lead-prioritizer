import type { Stats } from "../types";
import { Layers, Dedupe, Target, ShieldCheck } from "./Icons";

const pct = (n: number, total: number) => (total ? Math.round((n / total) * 100) : 0);

export function StatsStrip({ stats }: { stats: Stats }) {
  const t = stats.afterDedup || 1;
  const segments = [
    { key: "hot",  label: "Hot",  n: stats.hot,  cls: "s-hot" },
    { key: "warm", label: "Warm", n: stats.warm, cls: "s-warm" },
    { key: "cold", label: "Cold", n: stats.cold, cls: "s-cold" }
  ];

  return (
    <>
      <div className="stats">
        <div className="stat">
          <div className="l"><Layers size={13} /> Leads scored</div>
          <div className="v">{stats.afterDedup}</div>
          <div className="d">from <b>{stats.total}</b> imported rows</div>
        </div>

        <div className="stat">
          <div className="l"><Dedupe size={13} /> Duplicates removed</div>
          <div className="v">{stats.duplicatesRemoved}</div>
          <div className="d">
            {stats.duplicatesRemoved > 0
              ? <>saved <b>{stats.duplicatesRemoved}</b> wasted calls</>
              : <>no repeat accounts found</>}
          </div>
        </div>

        <div className="stat">
          <div className="l"><Target size={13} /> Average score</div>
          <div className="v">{stats.avgScore}</div>
          <div className="d">out of <b>100</b> against your ICP</div>
        </div>

        <div className="stat">
          <div className="l"><ShieldCheck size={13} /> Unusable emails</div>
          <div className="v">{stats.invalidEmails}</div>
          <div className="d">
            <b>{stats.afterDedup - stats.invalidEmails}</b> contactable by email
          </div>
        </div>
      </div>

      {/* Pipeline mix — a stacked bar, legend always present, every segment labelled. */}
      <div className="card section" style={{ padding: "15px 18px" }}>
        <div className="mix">
          <div className="mix-bar" role="img"
               aria-label={segments.map(s => `${s.label} ${s.n}`).join(", ")}>
            {segments.filter(s => s.n > 0).map(s => (
              <span key={s.key} className={s.cls} style={{ flexGrow: s.n }}
                    title={`${s.label}: ${s.n} leads (${pct(s.n, t)}%)`} />
            ))}
          </div>
          <div className="legend">
            {segments.map(s => (
              <span key={s.key} className="legend-item">
                <span className="dot" style={{ background: `var(--${s.key})` }} />
                {s.label} <b>{s.n}</b> <span className="pct">({pct(s.n, t)}%)</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
