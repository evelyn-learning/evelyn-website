import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import taxonomy from '@/data/image-taxonomy.json';
import { checkDailyLimit } from '@/lib/utils/rate-limit';

// ============================================================================
// CONFIGURATION
// ============================================================================
const CONFIG = {
  MODEL: 'claude-sonnet-4-6',
  MAX_TOKENS: 8000,
  RATE_LIMIT_REQUESTS: 10,
  RATE_LIMIT_WINDOW_MS: 60 * 1000,
};

// ============================================================================
// RATE LIMITING
// ============================================================================
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

function checkRateLimit(key: string, maxRequests: number, windowMs: number): {
  allowed: boolean;
  remaining: number;
  resetIn: number;
} {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (rateLimitStore.size > 10000) {
    for (const [k, v] of rateLimitStore.entries()) {
      if (v.resetTime < now) rateLimitStore.delete(k);
    }
  }

  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetIn: entry.resetTime - now };
  }

  entry.count++;
  return { allowed: true, remaining: maxRequests - entry.count, resetIn: entry.resetTime - now };
}

// ============================================================================
// CCSS STANDARDS BY GRADE AND SUBJECT
// ============================================================================
function getCCSSStandards(grade: string, subject: string): string {
  const gradeNum = grade.replace(/\D/g, '');

  const mathStandards: Record<string, string> = {
    'K': `CCSS.MATH.CONTENT.K.CC - Counting and Cardinality (K.CC.A.1-3, K.CC.B.4-5, K.CC.C.6-7)
CCSS.MATH.CONTENT.K.OA - Operations & Algebraic Thinking (K.OA.A.1-5)
CCSS.MATH.CONTENT.K.NBT - Number & Operations in Base Ten (K.NBT.A.1)
CCSS.MATH.CONTENT.K.MD - Measurement & Data (K.MD.A.1-2, K.MD.B.3)
CCSS.MATH.CONTENT.K.G - Geometry (K.G.A.1-3, K.G.B.4-6)`,
    '1': `CCSS.MATH.CONTENT.1.OA - Operations & Algebraic Thinking (1.OA.A.1-2, 1.OA.B.3-4, 1.OA.C.5-6, 1.OA.D.7-8)
CCSS.MATH.CONTENT.1.NBT - Number & Operations in Base Ten (1.NBT.A.1, 1.NBT.B.2-3, 1.NBT.C.4-6)
CCSS.MATH.CONTENT.1.MD - Measurement & Data (1.MD.A.1-2, 1.MD.B.3, 1.MD.C.4)
CCSS.MATH.CONTENT.1.G - Geometry (1.G.A.1-3)`,
    '2': `CCSS.MATH.CONTENT.2.OA - Operations & Algebraic Thinking (2.OA.A.1, 2.OA.B.2, 2.OA.C.3-4)
CCSS.MATH.CONTENT.2.NBT - Number & Operations in Base Ten (2.NBT.A.1-4, 2.NBT.B.5-9)
CCSS.MATH.CONTENT.2.MD - Measurement & Data (2.MD.A.1-4, 2.MD.B.5-6, 2.MD.C.7-8, 2.MD.D.9-10)
CCSS.MATH.CONTENT.2.G - Geometry (2.G.A.1-3)`,
    '3': `CCSS.MATH.CONTENT.3.OA - Operations & Algebraic Thinking (3.OA.A.1-4, 3.OA.B.5-6, 3.OA.C.7, 3.OA.D.8-9)
CCSS.MATH.CONTENT.3.NBT - Number & Operations in Base Ten (3.NBT.A.1-3)
CCSS.MATH.CONTENT.3.NF - Number & Operations—Fractions (3.NF.A.1-3)
CCSS.MATH.CONTENT.3.MD - Measurement & Data (3.MD.A.1-2, 3.MD.B.3-4, 3.MD.C.5-7)
CCSS.MATH.CONTENT.3.G - Geometry (3.G.A.1-2)`,
    '4': `CCSS.MATH.CONTENT.4.OA - Operations & Algebraic Thinking (4.OA.A.1-3, 4.OA.B.4, 4.OA.C.5)
CCSS.MATH.CONTENT.4.NBT - Number & Operations in Base Ten (4.NBT.A.1-3, 4.NBT.B.4-6)
CCSS.MATH.CONTENT.4.NF - Number & Operations—Fractions (4.NF.A.1-2, 4.NF.B.3-4, 4.NF.C.5-7)
CCSS.MATH.CONTENT.4.MD - Measurement & Data (4.MD.A.1-3, 4.MD.B.4, 4.MD.C.5-7)
CCSS.MATH.CONTENT.4.G - Geometry (4.G.A.1-3)`,
    '5': `CCSS.MATH.CONTENT.5.OA - Operations & Algebraic Thinking (5.OA.A.1-2, 5.OA.B.3)
CCSS.MATH.CONTENT.5.NBT - Number & Operations in Base Ten (5.NBT.A.1-4, 5.NBT.B.5-7)
CCSS.MATH.CONTENT.5.NF - Number & Operations—Fractions (5.NF.A.1-2, 5.NF.B.3-7)
CCSS.MATH.CONTENT.5.MD - Measurement & Data (5.MD.A.1, 5.MD.B.2, 5.MD.C.3-5)
CCSS.MATH.CONTENT.5.G - Geometry (5.G.A.1-2, 5.G.B.3-4)`,
  };

  const elaStandards: Record<string, string> = {
    'K': `CCSS.ELA-LITERACY.RF.K - Reading: Foundational Skills (RF.K.1-4)
CCSS.ELA-LITERACY.RL.K - Reading: Literature (RL.K.1-10)
CCSS.ELA-LITERACY.RI.K - Reading: Informational Text (RI.K.1-10)
CCSS.ELA-LITERACY.W.K - Writing (W.K.1-8)
CCSS.ELA-LITERACY.SL.K - Speaking & Listening (SL.K.1-6)
CCSS.ELA-LITERACY.L.K - Language (L.K.1-6)`,
    '1': `CCSS.ELA-LITERACY.RF.1 - Reading: Foundational Skills (RF.1.1-4)
CCSS.ELA-LITERACY.RL.1 - Reading: Literature (RL.1.1-10)
CCSS.ELA-LITERACY.RI.1 - Reading: Informational Text (RI.1.1-10)
CCSS.ELA-LITERACY.W.1 - Writing (W.1.1-8)
CCSS.ELA-LITERACY.SL.1 - Speaking & Listening (SL.1.1-6)
CCSS.ELA-LITERACY.L.1 - Language (L.1.1-6)`,
    '2': `CCSS.ELA-LITERACY.RF.2 - Reading: Foundational Skills (RF.2.1-4)
CCSS.ELA-LITERACY.RL.2 - Reading: Literature (RL.2.1-10)
CCSS.ELA-LITERACY.RI.2 - Reading: Informational Text (RI.2.1-10)
CCSS.ELA-LITERACY.W.2 - Writing (W.2.1-8)
CCSS.ELA-LITERACY.SL.2 - Speaking & Listening (SL.2.1-6)
CCSS.ELA-LITERACY.L.2 - Language (L.2.1-6)`,
    '3': `CCSS.ELA-LITERACY.RF.3 - Reading: Foundational Skills (RF.3.1-4)
CCSS.ELA-LITERACY.RL.3 - Reading: Literature (RL.3.1-10)
CCSS.ELA-LITERACY.RI.3 - Reading: Informational Text (RI.3.1-10)
CCSS.ELA-LITERACY.W.3 - Writing (W.3.1-10)
CCSS.ELA-LITERACY.SL.3 - Speaking & Listening (SL.3.1-6)
CCSS.ELA-LITERACY.L.3 - Language (L.3.1-6)`,
    '4': `CCSS.ELA-LITERACY.RF.4 - Reading: Foundational Skills (RF.4.1-4)
CCSS.ELA-LITERACY.RL.4 - Reading: Literature (RL.4.1-10)
CCSS.ELA-LITERACY.RI.4 - Reading: Informational Text (RI.4.1-10)
CCSS.ELA-LITERACY.W.4 - Writing (W.4.1-10)
CCSS.ELA-LITERACY.SL.4 - Speaking & Listening (SL.4.1-6)
CCSS.ELA-LITERACY.L.4 - Language (L.4.1-6)`,
    '5': `CCSS.ELA-LITERACY.RF.5 - Reading: Foundational Skills (RF.5.1-4)
CCSS.ELA-LITERACY.RL.5 - Reading: Literature (RL.5.1-10)
CCSS.ELA-LITERACY.RI.5 - Reading: Informational Text (RI.5.1-10)
CCSS.ELA-LITERACY.W.5 - Writing (W.5.1-10)
CCSS.ELA-LITERACY.SL.5 - Speaking & Listening (SL.5.1-6)
CCSS.ELA-LITERACY.L.5 - Language (L.5.1-6)`,
  };

  const scienceStandards: Record<string, string> = {
    'K': `K-PS2 - Motion and Stability: Forces and Interactions
K-PS3 - Energy
K-LS1 - From Molecules to Organisms: Structures and Processes
K-ESS2 - Earth's Systems
K-ESS3 - Earth and Human Activity
K-ETS1 - Engineering Design`,
    '1': `1-PS4 - Waves and their Applications
1-LS1 - From Molecules to Organisms: Structures and Processes
1-LS3 - Heredity: Inheritance and Variation of Traits
1-ESS1 - Earth's Place in the Universe
1-ETS1 - Engineering Design`,
    '2': `2-PS1 - Matter and its Interactions
2-LS2 - Ecosystems: Interactions, Energy, and Dynamics
2-LS4 - Biological Evolution: Unity and Diversity
2-ESS1 - Earth's Place in the Universe
2-ESS2 - Earth's Systems
2-ETS1 - Engineering Design`,
    '3': `3-PS2 - Motion and Stability: Forces and Interactions
3-LS1 - From Molecules to Organisms: Structures and Processes
3-LS2 - Ecosystems: Interactions, Energy, and Dynamics
3-LS3 - Heredity: Inheritance and Variation of Traits
3-LS4 - Biological Evolution: Unity and Diversity
3-ESS2 - Earth's Systems
3-ESS3 - Earth and Human Activity
3-ETS1 - Engineering Design`,
    '4': `4-PS3 - Energy
4-PS4 - Waves and their Applications
4-LS1 - From Molecules to Organisms: Structures and Processes
4-ESS1 - Earth's Place in the Universe
4-ESS2 - Earth's Systems
4-ESS3 - Earth and Human Activity
4-ETS1 - Engineering Design`,
    '5': `5-PS1 - Matter and its Interactions
5-PS2 - Motion and Stability: Forces and Interactions
5-PS3 - Energy
5-LS1 - From Molecules to Organisms: Structures and Processes
5-LS2 - Ecosystems: Interactions, Energy, and Dynamics
5-ESS1 - Earth's Place in the Universe
5-ESS2 - Earth's Systems
5-ESS3 - Earth and Human Activity
5-ETS1 - Engineering Design`,
  };

  const g = gradeNum || 'K';
  let standards = '';

  if (subject === 'math') {
    standards = mathStandards[g] || mathStandards['3'];
  } else if (subject === 'ela') {
    standards = elaStandards[g] || elaStandards['3'];
  } else if (subject === 'science') {
    standards = scienceStandards[g] || scienceStandards['3'];
  } else {
    // Include both math and ELA for general topics
    standards = `MATH STANDARDS:\n${mathStandards[g] || mathStandards['3']}\n\nELA STANDARDS:\n${elaStandards[g] || elaStandards['3']}`;
  }

  return standards;
}

