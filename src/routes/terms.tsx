import { createFileRoute } from "@tanstack/react-router";
import { DbPage } from "@/components/db-page";

export const Route = createFileRoute("/terms")({
  component: () => (
    <DbPage slug="terms" fallbackTitle="Terms of Service" fallbackIntro="The rules for using this prompt library and its premium content." />
  ),
  head: () => ({
    meta: [
      { title: "Terms of Service — Prompt Library" },
      { name: "description", content: "The terms covering account use, prompt licensing, premium purchases, and acceptable use of this library." },
      { property: "og:title", content: "Terms of Service" },
      { property: "og:description", content: "Account, licensing, and acceptable use terms." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
});
