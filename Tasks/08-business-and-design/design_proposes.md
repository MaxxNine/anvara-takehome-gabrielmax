# Homepage B Variant Design Proposals

## Why this document exists

We need a real landing page for Anvara, not a placeholder hero. This document frames the homepage as a growth surface for a two-sided marketplace and proposes visual directions that can later be implemented as a full-page experiment.

This is intentionally not based on the current `variant B` hero in code. That existing variation can be ignored. The goal here is to define a stronger homepage concept from first principles.

---

## Product truths we should design around

- Anvara is a **two-sided marketplace**:
  - **Sponsors** want trusted inventory, quick discovery, clear pricing, and fast campaign setup.
  - **Publishers** want demand, recurring revenue, simple listing, and visibility.
- The product already has concrete inventory objects:
  - display
  - video
  - newsletter
  - podcast
- Pricing is legible and marketplace-like (`$X/mo`), which means the homepage should feel closer to a **curated commerce product** than a vague SaaS site.
- The homepage should reduce uncertainty fast:
  - What is this?
  - Who is it for?
  - Why is this better than email chains / cold outreach / manual sponsorship sales?
- The homepage should create confidence in **liquidity**:
  - inventory exists
  - publishers exist
  - sponsors can browse
  - the system is structured, not ad hoc

---

## Core growth strategy

The homepage should not split attention too early with equal-weight messaging for both roles. The correct structure is:

1. Lead with the market-level value proposition.
2. Immediately clarify the two audiences.
3. Show proof that the marketplace has real inventory structure.
4. Explain the workflow in a low-friction, high-confidence way.
5. End with role-based CTAs.

Recommended primary CTA structure:

- Primary CTA: `Get started`
- Secondary CTA: `Browse marketplace`

Reasoning:

- `Get started` is the conversion action.
- `Browse marketplace` lowers commitment and gives skeptical visitors a proof-oriented path.
- A two-sided marketplace benefits from a visible exploration path because it signals real supply.

---

## Recommended page architecture

All directions below should roughly use this information architecture:

1. Hero
2. Social proof / market confidence strip
3. Role split: sponsors vs publishers
4. Marketplace preview
5. How it works
6. Benefits / feature grid
7. Optional testimonial or trust statement
8. Final CTA block

This is enough structure to feel credible without becoming a long enterprise site.

---

## Direction 1: Editorial Marketplace

### Positioning

Anvara feels like a premium media marketplace. Clean, high-contrast, editorial, confident. Less “startup SaaS dashboard”, more “modern media buying platform”.

### Best use case

Use this if we want the homepage to feel premium, trustworthy, and brand-forward without relying on heavy illustration.

### Conversion hypothesis

A more editorial and premium presentation will increase trust for both sides of the marketplace, especially sponsors who need to believe inventory quality is curated.

### Visual language

- Strong typography
- Generous whitespace
- Minimal chrome
- Large headlines
- Elegant card system
- Soft but noticeable color blocking

### Color system

This direction should not keep the current default indigo/green pairing as-is. It feels generic.

Suggested palette:

- Background: `#F6F1E8`
- Surface: `#FFFDF9`
- Foreground: `#161616`
- Muted text: `#5F5A54`
- Primary accent: `#C96F3B`
- Primary hover: `#A85B2E`
- Secondary accent: `#1F5C4A`
- Border: `#DED6CB`

Why:

- Warm editorial neutrals make the brand feel more mature.
- Burnt orange gives energy and call-to-action contrast.
- Deep green grounds the marketplace / publisher / growth angle.

### Typography

Recommended pairing:

- Headings: `Manrope`, `Sora`, or `Plus Jakarta Sans`
- Body/UI: `Inter` or `Instrument Sans`

Preferred reference mood:

- tight bold display type
- slightly condensed feeling
- strong line-length discipline

### Hero concept

Left-aligned editorial hero with asymmetric layout:

- Left column:
  - eyebrow
  - strong headline
  - subheadline
  - dual CTA row
  - compact trust strip
- Right column:
  - stacked marketplace cards showing slot types, publishers, and pricing

Suggested headline territory:

- `Where sponsors find inventory and publishers turn audience into revenue.`
- `A sponsorship marketplace built for faster matches, clearer pricing, and better media partnerships.`

### Hero media

No generic illustration. Use a composed UI collage:

- one larger featured ad slot card
- smaller cards for newsletter / podcast / video
- subtle status chips like `Available`, `Booked`, `$2,500/mo`

