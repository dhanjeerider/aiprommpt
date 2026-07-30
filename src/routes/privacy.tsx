import { createFileRoute } from "@tanstack/react-router";
import { DbPage } from "@/components/db-page";

export const Route = createFileRoute("/privacy")({
  component: () => (
    <DbPage slug="privacy" fallbackTitle="Privacy Policy" fallbackIntro="How we collect, use, and protect your information." />
  ),
  head: () => ({
    meta: [
      { title: "Privacy Policy — Prompt Library" },
      { name: "description", content: "Read how we handle personal data, cookies, analytics, and advertising on our AI prompt library." },
      { property: "og:title", content: "Privacy Policy" },
      { property: "og:description", content: "Data, cookies, analytics, and advertising practices." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
});
