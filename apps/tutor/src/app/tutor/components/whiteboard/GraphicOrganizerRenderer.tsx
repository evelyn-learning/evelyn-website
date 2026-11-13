'use client';

/**
 * GraphicOrganizerRenderer — common ELA / writing organizers.
 *
 * Five shapes under one tool (one `kind` per layout):
 *   - story_map      character / setting / problem / solution boxes
 *   - kwl            three columns: Know / Want to know / Learned
 *   - t_chart        two columns with a header per side
 *   - sequence       horizontal arrow chain of steps
 *   - cause_effect   left "cause" boxes → arrows → right "effects"
 *
 * Brain emits the data; the renderer handles layout.
 */

import React from 'react';
import {
  normalizeGraphicOrganizerSpec,
  type NormalizedGraphicOrganizerSpec,
} from '@/lib/tutor/validation/graphic-organizer-guard';

/** The drawable shape. What the brain sends is NOT trusted to match it — the
 *  tool schema only requires `kind` — so the component normalizes its input
 *  (validation/graphic-organizer-guard.ts) before any layout code runs. */
export type GraphicOrganizerSpec = NormalizedGraphicOrganizerSpec;

/* Every layout is HTML that sizes itself to its words. The fixed 520×320 SVG frames clipped whatever did not
 * fit them (a two-line T-chart heading lost its second line, a cause of four words lost its last two) and left
 * a blank band when there was little to show (figure audit, 2026-11-13). One quiet palette: an organizer sorts
 * ideas, and a colour per box said nothing. */
const INK = '#0f172a';
const RULE = '#cbd5e1';
const ACCENT = '#1d4ed8';
const TINT = '#eff6ff';

/**
 * Never throws on a malformed spec (2026-10-05: `spec.<list>.map` on a
 * missing list took the whole session page down). Missing lists are empty,
 * non-text items are coerced or skipped, and a spec with nothing to show
 * renders nothing rather than an empty frame.
 */
export default function GraphicOrganizerRenderer({ spec: rawSpec }: { spec: unknown }) {
  const decision = normalizeGraphicOrganizerSpec(rawSpec);
  if (!decision.ok) return null;
  const spec = decision.spec;
  return (
    <div className="graphic-organizer-renderer mx-auto" style={{ maxWidth: spec.kind === 'sequence' ? 760 : 680 }}>
      {spec.title && (
        <div className="text-center text-sm font-semibold text-gray-800 mb-2">{spec.title}</div>
      )}
      {spec.kind === 'story_map' && <StoryMap spec={spec} />}
      {spec.kind === 'kwl' && <Kwl spec={spec} />}
      {spec.kind === 't_chart' && <TChart spec={spec} />}
      {spec.kind === 'sequence' && <SequenceOrganizer spec={spec} />}
      {spec.kind === 'cause_effect' && <CauseEffect spec={spec} />}
    </div>
  );
}

/** Belt and braces for the layout functions below: they only ever receive a
 *  normalized spec, but a list is still read through this so no future caller
 *  can reintroduce `.map` on undefined. */
function list(items: unknown): string[] {
  return Array.isArray(items) ? items.filter((x): x is string => typeof x === 'string') : [];
}

const wrap: React.CSSProperties = { overflowWrap: 'anywhere' };

/** A bulleted list whose wrapped lines line up with the text, not with the bullet (a hanging indent). */
function Bullets({ items }: { items: string[] }) {
  return (
    <div>
      {items.map((it, i) => (
        <div key={i} className="text-[13px] leading-snug" style={{ color: INK, marginBottom: 4, paddingLeft: 13, textIndent: -13, ...wrap }}>{`• ${it}`}</div>
      ))}
    </div>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] font-bold uppercase tracking-wide" style={{ color: ACCENT, marginBottom: 4 }}>{children}</div>;
}

function StoryMap({ spec }: { spec: Extract<GraphicOrganizerSpec, { kind: 'story_map' }> }) {
  const boxes = [
    { label: 'Character', text: spec.character },
    { label: 'Setting', text: spec.setting },
    { label: 'Problem', text: spec.problem },
    { label: 'Solution', text: spec.solution },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
      {boxes.map((b) => (
        <div key={b.label} className="rounded-lg bg-white" style={{ border: `1.5px solid ${RULE}`, borderTop: `3px solid ${ACCENT}`, padding: '8px 12px', minHeight: 76 }}>
          <Heading>{b.label}</Heading>
          {b.text && <div className="text-[13px] leading-snug" style={{ color: INK, ...wrap }}>{b.text}</div>}
        </div>
      ))}
    </div>
  );
}

