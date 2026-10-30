-- DevTrack Supabase Schema
-- Run this script in your Supabase project's SQL Editor (Dashboard -> SQL Editor -> New query)

-- 1. Create the user_data table to store user goals, progress, projects, jobs, and activity
CREATE TABLE IF NOT EXISTS public.user_data (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.user_data ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies if re-running
DROP POLICY IF EXISTS "Users can view their own data" ON public.user_data;
DROP POLICY IF EXISTS "Users can insert their own data" ON public.user_data;
DROP POLICY IF EXISTS "Users can update their own data" ON public.user_data;
DROP POLICY IF EXISTS "Users can delete their own data" ON public.user_data;

-- 4. RLS Policies: ensure authenticated users can only access and modify their own row
CREATE POLICY "Users can view their own data"
  ON public.user_data
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own data"
  ON public.user_data
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own data"
  ON public.user_data
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own data"
  ON public.user_data
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

