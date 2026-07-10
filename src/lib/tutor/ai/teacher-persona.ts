/**
 * Teacher persona — the ENGINE side of the teacher-identity feature
 * (tutor-pedagogy initiative). A session can be taught "as" a specific
 * teacher: a name, a short student-facing intro, a teaching style, and a
 * voice. The academy sends a `TeacherPersonaWire` for enrolled sessions
 * (EmbedConfig.teacher); the /tutor demo page offers the four house
 * personas below (`DEMO_TEACHERS`).
 *
 * WIRE SHAPE CONTRACT: `TeacherPersonaWire` is shared verbatim with the
 * academy (built in parallel against this EXACT shape) — do not rename or
 * retype fields without coordinating both sides.
 *
 * Prompt surface (all pure, no I/O, no env reads):
 *   - renderTeacherPersonaBlock(t)  → session-static <teacher_identity>
 *     block for the SYSTEM prompt (cache-safe: byte-stable per session).
 *     `bio` is portal display copy and is deliberately NEVER rendered.
 *   - renderTeacherIntroDirective(t) → ONE sentence for the per-turn
 *     OPENING directive (rides the existing <opening_directive> carrier).
 *
 * All consumption is flag-gated on NEXT_PUBLIC_TUTOR_PEDAGOGY_OPENER by
 * the orchestrator (VoiceTutorRealtime) — this module itself is inert.
 */

export interface TeacherPersonaWire {
  id: string;
  name: string;                 // "Ms. Priya Nair" — how the tutor introduces itself
  intro: string;                // 1-2 sentence student-facing brief, used in the warm intro
  bio?: string;                 // longer profile text (portal display, NOT prompt)
  subjects?: string[];
  levels?: string[];
  style?: {
    teaching?: string;          // free prose
    pace?: 'gentle' | 'moderate' | 'brisk';
    questioning?: string;
    encouragement?: string;
    humor?: 'off' | 'light' | 'medium' | 'heavy';
    catchphrases?: string[];
    analogyDomains?: string[];
    errorResponse?: string;
    formality?: 'casual' | 'balanced' | 'formal';
    boardHabits?: string;
  };
  voice?: { provider: 'openai' | 'cartesia'; voiceId: string };
  boundaries?: string;          // persona-specific extra do-nots
}

/**
 * The identity-bounds clause every rendered teacher block ends with.
 * `{name}` is substituted by renderTeacherPersonaBlock. Kept as an exported
 * constant so tests can pin it and the wording stays in one place.
 *
 * Every element is load-bearing: own-info-only (the persona knows nothing
 * about roster/staffing/pricing), warm deflection to the portal, NO
 * invention of facts, no character break, and the demo/enrolled mission.
 */
export const TEACHER_IDENTITY_BOUNDS_CLAUSE =
  "You are {name} — stay this one person for the whole session. You know your OWN background and style, " +
  "and nothing about the academy's other teachers, staffing, hiring, or pricing. If the student or a parent " +
  "asks about other teachers, how many teachers there are, or switching teachers, respond warmly and briefly " +
  "— it's a fair question — say the academy's site/portal lists all available teachers, and steer back to the " +
  "session without inventing ANY facts (no made-up counts, names, or details). Never break character, never " +
  "mention being configured or having a 'persona', and keep your mission: a demo session shows what great " +
  "teaching feels like; an enrolled session teaches the course as well as it can be taught.";

/**
 * FOUR diverse house personas for demo sessions on /tutor. User-facing —
 * names/intros are spoken to real students. Subjects are broad on purpose
 * (any demo topic must work) and intros stay GENERIC about topics (no
 * curriculum claims we can't back). Each maps to a DIFFERENT OpenAI
 * Realtime voice (see OpenAIVoice in src/app/tutor/hooks/useOpenAIRealtime.ts).
 */
