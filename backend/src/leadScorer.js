// leadScorer.js — the brain of the tool.
// Scores one lead 0-100 against the Ideal Customer Profile (ICP) and explains
// WHY. A transparent score a salesperson can trust beats a black-box number.
//
// Weights (total 100):
//   Industry match .......... 25
//   Company size fit ........ 20
//   Location match .......... 15
//   Tech-stack signal ....... 15
//   Contactability .......... 15  (valid email 10 + phone 5)
//   Revenue fit ............. 10
function scoreLead(lead, icp, emailStatus) {
  let score = 0;
  const reasons = [];
  const misses = [];

  // 1. Industry
  if (icp.industries.includes(lead.industry)) {
    score += 25; reasons.push("Industry match");
  } else { misses.push("Off-target industry"); }

  // 2. Company size
  if (lead.employees >= icp.minEmployees && lead.employees <= icp.maxEmployees) {
    score += 20; reasons.push("Right company size");
  } else { misses.push("Size out of range"); }

  // 3. Location
  if (icp.locations.includes(lead.country)) {
    score += 15; reasons.push("Target location");
  } else { misses.push("Outside target region"); }

  // 4. Tech stack
  const techHit = (lead.techStack || []).find(t => icp.techSignals.includes(t));
  if (techHit) {
    score += 15; reasons.push(`Uses ${techHit}`);
  }

  // 5. Contactability
  if (emailStatus === "valid") { score += 10; reasons.push("Verified email"); }
  else if (emailStatus === "risky") { score += 5; reasons.push("Unverified email"); }
  else { misses.push("No usable email"); }
  if (lead.phone) { score += 5; reasons.push("Phone available"); }

  // 6. Revenue
  if (lead.revenue >= icp.minRevenue && lead.revenue <= icp.maxRevenue) {
    score += 10; reasons.push("Revenue fit");
  }

  return { score, tier: tierFor(score), reasons, misses, emailStatus };
}

function tierFor(score) {
  if (score >= 70) return "Hot";   // call first
  if (score >= 40) return "Warm";  // call this week
  return "Cold";                    // deprioritize
}

module.exports = { scoreLead, tierFor };
