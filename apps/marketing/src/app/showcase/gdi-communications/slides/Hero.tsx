import { SlideShell } from "@/components/showcase-deck/SlideShell";

export default function Hero() {
  return (
    <SlideShell align="center">
      <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-medium text-primary-200">
        Prepared for GDI Communications
      </span>
      <h1 className="font-heading mt-7 max-w-5xl text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[4.2rem]">
        English your learners actually speak — with a tutor who explains in Japanese.
      </h1>
      <p className="mt-8 max-w-3xl text-xl leading-relaxed text-slate-300 md:text-2xl">
        A voice tutor built on GDI&apos;s own course material: it listens, answers in about a second,
        guides in Japanese when it helps, and gets the learner speaking English from the first minute.
      </p>
      <p className="mt-4 text-lg text-slate-400">日本語でサポートしながら、英語を「話す」練習をするAIチューター。</p>
    </SlideShell>
  );
}
