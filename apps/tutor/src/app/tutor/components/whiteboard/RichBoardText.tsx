'use client';
/**
 * The words of a note or a problem card, set out by what each line is (lib/tutor/v2/rich-text.ts): a heading,
 * a labelled point, program code, or a sentence. Used only for cards marked `rich` (tutor brain v2).
 * Task 7o: `quoted` / `stress` (a note of a spoken language lesson only) mark its targets (NoteTargetText); without them
 * every line renders as before.
 */
import { InlineMathText } from './InlineMathText';
import { HScrollFade } from './HScrollFade';
import { NoteTargetText } from './NoteTargetText';
import { richBlocks } from '@/lib/tutor/v2/rich-text';

export function RichBoardText({ text, titled, size = 'text-lg', quoted, stress }: { text: string; titled?: boolean; size?: string; quoted?: boolean; stress?: readonly string[] }) {
  const blocks = richBlocks(text, { titled });
  const marked = !!quoted || !!stress?.length;
  const words = (t: string) => (marked ? <NoteTargetText text={t} quoted={quoted} stress={stress} /> : <InlineMathText text={t} />);
  return (
    <div className="flex flex-col gap-1.5">
      {blocks.map((b, i) => b.kind === 'title'
        ? <p key={i} className="text-xl font-semibold text-gray-900 mb-0.5">{words(b.text)}</p>
        : b.kind === 'code'
        ? <HScrollFade key={i} as="pre" className="my-1 bg-gray-900 text-gray-100 rounded-md px-3.5 py-2.5 overflow-x-auto text-sm leading-relaxed font-mono"><code>{b.text}</code></HScrollFade>
        : <HScrollFade key={i} as="p" className={`${size} overflow-x-auto`}>{b.label && <span className="font-semibold text-gray-900">{marked ? <NoteTargetText text={b.label} quoted={quoted} stress={stress} /> : b.label}: </span>}{words(b.text)}</HScrollFade>)}
    </div>
  );
}
