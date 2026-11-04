// Bearer-token check for the Beacon ingest API (/api/beacon/v1/*).
// 503 when the token env is unset (the API is off, not open), 401 on mismatch.
import { createHash, timingSafeEqual } from "crypto";

export function checkBeaconAuth(header: string | null, token: string | undefined): 200 | 401 | 503 {
  if (!token) return 503;
  if (!header || !header.startsWith("Bearer ")) return 401;
  const given = header.slice("Bearer ".length);
  // Hash both sides so the compare is constant-time regardless of length.
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(token).digest();
  return timingSafeEqual(a, b) ? 200 : 401;
}
