import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Heart, Sparkles, Crown } from "lucide-react";
import type { PromptPost } from "@/lib/data";

export function PromptCard({ p, index = 0 }: { p: PromptPost; index?: number }) {
  const chip = p.premium ? "PREMIUM" : (p.category ? p.category.toUpperCase() : "NEW");
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.03 }}
      className="hover-lift group glass-card overflow-hidden rounded-3xl"
    >
      <Link to="/prompt/$slug" params={{ slug: p.slug }} className="block">
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={p.featuredImage}
            alt={p.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white backdrop-blur">
            {p.premium && <Crown className="h-3 w-3 text-amber-300" />}
            {!p.premium && <Sparkles className="h-3 w-3 text-emerald-300" />}
            {chip}
          </span>
          <span className="absolute right-2.5 top-2.5 inline-flex flex-col items-center gap-0.5 rounded-2xl bg-black/70 px-2 py-1.5 text-[11px] font-bold text-white backdrop-blur">
            <Heart className="h-3.5 w-3.5" />
            {p.likes}
          </span>
        </div>
        <div className="p-3.5">
          <h3 className="line-clamp-1 text-sm font-black">{p.title}</h3>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.excerpt}</p>
          <div className="mt-2.5 text-[11px] text-muted-foreground">
            By <span className="font-bold text-foreground">@{p.author.handle ?? p.author.name}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
