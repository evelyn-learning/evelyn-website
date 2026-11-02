"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Patch = { noindex?: boolean; ctaProduct?: null; beaconLocked: true };

/**
 * Undo buttons for Beacon's blog actions. Both lock the post (`beaconLocked`)
 * so Beacon never touches it again. Goes through the existing admin blog API.
 */
export function BeaconActions({
  id,
  noindex,
  ctaProduct,
}: {
  id: string;
  noindex?: boolean;
  ctaProduct?: string | null;
}) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  if (!noindex && !ctaProduct) return null;

  const send = async (patch: Patch, confirmText: string) => {
    if (!confirm(confirmText)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (res.ok) router.refresh();
      else alert("Update failed");
    } catch {
      alert("Update failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {noindex && (
        <button
          type="button"
          disabled={busy}
          onClick={() =>
            send(
              { noindex: false, beaconLocked: true },
              "Restore this post to search (index + sitemap)? Beacon will not touch it again."
            )
          }
          className="rounded border border-green-300 px-2 py-0.5 text-xs font-medium text-green-700 hover:bg-green-50 disabled:opacity-50"
          title="Restore to search"
        >
          Restore
        </button>
      )}
      {ctaProduct && (
        <button
          type="button"
          disabled={busy}
          onClick={() =>
            send(
              { ctaProduct: null, beaconLocked: true },
              "Remove the product CTA from this post? Beacon will not touch it again."
            )
          }
          className="rounded border border-gray-300 px-2 py-0.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          title="Remove product CTA"
        >
          Remove CTA
        </button>
      )}
    </>
  );
}
