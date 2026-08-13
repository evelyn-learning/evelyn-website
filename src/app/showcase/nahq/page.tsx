"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import AccessGate from "./components/AccessGate";
import Deck from "./components/Deck";
import { useDemoTracking } from "@/hooks/useDemoTracking";
import { SLIDES } from "./components/slides";

// Must match the `productId` in src/config/showcaseProducts.ts — that's the
// key the admin Client Showcases card aggregates on.
const PRODUCT_ID = "nahq";
const PRODUCT_TITLE = "NAHQ — Adaptive CPHQ Prep";

/**
 * Tracking lives here (the page) rather than in <Deck> so one page load is one
 * session: the hook mints a sessionId per mount, and a second instance inside
 * Deck would split each visit across two of them and double-count unique
 * users. Deck reports slide movement back up through callbacks instead.
 *
 * How the four admin tiles read for this deck:
 *   Views        — the link was opened (fires before the passcode gate, so a
 *                  recipient who opens it and never enters the code is still
 *                  visible; that gap is itself the signal).
 *   Interactions — the passcode was accepted. Not fired on a same-tab reload,
 *                  which restores `unlocked` from sessionStorage without a
 *                  second unlock.
 *   Completed    — they reached the final slide.
 *   Recent       — per-slide navigation, batched via trackInteraction and
 *                  readable in the admin Session Explorer as a walk-through
 *                  of how far they got and where they lingered.
 */
export default function NahqShowcasePage() {
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);
  const hasCompleted = useRef(false);

  const { trackView, trackTry, trackComplete, trackInteraction } =
    useDemoTracking({ productId: PRODUCT_ID, productTitle: PRODUCT_TITLE });

  useEffect(() => {
    const stored = sessionStorage.getItem("nahq_deck_access");
    if (stored === "true") setUnlocked(true);
    setChecking(false);
  }, []);

  // trackView is idempotent per page load (the hook guards on its own ref).
  useEffect(() => {
    trackView();
  }, [trackView]);

  const handleUnlock = useCallback(() => {
    setUnlocked(true);
    trackTry({ event: "passcode_accepted" });
  }, [trackTry]);

  const handleSlideView = useCallback(
    (index: number) => {
      const slide = SLIDES[index];
      if (!slide) return;
      trackInteraction("navigation", slide.title, {
        slideId: slide.id,
        slideIndex: index,
        slideNumber: index + 1,
        slideCount: SLIDES.length,
      });
      if (index === SLIDES.length - 1 && !hasCompleted.current) {
        hasCompleted.current = true;
        trackComplete({ reachedSlideId: slide.id });
      }
    },
    [trackInteraction, trackComplete]
  );

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
      </div>
    );
  }

  if (!unlocked) {
    return <AccessGate onUnlock={handleUnlock} />;
  }

  return <Deck onSlideView={handleSlideView} />;
}
