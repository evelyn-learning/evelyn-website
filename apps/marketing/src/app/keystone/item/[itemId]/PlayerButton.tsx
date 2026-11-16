"use client";

import { useEffect, useRef, useState } from "react";

/**
 * "▶ Play animated solution": opens the item's voiced player in a window over
 * the review page (a dialog, not a browser popup — popups get blocked, hide
 * behind the main window and open as full tabs on tablets). Closing it unloads
 * the player, so the audio stops. "Open in its own window" is there for anyone
 * who wants it beside the review page.
 */
export function PlayerButton({ src, itemId, height, voice, note }: { src: string; itemId: string; height: number; voice?: string; note?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const popOut = () => {
    const w = 780;
    const h = height + 40;
    const left = Math.max(0, window.screenX + (window.outerWidth - w) / 2);
    const top = Math.max(0, window.screenY + (window.outerHeight - h) / 2);
    window.open(src, `ks-player-${itemId}`, `popup=yes,width=${w},height=${h},left=${left},top=${top}`);
    setOpen(false);
  };

  return (
    <>
      <button type="button" className="ks-btn ks-play" onClick={() => setOpen(true)}>
        <span aria-hidden="true">▶</span> Play animated solution
      </button>
      <dialog
        ref={dialog}
        className="ks-player"
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === dialog.current) setOpen(false);
        }}
        aria-label={`Animated solution for item ${itemId}`}
      >
        <div className="ks-player-head">
          <div>
            <b>Animated solution · item {itemId}</b>
            {(voice || note) && (
              <span className="ks-player-sub">
                {voice ? ` · voice: ${voice}` : ""}
                {note ? ` · ${note}` : ""}
              </span>
            )}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button type="button" className="ks-linkbtn" onClick={popOut}>
              Open in its own window ↗
            </button>
            <button type="button" className="ks-btn" onClick={() => setOpen(false)} aria-label="Close" style={{ padding: "2px 10px" }}>
              ✕ <kbd>Esc</kbd>
            </button>
          </div>
        </div>
        {open && (
          <iframe
            src={src}
            title={`Animated solution for item ${itemId}`}
            style={{ height }}
            allow="autoplay"
            onLoad={(e) => {
              // Same origin: Esc pressed inside the player closes it too.
              try {
                e.currentTarget.contentWindow?.addEventListener("keydown", (k) => {
                  if (k.key === "Escape") setOpen(false);
                });
              } catch {}
            }}
          />
        )}
      </dialog>
    </>
  );
}
