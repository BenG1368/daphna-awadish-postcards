# Daphna Awadish — Postcard Wholesale & Custom Illustration

Specification for a visual-first B2B catalog.

**Status:** Approved. The sheet pairing, image audit, and Blob upload rules below are part of that approval.  
**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Lucide · Vercel Blob · React Hook Form · Zod · Resend

---

## 1. Product summary

A museum-store editorial site for shop owners, boutiques, and brand clients. Visitors browse postcard collections, collect designs into a wholesale inquiry, and request quotes for bespoke illustration. There is no cart checkout, payment, or account system. Every commercial action ends in an email to Daphna.

### In scope

- Catalog browse, filter, search, and sort
- Postcard cards, detail modal, and wholesale inquiry drawer
- Custom illustration quote form
- About page
- CSV/Excel → `postcards.json` ingestion script
- Upload of `RawImagesPostcards/*.jfif` to the Vercel Blob store, then write each public URL back onto the matching postcard
- Server Actions that email both form types via Resend

### Out of scope (v1)

- Online payment, tax, shipping quotes, or order management
- User accounts and saved lists across devices
- A CMS or admin UI (the spreadsheet plus the parser is the catalog editor)
- Hebrew localization (English only, unless requested later)
- Inventory counts (`InStockInventoryCount` is `N/A` on every current row)

---

## 2. Information architecture

| Route | Purpose |
| --- | --- |
| `/` | Editorial home: positioning, featured work, paths into catalog and custom work |
| `/catalog` | Full postcard catalog with filters, search, sort, cards, and detail modal |
| `/custom` | Custom illustration quote request |
| `/about` | Bio, philosophy, and previous collaborations |

Global chrome on every route:

- Header: wordmark, Catalog / Custom / About, inquiry button with item count
- Inquiry drawer (shadcn `Sheet`): collected designs, quantities, business details, submit
- Footer: contact email, Instagram, copyright

The detail view is a modal on `/catalog`, not a separate route. Postcard `id` values stay in the modal URL hash (`/catalog#postcard-001`) so a design can be shared without a second page template.

---

## 3. System architecture

```text
Browser
  ├─ Server Components: layout, pages, catalog data read
  ├─ Client Components: filters, modal, inquiry drawer, forms
  └─ Server Actions: validate with Zod, send email via Resend
        │
        ▼
public/data/postcards.json  ←  scripts/parse-catalog.ts  ←  CSV / Excel
        │
        └─ image fields point at Vercel Blob public URLs
```

- The catalog is a static JSON file imported on the server. The current sheet has 12 rows; the UI is built to stay responsive at a few hundred.
- Filtering, search, and sort run on the client against that already-loaded list.
- The inquiry list lives in React context and `localStorage` (`daphna-wholesale-inquiry`). It is not a database.
- Images are never committed as the source of truth. Blob public URLs are stored on each postcard after upload.
- Secrets stay in environment variables. Nothing secret is prefixed with `NEXT_PUBLIC_` except the Blob base URL, which is already public.

### Environment variables

| Name | Where used |
| --- | --- |
| `RESEND_API_KEY` | Server Action only |
| `INQUIRY_TO_EMAIL` | Recipient (Daphna) |
| `INQUIRY_FROM_EMAIL` | Verified Resend sender |
| `BLOB_READ_WRITE_TOKEN` | Upload script only |
| `BLOB_PUBLIC_BASE_URL` | Parser, when writing `blobUrl` |

---

## 4. Folder structure

