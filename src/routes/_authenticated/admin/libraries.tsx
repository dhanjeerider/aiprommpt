import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/libraries")({ component: LibsAdmin });

type Lib = { id: string; slug: string; title: string; description: string; cover_image: string | null; prompt_count: number; published: boolean };

function LibsAdmin() {
  const [rows, setRows] = useState<Lib[]>([]);
  const [editing, setEditing] = useState<Partial<Lib> | null>(null);

  async function load() {
    const { data } = await supabase.from("libraries").select("*").order("sort_order");
    setRows((data ?? []) as Lib[]);
  }
  useEffect(() => { load(); }, []);

  async function save() {
    if (!editing) return;
    const { error } = editing.id
      ? await supabase.from("libraries").update(editing).eq("id", editing.id)
      : await supabase.from("libraries").insert(editing as any);
    if (error) return toast.error(error.message);
    toast.success("Saved"); setEditing(null); load();
  }
  async function del(id: string) {
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from("libraries").delete().eq("id", id);
    if (error) return toast.error(error.message); load();
  }

  if (editing) return (
    <div>
      <h1 className="text-2xl">{editing.id ? "Edit library" : "New library"}</h1>
      <div className="mt-4 grid gap-3">
        {(["slug", "title", "description", "cover_image"] as const).map(k => (
          <label key={k} className="text-xs font-bold uppercase text-muted-foreground">{k}
            <input value={(editing as any)[k] ?? ""} onChange={e => setEditing({ ...editing, [k]: e.target.value })}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-sm outline-none" />
          </label>
        ))}
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.published ?? true} onChange={e => setEditing({ ...editing, published: e.target.checked })}/> Published</label>
        <div className="flex gap-2">
          <button onClick={() => setEditing(null)} className="rounded-full border border-white/10 px-4 py-2 text-sm">Cancel</button>
          <button onClick={save} className="btn-gradient rounded-full px-4 py-2 text-sm">Save</button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between"><h1 className="text-2xl">Libraries</h1>
        <button onClick={() => setEditing({ slug: "", title: "", description: "", published: true })} className="btn-gradient rounded-full px-4 py-2 text-sm">New</button></div>
      <table className="mt-4 w-full text-sm">
        <thead className="text-left text-xs uppercase text-muted-foreground"><tr><th className="p-2">Title</th><th className="p-2">Slug</th><th /></tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className="border-t border-white/5">
              <td className="p-2 font-bold">{r.title}</td><td className="p-2 text-muted-foreground">{r.slug}</td>
              <td className="p-2 text-right"><button onClick={() => setEditing(r)} className="text-primary">Edit</button><button onClick={() => del(r.id)} className="ml-3 text-red-400">Delete</button></td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan={3} className="p-6 text-center text-muted-foreground">No libraries yet</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
