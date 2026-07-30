import { createFileRoute } from "@tanstack/react-router";
import { DbPage } from "@/components/db-page";

export const Route = createFileRoute("/refund")({
  component: () => (
    <DbPage slug="refund" fallbackTitle="Refund Policy" fallbackIntro="How refunds and cancellations work for premium purchases." />
  ),
  head: () => ({
    meta: [
      { title: "Refund Policy — Premium Purchases" },
      { name: "description", content: "Refund and cancellation terms for one-time premium purchases, including timelines and how to request a refund." },
      { property: "og:title", content: "Refund Policy" },
      { property: "og:description", content: "Refund and cancellation terms for premium access." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/refund" }],
  }),
});
