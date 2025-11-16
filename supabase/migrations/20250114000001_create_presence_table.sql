-- =============================================
-- Create Presence Table
-- =============================================
-- Created: 2025-01-14
-- Description: User online/offline status tracking for real-time messaging

-- =============================================
-- 1. PRESENCE TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.presence (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  online BOOLEAN NOT NULL DEFAULT false,
  last_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.presence ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view presence"
  ON public.presence FOR SELECT
  USING (true);

CREATE POLICY "Users can update own presence"
  ON public.presence FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own presence status"
  ON public.presence FOR UPDATE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_presence_online ON public.presence(online) WHERE online = true;
CREATE INDEX idx_presence_last_seen ON public.presence(last_seen DESC);

-- =============================================
-- 2. AUTO-UPDATE TRIGGER
-- =============================================
CREATE OR REPLACE FUNCTION public.update_presence_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_presence_updated
  BEFORE UPDATE ON public.presence
  FOR EACH ROW
  EXECUTE FUNCTION public.update_presence_timestamp();

-- Comments
COMMENT ON TABLE public.presence IS 'Tracks user online/offline status for real-time features';
COMMENT ON COLUMN public.presence.online IS 'Current online status (updated via heartbeat)';
COMMENT ON COLUMN public.presence.last_seen IS 'Last activity timestamp';
