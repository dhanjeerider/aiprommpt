import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LayoutDashboard, FileText, BookMarked, FileCode, Settings, LogOut, IndianRupee, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminShell,
});

function AdminShell() {
  const nav = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) { nav({ to: "/auth" }); return; }
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id);
      const admin = (data ?? []).some((r: { role: string }) => r.role === "admin");
      setIsAdmin(admin);
    })();
  }, [nav]);

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    nav({ to: "/auth" });
  }

  if (isAdmin === null) return <div className="p-10 text-center text-sm text-muted-foreground">Loading…</div>;
  if (!isAdmin) return (
    <div className="p-10 text-center">
      <h1 className="text-2xl">Not authorized</h1>
      <p className="mt-2 text-sm text-muted-foreground">Your account is not an admin.</p>
      <button onClick={signOut} className="mt-4 btn-gradient rounded-full px-4 py-2 text-sm">Sign out</button>
    </div>
  );

  const items: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/posts", label: "Posts", icon: FileText },
    { to: "/admin/libraries", label: "Libraries", icon: BookMarked },
    { to: "/admin/pages", label: "Pages", icon: FileCode },
    { to: "/admin/orders", label: "Orders", icon: IndianRupee },
    { to: "/admin/import", label: "Import", icon: Download },
    { to: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 md:grid-cols-[240px_1fr]">
        <aside className="glass-strong h-max rounded-3xl p-3">
          <Link to="/" className="mb-3 block rounded-2xl bg-white/5 p-3 text-sm font-black">
            Prompt<span className="gradient-text">Palette</span>
          </Link>
          <nav className="flex flex-col gap-1">
            {items.map(i => (
              <Link key={i.to} to={i.to as any} activeOptions={{ exact: i.exact ?? false }}
                activeProps={{ className: "bg-primary/15 text-primary" }}
                className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-bold text-muted-foreground hover:bg-white/5 hover:text-foreground">
                <i.icon className="h-4 w-4" /> {i.label}
              </Link>
            ))}
            <button onClick={signOut} className="mt-2 flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-bold text-muted-foreground hover:bg-white/5 hover:text-foreground">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </nav>
        </aside>
        <main className="glass-card rounded-3xl p-5"><Outlet /></main>
      </div>
    </div>
  );
}
