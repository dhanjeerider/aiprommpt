import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/static-page";

export const Route = createFileRoute("/contact")({
  component: () => (
    <StaticPage
      title="Contact"
      intro="Questions, partnerships, or press — we'd love to hear from you."
    >
      <p>
        For general inquiries email <strong>hello@prismprompts.example</strong>.
      </p>
      <p>
        For premium billing questions, refunds, or account help, email{" "}
        <strong>support@prismprompts.example</strong>. We reply within one business day.
      </p>
      <p>
        For partnerships and licensing, reach out to{" "}
        <strong>partners@prismprompts.example</strong>.
      </p>
    </StaticPage>
  ),
  head: () => ({
    meta: [
      { title: "Contact — PrismPrompts" },
      { name: "description", content: "Reach the PrismPrompts team." },
      { property: "og:title", content: "Contact PrismPrompts" },
      { property: "og:description", content: "Get in touch with our team." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/contact" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
});
