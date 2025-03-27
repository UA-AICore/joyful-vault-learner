
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

-- Update activities table with target_sentences if needed
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS target_sentences JSONB DEFAULT '{}'::jsonb;

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
