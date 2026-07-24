import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Heart, Copy, Sparkles, Star } from "lucide-react";
import type { PromptPost } from "@/lib/data";

export function PromptCard({ p, index = 0 }: { p: PromptPost; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 8) * 0.04 }}
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
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/0" />
          {p.premium && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-sm backdrop-blur">
              <Sparkles className="h-3 w-3 text-[hsl(262_83%_58%)]" /> Premium
            </span>
          )}
          <span className="absolute right-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-medium capitalize text-foreground shadow-sm backdrop-blur">
            {p.tool.replace("-", " ")}
          </span>
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 p-3 text-white">
            <div className="flex items-center gap-1 text-xs">
              <Star className="h-3.5 w-3.5 fill-current" />
              {p.rating.toFixed(1)}
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Heart className="h-3.5 w-3.5" /> {p.likes}
            </div>
            <div className="ml-auto flex items-center gap-1 text-xs">
              <Copy className="h-3.5 w-3.5" /> {p.copies}
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="line-clamp-1 text-sm font-semibold">{p.title}</h3>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.excerpt}</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-[image:var(--gradient-primary)] text-[10px] font-bold text-white">
              {p.author.avatar}
            </span>
            <span className="text-xs text-muted-foreground">{p.author.name}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
