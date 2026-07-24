// Central seed data for the Prism Prompts app.
export type Author = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
};

export type PromptPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  tool: string;
  style: string;
  author: Author;
  likes: number;
  copies: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
  relatedSlugs: string[];
  premium: boolean;
};

export type PromptLibrary = {
  slug: string;
  title: string;
  description: string;
  promptCount: number;
  coverGradient: string;
  categories: string[];
  tags: string[];
};

export type Category = { slug: string; name: string; count: number };
export type Tag = { slug: string; name: string };
export type Tool = { slug: string; name: string };
export type StyleT = { slug: string; name: string; count: number; gradient: string };

export const authors: Author[] = [
  { id: "1", name: "Aria Kessler", handle: "aria", avatar: "AK" },
  { id: "2", name: "Nikhil Rao", handle: "nikhil", avatar: "NR" },
  { id: "3", name: "Sora Lin", handle: "sora", avatar: "SL" },
  { id: "4", name: "Miles Okafor", handle: "miles", avatar: "MO" },
];

export const categories: Category[] = [
  { slug: "portraits", name: "Portraits", count: 128 },
  { slug: "landscape", name: "Landscape", count: 96 },
  { slug: "product", name: "Product", count: 74 },
  { slug: "editorial", name: "Editorial", count: 62 },
  { slug: "fashion", name: "Fashion", count: 58 },
  { slug: "architecture", name: "Architecture", count: 44 },
  { slug: "characters", name: "Characters", count: 82 },
  { slug: "abstract", name: "Abstract", count: 39 },
];

export const styles: StyleT[] = [
  { slug: "cinematic", name: "Cinematic", count: 84, gradient: "from-indigo-400 to-violet-500" },
  { slug: "editorial", name: "Editorial", count: 61, gradient: "from-rose-300 to-fuchsia-400" },
  { slug: "minimal", name: "Minimal", count: 47, gradient: "from-sky-300 to-blue-400" },
  { slug: "surreal", name: "Surreal", count: 39, gradient: "from-violet-400 to-purple-500" },
  { slug: "vintage", name: "Vintage", count: 42, gradient: "from-amber-300 to-orange-400" },
  { slug: "hyperreal", name: "Hyperreal", count: 55, gradient: "from-emerald-300 to-teal-400" },
  { slug: "noir", name: "Noir", count: 28, gradient: "from-slate-500 to-slate-800" },
  { slug: "dreamscape", name: "Dreamscape", count: 36, gradient: "from-pink-300 to-indigo-400" },
];

export const tools: Tool[] = [
  { slug: "midjourney", name: "Midjourney" },
  { slug: "dalle", name: "DALL·E" },
  { slug: "flux", name: "Flux" },
  { slug: "stable-diffusion", name: "Stable Diffusion" },
  { slug: "ideogram", name: "Ideogram" },
];

export const tags: Tag[] = [
  { slug: "portrait", name: "portrait" },
  { slug: "moody", name: "moody" },
  { slug: "studio-light", name: "studio-light" },
  { slug: "35mm", name: "35mm" },
  { slug: "warm-tones", name: "warm-tones" },
  { slug: "cinematic", name: "cinematic" },
  { slug: "editorial", name: "editorial" },
  { slug: "minimal", name: "minimal" },
  { slug: "high-fashion", name: "high-fashion" },
];

