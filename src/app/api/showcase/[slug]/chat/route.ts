import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { connectDB } from '@core/db';
import { ShowcaseSite } from '@/models';
import { checkDailyLimit, getIPFromRequest } from '@core/utils/rate-limit';

// ============================================================================
// CONFIGURATION
// ============================================================================
const CONFIG = {
  MAX_TOKENS: 700,
  MODEL: 'claude-haiku-4-5-20251001',
  RATE_LIMIT_REQUESTS: 30,
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

function getRateLimitKey(request: NextRequest, slug: string): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  return `showcase_chat_rate:${slug}:${ip}`;
}

function checkRateLimit(key: string): {
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
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + CONFIG.RATE_LIMIT_WINDOW_MS,
    });
    return {
      allowed: true,
      remaining: CONFIG.RATE_LIMIT_REQUESTS - 1,
      resetIn: CONFIG.RATE_LIMIT_WINDOW_MS,
    };
  }

  if (entry.count >= CONFIG.RATE_LIMIT_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: entry.resetTime - now,
    };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: CONFIG.RATE_LIMIT_REQUESTS - entry.count,
    resetIn: entry.resetTime - now,
  };
}

// ============================================================================
// ERROR CLASSIFICATION
// ============================================================================
type APIErrorType = 'billing' | 'rate_limit' | 'overloaded' | 'auth' | 'server' | 'unknown';

interface APIErrorInfo {
  type: APIErrorType;
  userMessage: string;
  retryable: boolean;
}

function classifyAPIError(error: unknown): APIErrorInfo {
  if (error instanceof Anthropic.APIError) {
    const message = error.message.toLowerCase();

    if (message.includes('credit balance') || message.includes('billing') || message.includes('purchase credits')) {
      return {
        type: 'billing',
        userMessage: 'Chat is temporarily unavailable. Please try again later.',
        retryable: false,
      };
    }

    if (error.status === 429 || message.includes('rate limit')) {
      return {
        type: 'rate_limit',
        userMessage: 'Too many messages. Please wait a moment.',
        retryable: true,
      };
    }

    if (error.status === 529 || message.includes('overloaded')) {
      return {
        type: 'overloaded',
        userMessage: 'Chat is busy. Please try again shortly.',
        retryable: true,
      };
    }

    if (error.status === 401) {
      return {
        type: 'auth',
        userMessage: 'Service configuration error.',
        retryable: false,
      };
    }

    if (error.status && error.status >= 500) {
      return {
        type: 'server',
        userMessage: 'Chat experiencing issues. Please try later.',
        retryable: true,
      };
    }
  }

  return {
    type: 'unknown',
    userMessage: 'Something went wrong. Please try again.',
    retryable: true,
  };
}

// ============================================================================
// ANTHROPIC CLIENT
// ============================================================================
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ============================================================================
// MESSAGE INTERFACE
// ============================================================================
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// ============================================================================
// BUILD SYSTEM PROMPT FOR SHOWCASE SITE
// ============================================================================
function buildShowcaseSystemPrompt(site: {
  businessName: string;
  tagline?: string;
  businessType: string;
  contact: { phone: string; email: string; address: string };
  pages: Record<string, unknown>;
  customQA?: Array<{ question: string; answer: string; enabled: boolean }>;
}): string {
  const pages = site.pages || {};
  const home = pages.home as Record<string, unknown> | undefined;
  const about = pages.about as Record<string, unknown> | undefined;
  const programs = pages.programs as Record<string, unknown> | undefined;
  const schedule = pages.schedule as { classes?: Array<{ grade: string; day: string; time: string; monthly: string }> } | undefined;

  // Build knowledge from site data
  let knowledge = `You are a helpful AI assistant for ${site.businessName}`;
  if (site.tagline) {
    knowledge += `, ${site.tagline}`;
  }
  knowledge += '.\n\n';

  // Business info
  knowledge += `## Business Information\n`;
  knowledge += `- Business Name: ${site.businessName}\n`;
  knowledge += `- Type: ${site.businessType}\n`;
  knowledge += `- Phone: ${site.contact.phone}\n`;
  knowledge += `- Email: ${site.contact.email}\n`;
  knowledge += `- Address: ${site.contact.address}\n\n`;

  // Mission/About
  const mission = home?.mission as string | undefined;
  const aboutContent = about?.content as string | undefined;
  if (mission || aboutContent) {
    knowledge += `## About Us\n`;
    if (mission) knowledge += `${mission}\n`;
    if (aboutContent) knowledge += `${aboutContent}\n`;
    knowledge += '\n';
  }

  // Programs
  const programsList = programs?.programs as Array<{
    name: string;
    description?: string;
    features?: string[];
  }> | undefined;
  if (programsList && programsList.length > 0) {
    knowledge += `## Programs Offered\n`;
    programsList.forEach((program) => {
      knowledge += `- **${program.name}**: ${program.description || ''}\n`;
      if (program.features) {
        program.features.forEach((feature) => {
          knowledge += `  - ${feature}\n`;
        });
      }
    });
    knowledge += '\n';
  }

  // Schedule
  if (schedule?.classes && schedule.classes.length > 0) {
    knowledge += `## Class Schedule\n`;
    schedule.classes.forEach((cls) => {
      knowledge += `- ${cls.grade}: ${cls.day} ${cls.time} - ${cls.monthly}/month\n`;
    });
    knowledge += '\n';
  }

  // Custom Q&A
  const customQA = site.customQA?.filter((qa) => qa.enabled) || [];
  if (customQA.length > 0) {
    knowledge += `## Frequently Asked Questions\n`;
    customQA.forEach((qa) => {
      knowledge += `Q: ${qa.question}\nA: ${qa.answer}\n\n`;
    });
  }

  // System instructions
  const systemPrompt = `${knowledge}

## Instructions
- You are a helpful, friendly assistant representing ${site.businessName}
- Answer questions based on the information provided above
- Be concise but helpful - keep responses under 150 words unless more detail is needed
- If asked about something not covered in the knowledge base, politely suggest contacting us at ${site.contact.phone} or ${site.contact.email}
- Use a warm, professional tone appropriate for an educational institution
- When discussing programs or schedule, refer to the specific information provided
- If asked to book or schedule something, provide contact information and encourage them to call or email
- Do not make up information that isn't provided above`;

  return systemPrompt;
}

