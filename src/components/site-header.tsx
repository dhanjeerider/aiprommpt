import { Link, useRouterState } from "@tanstack/react-router";
import { Search, Sparkles, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Home" },
  { to: "/libraries", label: "Libraries" },
  { to: "/category/portraits", label: "Explore" },
  { to: "/premium", label: "Premium" },
];

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-4 z-50 mx-auto w-full max-w-6xl px-4">
      <div className="glass-strong flex items-center gap-3 rounded-full px-3 py-2 sm:px-4">
        <Link to="/" className="flex items-center gap-2 pl-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[image:var(--gradient-primary)] text-white shadow-md">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-sm font-bold tracking-tight sm:text-base">
            Prism<span className="gradient-text">Prompts</span>
          </span>
        </Link>

        <nav className="mx-auto hidden items-center gap-1 md:flex">
          {nav.map((n) => {
            const active =
              n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                  active && "bg-white/70 text-foreground shadow-sm"
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            aria-label="Search"
            className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition hover:bg-white/70 hover:text-foreground"
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            aria-label="Profile"
            className="hidden h-9 w-9 place-items-center rounded-full text-muted-foreground transition hover:bg-white/70 hover:text-foreground sm:grid"
          >
            <User className="h-4 w-4" />
          </button>
          <Link
            to="/premium"
            className="hidden items-center gap-1.5 rounded-full bg-[image:var(--gradient-primary)] px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:shadow-lg sm:inline-flex"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Premium
          </Link>
          <button
            className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="glass-strong mt-2 rounded-3xl p-3 md:hidden">
          <div className="flex flex-col gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-3 py-2 text-sm font-medium hover:bg-white/60"
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/premium"
              onClick={() => setOpen(false)}
              className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-[image:var(--gradient-primary)] px-4 py-2 text-sm font-semibold text-white"
            >
              <Sparkles className="h-3.5 w-3.5" /> Get Premium
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
