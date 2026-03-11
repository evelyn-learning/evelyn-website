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

function getIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',')[0].trim() : 'unknown';
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const key = `plag-cmp:${ip}`;
  const entry = rateLimitStore.get(key);
  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(key, { count: 1, resetTime: now + 60_000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  const ip = getIP(request);

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
  }

  const daily = checkDailyLimit(ip, 'showcase-medium', 50);
  if (!daily.allowed) {
    return NextResponse.json({ error: 'Daily limit reached.' }, { status: 429 });
  }

  try {
    const { originalText, revisedText, context } = await request.json();

    if (!originalText || !revisedText) {
      return NextResponse.json({ error: 'Both original and revised text are required.' }, { status: 400 });
    }

    const gradeNote = context?.gradeLevel
      ? `The student is in grade ${context.gradeLevel}.`
      : '';

    const systemPrompt = `You are an academic integrity analyst helping teachers evaluate student resubmissions. A student submitted work that was flagged, then submitted a revision. You must analyze what changed and whether the revision addresses the concerns.

${gradeNote}

Be fair and constructive. The goal is to help the student learn, not to punish.`;

    const userPrompt = `Compare these two versions of a student submission.

ORIGINAL SUBMISSION:
"""
${originalText}
"""

REVISED SUBMISSION:
"""
${revisedText}
"""

Analyze both versions independently for AI generation and plagiarism, then compare them. Respond with ONLY this JSON:
{
  "originalAnalysis": {
    "aiDetection": {
      "score": <0-100>,
      "modelAttribution": <string or null>,
      "indicators": [<strings>]
    },
    "plagiarism": {
      "score": <0-100>,
      "sourceMatches": []
    },
    "overallScore": <0-100>,
    "annotations": [
      {
        "startIndex": <number>,
        "endIndex": <number>,
        "type": <"ai-generated" | "suspicious" | "plagiarism">,
        "reason": <string>,
        "confidence": <0-100>,
        "matchedText": <exact text>
      }
    ],
    "concerns": [{"type": <string>, "severity": <"low"|"medium"|"high">, "description": <string>, "suggestion": <string>}],
    "recommendations": [<strings>]
  },
  "revisedAnalysis": {
    <same structure as originalAnalysis, but for the revised text>
  },
  "changes": {
    "addedText": [<significant new passages added>],
    "removedText": [<significant passages removed>],
    "flaggedSectionsRemoved": <number of previously-flagged sections that were removed>,
    "flaggedSectionsRewritten": <number of previously-flagged sections that were meaningfully rewritten>,
    "rewriteAppearsAIGenerated": <boolean — does the rewrite itself look AI-generated?>,
    "summary": <string — 2-3 sentence plain-English summary of what changed and whether the revision addresses concerns>
  }
}`;

    // Run Claude analysis and Copyscape checks in parallel
    const [response, originalCopyscape, revisedCopyscape] = await Promise.all([
      anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
      checkCopyscape(originalText),
      checkCopyscape(revisedText),
    ]);

    const textContent = response.content.find(block => block.type === 'text');
    const responseText = textContent?.type === 'text' ? textContent.text : '';

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Comparison failed. Please try again.' }, { status: 500 });
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Add verdicts and merge Copyscape results
    const addVerdicts = (
      analysis: { aiDetection?: { score?: number }; plagiarism?: { score?: number; sourceMatches?: { url?: string; title: string; matchPercent: number }[] }; overallScore?: number },
      copyscape: CopyscapeResult | null,
    ) => {
      const aiScore = analysis.aiDetection?.score ?? 0;
      const claudePlagScore = analysis.plagiarism?.score ?? 0;
      const copyscapePercent = copyscape?.allpercentmatched ?? 0;

      // Merge Copyscape verified sources
      const verifiedMatches = (copyscape?.result || []).map(m => ({
        url: m.url,
        title: m.title || m.url,
        matchPercent: m.percentmatched,
        verified: true,
        snippetText: m.snippettext,
        wordsMatched: m.minwordsmatched,
      }));
      const verifiedUrls = new Set(verifiedMatches.map(m => m.url?.toLowerCase()).filter(Boolean));
      const claudeMatches = (analysis.plagiarism?.sourceMatches || [])
        .filter(cm => !cm.url || !verifiedUrls.has(cm.url.toLowerCase()))
        .map(cm => ({ ...cm, verified: false }));
      const sourceMatches = [...verifiedMatches, ...claudeMatches]
        .sort((a, b) => {
          if (a.verified !== b.verified) return a.verified ? -1 : 1;
          return b.matchPercent - a.matchPercent;
        });

      // Blend plagiarism score
      let plagScore: number;
      if (copyscapePercent <= 0) {
        plagScore = Math.min(claudePlagScore, 40);
      } else {
        const blended = Math.round(copyscapePercent * 0.7 + claudePlagScore * 0.3);
        plagScore = Math.max(blended, copyscapePercent);
      }

      const overall = Math.min(
        analysis.overallScore ?? (100 - Math.max(aiScore, plagScore)),
        100 - plagScore,
      );

      return {
        ...analysis,
        aiDetection: {
          ...analysis.aiDetection,
          verdict: aiScore <= 25 ? 'Very likely original work'
            : aiScore <= 50 ? 'Mostly original — minor concerns noted'
            : aiScore <= 75 ? 'Significant concerns — recommend review'
            : 'Strong indicators of AI generation — action recommended',
        },
        plagiarism: {
          score: plagScore,
          sourceMatches,
          copyscapePercent: copyscapePercent > 0 ? copyscapePercent : undefined,
          verdict: plagScore <= 15 ? 'No significant matches found'
            : plagScore <= 35 ? 'Minor similarities detected'
            : plagScore <= 60 ? 'Notable similarities — review recommended'
            : 'High similarity to external sources — action recommended',
        },
        overallScore: overall,
        overallVerdict: overall >= 60 ? 'Original'
          : overall >= 30 ? 'Needs Review'
          : 'Significant Concerns',
      };
    };

    const result = {
      originalAnalysis: addVerdicts(parsed.originalAnalysis || {}, originalCopyscape),
      revisedAnalysis: addVerdicts(parsed.revisedAnalysis || {}, revisedCopyscape),
      changes: parsed.changes || {
        addedText: [],
        removedText: [],
        flaggedSectionsRemoved: 0,
        flaggedSectionsRewritten: 0,
        rewriteAppearsAIGenerated: false,
        summary: 'Unable to determine changes.',
      },
    };

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Comparison error:', error);
    return NextResponse.json({ error: 'Comparison failed. Please try again.' }, { status: 500 });
  }
}
