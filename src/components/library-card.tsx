import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowUpRight, Layers } from "lucide-react";
import type { PromptLibrary } from "@/lib/data";

export function LibraryCard({ lib, index = 0 }: { lib: PromptLibrary; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.05 }}
      className="hover-lift glass-card group overflow-hidden rounded-3xl"
    >
      <Link
        to="/category/$slug"
        params={{ slug: lib.categories[0] ?? "portraits" }}
        className="block"
      >
        <div className={`relative aspect-[16/9] overflow-hidden bg-gradient-to-br ${lib.coverGradient}`}>
          <div className="absolute inset-0 bg-[radial-gradient(600px_200px_at_20%_0%,rgba(255,255,255,0.35),transparent)]" />
          <div className="absolute inset-0 flex items-end p-5">
            <div className="flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur">
              <Layers className="h-3.5 w-3.5" /> {lib.promptCount} prompts
            </div>
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-semibold">{lib.title}</h3>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
          </div>
          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
            {lib.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {lib.categories.map((c) => (
              <span key={c} className="rounded-full border bg-white/60 px-2.5 py-0.5 text-[11px] capitalize text-muted-foreground">
                {c}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
