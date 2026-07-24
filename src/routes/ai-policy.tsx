import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/static-page";

export const Route = createFileRoute("/ai-policy")({
  component: () => (
    <StaticPage title="AI Policy" intro="How we think about AI-generated content.">
      <p>PrismPrompts curates prompts for use with third-party AI image tools. We do not host or distribute the models themselves.</p>
      <h2>Attribution</h2>
      <p>When you share output created from our prompts, we appreciate — but do not require — a mention of PrismPrompts.</p>
      <h2>Prohibited use</h2>
      <p>You may not use our prompts to generate content that is illegal, non-consensual, or that impersonates real individuals in a deceptive way.</p>
      <h2>Model changes</h2>
      <p>AI tools evolve. We test regularly and adjust prompt phrasing when a tool changes behavior, so premium collections stay useful over time.</p>
    </StaticPage>
  ),
  head: () => ({
    meta: [
      { title: "AI Policy — PrismPrompts" },
      { name: "description", content: "How PrismPrompts approaches AI-generated content." },
      { property: "og:title", content: "AI Policy" },
      { property: "og:description", content: "Our stance on AI-generated content." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/ai-policy" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/ai-policy" }],
  }),
});
