"use client";

import { createContext, useContext } from "react";
import type { InteractionType } from "@/hooks/useDemoTracking";

type TrackInteractionFn = (
  type: InteractionType,
  content?: string,
  metadata?: Record<string, unknown>,
  role?: "student" | "tutor"
) => void;

const DemoTrackingContext = createContext<TrackInteractionFn | null>(null);

export function DemoTrackingProvider({
  trackInteraction,
  children,
}: {
  trackInteraction: TrackInteractionFn;
  children: React.ReactNode;
}) {
  return (
    <DemoTrackingContext.Provider value={trackInteraction}>
      {children}
    </DemoTrackingContext.Provider>
  );
}

export function useTrackInteraction(): TrackInteractionFn {
  const ctx = useContext(DemoTrackingContext);
  // Return a no-op if used outside a provider (safe default)
  if (!ctx) return () => {};
  return ctx;
}
