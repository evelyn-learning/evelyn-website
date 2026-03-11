import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { checkDailyLimit } from '@/lib/utils/rate-limit';
import { checkCopyscape, type CopyscapeResult } from '@/lib/utils/copyscape';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Rate limiting
interface RateLimitEntry { count: number; resetTime: number; }
const rateLimitStore = new Map<string, RateLimitEntry>();
const RATE_LIMIT = { requests: 15, windowMs: 60_000 };

function getIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',')[0].trim() : 'unknown';
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const key = `plag:${ip}`;
  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT.windowMs });
    return true;
  }
  if (entry.count >= RATE_LIMIT.requests) return false;
  entry.count++;
  return true;
}

// Grade-level calibration
function getCalibrationPrompt(context?: { gradeLevel?: number; subject?: string; assignmentType?: string }): string {
  if (!context) return '';

  const gradeDesc: Record<number, string> = {
    9: 'a 9th grader (freshman). Expect simpler vocabulary, shorter sentences, and developing argumentation. Some awkward phrasing is normal and should NOT be flagged.',
    10: 'a 10th grader (sophomore). Expect moderate vocabulary and growing sophistication. Some inconsistency in tone is normal.',
    11: 'an 11th grader (junior). Expect competent vocabulary and reasonable argument structure.',
    12: 'a 12th grader (senior). Expect strong vocabulary, well-structured arguments. AP-level work may be highly polished — polish alone is not suspicious.',
  };

  const subjectNotes: Record<string, string> = {
    english: 'English/Language Arts — focus on voice and personal expression. Literary terms taught in class are expected.',
    history: 'History/Social Studies — factual claims and dates are expected. Distinguish paraphrasing from copying.',
    science: 'Science — technical terminology is expected, not suspicious. Lab reports follow formulaic structures by design.',
    other: 'General academic writing.',
  };

  const typeNotes: Record<string, string> = {
    essay: 'Personal/argumentative essay — original voice expected.',
    'research-paper': 'Research paper — some similarity to sources is expected for properly paraphrased content.',
    'short-answer': 'Short answer — brevity expected, may naturally overlap with common phrasings.',
    other: 'General assignment.',
  };

  return `
CALIBRATION CONTEXT:
- Student level: ${gradeDesc[context.gradeLevel || 10] || gradeDesc[10]}
- Subject: ${subjectNotes[context.subject || 'other']}
- Assignment type: ${typeNotes[context.assignmentType || 'other']}
Calibrate thresholds accordingly. Do not flag writing as AI-generated simply because it is well-written for the grade level.`;
}

// ---------------------------------------------------------------------------
// Copyscape result merging
// ---------------------------------------------------------------------------
interface SourceMatchResult {
  url?: string;
  title: string;
  matchPercent: number;
  verified?: boolean;
  snippetText?: string;
  wordsMatched?: number;
}

function mergeCopyscapeResults(
  copyscape: CopyscapeResult | null,
  claudeParsed: { plagiarism?: { sourceMatches?: SourceMatchResult[] } },
): SourceMatchResult[] {
  const matches: SourceMatchResult[] = [];

  // Add Copyscape verified matches first (these are real, confirmed sources)
  if (copyscape?.result?.length) {
    for (const m of copyscape.result) {
      matches.push({
        url: m.url,
        title: m.title || m.url,
        matchPercent: m.percentmatched,
        verified: true,
        snippetText: m.snippettext,
        wordsMatched: m.minwordsmatched,
      });
    }
  }

  // Add Claude's heuristic matches only if they don't duplicate Copyscape URLs
  const verifiedUrls = new Set(matches.map(m => m.url?.toLowerCase()).filter(Boolean));
  const claudeMatches = claudeParsed.plagiarism?.sourceMatches || [];
  for (const cm of claudeMatches) {
    if (cm.url && verifiedUrls.has(cm.url.toLowerCase())) continue;
    matches.push({
      ...cm,
      verified: false,
    });
  }

  // Sort: verified first, then by matchPercent descending
  matches.sort((a, b) => {
    if (a.verified !== b.verified) return a.verified ? -1 : 1;
    return b.matchPercent - a.matchPercent;
  });

  return matches;
}

/**
 * Create plagiarism annotations from Copyscape snippet matches.
 * Searches the submitted text for each snippet and returns char-level annotations.
 */
/**
 * Normalize whitespace: convert non-breaking spaces, narrow spaces, etc. to regular spaces,
 * then collapse multiple spaces into one and trim.
 */
function normalizeWhitespace(s: string): string {
  return s.replace(/[\u00a0\u2000-\u200b\u202f\u205f\u3000]/g, ' ').replace(/\s+/g, ' ').trim();
}

