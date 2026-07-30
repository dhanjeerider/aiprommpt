import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { Toaster } from "@/components/ui/sonner";
import { PageTransition, RouteProgress } from "./page-transition";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen pb-8 pt-4">
      <RouteProgress />
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 pt-10">
        <PageTransition>{children}</PageTransition>
      </main>
      <SiteFooter />
      <Toaster position="top-center" richColors />
    </div>
  );
}
