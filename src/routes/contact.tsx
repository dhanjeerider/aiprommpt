import { createFileRoute } from "@tanstack/react-router";
import { DbPage } from "@/components/db-page";

export const Route = createFileRoute("/contact")({
  component: () => (
    <DbPage slug="contact" fallbackTitle="Contact" fallbackIntro="Questions about prompts, premium access, or billing? Reach out." />
  ),
  head: () => ({
    meta: [
      { title: "Contact — Prompt Library Support" },
      { name: "description", content: "Get in touch about prompt requests, premium access, billing questions, or partnership enquiries." },
      { property: "og:title", content: "Contact us" },
      { property: "og:description", content: "Support for prompts, premium access, and billing." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
});
