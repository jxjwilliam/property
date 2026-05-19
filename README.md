# Property Media Gallery

A cinematic property media gallery built with [Next.js](https://nextjs.org/) (App Router), [Tailwind CSS](https://tailwindcss.com/) v4, and [shadcn/ui](https://ui.shadcn.com/). Images are served from Cloudflare R2 Object Storage.

Includes a small toolset to scrape listing images and pick large property photos.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| UI primitives | shadcn/ui (dark theme) |
| Language | TypeScript |
| Image storage | Cloudflare R2 (public bucket) |
| Hosting | Vercel |

## Features

- **Hero viewer** — large image display with prev/next controls, autoplay (5s interval), keyboard navigation (arrow keys + space)
- **Smart autoplay** — pauses on hover/focus and when the tab is hidden; resumes when you return
- **Filterable gallery** — categorize images by source (All, Phone, Matterport, Realtor.ca, REW.ca) with live counts
- **Filmstrip** — horizontally scrollable card grid with subtle rotation tilt, click to jump
- **Dark theme** — custom amber/blue aesthetic with radial glow backgrounds and glassmorphism panels
- **Responsive** — adapts layout from desktop to mobile

## Project layout

```
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout, dark class, fonts, metadata
│   │   ├── page.tsx           # Main gallery page (server component)
│   │   └── globals.css        # Custom dark theme, radial background
│   ├── components/
│   │   ├── gallery.tsx        # Client orchestrator (state, autoplay, timers)
│   │   ├── hero-viewer.tsx    # Large image display with controls
│   │   ├── filmstrip.tsx      # Horizontal scrollable card grid
│   │   ├── filter-bar.tsx     # Source filter buttons with counts
│   │   ├── stats-bar.tsx      # Summary stat badges
│   │   └── ui/                # shadcn/ui primitives
│   └── config/
│       └── gallery.ts         # Static gallery groups and image file list
├── assets/
│   ├── scrape.mjs             # Scraper — reads URL list, downloads images
│   ├── copy-large-images.mjs  # Selects large images, copies to output/
│   └── scraped-media/         # Downloaded source images (gitignored)
├── output/                    # Flattened high-res images (gitignored)
├── public/                    # Static assets
├── docs/
│   ├── craigslist.txt         # Original listing text
│   ├── manifest.json          # Copied image manifest
│   └── superpowers/
│       ├── specs/             # Design specification
│       └── plans/             # Implementation plan
├── .env.local                 # NEXT_PUBLIC_R2_PUBLIC_URL (not committed)
└── index.html                 # Original static gallery (retained for reference)
```

## Quick start

### Prerequisites

- Node.js (latest LTS recommended)
- npm

### Setup

```bash
# Install dependencies
npm install

# Configure R2 image source
# Copy .env.local.template to .env.local and set NEXT_PUBLIC_R2_PUBLIC_URL
```

### Development

```bash
npm run dev
# Open http://localhost:3000
```

### Production build

```bash
npm run build
npm start
```

### Scraping images (optional)

```bash
# Fetch listing pages and download images
node assets/scrape.mjs

# Select large images and copy them to output/
node assets/copy-large-images.mjs

# Upload output/ contents to your R2 bucket
```

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_R2_PUBLIC_URL` | Yes | Public URL for the R2 bucket (e.g., `https://pub-XXXXX.r2.dev/property`) |

## Deployment

Deploy to [Vercel](https://vercel.com/) with the `NEXT_PUBLIC_R2_PUBLIC_URL` environment variable set. No build commands to customize — the default `npm run build` works.

## Notes

- `assets/` and `output/` are gitignored to keep scraped/generated files out of version control.
- The original static HTML gallery (`index.html`) is retained at the project root for reference.
- Images are loaded directly from Cloudflare R2 — the Next.js server does not proxy or optimize them.
