# Property Media Gallery — Next.js Conversion

## Overview

Convert the existing static HTML property media gallery into a Next.js 15 + Tailwind CSS v4 + shadcn/ui application. Images are served from Cloudflare R2 Object Storage. The app is deployed on Vercel.

## Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSG + client interactivity, Vercel-native |
| Styling | Tailwind CSS v4 | Utility-first, shadcn dependency |
| UI primitives | shadcn/ui (latest) | Accessible, themeable, dark mode |
| Language | TypeScript | Type safety |
| Runtime | Bun or npm | Both supported |
| Image storage | Cloudflare R2 (public bucket) | CDN-delivered, zero server cost |
| Hosting | Vercel | Next.js-native deployment |

## Directory Structure

```
property/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout, dark theme, fonts
│   │   ├── page.tsx            # Main gallery page (server component)
│   │   └── globals.css         # Tailwind directives + theme vars
│   ├── components/
│   │   ├── gallery.tsx         # Client orchestrator (state holder)
│   │   ├── hero-viewer.tsx     # Large image + prev/next/play controls
│   │   ├── filmstrip.tsx       # Horizontal scrollable card grid
│   │   ├── filter-bar.tsx      # Category filter buttons with counts
│   │   └── stats-bar.tsx       # Stats summary badges
│   └── config/
│       └── gallery.ts          # Static gallery groups + file list
├── .env.local                  # NEXT_PUBLIC_R2_PUBLIC_URL
├── .gitignore
├── next.config.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── components.json             # shadcn init config
```

## Component Architecture

### Server Component: `page.tsx`

- Imports gallery config from `src/config/gallery.ts`
- Renders `<Gallery />` client component with config passed as props
- Zero JS on initial render for layout shell

### Client Component: `gallery.tsx` (State Orchestrator)

All interactive state lives here — passed down as props:

```typescript
interface GalleryState {
  filterKey: string;       // current filter group key
  currentIndex: number;    // active image index within filtered set
  playing: boolean;        // autoplay on/off
}
```

Renders children:
- `<StatsBar stats={...} />`
- `<HeroViewer items={filteredItems} index={currentIndex} playing={playing} />`
- `<FilterBar groups={groups} activeKey={filterKey} />`
- `<Filmstrip items={filteredItems} activeIndex={currentIndex} />`

### Client Component: `hero-viewer.tsx`

- Displays the current large image
- Previous / Next buttons (chevron icons from `lucide-react`)
- Play / Pause toggle button
- Image caption, source label, subcaption
- Autoplay: changes image every 5 seconds
- Pauses on hover/focus, resumes on leave/blur
- Keyboard: ArrowLeft / ArrowRight / Space
- VisibilityChange listener to pause when tab hidden
- Animated crossfade on image switch

### Client Component: `filmstrip.tsx`

- Horizontal scrollable grid (horizontal `flex` + `overflow-x-auto`)
- Cards show thumbnail, caption, source, index number
- Active card highlighted with accent border
- Clicking a card jumps hero to that image
- Cards have subtle alternating rotation tilt
- Thumbnails load with `loading="lazy"`

### Client Component: `filter-bar.tsx`

- Row of filter buttons (All, Phone, Matterport, Realtor.ca, REW.ca)
- Each button shows its label + count badge
- Active filter has accent highlight
- Clicking changes `filterKey` and resets `currentIndex` to 0

### Client Component: `stats-bar.tsx`

- Row of stat badges: count / sources / resolution
- Rendered from static stats object

## Data Model

### Gallery Config (`src/config/gallery.ts`)

```typescript
export interface GalleryGroup {
  key: string;
  label: string;
  description: string;
  files: string[];
}

export interface GalleryImage {
  id: string;
  fileName: string;
  url: string;
  source: string;
  caption: string;
  subcaption: string;
}

export interface GalleryStats {
  value: string;
  label: string;
}[]
```

The config exports:
- `galleryGroups: GalleryGroup[]` — same groups as current app (all, phone, matterport, realtor, rew)
- `buildItems(group): GalleryImage[]` — maps filenames to image objects with R2 URLs
- `statsData: GalleryStat[]` — summary stats
- `titleMap: Record<string, string>` — source title mappings