function Kwl({ spec }: { spec: Extract<GraphicOrganizerSpec, { kind: 'kwl' }> }) {
  const cols = [
    { letter: 'K', label: 'What I know', items: spec.know },
    { letter: 'W', label: 'What I want to know', items: spec.want },
    { letter: 'L', label: 'What I learned', items: spec.learned },
  ];
  return (
    <div className="rounded-lg overflow-hidden bg-white" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', border: `1.5px solid ${RULE}` }}>
      {cols.map((c, i) => (
        <div key={c.letter} style={{ borderLeft: i ? `1.5px solid ${RULE}` : undefined, minHeight: 120 }}>
          <div className="text-center" style={{ background: TINT, borderBottom: `1.5px solid ${RULE}`, padding: '6px 8px' }}>
            <div className="text-base font-bold" style={{ color: ACCENT, lineHeight: 1.1 }}>{c.letter}</div>
            <div className="text-[11px] font-semibold" style={{ color: '#334155' }}>{c.label}</div>
          </div>
          <div style={{ padding: '8px 10px' }}><Bullets items={list(c.items)} /></div>
        </div>
      ))}
    </div>
  );
}

function TChart({ spec }: { spec: Extract<GraphicOrganizerSpec, { kind: 't_chart' }> }) {
  const sides = [
    { header: spec.leftHeader, items: list(spec.leftItems) },
    { header: spec.rightHeader, items: list(spec.rightItems) },
  ];
  // The two strokes of the T: under the headings, and down the middle.
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
      {sides.map((sd, i) => (
        <div key={`h${i}`} className="text-center text-[15px] font-bold" style={{ color: INK, padding: '4px 12px 8px', borderBottom: `2.5px solid ${INK}`, borderLeft: i ? `2.5px solid ${INK}` : undefined, lineHeight: 1.25, ...wrap }}>{sd.header}</div>
      ))}
      {sides.map((sd, i) => (
        <div key={`b${i}`} style={{ padding: '10px 14px 12px', borderLeft: i ? `2.5px solid ${INK}` : undefined, minHeight: 72 }}><Bullets items={sd.items} /></div>
      ))}
    </div>
  );
}

/** Sequence as wrapping HTML boxes, not a fixed SVG row: six steps in a
 *  520-unit row left ~60px per box, so step text was cut off mid-word and the
 *  fixed 320-unit canvas left a blank band above the row (GDI meeting session
 *  2026-10-15). Rows are balanced (five steps are three and two, not four and
 *  one), every box of a row has the row's height, and an arrow leads out of
 *  each box except the last. */
function SequenceOrganizer({ spec }: { spec: Extract<GraphicOrganizerSpec, { kind: 'sequence' }> }) {
  const steps = list(spec.steps);
  const rows = Math.max(1, Math.ceil(steps.length / 4));
  const cols = Math.max(1, Math.ceil(steps.length / rows));
  return (
    <ol style={{ listStyle: 'none', margin: '0 auto', padding: 0, display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, rowGap: 12, maxWidth: cols * 190 }}>
      {steps.map((s, i) => (
        <li key={i} className="flex items-stretch" data-feature={`step-${i + 1}`}>
          <div className="rounded-lg bg-white flex-1" style={{ border: `1.5px solid ${RULE}`, borderTop: `3px solid ${ACCENT}`, padding: '7px 10px 9px', minHeight: 64, minWidth: 0 }}>
            <div aria-label={`step ${i + 1}`} className="flex items-center justify-center text-[11px] font-bold text-white" style={{ background: ACCENT, width: 20, height: 20, borderRadius: 10, marginBottom: 5 }}>{i + 1}</div>
            <div className="text-[13px] leading-snug" style={{ color: INK, ...wrap }}>{s}</div>
          </div>
          <span aria-hidden="true" className="flex items-center justify-center text-lg font-bold shrink-0" style={{ width: 26, color: '#475569', visibility: i < steps.length - 1 ? 'visible' : 'hidden' }}>{(i + 1) % cols === 0 ? '↩' : '→'}</span>
        </li>
      ))}
    </ol>
  );
}

function CauseEffect({ spec }: { spec: Extract<GraphicOrganizerSpec, { kind: 'cause_effect' }> }) {
  const causes = list(spec.causes);
  const effects = list(spec.effects);
  const head = (label: string, ink: string) => <div className="text-center text-sm font-bold" style={{ color: ink, marginBottom: 6 }}>{label}</div>;
  const column = (items: string[], stroke: string) => (
    <div className="flex flex-col justify-center" style={{ gap: 8, minWidth: 0 }}>
      {items.map((it, i) => (
        <div key={i} className="rounded-md bg-white text-[13px] leading-snug" style={{ border: `2px solid ${stroke}`, padding: '7px 10px', color: INK, ...wrap }}>{it}</div>
      ))}
    </div>
  );
  // One broad arrow between the columns: the causes together lead to the effects together. A thin arrow from
  // the middle cause to the middle effect read as a link between those two alone.
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 56px minmax(0, 1fr)', alignItems: 'center', columnGap: 6 }}>
      {head('Causes', '#92400e')}
      <span />
      {head('Effects', '#065f46')}
      {column(causes, '#f59e0b')}
      <svg viewBox="0 0 56 40" width={56} height={40} aria-hidden="true">
        <path d="M4 14 H34 V5 L52 20 L34 35 V26 H4 Z" fill="#e2e8f0" stroke="#475569" strokeWidth={1.5} strokeLinejoin="round" />
      </svg>
      {column(effects, '#10b981')}
    </div>
  );
}
