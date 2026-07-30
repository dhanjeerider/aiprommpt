import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Star, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { CopyButton, LikeButton, SaveButton } from "@/components/actions";
import { PromptCard } from "@/components/prompt-card";
import { Skeleton } from "@/components/page-transition";
import { usePostBySlug, usePosts } from "@/lib/posts";

export const Route = createFileRoute("/prompt/$slug")({
  component: PromptPage,
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — PromptPalette` },
      { name: "description", content: `AI photo editing prompt — ${params.slug.replace(/-/g, " ")}.` },
      { property: "og:title", content: params.slug.replace(/-/g, " ") },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `/prompt/${params.slug}` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `/prompt/${params.slug}` }],
  }),
});

function PromptPage() {
  const { slug } = Route.useParams();
  const { post: p, loading } = usePostBySlug(slug);
  const posts = usePosts();
  const [active, setActive] = useState(0);

  useEffect(() => { setActive(0); }, [slug]);

  const prompts = useMemo(
    () => (p ? [p.content, ...p.extraPrompts].filter((t) => t && t.trim()) : []),
    [p],
  );

  // image i belongs to prompt i (index 0 = featured image / main prompt)
  const images = useMemo(() => {
    if (!p) return [];
    const list = [p.featuredImage, ...p.promptImages].filter((x) => x && x.trim());
    return Array.from(new Set(list));
  }, [p]);

  const related = useMemo(() => {
    if (!p || !posts) return [];
    return posts
      .filter((x) => x.slug !== p.slug && (x.category === p.category || (x.tags ?? []).some((t) => (p.tags ?? []).includes(t))))
      .slice(0, 4);
  }, [p, posts]);

  if (loading) {
    return (
      <PageShell>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <Skeleton className="aspect-[4/5] w-full rounded-[28px]" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </PageShell>
    );
  }

  if (!p) {
    return (
      <PageShell>
        <div className="glass-card rounded-3xl p-10 text-center">
          <h1 className="text-2xl font-bold">Prompt not found</h1>
          <p className="mt-2 text-muted-foreground">The prompt you're looking for doesn't exist.</p>
          <Link to="/" className="mt-6 inline-flex btn-gradient rounded-full px-5 py-2.5 text-sm">
            Back home
          </Link>
        </div>
      </PageShell>
    );
  }

  const showGallery = images.length > 1;
  const mainImage = images[Math.min(active, images.length - 1)] ?? images[0];

  return (
    <PageShell>
      <nav className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-muted-foreground sm:justify-start">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3 w-3" />
        {p.category && (
          <>
            <Link to="/category/$slug" params={{ slug: p.category }} className="capitalize hover:text-foreground">
              {p.category.replace(/-/g, " ")}
            </Link>
            <ChevronRight className="h-3 w-3" />
          </>
        )}
        <span className="line-clamp-1 text-foreground">{p.title}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="glass-strong overflow-hidden rounded-[28px] p-3">
          <div className="relative overflow-hidden rounded-3xl bg-black/30">
            <img
              src={mainImage}
              alt={p.title}
              className="mx-auto block max-h-[70vh] w-full object-contain"
            />
            {showGallery && (
              <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-extrabold text-white backdrop-blur">
                {active + 1}/{images.length}
              </span>
            )}
            {p.premium && (
              <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-900 shadow-sm">
                <Sparkles className="h-3 w-3" /> Premium
              </span>
            )}
          </div>

          {showGallery && (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`relative overflow-hidden rounded-xl border transition ${i === active ? "border-primary ring-2 ring-primary/40" : "border-white/10"}`}
                >
                  <img src={src} alt={`Prompt ${i + 1} example`} className="aspect-square w-full object-cover" />
                  <span className="absolute left-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-black/70 text-[10px] font-extrabold text-white">
                    {i + 1}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          {p.tool && (
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium capitalize text-muted-foreground">
              {p.tool.replace("-", " ")}
            </span>
          )}
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{p.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
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
          </div>
          <p className="mt-4 text-muted-foreground">{p.excerpt}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            <CopyButton text={p.content} />
            <SaveButton />
            <LikeButton initial={p.likes} />
          </div>

          {prompts.map((text, i) => (
            <div key={i} className="glass-card mt-6 rounded-3xl p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="inline-flex items-center gap-2 text-sm font-semibold">
                  {prompts.length > 1 && (
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-[image:var(--gradient-primary)] text-[10px] font-extrabold text-white">
                      {i + 1}
                    </span>
                  )}
                  Prompt{prompts.length > 1 ? ` ${i + 1}` : ""}
                </h3>
                <CopyButton text={text} className="px-3 py-1.5 text-xs" />
              </div>
              <pre className="mt-3 max-h-[600px] overflow-auto whitespace-pre-wrap break-words rounded-2xl border border-white/10 bg-black/30 p-4 font-mono text-[13px] leading-relaxed text-foreground">
{text}
              </pre>
            </div>
          ))}


          {(p.tags ?? []).length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold">Tags</h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {p.tags.map((t: string) => (
                  <Link
                    key={t}
                    to="/tag/$slug"
                    params={{ slug: t }}
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted-foreground hover:bg-white/10 hover:text-foreground"
                  >
                    #{t}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <RatingBox slug={p.slug} initial={p.rating} />

        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-bold tracking-tight">You might also like</h2>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r, i) => (
              <PromptCard key={r.slug} p={r} index={i} />
            ))}
          </div>
        </section>
      )}
    </PageShell>
  );
}

function RatingBox({ slug, initial }: { slug: string; initial: number }) {
  const key = `rating:${slug}`;
  const [mine, setMine] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  useEffect(() => {
    try {
      const v = localStorage.getItem(key);
      if (v) setMine(parseInt(v, 10));
    } catch {}
  }, [key]);

  function rate(n: number) {
    setMine(n);
    try { localStorage.setItem(key, String(n)); } catch {}
  }

  const shown = hover ?? mine ?? Math.round(initial);
  return (
    <div className="glass-card mt-6 rounded-3xl p-5">
      <h3 className="text-sm font-semibold">Rate this prompt</h3>
      <div className="mt-3 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => rate(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(null)}
            aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
            className="p-0.5 transition hover:scale-110"
          >
            <Star className={`h-7 w-7 ${n <= shown ? "fill-current text-amber-500" : "text-muted-foreground"}`} />
          </button>
        ))}
        <span className="ml-3 text-sm text-muted-foreground">
          {mine ? `Your rating: ${mine}/5` : `${initial.toFixed(1)} average`}
        </span>
      </div>
    </div>
  );
}
