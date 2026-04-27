'use client';

/**
 * PhonicsRenderer — sound-out / syllable-break / blend visualizations
 * for K-2 reading instruction.
 *
 * Three kinds:
 *   - sound_out      CVC or short word with each grapheme in its own
 *                    box, color-coded by phoneme type.
 *   - syllables      word split into syllables with break dots.
 *   - blend          word with the blended initial cluster underlined
 *                    (e.g. "stop" with "st" highlighted).
 *
 * The brain emits the WORD plus structural hints (where syllable
 * breaks fall, which graphemes carry which sounds). We render large,
 * generously-spaced, color-coded so a 5-year-old can read at a glance.
 */

import React from 'react';

const SVG_W = 480;
const SVG_H = 220;

export type PhonicsSpec =
  | {
      kind: 'sound_out';
      title?: string;
      /** Word as a flat string. */
      word: string;
      /** Optional grapheme breakdown. Each entry is one orthographic
       *  unit (a "ch" digraph counts as one grapheme). If omitted, we
       *  break per character. */
      graphemes?: Array<{ text: string; type?: 'consonant' | 'vowel' | 'digraph' | 'silent' }>;
      /** Optional IPA-ish phonetic transcription shown below. */
      phonetic?: string;
    }
  | {
      kind: 'syllables';
      title?: string;
      /** Word split into syllables, e.g. ["but", "ter", "fly"] */
      syllables: string[];
      /** Optional stressed-syllable index (0-based). */
      stressed?: number;
    }
  | {
      kind: 'blend';
      title?: string;
      word: string;
      /** Length of the leading blend, e.g. 2 for "st" in "stop", 3 for
       *  "spr" in "spring". Or pass `cluster` directly for trailing/
       *  middle blends. */
      cluster?: string;
      clusterStart?: number;
    };

const TYPE_COLOR: Record<string, string> = {
  consonant: '#3b82f6',
  vowel: '#ef4444',
  digraph: '#7c3aed',
  silent: '#94a3b8',
};

export default function PhonicsRenderer({ spec }: { spec: PhonicsSpec }) {
  return (
    <div className="phonics-renderer">
      {spec.title && (
        <div className="text-center text-sm font-semibold text-gray-700 mb-1">{spec.title}</div>
      )}
      <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-auto" style={{ maxWidth: SVG_W }}>
        <rect width={SVG_W} height={SVG_H} fill="#fafbfc" rx={4} />
        {spec.kind === 'sound_out' && renderSoundOut(spec)}
        {spec.kind === 'syllables' && renderSyllables(spec)}
        {spec.kind === 'blend' && renderBlend(spec)}
      </svg>
    </div>
  );
}

function renderSoundOut(spec: Extract<PhonicsSpec, { kind: 'sound_out' }>) {
  const graphemes = spec.graphemes ?? spec.word.split('').map((c) => ({ text: c }));
  const N = graphemes.length;
  const boxW = Math.min(70, (SVG_W - 60) / N);
  const totalW = boxW * N + (N - 1) * 8;
  const ox = (SVG_W - totalW) / 2;
  const oy = 60;

  return (
    <g>
      {graphemes.map((g, i) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const gtype = (g as any).type as string | undefined;
        const color = TYPE_COLOR[gtype ?? (isVowel(g.text) ? 'vowel' : 'consonant')];
        const x = ox + i * (boxW + 8);
        return (
          <g key={i}>
            <rect x={x} y={oy} width={boxW} height={70} fill="#fff" stroke={color} strokeWidth={3} rx={6} />
            <text x={x + boxW / 2} y={oy + 50} fontSize={36} textAnchor="middle" fontWeight={700} fill={color}>
              {g.text}
            </text>
          </g>
        );
      })}
      {spec.phonetic && (
        <text x={SVG_W / 2} y={SVG_H - 20} fontSize={18} textAnchor="middle" fill="#475569" fontStyle="italic">
          /{spec.phonetic}/
        </text>
      )}
      <text x={SVG_W / 2} y={30} fontSize={14} textAnchor="middle" fill="#64748b">sound it out</text>
    </g>
  );
}

function renderSyllables(spec: Extract<PhonicsSpec, { kind: 'syllables' }>) {
  const N = spec.syllables.length;
  const cy = SVG_H / 2;
  const totalText = spec.syllables.join(' · ');

  // Render with bullets between syllables
  return (
    <g>
      <text x={SVG_W / 2} y={cy + 14} fontSize={48} textAnchor="middle" fontWeight={700} fill="#0f172a">
        {spec.syllables.map((s, i) => (
          <tspan key={i} fill={i === spec.stressed ? '#ef4444' : '#0f172a'}>
            {s}
            {i < N - 1 && <tspan fill="#7c3aed" fontSize={36}>{' · '}</tspan>}
          </tspan>
        ))}
      </text>
      <text x={SVG_W / 2} y={30} fontSize={14} textAnchor="middle" fill="#64748b">
        {N} syllable{N === 1 ? '' : 's'}
        {spec.stressed !== undefined && ` (stress on "${spec.syllables[spec.stressed]}")`}
      </text>
      <text x={SVG_W / 2} y={SVG_H - 18} fontSize={11} textAnchor="middle" fill="#94a3b8">
        {totalText}
      </text>
    </g>
  );
}

function renderBlend(spec: Extract<PhonicsSpec, { kind: 'blend' }>) {
  const word = spec.word;
  const cluster = spec.cluster ?? word.slice(0, 2);
  const clusterStart = spec.clusterStart ?? word.toLowerCase().indexOf(cluster.toLowerCase());
  const clusterEnd = clusterStart + cluster.length;
  const cy = SVG_H / 2;

  // Render letter-by-letter so we can underline the cluster precisely.
  const letterW = 30;
  const totalW = word.length * letterW;
  const ox = (SVG_W - totalW) / 2;

  return (
    <g>
      {word.split('').map((c, i) => {
        const inCluster = i >= clusterStart && i < clusterEnd;
        return (
          <text
            key={i}
            x={ox + i * letterW + letterW / 2}
            y={cy + 14}
            fontSize={48}
            textAnchor="middle"
            fontWeight={700}
            fill={inCluster ? '#7c3aed' : '#0f172a'}
          >
            {c}
          </text>
        );
      })}
      {/* Underline the cluster */}
      <line
        x1={ox + clusterStart * letterW + 4}
        y1={cy + 28}
        x2={ox + clusterEnd * letterW - 4}
        y2={cy + 28}
        stroke="#7c3aed"
        strokeWidth={4}
        strokeLinecap="round"
      />
      <text x={SVG_W / 2} y={30} fontSize={14} textAnchor="middle" fill="#64748b">
        blend "{cluster}"
      </text>
    </g>
  );
}

function isVowel(c: string): boolean {
  return /^[aeiouAEIOU]$/.test(c);
}
