import { useMemo, useRef, useState } from "react";
import Papa from "papaparse";
import type { RawLead, ScoreResponse, ScoredLead, Tier, Icp } from "./types";
import { fetchSample, scoreLeads } from "./api";
import { StatsStrip } from "./components/StatsStrip";
import { IcpPanel } from "./components/IcpPanel";
import { FilterBar } from "./components/FilterBar";
import { LeadTable } from "./components/LeadTable";
import { ThemeToggle } from "./components/ThemeToggle";
import {
  Target, Upload, AlertTriangle, XCircle, Dedupe, ShieldCheck, Layers, Inbox
} from "./components/Icons";

type FilterTier = Tier | "All";

const FEATURES = [
  { Icon: Dedupe, h: "Deduplicated", p: "One row per company, so nobody gets called twice." },
  { Icon: ShieldCheck, h: "Email verified", p: "Live DNS/MX check on every address — no paid API." },
  { Icon: Target, h: "Scored 0–100", p: "Ranked against a tunable ideal customer profile." },
  { Icon: Layers, h: "CRM ready", p: "Export the cleaned, prioritized list straight to CSV." }
];

export default function App() {
  const [raw, setRaw] = useState<RawLead[]>([]);
  const [result, setResult] = useState<ScoreResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tier, setTier] = useState<FilterTier>("All");
  const [query, setQuery] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function run(leads: RawLead[], icp?: Partial<Icp>) {
    setLoading(true); setError("");
    try {
      const res = await scoreLeads(leads, icp);
      setRaw(leads);
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function loadSample() {
    setLoading(true); setError("");
    try {
      const leads = await fetchSample();
      await run(leads);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't reach the backend.");
      setLoading(false);
    }
  }

  function importCsv(file: File) {
    Papa.parse(file, {
      header: true, skipEmptyLines: true,
      complete: (res) => {
        const leads: RawLead[] = (res.data as any[]).map((r, i) => ({
          id: r.id || i + 1,
          companyName: r.companyName || r.company || r.name || "Unknown",
          domain: r.domain || r.website || "",
          industry: r.industry || "",
          employees: Number(r.employees || r.size || 0),
          country: r.country || r.location || "",
          techStack: (r.techStack || r.tech || "").split(/[|;,]/).map((t: string) => t.trim()).filter(Boolean),
          email: r.email || "",
          phone: r.phone || "",
          revenue: Number(r.revenue || 0)
        }));
        run(leads);
      },
      error: () => setError("Couldn't read that CSV. Check the format and try again.")
    });
  }

  const filtered = useMemo(() => {
    if (!result) return [] as ScoredLead[];
    const q = query.trim().toLowerCase();
    return result.leads.filter(l => {
      const tierOk = tier === "All" || l.tier === tier;
      const qOk = !q || [l.companyName, l.industry, l.country, l.domain]
        .some(v => (v || "").toLowerCase().includes(q));
      return tierOk && qOk;
    });
  }, [result, tier, query]);

  // Tier counts respect the search box, so the chips never promise rows the filter won't show.
  const counts = useMemo(() => {
    const base: Record<FilterTier, number> = { All: 0, Hot: 0, Warm: 0, Cold: 0 };
    if (!result) return base;
    const q = query.trim().toLowerCase();
    for (const l of result.leads) {
      const qOk = !q || [l.companyName, l.industry, l.country, l.domain]
        .some(v => (v || "").toLowerCase().includes(q));
      if (!qOk) continue;
      base.All++; base[l.tier]++;
    }
    return base;
  }, [result, query]);

  function exportCsv() {
    const rows = filtered.map(l => ({
      score: l.score, tier: l.tier, company: l.companyName, domain: l.domain,
      industry: l.industry, employees: l.employees, country: l.country,
      email: l.email, emailStatus: l.emailStatus, phone: l.phone, revenue: l.revenue,
      reasons: l.reasons.join(" | ")
    }));
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `prioritized-leads-${tier.toLowerCase()}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="shell">
      <header className="header">
        <div className="header-in">
          <div className="wordmark">
            <span className="logo"><Target size={17} /></span>
            <span className="names">
              <span className="name">LeadRank</span>
              <span className="tag">Prioritize your call list</span>
            </span>
          </div>
          <div className="header-actions">
            <input ref={fileRef} type="file" accept=".csv" hidden
              onChange={e => {
                const f = e.target.files?.[0];
                if (f) importCsv(f);
                e.target.value = ""; // let the same file be re-imported
              }} />
            <ThemeToggle />
            <button className="btn" onClick={() => fileRef.current?.click()}>
              <Upload size={15} />
              <span className="btn-label">Import CSV</span>
            </button>
            <button className="btn primary keep-label" onClick={loadSample} disabled={loading}>
              <span className="btn-label">{loading ? "Scoring…" : "Load sample leads"}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container">
        {error && (
          <div className="banner error" role="alert">
            <XCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {!result && (
          <div className="hero">
            <span className="eyebrow"><Inbox size={14} /> Built for the SaaSquatch workflow</span>
            <h2>Turn a raw lead list into a <span className="grad">ranked call list</span></h2>
            <p>
              LeadRank removes duplicates, verifies every email against live DNS, and scores
              each lead against your ideal customer — so your reps call the right people first.
            </p>
            <div className="hero-cta">
              <button className="btn primary keep-label" onClick={loadSample} disabled={loading}>
                <Target size={16} />
                <span className="btn-label">{loading ? "Scoring…" : "Load sample leads"}</span>
              </button>
              <button className="btn keep-label" onClick={() => fileRef.current?.click()}>
                <Upload size={16} />
                <span className="btn-label">Import your CSV</span>
              </button>
            </div>

            <div className="features">
              {FEATURES.map(({ Icon, h, p }) => (
                <div className="feature" key={h}>
                  <span className="ic"><Icon size={16} /></span>
                  <h3>{h}</h3>
                  <p>{p}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {result && (
          <>
            <StatsStrip stats={result.stats} />

            {result.stats.invalidEmails > 0 && (
              <div className="banner warn">
                <AlertTriangle size={16} />
                <span>
                  <b>{result.stats.invalidEmails} lead{result.stats.invalidEmails === 1 ? "" : "s"}</b>{" "}
                  have an unusable email address. They are ranked lower and flagged, so you
                  don't burn a send on a hard bounce.
                </span>
              </div>
            )}

            <IcpPanel icp={result.icp} busy={loading} onApply={(icp) => run(raw, icp)} />

            <FilterBar
              active={tier} onTier={setTier}
              query={query} onQuery={setQuery}
              onExport={exportCsv} count={filtered.length} counts={counts}
            />

            <LeadTable leads={filtered} />
          </>
        )}
      </div>

      <footer className="foot">
        {result
          ? <>Showing {filtered.length} of {result.stats.afterDedup} scored leads<span className="sep">·</span></>
          : null}
        Sample data only — a live version would honor each source's terms of service and rate limits.
      </footer>
    </div>
  );
}
