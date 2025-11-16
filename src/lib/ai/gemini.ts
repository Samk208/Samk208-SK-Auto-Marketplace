/**
 * Gemini AI Client Configuration
 *
 * This module provides a configured Google Gemini AI client for:
 * - Car description generation (multilingual)
 * - Real-time message translation
 * - Image analysis (future)
 *
 * Security: This module MUST only be imported in server-side code.
 * Never expose the API key to client-side code.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// Validate API key exists
if (!process.env.GEMINI_API_KEY) {
  throw new Error(
    'GEMINI_API_KEY environment variable is required. ' +
    'Get your key from: https://aistudio.google.com/apikey'
  );
}

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Primary Gemini model for production use
 * Model: gemini-2.0-flash-exp
 * - Fast response times (<3s typical)
 * - Good multilingual support
 * - Cost-effective for high-volume usage
 */
export const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-exp',
  generationConfig: {
    temperature: 0.7, // Balanced creativity/accuracy
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 2048,
  },
});

/**
 * Fallback model for when primary model quota is exceeded
 * Model: gemini-1.5-flash
 * - Stable and reliable
 * - Lower quota requirements
 */
export const geminiFlashModel = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: {
    temperature: 0.7,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 2048,
  },
});

/**
 * Model for vision/image analysis tasks (Phase 2)
 * Model: gemini-1.5-pro-vision
 */
export const geminiVisionModel = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro-vision',
});

/**
 * Retry configuration for API calls
 */
export const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
} as const;

/**
 * Timeout configuration
 */
export const TIMEOUT_MS = 30000; // 30 seconds

/**
 * Helper function to retry failed API calls with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries: number = RETRY_CONFIG.maxRetries
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on last attempt
      if (attempt === retries) break;

      // Calculate backoff delay with jitter
      const delay = Math.min(
        RETRY_CONFIG.initialDelayMs * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt),
        RETRY_CONFIG.maxDelayMs
      );
      const jitter = Math.random() * 0.3 * delay; // 30% jitter

      await new Promise(resolve => setTimeout(resolve, delay + jitter));
    }
  }

  throw lastError;
}

/**
 * Helper function to add timeout to async operations
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = TIMEOUT_MS
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
    ),
  ]);
}
