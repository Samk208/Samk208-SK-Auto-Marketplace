/**
 * AI Description Generation API Route
 *
 * POST /api/ai/generate-description
 * Generates multilingual car descriptions using Gemini AI
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { geminiModel, geminiFlashModel, withRetry, withTimeout } from '@/lib/ai/gemini';
import { generateDescriptionSchema } from '@/lib/validations/ai';
import { aiRateLimiter } from '@/lib/ratelimit';
import { redis } from '@/lib/ratelimit';

/**
 * Generate cache key for description
 */
function getCacheKey(make: string, model: string, year: number): string {
  return `ai:description:${make.toLowerCase()}:${model.toLowerCase()}:${year}`;
}

/**
 * POST /api/ai/generate-description
 * Generate multilingual car descriptions
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

    // Check user role (only sellers can generate descriptions)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || profile.role !== 'seller') {
      return NextResponse.json(
        { error: 'Forbidden - seller role required' },
        { status: 403 }
      );
    }

    // Rate limiting
    const { success, remaining, reset } = await aiRateLimiter.limit(user.id);
    if (!success) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Please try again later.',
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
    const validationResult = generateDescriptionSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const input = validationResult.data;

    // Check cache first
    const cacheKey = getCacheKey(input.make, input.model, input.year);
    const cached = await redis.get(cacheKey);

    if (cached && typeof cached === 'object') {
      return NextResponse.json(
        {
          descriptions: cached,
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

    // Build comprehensive prompt
    const prompt = `You are an expert automotive copywriter creating professional vehicle listings for an international marketplace connecting Korean car exporters with African buyers.

Generate a compelling, factual, and trustworthy car description in 4 languages: English (en), Korean (ko), French (fr), and Swahili (sw).

Vehicle Details:
- Make: ${input.make}
- Model: ${input.model}
- Year: ${input.year}
${input.mileage ? `- Mileage: ${input.mileage.toLocaleString()} km` : ''}
${input.transmission ? `- Transmission: ${input.transmission}` : ''}
${input.fuel_type ? `- Fuel Type: ${input.fuel_type}` : ''}
${input.body_type ? `- Body Type: ${input.body_type}` : ''}
${input.color ? `- Color: ${input.color}` : ''}
${input.condition ? `- Condition: ${input.condition}` : ''}
${input.features && input.features.length > 0 ? `- Features: ${input.features.join(', ')}` : ''}

Requirements:
1. Each description should be 150-250 words
2. Professional, trustworthy, and factual tone
3. Highlight key features, reliability, and value
4. NO exaggerations or false claims
5. Appeal to African market (mention durability, fuel efficiency, practicality)
6. Mention suitability for local roads/conditions if relevant
7. Use proper automotive terminology
8. Be culturally appropriate for all target audiences

Output Format:
Return ONLY a JSON object with this exact structure (no markdown formatting):
{
  "en": "English description here...",
  "ko": "Korean description here...",
  "fr": "French description here...",
  "sw": "Swahili description here..."
}`;

    // Generate description with retry and timeout
    let descriptions: Record<string, string>;
    try {
      const result = await withTimeout(
        withRetry(async () => {
          const response = await geminiModel.generateContent(prompt);
          return response.response.text();
        }),
        30000 // 30 second timeout
      );

      // Parse JSON response
      const cleanResponse = result
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      descriptions = JSON.parse(cleanResponse);

      // Validate all languages present
      const requiredLangs = ['en', 'ko', 'fr', 'sw'];
      for (const lang of requiredLangs) {
        if (!descriptions[lang] || descriptions[lang].length < 100) {
          throw new Error(`Invalid or missing ${lang} description`);
        }
      }
    } catch (primaryError) {
      console.error('Primary model failed, trying fallback:', primaryError);

      // Try fallback model
      try {
        const result = await withTimeout(
          withRetry(async () => {
            const response = await geminiFlashModel.generateContent(prompt);
            return response.response.text();
          }),
          30000
        );

        const cleanResponse = result
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();

        descriptions = JSON.parse(cleanResponse);

        // Validate all languages present
        const requiredLangs = ['en', 'ko', 'fr', 'sw'];
        for (const lang of requiredLangs) {
          if (!descriptions[lang] || descriptions[lang].length < 100) {
            throw new Error(`Invalid or missing ${lang} description`);
          }
        }
      } catch (fallbackError) {
        console.error('Both models failed:', fallbackError);
        return NextResponse.json(
          {
            error: 'Failed to generate description. Please try again.',
          },
          { status: 500 }
        );
      }
    }

    // Cache for 30 days (similar cars often searched)
    await redis.set(cacheKey, descriptions, { ex: 2592000 });

    return NextResponse.json(
      {
        descriptions,
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
    console.error('AI description generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
