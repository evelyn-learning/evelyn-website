/**
 * Shared "search → validate → segment" pipeline used by:
 *   - the offline batch script (`scripts/curate-ap-macro-videos.ts`)
 *   - the manual-paste fallback HTTP route (`/api/admin/video-curator/segment-video`)
 *
 * The browser UI never calls into this module directly — it reads
 * pre-computed drafts written by the batch script.
 */

import Anthropic from '@anthropic-ai/sdk';
import { getModelClient } from '../../tutor/ai/model-registry';
import { randomUUID } from 'crypto';
import {
  extractYouTubeId,
  fetchTranscript,
  validateAndDescribe,
  type TranscriptCue,
} from './youtube';
import type { CedTopic, DraftClip, VideoMeta } from './types';

const { client: anthropic, model: CURATOR_MODEL } = getModelClient('video-curator');

const PROPOSER_SYSTEM = `You are helping curate YouTube videos for an AP Macroeconomics tutoring app. Your job is to propose specific, real YouTube videos that teach a given AP CED topic. Use web search to find them.

PRIORITY ORDER (always prefer earlier sources):
1. "AP Daily" by College Board — the official AP video series. Channel: "Advanced Placement". These are the gold standard and exist for nearly every AP Macro CED topic.
2. Jacob Clifford ("ACDC Leadership" / "Jacob Clifford") — most popular AP Macro tutor on YouTube.
3. Khan Academy macroeconomics.
4. Marginal Revolution University.
5. Crash Course Economics (use only when topic is broad enough — these videos are general, not CED-aligned).

Use web search to LOCATE specific videos. For each result, include the exact YouTube URL or 11-character video id you found via web search, the title and channel as they appear on YouTube, and a one-sentence reason why this video is a good fit for this CED topic.

CRITICAL — never invent a YouTube video id. Only return ids you've actually located via web_search results. If you cannot verify a specific id for a high-priority source, omit that proposal and put the search query in searchQueries instead.

Return UP TO 2 direct video proposals (the best you can verify). Also return 2-3 BACKUP YouTube search queries the human curator can run if your direct proposals don't work.

OUTPUT FORMAT — return strict JSON only, no prose:
{
  "proposals": [
    { "youtubeUrlOrId": "<url or 11-char id>", "title": "<video title>", "channel": "<channel name>", "reason": "<one sentence>" }
  ],
  "searchQueries": [
    { "query": "<exact YouTube search query>", "channel": "<expected channel>", "reason": "<one sentence>" }
  ]
}`;

const SEGMENTER_SYSTEM = `You are helping curate ONE timestamped clip from a YouTube video for an AP Macroeconomics tutor. The student is mid-lesson on a specific CED topic; the tutor will play this clip and then resume teaching.

You will receive:
1. The CED topic (unit, topic code, title, learning objective, key ideas).
2. A YouTube transcript as an array of timestamped cues.

Identify the SINGLE best clip segment in this video for the CED topic.

CONSTRAINTS:
- The clip must be at least 30 seconds and at most 240 seconds.
- Pick a clip that stands alone — the student should be able to follow without prior context.
- startSec is the timestamp where the explanation begins; endSec is a natural stopping point (end of an example, transition to a different topic, complete thought).
- summary: ONE sentence under 25 words describing what this clip teaches.
- confidence: 0.0-1.0, your own assessment of how well this clip matches the CED topic.
- If the video does NOT cover this CED topic well, return null. DO NOT stretch.

OUTPUT FORMAT — return strict JSON only, no prose:
{ "clip": { "startSec": <int>, "endSec": <int>, "summary": "<sentence>", "confidence": <0..1> } }
or
{ "clip": null, "reason": "<one sentence why no clip fits>" }`;

interface RawProposal {
  youtubeUrlOrId: string;
  title?: string;
  channel?: string;
  reason: string;
}

interface RawSearchQuery {
  query: string;
  channel: string;
  reason: string;
}

interface ProposerPayload {
  proposals: RawProposal[];
  searchQueries: RawSearchQuery[];
}

interface SegmenterPayload {
  clip:
    | { startSec: number; endSec: number; summary: string; confidence: number }
    | null;
  reason?: string;
}

