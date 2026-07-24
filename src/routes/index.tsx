import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Search, Clock, Flame, Sparkles, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PromptCard } from "@/components/prompt-card";
import { AdSlot } from "@/components/ad-slot";
import { prompts, libraries } from "@/lib/data";

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
  const [q, setQ] = useState("");
  const nav = useNavigate();

  const popular = ["Men", "Woman", "Couple", "Family", "Birthday"];

  const grid = useMemo(() => {
    let list = [...prompts];
    if (tab === "latest") list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    if (tab === "trending") list.sort((a, b) => b.copies - a.copies);
    if (tab === "popular") list.sort((a, b) => b.likes - a.likes);
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(s) || p.tags.some(t => t.includes(s)));
    }
    return list;
  }, [tab, q]);

  return (
    <PageShell>
      {/* Hero */}
      <section className="grid-bg -mx-4 rounded-[36px] px-4 py-14 text-center sm:py-20">
        <motion.h1
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-4xl leading-[1.05] sm:text-5xl md:text-6xl"
        >
          AI Photo Editing Prompts
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }}
          className="mt-3 text-4xl font-black sm:text-5xl md:text-6xl"
        >
          <span className="gradient-text">Gemini &amp; ChatGPT</span>
        </motion.p>
        <p className="mx-auto mt-5 max-w-lg text-base text-muted-foreground sm:text-lg">
          Copy, paste, and generate stunning Images in seconds.
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
      <section className="mt-10">
        <div className="glass-card mx-auto flex max-w-md items-center justify-around rounded-full p-1.5">
          {([
            { k: "latest", label: "Latest", icon: Clock },
            { k: "trending", label: "Trending", icon: Flame },
            { k: "popular", label: "Popular", icon: Sparkles },
          ] as { k: Tab; label: string; icon: typeof Clock }[]).map(({ k, label, icon: Icon }) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-black transition ${
                tab === k ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />{label}
            </button>
          ))}
        </div>

        {/* Grid with ad slots interleaved every 6 cards */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {grid.map((p, i) => (
            <div key={p.slug} className="contents">
              <PromptCard p={p} index={i} />
              {(i + 1) % 6 === 0 && <AdSlot />}
            </div>
          ))}
        </div>
      </section>

      {/* Browse by Style */}
      <section className="mt-20">
        <h2 className="text-center text-3xl">Browse by Style</h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">Find the perfect aesthetic for your next project.</p>
        <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {libraries.map((l) => (
            <Link
              key={l.slug}
              to="/library/$slug"
              params={{ slug: l.slug }}
              className="glass-card hover-lift flex items-center gap-3 rounded-2xl p-3"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[image:var(--gradient-primary)] text-lg font-black text-white">
                {l.title[0]}
              </span>
              <div className="min-w-0">
                <div className="truncate text-sm font-black">{l.title}</div>
                <div className="text-[11px] text-muted-foreground">{l.promptCount} Prompts</div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link to="/libraries" className="btn-gradient inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm shadow-lg">
            View All Libraries <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