// ============================================================================
// DETECT SUBJECT FROM PROMPT
// ============================================================================
function detectSubject(prompt: string): string {
  const lower = prompt.toLowerCase();
  const mathKeywords = ['math', 'fraction', 'add', 'subtract', 'multiply', 'divide', 'number', 'count', 'geometry', 'shape', 'measure', 'graph', 'equation', 'place value', 'decimal', 'percent'];
  const scienceKeywords = ['science', 'water cycle', 'plant', 'animal', 'habitat', 'ecosystem', 'weather', 'force', 'energy', 'matter', 'earth', 'space', 'planet', 'magnet', 'sound', 'light', 'life cycle'];
  const elaKeywords = ['reading', 'writing', 'story', 'poem', 'vocabulary', 'grammar', 'spelling', 'comprehension', 'literature', 'author', 'character', 'narrative', 'essay', 'phonics', 'letter'];

  const mathScore = mathKeywords.filter(k => lower.includes(k)).length;
  const scienceScore = scienceKeywords.filter(k => lower.includes(k)).length;
  const elaScore = elaKeywords.filter(k => lower.includes(k)).length;

  if (mathScore >= scienceScore && mathScore >= elaScore && mathScore > 0) return 'math';
  if (scienceScore >= mathScore && scienceScore >= elaScore && scienceScore > 0) return 'science';
  if (elaScore > 0) return 'ela';
  return 'general';
}