This is important because the actual product already has structured marketplace cards. The homepage should hint at that real interface.

### Section styling

- Role split section as two oversized cards with distinct accent borders
- Marketplace preview as a 3-column card rail
- How it works as numbered editorial steps
- Final CTA as full-width warm block with dark text and strong button

### Motion

- Hero card stack rises in with stagger
- Price chips fade upward
- Hover on preview cards adds lift and border emphasis
- Keep motion subtle; this direction should feel polished, not flashy

### Image / video guidance

Avoid stock photos of “people in meeting room”. If imagery is used, prefer:

- abstract editorial photography with crop-heavy composition
- hands-on-device macro shots
- media textures
- audio waveform, newsletter layout, browser ad-frame fragments

### Reference search prompts

- `editorial saas landing page warm neutral marketplace`
- `media buying platform landing page premium`
- `modern finance landing page beige black orange`
- `b2b marketplace web design editorial cards`

### Risks

- If pushed too minimal, it may under-signal product energy.
- Needs disciplined typography to avoid feeling plain.

---

## Direction 2: Liquid Marketplace

### Positioning

Anvara feels dynamic, current, and inventory-rich. This direction emphasizes motion, discovery, and the idea that supply and demand are actively flowing through the platform.

### Best use case

Use this if we want the strongest “this is an active marketplace” signal and the most obvious contrast against the plain current homepage.

### Conversion hypothesis

Showing marketplace density, live-looking inventory, and multi-format placements will increase sponsor confidence and make publishers perceive the product as a real source of demand.

### Visual language

- Layered gradients
- Rich cards
- Data-like chips
- Rounded containers
- High information density in the hero
- Distinct category color coding

### Color system

Suggested palette:

- Background: `#F3F7F6`
- Surface: `#FFFFFF`
- Foreground: `#102019`
- Muted text: `#5D6B65`
- Primary accent: `#0F766E`
- Primary hover: `#115E59`
- Secondary accent: `#E85D2A`
- Tertiary accent: `#2563EB`
- Border: `#D6E2DE`

Category chips:

- Display: blue
- Video: coral/red
- Newsletter: teal
- Podcast: amber

Why:

- Teal gives a more differentiated, marketplace-credible tone than default indigo.
- Coral adds urgency and action.
- Category color-coding helps the inventory model feel tangible.

### Typography

Recommended pairing:

- Headings: `Space Grotesk` or `Sora`
- Body/UI: `Inter` or `DM Sans`

This direction benefits from a slightly more modern, geometric type system.

### Hero concept

A wide, immersive hero with a dense visual composition:

- left side: headline, supporting copy, CTA row
- right side: floating inventory cards, publisher badges, and pricing pills
- background: soft gradient mesh with subtle grid pattern

Suggested headline territory:

- `The fastest way to match sponsor demand with publisher inventory.`
- `Browse placements, compare pricing, and launch sponsorships without the spreadsheet chaos.`

### Hero media

Main visual should look like a hybrid of:

- marketplace cards
- campaign metadata chips
- availability states
- publisher network panel

Think “productized supply map”, not generic dashboard screenshot.

### Distinctive sections

#### Confidence strip

A horizontal band directly under hero with 3 to 5 proof statements:

- `Display, video, podcast, and newsletter placements`
- `Structured pricing and availability`
- `Built for sponsors and publishers`

#### Marketplace preview

This section should be visually central. Use a grid showing:

- slot name
- type
- publisher
- price
- availability

The homepage should visibly connect to the actual marketplace experience.

#### Role split

Use tab-like or side-by-side panels:

- Sponsors: discover, compare, book
- Publishers: list, price, earn

#### How it works

Use a 3-step flow with arrows or flow-line treatment:

1. Discover inventory
2. Match placements to campaign goals
3. Book and manage sponsorships

### Motion

This direction can support more visible animation:

- floating cards on page load
- gradient background drift
- chip counters sliding in
- hover reveal for inventory metadata

Keep performance in mind. Motion should be CSS-driven and optional on reduced-motion.

### Image / video guidance

Best media option:

- short muted loop showing layered inventory cards and campaign interactions

Fallback:

- fully composited static UI art

If video is used:

- max 6 to 10 seconds loop
- no literal software walkthrough
- no busy cursor choreography
- emphasis on pace, organization, and category variety

### Reference search prompts

