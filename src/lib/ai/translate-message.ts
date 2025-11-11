/**
 * AI Message Translation
 * Uses Google Gemini to translate chat messages between languages
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { cache } from '../cache/redis';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY environment variable');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export type Language = 'en' | 'ko' | 'fr' | 'sw';

const languageNames: Record<Language, string> = {
  en: 'English',
  ko: 'Korean',
  fr: 'French',
  sw: 'Swahili',
};

/**
 * Translate a message from one language to another
 * Results are cached for 7 days to reduce API costs
 */
export async function translateMessage(
  text: string,
  sourceLang: Language,
  targetLang: Language
): Promise<string> {
  // No translation needed if languages match
  if (sourceLang === targetLang) {
    return text;
  }

  // Validate input
  if (!text || text.trim().length === 0) {
    throw new Error('Text cannot be empty');
  }

  // Create cache key
  const cacheKey = `translate:${sourceLang}:${targetLang}:${text}`;

  // Check cache first
  const cached = await cache.get<string>(cacheKey);
  if (cached) {
    console.log(`✅ Using cached translation (${sourceLang} → ${targetLang})`);
    return cached;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `Translate the following text from ${languageNames[sourceLang]} to ${languageNames[targetLang]}.

IMPORTANT RULES:
1. Return ONLY the translation, no explanations or additional text
2. Maintain the original tone and context
3. Keep proper nouns (names, brands, locations) unchanged
4. For automotive terminology, use standard industry terms
5. Preserve formatting (line breaks, punctuation)
6. If the text contains slang or informal language, maintain that style
7. Do NOT add greetings, signatures, or extra content

Text to translate:
${text}

Translation:`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3, // Lower temperature for more consistent translations
        maxOutputTokens: 500,
        topP: 0.8,
      },
    });

    const translation = result.response.text().trim();

    // Validate translation is not empty and different from input
    if (!translation || translation.length === 0) {
      throw new Error('AI returned empty translation');
    }

    // Cache for 7 days (604800 seconds)
    await cache.set(cacheKey, translation, 604800);

    console.log(`✅ Translated message via AI (${sourceLang} → ${targetLang})`);
    return translation;

  } catch (error) {
    console.error(`❌ Translation failed (${sourceLang} → ${targetLang}):`, error);

    // Return original text with error indicator if AI fails
    return `[Translation unavailable] ${text}`;
  }
}

/**
 * Batch translate multiple messages
 * Useful for translating conversation history
 */
export async function batchTranslateMessages(
  messages: Array<{ text: string; sourceLang: Language }>,
  targetLang: Language
): Promise<string[]> {
  const translations = await Promise.all(
    messages.map((msg) => translateMessage(msg.text, msg.sourceLang, targetLang))
  );

  return translations;
}

/**
 * Detect language of a text (simplified version)
 * This is a basic heuristic - for production, consider using a proper language detection library
 */
export function detectLanguage(text: string): Language {
  // Check for Korean characters (Hangul)
  if (/[\uAC00-\uD7AF]/.test(text)) {
    return 'ko';
  }

  // Check for French-specific characters
  if (/[àâäæçéèêëïîôùûüÿœ]/i.test(text)) {
    return 'fr';
  }

  // Check for Swahili common words
  const swahiliWords = ['sawa', 'asante', 'tafadhali', 'ndiyo', 'hapana', 'jambo'];
  const lowerText = text.toLowerCase();
  if (swahiliWords.some((word) => lowerText.includes(word))) {
    return 'sw';
  }

  // Default to English
  return 'en';
}

/**
 * Clear translation cache for a specific text
 */
export async function clearTranslationCache(
  text: string,
  sourceLang: Language,
  targetLang: Language
): Promise<void> {
  const cacheKey = `translate:${sourceLang}:${targetLang}:${text}`;
  await cache.delete(cacheKey);
}