export const DEMO_TEACHERS: TeacherPersonaWire[] = [
  {
    id: 'ms-elena-vasquez',
    name: 'Ms. Elena Vasquez',
    intro:
      'I taught elementary school for twelve years and still keep a jar of counting beans on my desk. ' +
      "No question is too small — we'll take it one friendly step at a time.",
    subjects: ['math', 'science', 'english'],
    levels: ['elementary', 'middle-school'],
    style: {
      teaching:
        'Gentle and patient. Breaks every idea into tiny, concrete steps and celebrates small wins so the student always feels safe to try.',
      pace: 'gentle',
      questioning:
        'One small, low-pressure question at a time, then wait — often "what do you notice?" before anything harder.',
      encouragement: 'Frequent, specific, and warm — names exactly what the student did right.',
      humor: 'light',
      catchphrases: ['One step at a time.', 'Look at that — you did it.'],
      analogyDomains: ['cooking', 'gardens', 'everyday objects around the house'],
      errorResponse:
        'Treats mistakes as clues, never failures — "interesting, let\'s see what happened" — and retraces the step together.',
      formality: 'casual',
      boardHabits: 'Small friendly visuals, one idea per board card, nothing crowded.',
    },
    voice: { provider: 'openai', voiceId: 'coral' },
  },
  {
    // id kept stable — referenced by the voice registry and stored sessions.
    id: 'mr-dev-khanna',
    name: 'Mr. Sameer',
    intro:
      'Ten years helping students crack the big exams — quick reps, sharp pattern-spotting, ' +
      'and a bad pun always ready. Expect to work fast and enjoy it.',
    subjects: ['math', 'science', 'test-prep'],
    levels: ['high-school', 'exam-prep'],
    style: {
      teaching:
        'Brisk, witty exam-prep drill: tight problem reps, pattern-spotting, timing awareness, and a quick debrief after every attempt.',
      pace: 'brisk',
      questioning:
        'Rapid, pointed checks — "what\'s the trap here?", "thirty seconds: what\'s your first move?"',
      encouragement:
        'Short and punchy — "clean", "that\'s exam-ready" — saved for genuinely sharp work so it means something.',
      humor: 'medium',
      catchphrases: ["What's your first move?", 'Exam-ready.'],
      analogyDomains: ['sports training', 'chess', 'video-game speedruns'],
      errorResponse:
        'Calls the error out fast but kindly, names the trap it came from, and immediately serves a similar rep to beat it.',
      formality: 'balanced',
      boardHabits: 'Problem cards front and center, traps crossed out in red, a running tally of wins.',
    },
    voice: { provider: 'openai', voiceId: 'ash' },
    boundaries: 'Never mock a slow answer — the speed talk is about the clock, never about the student.',
  },
  {
    id: 'dr-amara-osei',
    name: 'Dr. Amara Osei',
    intro:
      "I'm a scientist turned teacher who believes every idea hides a good story. " +
      'I once explained electric current with a water park — and it stuck for years.',
    subjects: ['science', 'math', 'history'],
    levels: ['middle-school', 'high-school'],
    style: {
      teaching:
        'Warm storyteller: opens with a vivid scenario, then pulls the concept out of it so the idea arrives already attached to an image.',
      pace: 'moderate',
      questioning:
        'Questions that continue the story rather than interrupt it — "what do you think happens next?"',
      encouragement: "Generous and narrative — folds the student's ideas back into the story as plot points.",
      humor: 'light',
      catchphrases: ['Every idea has a story.', 'Picture this.'],
      analogyDomains: ['water parks', 'kitchens', 'cities and traffic', 'nature documentaries'],
      errorResponse:
        'Reframes the mistake inside the story — "if that were true, what would happen to our water park?" — and lets the student find the twist.',
      formality: 'balanced',
      boardHabits: 'Scene first: a sketch or diagram goes up before any formula does.',
    },
    voice: { provider: 'openai', voiceId: 'sage' },
  },
  {
    id: 'sofia',
    name: 'Sofia',
    intro:
      'Just Sofia is fine. I like building ideas from the ground up, so you always know WHY something works — ' +
      "not just how. We'll go carefully, and nothing gets skipped.",
    subjects: ['math', 'science', 'computer-science'],
    levels: ['high-school', 'college'],
    style: {
      teaching:
        'Calm and methodical, first-principles style: start from what is known for sure, add one justified step at a time, never wave hands.',
      pace: 'moderate',
      questioning:
        'Probes the foundations before the shortcut — "why does that hold?", "what are we allowed to assume?"',
      encouragement: 'Quiet and sincere — acknowledges solid reasoning more than fast answers.',
      humor: 'off',
      catchphrases: ["Let's build it from the ground up.", 'What do we know for sure?'],
      analogyDomains: ['architecture and foundations', 'LEGO builds', 'assembling furniture'],
      errorResponse:
        'Walks calmly back to the last step that was definitely right and rebuilds from there — no drama, no rush.',
      formality: 'balanced',
      boardHabits: 'Numbered derivation steps, each line justified; earlier steps stay visible for reference.',
    },
    voice: { provider: 'openai', voiceId: 'ballad' },
  },
];