- `marketplace landing page gradient cards b2b`
- `fintech saas landing page teal orange`
- `inventory management landing page modern`
- `data rich landing page floating cards`
- `modern startup homepage ui grid gradient`

### Risks

- Can become noisy if every element is competing.
- Needs tight spacing discipline to avoid “template” energy.

---

## Direction 3: Creator Network Premium

### Positioning

Anvara feels like the bridge between brands and modern creators/publishers. This direction leans more into the publisher side and the media ecosystem, while still keeping the sponsor path credible.

### Best use case

Use this if we want a more emotionally differentiated brand and a stronger appeal to publishers.

### Conversion hypothesis

A more brand-led and creator-network visual system can increase publisher sign-up intent by making Anvara feel aspirational rather than transactional.

### Visual language

- Dark ink text on light surfaces
- Bold typography
- Large color fields
- Strong collage or poster-like composition
- More expressive than typical B2B SaaS

### Color system

Suggested palette:

- Background: `#FBF7F2`
- Surface: `#FFFDFC`
- Foreground: `#111111`
- Muted text: `#625B55`
- Primary accent: `#D9485F`
- Secondary accent: `#235789`
- Tertiary accent: `#F2A65A`
- Border: `#E7DDD2`

Why:

- This palette feels more campaign/media/creative than software-only.
- It gives room for posters, editorial blocks, and stronger role-led storytelling.

### Typography

Recommended pairing:

- Headings: `Clash Display`, `Cabinet Grotesk`, or `General Sans`
- Body/UI: `Inter` or `Public Sans`

This direction needs a more expressive heading face to work.

### Hero concept

A centered hero with strong poster energy:

- bold statement headline
- short supporting copy
- CTA row
- below-the-fold visual collage of channels:
  - newsletter module
  - podcast tile
  - video frame
  - display mock

Suggested headline territory:

- `Turn audience attention into structured sponsorship revenue.`
- `A better marketplace for brands buying reach and publishers selling it.`

### Hero media

Use a collage with channel fragments rather than a clean product screenshot.

Possible composition:

- newsletter block screenshot fragment
- podcast waveform card
- video thumbnail frame
- display banner crop
- all tied together with consistent chips and price tags

### Distinctive sections

#### “Built for both sides”

This should be a dramatic split layout:

- one half sponsor-oriented
- one half publisher-oriented

#### Format diversity section

Show that Anvara is not just banner inventory:

- newsletters
- podcasts
- video integrations
- display placements

#### Final CTA

Role-specific CTA cards:

- `I’m a sponsor`
- `I’m a publisher`

### Motion

- collage elements reveal with slight stagger
- light parallax on scroll
- animated underline / border accents

### Image / video guidance

This is the direction most compatible with real-world media textures:

- creator desk closeups
- recording setup fragments
- newsletter layout fragments
- browser ad placements in situ

Avoid influencer-style selfie imagery. Keep it premium and network-oriented.

### Reference search prompts

- `editorial creator economy landing page`
- `modern media brand website typography collage`
- `creative b2b landing page bold layout`
- `campaign landing page poster style web design`

### Risks

- Can drift too far into brand expression and lose product clarity.
- Requires more restraint to stay credible for sponsor buyers.

---

## Recommended direction

### Recommendation: Direction 2, with typography discipline from Direction 1

This is the strongest homepage B-variant candidate.

Why:

- It best communicates that Anvara is a real marketplace, not just a network landing page.
- It makes the product model visible: inventory, formats, pricing, availability.
- It gives us the clearest experimental contrast from the current homepage.
- It supports both audiences without becoming a split-personality site.

The main caution is to avoid over-design. The right version of Direction 2 should feel:

- dynamic
- organized
- inventory-rich
- trustworthy

Not:

- crypto-looking
- neon
- overly futuristic
- generic startup gradient template

---

## Concrete section-by-section brief for implementation later

### 1. Hero

Structure:

- eyebrow
- H1
- supporting paragraph
- primary CTA
- secondary CTA
- trust chips
- right-side visual composition

Copy direction:

- focus on speed, clarity, and inventory discovery
- avoid vague “unlock growth” language

### 2. Trust / proof strip

Possible content:

- `Display, video, podcast, and newsletter placements`
- `Transparent monthly pricing`
- `Availability visibility built in`
- `Designed for sponsors and publishers`

### 3. Sponsor / publisher split

Two large cards:

- Sponsors card:
  - discover placements
  - compare formats and pricing
  - launch campaigns faster
- Publishers card:
  - list inventory
  - set rates
  - convert attention into recurring revenue

