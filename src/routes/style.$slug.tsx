import { createFileRoute } from "@tanstack/react-router";
import { TaxonomyPage } from "@/components/taxonomy-page";
import { getStyle } from "@/lib/data";

export const Route = createFileRoute("/style/$slug")({
  component: StylePage,
  head: ({ params }) => {
    const s = getStyle(params.slug);
    const name = s?.name ?? params.slug;
    return {
      meta: [
        { title: `${name} Style Prompts — PrismPrompts` },
        { name: "description", content: `${name} style prompts, tuned for consistent, editorial-grade output.` },
        { property: "og:title", content: `${name} Style Prompts` },
        { property: "og:description", content: `Prompts in the ${name} style.` },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `/style/${params.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/style/${params.slug}` }],
    };
  },
});

function StylePage() {
  const { slug } = Route.useParams();
  const s = getStyle(slug);
  return (
    <TaxonomyPage
      kind="style"
      slug={slug}
      title={s?.name ?? slug}
      intro={`Prompts crafted in the ${s?.name.toLowerCase() ?? slug} visual language — repeatable, refined, ready to render.`}
    />
  );
}
