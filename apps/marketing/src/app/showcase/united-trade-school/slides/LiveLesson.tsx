import Image from "next/image";
import { Mic, PenLine, MessageCircleQuestion, ClipboardCheck } from "lucide-react";
import { SlideShell } from "@/components/showcase-deck/SlideShell";

const WATCH = [
  { icon: Mic, text: "It teaches out loud and listens — a conversation, not a video" },
  { icon: PenLine, text: "The whiteboard does the pharmacy math step by step" },
  { icon: MessageCircleQuestion, text: "Wrong answers get corrected, not marked" },
  { icon: ClipboardCheck, text: "It ends by setting practice on what was hard" },
];

export default function LiveLesson() {
  return (
    <SlideShell kicker="Live demo" title="Dosage calculations — a lesson from your Phase 2" subtitle="Let's stop talking about it and do one. Pharmacy math is where students get stuck and where a whiteboard tutor earns its keep.">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
          <Image src="/showcase/united-trade-school/academy-live-session.png" alt="A live tutor lesson on the whiteboard" width={1600} height={900} className="h-auto w-full" priority />
          <p className="px-4 py-2 text-xs text-slate-500">A live whiteboard lesson (geometry, from a real session). Today&apos;s demo is pharmacy math, live.</p>
        </div>
        <ul className="lg:col-span-2 space-y-4">
          {WATCH.map((w) => (
            <li key={w.text} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <w.icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-300" />
              <span className="text-base text-slate-200">{w.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </SlideShell>
  );
}
