import { Link, useNavigate } from "@tanstack/react-router";
import { Crown, Smile, Search, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function SiteHeader() {
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

  return (
    <header className="sticky top-3 z-50 mx-auto w-full max-w-5xl px-3 sm:top-4 sm:px-4">
      <div className="glass-strong flex items-center gap-2 rounded-full px-2.5 py-2 sm:px-3">
        <Link to="/" className="flex items-center gap-2 pl-1">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-transparent shadow-md" aria-label="PromptPalette">
            <span className="bg-[image:var(--gradient-primary)] bg-clip-text text-lg font-black">P</span>
          </span>
          <span className="hidden text-sm font-black tracking-tight sm:inline">Prompt<span className="gradient-text">Palette</span></span>
        </Link>

        <div className="ml-auto flex items-center gap-1.5">
          <Link to="/premium" aria-label="Premium" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-foreground transition hover:bg-white/10">
            <Crown className="h-4 w-4" />
          </Link>
          <Link to="/libraries" aria-label="Categories" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-foreground transition hover:bg-white/10">
            <Smile className="h-4 w-4" />
          </Link>
          <button aria-label="Search" onClick={() => setShowSearch((v) => !v)} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-foreground transition hover:bg-white/10">
            <Search className="h-4 w-4" />
          </button>
          <button aria-label="Toggle theme" onClick={toggleTheme} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-foreground transition hover:bg-white/10">
            {dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
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
