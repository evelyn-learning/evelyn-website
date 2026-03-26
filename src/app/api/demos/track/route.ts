import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { DemoInteraction, DemoSession } from "@/models";
import type { IGeoLocation } from "@/models/DemoInteraction";
import crypto from "crypto";

// Simple in-memory cache for IP geolocation (to avoid hitting rate limits)
const geoCache = new Map<string, { data: IGeoLocation; timestamp: number }>();
const GEO_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

async function getGeoLocation(ip: string): Promise<IGeoLocation | null> {
  // Skip for localhost/private IPs
  if (ip === "unknown" || ip === "127.0.0.1" || ip.startsWith("192.168.") || ip.startsWith("10.") || ip === "::1") {
    return null;
  }

  // Check cache
  const cached = geoCache.get(ip);
  if (cached && Date.now() - cached.timestamp < GEO_CACHE_TTL) {
    return cached.data;
  }

  try {
    // Use ip-api.com (free, no API key needed, 45 req/min limit)
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,region,regionName,city,timezone,org`, {
      signal: AbortSignal.timeout(3000), // 3 second timeout
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (data.status !== "success") return null;

    const location: IGeoLocation = {
      country: data.country,
      countryCode: data.countryCode,
      region: data.region,
      regionName: data.regionName,
      city: data.city,
      timezone: data.timezone,
      org: data.org,
    };

    // Cache the result
    geoCache.set(ip, { data: location, timestamp: Date.now() });

    return location;
  } catch (error) {
    console.error("[GEO_LOOKUP] Error:", error);
    return null;
  }
}

// Rate limiting to prevent abuse
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 100; // requests per minute per IP
const RATE_WINDOW = 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

function getDeviceType(userAgent: string): "mobile" | "tablet" | "desktop" {
  const ua = userAgent.toLowerCase();
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return "mobile";
  return "desktop";
}

function hashIP(ip: string): string {
  return crypto.createHash("sha256").update(ip + process.env.NEXTAUTH_SECRET || "salt").digest("hex").slice(0, 16);
}

export async function POST(request: NextRequest) {
  try {
    // Skip tracking for logged-in admin users
    const session = await getServerSession(authOptions);
    if (session?.user) {
      return NextResponse.json({ success: true, skipped: "admin" });
    }

    // Get IP for rate limiting
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

    // Rate limit check
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const {
      productId,
      productTitle,
      eventType,
      sessionId,
      duration,
      referrer,
      metadata,
      // New client-side fields
      language,
      screenSize,
      browserTimezone,
    } = body;

    // Validate required fields
    if (!productId || !eventType || !sessionId) {
      return NextResponse.json(
        { error: "Missing required fields: productId, eventType, sessionId" },
        { status: 400 }
      );
    }

    // Validate event type
    if (!["view", "try", "complete"].includes(eventType)) {
      return NextResponse.json(
        { error: "Invalid eventType. Must be: view, try, or complete" },
        { status: 400 }
      );
    }

    // Get user agent and device type
    const userAgent = request.headers.get("user-agent") || "";
    const deviceType = getDeviceType(userAgent);

    // Connect to database
    await connectDB();

    // Get geolocation from IP (async, won't block if it fails)
    const location = await getGeoLocation(ip);

    // Filter out internal traffic by city or known IP hash
    // TEMPORARILY DISABLED for testing — re-enable after verifying tracking works from Brentwood
    // const FILTERED_IP_HASHES = new Set(["87c6f6c5cfef2d0b"]);
    // if (
    //   (location?.city === "Brentwood" && location?.region === "CA") ||
    //   FILTERED_IP_HASHES.has(hashIP(ip))
    // ) {
    //   return NextResponse.json({ success: true, skipped: "filtered-location" });
    // }

    const now = new Date();

    // Create interaction record
    const interaction = await DemoInteraction.create({
      productId,
      productTitle: productTitle || productId,
      eventType,
      sessionId,
      timestamp: now,
      duration: duration || undefined,
      deviceType,
      referrer: referrer || request.headers.get("referer") || undefined,
      userAgent: userAgent.slice(0, 500), // Limit length
      ipHash: hashIP(ip),
      // Location from IP geolocation
      location: location || undefined,
      // Additional user info from client
      language: language || request.headers.get("accept-language")?.split(",")[0] || undefined,
      screenSize: screenSize || undefined,
      browserTimezone: browserTimezone || undefined,
      metadata,
    });

    // On "view" events, ensure a DemoSession record exists so the session
    // appears in the admin Session Explorer even if the user never interacts.
    // Also update lastActivity so stale sessions surface recent visits.
    if (eventType === "view") {
      try {
        await DemoSession.findOneAndUpdate(
          { sessionId, productId },
          {
            $setOnInsert: {
              sessionId,
              productId,
              productTitle: productTitle || productId,
              startedAt: now,
              deviceType,
              ipHash: hashIP(ip),
              location: location || undefined,
              interactions: [],
              "summary.totalInteractions": 0,
              "summary.messageCount": 0,
              "summary.toolsUsed": [],
            },
            $set: {
              "summary.lastActivity": now,
            },
          },
          { upsert: true }
        );
      } catch (sessionErr) {
        console.error("[DEMO_TRACK] DemoSession upsert failed:", sessionErr);
      }
    }

    return NextResponse.json({
      success: true,
      id: interaction._id,
    });
  } catch (error) {
    console.error("[DEMO_TRACK] Error:", error);
    return NextResponse.json(
      { error: "Failed to track interaction" },
      { status: 500 }
    );
  }
}
