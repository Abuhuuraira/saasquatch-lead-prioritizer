// emailValidator.js — checks whether an email is likely to be reachable.
// Two layers, both FREE (no paid API):
//   1. Format check (regex) — is it even shaped like an email?
//   2. MX-record check (DNS) — does the domain actually accept mail?
// Returns "valid" | "risky" | "invalid". Results are cached by domain.
const dns = require("dns").promises;
const { TTLCache } = require("./cache");

const mxCache = new TTLCache(1000 * 60 * 60); // cache MX results for 1 hour
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

async function domainHasMx(domain) {
  const cached = mxCache.get(domain);
  if (cached !== undefined) return cached;
  try {
    const records = await Promise.race([
      dns.resolveMx(domain),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 3000))
    ]);
    const ok = Array.isArray(records) && records.length > 0;
    mxCache.set(domain, ok);
    return ok;
  } catch {
    mxCache.set(domain, false);
    return false;
  }
}

// status: "valid"  -> format ok AND domain accepts mail   (safe to send)
//         "risky"  -> format ok but domain not verifiable  (send with caution)
//         "invalid"-> not a real email format              (drop it)
async function validateEmail(email) {
  if (!email || !EMAIL_RE.test(email)) return "invalid";
  const domain = email.split("@")[1].toLowerCase();
  const hasMx = await domainHasMx(domain);
  return hasMx ? "valid" : "risky";
}

module.exports = { validateEmail, mxCache };
