import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Check, X, Sparkles, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { useSettings } from "@/lib/settings";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/premium")({
  component: PremiumPage,
  head: () => ({
    meta: [
      { title: "Premium — Lifetime Access to the Prompt Library" },
      {
        name: "description",
        content:
          "Pay once, own it forever. Unlock the premium library, browse ad-free, and get every future release included.",
      },
      { property: "og:title", content: "Premium — Lifetime Access" },
      { property: "og:description", content: "One-time purchase. Lifetime access." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/premium" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/premium" }],
  }),
});

function PremiumPage() {
  const s = useSettings();
  const price = s.premium_price ?? "499";
  const symbol = (s.premium_currency ?? "INR") === "INR" ? "₹" : "";

  const freeFeatures = [
    { label: "Browse the public prompt library", ok: true },
    { label: "Copy free prompts to clipboard", ok: true },
    { label: "Save prompts to your collection", ok: true },
    { label: "Access to premium collections", ok: false },
    { label: "Ad-free browsing", ok: false },
    { label: "All future premium releases", ok: false },
  ];
  const premiumFeatures = [
    { label: "Full public prompt library", ok: true },
    { label: "Every premium prompt collection", ok: true },
    { label: "All future premium drops included", ok: true },
    { label: "Ad-free, distraction-free browsing", ok: true },
    { label: "Priority editorial picks", ok: true },
    { label: "Lifetime access — one payment", ok: true },
  ];

  return (
    <PageShell>
      <section className="relative overflow-hidden rounded-[32px]">
        <div className="glass-strong relative rounded-[32px] px-6 py-14 text-center sm:px-12 sm:py-20">
          <div
            className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-96 w-[36rem] rounded-full opacity-40 blur-3xl"
            style={{ background: "var(--gradient-primary)" }}
          />
          <div className="relative mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              One-time purchase · Lifetime access
            </div>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-6xl">
              Own the library.
              <br />
              <span className="gradient-text">Forever.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
              No subscriptions. No renewals. A single payment unlocks every premium
              prompt today — and every one we release from now on.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/checkout"
                className="btn-gradient inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
              >
                Get lifetime access
              </Link>
              <Link
                to="/libraries"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold"
              >
                Preview the library
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="mt-16 grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-[28px] p-8"
        >
          <h3 className="text-sm font-semibold text-muted-foreground">Free</h3>
          <div className="mt-1 text-4xl font-extrabold">{symbol}0</div>
          <p className="mt-2 text-sm text-muted-foreground">
            Great for getting started and exploring the free public prompts.
          </p>
          <ul className="mt-6 space-y-3">
            {freeFeatures.map((f) => (
              <li key={f.label} className="flex items-start gap-3 text-sm">
                <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${f.ok ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-muted-foreground"}`}>
                  {f.ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                </span>
                <span className={f.ok ? "" : "text-muted-foreground line-through"}>
                  {f.label}
                </span>
              </li>
            ))}
          </ul>
          <Link
            to="/libraries"
            className="mt-8 inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold"
          >
            Continue with Free
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: 0.05 }}
          className="glass-strong relative overflow-hidden rounded-[28px] p-8"
        >
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-30 blur-3xl"
            style={{ background: "var(--gradient-primary)" }}
          />
          <div className="relative">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="inline-flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="h-4 w-4 text-primary" /> Premium — Lifetime
              </h3>
              <span className="rounded-full bg-[image:var(--gradient-primary)] px-2.5 py-0.5 text-[11px] font-semibold text-white">
                Best value
              </span>
            </div>
            <div className="mt-1 flex items-end gap-2">
              <div className="text-4xl font-extrabold">{symbol}{price}</div>
              <div className="pb-1 text-sm text-muted-foreground">one-time · forever</div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Full access to every premium prompt, all future drops, and a distraction-free experience.
            </p>
            <ul className="mt-6 space-y-3">
              {premiumFeatures.map((f) => (
                <li key={f.label} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[image:var(--gradient-primary)] text-white">
                    <Check className="h-3 w-3" />
                  </span>
                  {f.label}
                </li>
              ))}
            </ul>
            <Link to="/checkout" className="btn-gradient mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold">
              <Sparkles className="h-4 w-4" /> Unlock lifetime access
            </Link>
            <div className="mt-3 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" /> UPI checkout · manually verified
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mt-20">
        <h2 className="text-center text-3xl font-extrabold tracking-tight">Frequently asked</h2>
        <div className="glass-card mx-auto mt-8 max-w-3xl rounded-3xl p-2 sm:p-4">
          <Accordion type="single" collapsible className="w-full">
            {[
              {
                q: "Is this a subscription?",
                a: "No. Premium is a one-time payment for lifetime access. There are no renewals, no monthly fees, and no auto-billing.",
              },
              {
                q: "How do I pay?",
                a: "Pay via UPI on the checkout page, then submit your UTR number and a payment screenshot. Access is enabled after a quick manual verification.",
              },
              {
                q: "Do I get future premium releases?",
                a: "Yes. Every premium prompt we publish in the future is included in your one-time purchase.",
              },
              {
                q: "Can I use the prompts commercially?",
                a: "Yes. You can use the prompts for personal and commercial projects. Output ownership follows the terms of the AI tool you use.",
              },
              {
                q: "Do you offer refunds?",
                a: "Refunds follow the terms in our refund policy. Contact us with your UTR number if something went wrong.",
              },
            ].map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-none">
                <AccordionTrigger className="rounded-2xl px-4 text-left text-sm font-semibold hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="px-4 text-sm text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Questions about billing?{" "}
          <Link to="/refund" className="underline underline-offset-4">
            Read our refund and cancellation policy
          </Link>
          .
        </p>
      </section>
    </PageShell>
  );
}