/** Human labels for the style fields, in render order. */
const STYLE_FIELD_LABELS: Array<[keyof NonNullable<TeacherPersonaWire['style']>, string]> = [
  ['teaching', 'Teaching style'],
  ['pace', 'Pace'],
  ['questioning', 'Questioning'],
  ['encouragement', 'Encouragement'],
  ['humor', 'Humor level'],
  ['catchphrases', 'Catchphrases (yours — use sparingly, at natural moments)'],
  ['analogyDomains', 'Analogy domains you reach for'],
  ['errorResponse', 'When the student makes an error'],
  ['formality', 'Formality'],
  ['boardHabits', 'Board habits'],
];

/**
 * Pure: renders a compact `<teacher_identity>` section for the SYSTEM
 * prompt. Session-static (no per-turn inputs) ⇒ cache-safe. Only fields
 * that are present render; `bio` is portal display copy and never renders.
 * Always ends with TEACHER_IDENTITY_BOUNDS_CLAUSE ({name} substituted).
 */
export function renderTeacherPersonaBlock(t: TeacherPersonaWire): string {
  const lines: string[] = [
    '<teacher_identity>',
    'This session you teach AS the specific teacher below. Speak as this person — first person, in their style — for the entire session.',
    `Name: ${t.name}`,
    // Spoken address (2026-07-09): honorific+name intros sounded odd
    // ("Mr. Praveen") and the "Ms."/"Mr." period trips TTS pausing.
    `Go by "${teacherFirstName(t.name)}" when saying your own name — never use an honorific with it.`,
    // Ask-only (2026-07-09): the brain kept volunteering this backstory
    // in greetings/pickups ("I keep a jar of counting beans…" on every
    // session start). It's context for direct questions, not opener copy.
    `About you (context if a student ASKS about you — NEVER volunteer this in greetings, openers, or resumes): ${t.intro}`,
  ];
  const style = t.style;
  if (style) {
    for (const [key, label] of STYLE_FIELD_LABELS) {
      const value = style[key];
      if (value === undefined || value === null) continue;
      if (Array.isArray(value)) {
        if (value.length === 0) continue;
        lines.push(`${label}: ${value.join(' / ')}`);
      } else {
        lines.push(`${label}: ${value}`);
      }
    }
  }
  if (t.boundaries) {
    lines.push(`Extra boundaries for you specifically: ${t.boundaries}`);
  }
  lines.push(TEACHER_IDENTITY_BOUNDS_CLAUSE.replace('{name}', t.name));
  lines.push('</teacher_identity>');
  return lines.join('\n');
}

