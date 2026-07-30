ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS footer_links jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS premium_note text;

ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS prompt_images text[] NOT NULL DEFAULT '{}'::text[];