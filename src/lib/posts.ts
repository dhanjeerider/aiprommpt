import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { PromptPost } from "./data";
import { cleanTags } from "./tags";

export type PostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content_prompt: string | null;
  extra_prompts: string[] | null;
  featured_image: string | null;
  extra_images: string[] | null;
  prompt_images: string[] | null;
  category: string | null;
  library_slug: string | null;
  tags: string[] | null;
  tool: string | null;
  style: string | null;
  author_name: string | null;
  premium: boolean | null;
  likes: number | null;
  saves: number | null;
  copies: number | null;
  rating: number | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type AppPost = PromptPost & { extraPrompts: string[]; promptImages: string[] };

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((s) => s[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function rowToPost(r: PostRow): AppPost {
  const authorName = r.author_name ?? "PromptPalette";
  return {
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt ?? "",
    content: r.content_prompt ?? "",
    extraPrompts: (r.extra_prompts ?? []).filter(Boolean),
    promptImages: (r.prompt_images ?? []).map((x) => x ?? ""),
    featuredImage: r.featured_image ?? "",
    category: r.category ?? "",
    tags: cleanTags(r.tags),
    tool: r.tool ?? "",
    style: r.style ?? "",
    author: {
      id: r.id,
      name: authorName,
      handle: authorName.toLowerCase().replace(/[^a-z0-9]+/g, ""),
      avatar: initials(authorName),
    },
    likes: r.likes ?? 0,
    copies: r.copies ?? 0,
    rating: r.rating ?? 4.8,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    relatedSlugs: [],
    premium: !!r.premium,
  };
}


export function usePosts() {
  const [posts, setPosts] = useState<AppPost[] | null>(null);
  useEffect(() => {
    let alive = true;
    supabase
      .from("posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!alive) return;
        setPosts(((data ?? []) as PostRow[]).map(rowToPost));
      });
    return () => {
      alive = false;
    };
  }, []);
  return posts;
}

export function usePostBySlug(slug: string) {
  const [state, setState] = useState<{ post: AppPost | null; loading: boolean }>({
    post: null,
    loading: true,
  });
  useEffect(() => {
    let alive = true;
    setState({ post: null, loading: true });
    supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle()
      .then(({ data }) => {
        if (!alive) return;
        setState({ post: data ? rowToPost(data as PostRow) : null, loading: false });
      });
    return () => {
      alive = false;
    };
  }, [slug]);
  return state;
}
