
-- Create tables for users
CREATE TABLE IF NOT EXISTS public.user_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TYPE user_role AS ENUM ('student', 'educator');

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES public.user_accounts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role user_role NOT NULL,
  avatar TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create materials table
CREATE TABLE IF NOT EXISTS public.materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create activities table
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  target_words TEXT[] NOT NULL DEFAULT '{}',
  target_sentences JSONB DEFAULT '{}',
  categories TEXT[] NOT NULL DEFAULT '{}',
  materials TEXT[] DEFAULT '{}',
  status TEXT NOT NULL,
  color TEXT NOT NULL,
  image_url TEXT,
  video_url TEXT,
  created_by UUID REFERENCES public.user_accounts(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes to improve query performance
CREATE INDEX IF NOT EXISTS idx_activities_categories ON public.activities USING GIN (categories);
CREATE INDEX IF NOT EXISTS idx_activities_materials ON public.activities USING GIN (materials);
CREATE INDEX IF NOT EXISTS idx_activities_target_words ON public.activities USING GIN (target_words);

-- Add example categories and materials for testing
INSERT INTO public.categories (name) VALUES 
  ('Phonics'), 
  ('Vocabulary'), 
  ('Reading Comprehension'), 
  ('Grammar'), 
  ('Writing')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.materials (name) VALUES 
  ('Flashcards'), 
  ('Worksheets'), 
  ('Interactive Games'), 
  ('Books'), 
  ('Digital Apps')
ON CONFLICT (name) DO NOTHING;
