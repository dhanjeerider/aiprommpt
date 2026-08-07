import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Star, Sparkles, Download, X, Share2, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
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
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => { setActive(0); setLightbox(null); }, [slug]);

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
      <nav className="glass-card flex w-fit max-w-full flex-wrap items-center gap-1.5 rounded-full px-2 py-1.5 text-xs text-muted-foreground">
        <Link to="/" className="rounded-full px-2.5 py-1 font-semibold transition hover:bg-white/10 hover:text-foreground">Home</Link>
        <ChevronRight className="h-3 w-3 shrink-0" />
        {p.category && (
          <>
            <Link to="/category/$slug" params={{ slug: p.category }} className="rounded-full px-2.5 py-1 font-semibold uppercase tracking-wide transition hover:bg-white/10 hover:text-foreground">
              {p.category.replace(/-/g, " ")}
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
          </>
        )}
        <span className="line-clamp-1 rounded-full bg-[image:var(--gradient-primary)] px-3 py-1 font-bold text-white">{p.title}</span>
      </nav>


      <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.02]">
            <button
              type="button"
              onClick={() => setLightbox(Math.min(active, images.length - 1))}
              className="block w-full cursor-zoom-in"
              aria-label="Open image"
            >
              <img
                src={mainImage}
                alt={p.title}
                className="block aspect-[2/3] w-full rounded-[28px] object-cover"
              />
            </button>
            {p.premium && (
              <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-900 shadow-sm">
                <Sparkles className="h-3 w-3" /> Premium
              </span>
            )}
            <div className="pointer-events-none absolute right-3 top-3 flex items-center gap-2">
              {showGallery && (
                <span className="rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-extrabold text-white backdrop-blur">
                  {active + 1}/{images.length}
                </span>
              )}
              <a
                href={mainImage}
                download
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-extrabold text-white backdrop-blur transition hover:bg-black/80"
              >
                <Download className="h-3.5 w-3.5" /> Download
              </a>
            </div>
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
                  <img src={src} alt={`Prompt ${i + 1} example`} className="aspect-[2/3] w-full object-cover" />
                  <span className="absolute left-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-black/70 text-[10px] font-extrabold text-white">
                    {i + 1}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>


        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-foreground px-3 py-1 text-[11px] font-black uppercase tracking-widest text-background">
              Prompt Detail
            </span>
            {p.tool && (
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium capitalize text-muted-foreground">
                {p.tool.replace("-", " ")}
              </span>
            )}
            {p.premium && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[image:var(--gradient-primary)] px-2.5 py-1 text-[11px] font-bold text-white">
                <Sparkles className="h-3 w-3" /> Premium
              </span>
            )}
          </div>

          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{p.title}</h1>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>
              Shared by{" "}
              <span className="font-bold text-primary">@{p.author.name.replace(/\s+/g, "")}</span>
            </span>
            {p.createdAt && (
              <>
                <span>·</span>
                <time dateTime={new Date(p.createdAt).toISOString()}>
                  {new Date(p.createdAt).toLocaleString(undefined, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </>
            )}
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-current text-amber-500" />
              {p.rating.toFixed(1)}
            </span>
          </div>

          {p.excerpt && <p className="mt-4 text-muted-foreground">{p.excerpt}</p>}

          {prompts.map((text, i) => (
            <div key={i} className="glass-card mt-6 rounded-[28px] p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[12px] font-black uppercase tracking-widest text-primary">
                      Prompt{prompts.length > 1 ? ` ${i + 1}` : ""}
                    </div>
                    <div className="truncate text-[12px] text-muted-foreground">
                      Optimized for {p.tool ? p.tool.replace("-", " ") : "ChatGPT & Gemini"}
                    </div>
                  </div>
                </div>
                <SaveButton />
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="select-all whitespace-pre-wrap break-words text-[15px] font-medium leading-[1.7] text-foreground/90">
                  {text}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <CopyButton text={text} />
                <LikeButton initial={p.likes} />
              </div>
            </div>
          ))}

          <ShareRow title={p.title} />



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

      {lightbox !== null && images[lightbox] && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <img
            src={images[lightbox]}
            alt={p.title}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88vh] max-w-full rounded-2xl object-contain"
          />
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="Close"
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
          <a
            href={images[lightbox]}
            download
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-6 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
          >
            <Download className="h-4 w-4" /> Download image
          </a>
        </div>
      )}

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

function ShareRow({ title }: { title: string }) {
  const [url, setUrl] = useState("");
  useEffect(() => { setUrl(window.location.href); }, []);
  const text = encodeURIComponent(title);
  const u = encodeURIComponent(url);
  const items = [
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, cls: "bg-[#1877f2]" },
    { label: "X", href: `https://twitter.com/intent/tweet?text=${text}&url=${u}`, cls: "bg-foreground text-background" },
    { label: "WhatsApp", href: `https://wa.me/?text=${text}%20${u}`, cls: "bg-[#25d366]" },
    { label: "Telegram", href: `https://t.me/share/url?url=${u}&text=${text}`, cls: "bg-[#29a9eb]" },
  ];
  return (
    <div className="glass-card mt-6 flex flex-wrap items-center justify-between gap-3 rounded-[28px] p-4 sm:p-5">
      <div className="inline-flex items-center gap-2 text-sm font-bold">
        <Share2 className="h-4 w-4" /> Share
      </div>
      <div className="flex items-center gap-2">
        {items.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`Share on ${s.label}`}
            className={`grid h-10 w-10 place-items-center rounded-full text-xs font-black text-white shadow-md transition hover:opacity-90 ${s.cls}`}
          >
            {s.label[0]}
          </a>
        ))}
        <button
          type="button"
          aria-label="Copy link"
          onClick={() => { navigator.clipboard.writeText(url).then(() => toast.success("Link copied")); }}
          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10"
        >
          <LinkIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
