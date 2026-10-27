"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { SHOWCASE } from "../../_lib/config";
import { findPremium, premiumSrc } from "../../_lib/premium";

/**
 * A premium solution is a self-contained page. It is shown here the way
 * SOLARO would show it: in a frame of fixed height on the item's own page.
 */
export default function PremiumSolutionPage() {
  const { itemId } = useParams<{ itemId: string }>();
  const p = findPremium(itemId);
  if (!p) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="font-heading text-2xl font-semibold text-slate-900">No premium solution for item {itemId}</h1>
        <p className="mt-3 text-slate-700">
          <Link href={`${SHOWCASE.basePath}/premium`} className="font-medium text-primary-600 hover:text-primary-800">See the premium solutions</Link>
        </p>
      </div>
    );
  }
  const src = premiumSrc(p.itemId);
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <Link href={`${SHOWCASE.basePath}/premium`} className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-800">
            <ArrowLeft className="h-4 w-4" /> Premium solutions
          </Link>
          <h1 className="mt-1 font-heading text-2xl font-semibold text-slate-900">{p.title}</h1>
          <p className="text-sm text-slate-600">
            {p.course} &middot; Item {p.itemId} &middot; {p.itemType} &middot; {p.topic} &middot; Voice: {p.voice}
          </p>
        </div>
        <a href={src} target="_blank" rel="noopener" className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-primary-400 hover:text-primary-700">
          Open on its own <ExternalLink className="h-4 w-4" />
        </a>
      </div>
      <iframe
        key={p.itemId}
        src={src}
        title={`Premium AI solution for item ${p.itemId}`}
        style={{ height: p.frameHeight }}
        className="w-full rounded-2xl border border-slate-300 bg-white"
      />
      <p className="text-xs text-slate-500">
        Shown in a frame {p.frameHeight} px tall, as it would sit inside a SOLARO solution panel. The page keeps the board and the caption in view while the voice plays; the written solution scrolls beside them on a wide screen and below them on a phone.
      </p>
    </div>
  );
}
