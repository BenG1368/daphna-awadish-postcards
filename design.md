# Design v2

Brief for a visual pass on the Daphna Awadish wholesale catalog. This file is the design source of truth. When a decision changes, update it before changing the site.

**Status:** In progress on branch `design-v2`. Home and the header size are built. Type faces are decided below and follow this update.
**Product behavior stays in** `SPECIFICATION.md`. Routes, inquiry rules, forms, email, and the hash modal do not change.
**This file overrides** `SPECIFICATION.md` §6 and §7.1 only where a section below says so.

---

## 1. What “prettier” means here

The drawings are the beauty. The site gets better by showing them sooner, giving them room, and making the wholesale path obvious.

A shop buyer lands here to answer three questions:

1. Does this work fit my shop?
2. Can I order it, and on what terms?
3. Can I also commission something?

The chrome is warm paper and black ink. The illustrations stay the only saturated color. A new palette, a louder typeface, or a trend layer would make the site compete with the work.

---

## 2. Practices that fit this site

These are the rules for the pass. They come from how people use a small wholesale catalog, not from a general UI checklist.

### The artwork is the interface

Museum shops and print catalogs keep the fixture quiet so the object reads. Same here.

- Paper background `#F9F8F6`, white surfaces `#FFFFFF`, ink `#1C1917`, hairline `#E6E1DA`.
- No second brand hue. Categories stay words, never color chips.
- No grain, paper texture, gradient, or glass. Texture fights the drawings and hurts contrast.
- Shadows stay at most a hairline darkening on hover. The card edge is the container.

### One job per screen

| Screen | Job |
| --- | --- |
| Home | Recognize the work and choose a path |
| Catalog | Compare designs and collect them |
| Detail | Inspect one drawing and add it |
| Inquiry | Set quantities and send |
| Custom | Brief a commission |
| About | Decide whether to trust the practice |

One primary action per surface. The home hero’s primary action is **Browse the catalog**. Custom illustration is a text action there, and becomes the primary action only in the closing band and on `/custom`.

### Say the buying terms before the form

The minimum order is 12 per design (`site.defaultMoq`) unless a postcard sets its own. That fact is easy to miss today: it appears inside the detail dialog, after someone has already started collecting.

- The catalog introduction states the minimum in one sentence.
- The detail dialog keeps the existing line: “Minimum order: {n} per design”.
- Suggested retail stays hidden while `suggestedRetail` is null, with “Pricing on request” in the dialog. Do not invent prices, stock counts, or a cart.

### Scan in the grid, inspect in the dialog

Buyers compare stock. A shared frame makes that scan possible. The file’s true proportion belongs where someone is looking at one drawing.

**Override of §6.3 and the current cards.** The catalog grid uses one portrait frame, aspect **3 / 4**, with `object-fit: contain` on the paper background. Landscape drawings (Botanic, Foxes on Ice, The Cargo Bike, Tiger and Cub) stay whole inside that frame. They do not span two columns.

The detail dialog and the home feature show the drawing at its own proportion, as large as the viewport allows. Zoom stays.

A masonry or “natural height” catalog was considered and set aside. It favors a portfolio reading and makes the twelve designs harder to compare. Natural height remains appropriate for a single featured image.

### Type is a signature, not a logo system

**Override of §6.2.** Headlines and the wordmark are **Fraunces**. Body, navigation, buttons, and forms are **Source Sans 3**. Both load through `next/font` and replace Instrument Serif and Geist.

Fraunces is a contemporary old-style serif with soft, slightly uneven shapes. That warmth sits next to the paintings. Instrument Serif was one thin cut and read as a fashion template. Geist read as a software interface. Source Sans 3 is a plain humanist sans, so the menu and the forms stay simple.

Use the faces quietly:

