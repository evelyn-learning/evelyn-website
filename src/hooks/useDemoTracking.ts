"use client";

import { useCallback, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

interface TrackingOptions {
  productId: string;
  productTitle: string;
}

export type InteractionType = "message" | "click" | "tool_use" | "navigation" | "homework_upload";

interface BufferedInteraction {
  type: InteractionType;
  role?: "student" | "tutor";
  content?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

// useSession throws when no SessionProvider exists. Internally it calls useContext
// (the real hook) before throwing, so hook ordering is preserved and try/catch is safe.
function useOptionalSession() {
  try {
    return useSession();
  } catch {
    return null;
  }
}

const FLUSH_THRESHOLD = 10;
const FLUSH_INTERVAL_MS = 30_000;

/**
 * Hook for tracking demo interactions
 *
 * Usage:
 * ```tsx
 * const { trackView, trackTry, trackComplete, trackInteraction } = useDemoTracking({
 *   productId: 'essay-ai',
 *   productTitle: 'AI Essay Scoring'
 * });
 *
 * // Track when user views the demo page
 * useEffect(() => { trackView(); }, [trackView]);
 *
 * // Track when user clicks "Try Demo" button
 * <button onClick={trackTry}>Try Demo</button>
 *
 * // Track detailed interactions within a session
 * trackInteraction('message', 'Hello tutor', undefined, 'student');
 * ```
 */
export function useDemoTracking({ productId, productTitle }: TrackingOptions) {
  const sessionResult = useOptionalSession();
  const session = sessionResult?.data;
  const sessionId = useRef<string>("");
  const startTime = useRef<number>(Date.now());
  const hasTrackedView = useRef(false);

  // Interaction batching
  const interactionBuffer = useRef<BufferedInteraction[]>([]);
  const flushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAdmin = !!session?.user;

  // Get or create session ID
  useEffect(() => {
    let stored = sessionStorage.getItem("demo_session_id");
    if (!stored) {
      stored = `demo_${Date.now()}_${crypto.randomUUID().substring(0, 8)}`;
      sessionStorage.setItem("demo_session_id", stored);
    }
    sessionId.current = stored;
    startTime.current = Date.now();
  }, []);

  // Flush interactions to server
  const flushInteractions = useCallback(
    async (ended?: boolean) => {
      if (isAdmin) return;
      const items = interactionBuffer.current.splice(0);
      if (items.length === 0 && !ended) return;

      // Clear pending timer
      if (flushTimerRef.current) {
        clearTimeout(flushTimerRef.current);
        flushTimerRef.current = null;
      }

      const duration = ended ? Math.round((Date.now() - startTime.current) / 1000) : undefined;

      const payload = JSON.stringify({
        sessionId: sessionId.current,
        productId,
        productTitle,
        interactions: items,
        ended: ended || false,
        duration,
      });

      try {
        await fetch("/api/demos/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
        });
      } catch {
        // Silently fail
      }
    },
    [productId, productTitle, isAdmin]
  );

  // Schedule a flush after inactivity
  const scheduleFlush = useCallback(() => {
    if (flushTimerRef.current) {
      clearTimeout(flushTimerRef.current);
    }
    flushTimerRef.current = setTimeout(() => {
      flushInteractions();
    }, FLUSH_INTERVAL_MS);
  }, [flushInteractions]);

  // Track a detailed interaction within the session
  const trackInteraction = useCallback(
    (type: InteractionType, content?: string, metadata?: Record<string, unknown>, role?: "student" | "tutor") => {
      if (isAdmin) return;

      interactionBuffer.current.push({
        type,
        role,
        content: content?.slice(0, 2000),
        metadata,
        timestamp: new Date().toISOString(),
      });

      // Flush if buffer is full
      if (interactionBuffer.current.length >= FLUSH_THRESHOLD) {
        flushInteractions();
      } else {
        scheduleFlush();
      }
    },
    [isAdmin, flushInteractions, scheduleFlush]
  );

  // Cleanup: flush remaining interactions on unmount
  useEffect(() => {
    return () => {
      if (flushTimerRef.current) {
        clearTimeout(flushTimerRef.current);
      }

      // Use sendBeacon to flush remaining interactions
      const items = interactionBuffer.current.splice(0);
      if (items.length > 0 && typeof navigator !== "undefined" && navigator.sendBeacon) {
        const duration = Math.round((Date.now() - startTime.current) / 1000);
        const payload = JSON.stringify({
          sessionId: sessionId.current,
          productId,
          productTitle,
          interactions: items,
          ended: true,
          duration,
        });
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon("/api/demos/session", blob);
      }
    };
  }, [productId, productTitle]);

  const track = useCallback(
    async (eventType: "view" | "try" | "complete", metadata?: Record<string, unknown>) => {
      // Skip tracking for logged-in admin users
      if (isAdmin) {
        return;
      }

      try {
        const duration = Math.round((Date.now() - startTime.current) / 1000);

        // Collect additional user info (no permission needed)
        const screenSize = typeof window !== "undefined"
          ? `${window.screen.width}x${window.screen.height}`
          : undefined;
        const browserTimezone = typeof Intl !== "undefined"
          ? Intl.DateTimeFormat().resolvedOptions().timeZone
          : undefined;
        const language = typeof navigator !== "undefined"
          ? navigator.language
          : undefined;

        await fetch("/api/demos/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId,
            productTitle,
            eventType,
            sessionId: sessionId.current,
            duration: eventType !== "view" ? duration : undefined,
            referrer: document.referrer || undefined,
            // Additional user info
            screenSize,
            browserTimezone,
            language,
            metadata,
          }),
        });
      } catch (error) {
        // Silently fail - don't interrupt user experience
        console.error("[Demo Tracking] Failed:", error);
      }
    },
    [productId, productTitle, isAdmin]
  );

  const trackView = useCallback(() => {
    // Only track view once per page load
    if (hasTrackedView.current) return;
    hasTrackedView.current = true;
    track("view");
  }, [track]);

  const trackTry = useCallback(
    (metadata?: Record<string, unknown>) => {
      track("try", metadata);
    },
    [track]
  );

  const trackComplete = useCallback(
    (metadata?: Record<string, unknown>) => {
      // Flush any remaining interactions and mark session as ended
      flushInteractions(true);
      track("complete", metadata);
    },
    [track, flushInteractions]
  );

  return {
    trackView,
    trackTry,
    trackComplete,
    trackInteraction,
    sessionId: sessionId.current,
  };
}
