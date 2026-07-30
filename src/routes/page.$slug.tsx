import { createFileRoute } from "@tanstack/react-router";
import { DbPage } from "@/components/db-page";

export const Route = createFileRoute("/page/$slug")({
  component: () => {
    const { slug } = Route.useParams();
    return <DbPage slug={slug} fallbackTitle={slug.replace(/-/g, " ")} />;
  },
  head: ({ params }) => {
    const name = params.slug.replace(/-/g, " ");
    return {
      meta: [
        { title: `${name} — Prompt Library` },
        { name: "description", content: `${name} — information page from our curated AI prompt library.` },
        { property: "og:title", content: name },
        { property: "og:description", content: `${name} page.` },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/page/${params.slug}` }],
    };
  },
});
