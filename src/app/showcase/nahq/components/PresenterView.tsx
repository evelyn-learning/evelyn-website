"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { SLIDES } from "./slides";
import { SPEAKER_NOTES } from "./speaker-notes";
import { useDeckChannel } from "../lib/deckSync";

function formatElapsed(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * The presenter/teleprompter window — mirrors Google Slides' presenter
 * view. Meant to be open in its own tab/window (never shared over Meet)
 * while the audience-facing deck (Deck.tsx) is the tab actually screen
 * shared. Stays in sync with the deck over BroadcastChannel('nahq-deck-
 * sync') and can drive it directly with its own arrow keys / buttons.
 */
export default function PresenterView() {
  const total = SLIDES.length;
  const [index, setIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  const goNext = useCallback(
    () => setIndex((i) => Math.min(i + 1, total - 1)),
    [total]
  );
  const goPrev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);

  const { postIndex, postHello } = useDeckChannel((msg) => {
    if (msg.type === "hello") {
      postIndex(index);
    } else if (msg.type === "index" && msg.index !== index) {
      setIndex(Math.min(Math.max(msg.index, 0), total - 1));
    }
  });

  // On open, ask whoever's already on the channel (almost always the deck
  // tab) where it currently is, so a presenter window opened mid-talk lands
  // on the right slide instead of resetting to the first one.
  useEffect(() => {
    postHello();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    postIndex(index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case " ":
        case "PageDown":
          e.preventDefault();
          goNext();
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          goPrev();
          break;
        default:
          break;
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev]);

  const slide = SLIDES[index];
  const nextSlide = index < total - 1 ? SLIDES[index + 1] : null;
  const notes = SPEAKER_NOTES[index] ?? [];

  return (
    <div className="flex h-screen w-screen flex-col bg-slate-950 text-white">
      {/* Top bar — current slide number + title, elapsed timer */}
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-4 sm:px-10">
        <div className="min-w-0">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary-300">
            Slide {index + 1} / {total}
          </p>
          <h1 className="font-heading mt-1 truncate text-xl font-bold leading-snug text-white sm:text-2xl">
            {slide.title}
          </h1>
        </div>
        <div
          className="flex flex-shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-sm text-slate-300"
          aria-label="Elapsed time since presenter view opened"
        >
          <Clock className="h-4 w-4 text-slate-500" />
          {formatElapsed(elapsed)}
        </div>
      </div>

      {/* Speaker notes — large type, meant to be readable at a glance */}
      <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-10">
        <div className="mx-auto max-w-3xl space-y-5">
          {notes.length > 0 ? (
            notes.map((paragraph, i) => (
              <p
                key={i}
                className="text-xl leading-relaxed text-slate-100 sm:text-2xl"
              >
                {paragraph}
              </p>
            ))
          ) : (
            <p className="text-xl italic text-slate-500 sm:text-2xl">
              No notes for this slide.
            </p>
          )}
        </div>
      </div>

      {/* Next-slide preview + prev/next nav */}
      <div className="border-t border-white/10 px-6 py-4 sm:px-10">
        <p className="mb-3 truncate text-sm text-slate-500">
          {nextSlide ? (
            <>
              Next:{" "}
              <span className="text-slate-300">{nextSlide.title}</span>
            </>
          ) : (
            "Last slide"
          )}
        </p>
        <div className="flex items-center justify-between">
          <button
            aria-label="Previous slide"
            onClick={goPrev}
            disabled={index === 0}
            className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm text-slate-200 transition-colors hover:border-white/30 disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </button>
          <button
            aria-label="Next slide"
            onClick={goNext}
            disabled={index === total - 1}
            className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm text-slate-200 transition-colors hover:border-white/30 disabled:opacity-30"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
