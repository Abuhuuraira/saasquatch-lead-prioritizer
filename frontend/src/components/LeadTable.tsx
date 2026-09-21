import { useMemo, useState } from "react";
import type { ScoredLead } from "../types";
import { ScoreMeter } from "./ScoreMeter";
import { TierChip } from "./TierChip";
import { ArrowUpDown, CheckCircle, AlertTriangle, XCircle, Phone, Search } from "./Icons";

const money = (n?: number) =>
  n == null ? "—" : n === 0 ? "$0" : "$" + Intl.NumberFormat("en", { notation: "compact" }).format(n);

const EMAIL_ICON = { valid: CheckCircle, risky: AlertTriangle, invalid: XCircle };

const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase() || "?";

type SortKey = "score" | "companyName" | "employees" | "revenue";
type Dir = "asc" | "desc";

const COLS: { key: SortKey | null; label: string; hide?: boolean; cls?: string }[] = [
  { key: "score", label: "Score" },
  { key: null, label: "Tier" },
  { key: "companyName", label: "Company", cls: "col-company" },
  { key: null, label: "Industry", hide: true },
  { key: "employees", label: "Size", hide: true },
  { key: null, label: "Location", hide: true },
  { key: null, label: "Contact" },
  { key: "revenue", label: "Revenue", hide: true },
  { key: null, label: "Why this score", cls: "col-why" }
];

// Keep rows one or two lines tall: the full reason list lives in the CSV export.
const MAX_REASONS = 3;

export function LeadTable({ leads }: { leads: ScoredLead[] }) {
  const [sort, setSort] = useState<{ key: SortKey; dir: Dir }>({ key: "score", dir: "desc" });

  const rows = useMemo(() => {
    const copy = [...leads];
    copy.sort((a, b) => {
      const av = a[sort.key], bv = b[sort.key];
      let cmp: number;
      if (typeof av === "string" || typeof bv === "string") {
        cmp = String(av ?? "").localeCompare(String(bv ?? ""));
      } else {
        cmp = (Number(av) || 0) - (Number(bv) || 0);
      }
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [leads, sort]);

  function toggle(key: SortKey) {
    setSort(s => s.key === key
      ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
      : { key, dir: key === "companyName" ? "asc" : "desc" });
  }

  if (leads.length === 0) {
    return (
      <div className="table-wrap">
        <div className="no-rows">
          <Search size={22} />
          <div className="big" style={{ marginTop: 10 }}>No leads match this view</div>
          <div>Try another tier, or clear the search.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th className="rank">#</th>
              {COLS.map(c => {
                const isSorted = c.key && sort.key === c.key;
                return (
                  <th key={c.label}
                      className={`${c.hide ? "hide" : ""} ${c.key ? "sortable" : ""} ${c.cls ?? ""}`}
                      aria-sort={isSorted ? (sort.dir === "asc" ? "ascending" : "descending") : undefined}
                      onClick={c.key ? () => toggle(c.key as SortKey) : undefined}>
                    <span className="th-in">
                      {c.label}
                      {c.key && <ArrowUpDown size={12} className="arrow" />}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((l, i) => {
              const EmailIcon = EMAIL_ICON[l.emailStatus] ?? XCircle;
              return (
                <tr key={l.id ?? i}>
                  <td className="rank">{i + 1}</td>
                  <td><ScoreMeter score={l.score} tier={l.tier} /></td>
                  <td><TierChip tier={l.tier} /></td>
                  <td className="col-company">
                    <div className="company">
                      <span className="avatar" aria-hidden>{initials(l.companyName)}</span>
                      <span className="txt">
                        <span className="nm" title={l.companyName}>{l.companyName}</span>
                        {l.domain && <span className="dom" title={l.domain}>{l.domain}</span>}
                      </span>
                    </div>
                  </td>
                  <td className="hide">{l.industry || "—"}</td>
                  <td className="hide tnum">
                    {l.employees ? Intl.NumberFormat("en").format(l.employees) : "—"}
                  </td>
                  <td className="hide">{l.country || "—"}</td>
                  <td>
                    <div className="stack-2">
                      <span className={`email ${l.emailStatus}`} title={l.email || "No email on file"}>
                        <EmailIcon size={14} />
                        <span className="lbl">{l.emailStatus}</span>
                      </span>
                      {l.phone && (
                        <span className="sm"><Phone size={11} /> {l.phone}</span>
                      )}
                    </div>
                  </td>
                  <td className="hide tnum">{money(l.revenue)}</td>
                  <td className="col-why">
                    <div className="reasons">
                      {l.reasons.slice(0, MAX_REASONS).map((r, j) => (
                        <span key={j} className="reason">{r}</span>
                      ))}
                      {l.reasons.length > MAX_REASONS && (
                        <span className="reason more" title={l.reasons.slice(MAX_REASONS).join(" · ")}>
                          +{l.reasons.length - MAX_REASONS} more
                        </span>
                      )}
                      {l.misses.slice(0, 1).map((m, j) => (
                        <span key={"m" + j} className="reason miss">{m}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
