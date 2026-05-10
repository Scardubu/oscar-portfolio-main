/**
 * lib/fetch-utils.ts — CONVICTION ENGINE v19.0
 * ─────────────────────────────────────────────────────────────────────────────
 * Mobile-first fetch utilities:
 *   fetchWithTimeout — cancels after n ms (default 8s). Prevents indefinite
 *     loading spinners on intermittent Lagos / mobile networks.
 *   withRetry — exponential backoff for transient API failures.
 */

/**
 * Fetch with an AbortController timeout.
 * @param url     - Request URL
 * @param options - Standard RequestInit options
 * @param ms      - Timeout in milliseconds (default 8000)
 */
export async function fetchWithTimeout(
  url:     string,
  options: RequestInit = {},
  ms      = 8_000
): Promise<Response> {
  const ctrl = new AbortController();
  const id   = setTimeout(() => ctrl.abort(), ms);

  try {
    const res = await fetch(url, { ...options, signal: ctrl.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

/**
 * Retry a fetch up to `attempts` times with exponential backoff.
 * @param fn       - Async function that returns a Response
 * @param attempts - Max attempts (default 3)
 * @param baseMs   - Base backoff in ms (default 400 — doubles each retry)
 */
export async function withRetry<T>(
  fn:       () => Promise<T>,
  attempts  = 3,
  baseMs    = 400
): Promise<T> {
  let lastError: unknown;

  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, baseMs * 2 ** i));
      }
    }
  }

  throw lastError;
}

/**
 * Safe JSON fetch: wraps fetchWithTimeout + response.json().
 * Returns null on network error instead of throwing.
 */
export async function safeFetchJson<T>(
  url:     string,
  options: RequestInit = {},
  ms      = 8_000
): Promise<T | null> {
  try {
    const res = await fetchWithTimeout(url, options, ms);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}