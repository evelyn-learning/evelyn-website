"use client";

import { useEffect } from "react";

/**
 * Keys on the item page for Evelyn on a held item (when not typing): S = Send to review, B = Send back
 * (opens the note box and puts the cursor in it). The review bar uses A, C, D, X, R, J, K.
 */
export function OwnerKeys() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement;
      if (t.tagName === "TEXTAREA" || t.tagName === "INPUT" || t.tagName === "SELECT") return;
      if (document.querySelector("dialog[open]")) return;
      const k = e.key.toLowerCase();
      if (k === "s") {
        const b = document.getElementById("ks-owner-send") as HTMLButtonElement | null;
        if (b && !b.disabled) {
          e.preventDefault();
          b.click();
        }
      } else if (k === "b") {
        const d = document.getElementById("ks-owner-back") as HTMLDetailsElement | null;
        const box = document.getElementById("ks-owner-note") as HTMLTextAreaElement | null;
        if (!d || !box) return;
        e.preventDefault();
        d.open = true;
        box.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return null;
}
