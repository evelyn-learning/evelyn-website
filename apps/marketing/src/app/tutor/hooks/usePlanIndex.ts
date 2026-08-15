/**
 * usePlanIndex — load the slim catalog index ONCE and serve instant,
 * DB-free quick-search + Subject→Level→Topic→Lesson cascade.
 *
 * The index (≈1k entries) is fetched from /api/tutor/lesson-plans/index on
 * first use, memoised at module scope (shared across every component +
 * remount) and mirrored to sessionStorage so a full reload is warm. Search
 * and cascade lookups run entirely in memory.
 */
'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  SUBJECTS,
  LEVELS,
  getTopicsForSubjectLevel,
} from '@/lib/tutor/topic-taxonomy';
import {
  PLAN_INDEX_VERSION,
  type PlanIndexEntry,
  type PlanIndexResponse,
} from '@/lib/tutor/lesson-plan/plan-index-types';

const SESSION_KEY = `tutor_plan_index_v${PLAN_INDEX_VERSION}`;

// Module-scope cache shared across all hook consumers + remounts.
let indexCache: PlanIndexEntry[] | null = null;
let inflight: Promise<PlanIndexEntry[]> | null = null;

async function loadIndex(): Promise<PlanIndexEntry[]> {
  if (indexCache) return indexCache;
  if (inflight) return inflight;

  // Warm-start from sessionStorage (survives full reloads within a tab).
  if (typeof window !== 'undefined') {
    try {
      const raw = window.sessionStorage.getItem(SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PlanIndexEntry[];
        if (Array.isArray(parsed) && parsed.length) indexCache = parsed;
      }
    } catch {
      /* ignore corrupt cache */
    }
    if (indexCache) {
      // Revalidate in the background without blocking the first paint.
      void fetchFresh();
      return indexCache;
    }
  }
  return fetchFresh();
}

async function fetchFresh(): Promise<PlanIndexEntry[]> {
  inflight = (async () => {
    const res = await fetch('/api/tutor/lesson-plans/index');
    if (!res.ok) throw new Error(`index fetch failed: ${res.status}`);
    const data = (await res.json()) as PlanIndexResponse;
    indexCache = data.entries;
    if (typeof window !== 'undefined') {
      try {
        window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(data.entries));
      } catch {
        /* quota / disabled — non-fatal */
      }
    }
    return indexCache;
  })();
  try {
    return await inflight;
  } finally {
    inflight = null;
  }
}

// ── search ──────────────────────────────────────────────────────────────
// Google-autocomplete-style, typo-tolerant ranking. Primary path: each query
// token is matched against an entry's candidate WORDS via prefix-aware edit
// distance, tolerating substitutions/transpositions/missing letters
// ("geomdtric"→geometric, "stiociome"→stoichiometry, "quadratc"→quadratic).
// Fallbacks: whole-query subsequence on the title (scattered initials like
// "apclc"), then substring token-AND on the full haystack (LO concepts).

/** fzf-style subsequence score of `pat` within `text`. null = not a
 *  subsequence (no match). Higher = tighter/earlier match. */
function fuzzyScore(text: string, pat: string): number | null {
  if (!pat) return 0;
  let ti = 0;
  let score = 0;
  let run = 0;
  for (let pi = 0; pi < pat.length; pi++) {
    const c = pat[pi];
    if (c === ' ') { run = 0; continue; } // spaces don't need to align
    let found = -1;
    for (let j = ti; j < text.length; j++) {
      if (text[j] === c) { found = j; break; }
    }
    if (found === -1) return null;
    const gap = found - ti;
    if (gap === 0) { run++; score += 6 + run * 4; } // consecutive char
    else { run = 0; score += 2; score -= Math.min(gap, 6); } // jumped a gap
    const prev = found > 0 ? text[found - 1] : ' ';
    if (prev === ' ' || prev === '-' || prev === '(') score += 10; // word start
    ti = found + 1;
  }
  return score;
}

