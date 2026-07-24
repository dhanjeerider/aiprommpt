import { createFileRoute } from "@tanstack/react-router";
import { TaxonomyPage } from "@/components/taxonomy-page";
import { getCategory } from "@/lib/data";

export const Route = createFileRoute("/category/$slug")({
  component: CategoryPage,
  head: ({ params }) => {
    const c = getCategory(params.slug);
    const name = c?.name ?? params.slug;
    return {
      meta: [
        { title: `${name} Prompts — PrismPrompts` },
        { name: "description", content: `Browse curated ${name} prompts tested across major AI image tools.` },
        { property: "og:title", content: `${name} Prompts` },
        { property: "og:description", content: `Curated ${name} prompt collection.` },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `/category/${params.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/category/${params.slug}` }],
    };
  },
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const c = getCategory(slug);
  return (
    <TaxonomyPage
      kind="category"
      slug={slug}
      title={c?.name ?? slug}
      intro={`Explore hand-picked ${c?.name.toLowerCase() ?? slug} prompts — tuned for editorial-grade output across major AI image tools.`}
    />
  );
}
