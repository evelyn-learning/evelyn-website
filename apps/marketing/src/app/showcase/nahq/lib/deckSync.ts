"use client";

import { useEffect, useRef } from "react";

// Channel name is the wire contract between the audience-facing deck
// (components/Deck.tsx) and the presenter/teleprompter window
// (presenter/page.tsx via components/PresenterView.tsx). Same-origin browser
// tabs only — exactly the "share this tab in Meet" setup this exists for.
export const DECK_SYNC_CHANNEL = "nahq-deck-sync";

export type DeckSyncMessage =
  | { type: "index"; index: number }
  | { type: "hello" };

/**
 * Thin wrapper around BroadcastChannel('nahq-deck-sync').
 *
 * Protocol: whichever window changes slide broadcasts { type: "index" }.
 * The other window applies it if it differs from its own state (no self
 * feedback loop — BroadcastChannel never delivers a message back to its own
 * sender). On mount, a window may broadcast { type: "hello" }; any window
 * that receives it replies with its current index, so whichever window
 * opened second (deck or presenter, either order) catches up immediately.
 *
 * Never throws: if BroadcastChannel isn't available, postIndex/postHello
 * are no-ops and onMessage simply never fires.
 */
export function useDeckChannel(onMessage: (msg: DeckSyncMessage) => void) {
  const channelRef = useRef<BroadcastChannel | null>(null);
  const handlerRef = useRef(onMessage);
  handlerRef.current = onMessage;

  useEffect(() => {
    if (typeof window === "undefined" || !("BroadcastChannel" in window)) {
      return;
    }
    const channel = new BroadcastChannel(DECK_SYNC_CHANNEL);
    channelRef.current = channel;
    const listener = (event: MessageEvent<DeckSyncMessage>) => {
      handlerRef.current(event.data);
    };
    channel.addEventListener("message", listener);
    return () => {
      channel.removeEventListener("message", listener);
      channel.close();
      channelRef.current = null;
    };
  }, []);

  const postIndex = (index: number) => {
    channelRef.current?.postMessage({
      type: "index",
      index,
    } satisfies DeckSyncMessage);
  };

  const postHello = () => {
    channelRef.current?.postMessage({ type: "hello" } satisfies DeckSyncMessage);
  };

  return { postIndex, postHello };
}
