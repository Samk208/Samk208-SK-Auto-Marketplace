-- =============================================
-- Update Messages Table for Translation Support
-- =============================================
-- Created: 2025-01-14
-- Description: Add JSONB column for multilingual message translations

-- =============================================
-- 1. UPDATE MESSAGES TABLE
-- =============================================

-- Drop the old content_translated column if it exists as TEXT
ALTER TABLE public.messages
  DROP COLUMN IF EXISTS content_translated;

-- Add new content_translated column as JSONB
ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS content_translated JSONB DEFAULT NULL;

-- Add is_translated flag for optimization
ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS is_translated BOOLEAN DEFAULT false;

-- Add detected language (auto-detected from content)
ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS detected_language VARCHAR(5) DEFAULT NULL;

-- =============================================
-- 2. INDEXES FOR PERFORMANCE
-- =============================================

-- Index for finding untranslated messages
CREATE INDEX IF NOT EXISTS idx_messages_untranslated
  ON public.messages(conversation_id, is_translated)
  WHERE is_translated = false;

-- GIN index for JSONB translation queries
CREATE INDEX IF NOT EXISTS idx_messages_translations
  ON public.messages USING GIN (content_translated);

-- =============================================
-- 3. UPDATE EXISTING DATA
-- =============================================

-- Set is_translated to false for all existing messages
UPDATE public.messages
SET is_translated = false
WHERE content_translated IS NULL;

-- =============================================
-- 4. COMMENTS
-- =============================================

COMMENT ON COLUMN public.messages.content_translated IS 'JSONB object containing translations: {"en": "...", "ko": "...", "fr": "...", "sw": "..."}';
COMMENT ON COLUMN public.messages.is_translated IS 'Flag indicating if message has been translated by AI';
COMMENT ON COLUMN public.messages.detected_language IS 'Auto-detected source language code (en, ko, fr, sw)';
