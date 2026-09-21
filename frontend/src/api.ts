import type { RawLead, ScoreResponse, Icp } from "./types";

// Where the API lives:
//   - VITE_API_URL wins whenever it is set (point a local build at any backend)
//   - otherwise, in dev, the Express server on port 3001
//   - otherwise, same origin — in production the API is a serverless function
//     served from /api on this very deployment, so no host is needed.
const CONFIGURED = import.meta.env.VITE_API_URL?.trim();
const BASE = CONFIGURED
  ? CONFIGURED.replace(/\/+$/, "")
  : import.meta.env.DEV ? "http://localhost:3001" : "";

async function readError(res: Response, fallback: string): Promise<string> {
  // An error page from the platform is HTML, not JSON — don't let the parse
  // failure mask the real status.
  try {
    const body = await res.json();
    if (body?.error) return body.error as string;
  } catch { /* fall through to the status-based message */ }
  return `${fallback} (HTTP ${res.status})`;
}

export async function fetchSample(): Promise<RawLead[]> {
  const res = await fetch(`${BASE}/api/sample`);
  if (!res.ok) throw new Error(await readError(res, "Couldn't load the sample leads."));
  const data = await res.json();
  return data.leads;
}

export async function scoreLeads(leads: RawLead[], icp?: Partial<Icp>): Promise<ScoreResponse> {
  const res = await fetch(`${BASE}/api/score`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ leads, icp })
  });
  if (!res.ok) throw new Error(await readError(res, "Scoring failed. Is the backend running?"));
  return res.json();
}