```text
.
├── SPECIFICATION.md
├── DaphnaPostcardsCatalog.csv          # source sheet, already in the repo
├── RawImagesPostcards/                 # local originals; not served by Next
│   ├── *.jfif                          # the 12 catalog illustrations
│   └── RawIllustrations/               # test JPGs, excluded from Blob and the catalog
├── app/
│   ├── layout.tsx                      # fonts, header, footer, inquiry provider
│   ├── page.tsx                        # home
│   ├── globals.css                     # Tailwind + design tokens
│   ├── catalog/page.tsx
│   ├── custom/page.tsx
│   ├── about/page.tsx
│   └── actions/
│       ├── wholesale-inquiry.ts
│       └── custom-quote.ts
├── components/
│   ├── ui/                             # shadcn primitives only
│   ├── layout/
│   │   ├── site-header.tsx
│   │   ├── site-footer.tsx
│   │   └── inquiry-drawer.tsx
│   ├── home/
│   │   └── home-page.tsx
│   ├── catalog/
│   │   ├── catalog-browser.tsx         # client: filter, search, sort, modal state
│   │   ├── category-filter.tsx
│   │   ├── postcard-grid.tsx
│   │   ├── postcard-card.tsx
│   │   └── postcard-detail-dialog.tsx
│   ├── inquiry/
│   │   ├── inquiry-provider.tsx
│   │   └── wholesale-inquiry-form.tsx
│   ├── custom/
│   │   └── quote-request-form.tsx
│   └── about/
│       └── about-page.tsx
├── lib/
│   ├── types.ts
│   ├── catalog.ts                      # load, unique categories, search helpers
│   ├── validators.ts                   # Zod schemas shared by forms and actions
│   ├── site.ts                         # MOQ default, budget options, nav, contact
│   └── email.ts                        # Resend wrapper
├── public/
│   └── data/
│       └── postcards.json
└── scripts/
    ├── parse-catalog.ts
    └── upload-blobs.ts
```

shadcn components to add, and no others unless a phase needs them: `button`, `badge`, `dialog`, `sheet`, `input`, `textarea`, `select`, `form`, `separator`, `label`, `sonner`.

---

## 5. Catalog data

### 5.1 Source file

`DaphnaPostcardsCatalog.csv` (header row as exported):

| Column | Meaning |
| --- | --- |
| `PoscardName` | Postcard name. Header spelling is kept as exported; the parser accepts this exact header. |
| `FileName` | Image file used for Blob lookup |
| `Category` | Collection name |
| `InStockInventoryCount` | Present but unused. Every current value is `N/A`. |

Observed categories: **Animals**, **Characters**, **Holidays**, **Urban**. Twelve data rows, each with a name, a file, and a category.

### 5.2 Sheet pairing

The earlier offset is fixed. Every `PoscardName` stem now matches its `FileName` stem, and `Botanic` is a complete row. The parser still warns if a future export breaks that match, and it still skips a row with an empty name or an empty file. It does not invent a pairing.

| PoscardName | FileName | Category |
| --- | --- | --- |
| AmsterdamHouse2 | AmsterdamHouse2.JFIF | Urban |
| AmsterdamHouses1 | AmsterdamHouses1.JFIF | Urban |
| BeachCouple | BeachCouple.JFIF | Characters |
| ChristmessFox | ChristmessFox.JFIF | Holidays |
| DadandBaby | DadandBaby.JFIF | Characters |
| FamilyAmsterdam | FamilyAmsterdam.JFIF | Characters |
| ManWithMonkey | ManWithMonkey.JFIF | Characters |
| MonkeyMomandChild | MonkeyMomandChild.JFIF | Animals |
| ParisCoffee | ParisCoffee.JFIF | Urban |
| tiger | tiger.JFIF | Animals |
| WalkingCouple | WalkingCouple.JFIF | Characters |
| Botanic | Botanic.JFIF | Urban |

### 5.3 `postcards.json` schema

Canonical record. `imageFilename` is the image key (the example’s `filename` field is this same value; it is not duplicated).

```json
[
  {
    "id": "postcard-001",
    "title": "Paris Coffee",
    "category": "Urban",
    "imageFilename": "ParisCoffee.JFIF",
    "blobUrl": "https://<store>.public.blob.vercel-storage.com/ParisCoffee.JFIF",
    "tags": ["Urban"],
    "description": "",
    "suggestedRetail": null,
    "moq": null
  }
]
```

| Field | Type | Rule |
| --- | --- | --- |
| `id` | string | `postcard-` + zero-padded sequence. Assigned once and never reused. |
| `title` | string | Human title derived from `PoscardName` (see below). |
| `category` | string | Trimmed sheet value. Empty category becomes `"Uncategorized"`. |
| `imageFilename` | string | Exact `FileName`, including extension. This is the Blob object name. |
| `blobUrl` | string | Public Blob URL, or `""` before upload. |
| `tags` | string[] | Seeded with `[category]` when empty. Editable later; parser will not wipe non-empty tags. |
| `description` | string | Empty until real copy exists. Parser will not wipe a non-empty description. |
| `suggestedRetail` | number \| null | Major currency units. `null` means the UI shows “Pricing on request”. No invented prices. |
| `moq` | number \| null | Per-design minimum. `null` means the site default in `lib/site.ts`. |

