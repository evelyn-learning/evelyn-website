import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { connectDB } from "@/lib/db";
import { ChatQA, ChatConversation, SiteSettings } from "@/models";
import { buildSystemPrompt } from "@/lib/chat/knowledge-base";
import type { ISiteSettings } from "@/models/SiteSettings";

// ============================================================================
// CONFIGURATION
// ============================================================================
const CONFIG = {
  MAX_TOKENS: 700,
  MODEL: "claude-3-haiku-20240307",
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

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  return `chat_rate_limit:${ip}`;
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
type APIErrorType =
  | "billing"
  | "rate_limit"
  | "overloaded"
  | "auth"
  | "server"
  | "unknown";

interface APIErrorInfo {
  type: APIErrorType;
  userMessage: string;
  retryable: boolean;
}

function classifyAPIError(error: unknown): APIErrorInfo {
  if (error instanceof Anthropic.APIError) {
    const message = error.message.toLowerCase();

    if (
      message.includes("credit balance") ||
      message.includes("billing") ||
      message.includes("purchase credits")
    ) {
      return {
        type: "billing",
        userMessage: "Chat is temporarily unavailable. Please try again later.",
        retryable: false,
      };
    }

    if (error.status === 429 || message.includes("rate limit")) {
      return {
        type: "rate_limit",
        userMessage: "Too many messages. Please wait a moment.",
        retryable: true,
      };
    }

    if (error.status === 529 || message.includes("overloaded")) {
      return {
        type: "overloaded",
        userMessage: "Chat is busy. Please try again shortly.",
        retryable: true,
      };
    }

    if (error.status === 401) {
      return {
        type: "auth",
        userMessage: "Service configuration error.",
        retryable: false,
      };
    }

    if (error.status && error.status >= 500) {
      return {
        type: "server",
        userMessage: "Chat experiencing issues. Please try later.",
        retryable: true,
      };
    }
  }

  return {
    type: "unknown",
    userMessage: "Something went wrong. Please try again.",
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
  role: "user" | "assistant";
  content: string;
}

// ============================================================================
// API ROUTE HANDLER - STREAMING
// ============================================================================
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Rate limiting
    const rateLimitKey = getRateLimitKey(request);
    const rateLimit = checkRateLimit(rateLimitKey);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many messages. Please wait a moment and try again." },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(rateLimit.resetIn / 1000).toString(),
          },
        }
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
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Limit message length
    const trimmedMessage = message.slice(0, 2000);

    // Limit conversation history
    const recentHistory = conversationHistory.slice(-10);

    // Check API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("[CHAT_BOT] ANTHROPIC_API_KEY not configured");
      return NextResponse.json(
        { error: "Chat is not configured. Please contact support." },
        { status: 500 }
      );
    }

    // Load custom Q&A and site settings from database
    let customQAPairs: { question: string; answer: string }[] = [];
    let siteSettings: ISiteSettings | null = null;
    try {
      await connectDB();
      const [qaEntries, settings] = await Promise.all([
        ChatQA.find({ enabled: true }).lean(),
        SiteSettings.findOne().lean(),
      ]);
      customQAPairs = qaEntries.map((qa) => ({
        question: qa.question,
        answer: qa.answer,
      }));
      siteSettings = settings as ISiteSettings | null;
    } catch (dbError) {
      console.warn("[CHAT_BOT] Could not load from database:", dbError);
    }

    // Build system prompt
    const systemPrompt = buildSystemPrompt(siteSettings, customQAPairs);

    // Build messages array
    const messages: ChatMessage[] = [
      ...recentHistory,
      { role: "user", content: trimmedMessage },
    ];

    // Create streaming response
    const encoder = new TextEncoder();
    let fullResponse = "";

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
          streamResponse.on("text", (text) => {
            fullResponse += text;
            // Send chunk as SSE data
            const data = JSON.stringify({ type: "chunk", content: text });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          });

          // Wait for completion
          await streamResponse.finalMessage();

          // Send completion signal
          const doneData = JSON.stringify({ type: "done", content: fullResponse });
          controller.enqueue(encoder.encode(`data: ${doneData}\n\n`));

          // Log request
          const duration = Date.now() - startTime;
          console.log(
            `[CHAT_BOT] Session=${sessionId.slice(0, 8)}... Duration=${duration}ms`
          );

          // Save conversation (async)
          saveConversation(sessionId, trimmedMessage, fullResponse).catch(
            (err) => {
              console.warn("[CHAT_BOT] Failed to save conversation:", err);
            }
          );

          controller.close();
        } catch (error) {
          console.error("[CHAT_BOT] Streaming error:", error);
          const errorInfo = classifyAPIError(error);
          const errorData = JSON.stringify({
            type: "error",
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
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[CHAT_BOT] Error after ${duration}ms:`, error);

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
async function saveConversation(
  sessionId: string,
  userMessage: string,
  assistantMessage: string
) {
  try {
    await connectDB();

    const now = new Date();

    await ChatConversation.findOneAndUpdate(
      { sessionId },
      {
        $push: {
          messages: {
            $each: [
              { role: "user", content: userMessage, timestamp: now },
              { role: "assistant", content: assistantMessage, timestamp: now },
            ],
          },
        },
        $set: { status: "active", updatedAt: now },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true }
    );
  } catch (error) {
    throw error;
  }
}
