import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SlideShell } from "../SlideShell";

export default function Hero() {
  return (
    <SlideShell align="center">
      <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-medium text-primary-200">
        Prepared for NAHQ
      </span>
      <h1 className="font-heading mt-7 max-w-5xl text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[4.2rem]">
        Adaptive CPHQ preparation, built on NAHQ&apos;s own blueprint.
      </h1>
      <p className="mt-8 max-w-3xl text-xl leading-relaxed text-slate-300 md:text-2xl">
        Custom development is our core model, not a side offering — we build
        adaptive learning systems around a partner&apos;s credential rather
        than fit you into a fixed catalog. This is what that looks like for
        the CPHQ.
      </p>

      <Link
        href="/press/time-top-edtech-2026"
        className="group mt-12 inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-300">
          Recognition
        </span>
        <span>
          TIME 2026: Ranked #9 in America&apos;s Top EdTech &middot; #35 in
          the World
        </span>
        <ArrowRight className="hidden h-3.5 w-3.5 text-primary-300 transition-transform group-hover:translate-x-1 sm:inline-block" />
      </Link>
    </SlideShell>
  );
}
