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
    });

    // Build messages array
    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [
      ...conversationHistory,
      { role: 'user' as const, content: message },
    ];

    // Call Claude
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: systemPrompt,
      messages,
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      return NextResponse.json({ error: 'Unexpected response type' }, { status: 500 });
    }

    // Parse whiteboard commands
    const { cleanText, commands, pedagogicalIntent } = parseWhiteboardCommands(content.text);

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
    });

    // Build messages array
    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [
      ...conversationHistory,
      { role: 'user' as const, content: message },
    ];

    // Create streaming response
    const stream = await anthropic.messages.stream({
      model: 'claude-sonnet-4-20250514',
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
