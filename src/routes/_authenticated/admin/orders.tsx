import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/orders")({ component: OrdersAdmin });
type Row = { id: string; email: string; utr: string; screenshot_url: string; amount: string | null; status: string; admin_note: string | null; created_at: string };

function OrdersAdmin() {
  const [rows, setRows] = useState<Row[]>([]);
  async function load() { const { data } = await supabase.from("premium_orders").select("*").order("created_at", { ascending: false }); setRows((data ?? []) as Row[]); }
  useEffect(() => { load(); }, []);
  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from("premium_orders").update({ status }).eq("id", id);
    if (error) return toast.error(error.message); load();
  }
  return (
    <div>
      <h1 className="text-2xl">Premium orders</h1>
      <div className="mt-4 grid gap-3">
        {rows.map(r => (
          <div key={r.id} className="glass-card flex flex-wrap items-center gap-3 rounded-2xl p-3">
            <a href={r.screenshot_url} target="_blank"><img src={r.screenshot_url} alt="" className="h-16 w-16 rounded-lg object-cover" /></a>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold">{r.email}</div>
              <div className="text-xs text-muted-foreground">UTR {r.utr} · ₹{r.amount ?? "—"} · {new Date(r.created_at).toLocaleString()}</div>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${r.status === "approved" ? "bg-emerald-500/20 text-emerald-300" : r.status === "rejected" ? "bg-red-500/20 text-red-300" : "bg-amber-500/20 text-amber-300"}`}>{r.status}</span>
            <button onClick={() => setStatus(r.id, "approved")} className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300">Approve</button>
            <button onClick={() => setStatus(r.id, "rejected")} className="rounded-full bg-red-500/20 px-3 py-1 text-xs text-red-300">Reject</button>
          </div>
        ))}
        {rows.length === 0 && <div className="p-6 text-center text-muted-foreground">No orders yet</div>}
      </div>
    </div>
  );
}
