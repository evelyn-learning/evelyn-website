import Image from "next/image";
import { SlideShell } from "@/components/showcase-deck/SlideShell";

const SHOTS = [
  { src: "academy-lessons.png", label: "Lessons — by phase, with Study / Resume" },
  { src: "academy-practice.png", label: "Practice — homework from the tutor, drills by objective" },
  { src: "academy-quizzes.png", label: "Quizzes and unit tests — timed, with history" },
  { src: "academy-notes.png", label: "Notes — from each session, printable revision sheet" },
];

export default function StudentExperience() {
  return (
    <SlideShell kicker="What the student sees" title="One workspace per program" subtitle="Lessons, practice, quizzes, mock exams, notes and replays of every session — on a laptop or a phone, under your brand.">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {SHOTS.map((s) => (
          <figure key={s.src} className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
            <Image src={`/showcase/united-trade-school/${s.src}`} alt={s.label} width={1200} height={800} className="h-auto w-full" />
            <figcaption className="px-3 py-2 text-xs text-slate-400">{s.label}</figcaption>
          </figure>
        ))}
      </div>
    </SlideShell>
  );
}
