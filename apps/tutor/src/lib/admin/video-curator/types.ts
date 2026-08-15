/**
 * Shared types for the video-curator admin UI.
 *
 * The runtime tutor doesn't read this directly yet — when the eventual
 * `show_video` whiteboard tool ships, it will look up by `conceptId` against
 * the saved segments in `src/data/curated-videos-ap.json`.
 */

export interface CedTopic {
  /** "ap-macro-1.4" — stable id used as the conceptId on saved segments. */
  conceptId: string;
  /** "1.4" — CED topic code. */
  cedTopic: string;
  /** "1" — CED unit. */
  cedUnit: string;
  /** "Comparative Advantage and Gains from Trade". */
  cedTitle: string;
  /** Source lesson plan id, e.g. "evelyn.ap.macro.comparative-advantage.v1". */
  planId: string;
  /** Plan title, e.g. "U1.4 Comparative Advantage and Gains from Trade". */
  planTitle: string;
  /** Learning objective description for the topic — used to brief the LLM. */
  loDescription: string;
  /** Concept-segment keyIdeas (joined) — richer brief for the LLM. */
  conceptKeyIdeas: string[];
}

export interface VideoMeta {
  youtubeId: string;
  title: string;
  channel: string;
  durationSec: number;
}

export interface VideoProposal extends VideoMeta {
  /** Why the LLM picked it — surfaced in UI for reviewer judgment. */
  reason: string;
  /** "ap_daily" | "khan" | "other" — channel quality bucket. */
  sourceQuality: 'ap_daily' | 'high' | 'medium' | 'unknown';
}

export interface ProposedSegment {
  /** Client-side temp id; replaced with uuid on save. */
  tempId: string;
  startSec: number;
  endSec: number;
  /** One-sentence description of what this clip explains. */
  summary: string;
  /** 0..1 — LLM's self-rated confidence the segment matches the concept. */
  confidence: number;
}

/**
 * One pre-computed draft entry — emitted by the batch script, displayed
 * read-only-ish in the UI. The reviewer accepts (saves to curated store)
 * or rejects (removes from drafts file).
 */
export interface DraftClip {
  /** Stable id, lets the UI dedupe + the batch idempotently re-run. */
  id: string;
  conceptId: string;
  cedTopic: string;
  cedTitle: string;
  /** Validated via oEmbed at batch time; if null, the draft itself failed. */
  video: VideoMeta | null;
  /** Why this video was picked (LLM reason). */
  reason: string;
  sourceQuality: VideoProposal['sourceQuality'];
  /** The proposed clip. null if transcript or LLM segmentation failed. */
  clip: {
    startSec: number;
    endSec: number;
    summary: string;
    confidence: number;
  } | null;
  /** Surfaces in UI so reviewer knows why a draft is empty. */
  errors: string[];
  generatedAt: string;
}

export interface DraftsStore {
  schemaVersion: 1;
  course: string;
  generatedAt: string;
  /** Backup search queries the batch produced per topic. Useful when the
   *  draft proposals are weak and the reviewer needs to find one manually. */
  searchQueriesByConcept: Record<string, Array<{ query: string; channel: string; reason: string }>>;
  drafts: DraftClip[];
}

export interface SavedSegment {
  /** uuid; idempotent on save. */
  id: string;
  course: 'ap-macroeconomics';
  conceptId: string;
  conceptTitle: string;
  youtubeId: string;
  videoTitle: string;
  videoChannel: string;
  videoDurationSec: number;
  language: string;
  startSec: number;
  endSec: number;
  summary: string;
  approvedAt: string;
}

export interface CuratedVideoStore {
  schemaVersion: 1;
  course: string;
  segments: SavedSegment[];
}

export interface TopicWithStatus extends CedTopic {
  savedSegmentCount: number;
  draftCount: number;
}
