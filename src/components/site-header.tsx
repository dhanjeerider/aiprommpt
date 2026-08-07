import { Link, useNavigate } from "@tanstack/react-router";
import { Crown, Smile, Search, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { useSettings } from "@/lib/settings";

export function SiteHeader() {
  const settings = useSettings();
  const [dark, setDark] = useState(true);
  const [q, setQ] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const saved = typeof window !== "undefined" && localStorage.getItem("theme");
    if (saved === "light") { document.documentElement.classList.add("light"); setDark(false); }
  }, []);

  function toggleTheme() {
    const html = document.documentElement;
    if (html.classList.contains("light")) {
      html.classList.remove("light");
      localStorage.setItem("theme", "dark");
      setDark(true);
    } else {
      html.classList.add("light");
      localStorage.setItem("theme", "light");
      setDark(false);
    }
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    navigate({ to: "/", search: { q } as never });
    setShowSearch(false);
  }

  const navLinks = (settings.footer_links ?? []).filter((l) => l.label && l.href).slice(0, 6);
  const links = navLinks.length
    ? navLinks
    : [
        { label: "AI Policy", href: "/ai-policy" },
        { label: "Terms & Conditions", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Contact Us", href: "/contact" },
        { label: "About Us", href: "/about" },
      ];

  return (
    <header className="sticky top-3 z-50 mx-auto w-full max-w-6xl px-3 sm:top-4 sm:px-4">
      <div className="glass-strong flex items-center gap-1 rounded-full px-2 py-1.5 sm:gap-2 sm:px-3 sm:py-2">
        <Link to="/" className="flex shrink-0 items-center gap-2 pl-1">
          {settings.logo_url ? (
            <img src={settings.logo_url} alt={settings.site_title} className="h-9 w-9 rounded-full object-cover shadow-md sm:h-10 sm:w-10" />
          ) : (
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-transparent shadow-md sm:h-10 sm:w-10" aria-label={settings.site_title}>
              <span className="bg-[image:var(--gradient-primary)] bg-clip-text text-lg font-black">{settings.site_title[0] ?? "P"}</span>
            </span>
          )}
          <span className="hidden text-base font-black tracking-tight sm:inline">{settings.site_title}</span>
        </Link>

        <nav className="ml-4 hidden min-w-0 items-center gap-5 lg:flex">
          {links.map((l) => (
            <a
              key={l.label + l.href}
              href={l.href}
              className="whitespace-nowrap text-[13.5px] font-semibold text-muted-foreground transition hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1.5">
          <Link to="/premium" aria-label="Premium" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-foreground transition hover:bg-white/10 lg:hidden">
            <Crown className="h-[18px] w-[18px]" />
          </Link>
          <Link to="/libraries" aria-label="Categories" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-foreground transition hover:bg-white/10 lg:hidden">
            <Smile className="h-[18px] w-[18px]" />
          </Link>
          <button aria-label="Search" onClick={() => setShowSearch((v) => !v)} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-foreground transition hover:bg-white/10">
            <Search className="h-[18px] w-[18px]" />
          </button>
          <button aria-label="Toggle theme" onClick={toggleTheme} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-foreground transition hover:bg-white/10">
            {dark ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
          </button>
        </div>
      </div>


      {showSearch && (
        <form onSubmit={submitSearch} className="glass-strong mt-2 flex items-center gap-2 rounded-full px-4 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search prompts…"
            className="flex-1 bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button type="submit" className="btn-gradient rounded-full px-4 py-1.5 text-xs">Go</button>
        </form>
      )}
    </header>
  );
}