### Image URL Resolution

```typescript
const R2_BASE = process.env.NEXT_PUBLIC_R2_PUBLIC_URL!;
const imageUrl = (fileName: string) => `${R2_BASE}/${encodeURIComponent(fileName)}`;
```

This is a public URL — images load directly from Cloudflare's CDN, bypassing the Next.js server entirely.

## R2 Integration

One env var:

```
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-XXXXX.r2.dev/property
```

- R2 bucket configured as public (or fronted by Cloudflare public URL)
- Images named with the same flattened filenames from the existing `output/` folder
- The `NEXT_PUBLIC_` prefix means Vite/Next.js inlines it at build time — no server needed

## Visual Design

### Dark Theme

- **Background**: Dark slate (`#0b0d10`) with subtle amber/blue radial glows
- **Text**: Warm off-white (`#f4efe7`) with muted (`rgba(244,239,231,0.72)`)
- **Accent**: Amber gold (`#f0b35a`), blue accent (`#84d0ff`)
- **Surfaces**: Glassmorphism panels (`rgba(255,255,255,0.06)` with `backdrop-filter: blur`)

### shadcn Theme Mapping

shadcn's CSS variables will be customized to match the existing dark amber aesthetic:
- `--background` → `#0b0d10`
- `--foreground` → `#f4efe7`
- `--primary` → `#f0b35a`
- `--secondary` → `#84d0ff`
- `--muted` → `rgba(244,239,231,0.72)`
- `--border` → `rgba(255,255,255,0.12)`

### Layout

- Max-width `1480px` centered shell
- Hero section: 2-column grid (title on left, hero viewer on right)
- Filter bar below hero
- Filmstrip section with section heading
- Responsive: stacks to single column under 980px

## State Management

All state is local React state in `<Gallery />`:

| State | Type | Initial | Updated By |
|---|---|---|---|
| `filterKey` | `string` | `'all'` | Filter click |
| `currentIndex` | `number` | `0` | Nav buttons, filmstrip click, autoplay timer |
| `playing` | `boolean` | `true` | Play/pause button, Space key |

No external state library needed. All state is consumed within `<Gallery />` and passed down.

## Edge Cases

| Scenario | Handling |
|---|---|
| Empty filter result | Show "No images found" in hero, empty filmstrip |
| Single image in filter | Autoplay has no effect (stays on index 0) |
| R2 URL not configured | TypeScript compile-time check via `!` assertion, runtime env validation |
| Image load failure | Native `<img>` `onError` fallback to placeholder |
| Reduced motion | Respect `prefers-reduced-motion`: disable autoplay transitions |
| Tab hidden | Pause autoplay timer, resume when visible |

## Non-Goals (explicitly out of scope)

- No user upload or image management UI
- No backend API (images are static in R2)
- No authentication
- No image optimization pipeline (R2/Cloudflare handles CDN)
- No database
- No search functionality

## Migration Path

1. Scaffold Next.js project with `create-next-app` + TypeScript + Tailwind
2. Initialize shadcn/ui with dark theme
3. Configure custom theme CSS variables to match gallery aesthetic
4. Create `src/config/gallery.ts` with existing gallery groups/filenames
5. Build `StatsBar` → `FilterBar` → `Filmstrip` → `HeroViewer` → `Gallery` orchestrator
6. Set `NEXT_PUBLIC_R2_PUBLIC_URL` in `.env.local`
7. Verify all images load from R2, all interactions work, responsive layout correct
8. Upload images to R2 bucket with same filenames from `output/`
9. Deploy to Vercel

## Verification

- `npm run build` passes with zero errors
- All gallery groups filter correctly
- Hero navigation (prev/next/keyboard/click) works
- Autoplay plays/pauses/resumes on all triggers
- Filmstrip scrolls, highlights active card, click jumps hero
- Responsive layout adapts at 980px and 640px breakpoints
- Images load from R2 URLs, not local files