function createCopyscapeAnnotations(
  text: string,
  copyscapeResult: CopyscapeResult | null,
): { startIndex: number; endIndex: number; type: 'plagiarism'; reason: string; confidence: number; matchedText: string }[] {
  if (!copyscapeResult?.result?.length) return [];

  const annotations: { startIndex: number; endIndex: number; type: 'plagiarism'; reason: string; confidence: number; matchedText: string }[] = [];
  const textLower = text.toLowerCase();
  const usedRanges: { start: number; end: number }[] = [];

  for (const match of copyscapeResult.result) {
    if (!match.snippettext) continue;

    // Copyscape uses "..." to separate non-contiguous matched sections
    // and appends \u00a0 (non-breaking space) at phrase boundaries.
    // Split on ellipsis patterns, normalize whitespace, then search.
    const rawPhrases = match.snippettext.split(/\.{2,}/);

    for (const raw of rawPhrases) {
      const phrase = normalizeWhitespace(raw);
      if (phrase.length < 15) continue;

      // Search for the phrase in the submitted text using case-insensitive matching
      const phraseLower = phrase.toLowerCase();
      let searchFrom = 0;

      while (searchFrom < textLower.length) {
        const idx = textLower.indexOf(phraseLower, searchFrom);
        if (idx === -1) break;

        const endIdx = idx + phrase.length;

        const overlaps = usedRanges.some(
          r => (idx < r.end && endIdx > r.start)
        );

        if (!overlaps) {
          usedRanges.push({ start: idx, end: endIdx });
          annotations.push({
            startIndex: idx,
            endIndex: endIdx,
            type: 'plagiarism',
            reason: `Matched content found at: ${match.title || match.url}`,
            confidence: Math.min(95, Math.round(match.percentmatched + 50)),
            matchedText: text.slice(idx, endIdx),
          });
        }

        searchFrom = endIdx;
      }
    }
  }

  return annotations.sort((a, b) => a.startIndex - b.startIndex);
}

/**
 * Blend Claude's heuristic plagiarism score with Copyscape's measured percentage.
 * Copyscape is authoritative — if it finds real matches, that anchors the score.
 */
function computeBlendedPlagiarismScore(claudeScore: number, copyscapePercent: number): number {
  if (copyscapePercent <= 0) {
    // No Copyscape matches — trust Claude but cap lower since web search found nothing
    return Math.min(claudeScore, 40);
  }

  // Copyscape found matches — use the higher of the two, weighted toward Copyscape
  const blended = Math.round(copyscapePercent * 0.7 + claudeScore * 0.3);
  return Math.max(blended, copyscapePercent);
}