/** Edit distance between `a` and the BEST-MATCHING PREFIX of `b` (trailing
 *  chars of b are free), capped at `max` for early exit. Lets a short typed
 *  token match the start of a longer word, tolerating substitutions,
 *  transpositions, and missing/extra letters. */
function prefixEditDistance(a: string, b: string, max: number): number {
  const n = a.length;
  if (n === 0) return 0;
  const m = Math.min(b.length, n + max); // only need a prefix of b this long
  let prev = new Array<number>(m + 1);
  for (let j = 0; j <= m; j++) prev[j] = j;
  for (let i = 1; i <= n; i++) {
    const cur = new Array<number>(m + 1);
    cur[0] = i;
    let rowMin = i;
    const ac = a.charCodeAt(i - 1);
    for (let j = 1; j <= m; j++) {
      const cost = ac === b.charCodeAt(j - 1) ? 0 : 1;
      const v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      cur[j] = v;
      if (v < rowMin) rowMin = v;
    }
    if (rowMin > max) return max + 1; // can't get under the cap — bail
    prev = cur;
  }
  let best = prev[0];
  for (let j = 1; j <= m; j++) if (prev[j] < best) best = prev[j];
  return best;
}

/** Typo budget for a token of a given length. */
function tokThreshold(len: number): number {
  if (len <= 3) return 1;
  return Math.floor(len / 4) + 1; // 4-7→2, 8-11→3, 12+→4
}

// Per-entry candidate words, cached so we don't re-tokenise each keystroke.
// Split into TITLE-level words (title + topic/subject/exam — high relevance)
// and EXTRA words (longer learning-objective keywords — lower relevance).
const titleWordsCache = new WeakMap<PlanIndexEntry, string[]>();
const extraWordsCache = new WeakMap<PlanIndexEntry, string[]>();
function titleWords(e: PlanIndexEntry): string[] {
  const hit = titleWordsCache.get(e);
  if (hit) return hit;
  const head = `${e.title} ${e.topic ?? ''} ${e.cellTopic ?? ''} ${e.cellLevel ?? ''} ${e.subject} ${e.curriculum} ${e.cedTitle ?? ''}`;
  const set = new Set<string>();
  for (const w of head.toLowerCase().split(/[^a-z0-9]+/)) if (w.length >= 2) set.add(w);
  const arr = Array.from(set).slice(0, 32);
  titleWordsCache.set(e, arr);
  return arr;
}
function extraWords(e: PlanIndexEntry): string[] {
  const hit = extraWordsCache.get(e);
  if (hit) return hit;
  const set = new Set<string>();
  if (e.firstLo) for (const w of e.firstLo.toLowerCase().split(/[^a-z0-9]+/)) if (w.length >= 5) set.add(w);
  const arr = Array.from(set).slice(0, 32);
  extraWordsCache.set(e, arr);
  return arr;
}

/** How well a single typed token matches a single candidate word. Layered by
 *  precision so high-confidence matches dominate typo-tolerant ones:
 *  exact > prefix > subsequence-in-word > small edit distance. -Infinity = no
 *  match. (Subsequence is what keeps "elip"→ellipse but NOT →elapsed; edit
 *  distance is what adds "geomdtric"→geometric / "stiociome"→stoichiometry.) */
function wordQuality(t: string, w: string): number {
  if (w === t) return 200;
  if (w.startsWith(t)) return 150;
  const sub = fuzzyScore(w, t); // subsequence WITHIN this single word
  if (sub !== null) return 90 + Math.min(sub, 45);
  if (t.length >= 4) {
    const thr = tokThreshold(t.length);
    const d = prefixEditDistance(t, w, thr);
    if (d <= thr) return 58 - d * 14;
  }
  return -Infinity;
}

