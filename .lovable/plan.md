## Goal

Rebuild the site to visually and structurally match promptplum.com 1:1 (home, libraries, library detail, prompt detail, premium), remove Copy buttons, add Google Ads slots between cards, and build an admin panel to manage pages, posts, and all front-end content. Fully responsive on mobile — everything centered, matching the uploaded screenshots (dark navy theme, pill header, gradient text, rounded cards with heart badge + category chip).

## 1. Design system rebuild (match PromptPlum exactly)

- **Colors**: Dark navy background `#0B1120` / light mode `#EEF2FF`. Blue primary `#3B82F6`, gradient text `linear-gradient(90deg, #3B82F6, #A855F7, #EC4899)`.
- **Font**: Nunito (700/800/900 for headings, 400/600 body) via Google Fonts link in `__root.tsx`.
- **Header**: single floating pill containing logo (left) + 4 circular icon buttons on right — Crown (Premium), Smile (Categories), Search, Sun/Moon (theme). Same on mobile — no hamburger. Center-aligned, full width pill on mobile.
- **Card style**: rounded-3xl, image-first, category chip top-left ("BOYS", "NEW", "PREMIUM"), heart+count pill top-right. No copy button on card. Title + author line below image.
- Tokens defined once in `src/styles.css` (HSL vars + gradient + shadow), reused across every card, chip, button.

## 2. Pages (match PromptPlum layout & sizes)

- **/** Home: pill header → grid-bg hero with big heading + gradient sub-heading + subtitle + rounded search bar with blue circular submit + "Popular: Men / Woman / Couple / Family / Birthday" → Latest/Trending/Popular pill tab bar → **2-column card grid on mobile**, 3-col desktop, with an **AdSlot** injected every 6 cards (spans 1 column, shows "ADVERTISEMENT" placeholder styled like a card) like and save saved on user profile of logged in of not save on local storage as anyknoemus user enable google login for visitors.
- **/libraries**: "Browse by Style" grid of library cards category cards (letter avatar + name + count) — 3-col mobile, matching screenshot.
- **/library/$slug** (renamed from category): library header + prompt grid + ad slots.
- **/prompt/$slug**: breadcrumb pill (Home > Libraries > Category) → large image card with prev/next arrows + thumbnail strip → "PROMPT DETAIL" chip → big title → "Shared by @author can be seted from admin • date" → PROMPT card with sparkle icon + "Optimized for Gemini" + Save button top-right + prompt text + orange gradient **Copy** button + red gradient **Liked N** button (this Copy is the in-detail action button, kept per screenshots; the removed one is the card-level copy button) → Share card with social circles → Community Rating card (5.0 stars + bar chart + Your Score + Share Feedback) → Model or Tool chip → Tags chips → "You might also like" 2-col grid → "Browse by Style" grid → footer.
- **/premium**: match PromptPlum premium page layout add upi manual payment verification system by pay and submit screenshot and UTR no.  Qr and I'd can be seted from adminsetting.
- **/admin**: new — protected admin panel for managing genres posts pages seo setting payment setting adsense ad placement on different spaces.

## 3. Remove Copy button from cards

Delete Copy CTA from `PromptCard`. Keep Copy only inside the prompt detail page's prompt block (as shown in the screenshot).

## 4. Ad slots

- New `<AdSlot />` component: matches card size, "ADVERTISEMENT" label, dashed inner border, ready to swap for real AdSense `<ins class="adsbygoogle">` code. Placed:
  - Home grid: after cards 5, 11, 17…
  - Library detail grid: after cards 5, 11…
  - Prompt detail: one horizontal banner ad between prompt block and Share card.

## 5. Admin panel (Lovable Cloud)

Enable Lovable Cloud. Tables:

- `posts` (id, slug, title, excerpt, content_prompt, featured_image featured_img_url, category, tags[], tool, style, premium, likes, saves, start_rating, published, created_at)
- `libraries` (id, slug, title, description, cover_gradient or cover_img and category_img, tags[])
- `pages` (id, slug, title, body_md, published) — for About / Privacy / Terms / etc.
- `site_settings` (single row: site_title, hero_title, hero_subtitle, popular_tags[], ad_client_id, ad_slot_home, ad_slot_detail), site identify, logo backup and restore analytics
- `user_roles` + `has_role()` — admin gate.

Admin routes under `/_authenticated/admin/*`:

- `/admin` dashboard — counts + quick links
- `/admin/posts` list + create/edit/delete ( all image upload to [freeimage.host](http://freeimage.host)  request url [https://freeimage.host/api/1/upload](https://freeimage.host/api/1/upload) key 6d207e02198a847aa98d0a2a901485a5 )
- `/admin/libraries` CRUD
- `/admin/pages` CRUD
- `/admin/settings` — hero copy, popular tags, AdSense IDs

Front-end reads posts/libraries/pages/settings from Cloud via server functions; falls back to seed data during first load but I can edit and delete by selecting all and bulc delete from admin panel.

Auth: `/auth` page (email/password) Google . Only users with `admin` role reach `/admin/*`.

## 6. Mobile responsiveness

- All hero content center-aligned, `text-center`, generous vertical padding.
- Header pill full-width with 12px margin, icons scale to 40px.
- Grid: `grid-cols-2` at base, `sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`.
- Cards fill column, image aspect `4/5`.
- Verify at 360px, 390px, 768px.

## 7. Tech details

- Nunito font loaded via `<link>` in `__root.tsx` head.
- Grid background: SVG `background-image` pattern on hero section.
- Framer motion kept subtle (fade + 8px slide).
- Server functions in `src/lib/*.functions.ts`, guarded with `requireSupabaseAuth` + `has_role('admin')` for writes.
- Public reads use anon key with RLS `USING (published = true)`.

## Deliverables

Updated: `styles.css`, `site-header.tsx`, `prompt-card.tsx` (no copy), `library-card.tsx`, all route files listed, new `AdSlot`, new `/admin/*` routes, Cloud migration, `/auth` route.

Do you want me to proceed with all of this in one pass? If yes, I'll enable Lovable Cloud and start building. all image upload to freeimage.host  request url https://freeimage.host/api/1/upload key 6d207e02198a847aa98d0a2a901485a5 