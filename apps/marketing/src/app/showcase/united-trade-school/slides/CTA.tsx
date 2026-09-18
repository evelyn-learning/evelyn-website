import { SlideShell } from "@/components/showcase-deck/SlideShell";

export default function CTA() {
  return (
    <SlideShell align="center">
      <h2 className="font-heading max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
        Send us Phase 2. We&apos;ll have a pilot course ready in a week.
      </h2>
      <p className="mt-8 max-w-2xl text-xl text-slate-300 md:text-2xl">
        Then your students tell us whether it works — with completion and mock scores, not a sales deck.
      </p>
      <p className="mt-12 text-base text-slate-400">
        praveen@evelynlearning.com &middot; evelynlearning.com/products/academy
      </p>
    </SlideShell>
  );
}
