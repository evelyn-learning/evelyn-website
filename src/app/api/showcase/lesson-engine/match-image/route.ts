import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { connectDB } from '@/lib/db';
import { LessonImage } from '@/models/LessonImage';
import { checkDailyLimit } from '@/lib/utils/rate-limit';

// ============================================================================
// CONFIGURATION
// ============================================================================
const CONFIG = {
  EMBEDDING_MODEL: 'text-embedding-3-small' as const,
  SIMILARITY_THRESHOLD: 0.72,
  MIN_TAG_MATCHES: 2,
  RATE_LIMIT_REQUESTS: 30,
  RATE_LIMIT_WINDOW_MS: 60 * 1000,
  // DALL-E fallback config
  DALLE_MODEL: 'dall-e-3' as const,
  DALLE_SIZE: '1024x1024' as const,
  DALLE_QUALITY: 'standard' as const,
};

// ============================================================================
// RATE LIMITING
// ============================================================================
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

function checkRateLimit(key: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (rateLimitStore.size > 10000) {
    for (const [k, v] of rateLimitStore.entries()) {
      if (v.resetTime < now) rateLimitStore.delete(k);
    }
  }

  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(key, { count: 1, resetTime: now + CONFIG.RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: CONFIG.RATE_LIMIT_REQUESTS - 1, resetIn: CONFIG.RATE_LIMIT_WINDOW_MS };
  }

  if (entry.count >= CONFIG.RATE_LIMIT_REQUESTS) {
    return { allowed: false, remaining: 0, resetIn: entry.resetTime - now };
  }

  entry.count++;
  return { allowed: true, remaining: CONFIG.RATE_LIMIT_REQUESTS - entry.count, resetIn: entry.resetTime - now };
}

// ============================================================================
// OPENAI CLIENT (for embeddings + DALL-E fallback)
// ============================================================================
const openai = new OpenAI({
  apiKey: process.env.OPENAI_SHOWCASE_API_KEY || process.env.OPENAI_API_KEY,
});

// ============================================================================
// COSINE SIMILARITY
// ============================================================================
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

// ============================================================================
// STAGE 1: TAG-BASED MATCHING
// ============================================================================
async function findByTags(
  tags: string[],
  subject: string,
  grade: string,
  excludeFilenames: string[] = []
): Promise<{ url: string; filename: string; score: number; method: 'tag' } | null> {
  if (!tags || tags.length === 0) return null;

  // Find images that share at least MIN_TAG_MATCHES tags
  const query: Record<string, unknown> = {
    tags: { $in: tags },
    $or: [
      { subject },
      { subject: 'general' },
    ],
  };
  if (excludeFilenames.length > 0) {
    query.filename = { $nin: excludeFilenames };
  }
  const candidates = await LessonImage.find(query).lean();

  if (candidates.length === 0) return null;

  // Score by: number of matching tags + grade appropriateness bonus + subject-match bonus
  type ScoredCandidate = {
    url: string;
    filename: string;
    score: number;
  };

  const scored: ScoredCandidate[] = candidates.map((img) => {
    const imgTags = (img.tags || []) as string[];
    const matchingTags = tags.filter(t => imgTags.includes(t)).length;
    const gradeMatch = ((img.gradeRange || []) as string[]).includes(grade) ? 0.5 : 0;
    const subjectBonus = (img.subject as string) === subject ? 1.0 : 0;
    return {
      url: img.url as string,
      filename: img.filename as string,
      score: matchingTags + gradeMatch + subjectBonus,
    };
  });

  scored.sort((a, b) => b.score - a.score);

  const best = scored[0];
  if (best && best.score >= CONFIG.MIN_TAG_MATCHES) {
    return { url: best.url, filename: best.filename, score: best.score, method: 'tag' as const };
  }

  return null;
}

// ============================================================================
// STAGE 2: EMBEDDING-BASED SEMANTIC SEARCH
// ============================================================================
async function findBySemantic(
  description: string,
  subject: string,
  grade: string,
  excludeFilenames: string[] = []
): Promise<{ url: string; filename: string; score: number; method: 'semantic' } | null> {
  if (!description) return null;

  const apiKey = process.env.OPENAI_SHOWCASE_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  // Get embedding for the query description
  let queryEmbedding: number[];
  try {
    const embeddingResponse = await openai.embeddings.create({
      model: CONFIG.EMBEDDING_MODEL,
      input: description,
    });
    queryEmbedding = embeddingResponse.data[0].embedding;
  } catch (err) {
    console.error('[MATCH_IMAGE] Embedding generation failed:', err);
    return null;
  }

  // Get all images with embeddings (for this subject or general)
  const query: Record<string, unknown> = {
    embedding: { $exists: true, $ne: [] },
    $or: [
      { subject },
      { subject: 'general' },
    ],
  };
  if (excludeFilenames.length > 0) {
    query.filename = { $nin: excludeFilenames };
  }
  const candidates = await LessonImage.find(query).lean();

  if (candidates.length === 0) return null;

  // Calculate cosine similarity
  type ScoredCandidate = {
    url: string;
    filename: string;
    similarity: number;
  };

  const scored: ScoredCandidate[] = candidates
    .filter((img) => Array.isArray(img.embedding) && (img.embedding as number[]).length > 0)
    .map((img) => ({
      url: img.url as string,
      filename: img.filename as string,
      similarity: cosineSimilarity(queryEmbedding, img.embedding as number[]),
    }));

  scored.sort((a, b) => b.similarity - a.similarity);

  const best = scored[0];
  if (best && best.similarity >= CONFIG.SIMILARITY_THRESHOLD) {
    // Grade appropriateness bonus check
    const bestImg = candidates.find(c => (c as unknown as { filename: string }).filename === best.filename);
    const gradeOk = bestImg && Array.isArray(bestImg.gradeRange) && (bestImg.gradeRange as string[]).includes(grade);

    return {
      url: best.url,
      filename: best.filename,
      score: best.similarity + (gradeOk ? 0.05 : 0),
      method: 'semantic' as const,
    };
  }

  return null;
}