// ============================================================================
// LANGUAGE CONFIG
// ============================================================================
const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  es: 'Spanish',
  vi: 'Vietnamese',
};

// ============================================================================
// ANTHROPIC CLIENT
// ============================================================================
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ============================================================================
// API ROUTE HANDLER
// ============================================================================
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
    const rateLimitKey = `lesson_engine_generate:${ip}`;
    const rateLimit = checkRateLimit(rateLimitKey, CONFIG.RATE_LIMIT_REQUESTS, CONFIG.RATE_LIMIT_WINDOW_MS);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment and try again.' },
        { status: 429, headers: { 'Retry-After': Math.ceil(rateLimit.resetIn / 1000).toString() } }
      );
    }

    const daily = checkDailyLimit(ip, 'showcase-heavy', 30);
    if (!daily.allowed) {
      return NextResponse.json(
        { error: 'Daily usage limit reached. Please try again tomorrow.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((daily.resetsAt - Date.now()) / 1000)) } }
      );
    }

    // Parse request
    const body = await request.json();
    const { prompt, grade, duration, language, curriculumContext } = body as {
      prompt: string;
      grade: string;
      duration: number;
      language: 'en' | 'es' | 'vi';
      curriculumContext?: string;
    };

    if (!prompt || !grade) {
      return NextResponse.json({ error: 'Prompt and grade are required' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 500 });
    }

    // Detect subject and get standards
    const subject = detectSubject(prompt);
    const standards = getCCSSStandards(grade, subject);
    const languageName = LANGUAGE_NAMES[language] || 'English';
    const durationMinutes = duration || 10;

    // Calculate slide count based on duration
    const slideCount = durationMinutes === 5 ? '6-7' : durationMinutes === 15 ? '10-12' : '8-10';

    // Build system prompt
    let systemPrompt = `You are an expert K-5 teacher creating an interactive classroom lesson. Generate a complete, structured lesson that a teacher can project on a screen and present to their class.

GRADE LEVEL: ${grade}
SUBJECT: ${subject}
DURATION: ${durationMinutes} minutes
LANGUAGE: ${languageName}

RELEVANT STANDARDS FOR THIS GRADE:
${standards}

INSTRUCTIONS:
1. Generate ${slideCount} slides that form a complete, engaging lesson
2. Each slide must have a narration field — write this as natural spoken text, as if you are speaking directly to the classroom. Use age-appropriate language for grade ${grade}.
3. Include a mix of slide types: instruction (teaching content), activity (hands-on or think-pair-share), quiz (multiple choice), and summary (review)
4. Tag each slide with specific CCSS standard codes that it addresses
5. Assign a Bloom's taxonomy level to each slide
6. Include a worksheet with vocabulary terms, practice problems, and answer key
7. Start with an engaging hook and end with a summary/review
8. IMPORTANT — For the "visual" field on each slide: Describe a SCENE that illustrates the topic being taught. Include the KEY VISUAL ELEMENTS that are relevant (e.g. for water cycle: "rain falling from dark clouds onto mountains with a river flowing to the ocean and steam rising from the water"). But NEVER include: specific quantities or counts (like "8 slices" or "3 eaten"), fractions or math notation, labeled parts or arrows, named characters, or text/numbers in the scene. The description should paint a picture of WHAT the scene looks like, not the math behind it. For math topics, describe real-world objects in a scene (a whole pizza on a table, kids sharing snacks) without specifying exact counts.
9. IMPORTANT — For the "imageTags" field on each slide: Select 2-5 tags from THIS EXACT LIST that best describe the visual content needed for the slide:
${taxonomy.allTags.join(', ')}
Choose the most specific and relevant tags. Each slide MUST have DIFFERENT imageTags so that each slide gets a unique image. Vary the specific tags across slides. For example, if one fractions slide uses ["fractions", "pizza-fractions", "equal-parts"], another should use ["fractions", "fraction-bars", "number-line"] or ["fractions", "fraction-circles", "halves"]. Do NOT repeat the same tag combination on multiple slides. These tags are used to find matching images from our curated library.
${language !== 'en' ? `10. Generate ALL text content (titles, content, narration, worksheet) natively in ${languageName}. Standards codes should remain in English.` : ''}

For quiz slides, provide exactly 4 options with the correct answer index (0-based).

Your narration should be enthusiastic, warm, and expressive — like an amazing elementary school teacher who LOVES their subject. Use excitement, encouragement, and a playful tone. Say things like "Wow!", "Amazing job!", "Can you believe it?!", "Let's figure this out together!" Make it fun and engaging for young learners.`;

    if (curriculumContext) {
      systemPrompt += `\n\nCURRICULUM CONTEXT FROM TEACHER:
The teacher has provided their school's curriculum/pacing guide. Generate a lesson that follows this curriculum sequence and aligns with their scope:
${curriculumContext.slice(0, 3000)}`;
    }

    systemPrompt += `\n\nOUTPUT FORMAT: Return ONLY a JSON object with this exact structure (no markdown, no code fences):
{
  "title": "Lesson title",
  "gradeLevel": "${grade}",
  "subject": "${subject}",
  "language": "${language}",
  "duration": "${durationMinutes} min",
  "standards": ["CCSS.MATH.CONTENT.3.NF.A.1", ...],
  "objectives": ["Students will...", ...],
  "slides": [
    {
      "id": 1,
      "type": "instruction",
      "title": "Slide title",
      "content": "Displayed text on slide — key points, definitions, examples",
      "narration": "What the teacher/AI says aloud to the class",
      "visual": "Simple generic scene description for a decorative illustration — NO specific quantities, numbers, fractions, labeled items, or named characters",
      "imageTags": ["tag1-from-list", "tag2-from-list"],
      "teacherNotes": "Optional tip for the teacher",
      "standards": ["CCSS.MATH.CONTENT.3.NF.A.1"],
      "bloomsLevel": "understand"
    },
    {
      "id": 2,
      "type": "quiz",
      "title": "Quick Check",
      "content": "Let's see what you learned!",
      "narration": "Okay class, let's check our understanding...",
      "visual": "",
      "standards": ["CCSS.MATH.CONTENT.3.NF.A.1"],
      "bloomsLevel": "apply",
      "question": "What is 1/4 of a pizza?",
      "options": ["1 slice out of 2", "1 slice out of 4", "2 slices out of 4", "4 slices out of 4"],
      "correct": 1,
      "explanation": "1/4 means 1 part out of 4 equal parts!"
    }
  ],
  "worksheet": {
    "instructions": "Complete these practice problems about...",
    "vocabulary": [
      {"term": "Fraction", "definition": "A part of a whole"}
    ],
    "problems": [
      {"question": "What fraction is shaded?", "answer": "1/2"}
    ]
  }
}`;

    const userPrompt = `Create a ${durationMinutes}-minute interactive lesson for grade ${grade} about: ${prompt}`;

    // Call Claude
    const response = await anthropic.messages.create({
      model: CONFIG.MODEL,
      max_tokens: CONFIG.MAX_TOKENS,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const raw = response.content.find(block => block.type === 'text');
    const rawText = raw?.type === 'text' ? raw.text : '';

    // Extract JSON — strip markdown code fences if present
    let jsonStr = rawText.trim();
    const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) {
      jsonStr = fenceMatch[1].trim();
    }

    // Try to find JSON object
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: 'Failed to generate lesson. Please try again.', raw: rawText.slice(0, 300) },
        { status: 500 }
      );
    }

    let lesson;
    try {
      lesson = JSON.parse(jsonMatch[0]);
    } catch {
      return NextResponse.json(
        { error: 'Failed to parse lesson data. Please try again.', raw: rawText.slice(0, 300) },
        { status: 500 }
      );
    }

    // Validate required fields
    if (!lesson.slides || !Array.isArray(lesson.slides) || lesson.slides.length === 0) {
      return NextResponse.json(
        { error: 'Generated lesson is missing slides. Please try again.' },
        { status: 500 }
      );
    }

    // Ensure all slides have required fields
    lesson.slides = lesson.slides.map((slide: Record<string, unknown>, index: number) => ({
      id: slide.id || index + 1,
      type: slide.type || 'instruction',
      title: slide.title || `Slide ${index + 1}`,
      content: slide.content || '',
      narration: slide.narration || '',
      visual: slide.visual || '',
      imageTags: Array.isArray(slide.imageTags) ? slide.imageTags : [],
      teacherNotes: slide.teacherNotes || '',
      standards: Array.isArray(slide.standards) ? slide.standards : [],
      bloomsLevel: slide.bloomsLevel || 'understand',
      question: slide.question,
      options: slide.options,
      correct: slide.correct,
      explanation: slide.explanation,
    }));

    // Ensure worksheet exists
    if (!lesson.worksheet) {
      lesson.worksheet = { instructions: '', vocabulary: [], problems: [] };
    }

    const duration_ms = Date.now() - startTime;
    console.log(`[LESSON_ENGINE] Generated lesson: "${lesson.title}" Grade=${grade} Slides=${lesson.slides.length} Duration=${duration_ms}ms`);

    return NextResponse.json({
      success: true,
      lesson,
      tokens: (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0),
      usage: {
        inputTokens: response.usage?.input_tokens || 0,
        outputTokens: response.usage?.output_tokens || 0,
        model: 'claude-sonnet-4-6',
      },
    });
  } catch (error: unknown) {
    const duration_ms = Date.now() - startTime;
    console.error(`[LESSON_ENGINE] Generation error after ${duration_ms}ms:`, error);

    if (error instanceof Anthropic.APIError) {
      const message = error.message.toLowerCase();
      if (message.includes('credit balance') || message.includes('billing')) {
        return NextResponse.json({ error: 'AI service temporarily unavailable. Please try again later.' }, { status: 503 });
      }
      if (error.status === 429) {
        return NextResponse.json({ error: 'AI service is busy. Please wait a moment.' }, { status: 429 });
      }
      if (error.status === 529) {
        return NextResponse.json({ error: 'AI service is overloaded. Please try again shortly.' }, { status: 529 });
      }
    }

    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Lesson generation failed. Please try again.', details: msg }, { status: 500 });
  }
}
