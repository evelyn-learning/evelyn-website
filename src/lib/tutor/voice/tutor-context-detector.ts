/**
 * Tutor-side same-context detector for whiteboard page decisions.
 *
 * Signals (A decisive, B/C/D soft):
 *   A. Co-emitted scribble/scrollTo resolves to an existing catalog item.
 *   B. Tutor speech contains anaphora / self-reference / "using the X".
 *      Often empty in the realtime path: function_call.done fires before
 *      audio_transcript starts, so speech is usually unavailable here.
 *   C. ≥2 content-token overlap between the new command's title/label
 *      and an existing item's title or feature labels.
 *   D. Structural: first teaching cmd is a sub-step type, most recent
 *      existing item is a scenario container, no Final Answer between
 *      them. Robust to speech-timing and title-presence gaps.
 *
 * Precedence: A wins absolutely; strong student keyword overrides B/C/D;
 * otherwise any soft signal wins (strip newPage).
 */

import type { WhiteboardCommand } from '@/lib/knowledge/types';
import type { WhiteboardCatalog } from '@/lib/tutor/whiteboard/catalog';

const TUTOR_ANAPHORA_PATTERN =
  /\b(?:this|that|these|those|the|our|its)\s+(?:triangle|figure|diagram|problem|equation|formula|expression|graph|chart|setup|figure|points?|vertices|values?|coordinates|setup|shape|object|plot|drawing|illustration|picture|table|step|steps|answer|result|solution)\b/i;

const TUTOR_SELF_REFERENCE_PATTERN =
  /\b(?:we\s+(?:just\s+)?(?:drew|plotted|graphed|sketched|wrote|made|computed|found|got|saw)|(?:as\s+)?(?:you\s+can\s+see|shown|drawn|plotted|graphed)\s+(?:above|earlier|previously|on\s+the\s+board)|from\s+(?:earlier|before|the\s+(?:previous|prior)\s+step)|in\s+(?:our|the)\s+(?:figure|diagram|equation|formula|setup|problem))\b/i;

const TUTOR_USING_PATTERN =
  /\b(?:using|with|for|on|in|from)\s+(?:our|the|these|those|this|that|its)\s+(?:points?|vertices|values?|coordinates|triangle|figure|diagram|setup|equation|formula|graph|table)\b/i;

const STRONG_NEW_PROBLEM_PATTERNS: readonly RegExp[] = [
  /\bnext\s+(?:problem|example|question)\b/i,
  /\banother\s+(?:problem|example|question)\b/i,
  /\bnew\s+(?:problem|example|question|topic|subject)\b/i,
  /\blet'?s\s+(?:do|try)\s+another\b/i,
  /\bmove\s+on\s+to\b/i,
  /\bswitch\s+(?:to|topics?)\b/i,
];

export function isStrongNewProblemKeyword(text: string): boolean {
  const raw = (text || '').trim();
  if (!raw) return false;
  return STRONG_NEW_PROBLEM_PATTERNS.some((re) => re.test(raw));
}

const STOPWORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'of', 'to', 'in', 'on', 'at', 'by', 'for', 'with', 'from', 'about',
  'and', 'or', 'but', 'if', 'so', 'then', 'than', 'that', 'this',
  'it', 'its', 'these', 'those', 'there', 'here', 'as', 'into', 'onto',
  'their', 'our', 'his', 'her', 'my', 'your',
  'given', 'shown', 'plotted', 'drawn', 'find',
]);

