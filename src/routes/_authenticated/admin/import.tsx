import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Download, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/import")({ component: ImportPage });

const PROXY = "https://html.lr7.workers.dev/?url=";
const DEFAULT_SITEMAP = "https://promptplum.com/ai_prompt-sitemap.xml";

function slugFromUrl(u: string) {
  const m = u.replace(/\/$/, "").split("/");
  return m[m.length - 1] || "";
}

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function firstMatch(html: string, re: RegExp): string {
  const m = html.match(re);
  return m ? m[1] : "";
}

function extractPost(url: string, html: string) {
  const slug = slugFromUrl(url);
  const title =
    firstMatch(html, /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
    stripHtml(firstMatch(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i)) ||
    slug.replace(/-/g, " ");
  const excerpt =
    firstMatch(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
    firstMatch(html, /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i);
  const image = firstMatch(html, /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);

  // Prompt block: look for <pre> or content after "PROMPT"
  let prompt = stripHtml(firstMatch(html, /<pre[^>]*>([\s\S]*?)<\/pre>/i));
  if (!prompt) {
    const seg = firstMatch(html, /PROMPT[\s\S]{0,50}?<\/[^>]+>([\s\S]{200,3000}?)(?:Copy|Like|Share|TAGS|MODEL)/i);
    prompt = stripHtml(seg);
  }
  if (!prompt) prompt = excerpt;

  // Tags: from #Tag patterns or a TAGS block
  const tagMatches = Array.from(html.matchAll(/#([A-Za-z][A-Za-z0-9&\- ]{1,30})/g)).map(m => m[1].trim().toLowerCase());
  const tags = Array.from(new Set(tagMatches)).slice(0, 8);

  return {
    slug,
    title: title.replace(/&amp;/g, "&").slice(0, 180),
    excerpt: (excerpt || "").slice(0, 400),
    content_prompt: prompt.slice(0, 6000),
    featured_image: image,
    category: tags[0] ?? null,
    library_slug: null,
    tags,
    tool: "gemini",
    author_name: "PromptPrime",
    premium: false,
    likes: 0,
    published: true,
  };
}

function ImportPage() {
  const [sitemap, setSitemap] = useState(DEFAULT_SITEMAP);
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [progress, setProgress] = useState({ done: 0, total: 0, added: 0, skipped: 0, failed: 0 });

  function push(line: string) { setLog((l) => [line, ...l].slice(0, 200)); }

  async function run() {
    setRunning(true); setLog([]); setProgress({ done: 0, total: 0, added: 0, skipped: 0, failed: 0 });
    try {
      push(`Fetching sitemap: ${sitemap}`);
      const xml = await fetch(PROXY + encodeURIComponent(sitemap)).then(r => r.text());
      const urls = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map(m => m[1]);
      push(`Found ${urls.length} URLs`);

      // Load existing slugs
      const { data: existing } = await supabase.from("posts").select("slug");
      const have = new Set((existing ?? []).map((r: { slug: string }) => r.slug));

      setProgress(p => ({ ...p, total: urls.length }));

      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        const slug = slugFromUrl(url);
        if (!slug || have.has(slug)) {
          setProgress(p => ({ ...p, done: p.done + 1, skipped: p.skipped + 1 }));
          continue;
        }
        try {
          const html = await fetch(PROXY + encodeURIComponent(url)).then(r => r.text());
          const post = extractPost(url, html);
          if (!post.title || !post.featured_image) throw new Error("missing fields");
          const { error } = await supabase.from("posts").insert(post);
          if (error) throw error;
          have.add(slug);
          push(`✓ ${post.title}`);
          setProgress(p => ({ ...p, done: p.done + 1, added: p.added + 1 }));
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : String(e);
          push(`✗ ${slug} — ${msg}`);
          setProgress(p => ({ ...p, done: p.done + 1, failed: p.failed + 1 }));
        }
      }
      toast.success("Import finished");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(msg);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-black">Sitemap Importer</h1>
      <p className="mt-1 text-sm text-muted-foreground">Fetches every post URL from a sitemap through the HTML proxy and imports new posts. Existing slugs are skipped.</p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input value={sitemap} onChange={e => setSitemap(e.target.value)}
          className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none" />
        <button disabled={running} onClick={run} className="btn-gradient inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm disabled:opacity-60">
          {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {running ? "Importing…" : "Start Import"}
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {[
          ["Total", progress.total],
          ["Done", progress.done],
          ["Added", progress.added],
          ["Skipped", progress.skipped],
          ["Failed", progress.failed],
        ].map(([k, v]) => (
          <div key={k as string} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{k}</div>
            <div className="text-lg font-black">{v}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 max-h-[420px] overflow-auto rounded-2xl border border-white/10 bg-black/30 p-3 font-mono text-[12px] leading-relaxed">
        {log.length === 0 ? <div className="text-muted-foreground">Logs will appear here…</div> : log.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
}