// ============================================================================
// API ROUTE HANDLER - STREAMING
// ============================================================================
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const startTime = Date.now();

  try {
    const params = await context.params;
    const slug = params.slug;

    // Rate limiting
    const rateLimitKey = getRateLimitKey(request, slug);
    const rateLimit = checkRateLimit(rateLimitKey);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many messages. Please wait a moment and try again.' },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil(rateLimit.resetIn / 1000).toString(),
          },
        }
      );
    }

    const daily = checkDailyLimit(getIPFromRequest(request), 'showcase-light', 100);
    if (!daily.allowed) {
      return NextResponse.json(
        { error: 'Daily usage limit reached. Please try again tomorrow.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((daily.resetsAt - Date.now()) / 1000)) } }
      );
    }

    // Parse request
    const body = await request.json();
    const {
      message,
      sessionId,
      conversationHistory = [],
    }: {
      message: string;
      sessionId: string;
      conversationHistory: ChatMessage[];
    } = body;

    // Validate input
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Check API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('[SHOWCASE_CHAT] ANTHROPIC_API_KEY not configured');
      return NextResponse.json(
        { error: 'Chat is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // Load showcase site from database
    await connectDB();
    const site = await ShowcaseSite.findOne({ slug, status: { $in: ['active', 'demo'] } }).lean() as {
      businessName: string;
      tagline?: string;
      businessType: string;
      contact: { phone: string; email: string; address: string };
      pages: Record<string, unknown>;
      customQA?: Array<{ question: string; answer: string; enabled: boolean }>;
    } | null;

    if (!site) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      );
    }

    // Limit message length
    const trimmedMessage = message.slice(0, 2000);

    // Limit conversation history
    const recentHistory = conversationHistory.slice(-10);

    // Build system prompt from site data
    const systemPrompt = buildShowcaseSystemPrompt({
      businessName: site.businessName,
      tagline: site.tagline,
      businessType: site.businessType,
      contact: site.contact,
      pages: site.pages || {},
      customQA: site.customQA || [],
    });

    // Build messages array
    const messages: ChatMessage[] = [
      ...recentHistory,
      { role: 'user', content: trimmedMessage },
    ];

    // Create streaming response
    const encoder = new TextEncoder();
    let fullResponse = '';

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Use Claude streaming API
          const streamResponse = anthropic.messages.stream({
            model: CONFIG.MODEL,
            max_tokens: CONFIG.MAX_TOKENS,
            system: systemPrompt,
            messages: messages.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
          });

          // Handle text chunks
          streamResponse.on('text', (text) => {
            fullResponse += text;
            const data = JSON.stringify({ type: 'chunk', content: text });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          });

          // Wait for completion
          await streamResponse.finalMessage();

          // Send completion signal
          const doneData = JSON.stringify({ type: 'done', content: fullResponse });
          controller.enqueue(encoder.encode(`data: ${doneData}\n\n`));

          // Log request
          const duration = Date.now() - startTime;
          console.log(
            `[SHOWCASE_CHAT] Site=${slug} Session=${sessionId.slice(0, 8)}... Duration=${duration}ms`
          );

          // Save conversation (async)
          saveShowcaseConversation(slug, sessionId, trimmedMessage, fullResponse).catch(
            (err) => {
              console.warn('[SHOWCASE_CHAT] Failed to save conversation:', err);
            }
          );

          controller.close();
        } catch (error) {
          console.error('[SHOWCASE_CHAT] Streaming error:', error);
          const errorInfo = classifyAPIError(error);
          const errorData = JSON.stringify({
            type: 'error',
            error: errorInfo.userMessage,
            retryable: errorInfo.retryable,
          });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[SHOWCASE_CHAT] Error after ${duration}ms:`, error);

    const errorInfo = classifyAPIError(error);
    return NextResponse.json(
      {
        error: errorInfo.userMessage,
        retryable: errorInfo.retryable,
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// CONVERSATION PERSISTENCE
// ============================================================================
async function saveShowcaseConversation(
  slug: string,
  sessionId: string,
  userMessage: string,
  assistantMessage: string
) {
  try {
    const now = new Date();

    // Save to showcase site's conversations array
    await ShowcaseSite.findOneAndUpdate(
      { slug },
      {
        $push: {
          conversations: {
            sessionId,
            messages: [
              { role: 'user', content: userMessage, timestamp: now },
              { role: 'assistant', content: assistantMessage, timestamp: now },
            ],
            createdAt: now,
            updatedAt: now,
          },
        },
      }
    );
  } catch (error) {
    // Try to append to existing conversation
    try {
      await ShowcaseSite.findOneAndUpdate(
        { slug, 'conversations.sessionId': sessionId },
        {
          $push: {
            'conversations.$.messages': {
              $each: [
                { role: 'user', content: userMessage, timestamp: new Date() },
                { role: 'assistant', content: assistantMessage, timestamp: new Date() },
              ],
            },
          },
          $set: { 'conversations.$.updatedAt': new Date() },
        }
      );
    } catch {
      throw error;
    }
  }
}