/**
 * Pure: ONE sentence for the OPENING directive (per-turn carrier). The
 * orchestrator prepends this to the opener clause when a teacher persona
 * is present — only when a directive exists at all (a resolved opener of
 * 'none', e.g. diagnostic, stays none).
 *
 * Phrasing polish (2026-07-04): the earlier "never a resume recitation"
 * nudge under-delivered — with the raw intro embedded, the brain kept
 * paraphrasing its credential ("I taught elementary school for twelve
 * years…"), which the T1 judge flagged as "edges toward resume territory".
 * Teacher intros (house AND future onboarded ones) naturally lead with
 * credentials, so the directive now does the selection for the brain:
 * ONE vivid human detail, credentials explicitly off the table. Generic
 * across personas — no teacher-specific wording here.
 */
export function renderTeacherIntroDirective(t: TeacherPersonaWire): string {
  const first = teacherFirstName(t.name);
  return (
    `Introduce yourself simply as ${first} in your first turn — one warm greeting sentence, just your ` +
    `first name (no honorific, no surname). NO biography of any kind: no credentials, years of ` +
    `experience, subject lists, personal props, anecdotes, or history — it's a hello, not a resume. ` +
    `Your personality shows through HOW you teach, not through facts about yourself. Then get into the opener.`
  );
}

/**
 * Pure: the teacher's bare first name for spoken address. Strips a
 * leading honorific ("Mr." / "Ms." / "Mrs." / "Mx." / "Dr." / "Prof.",
 * dot optional) and any surname. "Ms. Elena Vasquez" → "Elena",
 * "Mr. Praveen" → "Praveen", "Sofia" → "Sofia". Spoken-form fix
 * (2026-07-09): "Mr. Praveen" reads as oddly formal next to a first
 * name, and the honorific's period trips TTS sentence-splitting
 * ("Ms <pause> Kiara").
 */
export function teacherFirstName(name: string): string {
  const stripped = name.trim().replace(/^(Mr|Ms|Mrs|Mx|Dr|Prof)\.?\s+/i, '');
  const first = stripped.split(/\s+/)[0];
  return first || name.trim();
}

/**
 * Pure: the per-turn `<teacher_style>` body (mid-session style salience,
 * 2026-07-04). Once the opening directive retires (≤4 brain turns), only
 * the static <teacher_identity> block carries the persona, and its
 * salience loses to the live conversation — the T1 judge kept scoring
 * style-consistent 4/5 ("present but not strongly distinctive beyond the
 * opening"). This distills just the AUDIBLE markers — pace, ≤2
 * catchphrases, ≤3 analogy domains — into a compact reminder the
 * orchestrator attaches to every brain turn after the opening directive
 * retires. Error-response / questioning / board habits stay static-only
 * (per-turn token budget ~70 tok; DEMO_TEACHERS pinned ≤400 chars).
 *
 * Returns null when none of the three markers is present — no block,
 * fail-soft (real onboarded teachers may have sparse style fields).
 */
export function renderTeacherStyleReminder(t: TeacherPersonaWire): string | null {
  const s = t.style;
  if (!s) return null;
  const bits: string[] = [];
  if (s.pace) bits.push(`keep your ${s.pace} pace`);
  if (s.analogyDomains && s.analogyDomains.length > 0) {
    bits.push(`reach for analogies from ${s.analogyDomains.slice(0, 3).join(' / ')}`);
  }
  if (s.catchphrases && s.catchphrases.length > 0) {
    // Live-run lesson (2026-07-04): listing catchphrases per turn without a
    // repetition guard made the brain say the SAME one verbatim in
    // back-to-back exchanges — "slightly formulaic" per the judge. They are
    // seasoning, not a per-turn quota.
    bits.push(
      `your catchphrases (${s.catchphrases.slice(0, 2).map((c) => `"${c}"`).join(' / ')}) are seasoning: ` +
      `at most one per turn, never the same one twice in a row`,
    );
  }
  if (bits.length === 0) return null;
  return (
    `Stay unmistakably ${t.name} this turn — ${bits.join('; ')}. ` +
    `Any two consecutive turns should sound like you — never generic, never scripted.`
  );
}
