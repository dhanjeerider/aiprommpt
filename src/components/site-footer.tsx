import { Link } from "@tanstack/react-router";
import { Sparkles, Github, Twitter, Instagram } from "lucide-react";
import { useSettings } from "@/lib/settings";

const defaultLinks = [
  { label: "Home", href: "/", group: "Explore" },
  { label: "Categories", href: "/libraries", group: "Explore" },
  { label: "Premium", href: "/premium", group: "Explore" },
  { label: "Sign in", href: "/auth", group: "Explore" },
  { label: "About", href: "/about", group: "Company" },
  { label: "Contact", href: "/contact", group: "Company" },
  { label: "Privacy", href: "/privacy", group: "Company" },
  { label: "Terms", href: "/terms", group: "Company" },
];

export function SiteFooter() {
  const settings = useSettings();
  const links = settings.footer_links.length ? settings.footer_links : defaultLinks;

  const groups = links.reduce<Record<string, typeof links>>((acc, l) => {
    const g = l.group?.trim() || "Explore";
    (acc[g] ||= []).push(l);
    return acc;
  }, {});

  return (
    <footer className="mx-auto mt-24 w-full max-w-6xl px-4 pb-10">
      <div className="glass-card rounded-3xl p-8 sm:p-10">
        <div className="grid gap-10 text-center md:grid-cols-4 md:text-left">
          <div className="md:col-span-2">
            <div className="flex items-center justify-center gap-2 md:justify-start">
              {settings.logo_url ? (
                <img src={settings.logo_url} alt={settings.site_title} className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[image:var(--gradient-primary)] text-white">
                  <Sparkles className="h-4 w-4" />
                </span>
              )}
              <span className="text-lg font-bold">{settings.site_title}</span>
            </div>
            <p className="mx-auto mt-4 max-w-sm text-sm text-muted-foreground md:mx-0">{settings.site_tagline}</p>
            <div className="mt-5 flex justify-center gap-2 md:justify-start">
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

          {Object.entries(groups).slice(0, 2).map(([group, items]) => (
            <div key={group}>
              <h4 className="text-sm font-semibold">{group}</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {items.map((l) => (
                  <li key={l.label + l.href}>
                    {l.href.startsWith("http") ? (
                      <a href={l.href} className="hover:text-foreground" target="_blank" rel="noreferrer">{l.label}</a>
                    ) : (
                      <Link to={l.href} className="hover:text-foreground">{l.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
          <span>© {new Date().getFullYear()} {settings.site_title}. Crafted for creators.</span>
          <span>Made with care · Tested prompts for major AI tools</span>
        </div>
      </div>
    </footer>
  );
}
