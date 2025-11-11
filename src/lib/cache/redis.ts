/**
 * Upstash Redis Client
 * Used for caching AI translations and rate limiting
 */

import { Redis } from '@upstash/redis';

if (!process.env.UPSTASH_REDIS_URL || !process.env.UPSTASH_REDIS_TOKEN) {
  throw new Error('Missing Upstash Redis credentials in environment variables');
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
});

/**
 * Cache helper functions
 */
export const cache = {
  /**
   * Get cached value
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redis.get<T>(key);
      return value;
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  },

  /**
   * Set cached value with optional expiration
   * @param key - Cache key
   * @param value - Value to cache
   * @param expirationSeconds - TTL in seconds (default: 7 days)
   */
  async set<T>(key: string, value: T, expirationSeconds: number = 604800): Promise<void> {
    try {
      await redis.set(key, value, { ex: expirationSeconds });
    } catch (error) {
      console.error('Redis SET error:', error);
    }
  },

  /**
   * Delete cached value
   */
  async delete(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      console.error('Redis DELETE error:', error);
    }
  },

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis EXISTS error:', error);
      return false;
    }
  },
};
