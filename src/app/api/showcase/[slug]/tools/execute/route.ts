import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ShowcaseSite, AITool, DEFAULT_AI_TOOLS } from '@/models';
import OpenAI from 'openai';

// Use showcase-specific API key for demo tools (separate billing/tracking)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_SHOWCASE_API_KEY || process.env.OPENAI_API_KEY,
});

interface ToolExecutionRequest {
  toolId: string;
  input: Record<string, unknown>;
}

interface ToolConfig {
  toolId: string;
  name: string;
  apiModel: string;
  systemPrompt: string;
  maxOutputTokens: number;
  temperature: number;
}

// Demo limits - intentionally restrictive to control costs
const DEMO_LIMITS: Record<string, number> = {
  'test-generator': 5,
  'homework-helper': 10,
  'essay-scorer': 3,
  'vocab-builder': 20,
  'math-solver': 15,
  'college-essay-coach': 5,
  'study-planner': 3,
  'reading-comprehension': 5,
};

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const startTime = Date.now();

  try {
    const params = await context.params;
    const slug = params.slug;
    const { toolId, input }: ToolExecutionRequest = await request.json();

    if (!toolId || !input) {
      return NextResponse.json(
        { error: 'toolId and input are required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_SHOWCASE_API_KEY && !process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      );
    }

    await connectDB();

    // Get site and check usage limits
    const site = await ShowcaseSite.findOne({ slug }).select(
      'enabledTools toolLimits analytics.toolUsage apiUsageLog'
    );

    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    // Check if tool is enabled for this site
    if (!site.enabledTools?.includes(toolId)) {
      return NextResponse.json(
        { error: 'Tool is not enabled for this site' },
        { status: 403 }
      );
    }

    // Check usage limits
    const toolUsage = site.analytics?.toolUsage instanceof Map
      ? Object.fromEntries(site.analytics.toolUsage)
      : site.analytics?.toolUsage || {};

    const currentUsage = toolUsage[toolId] || 0;
    const limit = site.toolLimits?.[toolId] || DEMO_LIMITS[toolId] || 10;

    if (currentUsage >= limit) {
      return NextResponse.json(
        {
          error: 'Demo limit reached',
          message: 'You have reached the demo limit for this tool. Launch your website for unlimited access!',
          currentUsage,
          limit,
        },
        { status: 429 }
      );
    }

    // Get tool configuration
    let toolConfig: ToolConfig | null = null;

    const dbTool = await AITool.findOne({ toolId, status: { $in: ['active', 'beta'] } });
    if (dbTool) {
      toolConfig = {
        toolId: dbTool.toolId,
        name: dbTool.name,
        apiModel: dbTool.apiModel || 'gpt-4o-mini',
        systemPrompt: dbTool.systemPrompt || '',
        maxOutputTokens: dbTool.maxOutputTokens || 1000,
        temperature: dbTool.temperature || 0.7,
      };
    } else {
      // Fall back to defaults
      const defaultTool = DEFAULT_AI_TOOLS.find(t => t.toolId === toolId) as {
        toolId: string;
        name: string;
        apiModel?: string;
        systemPrompt?: string;
      } | undefined;
      if (defaultTool) {
        toolConfig = {
          toolId: defaultTool.toolId,
          name: defaultTool.name,
          apiModel: defaultTool.apiModel || 'gpt-4o-mini',
          systemPrompt: defaultTool.systemPrompt || '',
          maxOutputTokens: 1000,
          temperature: 0.7,
        };
      }
    }

    if (!toolConfig) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }

    // Build prompt based on tool type
    const userPrompt = buildUserPrompt(toolId, input);

    if (!userPrompt) {
      return NextResponse.json(
        { error: 'Invalid input for this tool' },
        { status: 400 }
      );
    }

    // Call OpenAI
    let result: string;
    let tokensUsed = 0;

    try {
      const completion = await openai.chat.completions.create({
        model: toolConfig.apiModel,
        messages: [
          {
            role: 'system',
            content: toolConfig.systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        max_tokens: toolConfig.maxOutputTokens,
        temperature: toolConfig.temperature,
      });

      result = completion.choices[0]?.message?.content || '';
      tokensUsed = completion.usage?.total_tokens || 0;
    } catch (aiError: unknown) {
      console.error(`[TOOL_EXECUTE] OpenAI error for ${toolId}:`, aiError);

      // Track failed usage
      await ShowcaseSite.findOneAndUpdate(
        { slug },
        {
          $push: {
            apiUsageLog: {
              $each: [{
                toolId,
                timestamp: new Date(),
                responseTime: Date.now() - startTime,
                tokensUsed: 0,
                successful: false,
                errorMessage: aiError instanceof Error ? aiError.message : 'OpenAI API error',
              }],
              $slice: -1000,
            },
          },
        }
      );

      return NextResponse.json(
        { error: 'AI service temporarily unavailable' },
        { status: 503 }
      );
    }

    const responseTime = Date.now() - startTime;

    // Track successful usage
    await ShowcaseSite.findOneAndUpdate(
      { slug },
      {
        $inc: { [`analytics.toolUsage.${toolId}`]: 1 },
        $push: {
          apiUsageLog: {
            $each: [{
              toolId,
              timestamp: new Date(),
              responseTime,
              tokensUsed,
              successful: true,
            }],
            $slice: -1000,
          },
        },
      }
    );

    console.log(`[TOOL_EXECUTE] ${slug} used ${toolId}, ${responseTime}ms, ${tokensUsed} tokens`);

    // Parse result based on tool type
    const parsedResult = parseToolResult(toolId, result, input);

    return NextResponse.json({
      success: true,
      result: parsedResult,
      metadata: {
        toolId,
        tokensUsed,
        responseTime,
        usageCount: currentUsage + 1,
        limit,
        remaining: Math.max(0, limit - currentUsage - 1),
      },
    });
  } catch (error) {
    console.error('[TOOL_EXECUTE] Error:', error);
    return NextResponse.json(
      { error: 'Failed to execute tool' },
      { status: 500 }
    );
  }
}

function buildUserPrompt(toolId: string, input: Record<string, unknown>): string | null {
  switch (toolId) {
    case 'test-generator': {
      const { subject, topic, difficulty, questionCount } = input as {
        subject: string;
        topic: string;
        difficulty: string;
        questionCount: string;
      };
      if (!subject || !topic) return null;

      return `Create a ${difficulty || 'medium'} difficulty practice test with ${questionCount || '10'} questions about "${topic}" in the subject of ${subject}.

Include:
1. A variety of question types (multiple choice, short answer, problem-solving)
2. Clear instructions for each section
3. An answer key at the end with detailed explanations

Format as a well-structured test document that a tutor can use with their students.`;
    }

    case 'homework-helper': {
      const { question, subject } = input as { question: string; subject: string };
      if (!question) return null;

      return `Help solve this ${subject || 'academic'} problem step-by-step:

"${question}"

Provide:
1. A clear breakdown of the problem
2. Step-by-step solution with explanations
3. Key concepts being demonstrated
4. Similar practice suggestions
5. Tips for avoiding common mistakes

Focus on teaching understanding, not just giving the answer.`;
    }

    case 'essay-scorer': {
      const { essay, essayType } = input as { essay: string; essayType: string };
      if (!essay || essay.length < 50) return null;

      return `Evaluate this ${essayType || 'argumentative'} essay and provide detailed feedback:

---
${essay}
---

Provide:
1. Overall score out of 100
2. Breakdown scores for:
   - Thesis & Argument (0-100)
   - Organization & Structure (0-100)
   - Evidence & Support (0-100)
   - Grammar & Style (0-100)
   - Conclusion (0-100)
3. 3-4 specific strengths
4. 3-4 areas for improvement
5. Specific suggestions with paragraph references

Format as a detailed evaluation report.`;
    }

    case 'vocab-builder': {
      const { words, context } = input as { words: string; context?: string };
      if (!words) return null;

      return `Create vocabulary study materials for these words: ${words}

${context ? `Context: ${context}` : ''}

For each word provide:
1. Definition
2. Part of speech
3. Etymology (word origin)
4. 2-3 example sentences
5. Memory trick or mnemonic
6. Related words/synonyms
7. Common mistakes to avoid

Format as flashcard-ready content.`;
    }

    case 'math-solver': {
      const { problem, level } = input as { problem: string; level?: string };
      if (!problem) return null;

      return `Solve this ${level || 'high school'} math problem step-by-step:

"${problem}"

Provide:
1. Problem analysis (what type of problem, key concepts)
2. Step-by-step solution with explanations for each step
3. Verification of the answer
4. Common mistakes to avoid
5. Similar practice problems

Show all work clearly.`;
    }

    case 'college-essay-coach': {
      const { prompt, draft, goal } = input as { prompt: string; draft?: string; goal: string };
      if (!prompt && !draft) return null;

      if (draft) {
        return `Review this college application essay draft:

Prompt: ${prompt || 'Personal statement'}

---
${draft}
---

Goal: ${goal || 'Make it compelling and authentic'}

Provide:
1. Overall assessment
2. What works well
3. Areas to strengthen
4. Specific suggestions with line references
5. Questions to help deepen the narrative
6. Next steps for revision`;
      }

      return `Help brainstorm a college essay for this prompt:

"${prompt}"

Goal: ${goal || 'Create a compelling narrative'}

Provide:
1. 3-4 potential angle ideas
2. Questions to explore for each angle
3. Story structure suggestions
4. How to show rather than tell
5. Tips for making it personal and memorable`;
    }

    case 'study-planner': {
      const { goal, deadline, hoursPerDay, subjects } = input as {
        goal: string;
        deadline: string;
        hoursPerDay: string;
        subjects: string;
      };
      if (!goal) return null;

      return `Create a personalized study plan:

Goal: ${goal}
Deadline: ${deadline || 'flexible'}
Available study time: ${hoursPerDay || '2-3'} hours per day
Subjects/Topics: ${subjects || 'not specified'}

Create:
1. Weekly schedule overview
2. Daily breakdown with specific tasks
3. Breaks and review sessions
4. Milestones and checkpoints
5. Tips for staying on track
6. Flexibility options for busy days

Format as an actionable study plan.`;
    }

    default:
      return null;
  }
}

function parseToolResult(
  toolId: string,
  result: string,
  input: Record<string, unknown>
): unknown {
  switch (toolId) {
    case 'essay-scorer': {
      // Try to extract score from the result
      const scoreMatch = result.match(/Overall.*?(\d+)/i) || result.match(/Score:?\s*(\d+)/i);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 85;

      return {
        score: Math.min(100, Math.max(0, score)),
        feedback: result,
      };
    }

    default:
      return result;
  }
}
