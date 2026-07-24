import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { PromptCard } from "@/components/prompt-card";
import { categories, prompts, styles as allStyles, tools as allTools } from "@/lib/data";
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

  const filtered: PromptPost[] = useMemo(() => {
    let l = prompts.filter((p) => {
      if (kind === "category") return p.category === slug;
      if (kind === "tag") return p.tags.includes(slug);
      if (kind === "style") return p.style === slug;
      if (kind === "tool") return p.tool === slug;
      return false;
    });
    if (sort === "popular") l.sort((a, b) => b.likes - a.likes);
    else l.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    return l;
  }, [kind, slug, sort]);

  return (
    <PageShell>
      <header className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-3 py-1 text-xs font-medium capitalize text-muted-foreground">
          {kind}
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="gradient-text">{title}</span>
        </h1>
        <p className="mt-4 text-muted-foreground">{intro}</p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_260px]">
        <div>
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filtered.length} prompt{filtered.length === 1 ? "" : "s"}
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

          {filtered.length === 0 ? (
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
            <div className="mt-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Categories</p>
              <div className="flex flex-wrap gap-1.5">
                {categories.slice(0, 6).map((c) => (
                  <Link
                    key={c.slug}
                    to="/category/$slug"
                    params={{ slug: c.slug }}
                    className="rounded-full border bg-white/60 px-2.5 py-1 text-xs capitalize hover:text-foreground"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="mt-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Styles</p>
              <div className="flex flex-wrap gap-1.5">
                {allStyles.slice(0, 6).map((s) => (
                  <Link
                    key={s.slug}
                    to="/style/$slug"
                    params={{ slug: s.slug }}
                    className="rounded-full border bg-white/60 px-2.5 py-1 text-xs hover:text-foreground"
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="mt-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Tools</p>
              <div className="flex flex-wrap gap-1.5">
                {allTools.map((t) => (
                  <Link
                    key={t.slug}
                    to="/tool/$slug"
                    params={{ slug: t.slug }}
                    className="rounded-full border bg-white/60 px-2.5 py-1 text-xs capitalize hover:text-foreground"
                  >
                    {t.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
