import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { LibraryCard } from "@/components/library-card";
import { categories, libraries, styles, tools } from "@/lib/data";

export const Route = createFileRoute("/libraries")({
  component: LibrariesPage,
  head: () => ({
    meta: [
      { title: "Prompt Libraries — PrismPrompts" },
      {
        name: "description",
        content:
          "Explore curated prompt libraries organized by style, subject, and tool.",
      },
      { property: "og:title", content: "Prompt Libraries — PrismPrompts" },
      { property: "og:description", content: "Curated prompt libraries for every look." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/libraries" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/libraries" }],
  }),
});

function LibrariesPage() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"az" | "popular">("popular");
  const [filter, setFilter] = useState<string>("all");

  const list = useMemo(() => {
    let l = [...libraries];
    if (filter !== "all") l = l.filter((x) => x.categories.includes(filter));
    if (q.trim()) {
      const s = q.toLowerCase();
      l = l.filter(
        (x) =>
          x.title.toLowerCase().includes(s) ||
          x.description.toLowerCase().includes(s)
      );
    }
    if (sort === "az") l.sort((a, b) => a.title.localeCompare(b.title));
    else l.sort((a, b) => b.promptCount - a.promptCount);
    return l;
  }, [q, sort, filter]);

  const chips = [
    { key: "all", label: "All" },
    ...categories.slice(0, 6).map((c) => ({ key: c.slug, label: c.name })),
  ];

  return (
    <PageShell>
      <header className="max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Prompt <span className="gradient-text">libraries</span>
        </h1>
        <p className="mt-4 text-muted-foreground">
          Curated collections organized by mood, subject, and technique — everything
          you need to move from idea to render.
        </p>
      </header>

      <div className="glass-card mt-8 flex items-center gap-2 rounded-full p-1.5 pl-5">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search libraries…"
          className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {chips.map((c) => (
          <button
            key={c.key}
            onClick={() => setFilter(c.key)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium capitalize transition ${
              filter === c.key
                ? "border-transparent bg-[image:var(--gradient-primary)] text-white"
                : "bg-white/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            {c.label}
          </button>
        ))}
        <div className="ml-auto glass-card inline-flex rounded-full p-1">
          {(["popular", "az"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                sort === s ? "bg-[image:var(--gradient-primary)] text-white" : "text-muted-foreground"
              }`}
            >
              {s === "az" ? "A–Z" : "Most Popular"}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="glass-card mt-10 rounded-3xl p-10 text-center">
          <h3 className="text-lg font-semibold">No libraries match your search</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a broader query or clear the filters.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((lib, i) => (
            <LibraryCard key={lib.slug} lib={lib} index={i} />
          ))}
        </div>
      )}

      <section className="mt-16 grid gap-4 sm:grid-cols-2">
        <div className="glass-card rounded-3xl p-6">
          <h3 className="text-sm font-semibold text-muted-foreground">Styles</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {styles.map((s) => (
              <span key={s.slug} className="rounded-full border bg-white/60 px-3 py-1 text-xs">
                {s.name}
              </span>
            ))}
          </div>
        </div>
        <div className="glass-card rounded-3xl p-6">
          <h3 className="text-sm font-semibold text-muted-foreground">Tools</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {tools.map((t) => (
              <span key={t.slug} className="rounded-full border bg-white/60 px-3 py-1 text-xs capitalize">
                {t.name}
              </span>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