- Fraunces Regular only (`wght` 400). Optical size stays on, so a card title and the hero each get the right cut.
- Leave Fraunces **SOFT** at 0 and **WONK** at 0. Those axes turn it into a logo font.
- No italics.
- Source Sans 3 Regular only (`wght` 400).
- Header wordmark: the name in Fraunces, title case, 22px on a phone, 28px from `sm`, 32px from `md`. Fraunces has more body than Instrument Serif, so do not enlarge the name further. If 32px feels heavy on screen, step the desktop wordmark down to 28px.
- Page titles: sentence case, Fraunces.
- Tracked uppercase is only for short labels: category, section eyebrow. Never for sentences.
- Body measure stays under about 65 characters. The about column (`max-w-2xl`) already does this.

Proposed scale:

| Role | Size | Face |
| --- | --- | --- |
| Home hero | 40px mobile, 56–72px from `md`, line-height ~1.05 | Fraunces |
| Page title | 36px mobile, 40–48px from `md` | Fraunces |
| Section title | 28–32px | Fraunces |
| Card title | 18px | Fraunces |
| Body | 16px, line-height 1.6 | Source Sans 3 |
| Meta and buttons | 14px | Source Sans 3 |
| Category label | 13px, tracked uppercase | Source Sans 3 |
| Header wordmark | 22px, 28px from `sm`, 32px from `md` | Fraunces |
| Header links | 15px, ink, current page underlined | Source Sans 3 |

`--muted` (`#6F6A64`) on the paper background is about 5:1. That is acceptable at 14px and thin at 12px. Category labels move to 13px. If a label must stay smaller, darken `--muted` one step (around `#5C574F`) and check it on both paper and white.

### Space stays editorial and tight to the work

Keep the existing frame:

- Content width `max-w-6xl`.
- Padding `px-5`, and `px-8` from `md`.
- Section padding `py-16`, and `py-24` from `md`.
- Header 80px, and 96px from `md`. Sticky, paper at 90% opacity, bottom hairline, no drop shadow. A taller bar was the fix for the 64px toolbar; a masthead above 96px would cover too much of the catalog while it stays on screen.

Catalog columns return to the spec:

| Breakpoint | Columns | Gap |
| --- | --- | --- |
| default | 2 | 16px |
| `md` | 3 | 24px |
| `lg` | 4 | 28px |

The first screen of the home page is mostly one drawing. Text sits beside it on wide screens and under it on narrow ones.

### The inquiry stays reachable

The header count is the wholesale path. On a phone, “Catalog / Custom / About / Inquiry” plus the wordmark do not fit one row.

- Wordmark and inquiry count stay visible at every width.
- Catalog, Custom, and About collapse into a simple disclosure under `md`.
- The inquiry button does not move inside that menu.
- The drawer, quantities, and first-add behavior stay as specified.

### Catalog controls confirm what changed

Filters, search, and sort stay. Add a quiet count of visible designs (“12 designs”, “3 designs”) next to the controls so a filter feels confirmed.

Empty state stays: “No postcards match.” plus a control that clears search and category.

Search already matches title, category, tags, and description. The placeholder becomes **Search**, so it does not claim to search titles only.

### Cards ask quietly; the dialog asks plainly

On the card, “Add to inquiry” stays a text button so the drawing remains the click target. In the dialog it stays the single filled button.

The added state is easy to miss when the only change is the word “Added”. On a card that is already in the inquiry, the label becomes **Added** and the control shows a pressed treatment (filled ink, or ink text with a clear `aria-pressed`). A second click still removes it.

Opening the drawer on the first add of a session stays. Later adds update the count and toast without reopening the drawer.

### Forms stay short

Visible labels, one column, errors on the field, toast on failure. Success on `/custom` still replaces the form. The inquiry form still clears the list and closes the drawer.

Do not add steps, accounts, or extra fields.

### Motion stays small

CSS only. Hover and color at `300ms ease-out`. `prefers-reduced-motion: reduce` disables image scale and sheet motion. No load-in sequence and no parallax.

### Accessibility stays part of the look

- Focus stays a visible ink ring (`--ring`), including the new mobile menu.
- Filter pills keep `aria-pressed`. The added control keeps it too.
- Dialog and sheet keep focus trap.
- Image `alt` remains the postcard title. Inquiry thumbnails stay decorative (`alt=""`).
- The inquiry button’s accessible name stays `Inquiry, {n} designs`.

