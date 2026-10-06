import { LogOut } from 'lucide-react';

/**
 * The header's end control. Presentational: the two-tap arm state and the
 * actual teardown live in TutorSession (`pressEndControl`).
 *
 * Default (`mobileFinish` false): the End / Pause button exactly as it was
 * when it lived inline in TutorSession — icon-only below `sm`, icon + label
 * from `sm` up.
 *
 * `mobileFinish` (embed option, see lib/tutor/portal/embed-ui-options.ts):
 * below `sm` the icon-only button is replaced by a TEXT "Finish" button that
 * reports the `finish` intent — the same end the ⋯ menu's "Finish lesson"
 * performs. From `sm` up nothing changes. The phone header has no room for
 * both (the title is already truncated to a few characters), and an
 * unlabelled red icon was the only finish affordance a phone student had.
 */
export interface EndControlProps {
  /** First tap landed; the next tap confirms. */
  armed: boolean;
  mobileFinish: boolean;
  /** `'finish'` from the labelled Finish button, undefined from End / Pause. */
  onPress: (intent?: 'finish') => void;
}

export function EndControl({ armed, mobileFinish, onPress }: EndControlProps) {
  const endButton = (
    <button
      onClick={() => onPress()}
      title={armed ? 'Tap again to end the session' : 'End or pause — your progress is saved, resume anytime'}
      aria-label={armed ? 'Tap again to end the session' : 'End or pause session'}
      className={`${mobileFinish ? 'hidden sm:flex' : 'flex'} shrink-0 items-center gap-1.5 px-3 h-9 rounded-full text-xs font-semibold border transition-colors ${
        armed
          ? 'bg-red-600 text-white border-red-600 hover:bg-red-700'
          : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
      }`}
    >
      {/* Narrow (<sm): one fixed-width slot that swaps icon ↔ "End?" so the
          armed state always presents TEXT (2026-07-26 trial: color-only arm
          read as a broken button) while the pill geometry never changes —
          the second tap lands on the same hit target (R34 rule). */}
      <span className="inline-flex min-w-[2.25rem] justify-center sm:hidden">
        {armed ? 'End?' : <LogOut className="w-3.5 h-3.5" />}
      </span>
      <LogOut className="hidden sm:inline-block w-3.5 h-3.5" />
      {/* inline-block + min-w so the longer "End session?" label reserves
          the same slot as "End / Pause" — armed/unarmed never resize the
          pill, so the second tap always lands on the same hit target. */}
      <span className="hidden sm:inline-block sm:min-w-[6.5rem]">{armed ? 'End session?' : 'End / Pause'}</span>
      {/* Screen readers hear the arm regardless of viewport. */}
      <span aria-live="polite" className="sr-only">
        {armed ? 'Tap again to end the session' : ''}
      </span>
    </button>
  );
  if (!mobileFinish) return endButton;
  return (
    <>
      <button
        type="button"
        data-testid="mobile-finish"
        onClick={() => onPress('finish')}
        title={armed ? 'Tap again to finish the lesson' : 'Finish lesson'}
        aria-label={armed ? 'Tap again to finish the lesson' : 'Finish lesson'}
        className={`flex sm:hidden shrink-0 items-center px-2.5 h-9 rounded-full text-xs font-semibold border transition-colors ${
          armed
            ? 'bg-slate-900 text-white border-slate-900'
            : 'bg-white text-slate-900 border-slate-400 hover:bg-slate-50'
        }`}
      >
        {/* Fixed-width slot: "Finish" ↔ "Finish?" never resizes the pill. Kept
            within ~4px of the icon pill it replaces — the phone header is full. */}
        <span className="inline-flex min-w-[2.75rem] justify-center">{armed ? 'Finish?' : 'Finish'}</span>
      </button>
      {endButton}
    </>
  );
}
