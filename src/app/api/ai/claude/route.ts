import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { checkDailyLimit } from '@core/utils/rate-limit';

// ============================================================================
// CONFIGURATION
// ============================================================================
const CONFIG = {
  // Maximum tokens allowed per request (caps high values, doesn't reject)
  MAX_TOKENS_LIMIT: 4000,

  // Rate limiting: requests per window
  RATE_LIMIT_REQUESTS: 20,
  RATE_LIMIT_WINDOW_MS: 60 * 1000, // 1 minute

  // Allowed models (whitelist to prevent using expensive models).
  // 2026-07-29 audit: claude-3-5-sonnet-20241022 was RETIRED (404s),
  // claude-3-haiku retires 2026-04-19, claude-sonnet-4 retires 2026-06-15.
  ALLOWED_MODELS: [
    'claude-sonnet-5',
    'claude-sonnet-4-6',
    'claude-haiku-4-5',
  ],

  // Default model if not specified or not allowed
  DEFAULT_MODEL: 'claude-sonnet-5',
};

// ============================================================================
// API ERROR CLASSIFICATION
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

    if (message.includes('credit balance') || message.includes('billing') ||
        message.includes('purchase credits') || message.includes('upgrade')) {
      return {
        type: 'billing',
        userMessage: 'AI service temporarily unavailable. Please try again later.',
        retryable: false,
      };
    }

    if (error.status === 429 || message.includes('rate limit')) {
      return {
        type: 'rate_limit',
        userMessage: 'Too many requests. Please wait a moment.',
        retryable: true,
      };
    }

    if (error.status === 529 || message.includes('overloaded')) {
      return {
        type: 'overloaded',
        userMessage: 'AI service is busy. Please try again shortly.',
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
        userMessage: 'AI service experiencing issues. Please try later.',
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
// RATE LIMITING (In-memory - for production, use Redis/Upstash)
// ============================================================================
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting (resets on server restart)
// For production, consider using @upstash/ratelimit with Redis
const rateLimitStore = new Map<string, RateLimitEntry>();

function getRateLimitKey(request: NextRequest): string {
  // Use IP address for rate limiting
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  return `rate_limit:${ip}`;
}

function checkRateLimit(key: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  // Clean up expired entries periodically
  if (rateLimitStore.size > 10000) {
    for (const [k, v] of rateLimitStore.entries()) {
      if (v.resetTime < now) rateLimitStore.delete(k);
    }
  }

  if (!entry || entry.resetTime < now) {
    // Create new window
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + CONFIG.RATE_LIMIT_WINDOW_MS,
    });
    return {
      allowed: true,
      remaining: CONFIG.RATE_LIMIT_REQUESTS - 1,
      resetIn: CONFIG.RATE_LIMIT_WINDOW_MS
    };
  }

  if (entry.count >= CONFIG.RATE_LIMIT_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: entry.resetTime - now
    };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: CONFIG.RATE_LIMIT_REQUESTS - entry.count,
    resetIn: entry.resetTime - now
  };
}

// ============================================================================
// REQUEST LOGGING
// ============================================================================
interface RequestLog {
  timestamp: string;
  ip: string;
  model: string;
  requestedTokens: number;
  actualTokens: number;
  inputTokens?: number;
  outputTokens?: number;
  success: boolean;
  error?: string;
  durationMs?: number;
}

