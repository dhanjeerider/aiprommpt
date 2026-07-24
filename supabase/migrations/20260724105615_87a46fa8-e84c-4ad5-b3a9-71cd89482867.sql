
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

-- Update timestamp helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Libraries
CREATE TABLE public.libraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  cover_image TEXT,
  cover_gradient TEXT,
  prompt_count INT NOT NULL DEFAULT 0,
  tags TEXT[] NOT NULL DEFAULT '{}',
  published BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.libraries TO anon, authenticated;
GRANT ALL ON public.libraries TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.libraries TO authenticated;
ALTER TABLE public.libraries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read libraries" ON public.libraries FOR SELECT USING (published = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin write libraries" ON public.libraries FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_libraries_updated BEFORE UPDATE ON public.libraries FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Posts (prompts)
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  content_prompt TEXT NOT NULL DEFAULT '',
  featured_image TEXT NOT NULL DEFAULT '',
  extra_images TEXT[] NOT NULL DEFAULT '{}',
  category TEXT,
  library_slug TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  tool TEXT,
  style TEXT,
  author_name TEXT NOT NULL DEFAULT 'PromptPalette',
  premium BOOLEAN NOT NULL DEFAULT false,
  likes INT NOT NULL DEFAULT 0,
  saves INT NOT NULL DEFAULT 0,
  copies INT NOT NULL DEFAULT 0,
  rating NUMERIC(3,2) NOT NULL DEFAULT 5.0,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.posts TO anon, authenticated;
GRANT ALL ON public.posts TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.posts TO authenticated;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read posts" ON public.posts FOR SELECT USING (published = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin write posts" ON public.posts FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_posts_updated BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Static pages
CREATE TABLE public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  body_md TEXT NOT NULL DEFAULT '',
  seo_title TEXT,
  seo_description TEXT,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pages TO anon, authenticated;
GRANT ALL ON public.pages TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.pages TO authenticated;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read pages" ON public.pages FOR SELECT USING (published = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin write pages" ON public.pages FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_pages_updated BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Site settings (single row)
CREATE TABLE public.site_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  site_title TEXT NOT NULL DEFAULT 'PromptPalette',
  site_tagline TEXT NOT NULL DEFAULT 'AI Photo Editing Prompts',
  hero_title TEXT NOT NULL DEFAULT 'AI Photo Editing Prompts',
  hero_gradient_text TEXT NOT NULL DEFAULT 'Gemini & ChatGPT',
  hero_subtitle TEXT NOT NULL DEFAULT 'Copy, paste, and generate stunning Images in seconds.',
  popular_tags TEXT[] NOT NULL DEFAULT ARRAY['Men','Woman','Couple','Family','Birthday'],
  logo_url TEXT,
  favicon_url TEXT,
  adsense_client TEXT,
  ad_slot_grid TEXT,
  ad_slot_detail TEXT,
  ad_slot_sidebar TEXT,
  upi_id TEXT,
  upi_qr_url TEXT,
  premium_price TEXT DEFAULT '499',
  premium_currency TEXT DEFAULT 'INR',
  analytics_gtag TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT ALL ON public.site_settings TO service_role;
GRANT UPDATE ON public.site_settings TO authenticated;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "admin update settings" ON public.site_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_settings_updated BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
INSERT INTO public.site_settings (id) VALUES (1);

-- Likes and saves per user (for logged in). Anonymous uses localStorage on client.
CREATE TABLE public.post_likes (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, post_id)
);
GRANT SELECT, INSERT, DELETE ON public.post_likes TO authenticated;
GRANT ALL ON public.post_likes TO service_role;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own likes read" ON public.post_likes FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own likes write" ON public.post_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own likes delete" ON public.post_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.post_saves (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, post_id)
);
GRANT SELECT, INSERT, DELETE ON public.post_saves TO authenticated;
GRANT ALL ON public.post_saves TO service_role;
ALTER TABLE public.post_saves ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own saves read" ON public.post_saves FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own saves write" ON public.post_saves FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own saves delete" ON public.post_saves FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Premium payment submissions (UPI screenshot + UTR)
CREATE TABLE public.premium_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  utr TEXT NOT NULL,
  screenshot_url TEXT NOT NULL,
  amount TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.premium_orders TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.premium_orders TO authenticated;
GRANT ALL ON public.premium_orders TO service_role;
ALTER TABLE public.premium_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can submit order" ON public.premium_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "admin read orders" ON public.premium_orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin') OR auth.uid() = user_id);
CREATE POLICY "admin update orders" ON public.premium_orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin delete orders" ON public.premium_orders FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON public.premium_orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-promote first user to admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count INT;
BEGIN
  SELECT count(*) INTO user_count FROM auth.users;
  IF user_count = 1 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
