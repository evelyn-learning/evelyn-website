'use client';

/**
 * Annotated Passage Renderer
 *
 * Displays a reading passage with line numbers, highlighted text spans, and
 * margin notes — the core ELA teaching artifact for close reading, literary
 * analysis, rhetoric, and SAT/ACT reading comprehension.
 *
 * Highlights reference text by line + text snippet (the first occurrence in
 * that line is highlighted). Margin notes attach to a specific line and are
 * rendered in a right-hand gutter with a connector line to the target line.
 */

import React from 'react';

export interface PassageHighlight {
  line: number; // 1-based
  text: string; // Substring to highlight within the line
  color?: string; // CSS color
  note?: string; // Optional inline note (shown below table)
}

export interface PassageMarginNote {
  line: number; // 1-based
  text: string;
}

export interface AnnotatedPassageRendererProps {
  title?: string;
  source?: string; // e.g. "Frankenstein, Mary Shelley, Chapter 5"
  /** Full passage as a single string; will be split on newlines into lines. */
  passage?: string;
  /** Alternative: already-split lines. */
  lines?: string[];
  startLineNumber?: number; // defaults to 1
  highlights?: PassageHighlight[];
  marginNotes?: PassageMarginNote[];
}

/** Split a highlight-annotated line into plain and highlighted segments. */
function segmentLine(
  text: string,
  highlights: PassageHighlight[]
): Array<{ text: string; color?: string }> {
  if (highlights.length === 0) return [{ text }];

  // Find all highlight ranges
  const ranges: Array<{ start: number; end: number; color?: string }> = [];
  for (const h of highlights) {
    const idx = text.indexOf(h.text);
    if (idx >= 0) {
      ranges.push({ start: idx, end: idx + h.text.length, color: h.color });
    }
  }

  if (ranges.length === 0) return [{ text }];

  // Merge overlapping ranges (last color wins)
  ranges.sort((a, b) => a.start - b.start);
  const merged: typeof ranges = [];
  for (const r of ranges) {
    const last = merged[merged.length - 1];
    if (last && r.start <= last.end) {
      last.end = Math.max(last.end, r.end);
      last.color = r.color ?? last.color;
    } else {
      merged.push({ ...r });
    }
  }

  // Walk the string, producing alternating plain / highlighted segments
  const segs: Array<{ text: string; color?: string }> = [];
  let cursor = 0;
  for (const r of merged) {
    if (cursor < r.start) segs.push({ text: text.slice(cursor, r.start) });
    segs.push({ text: text.slice(r.start, r.end), color: r.color || '#fef08a' });
    cursor = r.end;
  }
  if (cursor < text.length) segs.push({ text: text.slice(cursor) });
  return segs;
}

export default function AnnotatedPassageRenderer({
  title,
  source,
  passage,
  lines: linesProp,
  startLineNumber = 1,
  highlights = [],
  marginNotes = [],
}: AnnotatedPassageRendererProps) {
  const lines: string[] = linesProp
    ? linesProp
    : passage
    ? passage.split(/\r?\n/)
    : [];

  // Group highlights by line number for per-line segmentation
  const highlightsByLine = new Map<number, PassageHighlight[]>();
  for (const h of highlights) {
    const list = highlightsByLine.get(h.line) || [];
    list.push(h);
    highlightsByLine.set(h.line, list);
  }

  const notesByLine = new Map<number, string[]>();
  for (const n of marginNotes) {
    const list = notesByLine.get(n.line) || [];
    list.push(n.text);
    notesByLine.set(n.line, list);
  }

  const notedHighlights = highlights.filter((h) => h.note);

  return (
    <div className="annotated-passage-renderer bg-amber-50/40 rounded-lg border border-amber-200 p-4">
      {title && (
        <h4 className="text-sm font-semibold text-gray-800 mb-1">{title}</h4>
      )}
      {source && (
        <div className="text-xs text-gray-500 italic mb-3">{source}</div>
      )}

      <div className="grid grid-cols-[2.5rem_1fr_14rem] gap-x-3 text-[15px] leading-7 font-serif">
        {lines.map((lineText, i) => {
          const lineNum = startLineNumber + i;
          const segs = segmentLine(lineText, highlightsByLine.get(lineNum) || []);
          const notes = notesByLine.get(lineNum) || [];

          return (
            <React.Fragment key={i}>
              <div className="text-right text-xs text-gray-400 pt-1 pr-2 select-none font-mono">
                {lineNum}
              </div>
              <div className="text-gray-800">
                {segs.map((seg, j) =>
                  seg.color ? (
                    <span
                      key={j}
                      style={{ backgroundColor: seg.color, padding: '0 2px' }}
                    >
                      {seg.text}
                    </span>
                  ) : (
                    <span key={j}>{seg.text}</span>
                  )
                )}
                {lineText.length === 0 && <>&nbsp;</>}
              </div>
              <div className="text-xs text-gray-600 pt-1 border-l border-amber-200 pl-2 space-y-0.5">
                {notes.map((n, k) => (
                  <div key={k} className="italic">
                    {n}
                  </div>
                ))}
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {notedHighlights.length > 0 && (
        <div className="mt-4 pt-3 border-t border-amber-200 text-xs text-gray-700 space-y-1">
          <div className="font-semibold text-gray-600 uppercase tracking-wide mb-1">
            Notes on highlighted passages
          </div>
          {notedHighlights.map((h, i) => (
            <div key={i}>
              <span
                className="inline-block mr-1 px-1 font-medium"
                style={{ backgroundColor: h.color || '#fef08a' }}
              >
                {h.text}
              </span>
              <span className="text-gray-600">— {h.note}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