### 4. Marketplace preview

This should look close to the actual card model in the product.

Include:

- slot type chip
- publisher attribution
- short description
- price
- availability state

The homepage should preview 4 to 6 examples across content types.

### 5. How it works

Three steps:

1. Browse structured inventory
2. Match placements to campaign goals
3. Book and manage sponsorships

### 6. Feature grid

Suggested features:

- transparent pricing
- multi-format inventory
- simple listing flow
- clear availability states
- faster partner discovery
- better campaign organization

### 7. Final CTA

Prefer a dual-path CTA module:

- Primary: `Get started`
- Secondary: `Browse marketplace`
- Optional micro-copy: `Join as a sponsor or publisher`

---

## Moodboard asset brief

When collecting references, prioritize the following:

### Layout references

Search for:

- asymmetric hero layouts
- card-heavy marketplace homepages
- premium B2B landing pages with strong product framing
- dual-audience landing pages that avoid generic split-screen clichés

### Typography references

Search for:

- geometric grotesk hero typography
- editorial SaaS typography
- bold landing pages with clean UI body text

### Palette references

Look for:

- teal + coral + warm neutrals
- off-white backgrounds instead of pure white
- restrained gradient use
- category color coding that stays accessible

### Media references

Look for:

- static UI compositions
- floating cards
- productized collage systems
- muted loop background/product videos

Avoid:

- stock handshake photos
- random 3D blobs
- abstract illustrations with no product tie-in
- dark cyberpunk SaaS aesthetics
- purple-on-white template visuals

---

## Implementation notes for later

### Design system updates likely needed

- Replace the current generic root color system with a stronger homepage palette
- Introduce one display font for headings
- Keep body font neutral for readability
- Add section spacing scale and card radius rules

### Component strategy

Likely homepage-specific components:

- `HomeHero`
- `HomeProofStrip`
- `HomeAudienceSplit`
- `HomeMarketplacePreview`
- `HomeHowItWorks`
- `HomeFeatureGrid`
- `HomeFinalCta`

### SEO direction

The homepage should eventually ship with:

- stronger page title
- stronger meta description
- open graph image aligned to the chosen visual direction
- semantic heading hierarchy

Suggested metadata territory:

- title: `Anvara | Sponsorship Marketplace for Sponsors and Publishers`
- description: `Browse sponsorship inventory across display, video, podcast, and newsletter placements. Anvara connects sponsors with publishers through structured pricing and faster booking flows.`

### Analytics direction

Track separately:

- primary CTA clicks
- secondary CTA clicks
- sponsor-card interactions
- publisher-card interactions
- marketplace preview clicks
- scroll depth to final CTA

---

## Final recommendation to the team

If we want the most effective B-variant, we should build a **dynamic marketplace-led landing page** that makes inventory visible, uses a more differentiated palette, and frames Anvara as a credible system for matching demand and supply.

The visual references we search for should bias toward:

- premium B2B marketplace design
- productized inventory cards
- warm-light interfaces with teal/coral emphasis
- strong typography with disciplined density

If we collect references well, implementation should feel like composing a clear design system, not improvising a homepage from scratch.

---

## Suggestions and observations from the original Anvara landing page

### What the original page gets right

The production Anvara landing page (anvara.com) is a strong reference. The key strengths worth understanding:

1. **The hero shows the product working.** The typewriter search + result cards simulate the core user action (finding sponsorships) directly on the landing page. This makes the value proposition tangible instead of abstract. The visitor understands the product before scrolling.

2. **Video background creates visual weight.** The dark overlay + white bold type over live footage gives the hero premium energy that a static gradient can't easily match. It signals "this is real, this is active."

3. **Social proof is immediate.** Logo strip appears above the fold. Builds credibility before the visitor has to invest attention.

4. **Rotating category text ("the marketplace for [Music Event] sponsorships")** communicates breadth without a wall of text. One line, multiple value props.

5. **Feature sections alternate layout direction** (text-left/image-right, then image-left/text-right). Keeps the scroll rhythm from feeling monotonous.

6. **Role split is late, not early.** The For Brands / For Rightsholders cards appear mid-page, after the product has been explained. This avoids the "choose your path" gate that breaks flow on first visit.

7. **Final CTA mirrors the hero.** The closing section reuses the result cards and a strong closing line ("Opportunities don't chase you. Discover them with Anvara."). This bookend structure reinforces the message.

### What we should NOT copy

