"use client";

import { useEffect, useRef } from "react";

export type DeckSyncMessage = { type: "index"; index: number } | { type: "hello" };

/**
 * Thin wrapper around BroadcastChannel(channel) — see src/app/showcase/nahq/lib/deckSync.ts
 * for the protocol. Whichever window changes slide broadcasts { index }; the
 * other applies it. A window may broadcast { hello } on mount and any peer
 * replies with its index, so whichever tab opened second catches up.
 * Never throws: without BroadcastChannel the posts are no-ops.
 */
export function useDeckChannel(channel: string, onMessage: (msg: DeckSyncMessage) => void) {
  const channelRef = useRef<BroadcastChannel | null>(null);
  const handlerRef = useRef(onMessage);
  handlerRef.current = onMessage;

  useEffect(() => {
    if (typeof window === "undefined" || !("BroadcastChannel" in window)) return;
    const bc = new BroadcastChannel(channel);
    channelRef.current = bc;
    const listener = (event: MessageEvent<DeckSyncMessage>) => handlerRef.current(event.data);
    bc.addEventListener("message", listener);
    return () => {
      bc.removeEventListener("message", listener);
      bc.close();
      channelRef.current = null;
    };
  }, [channel]);

  const postIndex = (index: number) => {
    channelRef.current?.postMessage({ type: "index", index } satisfies DeckSyncMessage);
  };
  const postHello = () => {
    channelRef.current?.postMessage({ type: "hello" } satisfies DeckSyncMessage);
  };
  return { postIndex, postHello };
}
