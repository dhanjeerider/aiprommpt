import { createFileRoute } from "@tanstack/react-router";
import { TaxonomyPage } from "@/components/taxonomy-page";

export const Route = createFileRoute("/tag/$slug")({
  component: TagPage,
  head: ({ params }) => ({
    meta: [
      { title: `#${params.slug} — PrismPrompts` },
      { name: "description", content: `Prompts tagged #${params.slug}.` },
      { property: "og:title", content: `#${params.slug} prompts` },
      { property: "og:description", content: `Prompts tagged #${params.slug}.` },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `/tag/${params.slug}` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `/tag/${params.slug}` }],
  }),
});

function TagPage() {
  const { slug } = Route.useParams();
  return (
    <TaxonomyPage
      kind="tag"
      slug={slug}
      title={`#${slug}`}
      intro={`Every prompt tagged with #${slug}, sorted by community favorites.`}
    />
  );
}