The typewriter search + result cards is their **signature interaction pattern**. Directly replicating it would be obvious and derivative. The pattern is too specific — anyone who has seen the original would recognize it immediately.

Similarly, the specific visual language (rodeo footage, event photography, music festival cards) belongs to their brand positioning around culture/events. Our marketplace is about ad inventory (display, video, podcast, newsletter), which has a different energy.

### The principle to carry forward

What makes their hero work is not the typewriter — it's that **the hero demonstrates the product doing something**. The landing page doesn't describe the product, it previews it. We need a different interaction that achieves the same goal.

### Recommended hero interaction: Interactive Format Explorer

Instead of a typewriter search, use **clickable category tabs** in the hero section.

How it works:

- Four tabs or pill buttons in the hero: `Display` / `Video` / `Podcast` / `Newsletter`
- Clicking (or auto-cycling with a timer) reveals a styled preview card for that format
- Each card shows: slot name, publisher, price, type badge, availability state
- Cards transition with a smooth fade or slide animation
- A "Browse marketplace" CTA sits below the active card

Why this works:

- **Interactive, not passive.** The visitor discovers the product by clicking, not by watching text type itself.
- **Shows the product model.** The cards preview actual marketplace inventory structure — type, publisher, price, availability — making the value proposition concrete.
- **Clearly different from the typewriter pattern.** No risk of looking derivative.
- **Naturally leads to the marketplace.** The CTA below the card is a direct on-ramp.
- **Low asset dependency.** No video or photography needed. The cards themselves are the visual.

Fallback for non-interactive state: auto-cycle through categories every 3-4 seconds with a progress indicator on each tab, pausing on hover or click.

### Recommended hero background: Animated gradient (not video)

For the hero background, two viable paths:

**Option A: Animated dark gradient mesh.** A slowly shifting dark gradient (deep teal → dark indigo → near-black) with subtle noise texture. Feels modern and tech-forward. No asset sourcing needed. CSS/canvas driven.

- Pros: Zero asset dependency, fast loading, unique, works on all devices
- Cons: Less visceral impact than real footage

**Option B: Background video.** Source abstract footage — media production, screens with content, recording studios, someone scrolling through a feed. NOT stock handshakes, NOT event footage (that's their territory).

- Pros: Higher visual impact, more emotional
- Cons: Needs asset sourcing, increases page weight, harder to get right without looking generic

**Recommendation:** Start with Option A (animated gradient). It ships faster, loads faster, and avoids the risk of choosing mediocre stock footage. If we later find strong video assets, we can swap the background without changing the page structure.

### Social proof adaptation

The original uses client logos (BeReal, Squarespace, Publicis Media, Graza). We don't have real clients, so we substitute with **platform stats** that signal marketplace density:

- `20+ ad placements across 4 formats`
- `5 verified publishers`
- `Transparent monthly pricing`
- `Display, video, podcast, and newsletter inventory`

This serves the same psychological function: reducing uncertainty about whether the platform is real and active.

### Rotating category headline adaptation

Their: `Anvara is the marketplace for [Music Event] sponsorships`

Ours: `The marketplace for [Display / Video / Podcast / Newsletter] placements`

Same pattern, different vocabulary. The rotating word should cycle through our four ad slot types with a smooth text transition (fade or slide-up).

### Section priority for implementation

Based on what the original page proves works, and what's feasible for a take-home, this is the recommended build order:

1. **Hero** (animated gradient BG + headline + subheadline + CTA + interactive format explorer cards) — This is the make-or-break section. If this is polished, the page feels premium.
2. **Stats/trust strip** — Immediate credibility signal below the hero.
3. **Rotating category headline** — "The marketplace for [X] placements" with format cycling.
4. **Role split** (For Sponsors / For Publishers) — Two cards explaining each side's value prop.
5. **How it works** (3 steps) — Browse → Match → Book. Simple numbered flow.
6. **Feature highlights** (2-3 alternating sections) — Use styled JSX mockups instead of screenshots.
7. **FAQ accordion** — Low effort, high polish signal. 4-5 questions.
8. **Final CTA block** — Dark full-width section with closing statement and dual CTAs.

### Scope management

The original Anvara page likely had a design team and weeks of iteration. For a take-home, the goal is not feature parity — it's demonstrating **design sense, frontend polish, and product understanding**.

A hero that's 80% as good as theirs + 5 clean sections below it will score higher than attempting every section at 50% quality. Polish over breadth.
