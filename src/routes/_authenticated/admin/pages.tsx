import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/pages")({ component: PagesAdmin });
type Row = { id: string; slug: string; title: string; body_md: string; seo_title: string | null; seo_description: string | null; published: boolean };

function PagesAdmin() {
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Partial<Row> | null>(null);
  async function load() { const { data } = await supabase.from("pages").select("*").order("slug"); setRows((data ?? []) as Row[]); }
  useEffect(() => { load(); }, []);
  async function save() {
    if (!editing) return;
    const { error } = editing.id ? await supabase.from("pages").update(editing).eq("id", editing.id) : await supabase.from("pages").insert(editing as any);
    if (error) return toast.error(error.message); toast.success("Saved"); setEditing(null); load();
  }
  async function del(id: string) { if (!confirm("Delete?")) return; await supabase.from("pages").delete().eq("id", id); load(); }

  if (editing) return (
    <div>
      <h1 className="text-2xl">{editing.id ? "Edit page" : "New page"}</h1>
      <div className="mt-4 grid gap-3">
        {(["slug", "title", "seo_title", "seo_description"] as const).map(k => (
          <input key={k} placeholder={k} value={(editing as any)[k] ?? ""} onChange={e => setEditing({ ...editing, [k]: e.target.value })}
            className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-sm outline-none" />
        ))}
        <textarea rows={12} placeholder="Markdown body" value={editing.body_md ?? ""} onChange={e => setEditing({ ...editing, body_md: e.target.value })}
          className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 font-mono text-sm outline-none" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.published ?? true} onChange={e => setEditing({ ...editing, published: e.target.checked })}/> Published</label>
        <div className="flex gap-2"><button onClick={() => setEditing(null)} className="rounded-full border border-white/10 px-4 py-2 text-sm">Cancel</button><button onClick={save} className="btn-gradient rounded-full px-4 py-2 text-sm">Save</button></div>
      </div>
    </div>
  );
  return (
    <div>
      <div className="flex items-center justify-between"><h1 className="text-2xl">Pages</h1>
        <button onClick={() => setEditing({ slug: "", title: "", body_md: "", published: true })} className="btn-gradient rounded-full px-4 py-2 text-sm">New</button></div>
      <table className="mt-4 w-full text-sm">
        <thead className="text-left text-xs uppercase text-muted-foreground"><tr><th className="p-2">Title</th><th className="p-2">Slug</th><th /></tr></thead>
        <tbody>{rows.map(r => (
          <tr key={r.id} className="border-t border-white/5">
            <td className="p-2 font-bold">{r.title}</td><td className="p-2 text-muted-foreground">/{r.slug}</td>
            <td className="p-2 text-right"><button onClick={() => setEditing(r)} className="text-primary">Edit</button><button onClick={() => del(r.id)} className="ml-3 text-red-400">Delete</button></td>
          </tr>
        ))}
        {rows.length === 0 && <tr><td colSpan={3} className="p-6 text-center text-muted-foreground">No pages yet</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
