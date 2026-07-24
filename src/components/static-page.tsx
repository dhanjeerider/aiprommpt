import type { ReactNode } from "react";
import { PageShell } from "@/components/page-shell";

export function StaticPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <PageShell>
      <header className="max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="gradient-text">{title}</span>
        </h1>
        {intro && <p className="mt-4 text-muted-foreground">{intro}</p>}
      </header>
      <article className="glass-card mt-10 max-w-3xl rounded-3xl p-8 sm:p-10">
        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:mt-8 prose-h2:text-xl prose-p:text-[15px] prose-p:leading-relaxed prose-p:text-muted-foreground prose-a:text-[hsl(221_83%_55%)] prose-strong:text-foreground">
          {children}
        </div>
      </article>
    </PageShell>
  );
}