export async function POST(request: NextRequest) {
  const ip = getIP(request);

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
  }

  const daily = checkDailyLimit(ip, 'showcase-medium', 50);
  if (!daily.allowed) {
    return NextResponse.json({ error: 'Daily usage limit reached. Please try again tomorrow.' }, { status: 429 });
  }

  try {
    const { text, context } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required.' }, { status: 400 });
    }

    const wordCount = text.trim().split(/\s+/).length;
    if (wordCount < 50) {
      return NextResponse.json({ error: 'Please provide at least 50 words.' }, { status: 400 });
    }

    const calibration = getCalibrationPrompt(context);

    const systemPrompt = `You are an expert academic integrity analyst specializing in detecting BOTH AI-generated content AND plagiarism. These are SEPARATE concerns in school policy and must be analyzed independently.

Your analysis serves K-12 teachers who need defensible evidence for conversations with students and parents. Be precise, fair, and use language a non-technical educator can understand.

CRITICAL INSTRUCTIONS:
1. Analyze AI generation and plagiarism as TWO SEPARATE scores
2. For each flagged passage, provide the EXACT text as it appears in the submission — character-for-character
3. Provide character-level startIndex and endIndex for each flagged passage (0-indexed from the start of the submitted text)
4. Classify each flagged passage as exactly one of: "ai-generated", "suspicious", or "plagiarism"
5. Be fair — not all formal or well-written text is AI-generated. Not all common phrases are plagiarized.
6. NEVER mention specific AI tool or model names (ChatGPT, GPT, Claude, OpenAI, Gemini, etc.) in any field. Use generic terms like "AI-generated", "machine-generated", or "automated writing tool" instead.
${calibration}`;

    const userPrompt = `Analyze this student submission for BOTH AI-generated content AND plagiarism. These must be scored separately.

SUBMITTED TEXT:
"""
${text}
"""

Respond with ONLY this JSON (no other text):
{
  "aiDetection": {
    "score": <number 0-100, where 100 = certainly AI-generated>,
    "modelAttribution": <string or null, e.g. "Patterns consistent with AI-generated output" or null if not detectable. NEVER mention specific AI tool or model names like ChatGPT, GPT, Claude, OpenAI, etc.>,
    "indicators": [<string reasons why AI generation is suspected or not>]
  },
  "plagiarism": {
    "score": <number 0-100, where 100 = certainly plagiarized>,
    "sourceMatches": [
      {
        "title": <string — description of suspected source type>,
        "matchPercent": <number>,
        "url": <string or null>
      }
    ]
  },
  "overallScore": <number 0-100, where 100 = fully original>,
  "annotations": [
    {
      "startIndex": <number — character offset from start of text>,
      "endIndex": <number — character offset>,
      "type": <"ai-generated" | "suspicious" | "plagiarism">,
      "reason": <string — plain English explanation>,
      "confidence": <number 0-100>,
      "matchedText": <string — exact text from submission>
    }
  ],
  "concerns": [
    {
      "type": <string>,
      "severity": <"low" | "medium" | "high">,
      "description": <string>,
      "suggestion": <string>
    }
  ],
  "recommendations": [<string — actionable plain-English suggestions for the teacher>]
}

IMPORTANT:
- The annotations startIndex/endIndex MUST correspond to exact character positions in the submitted text above
- Each annotation's matchedText MUST be the exact substring from the submitted text
- Score AI detection and plagiarism INDEPENDENTLY — a text can be high on one and low on the other
- overallScore should reflect overall originality (100 = definitely original student work)`;

    // Run Claude AI analysis and Copyscape plagiarism check in parallel
    const [claudeResponse, copyscapeResult] = await Promise.all([
      anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 3000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
      checkCopyscape(text),
    ]);

    const textContent = claudeResponse.content.find(block => block.type === 'text');
    const responseText = textContent?.type === 'text' ? textContent.text : '';

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Analysis failed. Please try again.' }, { status: 500 });
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Merge Copyscape verified sources into plagiarism results
    const copyscapeMatches = mergeCopyscapeResults(copyscapeResult, parsed);

    // Recalculate plagiarism score: blend Claude's heuristic with Copyscape's real data
    const claudePlagScore = parsed.plagiarism?.score ?? 0;
    const copyscapePercent = copyscapeResult?.allpercentmatched ?? 0;
    const plagScore = computeBlendedPlagiarismScore(claudePlagScore, copyscapePercent);

    const aiScore = parsed.aiDetection?.score ?? 0;

    const aiVerdicts = [
      { max: 25, label: 'Very likely original work' },
      { max: 50, label: 'Mostly original — minor concerns noted' },
      { max: 75, label: 'Significant concerns — recommend review' },
      { max: 100, label: 'Strong indicators of AI generation — action recommended' },
    ];
    const plagVerdicts = [
      { max: 15, label: 'No significant matches found' },
      { max: 35, label: 'Minor similarities detected' },
      { max: 60, label: 'Notable similarities — review recommended' },
      { max: 100, label: 'High similarity to external sources — action recommended' },
    ];
    const overallVerdicts = [
      { max: 30, label: 'Significant Concerns' },
      { max: 60, label: 'Needs Review' },
      { max: 100, label: 'Original' },
    ];

    const getVerdict = (score: number, verdicts: { max: number; label: string }[]) =>
      (verdicts.find(v => score <= v.max) || verdicts[verdicts.length - 1]).label;

    const overallScore = parsed.overallScore != null
      ? Math.min(parsed.overallScore, 100 - plagScore)
      : 100 - Math.max(aiScore, plagScore);

    // Merge Claude's annotations with Copyscape-derived plagiarism annotations
    const claudeAnnotations = parsed.annotations || [];
    const copyscapeAnnotations = createCopyscapeAnnotations(text, copyscapeResult);

    // Remove Claude plagiarism annotations that overlap with Copyscape ones (Copyscape is authoritative)
    const filteredClaudeAnnotations = claudeAnnotations.filter((ann: { type: string; startIndex: number; endIndex: number }) => {
      if (ann.type !== 'plagiarism') return true;
      return !copyscapeAnnotations.some(
        ca => ann.startIndex < ca.endIndex && ann.endIndex > ca.startIndex
      );
    });

    const mergedAnnotations = [...filteredClaudeAnnotations, ...copyscapeAnnotations]
      .sort((a: { startIndex: number }, b: { startIndex: number }) => a.startIndex - b.startIndex);

    const result = {
      aiDetection: {
        ...parsed.aiDetection,
        verdict: getVerdict(aiScore, aiVerdicts),
      },
      plagiarism: {
        score: plagScore,
        sourceMatches: copyscapeMatches,
        copyscapePercent: copyscapePercent > 0 ? copyscapePercent : undefined,
        verdict: getVerdict(plagScore, plagVerdicts),
      },
      overallScore,
      overallVerdict: getVerdict(overallScore, overallVerdicts),
      annotations: mergedAnnotations,
      concerns: parsed.concerns || [],
      recommendations: parsed.recommendations || [],
    };

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Plagiarism analysis error:', error);
    const message = error instanceof Anthropic.APIError
      ? 'AI service temporarily unavailable. Please try again.'
      : 'Analysis failed. Please try again.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
