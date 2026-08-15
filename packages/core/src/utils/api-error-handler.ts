/**
 * API Error Handler Utility
 *
 * Provides consistent, user-friendly error handling for all AI API calls
 * across the Evelyn Learning website.
 */

export type APIErrorType =
  | 'billing'      // Credit balance too low
  | 'rate_limit'   // Rate limited
  | 'overloaded'   // API overloaded
  | 'auth'         // Authentication error
  | 'network'      // Network/connection error
  | 'server'       // Server error
  | 'unknown';     // Unknown error

export interface APIErrorInfo {
  type: APIErrorType;
  message: string;
  retryable: boolean;
}

/**
 * User-friendly error messages for different error types
 */
const ERROR_MESSAGES: Record<APIErrorType, string> = {
  billing: 'This service is temporarily unavailable. Please try again later.',
  rate_limit: 'Too many requests. Please wait a moment and try again.',
  overloaded: 'The service is currently busy. Please try again in a few moments.',
  auth: 'Service configuration error. Please contact support.',
  network: 'Connection error. Please check your internet and try again.',
  server: 'The service is experiencing issues. Please try again later.',
  unknown: 'Something went wrong. Please try again.',
};

/**
 * Parse an API response and extract error information
 */
export function parseAPIError(response: Response, data?: { error?: string; errorType?: string; retryable?: boolean }): APIErrorInfo {
  // If we have structured error data from our API
  if (data?.errorType) {
    return {
      type: data.errorType as APIErrorType,
      message: data.error || ERROR_MESSAGES[data.errorType as APIErrorType] || ERROR_MESSAGES.unknown,
      retryable: data.retryable ?? true,
    };
  }

  // Infer error type from HTTP status
  if (response.status === 429) {
    return {
      type: 'rate_limit',
      message: ERROR_MESSAGES.rate_limit,
      retryable: true,
    };
  }

  if (response.status === 503) {
    return {
      type: 'billing',
      message: data?.error || ERROR_MESSAGES.billing,
      retryable: false,
    };
  }

  if (response.status === 529) {
    return {
      type: 'overloaded',
      message: ERROR_MESSAGES.overloaded,
      retryable: true,
    };
  }

  if (response.status === 401 || response.status === 403) {
    return {
      type: 'auth',
      message: ERROR_MESSAGES.auth,
      retryable: false,
    };
  }

  if (response.status >= 500) {
    return {
      type: 'server',
      message: data?.error || ERROR_MESSAGES.server,
      retryable: true,
    };
  }

  return {
    type: 'unknown',
    message: data?.error || ERROR_MESSAGES.unknown,
    retryable: true,
  };
}

/**
 * Handle a fetch error (network errors, etc.)
 */
export function handleFetchError(error: unknown): APIErrorInfo {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      type: 'network',
      message: ERROR_MESSAGES.network,
      retryable: true,
    };
  }

  return {
    type: 'unknown',
    message: error instanceof Error ? error.message : ERROR_MESSAGES.unknown,
    retryable: true,
  };
}

/**
 * Safe API call wrapper with automatic error handling
 * Returns { data, error } - never throws
 */
export async function safeAPICall<T>(
  url: string,
  options: RequestInit
): Promise<{ data: T | null; error: APIErrorInfo | null }> {
  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok || data.error) {
      return {
        data: null,
        error: parseAPIError(response, data),
      };
    }

    return { data: data as T, error: null };
  } catch (err) {
    return {
      data: null,
      error: handleFetchError(err),
    };
  }
}

/**
 * Get a user-friendly error message
 */
export function getUserFriendlyError(errorType: APIErrorType): string {
  return ERROR_MESSAGES[errorType] || ERROR_MESSAGES.unknown;
}
