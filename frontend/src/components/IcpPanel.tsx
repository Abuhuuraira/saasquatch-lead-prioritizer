import { useState } from "react";
import type { Icp } from "../types";
import { Sliders, Chevron, Target } from "./Icons";

const list = (arr: string[]) => arr.join(", ");
const parseList = (s: string) => s.split(",").map(x => x.trim()).filter(Boolean);

// Lets the user tune what "a good lead" means, then re-score against it.
export function IcpPanel({
  icp, onApply, busy
}: { icp: Icp; onApply: (icp: Partial<Icp>) => void; busy: boolean }) {
  const [draft, setDraft] = useState<Icp>(icp);
  const dirty = JSON.stringify(draft) !== JSON.stringify(icp);

  return (
    <details className="card panel section">
      <summary>
        <span className="left">
          <Sliders size={15} />
          Ideal Customer Profile
        </span>
        <span className="right">
          <span>{icp.industries.length} industries · {icp.minEmployees}–{icp.maxEmployees} employees</span>
          <Chevron size={16} className="chev" />
        </span>
      </summary>

      <div className="body">
        <div className="field">
          <label htmlFor="icp-ind">Target industries</label>
          <input id="icp-ind" className="input" value={list(draft.industries)}
            placeholder="SaaS, Fintech, E-commerce"
            onChange={e => setDraft({ ...draft, industries: parseList(e.target.value) })} />
        </div>

        <div className="field">
          <label htmlFor="icp-loc">Target locations</label>
          <input id="icp-loc" className="input" value={list(draft.locations)}
            placeholder="United States, Canada"
            onChange={e => setDraft({ ...draft, locations: parseList(e.target.value) })} />
        </div>

        <div className="field">
          <label htmlFor="icp-tech">Tech-stack signals</label>
          <input id="icp-tech" className="input" value={list(draft.techSignals)}
            placeholder="Salesforce, HubSpot, AWS"
            onChange={e => setDraft({ ...draft, techSignals: parseList(e.target.value) })} />
        </div>

        <div className="field">
          <label>Company size (employees)</label>
          <div className="row">
            <input className="input tnum" type="number" min={0} value={draft.minEmployees}
              aria-label="Minimum employees"
              onChange={e => setDraft({ ...draft, minEmployees: +e.target.value })} />
            <span className="sep">to</span>
            <input className="input tnum" type="number" min={0} value={draft.maxEmployees}
              aria-label="Maximum employees"
              onChange={e => setDraft({ ...draft, maxEmployees: +e.target.value })} />
          </div>
        </div>

        <div className="field">
          <label>Annual revenue (USD)</label>
          <div className="row">
            <input className="input tnum" type="number" min={0} step={100000} value={draft.minRevenue}
              aria-label="Minimum revenue"
              onChange={e => setDraft({ ...draft, minRevenue: +e.target.value })} />
            <span className="sep">to</span>
            <input className="input tnum" type="number" min={0} step={100000} value={draft.maxRevenue}
              aria-label="Maximum revenue"
              onChange={e => setDraft({ ...draft, maxRevenue: +e.target.value })} />
          </div>
        </div>

        <div className="actions">
          <button className="btn primary keep-label" disabled={busy}
            onClick={() => onApply(draft)}>
            <Target size={15} />
            <span className="btn-label">{busy ? "Re-scoring…" : "Re-score leads"}</span>
          </button>
          {dirty && (
            <button className="btn ghost keep-label" onClick={() => setDraft(icp)}>
              <span className="btn-label">Reset</span>
            </button>
          )}
          <span className="note">
            {dirty ? "Unsaved changes — re-score to apply." : "Scoring reflects this profile."}
          </span>
        </div>
      </div>
    </details>
  );
}
