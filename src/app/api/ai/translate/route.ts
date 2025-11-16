/**
 * AI Translation API Route
 *
 * POST /api/ai/translate
 * Translates text between supported languages using Gemini AI
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { geminiModel, withRetry, withTimeout } from '@/lib/ai/gemini';
import { translateSchema, getLanguageName } from '@/lib/validations/ai';
import { translationRateLimiter } from '@/lib/ratelimit';
import { redis } from '@/lib/ratelimit';
import crypto from 'crypto';

/**
 * Generate cache key for translation
 */
function getCacheKey(text: string, from: string, to: string): string {
  // Use hash for long texts
  const textHash = crypto
    .createHash('sha256')
    .update(text)
    .digest('hex')
    .substring(0, 16);

  return `ai:translation:${from}:${to}:${textHash}`;
}

/**
 * POST /api/ai/translate
 * Translate text between languages
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Rate limiting
    const { success, remaining, reset } = await translationRateLimiter.limit(user.id);
    if (!success) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Please slow down.',
          remaining: 0,
          reset: new Date(reset).toISOString(),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(reset).toISOString(),
          },
        }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = translateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { text, from, to } = validationResult.data;

    // Check cache first
    const cacheKey = getCacheKey(text, from, to);
    const cached = await redis.get(cacheKey);

    if (cached && typeof cached === 'string') {
      return NextResponse.json(
        {
          translation: cached,
          from,
          to,
          cached: true,
        },
        {
          headers: {
            'X-RateLimit-Remaining': remaining.toString(),
            'X-Cache': 'HIT',
          },
        }
      );
    }

    // Build translation prompt
    const prompt = `You are a professional translator specializing in automotive and e-commerce content.

Translate the following text from ${getLanguageName(from)} to ${getLanguageName(to)}.

IMPORTANT RULES:
1. Maintain the original tone and context
2. This is for a car marketplace - use appropriate automotive terminology
3. Keep formatting (line breaks, punctuation) intact
4. Do NOT add explanations or notes
5. Output ONLY the translated text, nothing else
6. Be culturally appropriate
7. If the text contains prices or numbers, keep them as-is

Text to translate:
${text}`;

    // Translate with retry and timeout
    let translation: string;
    try {
      const result = await withTimeout(
        withRetry(async () => {
          const response = await geminiModel.generateContent(prompt);
          return response.response.text();
        }),
        10000 // 10 second timeout for translations
      );

      translation = result.trim();

      // Basic validation
      if (!translation || translation.length === 0) {
        throw new Error('Empty translation received');
      }

      // Ensure translation is not just echoing the prompt
      if (translation.toLowerCase().includes('translate') ||
          translation.toLowerCase().includes('text to translate')) {
        throw new Error('Invalid translation response');
      }
    } catch (error) {
      console.error('Translation failed:', error);
      return NextResponse.json(
        {
          error: 'Translation failed. Please try again.',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      );
    }

    // Cache for 7 days
    await redis.set(cacheKey, translation, { ex: 604800 });

    return NextResponse.json(
      {
        translation,
        from,
        to,
        cached: false,
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Remaining': remaining.toString(),
          'X-Cache': 'MISS',
        },
      }
    );
  } catch (error) {
    console.error('AI translation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
