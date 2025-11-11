-- =============================================
-- Add Missing Fields to Profiles Table
-- =============================================
-- Created: 2025-01-09
-- Description: Enhance profiles with language, location, verification, and seller info

-- Add new columns to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS language_preference TEXT DEFAULT 'en' CHECK (language_preference IN ('en', 'ko', 'fr', 'sw')),
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
ADD COLUMN IF NOT EXISTS seller_rating NUMERIC(3, 2) DEFAULT 0 CHECK (seller_rating >= 0 AND seller_rating <= 5),
ADD COLUMN IF NOT EXISTS business_name TEXT,
ADD COLUMN IF NOT EXISTS business_registration TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Create index on country for filtering
CREATE INDEX IF NOT EXISTS idx_profiles_country ON public.profiles(country);

-- Create index on verification status
CREATE INDEX IF NOT EXISTS idx_profiles_verification ON public.profiles(verification_status);

-- Comments for documentation
COMMENT ON COLUMN public.profiles.language_preference IS 'UI language: en, ko, fr, sw';
COMMENT ON COLUMN public.profiles.country IS 'User country (ISO code or name)';
COMMENT ON COLUMN public.profiles.phone_number IS 'Contact phone number with country code';
COMMENT ON COLUMN public.profiles.verification_status IS 'KYC verification level';
COMMENT ON COLUMN public.profiles.seller_rating IS 'Average rating from 0 to 5';
COMMENT ON COLUMN public.profiles.business_name IS 'Business/dealership name (for sellers)';
COMMENT ON COLUMN public.profiles.business_registration IS 'Business registration number';
