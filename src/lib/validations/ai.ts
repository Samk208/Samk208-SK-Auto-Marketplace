/**
 * Zod Validation Schemas for AI Features
 *
 * This module defines runtime validation schemas for:
 * - AI description generation
 * - Real-time translation
 * - Image analysis (future)
 */

import { z } from 'zod';

/**
 * Supported languages for translation and description
 */
export const SUPPORTED_LANGUAGES = ['en', 'ko', 'fr', 'sw'] as const;
export const languageSchema = z.enum(SUPPORTED_LANGUAGES);
export type Language = z.infer<typeof languageSchema>;

/**
 * Schema for AI description generation request
 */
export const generateDescriptionSchema = z.object({
  make: z.string().min(1, 'Make is required').max(50),
  model: z.string().min(1, 'Model is required').max(50),
  year: z
    .number()
    .int()
    .min(1990, 'Year must be 1990 or later')
    .max(new Date().getFullYear() + 1, 'Year cannot be in the future'),
  mileage: z
    .number()
    .int()
    .nonnegative('Mileage cannot be negative')
    .optional(),
  transmission: z
    .enum(['automatic', 'manual'])
    .optional(),
  fuel_type: z
    .enum(['gasoline', 'diesel', 'hybrid', 'electric'])
    .optional(),
  body_type: z
    .enum(['sedan', 'suv', 'truck', 'van', 'coupe', 'hatchback', 'wagon'])
    .optional(),
  color: z.string().max(30).optional(),
  features: z.array(z.string()).max(20).optional(),
  condition: z
    .enum(['excellent', 'good', 'fair'])
    .optional(),
  specs: z.record(z.string(), z.any()).optional(),
});

export type GenerateDescriptionInput = z.infer<typeof generateDescriptionSchema>;

/**
 * Schema for AI description generation response
 */
export const descriptionResponseSchema = z.object({
  descriptions: z.object({
    en: z.string().min(100).max(1000),
    ko: z.string().min(100).max(1000),
    fr: z.string().min(100).max(1000),
    sw: z.string().min(100).max(1000),
  }),
  cached: z.boolean().optional(),
});

export type DescriptionResponse = z.infer<typeof descriptionResponseSchema>;

/**
 * Schema for translation request
 */
export const translateSchema = z.object({
  text: z
    .string()
    .min(1, 'Text to translate is required')
    .max(5000, 'Text too long (max 5000 characters)'),
  from: languageSchema,
  to: languageSchema,
}).refine(
  data => data.from !== data.to,
  {
    message: 'Source and target languages must be different',
  }
);

export type TranslateInput = z.infer<typeof translateSchema>;

/**
 * Schema for translation response
 */
export const translationResponseSchema = z.object({
  translation: z.string(),
  from: languageSchema,
  to: languageSchema,
  cached: z.boolean().optional(),
});

export type TranslationResponse = z.infer<typeof translationResponseSchema>;

/**
 * Schema for batch translation request (for messages)
 */
export const batchTranslateSchema = z.object({
  texts: z
    .array(z.string().min(1).max(5000))
    .min(1, 'At least one text required')
    .max(10, 'Cannot translate more than 10 texts at once'),
  from: languageSchema,
  to: languageSchema,
}).refine(
  data => data.from !== data.to,
  {
    message: 'Source and target languages must be different',
  }
);

export type BatchTranslateInput = z.infer<typeof batchTranslateSchema>;

/**
 * Schema for image analysis request (Phase 2)
 */
export const analyzeImageSchema = z.object({
  image_url: z.string().url('Invalid image URL'),
  extract: z
    .array(z.enum(['make', 'model', 'color', 'damage', 'features']))
    .optional()
    .default(['make', 'model', 'color']),
});

export type AnalyzeImageInput = z.infer<typeof analyzeImageSchema>;

/**
 * Schema for image analysis response (Phase 2)
 */
export const imageAnalysisResponseSchema = z.object({
  make: z.string().optional(),
  model: z.string().optional(),
  color: z.string().optional(),
  damage: z
    .object({
      detected: z.boolean(),
      description: z.string().optional(),
      severity: z.enum(['minor', 'moderate', 'major']).optional(),
    })
    .optional(),
  features: z.array(z.string()).optional(),
  confidence: z.number().min(0).max(1),
});

export type ImageAnalysisResponse = z.infer<typeof imageAnalysisResponseSchema>;

/**
 * Helper function to validate language code
 */
export function isValidLanguage(lang: string): lang is Language {
  return SUPPORTED_LANGUAGES.includes(lang as Language);
}

/**
 * Helper function to get language name
 */
export function getLanguageName(lang: Language): string {
  const names: Record<Language, string> = {
    en: 'English',
    ko: 'Korean',
    fr: 'French',
    sw: 'Swahili',
  };
  return names[lang];
}