function tokenize(s: string): string[] {
  return String(s ?? '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function contentTokens(s: string): Set<string> {
  const out = new Set<string>();
  for (const t of tokenize(s)) {
    // Single alphanumeric tokens (point/variable names like A, B, C, x)
    // are kept; longer tokens must be ≥3 chars and not a stopword.
    if (t.length === 1 && /[a-z0-9]/.test(t)) {
      out.add(t);
      continue;
    }
    if (t.length < 3) continue;
    if (STOPWORDS.has(t)) continue;
    out.add(t);
  }
  return out;
}

export type TutorSignalKind = 'A' | 'B' | 'C' | 'D';

// Sub-step children of a scenario. Equation/solution following a
// scenario is by structure a continuation, not a new concept.
const SUBSTEP_ACTIONS = new Set<string>([
  'showEquation', 'showSolution', 'showDerivation', 'showTable', 'showCode',
]);

// Scenario containers — problem setups that get explored via sub-steps.
const SCENARIO_CONTAINER_ACTIONS = new Set<string>([
  'showCircuit', 'showProblem', 'showCoordinatePlane',
  'showFreeBodyDiagram', 'showSpringMass', 'showPendulum',
  'showRayDiagram', 'showSimpleMachine', 'showProjectileMotion',
  'showMotionDiagram', 'showWave', 'showCollision', 'showEnergyBars',
  'showVector', 'showGeometry', 'showGraph', 'showScatterPlot',
  'showFunctionGraph', 'showOrbitalDiagram', 'showCellDiagram',
  'showDna', 'showLewis', 'showReactionCoordinate', 'showPedigree',
  'showFoodWeb', 'showPunnett', 'showVennDiagram',
  'showStats', 'showNumberLine', 'showFractionBar', 'showUnitCircle',
  'showManipulative',
]);

function finalAnswerSinceItem(catalog: WhiteboardCatalog, sceneIdx: number): boolean {
  const items = catalog.getItems();
  for (let i = sceneIdx + 1; i < items.length; i++) {
    const it = items[i];
    if (it.action !== 'showEquation') continue;
    if (/\bfinal\s+answer\b/.test((it.title || '').toLowerCase())) return true;
  }
  return false;
}

export interface TutorContextResult {
  /** True iff the tutor's response indicates same context as existing items. */
  same: boolean;
  /** Which signal(s) fired, in priority order. Empty if same=false. */
  signals: TutorSignalKind[];
  /** Hard signal A is decisive — overrides student-side strong keywords. */
  decisive: boolean;
  /** Human-readable summary for debug events. */
  reason: string;
}

interface DetectInput {
  batch: ReadonlyArray<WhiteboardCommand>;
  tutorSpeech: string;
  catalog: WhiteboardCatalog;
}

export function detectTutorSameContext(input: DetectInput): TutorContextResult {
  const { batch, tutorSpeech, catalog } = input;
  const items = catalog.getItems();
  if (items.length === 0) {
    return { same: false, signals: [], decisive: false, reason: 'no existing items' };
  }

  const signals: TutorSignalKind[] = [];

  // Signal A — scribble/scrollTo target resolves to an existing item.
  let signalAItemId: string | null = null;
  for (const cmd of batch) {
    const action = String((cmd as { action?: string }).action ?? '');
    if (action !== 'scribble' && action !== 'scrollTo') continue;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const target = typeof (cmd as any).target === 'string' ? (cmd as any).target.trim() : '';
    if (!target) continue;
    const resolved = catalog.resolveTarget(target);
    if (resolved.ok) {
      signalAItemId = resolved.itemId;
      break;
    }
  }
  if (signalAItemId) signals.push('A');

  // Signal B — tutor speech anaphora / self-reference / "using the X".
  const speech = (tutorSpeech || '').trim();
  const signalB =
    speech.length > 0
    && (TUTOR_ANAPHORA_PATTERN.test(speech)
      || TUTOR_SELF_REFERENCE_PATTERN.test(speech)
      || TUTOR_USING_PATTERN.test(speech));
  if (signalB) signals.push('B');

  // Signal C — ≥2 content-token overlap between new command's
  // title/label and any existing item's title or feature labels.
  let signalCMatchedItemId: string | null = null;
  let signalCTokens: string[] = [];
  for (const cmd of batch) {
    const action = String((cmd as { action?: string }).action ?? '');
    if (!action.startsWith('show')) continue;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cmdAny = cmd as any;
    const candidateText = [
      cmdAny.title,
      cmdAny.label,
      cmdAny.problem?.title,
      cmdAny.problem?.statement,
      cmdAny.equation?.label,
      cmdAny.heading,
    ]
      .filter((v) => typeof v === 'string')
      .join(' ');
    const newTokens = contentTokens(candidateText);
    if (newTokens.size === 0) continue;
    for (const item of items) {
      const itemTokens = contentTokens(item.title || '');
      for (const f of item.features) {
        for (const l of f.labels) {
          for (const t of contentTokens(l)) itemTokens.add(t);
        }
      }
      const overlap: string[] = [];
      for (const t of newTokens) {
        if (itemTokens.has(t)) overlap.push(t);
        if (overlap.length >= 2) break;
      }
      if (overlap.length >= 2) {
        signalCMatchedItemId = item.itemId;
        signalCTokens = overlap;
        break;
      }
    }
    if (signalCMatchedItemId) break;
  }
  if (signalCMatchedItemId) signals.push('C');

  // Signal D — sub-step type follows a scenario container with no
  // Final Answer between them.
  let signalDReason: string | null = null;
  const firstTeachingCmd = batch.find((c) => {
    const a = String((c as { action?: string }).action ?? '');
    return a.startsWith('show') && a !== 'showImage';
  });
  const firstAction = firstTeachingCmd
    ? String((firstTeachingCmd as { action?: string }).action ?? '')
    : '';
  if (firstAction && SUBSTEP_ACTIONS.has(firstAction)) {
    let mostRecentScenarioIdx = -1;
    for (let i = items.length - 1; i >= 0; i--) {
      if (SCENARIO_CONTAINER_ACTIONS.has(items[i].action)) {
        mostRecentScenarioIdx = i;
        break;
      }
    }
    if (mostRecentScenarioIdx >= 0) {
      const scenario = items[mostRecentScenarioIdx];
      const closed = finalAnswerSinceItem(catalog, mostRecentScenarioIdx);
      if (!closed) {
        signalDReason = `${firstAction}-after-${scenario.action}[${scenario.itemId}]`;
        signals.push('D');
      }
    }
  }

  if (signals.length === 0) {
    return { same: false, signals: [], decisive: false, reason: 'no tutor signals' };
  }

  const reasonParts: string[] = [];
  if (signalAItemId) reasonParts.push(`A:scribble/scrollTo→${signalAItemId}`);
  if (signalB) reasonParts.push('B:anaphora');
  if (signalCMatchedItemId) reasonParts.push(`C:overlap[${signalCTokens.join(',')}]→${signalCMatchedItemId}`);
  if (signalDReason) reasonParts.push(`D:${signalDReason}`);

  return {
    same: true,
    signals,
    decisive: signalAItemId !== null,
    reason: reasonParts.join(' '),
  };
}

export interface PageDecisionInput {
  tutorContext: TutorContextResult;
  studentText: string;
}

export interface PageDecisionResult {
  stripNewPage: boolean;
  reason: string;
}

// Precedence: A → strip; strong student keyword overrides B/C/D;
// otherwise any soft signal → strip. No signals → no opinion.
export function decidePageStrip(input: PageDecisionInput): PageDecisionResult {
  const { tutorContext, studentText } = input;
  if (!tutorContext.same) {
    return { stripNewPage: false, reason: 'tutor: no same-context signal' };
  }
  if (tutorContext.decisive) {
    return {
      stripNewPage: true,
      reason: `tutor decisive (${tutorContext.reason})`,
    };
  }
  const studentStrong = isStrongNewProblemKeyword(studentText);
  if (studentStrong) {
    return {
      stripNewPage: false,
      reason: `student strong-keyword overrides soft tutor signals (${tutorContext.reason})`,
    };
  }
  return {
    stripNewPage: true,
    reason: `tutor soft signals (${tutorContext.reason})`,
  };
}
