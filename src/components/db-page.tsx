import { useEffect, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Skeleton } from "@/components/page-transition";
import { supabase } from "@/integrations/supabase/client";

type PageRow = { slug: string; title: string; body_md: string };

/** Minimal markdown: ## headings, - lists, blank-line paragraphs, **bold**. */
function renderMd(md: string) {
  const blocks = md.split(/\n{2,}/).filter((b) => b.trim());
  return blocks.map((b, i) => {
    const t = b.trim();
    if (t.startsWith("## ")) return <h2 key={i}>{t.slice(3)}</h2>;
    if (t.startsWith("# ")) return <h2 key={i}>{t.slice(2)}</h2>;
    if (/^[-*]\s/m.test(t)) {
      return (
        <ul key={i}>
          {t.split("\n").map((l, j) => <li key={j}>{l.replace(/^[-*]\s/, "")}</li>)}
        </ul>
      );
    }
    return <p key={i}>{t}</p>;
  });
}

export function DbPage({
  slug,
  fallbackTitle,
  fallbackIntro,
  children,
}: {
  slug: string;
  fallbackTitle: string;
  fallbackIntro?: string;
  children?: React.ReactNode;
}) {
  const [row, setRow] = useState<PageRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    supabase
      .from("pages")
      .select("slug,title,body_md")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle()
      .then(({ data }) => {
        if (!alive) return;
        setRow((data as PageRow) ?? null);
        setLoading(false);
      });
    return () => { alive = false; };
  }, [slug]);

  return (
    <PageShell>
      <header className="mx-auto max-w-3xl text-center sm:text-left">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="gradient-text">{row?.title ?? fallbackTitle}</span>
        </h1>
        {!row && fallbackIntro && <p className="mt-4 text-muted-foreground">{fallbackIntro}</p>}
      </header>
      <article className="glass-card mx-auto mt-10 max-w-3xl rounded-3xl p-6 sm:p-10">
        <div className="prose prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:mt-8 prose-h2:text-xl prose-p:text-[15px] prose-p:leading-relaxed prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground">
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : row ? (
            renderMd(row.body_md ?? "")
          ) : (
            children ?? <p>This page has not been written yet. Add it from the admin panel under Pages.</p>
          )}
        </div>
      </article>
    </PageShell>
  );
}