Currency is a site-level setting (`EUR` proposed), not a per-card field.

### 5.4 Title derivation

From `PoscardName`, strip the extension, then:

1. Apply a small alias map: `Christmess` → `Christmas`.
2. Insert a space before an internal capital (`BeachCouple` → `Beach Couple`).
3. Insert a space between a letter and a digit (`AmsterdamHouses1` → `Amsterdam Houses 1`).
4. Collapse whitespace.

Titles already containing spaces are kept. A hand-edited `title` on an existing record is preserved on re-parse (match by `imageFilename`).

### 5.5 Re-parse behavior

Running the script again updates the catalog without destroying editorial fields.

1. Load `public/data/postcards.json` if it exists.
2. Match existing records by `imageFilename`.
3. Preserve `id`, `title` (if it was changed from the derived title), `tags` (if non-empty), `description` (if non-empty), `blobUrl` (if non-empty), `suggestedRetail`, and `moq`.
4. Refresh `category` from the sheet.
5. Mint a new `postcard-NNN` id only for a filename that has never been seen. The counter is one higher than the highest existing id, not “row index”, so deletions do not recycle ids.

### 5.6 `scripts/parse-catalog.ts`

```text
npx tsx scripts/parse-catalog.ts [input.csv|input.xlsx] [--blob-base-url URL] [--out public/data/postcards.json]
```

- Default input: `./DaphnaPostcardsCatalog.csv`
- CSV via Node’s built-in capabilities or a single small parser dependency; `.xlsx` via `xlsx` (SheetJS), first worksheet, same headers.
- Header row required. Missing `FileName` or `Category` aborts with a non-zero exit.
- Skip rows whose `FileName` is empty.
- Skip a row and warn if `PoscardName` is empty.
- Warn on duplicate `imageFilename` and keep the first.
- Warn when the name stem and the file stem differ.
- Do not invent `blobUrl` from a base URL. Public URLs come only from `scripts/upload-blobs.ts`, because Vercel Blob appends a random suffix.
- Write pretty-printed JSON. Print a summary: rows read, written, skipped, mismatches, new ids.

### 5.7 Image files and Blob upload

Catalog originals live in `RawImagesPostcards/`. `RawImagesPostcards/RawIllustrations/` (`test.jpg`, `test5.jpg`, and the other `test*.jpg` files) is not in the sheet and is not uploaded.

**Format verdict: usable as-is.** All 12 catalog files were checked on disk:

- JPEG container with a JFIF header (`FF D8 FF E0` … `JFIF`) and a baseline frame (`SOF0` / `FF C0`). Browsers and `next/image` accept baseline JPEG.
- 24-bit RGB. None are CMYK, progressive, or truncated.
- About 1.7–2.8 MB and roughly 1700×2500 px. That is the right size for the detail view. The grid uses `next/image` so the browser does not download the full original.
- On-disk extension is lowercase `.jfif`. The sheet stores `FileName` as `.JFIF`. Blob pathnames are case-sensitive, so the uploaded pathname is the sheet’s `FileName`, not the Windows filename.
- No rename to `.jpg` and no recompression. The bytes are already JPEG. Each upload sets `Content-Type: image/jpeg` so the `.jfif` extension does not get served as a generic download.

Orientation is mixed, which is why the card frame uses `object-fit: contain`:

| Orientation | Pixels | Files |
| --- | --- | --- |
| Portrait | 1728×2438 | AmsterdamHouse2, AmsterdamHouses1, BeachCouple, ManWithMonkey, MonkeyMomandChild |
| Portrait | 1696×2528 | DadandBaby, ParisCoffee, WalkingCouple |
| Landscape | 2438×1728 | Botanic, ChristmessFox, FamilyAmsterdam, tiger |

`scripts/upload-blobs.ts` uploads only those 12 files:

```text
npx tsx scripts/upload-blobs.ts
```

- Requires `BLOB_READ_WRITE_TOKEN` from the Vercel Blob store created for this project.
- Resolves each sheet `FileName` to a file in `RawImagesPostcards/` with a case-insensitive match.
- Calls Blob `put()` with `access: "public"`, pathname equal to `FileName`, and `contentType: "image/jpeg"`.
- Writes the returned public URL onto the matching `postcards.json` record (`imageFilename` match) without touching title, tags, description, price, or MOQ.
- A second run may add new Blob objects. It replaces `blobUrl` with the URL just returned.

