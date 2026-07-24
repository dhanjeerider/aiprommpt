import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { PageShell } from "@/components/page-shell";
import { usePosts } from "@/lib/posts";

export const Route = createFileRoute("/libraries")({
  component: LibrariesPage,
  head: () => ({
    meta: [
      { title: "Prompt Categories — PromptPalette" },
      { name: "description", content: "Browse every prompt collection by category." },
      { property: "og:title", content: "Prompt Categories" },
      { property: "og:description", content: "Every AI prompt collection, by category." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/libraries" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/libraries" }],
  }),
});

function LibrariesPage() {
  const posts = usePosts();

  const categories = useMemo(() => {
    if (!posts) return [];
    const map = new Map<string, { slug: string; count: number; cover: string }>();
    posts.forEach((p) => {
      if (!p.category) return;
      const cur = map.get(p.category);
      if (cur) cur.count += 1;
      else map.set(p.category, { slug: p.category, count: 1, cover: p.featuredImage });
    });
    return [...map.values()].sort((a, b) => b.count - a.count);
  }, [posts]);

  return (
    <PageShell>
      <header className="max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Prompt <span className="gradient-text">categories</span>
        </h1>
        <p className="mt-4 text-muted-foreground">
          Every AI photo editing prompt on the site, grouped by category.
        </p>
      </header>

      {posts === null ? (
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] animate-pulse rounded-3xl bg-white/5" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="glass-card mt-10 rounded-3xl p-10 text-center">
          <h3 className="text-lg font-semibold">No categories yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">Add posts from the admin — categories appear automatically.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="hover-lift group relative overflow-hidden rounded-3xl border border-white/10 bg-card"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={c.cover} alt={c.slug} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-x-3 bottom-3 flex items-end justify-between text-white">
                  <div className="text-sm font-black capitalize drop-shadow">{c.slug.replace(/-/g, " ")}</div>
                  <div className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-black text-slate-900">
                    {c.count}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </PageShell>
  );
}
