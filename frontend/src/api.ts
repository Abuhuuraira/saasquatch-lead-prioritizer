import type { RawLead, ScoreResponse, Icp } from "./types";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function fetchSample(): Promise<RawLead[]> {
  const res = await fetch(`${BASE}/api/sample`);
  if (!res.ok) throw new Error("Couldn't load the sample leads.");
  const data = await res.json();
  return data.leads;
}

export async function scoreLeads(leads: RawLead[], icp?: Partial<Icp>): Promise<ScoreResponse> {
  const res = await fetch(`${BASE}/api/score`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ leads, icp })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Scoring failed. Is the backend running?");
  }
  return res.json();
}
