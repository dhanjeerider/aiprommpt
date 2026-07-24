-- Wipe seeded posts, keep one example
DELETE FROM public.posts;
INSERT INTO public.posts (slug, title, excerpt, content_prompt, featured_image, category, library_slug, tags, tool, author_name, premium, likes, published)
VALUES (
  'ethereal-grace-in-the-garden',
  'Ethereal Grace in the Garden',
  'Create a photorealistic, high-end editorial portrait of a beautiful woman in a soft white saree holding a bouquet of wildflowers.',
  'Create a photorealistic, high-end editorial portrait of a beautiful woman in a soft flowing white saree holding a delicate bouquet of pastel wildflowers. Setting: lush garden with pink and white blossoms, golden hour sunlight filtering through leaves. Mood: serene, ethereal, joyful. Lighting: soft warm rim light, dreamy bokeh background. Ultra-realistic, 8K, sharp facial details, natural skin texture, editorial magazine quality.',
  'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop',
  'portraits',
  'ai-art',
  ARRAY['portraits','women','fashion','realistic','editorial'],
  'gemini',
  'PromptPrime',
  false,
  6,
  true
);