The token is not on this machine, and the Vercel CLI is not logged in. The upload runs after `BLOB_READ_WRITE_TOKEN` is placed in `.env.local`.

---

## 6. Design system

Editorial stationery shop: warm paper, black ink, the artwork as the only saturated color.

### 6.1 Color

Defined as CSS variables in `globals.css` and mapped into Tailwind theme tokens.

| Token | Hex | Use |
| --- | --- | --- |
| `--background` | `#F9F8F6` | Page |
| `--card` | `#FFFFFF` | Cards, drawer, modal |
| `--foreground` | `#1C1917` | Headlines and body |
| `--muted` | `#6F6A64` | Secondary text |
| `--border` | `#E6E1DA` | Hairline rules, card edges |
| `--accent` | `#1C1917` | Primary buttons, active filter |
| `--accent-foreground` | `#F9F8F6` | Text on primary buttons |
| `--ring` | `#1C1917` | Focus ring |

No second brand hue. Category color is not encoded in the palette; categories are typographic labels.

### 6.2 Typography

Loaded with `next/font/google`.

| Role | Face | Notes |
| --- | --- | --- |
| Headlines, wordmark | **Fraunces** | Optical size ~48–72 on the home hero, 32 on page titles. Slightly soft serif, not a high-contrast display face. |
| Body, UI, forms | **Geist Sans** (or **DM Sans** if Geist is unavailable in `next/font`) | 16px body, 14px meta and buttons. |

- Tracking on the wordmark: slightly open, uppercase, small size in the header (`text-sm tracking-[0.18em]`).
- Page titles: sentence case, not all caps.
- Numeric meta (MOQ, price): tabular lining where the font allows.

### 6.3 Layout

- Content width `max-w-6xl`, horizontal padding `px-5` on small screens and `px-8` from `md`.
- Header height 64px, sticky, background `#F9F8F6` at 90% opacity with a bottom hairline. It does not use a heavy shadow.
- Section rhythm: `py-16` mobile, `py-24` from `md`.
- Postcard grid: uniform CSS grid, not masonry. Postcards share one frame so the page reads as a catalog.

| Breakpoint | Columns | Gap |
| --- | --- | --- |
| default | 2 | 16px |
| `md` | 3 | 24px |
| `lg` | 4 | 28px |

Image frame aspect ratio **3 / 4** (portrait stationery). `object-fit: contain` on the warm card background so the full illustration stays visible. Four of the twelve originals are landscape (§5.7); contain keeps those whole inside the shared frame. `object-fit: cover` is only used if a later art direction chooses full-bleed crops.

### 6.4 Components (visual)

**Postcard card**

- White surface, 1px `--border`, no radius above `rounded-md` (2px is enough; `rounded-sm`).
- Image, then title (serif, 16–18px), then category in `--muted` at 12px with wide tracking.
- Text button “Add to inquiry” under the meta. If the design is already in the inquiry, the label becomes “Added” and a second click removes it.
- Hover (pointer devices only): image scales to `1.03` over 400ms `ease-out`, card border darkens to foreground at 30% opacity. No lift shadow larger than `shadow-sm`.

**Category filters**

- A wrapping row of pills: All, then categories sorted A–Z from the data.
- Inactive: transparent, 1px border, foreground text.
- Active: filled `--accent`, light text.
- They are real `<button>` elements, not links.

**Detail modal**

- shadcn `Dialog`, max width `56rem`.
- Left (or top on small screens): image on `#F9F8F6`.
- Right: category, serif title, description, suggested retail, MOQ, primary “Add to inquiry”, secondary close.
- Suggested retail line is omitted when `suggestedRetail` is `null`, replaced by “Pricing on request”.
- MOQ line: “Minimum order: {moq ?? site.defaultMoq} per design”.

**Inquiry drawer**

- shadcn `Sheet`, side `right`, full height, width `min(100%, 28rem)`.
- Each line: thumbnail, title, category, quantity stepper.
- Quantity minimum is the resolved MOQ. Stepper cannot go below it; removing the line is a separate text button.
- Empty state: one sentence and a link that closes the drawer and focuses the catalog.

**Buttons**

- Primary: filled ink, light label, height 40px.
- Secondary / quiet: text button with underline offset, used for “Remove” and low-emphasis actions.
- One primary action per surface.

