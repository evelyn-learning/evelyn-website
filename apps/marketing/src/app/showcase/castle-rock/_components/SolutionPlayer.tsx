"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useTrackInteraction } from "@/components/demos/DemoTrackingContext";
import { SHOWCASE } from "../_lib/config";
import { audioSrc, type Solution } from "../_lib/types";

type Mode = "voice" | "silent";

/**
 * Plays one stored solution: the steps appear in order, the figure builds
 * with them and the caption types out what the tutor says. With voice on,
 * each step lasts as long as its recorded clip. Nothing is generated here —
 * at rest the page simply shows the whole solution.
 */
export default function SolutionPlayer({ solution }: { solution: Solution }) {
  const { steps, Figure } = solution;
  const [step, setStep] = useState(-1); // -1 = at rest
  const [paused, setPaused] = useState(false);
  const [typed, setTyped] = useState(solution.summary);
  const [mode, setMode] = useState<Mode>("voice");
  const [played, setPlayed] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepRef = useRef(-1);
  const pausedRef = useRef(false);
  const modeRef = useRef<Mode>("voice");
  const stepEls = useRef<(HTMLLIElement | null)[]>([]);
  // Caption being typed: kept in a ref so Pause can stop it and Resume can carry on from the same character.
  const typingRef = useRef({ text: "", n: 0, ms: 28 });
  // True while the current step runs on a timer instead of a voice clip.
  const timedRef = useRef(false);
  const track = useTrackInteraction();

  const clearTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (typerRef.current) clearInterval(typerRef.current);
    timerRef.current = null;
    typerRef.current = null;
  };

  const silence = () => {
    const a = audioRef.current;
    if (!a) return;
    a.onended = null;
    a.onloadedmetadata = null;
    a.pause();
  };

  // Stop everything if the viewer leaves the page mid-playback.
  useEffect(
    () => () => {
      clearTimers();
      silence();
    },
    [],
  );

  const resumeTyping = () => {
    if (typerRef.current) clearInterval(typerRef.current);
    typerRef.current = null;
    const t = typingRef.current;
    if (pausedRef.current || t.n >= t.text.length) return;
    typerRef.current = setInterval(() => {
      t.n += 1;
      setTyped(t.text.slice(0, t.n));
      if (t.n >= t.text.length && typerRef.current) clearInterval(typerRef.current);
    }, t.ms);
  };

  const typeOut = (text: string, msPerChar: number) => {
    typingRef.current = { text, n: 0, ms: msPerChar };
    setTyped("");
    resumeTyping();
  };

  const finish = (completed: boolean) => {
    clearTimers();
    silence();
    stepRef.current = -1;
    pausedRef.current = false;
    setStep(-1);
    setPaused(false);
    setTyped(solution.summary);
    setPlayed(true);
    if (completed) track("click", "Walkthrough finished", { itemId: solution.itemId, mode: modeRef.current });
  };

  const run = (k: number) => {
    clearTimers();
    silence();
    stepRef.current = k;
    setStep(k);
    setTyped("");
    const caption = steps[k].caption;
    const next = () => (k + 1 < steps.length ? run(k + 1) : finish(true));
    timedRef.current = false;
    const timed = () => {
      timedRef.current = true;
      typeOut(caption, 28);
      timerRef.current = setTimeout(next, Math.max(6500, caption.length * 55));
    };

    if (modeRef.current === "voice") {
      const a = audioRef.current ?? (audioRef.current = new Audio());
      a.onloadedmetadata = () => typeOut(caption, Number.isFinite(a.duration) ? Math.max(12, (a.duration * 900) / caption.length) : 45);
      a.onended = () => {
        timerRef.current = setTimeout(next, 700);
      };
      a.src = audioSrc(solution.itemId, k);
      a.play().catch(() => {
        // Clip unavailable or blocked: keep the walkthrough going on a timer.
        if (stepRef.current !== k || pausedRef.current) return;
        a.onended = null;
        timed();
      });
    } else {
      timed();
    }

    if (typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches) {
      stepEls.current[k]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  };

  const start = (m: Mode) => {
    modeRef.current = m;
    setMode(m);
    pausedRef.current = false;
    setPaused(false);
    track("click", m === "voice" ? "Play with voice" : "Play without voice", { itemId: solution.itemId });
    run(0);
  };

  const togglePause = () => {
    const a = audioRef.current;
    if (!pausedRef.current) {
      pausedRef.current = true;
      setPaused(true);
      // Stop the voice, the caption and the step timer together.
      clearTimers();
      a?.pause();
      return;
    }
    pausedRef.current = false;
    setPaused(false);
    const k = stepRef.current;
    const goNext = () => (k + 1 < steps.length ? run(k + 1) : finish(true));
    if (timedRef.current) {
      const t = typingRef.current;
      resumeTyping();
      timerRef.current = setTimeout(goNext, (t.text.length - t.n) * t.ms + 2500);
    } else if (a && a.ended) {
      goNext();
    } else if (a && a.currentTime > 0) {
      resumeTyping();
      void a.play();
    } else {
      run(k);
    }
  };

  const playing = step >= 0;
  const revealed = !playing || step >= solution.revealAnswerAt;
  const figureStep = playing ? step : steps.length;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <div>
        <Link href={`${SHOWCASE.basePath}/solutions`} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-800">
          <ArrowLeft className="h-4 w-4" /> All sample solutions
        </Link>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium uppercase tracking-wider text-slate-500">
          <span>{solution.course}</span>
          <span>Item {solution.itemId}</span>
          <span>{solution.itemType}</span>
          <span className="rounded-full border border-primary-500 px-2.5 py-0.5 text-primary-600">AI solution</span>
        </div>
        <h1 className="mt-2 font-heading text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">{solution.title}</h1>
      </div>

      <section aria-label="Question" className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="text-[17px] leading-relaxed text-slate-900 [&_p]:mb-3 [&_p:last-child]:mb-0">{solution.question}</div>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {solution.options.map((o) => {
            const hit = revealed && o.correct;
            return (
              <li
                key={o.label}
                className={[
                  "relative flex min-w-0 items-center gap-3 rounded-lg border px-3 py-2 transition-colors duration-500",
                  hit ? "border-emerald-600 bg-emerald-50" : "border-slate-200",
                ].join(" ")}
              >
                <b className="text-sm font-semibold text-slate-500">{o.label}</b>
                <span className="min-w-0 text-slate-900">{o.content}</span>
                {hit && <span className="absolute -top-2.5 right-2 rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-semibold text-white">Correct</span>}
              </li>
            );
          })}
        </ul>
      </section>

      <div className="grid items-start gap-7 lg:grid-cols-2">
        <figure className="order-first m-0 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 lg:sticky lg:top-20 lg:order-last">
          <div className="cr-figure" role="img" aria-label={solution.figureAlt}>
            <Figure step={figureStep} playing={playing} />
          </div>
          <p className={["min-h-[6.5em] border-t border-slate-200 pt-3 text-[15px] leading-relaxed text-slate-900", playing && !paused ? "cr-caret" : ""].join(" ")}>
            {typed}
          </p>
          <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }} aria-hidden="true">
            {steps.map((_, i) => (
              <i key={i} className={["h-1 rounded-full transition-colors duration-500", !playing || i <= step ? "bg-primary-500" : "bg-slate-200"].join(" ")} />
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {playing ? (
              <>
                <button type="button" onClick={togglePause} className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-[15px] font-semibold text-white hover:bg-primary-600">
                  {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  {paused ? "Resume" : "Pause"}
                </button>
                <button type="button" onClick={() => finish(false)} className="rounded-lg border border-primary-500 px-4 py-2.5 text-[15px] font-semibold text-primary-600 hover:bg-primary-50">
                  Show full solution
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={() => start("voice")} className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-[15px] font-semibold text-white hover:bg-primary-600">
                  <Volume2 className="h-4 w-4" />
                  {played && mode === "voice" ? "Replay with voice" : "Play with voice"}
                </button>
                <button type="button" onClick={() => start("silent")} className="inline-flex items-center gap-2 rounded-lg border border-primary-500 px-4 py-2.5 text-[15px] font-semibold text-primary-600 hover:bg-primary-50">
                  <VolumeX className="h-4 w-4" />
                  Play without voice
                </button>
              </>
            )}
          </div>
        </figure>

        <ol className="m-0 flex list-none flex-col gap-1.5 p-0">
          {steps.map((s, i) => (
            <li
              key={s.title}
              ref={(el) => {
                stepEls.current[i] = el;
              }}
              className={[
                "grid grid-cols-[30px_minmax(0,1fr)] gap-3 rounded-xl p-3 transition-[opacity,background-color] duration-500",
                playing && i > step ? "invisible opacity-0" : "",
                playing && i === step ? "bg-primary-50" : "",
              ].join(" ")}
            >
              <span className="mt-0.5 grid h-7 w-7 place-items-center rounded-full border-[1.5px] border-primary-500 text-[13px] font-semibold text-primary-600">{i + 1}</span>
              <div>
                <h2 className="mb-1 font-heading text-[19px] font-semibold leading-snug text-slate-900">{s.title}</h2>
                <div className="max-w-[62ch] text-base leading-relaxed text-slate-800 [&_p]:mb-2 [&_p:last-child]:mb-0">{s.body}</div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
