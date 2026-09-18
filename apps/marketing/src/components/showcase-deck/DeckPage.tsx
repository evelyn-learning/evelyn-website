"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import AccessGate from "./AccessGate";
import Deck from "./Deck";
import PresenterView from "./PresenterView";
import type { DeckConfig } from "./config";
import { useDemoTracking } from "@/hooks/useDemoTracking";

function useUnlocked(storageKey: string) {
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    if (sessionStorage.getItem(storageKey) === "true") setUnlocked(true);
    setChecking(false);
  }, [storageKey]);
  return { unlocked, setUnlocked, checking };
}

function Spinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
    </div>
  );
}

/**
 * Audience-facing page. Tracking lives here (one page load = one session) —
 * see src/app/showcase/nahq/page.tsx for how the admin tiles read: Views =
 * link opened (before the gate), Interactions = passcode accepted, Completed
 * = last slide reached, Recent = per-slide navigation.
 */
export function DeckPage({ config }: { config: DeckConfig }) {
  const { unlocked, setUnlocked, checking } = useUnlocked(config.storageKey);
  const hasCompleted = useRef(false);
  const { trackView, trackTry, trackComplete, trackInteraction } = useDemoTracking({
    productId: config.productId,
    productTitle: config.productTitle,
  });

  useEffect(() => {
    trackView();
  }, [trackView]);

  const handleUnlock = useCallback(() => {
    setUnlocked(true);
    trackTry({ event: "passcode_accepted" });
  }, [setUnlocked, trackTry]);

  const handleSlideView = useCallback(
    (index: number) => {
      const slide = config.slides[index];
      if (!slide) return;
      trackInteraction("navigation", slide.title, {
        slideId: slide.id,
        slideIndex: index,
        slideNumber: index + 1,
        slideCount: config.slides.length,
      });
      if (index === config.slides.length - 1 && !hasCompleted.current) {
        hasCompleted.current = true;
        trackComplete({ reachedSlideId: slide.id });
      }
    },
    [config.slides, trackInteraction, trackComplete],
  );

  if (checking) return <Spinner />;
  if (!unlocked) return <AccessGate config={config} onUnlock={handleUnlock} />;
  return <Deck config={config} onSlideView={handleSlideView} />;
}

/** Presenter/teleprompter page — same gate and storage key, so unlocking either tab unlocks both. */
export function PresenterPage({ config }: { config: DeckConfig }) {
  const { unlocked, setUnlocked, checking } = useUnlocked(config.storageKey);
  if (checking) return <Spinner />;
  if (!unlocked) return <AccessGate config={config} onUnlock={() => setUnlocked(true)} />;
  return <PresenterView config={config} />;
}
