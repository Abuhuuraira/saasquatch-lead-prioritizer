// app.js — the API, as an Express app with no server attached.
// Two entry points use it:
//   backend/server.js  -> listens on a port (local development)
//   api/index.js       -> exported as a Vercel serverless function
//
// Endpoints:
//   GET  /api/health  -> uptime check
//   GET  /api/sample  -> returns the raw sample leads (messy, with duplicates)
//   POST /api/score   -> { leads, icp? } -> cleaned, validated, scored, ranked
const express = require("express");
const cors = require("cors");

const { DEFAULT_ICP } = require("./src/icp");
const { dedupe } = require("./src/dedupe");
const { validateEmail } = require("./src/emailValidator");
const { scoreLead } = require("./src/leadScorer");

// require, not readFileSync: a bundled serverless function has no reliable
// __dirname to read from, but a required JSON file is traced into the bundle.
const SAMPLE = require("./data/mock_leads.json");

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

const router = express.Router();

router.get("/health", (_req, res) => res.json({ ok: true, uptime: process.uptime() }));

router.get("/sample", (_req, res) => res.json({ leads: SAMPLE }));

// The main pipeline: dedupe -> validate emails -> score -> rank.
router.post("/score", async (req, res) => {
  try {
    const rawLeads = Array.isArray(req.body?.leads) ? req.body.leads : [];
    const icp = { ...DEFAULT_ICP, ...(req.body?.icp || {}) };
    if (rawLeads.length === 0) {
      return res.status(400).json({ error: "Send a non-empty 'leads' array." });
    }

    // 1. Remove duplicate companies.
    const { unique, removed } = dedupe(rawLeads);

    // 2. Validate every email (cached DNS lookups, run in parallel).
    const statuses = await Promise.all(
      unique.map(l => validateEmail(l.email))
    );

    // 3. Score each lead against the ICP.
    const scored = unique.map((lead, i) => ({
      ...lead,
      ...scoreLead(lead, icp, statuses[i])
    }));

    // 4. Rank: highest score first.
    scored.sort((a, b) => b.score - a.score);

    // 5. Summary stats for the dashboard header.
    const stats = {
      total: rawLeads.length,
      afterDedup: unique.length,
      duplicatesRemoved: removed,
      hot: scored.filter(l => l.tier === "Hot").length,
      warm: scored.filter(l => l.tier === "Warm").length,
      cold: scored.filter(l => l.tier === "Cold").length,
      invalidEmails: scored.filter(l => l.emailStatus === "invalid").length,
      avgScore: Math.round(scored.reduce((s, l) => s + l.score, 0) / (scored.length || 1))
    };

    res.json({ stats, leads: scored, icp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Scoring failed. Check the server logs." });
  }
});

// Mounted twice on purpose: locally the path arrives as /api/score, while a
// platform rewrite may hand the function /score with the prefix already
// consumed. Both spellings hit the same handlers.
app.use("/api", router);
app.use("/", router);

module.exports = app;
