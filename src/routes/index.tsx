import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Search, Clock, Flame, Sparkles, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PromptCard } from "@/components/prompt-card";
import { AdSlot } from "@/components/ad-slot";
import { usePosts } from "@/lib/posts";
import { useSettings } from "@/lib/settings";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "AI Photo Editing Prompts — Gemini & ChatGPT | PromptPalette" },
      { name: "description", content: "Copy, paste and generate stunning images in seconds. A curated library of AI photo editing prompts for Gemini, ChatGPT and Midjourney." },
      { property: "og:title", content: "AI Photo Editing Prompts — Gemini & ChatGPT" },
      { property: "og:description", content: "Copy, paste and generate stunning images in seconds." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

type Tab = "latest" | "trending" | "popular";

function HomePage() {
  const [tab, setTab] = useState<Tab>("latest");
  const [cols, setCols] = useState<1 | 2>(1);
  const [q, setQ] = useState("");
  const posts = usePosts();
  const settings = useSettings();

  const popular = settings.popular_tags?.length ? settings.popular_tags : ["Men", "Woman", "Couple", "Family", "Birthday"];

  const grid = useMemo(() => {
    if (!posts) return [];
    let list = [...posts];
    const num = (v: unknown) => Number(v) || 0;
    const recency = (x: (typeof list)[number]) => +new Date(x.createdAt) || 0;
    const score = (x: (typeof list)[number]) =>
      num(x.copies) * 2 + num(x.likes) + num(x.rating) * 5;
    if (tab === "latest") list.sort((a, b) => recency(b) - recency(a));
    if (tab === "trending")
      list.sort(
        (a, b) =>
          num(b.copies) * 2 + num(b.likes) - (num(a.copies) * 2 + num(a.likes)) ||
          num(b.rating) - num(a.rating) ||
          recency(b) - recency(a),
      );
    if (tab === "popular")
      list.sort(
        (a, b) =>
          num(b.likes) - num(a.likes) ||
          score(b) - score(a) ||
          recency(b) - recency(a),
      );
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(s) || (p.tags ?? []).some(t => t.toLowerCase().includes(s)));
    }
    return list;
  }, [posts, tab, q]);

  // Categories derived from posts
  const categoryChips = useMemo(() => {
    if (!posts) return [];
    const counts = new Map<string, number>();
    posts.forEach((p) => {
      if (!p.category) return;
      counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    });
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([slug, count]) => ({ slug, count }));
  }, [posts]);

  return (
    <PageShell>
      {/* Hero */}
      <section className="grid-bg -mx-4 rounded-[36px] px-4 py-14 text-center sm:py-20">
        <motion.h1
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-4xl leading-[1.05] sm:text-5xl md:text-6xl"
        >
          {settings.hero_title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }}
          className="mt-3 text-4xl font-black sm:text-5xl md:text-6xl"
        >
          <span className="gradient-text">{settings.hero_gradient_text}</span>
        </motion.p>
        <p className="mx-auto mt-5 max-w-lg text-base text-muted-foreground sm:text-lg">
          {settings.hero_subtitle}
        </p>

        <form
          onSubmit={(e) => { e.preventDefault(); }}
          className="glass-card mx-auto mt-8 flex max-w-2xl items-center gap-2 rounded-full p-1.5 pl-5"
        >
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search"
            className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button type="submit" aria-label="Search" className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground shadow-md">
            <Search className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-sm text-muted-foreground">
          <span className="mr-1">Popular:</span>
          {popular.map((t, i) => (
            <span key={t} className="flex items-center gap-1">
              <button
                onClick={() => setQ(t.toLowerCase())}
                className="font-bold text-foreground hover:text-primary"
              >
                {t}
              </button>
              {i < popular.length - 1 && <span className="mx-2 text-muted-foreground/60">/</span>}
            </span>
          ))}
        </div>
      </section>

      {/* Tabs */}
      <section className="mt-10" style={{ fontFamily: '"DM Sans", ui-sans-serif, system-ui, sans-serif' }}>
        <div className="glass-card mx-auto flex max-w-md items-center justify-around rounded-full p-1.5">
          {([
            { k: "latest", label: "Latest", icon: Clock },
            { k: "trending", label: "Trending", icon: Flame },
            { k: "popular", label: "Popular", icon: Sparkles },
          ] as { k: Tab; label: string; icon: typeof Clock }[]).map(({ k, label, icon: Icon }) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-extrabold tracking-tight transition ${
                tab === k ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />{label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {posts === null ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-pulse rounded-3xl bg-white/5" />
            ))
          ) : grid.length === 0 ? (
            <div className="col-span-full glass-card rounded-3xl p-10 text-center">
              <h3 className="text-lg font-bold">No prompts yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">Sign in to the admin and add your first post — or run the sitemap importer.</p>
            </div>
          ) : (
            grid.map((p, i) => (
              <div key={p.slug} className="contents">
                <PromptCard p={p} index={i} />
                {(i + 1) % 6 === 0 && <AdSlot />}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Browse by Category — 2 col on mobile */}
      {categoryChips.length > 0 && (
        <section className="mt-20">
          <h2 className="text-center text-3xl">Browse by Category</h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">Find the perfect look for your next project.</p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {categoryChips.map((c) => (
              <Link
                key={c.slug}
                to="/category/$slug"
                params={{ slug: c.slug }}
                className="glass-card hover-lift flex items-center gap-3 rounded-2xl p-3"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[image:var(--gradient-primary)] text-lg font-black text-white">
                  {c.slug[0]?.toUpperCase() ?? "•"}
                </span>
                <div className="min-w-0">
                  <div className="truncate text-sm font-black capitalize">{c.slug.replace(/-/g, " ")}</div>
                  <div className="text-[11px] text-muted-foreground">{c.count} Prompt{c.count === 1 ? "" : "s"}</div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link to="/libraries" className="btn-gradient inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm shadow-lg">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}
    </PageShell>
  );
}
