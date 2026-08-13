"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, LayoutGrid, X } from "lucide-react";
import { SLIDES } from "./slides";
import { useDeckChannel } from "../lib/deckSync";
import "./deck-print.css";

/** Fired once per slide the viewer actually lands on — including the first,
 *  and including slides reached via the overview grid or the presenter
 *  window's arrow keys. The page owns what to do with it (analytics); Deck
 *  stays a dumb reporter so nothing here depends on tracking being wired. */
export default function Deck({ onSlideView }: { onSlideView?: (index: number) => void }) {
  const total = SLIDES.length;
  const [index, setIndex] = useState(0);
  const [overview, setOverview] = useState(false);

  const goNext = useCallback(
    () => setIndex((i) => Math.min(i + 1, total - 1)),
    [total]
  );
  const goPrev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);

  // Presenter-view sync (BroadcastChannel('nahq-deck-sync')). The deck is the
  // audience-facing tab shared in Meet — it both announces its own slide
  // changes and obeys navigation driven from the presenter/teleprompter
  // window, so either window's arrow keys move both.
  const { postIndex } = useDeckChannel((msg) => {
    if (msg.type === "hello") {
      postIndex(index);
    } else if (msg.type === "index" && msg.index !== index) {
      setIndex(Math.min(Math.max(msg.index, 0), total - 1));
    }
  });

  useEffect(() => {
    postIndex(index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // Report the landed-on slide. Keyed on `index` alone so a re-render from
  // any other state (the overview toggle) doesn't re-report the same slide;
  // `onSlideView` is deliberately not a dependency, since a caller passing an
  // unmemoized callback would otherwise turn every render into an event.
  useEffect(() => {
    onSlideView?.(index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (overview) {
        if (e.key === "Escape") setOverview(false);
        return;
      }
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
        case "Escape":
          setOverview(true);
          break;
        case "Home":
          setIndex(0);
          break;
        case "End":
          setIndex(total - 1);
          break;
        default:
          break;
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [overview, goNext, goPrev, total]);

  if (overview) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950 p-6 md:p-12">
        <div className="mx-auto mb-8 flex max-w-6xl items-center justify-between">
          <h1 className="font-heading text-2xl font-bold text-white">
            All slides
          </h1>
          <button
            onClick={() => setOverview(false)}
            className="flex items-center gap-2 rounded-lg border border-white/15 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:border-white/30 hover:text-white"
          >
            <X className="h-4 w-4" /> Close (Esc)
          </button>
        </div>
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => {
                setIndex(i);
                setOverview(false);
              }}
              className={[
                "flex aspect-video flex-col justify-between rounded-xl border-2 bg-slate-900 p-4 text-left transition-colors",
                i === index
                  ? "border-primary-400"
                  : "border-white/10 hover:border-white/30",
              ].join(" ")}
            >
              <span className="font-mono text-xs text-slate-500">
                {s.kicker}
              </span>
              <span className="text-sm font-semibold leading-snug text-white">
                {s.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="nahq-deck-root relative h-screen w-screen overflow-hidden bg-slate-950">
      {SLIDES.map((s, i) => {
        const Slide = s.Component;
        return (
          <div
            key={s.id}
            className={`nahq-slide-page h-full w-full ${
              i === index ? "nahq-slide-active" : ""
            }`}
          >
            <Slide />
          </div>
        );
      })}

      {/* Click zones — left third = previous, right third = next */}
      <button
        aria-label="Previous slide"
        onClick={goPrev}
        disabled={index === 0}
        className="nahq-deck-chrome group absolute inset-y-0 left-0 z-20 w-1/3 cursor-w-resize disabled:cursor-default"
      />
      <button
        aria-label="Next slide"
        onClick={goNext}
        disabled={index === total - 1}
        className="nahq-deck-chrome group absolute inset-y-0 right-0 z-20 w-1/3 cursor-e-resize disabled:cursor-default"
      />

      {/* Presenter-view hint — first slide only, unobtrusive corner link.
          Opens in a new tab so a presenter sharing just this tab in Meet can
          set up their teleprompter window before or during the call. */}
      {index === 0 && (
        <a
          href="/showcase/nahq/presenter"
          target="_blank"
          rel="noopener noreferrer"
          className="nahq-deck-chrome pointer-events-auto absolute right-5 top-5 z-30 text-xs text-slate-600 transition-colors hover:text-slate-400"
        >
          Presenter view
        </a>
      )}

      {/* Chrome: arrows, counter, overview toggle */}
      <div className="nahq-deck-chrome pointer-events-none absolute inset-x-0 bottom-0 z-30 flex items-center justify-between px-6 pb-5">
        <button
          aria-label="Previous slide"
          onClick={goPrev}
          disabled={index === 0}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-slate-900/70 text-white backdrop-blur-sm transition-opacity hover:border-white/30 disabled:opacity-30"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/10 bg-slate-900/70 px-4 py-1.5 backdrop-blur-sm">
          <button
            aria-label="Show all slides"
            onClick={() => setOverview(true)}
            className="text-slate-400 transition-colors hover:text-white"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <span className="font-mono text-xs text-slate-400">
            {index + 1} / {total}
          </span>
        </div>

        <button
          aria-label="Next slide"
          onClick={goNext}
          disabled={index === total - 1}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-slate-900/70 text-white backdrop-blur-sm transition-opacity hover:border-white/30 disabled:opacity-30"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