function logRequest(log: RequestLog) {
  // Format: [TIMESTAMP] IP=xxx MODEL=xxx TOKENS=xxx SUCCESS=xxx DURATION=xxxms
  const logLine = [
    `[${log.timestamp}]`,
    `IP=${log.ip}`,
    `MODEL=${log.model}`,
    `REQ_TOKENS=${log.requestedTokens}`,
    `ACTUAL_TOKENS=${log.actualTokens}`,
    log.inputTokens !== undefined ? `IN=${log.inputTokens}` : '',
    log.outputTokens !== undefined ? `OUT=${log.outputTokens}` : '',
    `SUCCESS=${log.success}`,
    log.durationMs !== undefined ? `DURATION=${log.durationMs}ms` : '',
    log.error ? `ERROR="${log.error}"` : '',
  ].filter(Boolean).join(' ');

  console.log(`[CLAUDE_API] ${logLine}`);

  // In production, you might want to:
  // - Send to a logging service (DataDog, LogTail, etc.)
  // - Store in a database for analytics
  // - Send alerts for high error rates
}

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
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';

  // Initialize log entry
  const logEntry: RequestLog = {
    timestamp: new Date().toISOString(),
    ip,
    model: CONFIG.DEFAULT_MODEL,
    requestedTokens: 0,
    actualTokens: 0,
    success: false,
  };

  try {
    // ========================================================================
    // RATE LIMITING CHECK
    // ========================================================================
    const rateLimitKey = getRateLimitKey(request);
    const rateLimit = checkRateLimit(rateLimitKey);

    if (!rateLimit.allowed) {
      logEntry.error = 'Rate limit exceeded';
      logRequest(logEntry);

      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': CONFIG.RATE_LIMIT_REQUESTS.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.ceil(rateLimit.resetIn / 1000).toString(),
            'Retry-After': Math.ceil(rateLimit.resetIn / 1000).toString(),
          }
        }
      );
    }

    const daily = checkDailyLimit(ip, 'showcase-medium', 50);
    if (!daily.allowed) {
      logEntry.error = 'Daily limit exceeded';
      logRequest(logEntry);

      return NextResponse.json(
        { error: 'Daily usage limit reached. Please try again tomorrow.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((daily.resetsAt - Date.now()) / 1000)) } }
      );
    }

    // ========================================================================
    // PARSE AND VALIDATE REQUEST
    // ========================================================================
    const body = await request.json();
    const {
      messages,
      system,
      systemPrompt,
      max_tokens = 2000,
      model = CONFIG.DEFAULT_MODEL
    } = body;

    // `systemPrompt` is an alias for `system` — accepted from callers that
    // pass a per-demo system prompt override.
    const effectiveSystem = typeof systemPrompt === 'string' && systemPrompt.trim().length > 0
      ? systemPrompt
      : system;

    logEntry.requestedTokens = max_tokens;

    if (!messages || !Array.isArray(messages)) {
      logEntry.error = 'Invalid messages array';
      logRequest(logEntry);

      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      logEntry.error = 'API key not configured';
      logRequest(logEntry);

      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // ========================================================================
    // SANITIZE PARAMETERS
    // ========================================================================

    // Cap max_tokens to prevent excessive costs (don't reject, just cap)
    const sanitizedMaxTokens = Math.min(
      Math.max(1, Number(max_tokens) || 2000),
      CONFIG.MAX_TOKENS_LIMIT
    );
    logEntry.actualTokens = sanitizedMaxTokens;

    // Validate model - use default if not in allowed list
    const sanitizedModel = CONFIG.ALLOWED_MODELS.includes(model)
      ? model
      : CONFIG.DEFAULT_MODEL;
    logEntry.model = sanitizedModel;

    // ========================================================================
    // MAKE API REQUEST
    // ========================================================================
    const response = await anthropic.messages.create({
      model: sanitizedModel,
      max_tokens: sanitizedMaxTokens,
      system: effectiveSystem || undefined,
      messages: messages.map((msg: { role: string; content: string }) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    });

    // Extract the text content from the response
    const textContent = response.content.find(block => block.type === 'text');

    // Log successful request
    logEntry.success = true;
    logEntry.inputTokens = response.usage?.input_tokens;
    logEntry.outputTokens = response.usage?.output_tokens;
    logEntry.durationMs = Date.now() - startTime;
    logRequest(logEntry);

    return NextResponse.json({
      content: response.content,
      text: textContent?.type === 'text' ? textContent.text : '',
      usage: response.usage,
    }, {
      headers: {
        'X-RateLimit-Limit': CONFIG.RATE_LIMIT_REQUESTS.toString(),
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
      }
    });

  } catch (error) {
    logEntry.durationMs = Date.now() - startTime;

    console.error('Claude API error:', error);

    const errorInfo = classifyAPIError(error);
    logEntry.error = error instanceof Error ? error.message : 'Unknown error';
    logRequest(logEntry);

    return NextResponse.json(
      {
        error: errorInfo.userMessage,
        errorType: errorInfo.type,
        retryable: errorInfo.retryable,
      },
      { status: errorInfo.type === 'billing' ? 503 : (error instanceof Anthropic.APIError ? error.status || 500 : 500) }
    );
  }
}