function extractJson<T>(text: string): T | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]+?)```/);
  const candidate = fenced ? fenced[1] : text;
  const objMatch = candidate.match(/\{[\s\S]*\}/);
  if (!objMatch) return null;
  try {
    return JSON.parse(objMatch[0]) as T;
  } catch {
    return null;
  }
}

function bucketChannel(channel: string): DraftClip['sourceQuality'] {
  const c = channel.toLowerCase().replace(/\s+/g, '');
  if (c.includes('advancedplacement') || c.includes('apdaily')) return 'ap_daily';
  if (
    c.includes('clifford') ||
    c.includes('acdc') ||
    c.includes('khanacademy') ||
    c.includes('marginalrevolution') ||
    c.includes('mru.org')
  )
    return 'high';
  if (c.includes('crashcourse') || c.includes('reviewecon')) return 'medium';
  return 'unknown';
}

function buildProposerUserMsg(topic: CedTopic): string {
  return `AP Macroeconomics — Unit ${topic.cedUnit}, Topic ${topic.cedTopic}: ${topic.cedTitle}

Learning objective:
${topic.loDescription}

Key ideas covered:
${topic.conceptKeyIdeas.map((k, i) => `${i + 1}. ${k}`).join('\n')}

Find the 2 best YouTube videos that teach this topic.`;
}

function formatTranscript(cues: TranscriptCue[]): string {
  return cues
    .map((c) => {
      const m = Math.floor(c.startSec / 60);
      const s = c.startSec % 60;
      return `[${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}] ${c.text}`;
    })
    .join('\n');
}

async function proposeVideos(
  topic: CedTopic,
): Promise<{ payload: ProposerPayload | null; error: string | null }> {
  try {
    const response = await anthropic.messages.create({
      model: CURATOR_MODEL,
      max_tokens: 2048,
      // Static across every topic in the run — mark as ephemeral cache
      // so the second-and-onward call hit the cached prefix at ~10% of
      // the input rate. Cache TTL is 5 min; the batch issues calls
      // sequentially well within that window.
      system: [
        {
          type: 'text',
          text: PROPOSER_SYSTEM,
          cache_control: { type: 'ephemeral' },
        },
      ],
      tools: [
        {
          type: 'web_search_20250305',
          name: 'web_search',
          max_uses: 5,
        } as unknown as Anthropic.Tool,
      ],
      messages: [{ role: 'user', content: buildProposerUserMsg(topic) }],
    });
    const textBlock = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('\n');
    const payload = extractJson<ProposerPayload>(textBlock);
    if (!payload) return { payload: null, error: 'Proposer returned unparseable JSON' };
    return { payload, error: null };
  } catch (e) {
    return { payload: null, error: e instanceof Error ? e.message : String(e) };
  }
}

export async function segmentOneVideo(
  topic: CedTopic,
  video: VideoMeta,
): Promise<{
  clip: DraftClip['clip'];
  errors: string[];
}> {
  const errors: string[] = [];
  let cues: TranscriptCue[];
  try {
    cues = await fetchTranscript(video.youtubeId);
  } catch (e) {
    errors.push(
      `Transcript unavailable: ${e instanceof Error ? e.message : String(e)}`,
    );
    return { clip: null, errors };
  }
  if (cues.length === 0) {
    errors.push('Transcript empty (no captions on this video)');
    return { clip: null, errors };
  }

  const userMsg = `AP Macroeconomics — Unit ${topic.cedUnit}, Topic ${topic.cedTopic}: ${topic.cedTitle}

Learning objective:
${topic.loDescription}

Key ideas covered by this CED topic:
${topic.conceptKeyIdeas.map((k, i) => `${i + 1}. ${k}`).join('\n')}

Video: "${video.title}" by ${video.channel} (${Math.round(video.durationSec / 60)} min)

Transcript:
${formatTranscript(cues)}

