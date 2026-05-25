-- Supabase Schema for CelebrateNear
-- Run this in your Supabase SQL Editor

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  receiver_name TEXT NOT NULL,
  receiver_email TEXT,
  event_date DATE NOT NULL,
  story TEXT,
  theme_config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create memories table
CREATE TABLE IF NOT EXISTS public.memories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  contributor_name TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('text', 'image', 'video', 'voice')),
  media_url TEXT,
  text_content TEXT,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read and update their own profile
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Events: Users can create and read their own events
CREATE POLICY "Users can insert own events" ON public.events FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Users can read own events" ON public.events FOR SELECT USING (auth.uid() = creator_id);
-- Allow public reading of events if they have the ID (for contributors)
CREATE POLICY "Anyone can read event by id" ON public.events FOR SELECT USING (true);

-- Memories: Anyone can insert (with valid event_id), but only creator can update/delete
CREATE POLICY "Anyone can insert memory" ON public.memories FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read memories" ON public.memories FOR SELECT USING (true);

-- Create important_dates table
CREATE TABLE IF NOT EXISTS public.important_dates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE public.important_dates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert own dates" ON public.important_dates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can read own dates" ON public.important_dates FOR SELECT USING (true);

-- Create nearyou_bookings table for cross-device bookings sync
CREATE TABLE IF NOT EXISTS public.nearyou_bookings (
  id TEXT PRIMARY KEY,
  "recipientName" TEXT,
  "targetDate" TEXT,
  message TEXT,
  location TEXT,
  budget TEXT,
  "whatsappNumber" TEXT,
  "recipientEmail" TEXT,
  "extraText1" TEXT,
  "extraSelect1" TEXT,
  "surpriseTitle" TEXT,
  "surpriseType" TEXT,
  price NUMERIC,
  "paymentMethod" TEXT,
  "utrNumber" TEXT,
  "paymentScreenshot" TEXT,
  "appliedDiscountCode" TEXT,
  status TEXT,
  "createdAt" TEXT
);

-- Enable RLS Policies on nearyou_bookings
ALTER TABLE public.nearyou_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert booking" ON public.nearyou_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read bookings" ON public.nearyou_bookings FOR SELECT USING (true);
CREATE POLICY "Anyone can update bookings" ON public.nearyou_bookings FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete bookings" ON public.nearyou_bookings FOR DELETE USING (true);

-- Create nearyou_all_users table for cross-device users sync
CREATE TABLE IF NOT EXISTS public.nearyou_all_users (
  id TEXT PRIMARY KEY,
  "fullName" TEXT,
  phone TEXT
);

-- Enable RLS Policies on nearyou_all_users
ALTER TABLE public.nearyou_all_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert user" ON public.nearyou_all_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read users" ON public.nearyou_all_users FOR SELECT USING (true);
CREATE POLICY "Anyone can delete users" ON public.nearyou_all_users FOR DELETE USING (true);
