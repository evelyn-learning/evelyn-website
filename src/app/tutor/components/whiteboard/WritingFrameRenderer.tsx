'use client';

/**
 * WritingFrameRenderer — sentence stems and paragraph structure
 * scaffolds for elementary / middle-school writing instruction.
 *
 * Three kinds:
 *   - sentence_stems    list of starter prompts the student completes
 *   - paragraph_frame   topic / 3-detail / closing labelled boxes
 *   - five_paragraph    intro / 3-body / conclusion stack with thesis
 *                       and topic-sentence hints
 *
 * The student writes in the blanks; the brain reads the result via the
 * existing extract-homework path and reacts.
 *
 * Stems/hints are sentences by design, so every content string wraps to
 * tspan lines at the available width (greedy char-estimate wrap from
 * fraction-bar-layout, commit 009dc645) and the viewBox height grows to
 * fit — previously they rendered unwrapped and clipped at the 520u edge.
 */

import React from 'react';
// wrapLabel estimates at 13px; wrapAt() scales the pixel cap into estimator units.
import { wrapLabel } from './fraction-bar-layout';

const SVG_W = 520;
const SVG_H = 320;

/** Greedy wrap of `text` to lines that fit `maxWidth` at `fontSize`. */
function wrapAt(text: string, fontSize: number, maxWidth: number): string[] {
  return wrapLabel(text, (maxWidth * 13) / fontSize);
}

export type WritingFrameSpec =
  | {
      kind: 'sentence_stems';
      title?: string;
      stems: string[];
    }
  | {
      kind: 'paragraph_frame';
      title?: string;
      topicSentenceHint?: string;
      detailHints?: string[];
      closingHint?: string;
    }
  | {
      kind: 'five_paragraph';
      title?: string;
      thesisHint?: string;
      bodyTopics?: [string?, string?, string?];
    };

export default function WritingFrameRenderer({ spec }: { spec: WritingFrameSpec }) {
  const { content, height } =
    spec.kind === 'sentence_stems'
      ? renderStems(spec)
      : spec.kind === 'paragraph_frame'
        ? renderParagraph(spec)
        : renderFiveParagraph(spec);
  const viewHeight = Math.max(SVG_H, height);
  return (
    <div className="writing-frame-renderer">
      {spec.title && (
        <div className="text-center text-sm font-semibold text-gray-700 mb-1">{spec.title}</div>
      )}
      <svg viewBox={`0 0 ${SVG_W} ${viewHeight}`} className="w-full h-auto" style={{ maxWidth: SVG_W }}>
        <rect width={SVG_W} height={viewHeight} fill="#fafbfc" rx={4} />
        {content}
      </svg>
    </div>
  );
}

