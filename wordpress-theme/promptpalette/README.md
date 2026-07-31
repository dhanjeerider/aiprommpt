# PromptPalette — WordPress theme

The full PromptPalette site rebuilt as a classic WordPress theme. WordPress is the backend, so there is **no Supabase / external database** — posts, users, media, settings and orders all live in WordPress.

## Install

1. Zip the `promptpalette` folder (or upload it to `wp-content/themes/`).
2. Appearance → Themes → Add New → Upload Theme → Activate.
3. Visit Settings → Permalinks once and hit Save (refreshes prompt URLs).

## Create the pages

Create these pages and assign the page template in the editor sidebar:

| Page slug   | Template          |
|-------------|-------------------|
| `libraries` | Libraries         |
| `premium`   | Premium           |
| `checkout`  | Checkout (UPI)    |
| `about`, `contact`, `privacy`, `terms`, `refund`, `ai-policy` | default |

Then set a static front page (Settings → Reading) or leave the default — `front-page.php` renders the hero + tabs + grid either way.

## Managing everything from wp-admin

- **Prompts** → add/edit/delete prompts. Each prompt supports:
  - featured image (used by cards, locked to a 2:3 crop)
  - **multiple prompts in one post**, each with its own demo image; the front-end shows numbered badges 1, 2, 3 matching image ↔ prompt
  - likes / copies / saves / rating fields, premium toggle
  - Libraries, Prompt Tags, Tools, Styles taxonomies
  - a **View** button in the list table
- **PromptPalette → Settings** — hero copy, logo, favicon, popular tags, AdSense client + 3 ad slots, UPI ID/QR, premium price & note, Google Analytics, social links.
- **PromptPalette → Sitemap Importer** — paste a sitemap URL, it fetches each prompt page, extracts the full prompt text, images, tags and library, and **skips any slug already published** so nothing duplicates.
- **Premium Orders** — every UPI checkout submission with email, UTR, screenshot; set status pending / approved / rejected. Admin also gets an email.
- **Appearance → Menus** — `Primary`, `Footer — Explore`, `Footer — Company` menu locations, so header and footer links are fully manual.

## Front-end features

Pill glass header with icon buttons and mobile menu, hero with grid backdrop, Latest/Trending/Popular sort tabs, 1-/2-column mobile grid toggle (remembered), AdSense slot injected every 8 cards, prompt detail with big 2:3 image, click-to-zoom lightbox + download buttons, numbered gallery, per-prompt copy buttons (copy counter tracked), AJAX likes, star rating that averages server-side, related prompts, JSON-LD structured data, SEO title tags, responsive down to 360px.

## Notes

- Ads only render when both the AdSense client and the matching slot ID are filled in — keeps the layout AdSense-policy friendly.
- Likes/ratings are stored per post meta; browsers remember their own vote in `localStorage`.
