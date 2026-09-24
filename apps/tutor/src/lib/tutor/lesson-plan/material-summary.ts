/**
 * Round 4 (E4): what a student's uploaded material is about — subject, level,
 * topic, one-line summary — so the portal can file a worksheet by its CONTENT
 * rather than its title (a title like "Ms Cathy's HW" is not a topic). One
 * cheap Haiku call over the extracted text; skeleton mirrors
 * enumerate-problems.ts (lazy client, injectable deps, last-JSON-wins parse,
 * never throws). Prompt is subject-agnostic.
 */
import Anthropic from '@anthropic-ai/sdk';
import { getModelClient, resolveModel } from '../ai/model-registry';

export interface MaterialSummary { subject: string; level?: string; topic: string; summary: string }

export const SUMMARY_SAMPLE_CHARS = 12_000;
const SUMMARY_MAX_TOKENS = 400;
const HAIKU_MODEL_ID = resolveModel('plangen-fast').model;

const SUMMARY_SYSTEM_PROMPT = `You read the text of a student's uploaded school material (a worksheet, notes, or a problem set) and say what it is about. Output ONLY JSON:
{"subject":"<school subject, e.g. Algebra, Biology, US History>","level":"<grade or course level if the text shows it; omit otherwise>","topic":"<the specific topic in 3-8 words>","summary":"<one sentence describing the material>"}
Never refuse and never judge the material: it always has a subject and a topic.`;

function parseLastJson(text: string): unknown {
  const fenced = [...text.matchAll(/```(?:json)?\s*([\s\S]*?)```/g)].map((m) => m[1]!);
  const candidates = fenced.length > 0 ? fenced : [text];
  for (let i = candidates.length - 1; i >= 0; i--) {
    try { return JSON.parse(candidates[i]!.trim()); } catch { /* try earlier */ }
  }
  return null;
}

const clip = (v: unknown, max: number): string => (typeof v === 'string' ? v.trim().slice(0, max).trim() : '');

/** Contract caps (MaterialSummaryResponseSchema): subject 80, level 40, topic 120, summary 400. Pure. */
export function parseMaterialSummary(raw: unknown): MaterialSummary | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const subject = clip(o.subject, 80);
  const topic = clip(o.topic, 120);
  const summary = clip(o.summary, 400);
  if (!subject || !topic || !summary) return null;
  const level = clip(o.level, 40);
  return { subject, ...(level ? { level } : {}), topic, summary };
}

export interface SummaryDeps { complete(system: string, user: string): Promise<string> }

export async function summarizeMaterial(text: string, deps: SummaryDeps): Promise<MaterialSummary | null> {
  const t = text.trim();
  if (!t) return null;
  try {
    return parseMaterialSummary(parseLastJson(await deps.complete(SUMMARY_SYSTEM_PROMPT, t.slice(0, SUMMARY_SAMPLE_CHARS))));
  } catch (err) {
    console.warn('[material-summary] failed:', (err as Error)?.message ?? err);
    return null;
  }
}

/** Lazy: the API key is read at call time, not import time (see enumerate-problems.ts). */
export function getSummaryClient(): Anthropic {
  return getModelClient('plangen-fast').client;
}

export function defaultSummaryDeps(client: Anthropic): SummaryDeps {
  return {
    async complete(system, user) {
      const res = await client.messages.create({
        model: HAIKU_MODEL_ID,
        max_tokens: SUMMARY_MAX_TOKENS,
        temperature: 0,
        system,
        messages: [{ role: 'user', content: [{ type: 'text', text: user }] }],
      });
      const block = res.content.find((b) => b.type === 'text');
      return block && block.type === 'text' ? block.text : '';
    },
  };
}
