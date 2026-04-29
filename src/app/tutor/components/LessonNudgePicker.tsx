'use client';

/**
 * LessonNudgePicker — surfaces lesson plan suggestions inside the
 * session view so a vague student ("Teach me / Anything / I don't
 * know") can fast-forward by tapping instead of dragging the bot
 * through 3-5 voice turns to extract a topic.
 *
 * Triggered when:
 *   - The student's last 1-2 turns are short and vague (matches a
 *     small heuristic regex of "anything", "you decide", "teach me",
 *     etc.) AND lesson plans exist for the current topic; OR
 *   - The student has sent fewer than 4 turns total and no specific
 *     lesson has been started yet — in that case we surface the picker
 *     proactively so it's there before they get frustrated.
 *
 * Tapping a plan card fires `onSelect(plan)`, which the parent wires
 * to `realtimeHandleRef.current.sendTextMessage(...)` with a synthetic
 * student message that asks the brain to start that specific plan.
 *
 * Runs in PARALLEL with voice — voice still says "what do you want?"
 * while this picker shows below. Either path can drive the lesson.
 */

import { useMemo } from 'react';
import { BookOpen, Clock } from 'lucide-react';

export type NudgePlan = {
  id: string;
  title: string;
  los: Array<{ id: string; description: string }>;
  estimatedMinutes: number;
};

interface LessonNudgePickerProps {
  /** Lesson plans available for the active (subject, level, topic). */
  plans: NudgePlan[];
  /** Most-recent transcript messages (just role + text are needed). */
  recentTurns: Array<{ role: 'student' | 'tutor' | 'system'; text: string }>;
  /** Whether a lesson plan has already been picked / started in this session. */
  lessonStarted: boolean;
  /** Tap-to-start handler. */
  onSelect: (plan: NudgePlan) => void;
  /** Optional dismiss handler — if user explicitly closes the panel,
   *  parent should keep it dismissed for the rest of the session. */
  onDismiss?: () => void;
}

const VAGUE_RE = /^(?:teach\s*me|anything|whatever|you\s*(?:decide|pick|choose)|i\s*don'?t\s*(?:know|care)|sure|ok(?:ay)?|yes|no|maybe|hmm+|um+|idk|something|anything\s*works?)\.?\s*$/i;

function isVague(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (t.length <= 18 && VAGUE_RE.test(t)) return true;
  // Short single-word answers without any specific noun are also vague.
  if (t.length <= 3) return true;
  return false;
}

export function LessonNudgePicker({ plans, recentTurns, lessonStarted, onSelect, onDismiss }: LessonNudgePickerProps) {
  const studentTurns = useMemo(
    () => recentTurns.filter((t) => t.role === 'student'),
    [recentTurns],
  );

  const shouldShow = useMemo(() => {
    if (lessonStarted) return false;
    if (plans.length === 0) return false;
    // Proactive: first 3 student turns and no specific lesson chosen.
    if (studentTurns.length > 0 && studentTurns.length <= 3) return true;
    // Reactive: latest student turn was vague.
    const last = studentTurns[studentTurns.length - 1];
    if (last && isVague(last.text)) return true;
    // Or: two of the last three student turns were vague (the
    // "Teach me / English / Grammer / Anything" pattern).
    const lastThree = studentTurns.slice(-3);
    const vagueCount = lastThree.filter((t) => isVague(t.text)).length;
    return vagueCount >= 2;
  }, [studentTurns, lessonStarted, plans.length]);

  if (!shouldShow) return null;

  return (
    <div className="border border-blue-200 bg-blue-50/60 rounded-lg p-3 my-2 flex-shrink-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm font-medium text-blue-900">
          <BookOpen className="w-4 h-4" />
          Pick a lesson to jump straight in
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-xs text-blue-700/70 hover:text-blue-900"
            aria-label="Hide lesson suggestions"
          >
            hide
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {plans.slice(0, 6).map((plan) => (
          <button
            key={plan.id}
            onClick={() => onSelect(plan)}
            className="text-left bg-white hover:bg-blue-50 border border-blue-200 hover:border-blue-400 rounded-md px-3 py-2 transition group"
          >
            <div className="text-sm font-medium text-gray-900 group-hover:text-blue-900 line-clamp-1">
              {plan.title}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <Clock className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">{plan.estimatedMinutes} min</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
