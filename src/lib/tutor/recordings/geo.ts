/**
 * Best-effort IP geolocation for session capture. ip-api.com free tier:
 * HTTP only, no key, 45 req/min — far above session-start volume. Callers
 * fire-and-forget; this must never throw into the save path.
 */
import { isPrivateIp } from './client-ip';

export interface GeoLocation {
  city?: string;
  region?: string;
  country?: string;
}

const GEO_TIMEOUT_MS = 3000;

export async function lookupGeo(ip: string): Promise<GeoLocation | null> {
  if (isPrivateIp(ip)) return { city: 'Local' };
  try {
    const res = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,city,regionName,countryCode`,
      { signal: AbortSignal.timeout(GEO_TIMEOUT_MS) },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      status?: string;
      city?: string;
      regionName?: string;
      countryCode?: string;
    };
    if (data.status !== 'success') return null;
    const loc: GeoLocation = {};
    if (data.city) loc.city = data.city;
    if (data.regionName) loc.region = data.regionName;
    if (data.countryCode) loc.country = data.countryCode;
    return Object.keys(loc).length > 0 ? loc : null;
  } catch {
    return null;
  }
}
