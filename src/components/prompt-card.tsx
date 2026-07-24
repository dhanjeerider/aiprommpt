import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Heart, Sparkles, Crown } from "lucide-react";
import { useState } from "react";
import type { PromptPost } from "@/lib/data";

export function PromptCard({ p, index = 0 }: { p: PromptPost; index?: number }) {
  const chip = p.premium ? "PREMIUM" : (p.category ? p.category.toUpperCase() : "NEW");
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(p.likes);

  function toggleLike(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setLiked((v) => {
      setLikes((n) => n + (v ? -1 : 1));
      return !v;
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.03 }}
      className="hover-lift group relative overflow-hidden rounded-3xl bg-card border border-white/5"
      style={{ fontFamily: '"DM Sans", ui-sans-serif, system-ui, sans-serif' }}
    >
      <Link to="/prompt/$slug" params={{ slug: p.slug }} className="block">
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={p.featuredImage}
            alt={p.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-900 shadow-sm">
            {p.premium && <Crown className="h-3 w-3 text-amber-500" />}
            {!p.premium && <Sparkles className="h-3 w-3 text-emerald-500" />}
            {chip}
          </span>
        </div>
        <div className="p-4">
          <h3 className="line-clamp-1 text-[15px] font-extrabold tracking-tight">{p.title}</h3>
          <p className="mt-1 line-clamp-2 text-[13px] font-medium text-muted-foreground">{p.excerpt}</p>
          <div className="mt-3 text-[12px] font-semibold text-muted-foreground">
            By <span className="font-extrabold text-foreground">@{p.author.handle ?? p.author.name}</span>
          </div>
        </div>
      </Link>
      <button
        type="button"
        onClick={toggleLike}
        aria-label="Like"
        className="absolute right-2.5 top-2.5 z-20 inline-flex flex-col items-center gap-0.5 rounded-2xl bg-white/95 px-2 py-1.5 text-[11px] font-extrabold text-slate-900 shadow-sm backdrop-blur transition active:scale-95"
      >
        <Heart className={`h-4 w-4 transition ${liked ? "fill-rose-500 text-rose-500" : ""}`} />
        {likes}
      </button>
    </motion.div>
  );
}
