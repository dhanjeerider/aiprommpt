import { createFileRoute } from "@tanstack/react-router";
import { TaxonomyPage } from "@/components/taxonomy-page";
import { getTool } from "@/lib/data";

export const Route = createFileRoute("/tool/$slug")({
  component: ToolPage,
  head: ({ params }) => {
    const t = getTool(params.slug);
    const name = t?.name ?? params.slug;
    return {
      meta: [
        { title: `${name} Prompts — PrismPrompts` },
        { name: "description", content: `Prompts tuned and tested for ${name}.` },
        { property: "og:title", content: `${name} Prompts` },
        { property: "og:description", content: `Curated ${name} prompts.` },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `/tool/${params.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/tool/${params.slug}` }],
    };
  },
});

function ToolPage() {
  const { slug } = Route.useParams();
  const t = getTool(slug);
  return (
    <TaxonomyPage
      kind="tool"
      slug={slug}
      title={t?.name ?? slug}
      intro={`Prompts tested and tuned for ${t?.name ?? slug}. Copy, generate, refine.`}
    />
  );
}
