"use client";

import { useCallback, useEffect, useRef } from "react";

interface TrackingOptions {
  productId: string;
  productTitle: string;
}

/**
 * Hook for tracking demo interactions
 *
 * Usage:
 * ```tsx
 * const { trackView, trackTry, trackComplete } = useDemoTracking({
 *   productId: 'essay-ai',
 *   productTitle: 'AI Essay Scoring'
 * });
 *
 * // Track when user views the demo page
 * useEffect(() => { trackView(); }, [trackView]);
 *
 * // Track when user clicks "Try Demo" button
 * <button onClick={trackTry}>Try Demo</button>
 * ```
 */
export function useDemoTracking({ productId, productTitle }: TrackingOptions) {
  const sessionId = useRef<string>("");
  const startTime = useRef<number>(Date.now());
  const hasTrackedView = useRef(false);

  // Get or create session ID
  useEffect(() => {
    let stored = sessionStorage.getItem("demo_session_id");
    if (!stored) {
      stored = `demo_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem("demo_session_id", stored);
    }
    sessionId.current = stored;
    startTime.current = Date.now();
  }, []);

  const track = useCallback(
    async (eventType: "view" | "try" | "complete", metadata?: Record<string, unknown>) => {
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
    [productId, productTitle]
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
      track("complete", metadata);
    },
    [track]
  );

  return {
    trackView,
    trackTry,
    trackComplete,
    sessionId: sessionId.current,
  };
}
