"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Reloads the page's server data every `seconds` while it is mounted and the tab is visible (a build in progress). */
export function AutoRefresh({ seconds = 10 }: { seconds?: number }) {
  const router = useRouter();
  useEffect(() => {
    const t = setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, seconds * 1000);
    return () => clearInterval(t);
  }, [router, seconds]);
  return null;
}
