import Anthropic from '@anthropic-ai/sdk';
import { checkCopyscape, type CopyscapeResult } from '@core/utils/copyscape';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface AnalyzeContext {
  gradeLevel?: number;
  subject?: string;
  assignmentType?: string;
}

interface SourceMatchResult {
  url?: string;
  title: string;
  matchPercent: number;
  verified?: boolean;
  snippetText?: string;
  wordsMatched?: number;
}

export interface AnalyzeResult {
  aiDetection: {
    score: number;
    verdict: string;
    modelAttribution: string | null;
    indicators: string[];
  };
  plagiarism: {
    score: number;
    verdict: string;
    sourceMatches: SourceMatchResult[];
    copyscapePercent?: number;
  };
  overallScore: number;
  overallVerdict: string;
  annotations: Array<{
    startIndex: number;
    endIndex: number;
    type: 'ai-generated' | 'suspicious' | 'plagiarism';
    reason: string;
    confidence: number;
    matchedText: string;
  }>;
  concerns: Array<{ type: string; severity: 'low' | 'medium' | 'high'; description: string; suggestion: string }>;
  recommendations: string[];
  usage?: { inputTokens: number; outputTokens: number; model: string };
}

function getCalibrationPrompt(context?: AnalyzeContext): string {
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

function mergeCopyscapeResults(
  copyscape: CopyscapeResult | null,
  claudeParsed: { plagiarism?: { sourceMatches?: SourceMatchResult[] } }
): SourceMatchResult[] {
  const matches: SourceMatchResult[] = [];

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

  const verifiedUrls = new Set(matches.map(m => m.url?.toLowerCase()).filter(Boolean));
  const claudeMatches = claudeParsed.plagiarism?.sourceMatches || [];
  for (const cm of claudeMatches) {
    if (cm.url && verifiedUrls.has(cm.url.toLowerCase())) continue;
    matches.push({ ...cm, verified: false });
  }

  matches.sort((a, b) => {
    if (a.verified !== b.verified) return a.verified ? -1 : 1;
    return b.matchPercent - a.matchPercent;
  });

  return matches;
}

function normalizeWhitespace(s: string): string {
  return s.replace(/[  -​  　]/g, ' ').replace(/\s+/g, ' ').trim();
}

function createCopyscapeAnnotations(
  text: string,
  copyscapeResult: CopyscapeResult | null
): AnalyzeResult['annotations'] {
  if (!copyscapeResult?.result?.length) return [];

  const annotations: AnalyzeResult['annotations'] = [];
  const textLower = text.toLowerCase();
  const usedRanges: { start: number; end: number }[] = [];

  for (const match of copyscapeResult.result) {
    if (!match.snippettext) continue;
    const rawPhrases = match.snippettext.split(/\.{2,}/);

    for (const raw of rawPhrases) {
      const phrase = normalizeWhitespace(raw);
      if (phrase.length < 15) continue;

      const phraseLower = phrase.toLowerCase();
      let searchFrom = 0;

      while (searchFrom < textLower.length) {
        const idx = textLower.indexOf(phraseLower, searchFrom);
        if (idx === -1) break;

        const endIdx = idx + phrase.length;
        const overlaps = usedRanges.some(r => idx < r.end && endIdx > r.start);

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

function computeBlendedPlagiarismScore(claudeScore: number, copyscapePercent: number): number {
  if (copyscapePercent <= 0) {
    return Math.min(claudeScore, 40);
  }
  const blended = Math.round(copyscapePercent * 0.7 + claudeScore * 0.3);
  return Math.max(blended, copyscapePercent);
}

export async function analyzeText({
  text,
  context,
}: {
  text: string;
  context?: AnalyzeContext;
}): Promise<AnalyzeResult> {
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
7. The submitted text was extracted from a document file (PDF, .docx, or Google Doc). Surface formatting — line break placement, presence or absence of hyphenation artifacts, multi-space runs, indentation, smart quotes vs. straight quotes — reflects extraction tooling, not the writer's choices. Do NOT factor surface cleanliness into the AI-detection score; the same essay extracted via different tooling can look "messier" or "cleaner" without any difference in authorship. Judge AI-likelihood on substantive linguistic features only: vocabulary range, sentence rhythm, voice consistency, error patterns (typos and grammatical slips lower AI suspicion), argument structure, hedging language, and stock-phrase density.
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

  const [claudeResponse, copyscapeResult] = await Promise.all([
    anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 3000,
      // temperature: 0 makes Claude near-deterministic for identical input —
      // teachers re-running the same submission should see the same scores.
      temperature: 0,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
    checkCopyscape(text),
  ]);

  const textContent = claudeResponse.content.find(b => b.type === 'text');
  const responseText = textContent?.type === 'text' ? textContent.text : '';
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Analysis response could not be parsed.');

  const parsed = JSON.parse(jsonMatch[0]);

  const copyscapeMatches = mergeCopyscapeResults(copyscapeResult, parsed);
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
    { max: 10, label: 'No significant matches found' },
    { max: 25, label: 'Minor similarities detected' },
    { max: 45, label: 'Notable similarities — review recommended' },
    { max: 100, label: 'High similarity to external sources — action recommended' },
  ];
  const overallVerdicts = [
    { max: 40, label: 'Significant Concerns' },
    { max: 75, label: 'Needs Review' },
    { max: 100, label: 'Original' },
  ];
  const getVerdict = (score: number, vs: { max: number; label: string }[]) =>
    (vs.find(v => score <= v.max) || vs[vs.length - 1]).label;

  // Headline originality is computed deterministically from the two signals
  // teachers see (AI + plagiarism), NOT from Claude's self-assessed overallScore.
  // Claude's self-assessment was the single biggest source of run-to-run variance
  // (same essay scoring 38% / 58% / 67% across PDF / Doc / Word) because no
  // constraint kept it consistent with the visible AI and plag numbers.
  // Formula: originality = 100 minus whichever signal is stronger.
  const overallScore = Math.max(0, 100 - Math.max(plagScore, aiScore));

  // Concern-aware verdict floor: the numeric threshold alone misses cases like
  // a verified Copyscape hit + a "Sample 1A" leak label, where the score lands
  // in the "Original" band but the structured evidence is damning. Force the
  // headline to reflect the actual evidence.
  const concerns = parsed.concerns || [];
  const highConcerns = concerns.filter((c: { severity?: string }) => c.severity === 'high').length;
  const copyscapeVerified = copyscapePercent > 0;
  const baseOverallVerdict = getVerdict(overallScore, overallVerdicts);

  let finalOverallVerdict = baseOverallVerdict;
  // Hard floor: significant concerns
  if (
    highConcerns >= 2 ||
    plagScore >= 50 ||
    aiScore >= 80 ||
    (copyscapeVerified && plagScore >= 30)
  ) {
    finalOverallVerdict = 'Significant Concerns';
  } else if (
    finalOverallVerdict === 'Original' &&
    (highConcerns >= 1 ||
      plagScore >= 20 ||
      aiScore >= 50 ||
      (copyscapeVerified && plagScore >= 15))
  ) {
    // Soft floor: bump out of "Original" only
    finalOverallVerdict = 'Needs Review';
  }

  const claudeAnnotations = parsed.annotations || [];
  const copyscapeAnnotations = createCopyscapeAnnotations(text, copyscapeResult);

  const filteredClaudeAnnotations = claudeAnnotations.filter(
    (ann: { type: string; startIndex: number; endIndex: number }) => {
      if (ann.type !== 'plagiarism') return true;
      return !copyscapeAnnotations.some(ca => ann.startIndex < ca.endIndex && ann.endIndex > ca.startIndex);
    }
  );

  const mergedAnnotations = [...filteredClaudeAnnotations, ...copyscapeAnnotations].sort(
    (a: { startIndex: number }, b: { startIndex: number }) => a.startIndex - b.startIndex
  );

  return {
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
    overallVerdict: finalOverallVerdict,
    annotations: mergedAnnotations,
    concerns,
    recommendations: parsed.recommendations || [],
    usage: {
      inputTokens: claudeResponse.usage.input_tokens,
      outputTokens: claudeResponse.usage.output_tokens,
      model: 'claude-sonnet-4-6',
    },
  };
}
