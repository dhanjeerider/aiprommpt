import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronRight, Star, Sparkles } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { CopyButton, LikeButton, SaveButton } from "@/components/actions";
import { PromptCard } from "@/components/prompt-card";
import { getPromptBySlug, getRelated } from "@/lib/data";

export const Route = createFileRoute("/prompt/$slug")({
  loader: ({ params }) => {
    const p = getPromptBySlug(params.slug);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => {
    const p = loaderData;
    if (!p) return { meta: [{ title: "Prompt" }] };
    return {
      meta: [
        { title: `${p.title} — PrismPrompts` },
        { name: "description", content: p.excerpt },
        { property: "og:title", content: p.title },
        { property: "og:description", content: p.excerpt },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/prompt/${p.slug}` },
        { property: "og:image", content: p.featuredImage },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: p.featuredImage },
      ],
      links: [{ rel: "canonical", href: `/prompt/${p.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: p.title,
            description: p.excerpt,
            image: p.featuredImage,
            author: { "@type": "Person", name: p.author.name },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: p.rating,
              reviewCount: Math.max(10, Math.round(p.likes / 4)),
            },
          }),
        },
      ],
    };
  },
  component: PromptPage,
  notFoundComponent: () => (
    <PageShell>
      <div className="glass-card rounded-3xl p-10 text-center">
        <h1 className="text-2xl font-bold">Prompt not found</h1>
        <p className="mt-2 text-muted-foreground">The prompt you're looking for doesn't exist.</p>
        <Link to="/libraries" className="mt-6 inline-flex rounded-full bg-[image:var(--gradient-primary)] px-5 py-2.5 text-sm font-semibold text-white">
          Browse libraries
        </Link>
      </div>
    </PageShell>
  ),
});

function PromptPage() {
  const p = Route.useLoaderData();
  const related = getRelated(p);

  return (
    <PageShell>
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/category/$slug" params={{ slug: p.category }} className="capitalize hover:text-foreground">
          {p.category}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="line-clamp-1 text-foreground">{p.title}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="glass-strong overflow-hidden rounded-[28px] p-3">
          <div className="relative overflow-hidden rounded-3xl">
            <img src={p.featuredImage} alt={p.title} className="aspect-[4/5] w-full object-cover" />
            {p.premium && (
              <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold shadow-sm">
                <Sparkles className="h-3 w-3 text-[hsl(262_83%_58%)]" /> Premium
              </span>
            )}
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {related.slice(0, 4).map((r) => (
              <Link key={r.slug} to="/prompt/$slug" params={{ slug: r.slug }} className="overflow-hidden rounded-xl border">
                <img src={r.featuredImage} alt={r.title} className="aspect-square w-full object-cover" />
              </Link>
            ))}
          </div>
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <span className="rounded-full border bg-white/70 px-2.5 py-1 text-[11px] font-medium capitalize">
            {p.tool.replace("-", " ")}
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{p.title}</h1>
          <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-[image:var(--gradient-primary)] text-[10px] font-bold text-white">
                {p.author.avatar}
              </span>
              {p.author.name}
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-current text-amber-500" />
              {p.rating.toFixed(1)}
            </span>
            <span>·</span>
            <span>{p.copies} copies</span>
          </div>
          <p className="mt-4 text-muted-foreground">{p.excerpt}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            <CopyButton text={p.content} />
            <SaveButton />
            <LikeButton initial={p.likes} />
          </div>

          <div className="glass-card mt-6 rounded-3xl p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Prompt</h3>
              <CopyButton text={p.content} className="px-3 py-1.5 text-xs" />
            </div>
            <pre className="mt-3 whitespace-pre-wrap rounded-2xl bg-[hsl(240_40%_98%)] p-4 font-mono text-[13px] leading-relaxed text-foreground">
              {p.content}
            </pre>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold">Tags</h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {p.tags.map((t) => (
                <Link
                  key={t}
                  to="/tag/$slug"
                  params={{ slug: t }}
                  className="rounded-full border bg-white/60 px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  #{t}
                </Link>
              ))}
            </div>
          </div>

          <div className="glass-card mt-6 rounded-3xl p-5">
            <h3 className="text-sm font-semibold">Rate this prompt</h3>
            <div className="mt-3 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className={`h-6 w-6 ${n <= Math.round(p.rating) ? "fill-current text-amber-500" : "text-muted-foreground"}`}
                />
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {p.rating.toFixed(1)} average
              </span>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-20">
        <h2 className="text-2xl font-bold tracking-tight">You might also like</h2>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((r, i) => (
            <PromptCard key={r.slug} p={r} index={i} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