const img = (seed: string, w = 1200, h = 900) =>
  `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

const IMAGES = [
  img("1494790108377-be9c29b29330"),
  img("1524504388940-b1c1722653e1"),
  img("1531123897727-8f129e1688ce"),
  img("1520975916090-3105956dac38"),
  img("1520975922284-9c66f5a44b96"),
  img("1517841905240-472988babdf9"),
  img("1503023345310-bd7c1de61c7d"),
  img("1502823403499-6ccfcf4fb453"),
  img("1506794778202-cad84cf45f1d"),
  img("1500648767791-00dcc994a43e"),
  img("1544005313-94ddf0286df2"),
  img("1531891437562-4301cf35b7e4"),
];

const titles = [
  "Woman in Crimson Turtleneck, Editorial Portrait",
  "Golden Hour Cliffside, Cinematic Wide",
  "Studio Product Shot on Marble Plinth",
  "Neon Rain, Cyberpunk Alleyway",
  "Soft Morning Kitchen, Lifestyle Frame",
  "Character Sheet, Nordic Explorer",
  "Minimal Perfume Bottle, Cool Shadows",
  "Vintage 70s Film Grain Portrait",
  "Dreamscape Meadow, Pastel Sky",
  "Architectural Atrium, Long Exposure",
  "Fashion Runway, Backstage Candid",
  "Abstract Liquid Chrome Sculpture",
];

const excerpts = [
  "A close, editorial-grade portrait tuned for warm midtones and a shallow depth field.",
  "Sweeping cliff vista at low sun with volumetric haze and cinematic aspect.",
  "Clean studio composition for premium goods, soft rim light and controlled reflections.",
  "Rain-slicked back street with saturated neon signage and cinematic bokeh.",
  "Natural window light on a quiet countertop scene, muted linen textures.",
  "Full character reference sheet: front, side, three-quarter, expression pass.",
  "Minimal still life with drifting shadow bands and glass caustics.",
  "Grainy 70s emulsion look with faded palette and gentle vignette.",
  "Painterly meadow with pastel gradient sky and drifting particles.",
  "Long-exposure interior with polished floors and geometric light shafts.",
  "Documentary-style backstage frame with mixed tungsten and daylight.",
  "Fluid metallic form study, iridescent reflections on charcoal.",
];

const templates = [
  "cinematic portrait, {subject}, 35mm, shallow depth of field, warm rim light, studio backdrop, film grain, hyper-detailed, editorial mood --ar 3:4 --style raw",
  "wide cinematic landscape, {subject}, golden hour, volumetric fog, anamorphic lens flare, ultra detailed, atmospheric --ar 21:9",
  "high-end product photography, {subject}, marble plinth, soft top light, controlled reflections, premium editorial --ar 4:5",
  "neon cyberpunk alley, {subject}, rain, saturated magenta and cyan, cinematic bokeh, moody atmosphere --ar 16:9",
];

export const prompts: PromptPost[] = titles.map((title, i) => {
  const style = styles[i % styles.length].slug;
  const category = categories[i % categories.length].slug;
  const tool = tools[i % tools.length].slug;
  const author = authors[i % authors.length];
  const t = tags.slice(i % 4, (i % 4) + 4).map((x) => x.slug);
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const tpl = templates[i % templates.length].replace("{subject}", title.toLowerCase());
  return {
    slug,
    title,
    excerpt: excerpts[i],
    content: tpl,
    featuredImage: IMAGES[i % IMAGES.length],
    category,
    tags: t,
    tool,
    style,
    author,
    likes: 120 + i * 37,
    copies: 340 + i * 91,
    rating: 4.4 + ((i % 6) / 10),
    createdAt: new Date(2025, 6, 5 + i).toISOString(),
    updatedAt: new Date(2025, 8, 5 + i).toISOString(),
    relatedSlugs: [],
    premium: i % 3 === 0,
  };
});

// Fill related
prompts.forEach((p, i) => {
  p.relatedSlugs = [
    prompts[(i + 1) % prompts.length].slug,
    prompts[(i + 2) % prompts.length].slug,
    prompts[(i + 3) % prompts.length].slug,
    prompts[(i + 4) % prompts.length].slug,
  ];
});

export const libraries: PromptLibrary[] = [
  {
    slug: "editorial-portraits",
    title: "Editorial Portraits",
    description: "Studio-grade portrait prompts tuned for magazine covers and lookbooks.",
    promptCount: 42,
    coverGradient: "from-rose-300 via-fuchsia-300 to-indigo-400",
    categories: ["portraits", "fashion"],
    tags: ["portrait", "editorial"],
  },
  {
    slug: "cinematic-landscapes",
    title: "Cinematic Landscapes",
    description: "Anamorphic wide-frame vistas with painterly light and atmosphere.",
    promptCount: 36,
    coverGradient: "from-sky-300 via-indigo-400 to-violet-500",
    categories: ["landscape"],
    tags: ["cinematic"],
  },
  {
    slug: "premium-product",
    title: "Premium Product",
    description: "Marble, glass, brushed metal — refined stills for luxury brands.",
    promptCount: 28,
    coverGradient: "from-slate-200 via-slate-300 to-slate-500",
    categories: ["product"],
    tags: ["minimal", "studio-light"],
  },
  {
    slug: "surreal-dreamscapes",
    title: "Surreal Dreamscapes",
    description: "Painterly, otherworldly compositions with soft palettes and drift.",
    promptCount: 31,
    coverGradient: "from-pink-300 via-violet-400 to-purple-500",
    categories: ["abstract"],
    tags: ["moody"],
  },
  {
    slug: "character-sheets",
    title: "Character Sheets",
    description: "Turnaround references and expression passes for concept work.",
    promptCount: 24,
    coverGradient: "from-emerald-300 via-teal-400 to-cyan-500",
    categories: ["characters"],
    tags: ["portrait"],
  },
  {
    slug: "architectural-frames",
    title: "Architectural Frames",
    description: "Geometry-first interior and exterior compositions with long light.",
    promptCount: 19,
    coverGradient: "from-amber-200 via-orange-300 to-rose-400",
    categories: ["architecture"],
    tags: ["minimal"],
  },
];

export function getPromptBySlug(slug: string) {
  return prompts.find((p) => p.slug === slug);
}
export function getRelated(p: PromptPost) {
  return p.relatedSlugs
    .map((s) => prompts.find((x) => x.slug === s))
    .filter(Boolean) as PromptPost[];
}
export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}
export function getStyle(slug: string) {
  return styles.find((s) => s.slug === slug);
}
export function getTool(slug: string) {
  return tools.find((t) => t.slug === slug);
}
export function getTag(slug: string) {
  return tags.find((t) => t.slug === slug);
}
