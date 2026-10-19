"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Mic, X } from "lucide-react";
import { SlideShell } from "@/components/showcase-deck/SlideShell";
import { GDI_LESSON_LIST, type GdiLesson, type GdiLessonKey } from "../_lib/lessons";

type Open = { lesson: GdiLesson; url: string };

/**
 * The live-demo slide. Each button mints a fresh demo-engine session
 * (api/showcase/gdi/mint — a new learner every click, so the tutor never
 * opens as a returning student) and shows the embed INSIDE the deck, in a
 * full-screen overlay. The overlay sits above the deck's click zones and
 * chrome, and swallows the deck's keyboard navigation while it is open
 * (Escape closes it). Nothing is mounted until a button is pressed: an
 * embed page costs a brain call the moment it loads.
 */
export default function LiveDemo() {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState<GdiLessonKey | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<Open | null>(null);

  const start = useCallback(async (lesson: GdiLesson) => {
    setBusy(lesson.key);
    setError(null);
    try {
      const res = await fetch("/api/showcase/gdi/mint", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ lesson: lesson.key, studentName: name }),
      });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error || `Could not start the lesson (${res.status}).`);
      setOpen({ lesson, url: data.url });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start the lesson.");
    } finally {
      setBusy(null);
    }
  }, [name]);

  // While the lesson is open, the deck must not page on Space / arrows typed
  // into it; Escape closes. Capture phase, so this runs before Deck's listener.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(null); return; }
      e.stopImmediatePropagation();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open]);

  return (
    <SlideShell kicker="Live demo" title="Three lessons from your material. Pick one." subtitle="Each button starts a real session on the demo engine with a fresh learner. Allow the microphone when the browser asks, then tap Start and speak at a normal pace.">
      {/* z-30: above the deck's left/right click zones (z-20), so the controls take the click. */}
      <div className="relative z-30 w-full">
        <label className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <span className="text-sm font-medium text-slate-300">Learner&apos;s name <span className="text-slate-500">(the tutor uses it)</span></span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.stopPropagation()}
            placeholder="e.g. Sato Kenji"
            maxLength={40}
            className="w-full max-w-xs rounded-xl border border-white/15 bg-slate-900/70 px-4 py-2.5 text-base text-white placeholder:text-slate-500 focus:border-primary-400 focus:outline-none"
          />
        </label>
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          {GDI_LESSON_LIST.map((l) => (
            <div key={l.key} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-200">{l.audience}</p>
              <p className="mt-2 text-xl font-semibold text-white">{l.title}</p>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-300">{l.description}</p>
              <p className="mt-3 text-xs text-slate-500">About {l.minutes} minutes · teacher: {l.teacher.name}</p>
              <button
                type="button"
                onClick={() => start(l)}
                disabled={busy !== null}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
              >
                {busy === l.key ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mic className="h-4 w-4" />}
                {busy === l.key ? "Starting…" : "Start this lesson"}
              </button>
            </div>
          ))}
        </div>
        {error && <p className="mt-4 text-sm text-rose-300">{error}</p>}
      </div>

      {open && (
        <div className="fixed inset-0 z-[80] flex flex-col bg-slate-950">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-6">
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-white">{open.lesson.title}</p>
              <p className="truncate text-xs text-slate-400">Teacher: {open.lesson.teacher.name} · allow the microphone, tap Start, speak normally · Esc or Close to end</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(null)}
              className="inline-flex flex-shrink-0 items-center gap-2 rounded-lg border border-white/15 px-3 py-1.5 text-sm text-slate-200 transition-colors hover:border-white/30 hover:text-white"
            >
              <X className="h-4 w-4" /> Close
            </button>
          </div>
          <iframe
            key={open.url}
            src={open.url}
            title={`${open.lesson.title} — live lesson`}
            allow="microphone; autoplay; camera"
            className="h-full w-full flex-1 border-0 bg-white"
          />
        </div>
      )}
    </SlideShell>
  );
}
