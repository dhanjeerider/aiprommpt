import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/static-page";

export const Route = createFileRoute("/terms")({
  component: () => (
    <StaticPage title="Terms & Conditions" intro="The ground rules for using PrismPrompts.">
      <p>By using PrismPrompts you agree to these terms. If you don't agree, please don't use the service.</p>
      <h2>Your account</h2>
      <p>You are responsible for keeping your account credentials secure and for activity that occurs under your account.</p>
      <h2>Prompt usage</h2>
      <p>Prompts on the site may be used for personal and commercial projects. Output rights follow the terms of the AI tool you use to generate the result.</p>
      <h2>Fair use</h2>
      <p>Automated scraping, reselling, or bulk redistribution of our library is not permitted.</p>
    </StaticPage>
  ),
  head: () => ({
    meta: [
      { title: "Terms & Conditions — PrismPrompts" },
      { name: "description", content: "Terms of service for PrismPrompts." },
      { property: "og:title", content: "Terms & Conditions" },
      { property: "og:description", content: "Ground rules for using PrismPrompts." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/terms" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
});