// ============================================================================
// STAGE 3: DALL-E FALLBACK
// ============================================================================
async function generateWithDallE(
  visual: string,
  gradeLevel: string
): Promise<{ url: string; filename: string; score: number; method: 'dalle' } | null> {
  const apiKey = process.env.OPENAI_SHOWCASE_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey || !visual) return null;

  try {
    // Clean the prompt — remove quantities, fractions, named characters
    const cleanedPrompt = visual
      .replace(/\d+\/\d+/g, '')
      .replace(/\d+\s*(slices?|pieces?|parts?|eaten|left|out of)/gi, '')
      .replace(/\s{2,}/g, ' ')
      .trim();

    const enhancedPrompt = `I NEED to test how the tool works with extremely simple prompts. DO NOT include ANY text, writing, letters, numbers, labels, captions, signs, or mathematical notation anywhere in the image. Educational illustration for ${gradeLevel || 'elementary school'}: ${cleanedPrompt}. Style: colorful, clean, professional educational illustration style similar to a textbook or classroom poster, age-appropriate for young children. The image should be visually informative and depict the scene described. Remember: ZERO text, writing, or numbers anywhere in the image.`;

    const response = await openai.images.generate({
      model: CONFIG.DALLE_MODEL,
      prompt: enhancedPrompt,
      n: 1,
      size: CONFIG.DALLE_SIZE,
      quality: CONFIG.DALLE_QUALITY,
      response_format: 'url',
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) return null;

    return { url: imageUrl, filename: 'dalle-generated', score: 0, method: 'dalle' as const };
  } catch (error: unknown) {
    console.error('[MATCH_IMAGE] DALL-E fallback failed:', error);

    // Content policy violation — return null gracefully
    if (error instanceof OpenAI.APIError && error.status === 400) {
      return null;
    }

    return null;
  }
}

// ============================================================================
// API ROUTE HANDLER
// ============================================================================
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
    const rateLimitKey = `lesson_engine_match_image:${ip}`;
    const rateLimit = checkRateLimit(rateLimitKey);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait.' },
        { status: 429 }
      );
    }

    const daily = checkDailyLimit(ip, 'showcase-media', 20);
    if (!daily.allowed) {
      return NextResponse.json(
        { error: 'Daily usage limit reached. Please try again tomorrow.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((daily.resetsAt - Date.now()) / 1000)) } }
      );
    }

    const body = await request.json();
    const { imageTags, visual, subject, gradeLevel, enableDalleFallback, excludeFilenames } = body as {
      imageTags?: string[];
      visual?: string;
      subject?: string;
      gradeLevel?: string;
      enableDalleFallback?: boolean;
      excludeFilenames?: string[];
    };

    if ((!imageTags || imageTags.length === 0) && !visual) {
      return NextResponse.json({ error: 'imageTags or visual description required' }, { status: 400 });
    }

    await connectDB();

    // Stage 1: Tag-based matching
    const tagResult = await findByTags(
      imageTags || [],
      subject || 'general',
      gradeLevel || '3',
      excludeFilenames || []
    );

    if (tagResult) {
      console.log(`[MATCH_IMAGE] Tag match: "${tagResult.filename}" score=${tagResult.score}`);
      return NextResponse.json({
        success: true,
        url: tagResult.url,
        filename: tagResult.filename,
        method: 'tag',
        score: tagResult.score,
      });
    }

    // Stage 2: Semantic search (if we have a visual description)
    if (visual) {
      const semanticResult = await findBySemantic(
        visual,
        subject || 'general',
        gradeLevel || '3',
        excludeFilenames || []
      );

      if (semanticResult) {
        console.log(`[MATCH_IMAGE] Semantic match: "${semanticResult.filename}" score=${semanticResult.score.toFixed(3)}`);
        return NextResponse.json({
          success: true,
          url: semanticResult.url,
          filename: semanticResult.filename,
          method: 'semantic',
          score: semanticResult.score,
        });
      }
    }

    // Stage 3: DALL-E fallback (only if explicitly enabled)
    if (enableDalleFallback && visual) {
      const dalleResult = await generateWithDallE(visual, gradeLevel || 'elementary school');

      if (dalleResult) {
        console.log(`[MATCH_IMAGE] DALL-E fallback generated for: "${visual.slice(0, 60)}..."`);
        return NextResponse.json({
          success: true,
          url: dalleResult.url,
          filename: dalleResult.filename,
          method: 'dalle',
          score: 0,
        });
      }
    }

    // No match found anywhere
    console.log(`[MATCH_IMAGE] No match found for tags=${JSON.stringify(imageTags?.slice(0, 5))} visual="${(visual || '').slice(0, 60)}"`);
    return NextResponse.json({
      success: false,
      url: null,
      method: 'none',
      message: 'No matching image found',
    });
  } catch (error: unknown) {
    console.error('[MATCH_IMAGE] Error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Image matching failed', details: msg }, { status: 500 });
  }
}
