"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, LayoutGrid, X } from "lucide-react";
import { SLIDES } from "./slides";
import "./deck-print.css";

export default function Deck() {
  const total = SLIDES.length;
  const [index, setIndex] = useState(0);
  const [overview, setOverview] = useState(false);

  const goNext = useCallback(
    () => setIndex((i) => Math.min(i + 1, total - 1)),
    [total]
  );
  const goPrev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);

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
