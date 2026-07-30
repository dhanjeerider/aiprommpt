import { createFileRoute } from "@tanstack/react-router";
import { DbPage } from "@/components/db-page";

export const Route = createFileRoute("/about")({
  component: () => (
    <DbPage
      slug="about"
      fallbackTitle="About us"
      fallbackIntro="A curated library of tested AI prompts, built for creators who care about the final frame."
    />
  ),
  head: () => ({
    meta: [
      { title: "About — Curated AI Prompt Library" },
      { name: "description", content: "Learn who curates this AI prompt library, how prompts are tested, and what free and premium access include." },
      { property: "og:title", content: "About our prompt library" },
      { property: "og:description", content: "How we curate and test every AI prompt we publish." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
});
