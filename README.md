# LeadRank — Lead Prioritization & Data-Quality Dashboard

A focused enhancement to the [SaaSquatch Leads](https://www.saasquatchleads.com/) workflow,
built for the Caprae Capital AI-Readiness Challenge.

SaaSquatch is excellent at **finding** leads. LeadRank answers the next question a
salesperson actually has: **"Which of these should I call first, and which are junk?"**

It takes a raw lead list and:

1. **Deduplicates** companies (never call the same account twice)
2. **Validates every email** with a live DNS/MX check — free, no paid API
3. **Scores each lead 0–100** against a tunable Ideal Customer Profile (ICP)
4. **Ranks** them Hot / Warm / Cold and explains *why* each got its score
5. **Exports** the cleaned, prioritized list to CSV for any CRM

## Why this feature

The challenge rewards tools that "prioritize high-impact leads, minimize irrelevant
data, and integrate into existing sales workflows," with bonus points for
**deduplication, enrichment, and validation**. Rather than scrape *more* data,
LeadRank makes an existing list *actionable* — the highest-leverage 5-hour improvement
for a sales team already drowning in raw leads.

## Tech stack

| Layer            | Technology                          |
|------------------|-------------------------------------|
| Frontend         | Vite + React + TypeScript           |
| Backend          | Node + Express                      |
| Email validation | Node `dns.resolveMx` (no paid API)  |
| Caching          | In-memory TTL cache for MX lookups  |
| Data (demo)      | JSON mock dataset                   |
| Suggested hosting| Frontend: Vercel/Netlify · Backend: Render · DB: Supabase (Postgres) |

## Architecture

```
frontend (React)  ──POST /api/score──►  backend (Express)
                                          │
                          ┌───────────────┼────────────────┐
                          ▼               ▼                ▼
                       dedupe.js    emailValidator.js   leadScorer.js
                     (unique cos)   (MX check + cache)  (0–100 + reasons)
                                          │
                                   sort by score ► JSON { stats, leads }
```

The scoring is **transparent**: every lead returns the list of reasons behind its
score, so a rep can trust it instead of guessing at a black-box number.

### Scoring weights (total 100)

| Signal            | Points |
|-------------------|--------|
| Industry match    | 25     |
| Company size fit  | 20     |
| Location match    | 15     |
| Tech-stack signal | 15     |
| Contactability    | 15 (valid email 10 + phone 5) |
| Revenue fit       | 10     |

Tiers: **Hot ≥ 70**, **Warm 40–69**, **Cold < 40**.

## Run it locally

You need Node 18+ installed.

### 1. Backend
```bash
cd backend
npm install
npm start          # runs on http://localhost:3001
```

### 2. Frontend (in a second terminal)
```bash
cd frontend
npm install
cp .env.example .env     # VITE_API_URL defaults to http://localhost:3001
npm run dev              # opens http://localhost:5173
```

Open the app, click **Load sample leads**, and you'll see the raw list turned into a
ranked call list. Or click **Import CSV** to score your own file (columns:
`companyName, domain, industry, employees, country, techStack, email, phone, revenue`).

## API

| Method | Route          | Body                     | Returns                     |
|--------|----------------|--------------------------|-----------------------------|
| GET    | `/api/health`  | —                        | `{ ok, uptime }`            |
| GET    | `/api/sample`  | —                        | `{ leads }` (raw)           |
| POST   | `/api/score`   | `{ leads, icp? }`        | `{ stats, leads, icp }`     |

## Deploy notes

- **Backend → Render:** new Web Service, root `backend/`, build `npm install`, start `npm start`.
- **Frontend → Vercel/Netlify:** root `frontend/`, build `npm run build`, output `dist/`.
  Set `VITE_API_URL` to your Render backend URL before building.
- To make it production-grade, swap the JSON dataset for **Supabase (Postgres)** and
  persist scored runs.

## Ethical data note

The demo uses mock data. A production version would honor each source's Terms of
Service and rate limits, respect robots.txt, and store only business-contact data —
prioritizing responsible enrichment over volume.

## What I'd build next (with more than 5 hours)

- Persist ICPs and scored runs per user in Postgres
- Real enrichment connectors (pull firmographics live, not from a static file)
- One-click push of Hot leads into a CRM (HubSpot/Salesforce)
- A "why now" intent signal (recent funding, hiring, tech changes)
