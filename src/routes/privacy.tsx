import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/static-page";

export const Route = createFileRoute("/privacy")({
  component: () => (
    <StaticPage title="Privacy Policy" intro="How we handle your data.">
      <p>We collect only what we need to run the service: account email, saved prompts, and anonymized analytics.</p>
      <h2>Cookies</h2>
      <p>We use essential cookies for sign-in and preference storage, and privacy-respecting analytics to understand usage in aggregate.</p>
      <h2>Data you control</h2>
      <p>You can request an export or deletion of your account data at any time via <strong>support@prismprompts.example</strong>.</p>
      <h2>Advertising</h2>
      <p>Free browsing may include contextual advertising. Premium members browse fully ad-free.</p>
    </StaticPage>
  ),
  head: () => ({
    meta: [
      { title: "Privacy Policy — PrismPrompts" },
      { name: "description", content: "How PrismPrompts handles your personal data." },
      { property: "og:title", content: "Privacy Policy" },
      { property: "og:description", content: "How we handle your data." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/privacy" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
});