Identify the SINGLE best clip (30-240s). Return JSON only.`;

  let raw: SegmenterPayload | null = null;
  try {
    const response = await anthropic.messages.create({
      model: CURATOR_MODEL,
      max_tokens: 1024,
      system: [
        {
          type: 'text',
          text: SEGMENTER_SYSTEM,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [{ role: 'user', content: userMsg }],
    });
    const textBlock = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('\n');
    raw = extractJson<SegmenterPayload>(textBlock);
    if (!raw) errors.push('Segmenter returned unparseable JSON');
  } catch (e) {
    errors.push(`Segmenter error: ${e instanceof Error ? e.message : String(e)}`);
  }

  if (!raw?.clip) {
    if (raw?.reason) errors.push(`Segmenter: ${raw.reason}`);
    return { clip: null, errors };
  }
  const len = raw.clip.endSec - raw.clip.startSec;
  if (raw.clip.endSec <= raw.clip.startSec || len < 20) {
    errors.push(`Segmenter returned invalid range (${len}s)`);
    return { clip: null, errors };
  }
  return {
    clip: {
      startSec: Math.max(0, Math.round(raw.clip.startSec)),
      endSec: Math.min(
        video.durationSec || raw.clip.endSec,
        Math.round(raw.clip.endSec),
      ),
      summary: raw.clip.summary,
      confidence: Math.max(0, Math.min(1, Number(raw.clip.confidence) || 0)),
    },
    errors,
  };
}

/**
 * Full pipeline for one topic: ask LLM for the 2 best videos, validate
 * each via oEmbed, fetch transcripts in parallel, ask LLM for the best
 * clip in each. Returns up to 2 DraftClip entries plus the backup search
 * queries the LLM emitted.
 *
 * Always returns drafts even when components fail — the `errors` field
 * on each draft tells the reviewer what went wrong, so a partial bad
 * batch is still useful.
 */
export async function findClipsForTopic(topic: CedTopic): Promise<{
  drafts: DraftClip[];
  searchQueries: RawSearchQuery[];
  topLevelErrors: string[];
}> {
  const topLevelErrors: string[] = [];
  const { payload, error } = await proposeVideos(topic);
  if (error) topLevelErrors.push(`Proposer: ${error}`);

  const proposals = (payload?.proposals ?? []).slice(0, 2);
  const searchQueries = payload?.searchQueries ?? [];

  const draftsPromises = proposals.map(async (p): Promise<DraftClip | null> => {
    const errors: string[] = [];
    const id = extractYouTubeId(p.youtubeUrlOrId);
    if (!id) {
      errors.push(`Could not extract YouTube id from "${p.youtubeUrlOrId}"`);
      return {
        id: randomUUID(),
        conceptId: topic.conceptId,
        cedTopic: topic.cedTopic,
        cedTitle: topic.cedTitle,
        video: null,
        reason: p.reason,
        sourceQuality: 'unknown',
        clip: null,
        errors,
        generatedAt: new Date().toISOString(),
      };
    }
    const video = await validateAndDescribe(id);
    if (!video) {
      errors.push(`Video ${id} failed oEmbed (private/deleted/region-blocked)`);
      return {
        id: randomUUID(),
        conceptId: topic.conceptId,
        cedTopic: topic.cedTopic,
        cedTitle: topic.cedTitle,
        video: null,
        reason: p.reason,
        sourceQuality: 'unknown',
        clip: null,
        errors,
        generatedAt: new Date().toISOString(),
      };
    }
    const { clip, errors: segErrors } = await segmentOneVideo(topic, video);
    return {
      id: randomUUID(),
      conceptId: topic.conceptId,
      cedTopic: topic.cedTopic,
      cedTitle: topic.cedTitle,
      video,
      reason: p.reason,
      sourceQuality: bucketChannel(video.channel),
      clip,
      errors: [...errors, ...segErrors],
      generatedAt: new Date().toISOString(),
    };
  });

  const drafts = (await Promise.all(draftsPromises)).filter(
    (d): d is DraftClip => d !== null,
  );

  // Sort: ap_daily > high > medium > unknown
  const order = { ap_daily: 0, high: 1, medium: 2, unknown: 3 };
  drafts.sort((a, b) => order[a.sourceQuality] - order[b.sourceQuality]);

  return { drafts, searchQueries, topLevelErrors };
}
