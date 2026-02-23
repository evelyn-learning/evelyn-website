"use client";

import { useEffect, useRef, useCallback } from "react";
import { useDemoTracking } from "@/hooks/useDemoTracking";

interface DemoTrackerProps {
  productId: string;
  productTitle: string;
  children: React.ReactNode;
}

/**
 * Wrapper component that tracks demo interactions automatically.
 *
 * - Tracks "view" when the demo enters the viewport
 * - Tracks "try" on first interaction (click/input) within the demo
 * - Can be extended to track "complete" via callback
 *
 * Usage:
 * ```tsx
 * <DemoTracker productId="essay-ai" productTitle="AI Essay Scoring">
 *   <EssayScoringDemo />
 * </DemoTracker>
 * ```
 */
export function DemoTracker({ productId, productTitle, children }: DemoTrackerProps) {
  const { trackView, trackTry } = useDemoTracking({ productId, productTitle });
  const containerRef = useRef<HTMLDivElement>(null);
  const hasTrackedView = useRef(false);
  const hasTrackedTry = useRef(false);

  // Track view when demo enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTrackedView.current) {
            hasTrackedView.current = true;
            trackView();
          }
        });
      },
      { threshold: 0.3 } // Trigger when 30% visible
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [trackView]);

  // Track first interaction (try)
  const handleInteraction = useCallback(() => {
    if (!hasTrackedTry.current) {
      hasTrackedTry.current = true;
      trackTry();
    }
  }, [trackTry]);

  return (
    <div
      ref={containerRef}
      onClick={handleInteraction}
      onKeyDown={handleInteraction}
      onFocus={handleInteraction}
    >
      {children}
    </div>
  );
}

/**
 * Hook version for more control over tracking in custom demo components
 */
export function useDemoTracker(productId: string, productTitle: string) {
  const { trackView, trackTry, trackComplete, trackInteraction } = useDemoTracking({ productId, productTitle });
  const hasTrackedView = useRef(false);
  const hasTrackedTry = useRef(false);
  const hasTrackedComplete = useRef(false);

  const onView = useCallback(() => {
    if (!hasTrackedView.current) {
      hasTrackedView.current = true;
      trackView();
    }
  }, [trackView]);

  const onTry = useCallback(() => {
    if (!hasTrackedTry.current) {
      hasTrackedTry.current = true;
      trackTry();
    }
  }, [trackTry]);

  const onComplete = useCallback((metadata?: Record<string, unknown>) => {
    if (!hasTrackedComplete.current) {
      hasTrackedComplete.current = true;
      trackComplete(metadata);
    }
  }, [trackComplete]);

  return { onView, onTry, onComplete, trackInteraction };
}
