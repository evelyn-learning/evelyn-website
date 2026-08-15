import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@core/db";
import { DemoSession } from "@/models";
import type { IGeoLocation } from "@core/models/DemoInteraction";
import crypto from "crypto";

// Reuse geo cache and helpers from track route pattern
const geoCache = new Map<string, { data: IGeoLocation; timestamp: number }>();
const GEO_CACHE_TTL = 24 * 60 * 60 * 1000;

async function getGeoLocation(ip: string): Promise<IGeoLocation | null> {
  if (ip === "unknown" || ip === "127.0.0.1" || ip.startsWith("192.168.") || ip.startsWith("10.") || ip === "::1") {
    return null;
  }

  const cached = geoCache.get(ip);
  if (cached && Date.now() - cached.timestamp < GEO_CACHE_TTL) {
    return cached.data;
  }

  try {
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,region,regionName,city,timezone,org`, {
      signal: AbortSignal.timeout(3000),
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

    geoCache.set(ip, { data: location, timestamp: Date.now() });
    return location;
  } catch {
    return null;
  }
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 100;
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

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    // Handle both application/json and sendBeacon (which may send text/plain)
    let body;
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      body = await request.json();
    } else {
      // sendBeacon with Blob — parse text as JSON
      const text = await request.text();
      body = JSON.parse(text);
    }

    const {
      sessionId,
      productId,
      productTitle,
      interactions,
      ended,
      duration,
    } = body;

    // Validate required fields
    if (!sessionId || !productId || !Array.isArray(interactions) || interactions.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields: sessionId, productId, interactions[]" },
        { status: 400 }
      );
    }

    // Get user agent and device type
    const userAgent = request.headers.get("user-agent") || "";
    const deviceType = getDeviceType(userAgent);

    await connectDB();

    // Get geolocation
    const location = await getGeoLocation(ip);

    // Filter internal traffic — owner's own sessions should not land in analytics.
    const FILTERED_IP_HASHES = new Set(["87c6f6c5cfef2d0b"]);
    if (
      (location?.city === "Brentwood" && location?.region === "CA") ||
      FILTERED_IP_HASHES.has(hashIP(ip))
    ) {
      return NextResponse.json({ success: true, skipped: "filtered-location" });
    }

    // Cap content length server-side
    const sanitizedInteractions = interactions.map((i: { type: string; role?: string; content?: string; metadata?: Record<string, unknown>; timestamp?: string }) => ({
      type: i.type,
      role: i.role || undefined,
      content: i.content ? i.content.slice(0, 2000) : undefined,
      metadata: i.metadata || undefined,
      timestamp: i.timestamp ? new Date(i.timestamp) : new Date(),
    }));

    // Count messages and tool types for summary updates
    const messageCount = sanitizedInteractions.filter((i: { type: string }) => i.type === "message").length;
    const toolsUsed = [...new Set(
      sanitizedInteractions
        .filter((i: { type: string }) => i.type === "tool_use")
        .map((i: { content?: string }) => i.content)
        .filter(Boolean)
    )] as string[];

    // Build update operation
    const now = new Date();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateOp: Record<string, any> = {
      $setOnInsert: {
        sessionId,
        productId,
        productTitle: productTitle || productId,
        startedAt: now,
        deviceType,
        ipHash: hashIP(ip),
        location: location || undefined,
      },
      $push: {
        interactions: { $each: sanitizedInteractions },
      },
      $inc: {
        "summary.totalInteractions": sanitizedInteractions.length,
        "summary.messageCount": messageCount,
      },
      $set: {
        "summary.lastActivity": now,
      },
    };

    if (toolsUsed.length > 0) {
      updateOp.$addToSet = {
        "summary.toolsUsed": { $each: toolsUsed },
      };
    }

    if (ended) {
      updateOp.$set.endedAt = now;
      if (duration) {
        updateOp.$set.duration = duration;
      }
    }

    await DemoSession.findOneAndUpdate(
      { sessionId, productId },
      updateOp,
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DEMO_SESSION] Error:", error);
    return NextResponse.json(
      { error: "Failed to track session" },
      { status: 500 }
    );
  }
}
