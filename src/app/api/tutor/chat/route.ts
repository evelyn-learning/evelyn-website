/**
 * Tutor Chat API Route
 *
 * Simple text-based API for testing the tutor without WebSocket.
 * Streams responses from Claude for low latency.
 */

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { buildSystemPrompt } from '@/lib/tutor/ai/system-prompt-builder';
import { parseWhiteboardCommands } from '@/lib/tutor/ai/response-parser';
import { loadModuleByParams } from '@/lib/knowledge/registry';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * API Error Types for graceful handling
 */
type APIErrorType =
  | 'billing'      // Credit balance too low
  | 'rate_limit'   // Rate limited
  | 'overloaded'   // API overloaded
  | 'auth'         // Authentication error
  | 'server'       // Server error
  | 'unknown';     // Unknown error

interface APIErrorInfo {
  type: APIErrorType;
  userMessage: string;
  retryable: boolean;
}

/**
 * Classify API errors and return user-friendly messages
 */
function classifyAPIError(error: unknown): APIErrorInfo {
  if (error instanceof Anthropic.APIError) {
    const message = error.message.toLowerCase();

    // Billing/Credit issues
    if (message.includes('credit balance') || message.includes('billing') ||
        message.includes('purchase credits') || message.includes('upgrade')) {
      return {
        type: 'billing',
        userMessage: 'The AI tutor service is temporarily unavailable. Please try again later or contact support.',
        retryable: false,
      };
    }

    // Rate limiting
    if (error.status === 429 || message.includes('rate limit')) {
      return {
        type: 'rate_limit',
        userMessage: 'Too many requests. Please wait a moment and try again.',
        retryable: true,
      };
    }

    // Overloaded
    if (error.status === 529 || message.includes('overloaded')) {
      return {
        type: 'overloaded',
        userMessage: 'The AI service is currently busy. Please try again in a few moments.',
        retryable: true,
      };
    }

    // Authentication
    if (error.status === 401 || message.includes('api key') || message.includes('authentication')) {
      return {
        type: 'auth',
        userMessage: 'Service configuration error. Please contact support.',
        retryable: false,
      };
    }

    // Server errors (5xx)
    if (error.status && error.status >= 500) {
      return {
        type: 'server',
        userMessage: 'The AI service is experiencing issues. Please try again later.',
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      message,
      conversationHistory = [],
      subject = 'physics',
      topic = 'kinematics',
      level = 'AP',
      studentName,
      sessionGoal,
    } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Try to load knowledge module
    let knowledgeModule = null;
    try {
      knowledgeModule = await loadModuleByParams(subject, topic, level);
    } catch (e) {
      console.log('Module not fully loaded, using base prompts');
    }

    // Build system prompt
    const systemPrompt = buildSystemPrompt({
      module: knowledgeModule,
      studentName,
      sessionGoal,
      timeRemainingMinutes: 30,
      currentState: conversationHistory.length === 0 ? 'greeting' : 'teaching',
      subject,
      topic,
    });

    // Build messages array
    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [
      ...conversationHistory,
      { role: 'user' as const, content: message },
    ];

    // Call Claude
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: systemPrompt,
      messages,
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      return NextResponse.json({ error: 'Unexpected response type' }, { status: 500 });
    }

    // Parse whiteboard commands
    let { cleanText, commands, pedagogicalIntent } = parseWhiteboardCommands(content.text);
    console.log('[Tutor API] Parsed commands:', commands.length, commands.map(c => c.action));
    if (commands.length === 0) {
      console.log('[Tutor API] Raw AI text (first 300 chars):', content.text.substring(0, 300));
    }

    // --- Whiteboard content validation pass ---
    // Detect when the AI claims to show something on the whiteboard but didn't
    // include actual content commands (only meta commands like newPage/goToPage).
    const hasContentCommand = commands.some(cmd =>
      cmd.action !== 'newPage' && cmd.action !== 'goToPage' && cmd.action !== 'clear'
    );
    const claimsToShow = /\b(show|display|put|write|post|here'?s|look at|on the (?:white)?board)\b/i.test(cleanText);

    if (!hasContentCommand && claimsToShow && conversationHistory.length > 0) {
      console.log('[Tutor API] AI claims to show content but has no whiteboard commands — generating follow-up');

      try {
        const followUp = await anthropic.messages.create({
          model: 'claude-sonnet-4-6',
          max_tokens: 500,
          system: `You are a whiteboard command generator. Given a tutor's spoken response, generate ONLY the whiteboard commands as \`\`\`whiteboard JSON blocks. No spoken text.

Rules:
- For code: {"action": "showCode", "language": "java", "label": "description", "code": "the code with \\n for newlines"}
- For equations: {"action": "showEquation", "latex": "LaTeX here", "label": "description"}
- For tables: {"action": "showTable", "headers": [...], "rows": [[...]]}
- Use \\n for newlines in code strings. Use \\t or spaces for indentation.
- Generate ONLY \`\`\`whiteboard blocks. No other text.`,
          messages: [
            {
              role: 'user',
              content: `The tutor just said this to a student:\n\n"${cleanText}"\n\nThe student's question was: "${message}"\n\nGenerate the whiteboard command(s) that should accompany this response. If the tutor mentioned code, generate a showCode command with the actual code. If they mentioned an equation, generate showEquation.`,
            },
          ],
        });

        const followUpContent = followUp.content[0];
        if (followUpContent.type === 'text') {
          const followUpParsed = parseWhiteboardCommands(followUpContent.text);
          if (followUpParsed.commands.length > 0) {
            commands = [...commands, ...followUpParsed.commands];
            console.log(`[Tutor API] Follow-up generated ${followUpParsed.commands.length} whiteboard command(s)`);
          }
        }
      } catch (followUpErr) {
        console.error('[Tutor API] Follow-up whiteboard generation failed:', followUpErr);
        // Non-fatal — continue with original response
      }
    }

    return NextResponse.json({
      text: cleanText,
      rawText: content.text,
      whiteboardCommands: commands,
      pedagogicalIntent,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
    });
  } catch (error) {
    console.error('[Tutor API] Error:', error);

    const errorInfo = classifyAPIError(error);

    return NextResponse.json(
      {
        error: errorInfo.userMessage,
        errorType: errorInfo.type,
        retryable: errorInfo.retryable,
      },
      { status: errorInfo.type === 'billing' ? 503 : 500 }
    );
  }
}

/**
 * Streaming version for lower latency
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      message,
      conversationHistory = [],
      subject = 'physics',
      topic = 'kinematics',
      level = 'AP',
      studentName,
      sessionGoal,
    } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Try to load knowledge module
    let knowledgeModule = null;
    try {
      knowledgeModule = await loadModuleByParams(subject, topic, level);
    } catch (e) {
      console.log('Module not fully loaded, using base prompts');
    }

    // Build system prompt
    const systemPrompt = buildSystemPrompt({
      module: knowledgeModule,
      studentName,
      sessionGoal,
      timeRemainingMinutes: 30,
      currentState: conversationHistory.length === 0 ? 'greeting' : 'teaching',
      subject,
      topic,
    });

    // Build messages array
    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [
      ...conversationHistory,
      { role: 'user' as const, content: message },
    ];

    // Create streaming response
    const stream = await anthropic.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: systemPrompt,
      messages,
    });

    // Create a readable stream
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === 'content_block_delta') {
              const delta = event.delta;
              if ('text' in delta) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: delta.text })}\n\n`));
              }
            }
          }

          // Send final message
          const finalMessage = await stream.finalMessage();
          const fullText = finalMessage.content[0].type === 'text' ? finalMessage.content[0].text : '';
          const { cleanText, commands } = parseWhiteboardCommands(fullText);

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            done: true,
            cleanText,
            whiteboardCommands: commands,
          })}\n\n`));

          controller.close();
        } catch (error) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('[Tutor API] Stream error:', error);

    const errorInfo = classifyAPIError(error);

    return NextResponse.json(
      {
        error: errorInfo.userMessage,
        errorType: errorInfo.type,
        retryable: errorInfo.retryable,
      },
      { status: errorInfo.type === 'billing' ? 503 : 500 }
    );
  }
}
