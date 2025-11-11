-- =============================================
-- Add Missing Fields to Cars Table
-- =============================================
-- Created: 2025-01-09
-- Description: Add multilingual descriptions, analytics, and feature flags

-- Add new columns to cars
ALTER TABLE public.cars
ADD COLUMN IF NOT EXISTS description_en TEXT,
ADD COLUMN IF NOT EXISTS description_fr TEXT,
ADD COLUMN IF NOT EXISTS description_sw TEXT,
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS inquiry_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_generated BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS shipping_available BOOLEAN DEFAULT true;

-- Create index on featured for homepage queries
CREATE INDEX IF NOT EXISTS idx_cars_featured ON public.cars(featured) WHERE featured = true;

-- Create index on view_count for sorting
CREATE INDEX IF NOT EXISTS idx_cars_view_count ON public.cars(view_count DESC);

-- Comments for documentation
COMMENT ON COLUMN public.cars.description IS 'Original description (Korean)';
COMMENT ON COLUMN public.cars.description_en IS 'English translation/description';
COMMENT ON COLUMN public.cars.description_fr IS 'French translation/description';
COMMENT ON COLUMN public.cars.description_sw IS 'Swahili translation/description';
COMMENT ON COLUMN public.cars.featured IS 'Show on homepage featured section';
COMMENT ON COLUMN public.cars.view_count IS 'Number of times listing was viewed';
COMMENT ON COLUMN public.cars.inquiry_count IS 'Number of buyer inquiries';
COMMENT ON COLUMN public.cars.ai_generated IS 'Whether description was AI-generated';
COMMENT ON COLUMN public.cars.shipping_available IS 'Whether vehicle can be shipped internationally';

-- Function to increment view count
CREATE OR REPLACE FUNCTION public.increment_car_views(car_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.cars
  SET view_count = view_count + 1
  WHERE id = car_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
