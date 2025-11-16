/**
 * Rate Limiting Utilities
 *
 * This module provides rate limiting for API endpoints using Upstash Redis.
 * Rate limits protect against abuse and manage API quota consumption.
 *
 * Usage:
 * ```typescript
 * const { success } = await aiRateLimiter.limit(userId);
 * if (!success) {
 *   return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
 * }
 * ```
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Validate Redis environment variables
if (!process.env.UPSTASH_REDIS_URL || !process.env.UPSTASH_REDIS_TOKEN) {
  console.warn(
    'UPSTASH_REDIS_URL and UPSTASH_REDIS_TOKEN are required for rate limiting. ' +
    'Get these from: https://console.upstash.com/'
  );
}

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL || '',
  token: process.env.UPSTASH_REDIS_TOKEN || '',
});

/**
 * Rate limiter for AI description generation
 * Limit: 10 requests per hour per user
 * Reason: Gemini API has quota limits, prevent abuse
 */
export const aiRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 h'),
  analytics: true,
  prefix: 'ratelimit:ai:description',
});

/**
 * Rate limiter for message translation
 * Limit: 60 requests per minute per user
 * Reason: Allow real-time translation while preventing spam
 */
export const translationRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, '1 m'),
  analytics: true,
  prefix: 'ratelimit:ai:translation',
});

/**
 * Rate limiter for messaging
 * Limit: 30 messages per minute per user
 * Reason: Prevent spam while allowing normal conversation
 */
export const messagingRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, '1 m'),
  analytics: true,
  prefix: 'ratelimit:messaging',
});

/**
 * Rate limiter for API endpoints (general)
 * Limit: 100 requests per minute per IP
 * Reason: General protection against abuse
 */
export const apiRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  analytics: true,
  prefix: 'ratelimit:api',
});

/**
 * Rate limiter for cost calculator
 * Limit: 120 requests per minute per user
 * Reason: Allow multiple calculations while preventing abuse
 */
export const calculatorRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(120, '1 m'),
  analytics: true,
  prefix: 'ratelimit:calculator',
});

/**
 * Helper function to check rate limit and return appropriate response
 */
export async function checkRateLimit(
  limiter: Ratelimit,
  identifier: string
): Promise<{ success: boolean; remaining: number; reset: Date }> {
  const { success, limit, remaining, reset } = await limiter.limit(identifier);

  return {
    success,
    remaining,
    reset: new Date(reset),
  };
}

/**
 * Helper to get client IP from request headers
 */
export function getClientIp(headers: Headers): string {
  // Try multiple headers in order of reliability
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }

  // Fallback to a default identifier
  return 'unknown';
}

/**
 * Redis client for caching
 */
export { redis };
