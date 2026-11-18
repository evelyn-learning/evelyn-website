'use client';
/**
 * Task 7o: the words of a note of a spoken language lesson (tutor brain v2), its targets marked: each short quoted span
 * (`quoted`) and each given stress word (`stress`) drawn as a sentence card draws a stress word (amber, semibold,
 * underlined), the quote marks dropped (lib/tutor/v2/note-targets.ts v2NoteSegments). The rest as InlineMathText.
 * Used only for a note that carries the marker; every other note renders as before.
 */
import { InlineMathText } from './InlineMathText';
import { AMBER } from './InkNotesOverlay';
import { v2NoteSegments } from '@/lib/tutor/v2/note-targets';

export function NoteTargetText({ text, quoted, stress }: { text: string; quoted?: boolean; stress?: readonly string[] }) {
  return (
    <>
      {v2NoteSegments(text, { quoted, stress }).map((s, i) => (s.mark
        ? <span key={i} style={{ color: AMBER, textDecoration: 'underline', textUnderlineOffset: '3px', textDecorationThickness: '2px' }} className="font-semibold">{s.text}</span>
        : <InlineMathText key={i} text={s.text} />))}
    </>
  );
}
