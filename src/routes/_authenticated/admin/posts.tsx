import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, Loader2 } from "lucide-react";
import { uploadImage } from "@/lib/uploader";

export const Route = createFileRoute("/_authenticated/admin/posts")({ component: PostsAdmin });

type Post = {
  id: string; slug: string; title: string; excerpt: string; content_prompt: string;
  extra_prompts: string[];
  prompt_images: string[];
  featured_image: string; category: string | null; library_slug: string | null;
  tags: string[]; tool: string | null; author_name: string; premium: boolean;
  likes: number; copies: number; saves: number; rating: number; published: boolean;
};

const empty: Omit<Post, "id"> = {
  slug: "", title: "", excerpt: "", content_prompt: "", extra_prompts: [], prompt_images: [], featured_image: "",
  category: "", library_slug: "", tags: [], tool: "gemini", author_name: "PromptPalette",
  premium: false, likes: 0, copies: 0, saves: 0, rating: 5, published: true,
};


function PostsAdmin() {
  const [rows, setRows] = useState<Post[]>([]);
  const [editing, setEditing] = useState<(Omit<Post, "id"> & { id?: string }) | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [tagsStr, setTagsStr] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
    setRows((data ?? []) as Post[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function save() {
    if (!editing) return;
    const payload = { ...editing, tags: tagsStr.split(",").map(t => t.trim()).filter(Boolean) };
    setSaving(true);
    const { error } = editing.id
      ? await supabase.from("posts").update(payload).eq("id", editing.id)
      : await supabase.from("posts").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved"); setEditing(null); load();
  }

  async function del(id: string) {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); load();
  }

  async function bulkDelete() {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} posts?`)) return;
    const { error } = await supabase.from("posts").delete().in("id", [...selected]);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); setSelected(new Set()); load();
  }

  async function onUpload(file: File) {
    const url = await uploadImage(file);
    if (!url) return toast.error("Upload failed");
    if (editing) setEditing({ ...editing, featured_image: url });
  }

  async function onPromptImage(file: File, i: number) {
    if (!editing) return;
    const url = await uploadImage(file);
    if (!url) return toast.error("Upload failed");
    const next = [...(editing.prompt_images ?? [])];
    while (next.length <= i) next.push("");
    next[i] = url;
    setEditing({ ...editing, prompt_images: next });
  }


  if (editing) return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">{editing.id ? "Edit post" : "New post"}</h1>
        <div className="flex gap-2">
          <button onClick={() => setEditing(null)} className="rounded-full border border-white/10 px-4 py-2 text-sm">Cancel</button>
          <button onClick={save} disabled={saving} className="btn-gradient inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm disabled:opacity-60">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}{saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
      <div className="mt-4 grid gap-3">
        {(["slug", "title", "excerpt", "content_prompt", "category", "library_slug", "tool", "author_name"] as const).map(k => (
          <label key={k} className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {k}
            {k === "excerpt" || k === "content_prompt" ? (
              <textarea rows={k === "content_prompt" ? 14 : 2} value={(editing as any)[k] ?? ""} onChange={e => setEditing({ ...editing, [k]: e.target.value })}
                className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-foreground outline-none font-mono" />
            ) : (
              <input value={(editing as any)[k] ?? ""} onChange={e => setEditing({ ...editing, [k]: e.target.value })}
                className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-foreground outline-none" />
            )}
          </label>
        ))}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Additional prompts (users can copy each separately)</div>
            <button type="button" onClick={() => setEditing({ ...editing, extra_prompts: [...(editing.extra_prompts ?? []), ""] })}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">+ Add prompt</button>
          </div>
          <div className="mt-3 space-y-3">
            {(editing.extra_prompts ?? []).map((val, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-black/20 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase text-muted-foreground">Prompt {i + 2}</span>
                  <button type="button" onClick={() => setEditing({
                    ...editing,
                    extra_prompts: editing.extra_prompts.filter((_, j) => j !== i),
                    prompt_images: (editing.prompt_images ?? []).filter((_, j) => j !== i),
                  })}
                    className="text-xs text-red-400 hover:underline">Remove</button>
                </div>
                <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
                  <textarea rows={8} value={val} onChange={e => {
                    const next = [...editing.extra_prompts]; next[i] = e.target.value;
                    setEditing({ ...editing, extra_prompts: next });
                  }} className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm font-mono outline-none" />
                  <div className="rounded-lg border border-dashed border-white/15 p-2">
                    <div className="text-[10px] font-bold uppercase text-muted-foreground">Demo image for prompt {i + 2}</div>
                    <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && onPromptImage(e.target.files[0], i)}
                      className="mt-1 w-full text-[11px]" />
                    {(editing.prompt_images ?? [])[i] && (
                      <img src={(editing.prompt_images ?? [])[i]} alt="" className="mt-2 h-24 w-full rounded-lg object-cover" />
                    )}
                  </div>
                </div>
              </div>
            ))}

            {(editing.extra_prompts ?? []).length === 0 && (
              <div className="text-xs text-muted-foreground">Only the main prompt above. Click "+ Add prompt" to include more.</div>
            )}
          </div>
        </div>

        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Tags (comma separated)
          <input value={tagsStr} onChange={e => setTagsStr(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-foreground outline-none" />
        </label>
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Featured image
          <input type="file" accept="image/*" onChange={e => e.target.files && onUpload(e.target.files[0])}
            className="mt-1 block w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-foreground" />
          {editing.featured_image && <img src={editing.featured_image} alt="" className="mt-2 h-40 w-auto rounded-xl object-cover" />}
        </label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(["likes", "copies", "saves", "rating"] as const).map(k => (
            <label key={k} className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {k}
              <input type="number" step={k === "rating" ? "0.1" : "1"} value={(editing as any)[k] ?? 0}
                onChange={e => setEditing({ ...editing, [k]: Number(e.target.value) })}
                className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-foreground outline-none" />
            </label>
          ))}
        </div>
        <p className="-mt-1 text-[11px] text-muted-foreground">Likes and copies drive the Popular / Trending tabs on the home page.</p>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.premium} onChange={e => setEditing({ ...editing, premium: e.target.checked })} /> Premium</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.published} onChange={e => setEditing({ ...editing, published: e.target.checked })} /> Published</label>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl">Posts</h1>
        <div className="flex gap-2">
          {selected.size > 0 && <button onClick={bulkDelete} className="rounded-full bg-red-500/20 px-4 py-2 text-sm font-bold text-red-300">Delete {selected.size}</button>}
          <button onClick={() => { setEditing({ ...empty }); setTagsStr(""); }} className="btn-gradient rounded-full px-4 py-2 text-sm">New</button>
        </div>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase text-muted-foreground">
            <tr><th className="p-2"><input type="checkbox" onChange={e => setSelected(e.target.checked ? new Set(rows.map(r => r.id)) : new Set())} /></th><th className="p-2">Title</th><th className="p-2">Slug</th><th className="p-2">Cat</th><th className="p-2">Pub</th><th /></tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-t border-white/5">
                <td className="p-2"><input type="checkbox" checked={selected.has(r.id)} onChange={e => { const s = new Set(selected); e.target.checked ? s.add(r.id) : s.delete(r.id); setSelected(s); }} /></td>
                <td className="p-2 font-bold">{r.title}</td>
                <td className="p-2 text-muted-foreground">{r.slug}</td>
                <td className="p-2 text-muted-foreground">{r.category}</td>
                <td className="p-2">{r.published ? "✓" : "—"}</td>
                <td className="p-2 text-right">
                  <Link to="/prompt/$slug" params={{ slug: r.slug }} target="_blank" className="mr-3 inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
                    <Eye className="h-3.5 w-3.5" /> View
                  </Link>
                  <button onClick={() => { setEditing(r); setTagsStr((r.tags ?? []).join(", ")); }} className="text-primary hover:underline">Edit</button>
                  <button onClick={() => del(r.id)} className="ml-3 text-red-400 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {loading && Array.from({ length: 5 }).map((_, i) => (
              <tr key={`sk-${i}`} className="border-t border-white/5">
                <td className="p-2" colSpan={6}><div className="h-6 w-full animate-pulse rounded-lg bg-white/5" /></td>
              </tr>
            ))}
            {!loading && rows.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No posts yet — click New</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
