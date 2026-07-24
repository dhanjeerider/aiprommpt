import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/static-page";

export const Route = createFileRoute("/about")({
  component: () => (
    <StaticPage
      title="About PrismPrompts"
      intro="A curated library of tested prompts, built for creators who care about the final frame."
    >
      <p>
        PrismPrompts is a hand-curated library of prompts for the leading AI image
        tools. Every entry is written and tested by working creatives, then tuned
        for repeatability across Midjourney, DALL·E, Flux, Stable Diffusion, and Ideogram.
      </p>
      <h2>Our approach</h2>
      <p>
        We treat prompts like editorial recipes. Each one is documented with the
        tools it's tuned for, the visual style it produces, and the tags that let
        you cross-reference moods and subjects across the library.
      </p>
      <h2>Free and premium</h2>
      <p>
        A generous free tier gives you access to the public library. Premium is a
        one-time purchase that unlocks every premium collection — and every future
        premium release — with no subscription, ever.
      </p>
    </StaticPage>
  ),
  head: () => ({
    meta: [
      { title: "About — PrismPrompts" },
      { name: "description", content: "About the PrismPrompts curated prompt library." },
      { property: "og:title", content: "About PrismPrompts" },
      { property: "og:description", content: "Meet the curated prompt library." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/about" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
});
