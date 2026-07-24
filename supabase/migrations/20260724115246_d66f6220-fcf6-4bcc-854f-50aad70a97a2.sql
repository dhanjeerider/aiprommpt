GRANT SELECT ON public.posts TO anon, authenticated; GRANT INSERT, UPDATE, DELETE ON public.posts TO authenticated; GRANT ALL ON public.posts TO service_role;
GRANT SELECT ON public.libraries TO anon, authenticated; GRANT INSERT, UPDATE, DELETE ON public.libraries TO authenticated; GRANT ALL ON public.libraries TO service_role;
GRANT SELECT ON public.pages TO anon, authenticated; GRANT INSERT, UPDATE, DELETE ON public.pages TO authenticated; GRANT ALL ON public.pages TO service_role;
GRANT SELECT ON public.site_settings TO anon, authenticated; GRANT UPDATE ON public.site_settings TO authenticated; GRANT ALL ON public.site_settings TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.post_likes TO authenticated; GRANT ALL ON public.post_likes TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.post_saves TO authenticated; GRANT ALL ON public.post_saves TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.premium_orders TO authenticated; GRANT ALL ON public.premium_orders TO service_role;
GRANT SELECT ON public.user_roles TO authenticated; GRANT ALL ON public.user_roles TO service_role;