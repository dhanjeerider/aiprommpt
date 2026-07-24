import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/static-page";

export const Route = createFileRoute("/refund")({
  component: () => (
    <StaticPage title="Cancellation & Refund" intro="Simple, fair, no surprises.">
      <p>Because Premium is a one-time purchase, there is nothing to cancel — you own it for life.</p>
      <h2>Refund window</h2>
      <p>If Premium isn't for you, request a refund within 14 days of purchase for a full return, no questions asked.</p>
      <h2>How to request</h2>
      <p>Email <strong>support@prismprompts.example</strong> from the address you used to purchase. Refunds are processed within 5–7 business days.</p>
    </StaticPage>
  ),
  head: () => ({
    meta: [
      { title: "Cancellation & Refund — PrismPrompts" },
      { name: "description", content: "PrismPrompts refund and cancellation policy." },
      { property: "og:title", content: "Cancellation & Refund" },
      { property: "og:description", content: "Simple, fair, no surprises." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/refund" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/refund" }],
  }),
});
