import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const [counts, setCounts] = useState({ posts: 0, libraries: 0, pages: 0, orders: 0 });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const [p, l, pg, o] = await Promise.all([
        supabase.from("posts").select("id", { count: "exact", head: true }),
        supabase.from("libraries").select("id", { count: "exact", head: true }),
        supabase.from("pages").select("id", { count: "exact", head: true }),
        supabase.from("premium_orders").select("id", { count: "exact", head: true }),
      ]);
      setCounts({ posts: p.count ?? 0, libraries: l.count ?? 0, pages: pg.count ?? 0, orders: o.count ?? 0 });
      setLoading(false);
    })();
  }, []);
  const cards = [
    { label: "Posts", value: counts.posts },
    { label: "Libraries", value: counts.libraries },
    { label: "Pages", value: counts.pages },
    { label: "Orders", value: counts.orders },
  ];
  return (
    <div>
      <h1 className="text-2xl">Admin dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage posts, libraries, pages, orders and site settings.</p>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {cards.map(c => (
          <div key={c.label} className="glass-card rounded-2xl p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</div>
            {loading ? <div className="mt-2 h-8 w-16 animate-pulse rounded-lg bg-white/10" /> : <div className="mt-1 text-3xl font-black">{c.value}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