### Content is a separate track

These layouts must look finished with one sentence and a drawing. They must not wait on copy that is not in the repo.

Still placeholder or empty, and out of this visual pass:

- About paragraphs and “Selected collaborations” in `lib/site.ts`
- `instagramUrl`
- Empty `description` on every postcard

When real sentences and an Instagram URL exist, drop them into the current about and footer slots. Do not add a portrait, a logo row, or a timeline until those assets exist.

---

## 3. Page intentions

### Home

**Override of §7.1**, which asked for a featured postcard that was never built. The hero is text only today.

1. One large featured drawing: the first postcard with a `blobUrl`, otherwise the first record. Show its title and category.
2. Eyebrow “Wholesale stationery”, the name, and the existing one-sentence description.
3. Primary button “Browse the catalog”. Quiet text link “Request a custom illustration”.
4. Category row linking to `/catalog?category=`.
5. “Selected works”: four further postcards, using the same card as the catalog, skipping the featured one.
6. Closing band: “A drawing made for the business”, with custom illustration as the primary button.

### Catalog

Structure stays. Changes are the shared 3:4 frame, the 2 / 3 / 4 columns, the minimum-order sentence, the result count, the search placeholder, and the pressed “Added” state.

The detail dialog keeps its split: image on paper, then category, serif title, description when present, pricing line, minimum order, and one button. Zoom stays.

### Custom

Keep the desktop split: short intro, then the form. Apply the type scale and spacing. Do not add a sample illustration unless one is chosen as a permanent companion to this page; the catalog is where the work is browsed.

### About

Keep the single column. This page will still read as unfinished until the placeholder paragraphs are replaced. That replacement is the content track, not this branch.

### Header, footer, drawer

- Header: Fraunces signature, 32px on desktop, Source Sans 3 links at 15px, current page underlined. Inquiry count stays in the bar. Under `md`, Catalog, Custom, and About move into a Menu disclosure.
- Footer: copyright, email, Instagram only when `instagramUrl` is set. No extra columns.
- Drawer: same fields and stepper. More space between lines. Thumbnails sit on the paper background inside the same 3:4 frame.

---

## 4. What this pass leaves alone

- Routes, hash modal, and `localStorage` inquiry
- Server Actions, Zod schemas, and email copy
- Filter, search, and sort behavior, aside from the placeholder and the result count
- Quantity floor at the resolved MOQ, and remove as a separate action
- shadcn primitives already in the repo
- Dark mode, per-postcard pages, checkout, Hebrew

---

## 5. Implementation order

Do this only after the brief is agreed. Branch name: `design-v2`. Look at each step in the browser, at a wide window and at a phone width, before starting the next one.

1. **Type.** Fraunces and Source Sans 3, as decided in §2. Sizes stay as built. Check the desktop wordmark at 32px; step it to 28px only if Fraunces feels heavy.
2. **Home.** Featured drawing and the primary / quiet action split. This is the largest gap.
3. **Catalog.** Shared frames, column counts, minimum-order line, result count, search placeholder, Added state.
4. **Header size and narrow-screen menu.** Done with the home pass: the 64px bar was too small for the signature, and a larger name cannot share a phone row with four links. Inquiry count stays outside the menu.
5. **Drawer and forms.** Spacing only, and only where the earlier steps left them looking inconsistent.

After each step the path still works: add a design, change quantity, submit an inquiry, and submit a custom quote.

---

## 6. Open points to confirm before coding

1. **Type is decided.** Fraunces Regular for headlines and the wordmark. Source Sans 3 Regular for UI and body. SOFT and WONK stay off.
2. **Catalog frames are uniform 3:4.** Home feature and the detail dialog show the real proportion.
3. **Mobile navigation** is a Menu disclosure for Catalog, Custom, and About. The inquiry count stays in the header bar. The bar is 80px on a phone and 96px from `md`, with the name at 22–32px. Confirm both widths in the browser when the catalog pass starts.
