# WISDOM Company Website

Public marketing website for WISDOM.

This repository contains the static company website deployed through Vercel. It is intentionally separate from WISDOM product and game repositories.

## Local run

From the repository root:

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080/`.

## Content edits

- Product cards and shared product metadata: `assets/products.js`
- Global colors/design tokens: `assets/styles.css` (`:root`)
- Cutscene Studio page: `products/cutscene-studio/index.html`
- General contact, Asset Store URL, documentation URL: `assets/products.js` -> `WISDOM_CONFIG`
- Future screenshots/video: replace the placeholder section in `products/cutscene-studio/index.html`

## Deployment

Production hosting: Vercel.

The site has no build step. The deployment source is the `main` branch of this repository. Vercel Git integration is connected, so pushes to `main` deploy automatically.
