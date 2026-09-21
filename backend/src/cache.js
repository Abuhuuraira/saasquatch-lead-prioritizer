// cache.js — tiny in-memory cache with TTL.
// Used so we don't re-run the same DNS lookup for a domain we've already checked.
// This is the "caching / performance optimization" the challenge asks about.
class TTLCache {
  constructor(ttlMs = 1000 * 60 * 60) { // default 1 hour
    this.ttl = ttlMs;
    this.store = new Map();
  }
  get(key) {
    const hit = this.store.get(key);
    if (!hit) return undefined;
    if (Date.now() > hit.expires) { this.store.delete(key); return undefined; }
    return hit.value;
  }
  set(key, value) {
    this.store.set(key, { value, expires: Date.now() + this.ttl });
  }
  get size() { return this.store.size; }
}

module.exports = { TTLCache };
