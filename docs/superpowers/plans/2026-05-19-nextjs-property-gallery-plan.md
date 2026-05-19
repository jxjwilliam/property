# Implementation Plan: Property Gallery → Next.js

Based on design spec: `docs/superpowers/specs/2026-05-19-nextjs-property-gallery-design.md`

## Order of Execution

Each step is atomic. Do not skip ahead.

---

### Step 1: Scaffold Next.js project

**Actions:**
- `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm`
- Confirm it created `src/app/`, `tailwind.config.ts`, `tsconfig.json`, `next.config.ts`, `package.json`

**Verification:** `npm run build` succeeds

---

### Step 2: Install shadcn/ui

**Actions:**
- `npx shadcn@latest init --defaults` (accept defaults, dark theme)
- `npx shadcn@latest add button card badge`
- Verify `components.json` exists and `src/components/ui/` has the components

---

### Step 3: Configure custom dark theme

**Actions:**
- Edit `src/app/globals.css`:
  - Replace shadcn CSS variables with the custom amber/blue dark palette from the spec
  - Add the radial gradient body background
  - Add the ambient glow `::before`/`::after` orbs
  - Add utility classes for glassmorphism panels
  - Respect `prefers-reduced-motion`
- Add Geist font via next/font in `layout.tsx` (or keep the system font stack)

**Verification:** `npm run build` succeeds

---

### Step 4: Create gallery config

**Actions:**
- Create `src/config/gallery.ts`:
  - Export `GalleryGroup[]` with all 5 groups (all, phone, matterport, realtor, rew)
  - Same filenames and groups as `index.html`
  - Export `buildItems()` function that maps files → image objects with R2 URLs
  - Export `statsData` and `titleMap`
  - R2 base URL from `process.env.NEXT_PUBLIC_R2_PUBLIC_URL!`

**Verification:** `npm run build` succeeds (config doesn't depend on components)

---

### Step 5: Build StatsBar component

**Actions:**
- Create `src/components/stats-bar.tsx` (client component with `"use client"`)
- Receives `stats: { value: string; label: string }[]` as props
- Renders a row of stat badges using shadcn `<Badge>` or custom styled divs
- Matches existing design: dark glass badges with muted text

**Verification:** Can import and render without errors

---

### Step 6: Build FilterBar component

**Actions:**
- Create `src/components/filter-bar.tsx` (client component)
- Props: `groups: GalleryGroup[]`, `activeKey: string`, `onFilterChange: (key: string) => void`
- Renders filter buttons in a row
- Active filter has accent highlight styling
- Each button shows count badge

**Verification:** Can render with mock data

---

### Step 7: Build Filmstrip component

**Actions:**
- Create `src/components/filmstrip.tsx` (client component)
- Props: `items: GalleryImage[]`, `activeIndex: number`, `onSelect: (index: number) => void`
- Horizontal scrollable div with card buttons
- Each card: 4:5 aspect ratio thumbnail, caption, source, index number
- Active card highlighted, subtle rotation tilt on non-active cards
- Thumbnails use `loading="lazy"`

**Verification:** Can render with mock data

---

### Step 8: Build HeroViewer component

**Actions:**
- Create `src/components/hero-viewer.tsx` (client component)
- Props: `items: GalleryImage[]`, `currentIndex: number`, `playing: boolean`, `onPrev: () => void`, `onNext: () => void`, `onTogglePlay: () => void`
- Large image display with caption overlay
- Prev/Next chevron buttons
- Play/Pause toggle button
- Autoplay: `setInterval` at 5000ms
- Pause on hover/focus, resume on leave/blur
- ArrowLeft/ArrowRight/Space keyboard handlers
- VisibilityChange pause/resume
- Crossfade animation on image switch using CSS transitions
- Lucide `ChevronLeft`, `ChevronRight`, `Play`, `Pause` icons from shadcn

**Verification:** All navigation methods work, autoplay toggles

---

### Step 9: Build Gallery orchestrator

**Actions:**
- Create `src/components/gallery.tsx` (client component)
- Props: `groups: GalleryGroup[]`, `stats: GalleryStat[]`
- State: `filterKey`, `currentIndex`, `playing`
- Derives filtered items from config
- Renders: `<StatsBar>`, `<HeroViewer>`, `<FilterBar>`, `<Filmstrip>`
- Passes down handlers for state changes
- Autoplay step callback advances `currentIndex`

**Verification:** Full interactive flow works

---

### Step 10: Wire up page.tsx

**Actions:**
- Edit `src/app/page.tsx`:
  - Import gallery config and stats
  - Make it a server component (no `"use client"`)
  - Render `<Gallery>` with config props
  - Keep the hero title/description section

**Verification:** `npm run build` succeeds

---

### Step 11: Set up .env.local

**Actions:**
- Create `.env.local`:
  ```
  NEXT_PUBLIC_R2_PUBLIC_URL=https://ad9e2df833f783172de48d7948ed2acd.r2.cloudflarestorage.com/property
  ```
- Add `.env.local` to `.gitignore` if not already there

**Verification:** App loads images from R2 URLs when running `npm run dev`

---

### Step 12: Build verification

**Actions:**
- `npm run build` — must exit 0 with no type errors
- `npm run dev` — visual check: all groups filter, hero nav works, filmstrip scrolls, autoplay toggles, responsive at 980px/640px
- LSP diagnostics on all new files — zero errors

**Verification:** All checks pass

---

## File Creation Summary

| File | Action |
|---|---|
| `src/config/gallery.ts` | CREATE |
| `src/components/stats-bar.tsx` | CREATE |
| `src/components/filter-bar.tsx` | CREATE |
| `src/components/filmstrip.tsx` | CREATE |
| `src/components/hero-viewer.tsx` | CREATE |
| `src/components/gallery.tsx` | CREATE |
| `src/app/globals.css` | EDIT (theme vars) |
| `src/app/page.tsx` | EDIT (gallery wiring) |
| `.env.local` | CREATE |

## Design Decisions Captured

- All interactive state in `<Gallery>` orchestrator — no global state
- Images loaded via direct R2 public URL — no Next.js Image optimization (Cloudflare CDN handles it)
- shadcn `Button` for controls, custom styling for cards/filmstrip
- Dark theme preserved from original HTML, mapped to shadcn CSS variables
- No `next/image` — R2 bucket images served directly (avoids sharp dependency for R2 images + no benefit for already-optimized JPEGs)
