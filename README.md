Property Media Gallery

Small toolset to scrape listing images, pick large property photos, and preview a gallery.

Project layout
- `index.html` — gallery UI (loads images from `output/` by default)
- `assets/scrape.mjs` — scraper that reads `index.html` link list and downloads page images into `assets/scraped-media/`
- `assets/copy-large-images.mjs` — selects large images and copies flattened filenames into `output/`
- `output/` — flattened high-resolution images (generated)

Quick start

Prerequisites
- macOS (for `sips` which is used by the image-size script)
- Node.js (latest LTS recommended)

Run the scraper and prepare images

```bash
# Fetch listing pages and download images
node assets/scrape.mjs

# Select large images and copy them to output/
node assets/copy-large-images.mjs
```

Preview the gallery locally

```bash
# Start a simple static server from the project root
python3 -m http.server 8000

# Then open http://localhost:8000/index.html in your browser
```

Notes
- The gallery uses a base path in `index.html` (`IMAGE_BASE`) — change it to point at remote storage if you upload `output/` elsewhere (e.g., Cloudflare R2).
- This repository ignores `assets/` and `output/` via `.gitignore` to keep scraped/generated files out of version control.
- If you want me to commit these changes or create a small `package.json` with convenience scripts, say the word.
