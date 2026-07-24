import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { Toaster } from "@/components/ui/sonner";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen pb-8 pt-4">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 pt-10">{children}</main>
      <SiteFooter />
      <Toaster position="top-center" richColors />
    </div>
  );
}