/** Multi-line stem/hint text: tspans stacked from the first baseline. */
function WrappedText({
  x,
  y,
  lines,
  lineH,
  fontSize,
  fill,
  fontStyle,
}: {
  x: number;
  y: number;
  lines: string[];
  lineH: number;
  fontSize: number;
  fill: string;
  fontStyle?: string;
}) {
  return (
    <text x={x} y={y} fontSize={fontSize} fill={fill} fontStyle={fontStyle}>
      {lines.map((line, li) => (
        <tspan key={li} x={x} dy={li === 0 ? 0 : lineH}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

function renderStems(spec: Extract<WritingFrameSpec, { kind: 'sentence_stems' }>): { content: JSX.Element; height: number } {
  const LINE_H = 18;
  const availW = SVG_W - 28 - 50; // text starts at x=50, right margin 28
  let cursor = 50;
  const blocks = spec.stems.map((s, i) => {
    const lines = wrapAt(s, 14, availW);
    const y = cursor;
    const ruleY = y + 18 + (lines.length - 1) * LINE_H + 14;
    cursor = ruleY + 18;
    return { lines, y, ruleY, key: i };
  });
  const content = (
    <g>
      <text x={20} y={28} fontSize={13} fontWeight={700} fill="#475569">Try one of these starters:</text>
      {blocks.map((b, i) => (
        <g key={b.key}>
          <text x={28} y={b.y + 18} fontSize={14} fontWeight={600} fill="#7c3aed">
            {i + 1}.
          </text>
          <WrappedText x={50} y={b.y + 18} lines={b.lines} lineH={LINE_H} fontSize={14} fill="#0f172a" />
          <line x1={50} y1={b.ruleY} x2={SVG_W - 28} y2={b.ruleY} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4,4" />
        </g>
      ))}
    </g>
  );
  return { content, height: cursor + 4 };
}

function renderParagraph(spec: Extract<WritingFrameSpec, { kind: 'paragraph_frame' }>): { content: JSX.Element; height: number } {
  const details = spec.detailHints ?? ['Detail 1', 'Detail 2', 'Detail 3'];
  const LINE_H = 16;

  // Topic box: full-width at x=20, text at x=32 → 24u total inset + 12u right margin.
  const topicLines = wrapAt(spec.topicSentenceHint ?? 'introduce your main idea here', 13, SVG_W - 40 - 24);
  const topicH = 50 + (topicLines.length - 1) * LINE_H;

  let cursor = 20 + topicH + 16;
  const detailBlocks = details.map((d, i) => {
    const lines = wrapAt(d, 13, SVG_W - 60 - 24);
    const y = cursor;
    const h = 48 + (lines.length - 1) * LINE_H;
    cursor = y + h + 8;
    return { lines, y, h, key: i };
  });

  const closingY = cursor + 4;
  const closingLines = wrapAt(spec.closingHint ?? 'wrap it up — restate your main idea', 13, SVG_W - 40 - 24);
  const closingH = 42 + (closingLines.length - 1) * LINE_H;

  const content = (
    <g>
      {/* Topic sentence */}
      <rect x={20} y={20} width={SVG_W - 40} height={topicH} fill="#dbeafe" stroke="#3b82f6" strokeWidth={2} rx={6} />
      <text x={32} y={38} fontSize={11} fontWeight={700} fill="#1e3a8a">topic sentence</text>
      <WrappedText x={32} y={56} lines={topicLines} lineH={LINE_H} fontSize={13} fill="#0f172a" fontStyle="italic" />
      {/* Details */}
      {detailBlocks.map((b) => (
        <g key={b.key}>
          <rect x={40} y={b.y} width={SVG_W - 60} height={b.h} fill="#fff" stroke="#10b981" strokeWidth={2} rx={6} />
          <text x={52} y={b.y + 18} fontSize={11} fontWeight={700} fill="#065f46">detail {b.key + 1}</text>
          <WrappedText x={52} y={b.y + 34} lines={b.lines} lineH={LINE_H} fontSize={13} fill="#0f172a" fontStyle="italic" />
        </g>
      ))}
      {/* Closing */}
      <rect x={20} y={closingY} width={SVG_W - 40} height={closingH} fill="#ede9fe" stroke="#7c3aed" strokeWidth={2} rx={6} />
      <text x={32} y={closingY + 16} fontSize={11} fontWeight={700} fill="#5b21b6">closing</text>
      <WrappedText x={32} y={closingY + 34} lines={closingLines} lineH={LINE_H} fontSize={13} fill="#0f172a" fontStyle="italic" />
    </g>
  );
  return { content, height: closingY + closingH + 14 };
}

function renderFiveParagraph(spec: Extract<WritingFrameSpec, { kind: 'five_paragraph' }>): { content: JSX.Element; height: number } {
  const bodyTopics = spec.bodyTopics ?? [undefined, undefined, undefined];
  const LINE_H = 16;
  const availW = SVG_W - 40 - 24; // box at x=20 width W-40, text at x=32, 12u right margin
  const blocks = [
    { label: 'Introduction', hint: `Hook + thesis. Thesis: ${spec.thesisHint ?? '<your main argument>'}`, color: '#3b82f6' },
    { label: 'Body 1', hint: bodyTopics[0] ?? 'first supporting reason or example', color: '#10b981' },
    { label: 'Body 2', hint: bodyTopics[1] ?? 'second supporting reason or example', color: '#10b981' },
    { label: 'Body 3', hint: bodyTopics[2] ?? 'third supporting reason or example', color: '#10b981' },
    { label: 'Conclusion', hint: 'restate thesis in new words; tie to a broader idea', color: '#7c3aed' },
  ];
  let cursor = 16;
  const placed = blocks.map((b) => {
    const lines = wrapAt(b.hint, 13, availW);
    const y = cursor;
    const h = 50 + (lines.length - 1) * LINE_H;
    cursor = y + h + 8;
    return { ...b, lines, y, h };
  });
  const content = (
    <g>
      {placed.map((b) => (
        <g key={b.label}>
          <rect x={20} y={b.y} width={SVG_W - 40} height={b.h} fill="#fff" stroke={b.color} strokeWidth={2.5} rx={6} />
          <text x={32} y={b.y + 18} fontSize={12} fontWeight={700} fill={b.color}>{b.label}</text>
          <WrappedText x={32} y={b.y + 36} lines={b.lines} lineH={LINE_H} fontSize={13} fill="#0f172a" fontStyle="italic" />
        </g>
      ))}
    </g>
  );
  return { content, height: cursor + 4 };
}
