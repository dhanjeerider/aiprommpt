import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { PromptCard } from "@/components/prompt-card";
import { usePosts } from "@/lib/posts";
import type { PromptPost } from "@/lib/data";

export function TaxonomyPage({
  kind,
  slug,
  title,
  intro,
}: {
  kind: "category" | "tag" | "style" | "tool";
  slug: string;
  title: string;
  intro: string;
}) {
  const [sort, setSort] = useState<"popular" | "latest">("popular");
  const posts = usePosts();

  const filtered: PromptPost[] = useMemo(() => {
    if (!posts) return [];
    let l = posts.filter((p) => {
      if (kind === "category") return p.category === slug;
      if (kind === "tag") return (p.tags ?? []).includes(slug);
      if (kind === "style") return p.style === slug;
      if (kind === "tool") return p.tool === slug;
      return false;
    });
    if (sort === "popular") l.sort((a, b) => b.likes - a.likes);
    else l.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    return l;
  }, [posts, kind, slug, sort]);

  const categoryChips = useMemo(() => {
    if (!posts) return [];
    const counts = new Map<string, number>();
    posts.forEach((p) => p.category && counts.set(p.category, (counts.get(p.category) ?? 0) + 1));
    return [...counts.keys()].slice(0, 10);
  }, [posts]);

  return (
    <PageShell>
      <header className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium capitalize text-muted-foreground">
          {kind}
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="gradient-text capitalize">{title.replace(/-/g, " ")}</span>
        </h1>
        <p className="mt-4 text-muted-foreground">{intro}</p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_260px]">
        <div>
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {posts === null ? "Loading…" : `${filtered.length} prompt${filtered.length === 1 ? "" : "s"}`}
            </p>
            <div className="glass-card inline-flex rounded-full p-1">
              {(["popular", "latest"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSort(s)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition ${
                    sort === s
                      ? "bg-[image:var(--gradient-primary)] text-white"
                      : "text-muted-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {posts === null ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] animate-pulse rounded-3xl bg-white/5" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="glass-card rounded-3xl p-10 text-center">
              <h3 className="text-lg font-semibold">Nothing here yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We're curating this collection — check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p, i) => (
                <PromptCard key={p.slug} p={p} index={i} />
              ))}
            </div>
          )}
        </div>

        <aside className="hidden lg:block">
          <div className="glass-card sticky top-28 rounded-3xl p-5">
            <h3 className="text-sm font-semibold">Explore more</h3>
            {categoryChips.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Categories</p>
                <div className="flex flex-wrap gap-1.5">
                  {categoryChips.map((c) => (
                    <Link
                      key={c}
                      to="/category/$slug"
                      params={{ slug: c }}
                      className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs capitalize text-muted-foreground hover:bg-white/10 hover:text-foreground"
                    >
                      {c.replace(/-/g, " ")}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
