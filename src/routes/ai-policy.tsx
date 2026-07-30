import { createFileRoute } from "@tanstack/react-router";
import { DbPage } from "@/components/db-page";

export const Route = createFileRoute("/ai-policy")({
  component: () => (
    <DbPage slug="ai-policy" fallbackTitle="AI Content Policy" fallbackIntro="How AI-generated imagery and prompts are handled on this site." />
  ),
  head: () => ({
    meta: [
      { title: "AI Content Policy — Prompt Library" },
      { name: "description", content: "Our policy on AI-generated images, prompt authorship, attribution, and responsible use of generative tools." },
      { property: "og:title", content: "AI Content Policy" },
      { property: "og:description", content: "Responsible use, attribution, and AI-generated imagery." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/ai-policy" }],
  }),
});
