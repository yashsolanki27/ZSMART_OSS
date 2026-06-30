# Skill: Avoiding `provider_code=1305 / reason=rate_limited`

## Problem
Turns fail with:
```
provider=builtin:zai-start-plan
provider_code=1305
reason=rate_limited
retryable=true
```
This is the harness rejecting a model call because the plan's throughput/quota
ceiling was hit (HTTP 429 equivalent). `retryable=true` does NOT mean "retry will
succeed" — it means "transient in nature."

## Root cause (two modes — diagnose which)
| Mode | Cause | Fix |
|---|---|---|
| **A. Throttle** | Too many calls/minute (concurrency) | Serialize + pace calls |
| **B. Quota** | Plan token/request budget exhausted | Wait for reset OR upgrade plan |

If retries *never* succeed over ~60s, it's mode B. If spacing out calls helps,
it's mode A.

## Solution (what actually worked on this project)
1. **One tool call at a time.** Do NOT batch multiple Write/Bash calls in a single
   assistant turn when the limit is hot. Serialize them.
2. **Pace, don't burst.** Space turns a few seconds apart.
3. **Let the window reset.** A 30–60s pause clears the per-minute counter.
4. **Prefer build verification over repeated reads.** Run `npm run build` once to
   catch all errors at once instead of reading many files.

## Correct retry pattern (if building a client yourself)
```js
async function callWithBackoff(fn, { maxAttempts = 5, base = 1, cap = 30 } = {}) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try { return await fn(); }
    catch (err) {
      const retryable = err.reason === 'rate_limited' || err.status === 429;
      if (!retryable || attempt === maxAttempts - 1) throw err;
      const exp = Math.min(cap, base * 2 ** attempt);
      const delay = err.retryAfterSec ?? (exp + Math.random()); // jitter!
      await new Promise(r => setTimeout(r, delay * 1000));
    }
  }
}
```

## Gotchas
- **No jitter = thundering herd.** Parallel retries wake simultaneously and re-trip
  the limiter. Always add `Math.random()`.
- **Ignoring `Retry-After`** makes you retry too early every time.
- Retrying a 4xx (validation) error is wrong — only 429/503-class should retry.
- The platform-side config (`C:\Users\jacky\.zcode\...`) holds the real quota/plan
  settings; those can only be changed by the user, not from inside a session.
