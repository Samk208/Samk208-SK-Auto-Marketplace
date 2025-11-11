-- =============================================
-- Create Favorites Table
-- =============================================
-- Created: 2025-01-09
-- Description: Buyers can save/favorite car listings

CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  car_id UUID NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, car_id)
);

-- Enable RLS
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own favorites"
  ON public.favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
  ON public.favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own favorites"
  ON public.favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_favorites_user ON public.favorites(user_id);
CREATE INDEX idx_favorites_car ON public.favorites(car_id);
CREATE INDEX idx_favorites_created_at ON public.favorites(created_at DESC);

-- Comments
COMMENT ON TABLE public.favorites IS 'User-saved car listings for later viewing';
COMMENT ON COLUMN public.favorites.user_id IS 'User who favorited the car';
COMMENT ON COLUMN public.favorites.car_id IS 'Car that was favorited';
