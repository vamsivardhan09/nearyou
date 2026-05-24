-- ============================================================
-- Nearyou – Supabase Schema
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- ── profiles ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name   TEXT,
  email       TEXT,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ── events ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.events (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id      UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type      TEXT NOT NULL,
  receiver_name   TEXT NOT NULL,
  receiver_email  TEXT,
  event_date      DATE NOT NULL,
  story           TEXT,
  theme_config    JSONB DEFAULT '{}'::jsonb,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ── memories ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.memories (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id          UUID REFERENCES public.events(id) ON DELETE CASCADE,
  contributor_name  TEXT NOT NULL,
  media_type        TEXT NOT NULL CHECK (media_type IN ('text', 'image', 'video', 'voice')),
  media_url         TEXT,
  text_content      TEXT,
  is_approved       BOOLEAN DEFAULT true,
  created_at        TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ── important_dates ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.important_dates (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  date       DATE NOT NULL,
  type       TEXT NOT NULL DEFAULT 'other',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================================
-- AUTO-CREATE PROFILE ON FIRST SIGN-IN
-- Supabase fires this trigger whenever a new auth.user is created
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists, then recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.important_dates ENABLE ROW LEVEL SECURITY;

-- profiles
DROP POLICY IF EXISTS "Users can read own profile"   ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"   ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- events
DROP POLICY IF EXISTS "Users can insert own events" ON public.events;
DROP POLICY IF EXISTS "Users can read own events"   ON public.events;
DROP POLICY IF EXISTS "Anyone can read event by id" ON public.events;
CREATE POLICY "Users can insert own events" ON public.events FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Users can read own events"   ON public.events FOR SELECT USING (auth.uid() = creator_id);
CREATE POLICY "Anyone can read event by id" ON public.events FOR SELECT USING (true);

-- memories
DROP POLICY IF EXISTS "Anyone can insert memory"  ON public.memories;
DROP POLICY IF EXISTS "Anyone can read memories"  ON public.memories;
CREATE POLICY "Anyone can insert memory" ON public.memories FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read memories" ON public.memories FOR SELECT USING (true);

-- important_dates
DROP POLICY IF EXISTS "Users can insert own dates" ON public.important_dates;
DROP POLICY IF EXISTS "Users can read own dates"   ON public.important_dates;
CREATE POLICY "Users can insert own dates" ON public.important_dates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can read own dates"   ON public.important_dates FOR SELECT  USING (auth.uid() = user_id);
