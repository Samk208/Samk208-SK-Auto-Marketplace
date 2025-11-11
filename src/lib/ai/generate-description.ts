/**
 * AI Car Description Generator
 * Uses Google Gemini to generate professional car descriptions in 4 languages
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import stableStringify from 'json-stable-stringify';
import { cache } from '../cache/redis';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY environment variable');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export interface CarData {
  make: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  fuelType?: string;
  transmission?: string;
  condition?: string;
  features?: string[];
}

export interface CarDescriptions {
  en: string;
  ko: string;
  fr: string;
  sw: string;
}

/**
 * Generate professional car descriptions in 4 languages
 * Results are cached for 7 days to reduce API costs
 */
export async function generateCarDescription(
  carData: CarData
): Promise<CarDescriptions> {
  // Create deterministic cache key from car data
  const cacheKey = `car-desc:${stableStringify(carData)}`;

  // Check cache first
  const cached = await cache.get<CarDescriptions>(cacheKey);
  if (cached) {
    console.log('✅ Using cached car description');
    return cached;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `You are an expert automotive copywriter specializing in Korean car export listings for African markets.

Generate professional vehicle descriptions in 4 languages: Korean (ko), English (en), French (fr), and Swahili (sw).

Vehicle Details:
- Make: ${carData.make}
- Model: ${carData.model}
- Year: ${carData.year}
- Mileage: ${carData.mileage.toLocaleString()} km
- Price: $${carData.price.toLocaleString()} FOB
${carData.fuelType ? `- Fuel Type: ${carData.fuelType}` : ''}
${carData.transmission ? `- Transmission: ${carData.transmission}` : ''}
${carData.condition ? `- Condition: ${carData.condition}` : ''}
${carData.features && carData.features.length > 0 ? `- Features: ${carData.features.join(', ')}` : ''}

Requirements:
1. Write 2-3 paragraphs (120-180 words per language)
2. Highlight vehicle condition, key features, and value proposition
3. Emphasize suitability for African markets (durability, fuel efficiency, reliability)
4. Use professional but conversational tone
5. NO marketing hyperbole or exaggerations
6. Include year, make, model in the first sentence
7. Mention FOB price and competitive value
8. Focus on practical benefits for buyers

Tone Guidelines:
- Korean (ko): Professional, respectful, detail-oriented
- English (en): Clear, professional, benefit-focused
- French (fr): Elegant, professional, emphasizing quality
- Swahili (sw): Warm, professional, emphasizing reliability

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "ko": "Korean description here...",
  "en": "English description here...",
  "fr": "French description here...",
  "sw": "Swahili description here..."
}`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000,
        topP: 0.9,
        topK: 40,
      },
    });

    const text = result.response.text();

    // Clean up response (remove markdown code blocks if present)
    const cleanedText = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    // Parse JSON response
    const descriptions: CarDescriptions = JSON.parse(cleanedText);

    // Validate response has all required languages
    if (!descriptions.en || !descriptions.ko || !descriptions.fr || !descriptions.sw) {
      throw new Error('AI response missing required language fields');
    }

    // Validate minimum length (at least 50 characters per language)
    Object.entries(descriptions).forEach(([lang, desc]) => {
      if (desc.length < 50) {
        throw new Error(`Description for ${lang} is too short`);
      }
    });

    // Cache for 7 days (604800 seconds)
    await cache.set(cacheKey, descriptions, 604800);

    console.log('✅ Generated new car descriptions via AI');
    return descriptions;

  } catch (error) {
    console.error('❌ AI description generation failed:', error);

    // Return fallback descriptions if AI fails
    return generateFallbackDescriptions(carData);
  }
}

/**
 * Fallback descriptions if AI generation fails
 */
function generateFallbackDescriptions(carData: CarData): CarDescriptions {
  const basicInfo = `${carData.year} ${carData.make} ${carData.model}`;

  return {
    en: `${basicInfo} with ${carData.mileage.toLocaleString()} km. This reliable vehicle is available for $${carData.price.toLocaleString()} FOB. Well-maintained and ready for export. Contact us for detailed specifications and shipping options.`,

    ko: `${basicInfo}, 주행거리 ${carData.mileage.toLocaleString()}km. FOB 가격 $${carData.price.toLocaleString()}에 제공됩니다. 잘 관리된 차량으로 수출 준비가 완료되었습니다. 자세한 사양 및 배송 옵션은 문의해 주세요.`,

    fr: `${basicInfo} avec ${carData.mileage.toLocaleString()} km. Ce véhicule fiable est disponible pour $${carData.price.toLocaleString()} FOB. Bien entretenu et prêt pour l'exportation. Contactez-nous pour les spécifications détaillées et les options d'expédition.`,

    sw: `${basicInfo} na ${carData.mileage.toLocaleString()} km. Gari hili la kuaminika linapatikana kwa $${carData.price.toLocaleString()} FOB. Limetunzwa vizuri na liko tayari kwa usafirishaji. Wasiliana nasi kwa maelezo kamili na chaguo za usafirishaji.`,
  };
}

/**
 * Clear cached description for a car
 */
export async function clearCarDescriptionCache(carData: CarData): Promise<void> {
  const cacheKey = `car-desc:${stableStringify(carData)}`;
  await cache.delete(cacheKey);
}
