/**
 * sessionCache
 * ─────────────────────────────────────────────────────────────────────────────
 * A tiny typed wrapper around sessionStorage for caching API responses.
 *
 * WHY sessionStorage (not localStorage)?
 *   • sessionStorage is cleared when the browser tab closes, so data never
 *     goes stale across days/sessions.
 *   • localStorage would persist indefinitely, meaning a user could see
 *     weeks-old content if they never close the tab.
 *   • 30-minute TTL within a session is the sweet spot: fast revisits,
 *     fresh data on new sessions.
 *
 * USAGE:
 *   const cached = sessionCache.get<MyType>("my-key");
 *   if (cached) { use(cached); return; }
 *   const fresh = await fetchSomething();
 *   sessionCache.set("my-key", fresh);
 * ─────────────────────────────────────────────────────────────────────────────
 */

const TTL_MS = 30 * 60 * 1000; // 30 minutes

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export const sessionCache = {
  get<T>(key: string): T | null {
    try {
      const raw = sessionStorage.getItem(key);
      if (!raw) return null;
      const entry = JSON.parse(raw) as CacheEntry<T>;
      if (Date.now() - entry.timestamp > TTL_MS) {
        sessionStorage.removeItem(key);
        return null;
      }
      return entry.data;
    } catch {
      return null;
    }
  },

  set<T>(key: string, data: T): void {
    try {
      const entry: CacheEntry<T> = { data, timestamp: Date.now() };
      sessionStorage.setItem(key, JSON.stringify(entry));
    } catch {
      // sessionStorage can throw if storage quota is exceeded — fail silently
    }
  },

  clear(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};