function rankAndSearch(entries: PlanIndexEntry[], query: string, limit: number): PlanIndexEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const tokens = q.split(/\s+/).filter(Boolean);
  const scored: Array<{ e: PlanIndexEntry; score: number }> = [];
  for (const e of entries) {
    const title = e.title.toLowerCase();
    let score = -Infinity;

    // Path 1 — every token matches a candidate word (typo-tolerant core).
    const tw = titleWords(e);
    const xw = extraWords(e);
    let ok = true;
    let tsum = 0;
    for (const t of tokens) {
      let best = -Infinity;
      for (const w of tw) { const qy = wordQuality(t, w); if (qy > best) best = qy; if (best >= 200) break; }
      // objective-only matches count, but at a discount vs title matches
      if (best < 150) for (const w of xw) { const qy = wordQuality(t, w) * 0.7; if (qy > best) best = qy; }
      if (best < 0) { ok = false; break; }
      tsum += best;
    }
    if (ok) score = 1000 + tsum;

    // Path 2 — whole-query subsequence on the title (scattered initials like "apclc").
    if (score < 0) { const w = fuzzyScore(title, q); if (w !== null) score = 650 + w; }

    // Path 3 — substring token-AND across the full haystack (LO concepts).
    if (score < 0 && tokens.every((t) => e.search.includes(t))) {
      score = 200 + (title.includes(q) ? 60 : 0);
    }

    if (score < 0) continue;
    if (title.startsWith(q)) score += 120; // strong whole-title prefix boost
    score -= Math.min(e.title.length, 90) / 200; // gently prefer tighter titles
    scored.push({ e, score });
  }
  scored.sort((a, b) => b.score - a.score || a.e.title.localeCompare(b.e.title));
  return scored.slice(0, limit).map((s) => s.e);
}

export interface PlanIndexApi {
  ready: boolean;
  error: boolean;
  entries: PlanIndexEntry[];
  search: (query: string, limit?: number) => PlanIndexEntry[];
  subjects: () => Array<{ id: string; label: string; icon?: string }>;
  levelsFor: (subjectId: string) => Array<{ id: string; label: string }>;
  topicsFor: (subjectId: string, levelId: string) => Array<{ id: string; label: string }>;
  lessonsFor: (subjectId: string, levelId: string, topicId: string) => PlanIndexEntry[];
  byId: (id: string) => PlanIndexEntry | undefined;
}

export function usePlanIndex(): PlanIndexApi {
  const [entries, setEntries] = useState<PlanIndexEntry[]>(indexCache ?? []);
  const [ready, setReady] = useState<boolean>(!!indexCache);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadIndex()
      .then((e) => {
        if (cancelled) return;
        setEntries(e);
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo<PlanIndexApi>(() => {
    const byCell = (subjectId: string, levelId?: string, topicId?: string) =>
      entries.filter(
        (e) =>
          e.cellSubject === subjectId &&
          (levelId === undefined || e.cellLevel === levelId) &&
          (topicId === undefined || e.cellTopic === topicId),
      );

    return {
      ready,
      error,
      entries,
      search: (query, limit = 50) => rankAndSearch(entries, query, limit),
      subjects: () => {
        const present = new Set(entries.map((e) => e.cellSubject).filter(Boolean) as string[]);
        return SUBJECTS.filter((s) => present.has(s.id)).map((s) => ({
          id: s.id,
          label: s.label,
          icon: s.icon,
        }));
      },
      levelsFor: (subjectId) => {
        const present = new Set(byCell(subjectId).map((e) => e.cellLevel).filter(Boolean) as string[]);
        return LEVELS.filter((l) => present.has(l.id)).map((l) => ({ id: l.id, label: l.label }));
      },
      topicsFor: (subjectId, levelId) => {
        const present = new Set(
          byCell(subjectId, levelId).map((e) => e.cellTopic).filter(Boolean) as string[],
        );
        // Preserve canonical taxonomy ordering + labels.
        return getTopicsForSubjectLevel(subjectId, levelId)
          .filter((t) => present.has(t.id))
          .map((t) => ({ id: t.id, label: t.label }));
      },
      lessonsFor: (subjectId, levelId, topicId) => byCell(subjectId, levelId, topicId),
      byId: (id) => entries.find((e) => e.id === id),
    };
  }, [entries, ready, error]);
}
