'use client';
/**
 * The words of a note or a problem card, set out by what each line is (lib/tutor/v2/rich-text.ts): a heading,
 * a labelled point, program code, or a sentence. Used only for cards marked `rich` (tutor brain v2).
 */
import { InlineMathText } from './InlineMathText';
import { HScrollFade } from './HScrollFade';
import { richBlocks } from '@/lib/tutor/v2/rich-text';

export function RichBoardText({ text, titled, size = 'text-lg' }: { text: string; titled?: boolean; size?: string }) {
  const blocks = richBlocks(text, { titled });
  return (
    <div className="flex flex-col gap-1.5">
      {blocks.map((b, i) => b.kind === 'title'
        ? <p key={i} className="text-xl font-semibold text-gray-900 mb-0.5"><InlineMathText text={b.text} /></p>
        : b.kind === 'code'
        ? <HScrollFade key={i} as="pre" className="my-1 bg-gray-900 text-gray-100 rounded-md px-3.5 py-2.5 overflow-x-auto text-sm leading-relaxed font-mono"><code>{b.text}</code></HScrollFade>
        : <HScrollFade key={i} as="p" className={`${size} overflow-x-auto`}>{b.label && <span className="font-semibold text-gray-900">{b.label}: </span>}<InlineMathText text={b.text} /></HScrollFade>)}
    </div>
  );
}
