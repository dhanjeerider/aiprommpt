import { Link } from "@tanstack/react-router";
import { Sparkles, Github, Twitter, Instagram } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mx-auto mt-24 w-full max-w-6xl px-4 pb-10">
      <div className="glass-card rounded-3xl p-8 sm:p-10">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[image:var(--gradient-primary)] text-white">
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="text-lg font-bold">
                Prompt<span className="gradient-text">Palette</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              A curated library of tested AI photo editing prompts for Gemini, ChatGPT and more.
              Browse, copy, and create with confidence.
            </p>
            <div className="mt-5 flex gap-2">
              {[Twitter, Instagram, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social"
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-muted-foreground transition hover:bg-white/10 hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Explore</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-foreground">Home</Link></li>
              <li><Link to="/libraries" className="hover:text-foreground">Categories</Link></li>
              <li><Link to="/premium" className="hover:text-foreground">Premium</Link></li>
              <li><Link to="/auth" className="hover:text-foreground">Sign in</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground">About</Link></li>
              <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-foreground">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-foreground">Terms</Link></li>
              <li><Link to="/ai-policy" className="hover:text-foreground">AI Policy</Link></li>
              <li><Link to="/refund" className="hover:text-foreground">Refund Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} PromptPalette. Crafted for creators.</span>
          <span>Made with care · Tested prompts for major AI tools</span>
        </div>
      </div>
    </footer>
  );
}