### 6.5 Motion

CSS only. No animation library.

- Hover and color: `duration-300 ease-out`.
- Dialog and sheet use the shadcn defaults.
- `prefers-reduced-motion: reduce` disables the image scale.

### 6.6 Accessibility

- Visible `:focus-visible` ring using `--ring`.
- Dialog and sheet trap focus (shadcn).
- Image `alt` is the postcard title.
- Filter pills expose `aria-pressed`.
- Inquiry count on the header button is in the accessible name (`Inquiry, 3 designs`).
- Forms surface Zod messages next to the field, and a toast on success or failure.

---

## 7. Feature behavior

### 7.1 Home

1. Hero: wordmark, one sentence (“Wholesale postcards and custom illustration for shops and brands.”), two actions: “Browse the catalog” and “Request a custom illustration”.
2. A single large featured postcard (first record with a `blobUrl`, otherwise the first record) with its title and category.
3. Category row linking to `/catalog` with that category pre-selected via `?category=`.
4. A short strip of four further postcards.
5. Closing band: custom-illustration prompt repeating the `/custom` action.

Copy beyond that sentence is placeholder until Daphna supplies it. The layout must not depend on long paragraphs.

### 7.2 Catalog

**Filter.** Pills from `All` plus unique categories. Choosing a pill shows only that category. `?category=Urban` initializes the pill; an unknown value falls back to All. Changing a pill updates the query string with `router.replace` so the back button works.

**Search.** One input above the grid. Matches `title`, `category`, `tags`, and `description`, case-insensitive, debounced 150ms. Empty results: “No postcards match.” and a control that clears search and category.

**Sort.** `<select>`: Catalog order (default, JSON array order), Title A–Z, Title Z–A. Sort applies after filter and search.

**Card actions.** “Add to inquiry” adds the postcard at its resolved MOQ and opens the drawer the first time something is added in a session. Later adds update the badge without reopening, and a toast confirms the title.

**Detail.** Clicking the image or title opens the modal and sets the hash. Closing clears the hash. A direct visit to `/catalog#postcard-001` opens that modal after hydration if the id exists.

### 7.3 Wholesale inquiry

Drawer contents:

| Field | Rule |
| --- | --- |
| Business name | Required, 2–120 characters |
| Contact name | Required, 2–120 characters |
| Email | Required, valid email |
| Phone | Optional, max 40 characters |
| Notes | Optional, max 2000 characters |
| Lines | At least one. Each quantity is an integer ≥ resolved MOQ and ≤ 999 |

Submit calls the `submitWholesaleInquiry` server action. On success: toast, clear the inquiry list and `localStorage`, close the drawer. On failure: toast, keep the list.

Email subject: `Wholesale inquiry — {businessName}`.  
Email body (plain text): contact block, then one line per design with id, title, category, image filename, and quantity.

### 7.4 Custom illustration quote

Page intro: serif title “Custom illustration”, one short paragraph, then the form. Fields:

| Field | Control | Rule |
| --- | --- | --- |
| Business name | text | Required, 2–120 |
| Contact email | email | Required |
| Project type | select | `Branding`, `Packaging`, `Custom Postcard`, `Editorial` |
| Estimated budget | select | Under €500 · €500–€1,500 · €1,500–€3,000 · €3,000–€6,000 · €6,000+ · Not sure yet |
| Timeline | select | 2–4 weeks · 1–2 months · 3+ months · Flexible |
| Description / brief | textarea | Required, 20–4000 characters |

Submit calls `submitCustomQuote`. Success replaces the form with a confirmation panel (no second page). Failure shows a toast and preserves input.

Email subject: `Custom illustration — {businessName}`.  
Email body: every field, labeled.

### 7.5 About

Single column, `max-w-2xl`, inside the site frame.

1. Page title and a one-line role (“Illustrator”).
2. Two or three short paragraphs: practice, way of working, who the wholesale program is for.
3. “Selected collaborations” as a plain list of names. No logo farm until assets exist.
4. A last line linking to `/custom` and `/catalog`.

All biographical sentences ship as clearly marked placeholder copy in `lib/site.ts` so they can be replaced without touching layout.

### 7.6 Email transport

Resend is the v1 transport. Web3Forms is the fallback only if a verified sending domain is not available at launch; the form and Zod schemas stay the same, and only `lib/email.ts` changes.

