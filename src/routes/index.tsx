import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Search, Sparkles, ArrowRight, Star, Wand2 } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PromptCard } from "@/components/prompt-card";
import { CopyButton, LikeButton, SaveButton } from "@/components/actions";
import { categories, prompts, styles } from "@/lib/data";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "PrismPrompts — A Curated Library of AI Image Prompts" },
      {
        name: "description",
        content:
          "Discover, copy, and remix tested prompts for Midjourney, DALL·E, Flux, and Stable Diffusion. Editorial-grade prompt library with a premium feel.",
      },
      { property: "og:title", content: "PrismPrompts — Curated AI Prompt Library" },
      { property: "og:description", content: "Browse tested prompts for major AI image tools." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

function HomePage() {
  const featured = prompts[0];
  const [tab, setTab] = useState<"latest" | "trending" | "popular">("trending");
  const [query, setQuery] = useState("");

  const grid = useMemo(() => {
    let list = [...prompts];
    if (tab === "latest")
      list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    if (tab === "trending") list.sort((a, b) => b.copies - a.copies);
    if (tab === "popular") list.sort((a, b) => b.likes - a.likes);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q))
      );
    }
    return list.slice(0, 8);
  }, [tab, query]);

  return (
    <PageShell>
      {/* Hero */}
      <section className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-[hsl(262_83%_58%)]" />
            The prompt library for serious creators
          </motion.div>
          <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            Prompts that
            <br />
            <span className="gradient-text">actually render.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base text-muted-foreground sm:text-lg">
            A hand-tuned library of prompts for Midjourney, DALL·E, Flux, and more.
            Copy, generate, remix — no guesswork, no filler.
          </p>

          <div className="glass-card mt-7 flex items-center gap-2 rounded-full p-1.5 pl-5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search prompts, styles, or moods…"
              className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button className="inline-flex items-center gap-1.5 rounded-full bg-[image:var(--gradient-primary)] px-4 py-2 text-sm font-semibold text-white">
              Search <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {categories.slice(0, 6).map((c) => (
              <Link
                key={c.slug}
                to="/category/$slug"
                params={{ slug: c.slug }}
                className="rounded-full border bg-white/60 px-3.5 py-1.5 text-xs font-medium capitalize text-muted-foreground transition hover:bg-white hover:text-foreground"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Featured preview card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-strong relative rounded-[28px] p-3"
        >
          <div className="relative overflow-hidden rounded-3xl">
            <img
              src={featured.featuredImage}
              alt={featured.title}
              className="aspect-[4/5] w-full object-cover"
            />
            <div className="absolute left-3 top-3 flex gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold shadow-sm">
                <Sparkles className="h-3 w-3 text-[hsl(262_83%_58%)]" /> Featured
              </span>
              <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium capitalize shadow-sm">
                {featured.tool}
              </span>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold">{featured.title}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {featured.excerpt}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <CopyButton text={featured.content} />
              <SaveButton />
              <LikeButton initial={featured.likes} />
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-[image:var(--gradient-primary)] text-[10px] font-bold text-white">
                {featured.author.avatar}
              </span>
              <span>by {featured.author.name}</span>
              <span>·</span>
              <Star className="h-3 w-3 fill-current text-amber-500" />
              <span>{featured.rating.toFixed(1)} rating</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Tabs + grid */}
      <section className="mt-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Curated prompt feed
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Fresh drops, top copies, and community favorites.
            </p>
          </div>
          <div className="glass-card inline-flex rounded-full p-1">
            {(["latest", "trending", "popular"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition ${
                  tab === t
                    ? "bg-[image:var(--gradient-primary)] text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {grid.map((p, i) => (
            <PromptCard key={p.slug} p={p} index={i} />
          ))}
        </div>
      </section>

      {/* Browse by Style */}
      <section className="mt-24">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Browse by style</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Every prompt is tagged with its visual language.
            </p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {styles.map((s, i) => (
            <motion.div
              key={s.slug}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 8) * 0.03 }}
            >
              <Link
                to="/style/$slug"
                params={{ slug: s.slug }}
                className="hover-lift glass-card group block overflow-hidden rounded-3xl"
              >
                <div className={`relative aspect-[4/3] bg-gradient-to-br ${s.gradient}`}>
                  <div className="absolute inset-0 bg-[radial-gradient(400px_120px_at_20%_0%,rgba(255,255,255,0.4),transparent)]" />
                  <div className="absolute inset-0 flex items-end p-4">
                    <div className="rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-medium shadow-sm backdrop-blur">
                      {s.count} prompts
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4">
                  <span className="font-semibold">{s.name}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Premium CTA */}
      <section className="mt-24">
        <div className="glass-strong relative overflow-hidden rounded-[32px] p-8 sm:p-12">
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-70 blur-3xl"
            style={{ background: "var(--gradient-primary)" }}
          />
          <div className="relative grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-3 py-1 text-xs font-medium text-muted-foreground">
                <Wand2 className="h-3.5 w-3.5" /> One-time · Lifetime
              </div>
              <h3 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Go <span className="gradient-text">premium</span> — pay once, own it forever.
              </h3>
              <p className="mt-3 max-w-lg text-muted-foreground">
                Unlock the full premium library, get every future release, and browse
                completely ad-free. No subscriptions, no renewals.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/premium"
                  className="inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-primary)] px-6 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg"
                >
                  See premium plans <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/libraries"
                  className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-6 py-3 text-sm font-semibold"
                >
                  Browse libraries
                </Link>
              </div>
            </div>
            <div className="glass-card grid gap-3 rounded-3xl p-5">
              {[
                "Ad-free browsing across the entire library",
                "Full access to premium prompt collections",
                "Every future premium release included",
                "Priority curation and editorial picks",
              ].map((b) => (
                <div key={b} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 grid h-5 w-5 place-items-center rounded-full bg-[image:var(--gradient-primary)] text-[10px] font-bold text-white">
                    ✓
                  </span>
                  {b}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
