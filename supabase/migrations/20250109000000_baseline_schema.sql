-- =============================================
-- SK AutoSphere - Baseline Schema Migration
-- =============================================
-- This migration captures the CURRENT state of the database
-- Created: 2025-01-09
-- Description: Initial schema with profiles and cars tables

-- Fix existing enum type if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'car_status') THEN
        ALTER TABLE IF EXISTS public.cars ALTER COLUMN status TYPE TEXT;
        DROP TYPE IF EXISTS car_status;
    END IF;
END $$;

-- =============================================
-- 1. PROFILES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    updated_at TIMESTAMPTZ,
    role TEXT CHECK (
        role IN ('buyer', 'seller', 'admin')
    )
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR
SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles FOR
UPDATE USING (auth.uid () = id);

-- =============================================
-- 2. CARS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1900 AND year <= 2030),
  price NUMERIC NOT NULL CHECK (price >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  description TEXT,
  location_country TEXT NOT NULL,
  location_city TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'sold', 'archived')),
  specifications JSONB,
  dealer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cars
CREATE POLICY "Published cars are viewable by everyone" ON public.cars FOR
SELECT USING (
        status = 'published'
        OR dealer_id = auth.uid ()
    );

CREATE POLICY "Dealers can insert their own cars" ON public.cars FOR
INSERT
WITH
    CHECK (dealer_id = auth.uid ());

CREATE POLICY "Dealers can update their own cars" ON public.cars FOR
UPDATE USING (dealer_id = auth.uid ());

CREATE POLICY "Dealers can delete their own cars" ON public.cars FOR DELETE USING (dealer_id = auth.uid ());

-- =============================================
-- 3. INDEXES for Performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_cars_dealer_id ON public.cars (dealer_id);

CREATE INDEX IF NOT EXISTS idx_cars_status ON public.cars (status);

CREATE INDEX IF NOT EXISTS idx_cars_created_at ON public.cars (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_cars_make_model ON public.cars (make, model);

-- =============================================
-- 4. TRIGGERS
-- =============================================
-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_cars
  BEFORE UPDATE ON public.cars
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- 5. FUNCTIONS
-- =============================================
-- Function to create profile automatically when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'role'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- NOTES
-- =============================================
-- This is the BASELINE migration representing current state.
-- Future migrations should add new fields/tables incrementally.
-- Run this migration if starting fresh, or skip if tables already exist.