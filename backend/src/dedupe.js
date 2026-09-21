// dedupe.js — removes duplicate companies.
// A salesperson should never call the same company twice. We key on domain
// (falling back to a normalized company name) and keep the first occurrence.
function dedupe(leads) {
  const seen = new Set();
  const unique = [];
  let removed = 0;

  for (const lead of leads) {
    const key = (lead.domain || lead.companyName || "")
      .toLowerCase()
      .replace(/^www\./, "")
      .trim();
    if (!key) { unique.push(lead); continue; }
    if (seen.has(key)) { removed++; continue; }
    seen.add(key);
    unique.push(lead);
  }
  return { unique, removed };
}

module.exports = { dedupe };
