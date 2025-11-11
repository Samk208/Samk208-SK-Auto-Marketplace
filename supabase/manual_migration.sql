-- =============================================
-- SK AutoSphere - Complete Migration Script
-- =============================================
-- Run this script directly in Supabase SQL Editor
-- Dashboard: https://supabase.com/dashboard/project/teyloksuvmmhqixjqoch/editor

-- Step 1: Fix existing enum type
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'car_status') THEN
        -- Remove default value first
        ALTER TABLE IF EXISTS public.cars ALTER COLUMN status DROP DEFAULT;
        -- Convert column to TEXT
        ALTER TABLE IF EXISTS public.cars ALTER COLUMN status TYPE TEXT;
        -- Now we can drop the enum type
        DROP TYPE IF EXISTS car_status;
    END IF;
END $$;

-- Step 2: Ensure cars table has correct status constraint and default
ALTER TABLE IF EXISTS public.cars
DROP CONSTRAINT IF EXISTS cars_status_check;

ALTER TABLE IF EXISTS public.cars
ADD CONSTRAINT cars_status_check CHECK (
    status IN (
        'draft',
        'published',
        'sold',
        'archived'
    )
);

-- Set default value back
ALTER TABLE IF EXISTS public.cars
ALTER COLUMN status
SET DEFAULT 'draft';

-- Update old status values
UPDATE public.cars
SET
    status = 'published'
WHERE
    status NOT IN(
        'draft',
        'published',
        'sold',
        'archived'
    );

-- Step 3: Add missing profile fields
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS language_preference TEXT DEFAULT 'en' CHECK (
    language_preference IN ('en', 'ko', 'fr', 'sw')
),
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified' CHECK (
    verification_status IN (
        'unverified',
        'pending',
        'verified',
        'rejected'
    )
),
ADD COLUMN IF NOT EXISTS seller_rating NUMERIC(3, 2) DEFAULT 0 CHECK (
    seller_rating >= 0
    AND seller_rating <= 5
),
ADD COLUMN IF NOT EXISTS business_name TEXT,
ADD COLUMN IF NOT EXISTS business_registration TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

-- Step 4: Add missing car fields
ALTER TABLE public.cars
ADD COLUMN IF NOT EXISTS description_en TEXT,
ADD COLUMN IF NOT EXISTS description_fr TEXT,
ADD COLUMN IF NOT EXISTS description_sw TEXT,
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS inquiry_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_generated BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS shipping_available BOOLEAN DEFAULT true;

-- Step 5: Create conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    car_id UUID REFERENCES public.cars (id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
    last_message_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (car_id, buyer_id, seller_id)
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Step 6: Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    conversation_id UUID NOT NULL REFERENCES public.conversations (id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    content_translated TEXT,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Step 7: Create favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
    car_id UUID NOT NULL REFERENCES public.cars (id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, car_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Step 8: Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_country ON public.profiles (country);

CREATE INDEX IF NOT EXISTS idx_profiles_verification ON public.profiles (verification_status);

CREATE INDEX IF NOT EXISTS idx_cars_featured ON public.cars (featured)
WHERE
    featured = true;

CREATE INDEX IF NOT EXISTS idx_cars_view_count ON public.cars (view_count DESC);

CREATE INDEX IF NOT EXISTS idx_conversations_buyer ON public.conversations (buyer_id);

CREATE INDEX IF NOT EXISTS idx_conversations_seller ON public.conversations (seller_id);

CREATE INDEX IF NOT EXISTS idx_conversations_car ON public.conversations (car_id);

CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON public.conversations (last_message_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages (conversation_id);

CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages (sender_id);

CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites (user_id);

CREATE INDEX IF NOT EXISTS idx_favorites_car ON public.favorites (car_id);

CREATE INDEX IF NOT EXISTS idx_favorites_created_at ON public.favorites (created_at DESC);

-- Step 9: RLS Policies for conversations
DROP POLICY IF EXISTS "Users can view their own conversations" ON public.conversations;

CREATE POLICY "Users can view their own conversations" ON public.conversations FOR
SELECT USING (
        auth.uid () = buyer_id
        OR auth.uid () = seller_id
    );

DROP POLICY IF EXISTS "Buyers can create conversations" ON public.conversations;

CREATE POLICY "Buyers can create conversations" ON public.conversations FOR
INSERT
WITH
    CHECK (auth.uid () = buyer_id);

-- Step 10: RLS Policies for messages
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;

CREATE POLICY "Users can view messages in their conversations" ON public.messages FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM public.conversations
            WHERE
                id = conversation_id
                AND (
                    buyer_id = auth.uid ()
                    OR seller_id = auth.uid ()
                )
        )
    );

DROP POLICY IF EXISTS "Users can send messages in their conversations" ON public.messages;

CREATE POLICY "Users can send messages in their conversations" ON public.messages FOR
INSERT
WITH
    CHECK (
        sender_id = auth.uid ()
        AND EXISTS (
            SELECT 1
            FROM public.conversations
            WHERE
                id = conversation_id
                AND (
                    buyer_id = auth.uid ()
                    OR seller_id = auth.uid ()
                )
        )
    );

DROP POLICY IF EXISTS "Users can update their own messages" ON public.messages;

CREATE POLICY "Users can update their own messages" ON public.messages FOR
UPDATE USING (sender_id = auth.uid ());

-- Step 11: RLS Policies for favorites
DROP POLICY IF EXISTS "Users can view their own favorites" ON public.favorites;

CREATE POLICY "Users can view their own favorites" ON public.favorites FOR
SELECT USING (auth.uid () = user_id);

DROP POLICY IF EXISTS "Users can add favorites" ON public.favorites;

CREATE POLICY "Users can add favorites" ON public.favorites FOR
INSERT
WITH
    CHECK (auth.uid () = user_id);

DROP POLICY IF EXISTS "Users can remove their own favorites" ON public.favorites;

CREATE POLICY "Users can remove their own favorites" ON public.favorites FOR DELETE USING (auth.uid () = user_id);

-- Step 12: Create/update functions
CREATE OR REPLACE FUNCTION public.increment_car_views(car_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.cars
  SET view_count = view_count + 1
  WHERE id = car_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_new_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_message_created ON public.messages;

CREATE TRIGGER on_message_created
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_message();

CREATE OR REPLACE FUNCTION public.handle_new_conversation()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.cars
  SET inquiry_count = inquiry_count + 1
  WHERE id = NEW.car_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_conversation_created ON public.conversations;

CREATE TRIGGER on_conversation_created
  AFTER INSERT ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_conversation();

-- Done!
SELECT 'Migration completed successfully!' AS status;