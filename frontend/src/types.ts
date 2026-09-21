export type Tier = "Hot" | "Warm" | "Cold";
export type EmailStatus = "valid" | "risky" | "invalid";

export interface RawLead {
  id?: number | string;
  companyName: string;
  domain?: string | null;
  industry?: string;
  employees?: number;
  country?: string;
  techStack?: string[];
  email?: string;
  phone?: string | null;
  revenue?: number;
}

export interface ScoredLead extends RawLead {
  score: number;
  tier: Tier;
  reasons: string[];
  misses: string[];
  emailStatus: EmailStatus;
}

export interface Stats {
  total: number;
  afterDedup: number;
  duplicatesRemoved: number;
  hot: number;
  warm: number;
  cold: number;
  invalidEmails: number;
  avgScore: number;
}

export interface Icp {
  industries: string[];
  minEmployees: number;
  maxEmployees: number;
  locations: string[];
  techSignals: string[];
  minRevenue: number;
  maxRevenue: number;
}

export interface ScoreResponse {
  stats: Stats;
  leads: ScoredLead[];
  icp: Icp;
}
