/**
 * Grade band → pedagogy profile.
 *
 * The same Socratic system prompt isn't right for a 6-year-old and a
 * 17-year-old. A K-2 student is *learning what an answer looks like* —
 * they need direct modeling, short sentences, lots of pictures, generous
 * wait time. A 9-12 student is reasoning about abstractions and benefits
 * from real Socratic depth and equations integrated with explanation.
 *
 * This module produces a small struct keyed by grade band that the
 * system-prompt builder reads and inlines as a `<grade_profile>` block.
 * No grade-specific examples — only behavior knobs.
 */

export type GradeBand = 'K-2' | '3-5' | '6-8' | '9-12';

export interface GradeProfile {
  band: GradeBand;
  /** One-paragraph behavior description the brain reads. */
  description: string;
  /** Default Socratic depth: "direct" = model first, "guided" = scaffold,
   *  "open" = ask before answering. */
  socraticDefault: 'direct' | 'guided' | 'open';
  /** Target sentence length in words (approximate; brain stays loose). */
  sentenceLengthWords: { min: number; target: number; max: number };
  /** Vocabulary policy. */
  vocabulary: 'fry-100' | 'fry-300' | 'grade-level' | 'unrestricted';
  /** Maximum length of labels on diagrams (words). */
  labelMaxWords: number;
  /** Pacing multiplier for comprehension pauses (1.0 baseline). */
  pacingMultiplier: number;
  /** Tolerated humor level — light puns vs. richer parallel-story humor. */
  humorCeiling: 'off' | 'light' | 'medium' | 'heavy';
}

const PROFILES: Record<GradeBand, GradeProfile> = {
  'K-2': {
    band: 'K-2',
    description: 'Very young learners. Most of teaching is *modeling* — show what an answer looks like, name what you\'re doing as you do it, then have them try the same thing. Sentences are short and concrete. Visuals carry meaning that words can\'t. The student needs a noticeable pause to absorb each picture / step. Avoid abstract language entirely; everything is "this many", "the same", "one more", "split it in half" — never "compute", "evaluate", "represent". Praise is short and warm, not effusive.',
    socraticDefault: 'direct',
    sentenceLengthWords: { min: 3, target: 8, max: 14 },
    vocabulary: 'fry-100',
    labelMaxWords: 3,
    pacingMultiplier: 2.0,
    humorCeiling: 'light',
  },
  '3-5': {
    band: '3-5',
    description: 'Elementary upper. Students can handle a single guiding question before being shown an answer; multi-step Socratic still loses them. Concrete-pictorial-abstract progression: ground new ideas in something they can see, then a picture, then symbols. Short worked examples paired with try-yourself. Vocabulary is grade-level — name terms but always paraphrase the first time you use one. Two-sentence praise is fine.',
    socraticDefault: 'guided',
    sentenceLengthWords: { min: 6, target: 14, max: 22 },
    vocabulary: 'fry-300',
    labelMaxWords: 5,
    pacingMultiplier: 1.5,
    humorCeiling: 'medium',
  },
  '6-8': {
    band: '6-8',
    description: 'Middle school. Real Socratic works — ask before showing, scaffold when stuck. Equations and structured diagrams integrate naturally with verbal explanation. Students can hold two-three step chains in working memory. Vocabulary is age-appropriate; precise math/science terms expected. Humor and parallel-situation analogies land well.',
    socraticDefault: 'guided',
    sentenceLengthWords: { min: 8, target: 18, max: 30 },
    vocabulary: 'grade-level',
    labelMaxWords: 8,
    pacingMultiplier: 1.2,
    humorCeiling: 'medium',
  },
  '9-12': {
    band: '9-12',
    description: 'High school. Full Socratic; assume the student can hold longer arguments. Formal vocabulary, rigorous notation, multi-step derivations integrated with prose. Peer-level tone allowed (still kind, never sarcastic). Humor lands as long as it has a point — pure jokes feel beneath the level.',
    socraticDefault: 'open',
    sentenceLengthWords: { min: 10, target: 22, max: 40 },
    vocabulary: 'unrestricted',
    labelMaxWords: 12,
    pacingMultiplier: 1.0,
    humorCeiling: 'heavy',
  },
};

/** Map a configured grade ("K", "1", "5", "9-10", "11", …) to a band. */
export function gradeBandFor(grade: string): GradeBand {
  const g = grade.trim().toUpperCase();
  if (g === 'K' || g === 'KG' || g === 'KINDERGARTEN') return 'K-2';
  // Range form like "9-10" — take the lower bound.
  const rangeMatch = g.match(/^(\d+)\s*-\s*(\d+)$/);
  const n = rangeMatch ? parseInt(rangeMatch[1], 10) : parseInt(g, 10);
  if (!Number.isFinite(n)) return '6-8';                  // safe default
  if (n <= 2) return 'K-2';
  if (n <= 5) return '3-5';
  if (n <= 8) return '6-8';
  return '9-12';
}

export function getGradeProfile(grade: string | undefined): GradeProfile {
  return PROFILES[gradeBandFor(grade ?? '')] ?? PROFILES['6-8'];
}

/** Render the grade profile as a system-prompt block. The brain reads
 *  it once per session (cached in the system prompt). */
export function renderGradeProfileBlock(profile: GradeProfile): string {
  return [
    `<grade_profile band="${profile.band}">`,
    profile.description,
    ``,
    `Behavior knobs (defaults; deviate if the student's actual ability says otherwise):`,
    `- Socratic depth: ${profile.socraticDefault}`,
    `  · "direct"  → model the answer first, then ask "now you try"`,
    `  · "guided"  → one guiding question, then show, then try-yourself`,
    `  · "open"    → ask first, only show after they've tried`,
    `- Sentence length: aim around ${profile.sentenceLengthWords.target} words; avoid > ${profile.sentenceLengthWords.max}.`,
    `- Vocabulary: ${profile.vocabulary}`,
    `  · "fry-100" → first 100 most common words; paraphrase any term beyond that`,
    `  · "fry-300" → first 300; introduce new terms with a one-line gloss`,
    `  · "grade-level" → age-appropriate; precise terms expected`,
    `  · "unrestricted" → formal vocabulary OK`,
    `- Labels on diagrams: ${profile.labelMaxWords} words max.`,
    `- Pacing: this band needs ~${profile.pacingMultiplier}× the baseline pause after each tool call (the engine inserts the pause; you don't have to think about it).`,
    `- Humor ceiling: ${profile.humorCeiling}.`,
    `</grade_profile>`,
  ].join('\n');
}
