"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// The item page's "← <list>" link goes back to the list the reader came from
// (Approved, Waiting for review, Physics…), not a fixed page. Each list page
// remembers itself for this browser tab; it survives next/prev and the
// auto-advance after a verdict. Overview and All items are in the top bar.

const KEY = "ks_back";

/** Placed on every list page: records where "back" should go and what to call it. */
export function RememberList({ label }: { label: string }) {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify({ href: `${pathname}${search ? `?${search}` : ""}`, label }));
    } catch {}
  }, [pathname, search, label]);
  return null;
}

export function BackLink({ fallback }: { fallback: { href: string; label: string } }) {
  const [back, setBack] = useState(fallback);
  useEffect(() => {
    try {
      const v = JSON.parse(sessionStorage.getItem(KEY) || "null");
      if (v?.href && v?.label) setBack(v);
    } catch {}
  }, []);
  return (
    <div className="ks-crumbs">
      <Link href={back.href}>← {back.label}</Link>
    </div>
  );
}
