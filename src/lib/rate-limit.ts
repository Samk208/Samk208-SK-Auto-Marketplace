/**
 * Rate Limiting Configuration
 * Uses Upstash Redis for distributed rate limiting
 */

import { Ratelimit } from '@upstash/ratelimit';
import { redis } from './cache/redis';

/**
 * Rate limiters for different operations
 */
export const rateLimiters = {
  /**
   * AI Generation: 10 requests per hour per user
   * For car description generation and AI features
   */
  aiGeneration: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 h'),
    analytics: true,
    prefix: 'ratelimit:ai',
  }),

  /**
   * Messaging: 60 messages per minute per user
   * For sending chat messages
   */
  messaging: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, '1 m'),
    analytics: true,
    prefix: 'ratelimit:messages',
  }),

  /**
   * Login: 5 attempts per 15 minutes per IP
   * For authentication attempts
   */
  login: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '15 m'),
    analytics: true,
    prefix: 'ratelimit:login',
  }),

  /**
   * Image Upload: 20 uploads per hour per user
   * For car image uploads
   */
  imageUpload: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, '1 h'),
    analytics: true,
    prefix: 'ratelimit:images',
  }),
};

/**
 * Check rate limit for a specific operation
 * @param identifier - User ID, IP address, or other identifier
 * @param limiter - The rate limiter to use
 * @returns Rate limit result with allowed status and metadata
 */
export async function checkRateLimit(
  identifier: string,
  limiter: keyof typeof rateLimiters
) {
  const { success, limit, reset, remaining } = await rateLimiters[limiter].limit(identifier);

  return {
    allowed: success,
    limit,
    remaining,
    reset: new Date(reset),
    retryAfter: success ? null : Math.ceil((reset - Date.now()) / 1000),
  };
}

/**
 * Rate limit error response helper
 */
export function rateLimitErrorResponse(retryAfter: number) {
  return {
    error: 'Rate limit exceeded',
    message: `Too many requests. Please try again in ${retryAfter} seconds.`,
    retryAfter,
  };
}
