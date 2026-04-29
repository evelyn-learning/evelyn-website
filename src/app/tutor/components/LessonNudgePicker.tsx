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
import { Bot, Clock } from 'lucide-react';

export type NudgePlan = {
  id: string;
  title: string;
  topic?: string;
  los: Array<{ id: string; description: string }>;
  estimatedMinutes: number;
};

interface LessonNudgePickerProps {
  /** Lesson plans available for the active (subject, level). May span
   *  multiple topics within the grade — the picker groups them when so. */
  plans: NudgePlan[];
  /** Most-recent transcript messages (just role + text are needed). */
  recentTurns: Array<{ role: 'student' | 'tutor' | 'system'; text: string }>;
  /** Whether a lesson plan has already been picked / started in this session. */
  lessonStarted: boolean;
  /** Topic id the student picked at setup. Plans matching this topic get
   *  surfaced first; plans for other topics in the grade appear after,
   *  grouped by their topic. */
  currentTopicId?: string;
  /** Tutor-bubble intro text shown above the plan cards. Defaults to a
   *  warm "blank canvas" greeting if not set. Parent passes a contextual
   *  one — e.g. "Ooh, blank canvas — I love it! I see you chose Algebra
   *  2 (High School). Pick a lesson to jump straight in." */
  introText?: string;
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

export function LessonNudgePicker({ plans, recentTurns, lessonStarted, currentTopicId, introText, onSelect, onDismiss }: LessonNudgePickerProps) {
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

  // Split plans into "current topic" and "other topics in the grade".
  // When the student picked a topic at setup, surface plans for that
  // topic prominently and stash the cross-grade catalog under a
  // collapsed "Other topics" section so they can browse if nothing
  // matches their current topic. Plans without a topic field fall into
  // the current bucket (back-compat with seed plans pre-topic).
  const { currentPlans, otherByTopic } = useMemo(() => {
    const current: NudgePlan[] = [];
    const otherMap = new Map<string, NudgePlan[]>();
    for (const p of plans) {
      const matchesCurrent = !currentTopicId || !p.topic || p.topic === currentTopicId;
      if (matchesCurrent) {
        current.push(p);
      } else {
        const list = otherMap.get(p.topic!) ?? [];
        list.push(p);
        otherMap.set(p.topic!, list);
      }
    }
    return { currentPlans: current, otherByTopic: otherMap };
  }, [plans, currentTopicId]);

  // Reactive expansion: if the latest 1-3 student turns are vague enough
  // ("anything", "I don't know", "you decide"), default-expand the
  // grade-wide catalog so they can pick across topics without an extra
  // click. For specific student turns, keep "Other topics" collapsed.
  const defaultShowOther = useMemo(() => {
    const lastThree = studentTurns.slice(-3);
    const vagueCount = lastThree.filter((t) => isVague(t.text)).length;
    return vagueCount >= 2 || studentTurns.length === 0;
  }, [studentTurns]);

  if (!shouldShow) return null;

  const greeting = introText ?? 'Ooh, blank canvas — I love it! Pick a lesson to jump straight in, or just tell me what you want to learn.';

  return (
    <div className="flex gap-3">
      {/* Tutor avatar — matches the styling of real tutor entries in
          TranscriptView so the picker feels like a chat bubble in the
          conversation flow. */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-purple-100 text-purple-600">
        <Bot className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="inline-block max-w-[95%] bg-gray-100 text-gray-800 p-3 rounded-lg rounded-bl-none">
          <div className="flex items-start justify-between gap-2 mb-2">
            <p className="whitespace-pre-wrap text-sm">{greeting}</p>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="flex-shrink-0 text-[11px] text-gray-500 hover:text-gray-800 underline"
                aria-label="Hide lesson suggestions"
              >
                hide
              </button>
            )}
          </div>
          {currentPlans.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentPlans.slice(0, 8).map((plan) => (
                <PlanButton key={plan.id} plan={plan} onSelect={onSelect} />
              ))}
            </div>
          )}
          {otherByTopic.size > 0 && (
            <details className="mt-2" open={defaultShowOther}>
              <summary className="cursor-pointer text-xs font-medium text-blue-700 hover:text-blue-900 py-1">
                Other topics in this grade ({Array.from(otherByTopic.values()).reduce((s, l) => s + l.length, 0)} more)
              </summary>
              <div className="mt-2 space-y-3 max-h-72 overflow-y-auto pr-1">
                {Array.from(otherByTopic.entries()).map(([topic, list]) => (
                  <div key={topic}>
                    <div className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">{topic.replace(/-/g, ' ')}</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {list.map((plan) => (
                        <PlanButton key={plan.id} plan={plan} onSelect={onSelect} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}

function PlanButton({ plan, onSelect }: { plan: NudgePlan; onSelect: (p: NudgePlan) => void }) {
  return (
    <button
      onClick={() => onSelect(plan)}
      className="text-left bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-400 rounded-md px-3 py-2 transition group shadow-sm"
    >
      <div className="text-sm font-medium text-gray-900 group-hover:text-blue-900 line-clamp-2">
        {plan.title}
      </div>
      <div className="flex items-center gap-2 mt-0.5">
        <Clock className="w-3 h-3 text-gray-400" />
        <span className="text-xs text-gray-500">{plan.estimatedMinutes} min</span>
      </div>
    </button>
  );
}
