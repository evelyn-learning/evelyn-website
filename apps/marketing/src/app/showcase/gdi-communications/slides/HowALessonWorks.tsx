import { SlideShell } from "@/components/showcase-deck/SlideShell";

const STEPS = [
  { n: "1", title: "Warm-up", ja: "ウォームアップ", text: "One question about the learner's own week. The tutor hears how much English they have and sets the amount of Japanese." },
  { n: "2", title: "The point", ja: "ポイント", text: "The pattern of the day, in two sentences of Japanese and one English example on the board. No lecture." },
  { n: "3", title: "You try", ja: "やってみよう", text: "The learner builds the sentence first. Stuck? The tutor gives the first word. Only then does it say the full model sentence." },
  { n: "4", title: "You try again", ja: "もう一度", text: "A second round on the learner's own life: who, where, when. A correct short answer is stretched with one more detail." },
  { n: "5", title: "Recap", ja: "まとめ", text: "The two or three sentences they can now say, said once more. Then the tutor closes the lesson; it never drifts on." },
];

const RULES = [
  "The learner produces before the tutor models.",
  "Corrections are about what was said: word choice, grammar, word order. Never about pronunciation, which the tutor cannot hear.",
  "A question answered correctly is finished. It is not asked again.",
  "The learner can say 「ちょっと待ってください」 and the tutor waits; 「画面が見えないです」 and it teaches by voice alone.",
];

export default function HowALessonWorks() {
  return (
    <SlideShell kicker="The lesson" title="Fifteen minutes, five beats, the learner talking most of the time">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <ol className="space-y-3 lg:col-span-3">
          {STEPS.map((s) => (
            <li key={s.n} className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary-500/20 font-mono text-sm font-bold text-primary-200">{s.n}</span>
              <div>
                <p className="text-base font-semibold text-white">{s.title} <span className="ml-2 text-sm font-normal text-slate-400">{s.ja}</span></p>
                <p className="mt-1 text-sm leading-relaxed text-slate-300">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="rounded-2xl border border-primary-400/30 bg-primary-500/10 p-6 lg:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-200">House rules the tutor keeps</p>
          <ul className="mt-4 space-y-3">
            {RULES.map((r) => (
              <li key={r} className="flex items-start gap-3 text-base leading-relaxed text-slate-200">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-300" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SlideShell>
  );
}
