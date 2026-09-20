import { SlideShell } from "@/components/showcase-deck/SlideShell";

export default function Hero() {
  return (
    <SlideShell align="center">
      <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-medium text-primary-200">
        Prepared for United Trade School
      </span>
      <h1 className="font-heading mt-7 max-w-5xl text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[4.2rem]">
        Your programs, taught one-on-one — without reading the textbook.
      </h1>
      <p className="mt-8 max-w-3xl text-xl leading-relaxed text-slate-300 md:text-2xl">
        Evelyn Academy turns your Pharmacy Technician and Medical Administrative
        Assistant programs into tutor-led lessons, exam practice and progress
        tracking, under the United Trade School brand.
      </p>
    </SlideShell>
  );
}
