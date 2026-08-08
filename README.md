# Prompt Muse

Build a production-ready Next.js 14+ website that is visually inspired by https://promptplum.com/

https://promptplum.com/prompt/woman-red-turtleneck-profile-portrait/

https://promptplum.com/premium/

https://promptplum.com/libraries/



a premium AI prompt library, but do NOT copy exact text, logos, or brand assets. Recreate the layout language, spacing, hierarchy, and interaction patterns with original content adsense friendly .

STACK
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- lucide-react icons
- Framer Motion for subtle animations
- Use CSS variables for theme tokens
- Mobile-first, fully responsive
- Clean SEO-ready semantic markup

VISUAL DIRECTION
- Background: very light lavender / pale cool grey gradient
- Cards: white with slight transparency, soft shadow, 20–28px radius
- Borders: thin, faint cool-grey borders
- Accent colors: electric blue + soft violet
- Typography: Inter or Manrope, bold headline contrast, compact body copy
- Overall feel: airy, premium, modern, editorial, minimal
- Use lots of whitespace
- Buttons should be pill-shaped with soft hover states
- Panels should feel layered and floating, not rigid
- Keep everything polished like a high-end prompt marketplace

INFORMATION ARCHITECTURE
Create these routes:

1) Home `/`
- Floating top navbar with:
  - logo left
  - centered nav links
  - search icon
  - profile/icon buttons
  - premium CTA button
- Hero section:
  - left or center featured prompt showcase
  - big preview card
  - prompt title
  - short description
  - copy button
  - save/like button
  - small author/meta line
- Sections:
  - Popular category chips
  - Latest / Trending / Popular tab switcher
  - Grid of featured prompt cards
  - “Browse by Style” card grid with counts
  - CTA strip for premium
- Footer:
  - brand blurb
  - quick links
  - legal links
  - social icons
  - copyright

2) Libraries `/libraries`
- Search bar at top
- Filter chips by category, style, subject, mood, tool
- A-Z / Most Popular toggle
- Responsive grid of library cards
- Each card shows:
  - library title
  - short summary
  - prompt count
  - category label
  - cover thumbnail or gradient placeholder
- Pagination / load more
- Empty state and loading skeletons

3) Prompt detail `/prompt/[slug]`
- Breadcrumbs
- Large image or preview card
- Title
- Author/meta line
- Tool badge
- Copy button
- Save button
- Like count
- Rating box
- Tags section
- Prompt text panel with readable monospaced-ish feel
- “You might also like” related prompt cards
- Sticky secondary actions on desktop
- Clean share buttons

4) Premium `/premium`
- Strong hero headline
- Explain free vs premium
- One-time lifetime purchase layout
- No subscription messaging
- Comparison card
- Premium benefits:
  - ad-free
  - unlocked premium prompts
  - future premium releases
- Big CTA
- FAQ
- Refund/cancellation link area

5) Taxonomy pages
- `/category/[slug]`
- `/tag/[slug]`
- `/style/[slug]`
- `/tool/[slug]`
Each page should show:
- page title
- short intro
- filter/sort controls
- card grid of prompts
- related taxonomy sidebar on desktop

6) Static pages
- About
- Contact
- Privacy Policy
- Terms & Conditions
- AI Policy
- Cancellation & Refund

CONTENT MODEL
Create a simple data layer with seed content and reusable types.

Types:
- PromptPost
- PromptLibrary
- Category
- Tag
- Tool
- Author

PromptPost fields:
- slug
- title
- excerpt
- content
- featuredImage
- category
- tags[]
- tool
- author
- likes
- copies
- rating
- createdAt
- updatedAt
- relatedSlugs[]
- premium boolean

PromptLibrary fields:
- slug
- title
- description
- promptCount
- coverImage
- categories[]
- tags[]

Use mock JSON or local TS data with enough sample content to make the app feel real.

SAMPLE SITE CONTENT STYLE
- Reword all visible copy originally, but keep the same functional meaning:
  - browse prompts
  - copy and generate images
  - categories by style
  - premium ad-free access
  - tested prompts optimized for major AI tools
- Do not reuse exact sentences from the reference site
- Keep names original, elegant, and premium-sounding

DESIGN TOKENS
Use these CSS variables in globals:
```css
:root {
  --bg: 240 100% 97%;
  --surface: 0 0% 100%;
  --surface-soft: 240 40% 98%;
  --border: 230 30% 90%;
  --text: 222 47% 11%;
  --muted: 215 16% 47%;
  --primary: 221 83% 55%;
  --secondary: 262 83% 58%;
  --ring: 221 83% 55%;
  --shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}


Then wire these into Tailwind theme classes.

COMPONENTS TO CREATE

SiteHeader

FloatingSearch

HeroFeaturedPrompt

PromptTabs

PromptCard

LibraryCard

StyleGridCard

TagPill

RatingPanel

CopyButton

SaveButton

LikeButton

PromptPreviewPanel

RelatedPromptsGrid

PremiumComparison

Footer

SEOJsonLd

SkeletonCard

FilterBar

MobileBottomNav

INTERACTION REQUIREMENTS

Search should filter cards instantly

Tabs should switch latest / trending / popular

Cards should animate in with gentle fade/slide

Copy button should use clipboard API and show success toast

Save/like should be optimistic UI state

Detail image preview should have thumbnail strip

Premium CTA should stay visually prominent

On mobile, collapse nav into a clean bottom sheet or compact top bar

On desktop, keep layout centered with a max width and elegant card stacking

SEO REQUIREMENTS

Proper metadata for every route

OpenGraph and Twitter cards

Canonical URLs

JSON-LD for prompt posts and libraries

Indexable category/tag pages

Descriptive H1/H2 structure

Fast loading and image optimization

RESPONSIVENESS

Home should look premium on 390px mobile widths

Detail page should stack naturally on mobile

Sidebars become drawers on small screens

Grid should move from 1 column to 2, 3, 4 as viewport grows

QUALITY BAR

Make it feel like a real polished SaaS/content marketplace

No generic template look

No broken spacing

No placeholder lorem ipsum in the final UI

No over-animated effects

No harsh shadows

No low-contrast text

No exact branding from the reference site

DELIVERABLE Generate the full app with:

complete page layouts

reusable components

sample data

responsive styling

polished interactions

clean code organization

ready-to-edit content


Agar chaho to next message me main isko aur tight karke “Lovable one-shot super prompt” version de dunga, ya direct Next.js folder structure + component code bana dunga.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8d2edc42-a180-45ff-bbac-122057060c67).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