Server Actions:

1. Parse input with the shared Zod schema. Invalid input returns `{ ok: false, fieldErrors }` and does not send.
2. Send one email to `INQUIRY_TO_EMAIL`.
3. Return `{ ok: true }` or `{ ok: false, message: "Message could not be sent." }`.
4. Do not log form bodies.
5. No rate-limit service in v1. Actions reject payloads over the Zod maxima, which caps size.

---

## 8. Site defaults (`lib/site.ts`)

| Key | Proposed value | Notes |
| --- | --- | --- |
| `defaultMoq` | `12` | Used when a postcard’s `moq` is `null` |
| `currency` | `EUR` | Display only, when `suggestedRetail` is set |
| `contactEmail` | from `INQUIRY_TO_EMAIL` mirrored into a public contact string supplied at build, or a literal placeholder `hello@daphnaawadish.com` until the real address is confirmed | Footer and about |
| `instagramUrl` | `""` | Footer link hidden while empty |

---

## 9. Task checklist

Each phase ends in a reviewable site or script. Later phases do not start by rewriting earlier ones.

### Phase 0 — Specification

- [x] Write this document
- [x] Approved, including the corrected sheet and the Blob upload of `RawImagesPostcards`
- [x] Freeze the schema in §5.3

### Phase 1 — Scaffold

- [ ] `create-next-app` (App Router, TypeScript, Tailwind, ESLint, no `src/` directory)
- [ ] Initialize shadcn/ui and add the components listed in §4
- [ ] Add Fraunces + body sans, `globals.css` tokens, empty header and footer
- [ ] Add `lib/site.ts`, `lib/types.ts`
- [ ] Confirm `next/image` remote pattern for `*.public.blob.vercel-storage.com`

### Phase 2 — Catalog data

- [ ] Implement `scripts/parse-catalog.ts` per §5.6
- [ ] Generate `public/data/postcards.json` from the corrected sheet
- [ ] `lib/catalog.ts` reads the file and exports typed postcards plus category list
- [ ] Implement `scripts/upload-blobs.ts` per §5.7
- [ ] Upload the 12 JFIF originals once `BLOB_READ_WRITE_TOKEN` is available, and write `blobUrl` back. Until then, cards show a quiet “Image coming” frame

### Phase 3 — Catalog UI

- [ ] `/catalog` grid, pills, search, sort, empty state
- [ ] Query-string category and hash-linked detail modal
- [ ] Card and modal match §6.4, including retail and MOQ fallbacks

### Phase 4 — Inquiry

- [ ] Inquiry provider with `localStorage`
- [ ] Header count and drawer, add / remove / quantity
- [ ] Wholesale form, Zod schema, server action, Resend email, success clear

### Phase 5 — Custom quote and about

- [ ] `/custom` form, confirmation state, server action, email
- [ ] `/about` with placeholder copy isolated in `lib/site.ts`
- [ ] Home page composed from real catalog records

### Phase 6 — Finish

- [ ] Metadata titles and descriptions for all four routes
- [ ] Keyboard pass on filter, modal, drawer, and both forms
- [ ] Reduced-motion check
- [ ] Responsive check at 375px and 1280px
- [ ] `next/image` check against real Blob JFIF URLs
- [ ] README section: how to re-run the parser and which env vars are required

---

## 10. Confirmed decisions

1. **CSV pairing.** The updated sheet is the source. Name and file match on every row.
2. **Images.** Upload the 12 `RawImagesPostcards` JFIF files to the Vercel Blob store with `Content-Type: image/jpeg`. Leave `RawIllustrations/` out. Do not convert the files.
3. **Record id.** `postcard-001` style, stable across re-parses, matched by `imageFilename`.
4. **Layout.** Uniform 3:4 grid with `object-fit: contain`.
5. **MOQ default.** 12 per design, overridable per postcard.
6. **Currency.** EUR, used only when a suggested retail value exists. No prices invented in the seed data.
7. **Email.** Resend. Web3Forms only if domain verification is blocked.
8. **Wholesale contact name.** Required, in addition to business name and email.
9. **Language.** English only.

Still needed before the matching step can finish, and not a reason to reopen the design:

- `BLOB_READ_WRITE_TOKEN` for the store already created in Vercel (upload has not run).
- The public contact email and Instagram URL for the footer. Until then the footer uses a placeholder and hides Instagram.
