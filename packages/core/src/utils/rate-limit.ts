import { NextRequest } from 'next/server';

// ============================================================================
// SHARED RATE LIMITING UTILITIES
// ============================================================================

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// Separate stores for burst vs daily limiting
const burstStore = new Map<string, RateLimitEntry>();
const dailyStore = new Map<string, RateLimitEntry>();

const DAY_MS = 24 * 60 * 60 * 1000;

// ============================================================================
// BURST LIMITER (per-minute / per-window)
// ============================================================================
export function checkBurstLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = burstStore.get(key);

  // Evict expired entries when store gets large
  if (burstStore.size > 10_000) {
    for (const [k, v] of burstStore.entries()) {
      if (v.resetTime < now) burstStore.delete(k);
    }
  }

  if (!entry || entry.resetTime < now) {
    burstStore.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetIn: entry.resetTime - now };
  }

  entry.count++;
  return { allowed: true, remaining: maxRequests - entry.count, resetIn: entry.resetTime - now };
}

// ============================================================================
// DAILY LIMITER (per-IP, per-route-group cumulative cap)
// ============================================================================
export function checkDailyLimit(
  ip: string,
  routeGroup: string,
  maxPerDay: number
): { allowed: boolean; used: number; limit: number; resetsAt: number } {
  const now = Date.now();
  const key = `daily:${routeGroup}:${ip}`;
  const entry = dailyStore.get(key);

  // Evict expired entries when store gets large
  if (dailyStore.size > 10_000) {
    for (const [k, v] of dailyStore.entries()) {
      if (v.resetTime < now) dailyStore.delete(k);
    }
  }

  if (!entry || entry.resetTime < now) {
    dailyStore.set(key, { count: 1, resetTime: now + DAY_MS });
    return { allowed: true, used: 1, limit: maxPerDay, resetsAt: now + DAY_MS };
  }

  if (entry.count >= maxPerDay) {
    return { allowed: false, used: entry.count, limit: maxPerDay, resetsAt: entry.resetTime };
  }

  entry.count++;
  return { allowed: true, used: entry.count, limit: maxPerDay, resetsAt: entry.resetTime };
}

// ============================================================================
// IP EXTRACTION HELPER
// ============================================================================
export function getIPFromRequest(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',')[0].trim() : 'unknown';
}
