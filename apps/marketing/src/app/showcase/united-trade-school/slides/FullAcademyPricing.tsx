import { SlideShell } from "@/components/showcase-deck/SlideShell";

const ROWS = [
  ["Platform setup", "$2,500 one-time", "Branded academy on your domain, hosting, admin accounts, tutor persona, onboarding"],
  ["Curriculum adaptation", "$6,000 Pharmacy Tech · $3,500 Medical Admin", "Up to 60 / 35 lessons with practice sets, notes and mock exam forms. Content belongs to you."],
  ["Platform licence", "$1,800 per year", "Hosting, support, updates, admin dashboard, weekly reports"],
  ["Per student, per program", "$149 (1–100) · $119 (101–500) · $99 (501+)", "Includes a pooled tutor allowance of 240 minutes per student, plus unlimited practice, quizzes, mocks, notes and replays"],
  ["Top-up", "$1,500 per 10,000 pooled minutes", "Only if the cohort's pool runs out"],
];

export default function FullAcademyPricing() {
  return (
    <SlideShell kicker="Full Academy" title="What it costs, in one table" subtitle="Year one for 100 students across both programs is about $28,700; from year two, about $16,700. At 30 students, year one is about $18,300.">
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.06] text-xs uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-5 py-3">Line</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Covers</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([a, b, c]) => (
              <tr key={a} className="border-t border-white/10">
                <td className="px-5 py-3 font-semibold text-white">{a}</td>
                <td className="px-5 py-3 font-mono text-primary-200">{b}</td>
                <td className="px-5 py-3 text-slate-400">{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SlideShell>
  );
}
