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
 */

import React from 'react';

const SVG_W = 520;
const SVG_H = 320;

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
  return (
    <div className="writing-frame-renderer">
      {spec.title && (
        <div className="text-center text-sm font-semibold text-gray-700 mb-1">{spec.title}</div>
      )}
      <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-auto" style={{ maxWidth: SVG_W }}>
        <rect width={SVG_W} height={SVG_H} fill="#fafbfc" rx={4} />
        {spec.kind === 'sentence_stems' && renderStems(spec)}
        {spec.kind === 'paragraph_frame' && renderParagraph(spec)}
        {spec.kind === 'five_paragraph' && renderFiveParagraph(spec)}
      </svg>
    </div>
  );
}

function renderStems(spec: Extract<WritingFrameSpec, { kind: 'sentence_stems' }>) {
  const N = spec.stems.length;
  const lineH = (SVG_H - 40) / Math.max(1, N);
  return (
    <g>
      <text x={20} y={28} fontSize={13} fontWeight={700} fill="#475569">Try one of these starters:</text>
      {spec.stems.map((s, i) => {
        const y = 50 + i * lineH;
        return (
          <g key={i}>
            <text x={28} y={y + 18} fontSize={14} fontWeight={600} fill="#7c3aed">
              {i + 1}.
            </text>
            <text x={50} y={y + 18} fontSize={14} fill="#0f172a">{s}</text>
            <line x1={50} y1={y + 32} x2={SVG_W - 28} y2={y + 32} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4,4" />
          </g>
        );
      })}
    </g>
  );
}

function renderParagraph(spec: Extract<WritingFrameSpec, { kind: 'paragraph_frame' }>) {
  const details = spec.detailHints ?? ['Detail 1', 'Detail 2', 'Detail 3'];
  return (
    <g>
      {/* Topic sentence */}
      <rect x={20} y={20} width={SVG_W - 40} height={50} fill="#dbeafe" stroke="#3b82f6" strokeWidth={2} rx={6} />
      <text x={32} y={38} fontSize={11} fontWeight={700} fill="#1e3a8a">topic sentence</text>
      <text x={32} y={56} fontSize={13} fill="#0f172a" fontStyle="italic">
        {spec.topicSentenceHint ?? 'introduce your main idea here'}
      </text>
      {/* Details */}
      {details.map((d, i) => (
        <g key={i}>
          <rect x={40} y={86 + i * 56} width={SVG_W - 60} height={48} fill="#fff" stroke="#10b981" strokeWidth={2} rx={6} />
          <text x={52} y={104 + i * 56} fontSize={11} fontWeight={700} fill="#065f46">detail {i + 1}</text>
          <text x={52} y={120 + i * 56} fontSize={13} fill="#0f172a" fontStyle="italic">{d}</text>
        </g>
      ))}
      {/* Closing */}
      <rect x={20} y={SVG_H - 56} width={SVG_W - 40} height={42} fill="#ede9fe" stroke="#7c3aed" strokeWidth={2} rx={6} />
      <text x={32} y={SVG_H - 40} fontSize={11} fontWeight={700} fill="#5b21b6">closing</text>
      <text x={32} y={SVG_H - 22} fontSize={13} fill="#0f172a" fontStyle="italic">
        {spec.closingHint ?? 'wrap it up — restate your main idea'}
      </text>
    </g>
  );
}

function renderFiveParagraph(spec: Extract<WritingFrameSpec, { kind: 'five_paragraph' }>) {
  const bodyTopics = spec.bodyTopics ?? [undefined, undefined, undefined];
  const blocks = [
    { label: 'Introduction', hint: `Hook + thesis. Thesis: ${spec.thesisHint ?? '<your main argument>'}`, color: '#3b82f6', y: 16 },
    { label: 'Body 1', hint: bodyTopics[0] ?? 'first supporting reason or example', color: '#10b981', y: 76 },
    { label: 'Body 2', hint: bodyTopics[1] ?? 'second supporting reason or example', color: '#10b981', y: 132 },
    { label: 'Body 3', hint: bodyTopics[2] ?? 'third supporting reason or example', color: '#10b981', y: 188 },
    { label: 'Conclusion', hint: 'restate thesis in new words; tie to a broader idea', color: '#7c3aed', y: 244 },
  ];
  return (
    <g>
      {blocks.map((b) => (
        <g key={b.label}>
          <rect x={20} y={b.y} width={SVG_W - 40} height={50} fill="#fff" stroke={b.color} strokeWidth={2.5} rx={6} />
          <text x={32} y={b.y + 18} fontSize={12} fontWeight={700} fill={b.color}>{b.label}</text>
          <text x={32} y={b.y + 36} fontSize={13} fill="#0f172a" fontStyle="italic">{b.hint}</text>
        </g>
      ))}
    </g>
  );
}
