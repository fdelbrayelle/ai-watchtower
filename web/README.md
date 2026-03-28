# 🔭 AI Watchtower — Web App

Interactive honeycomb tech radar built with Astro + Vue 3 + Pinia + TypeScript.

## Commands

Run from `ai-watchtower/web/`:

| Command           | Action                                                          |
| :---------------- | :-------------------------------------------------------------- |
| `npm install`     | Install dependencies                                            |
| `npm run dev`     | Start dev server at `http://localhost:4321` (extracts resources first) |
| `npm run build`   | Build for production (extracts resources first)                 |
| `npm run preview` | Preview the production build locally                            |
| `npm run extract` | Re-extract resources from `../README.md` → `src/assets/data/resources.json` |

**Requires Node.js ≥ 22.12.0**

## How it works

Resources shown in the app come from the root `../README.md`. The `extract` script parses all markdown links, maps them to the 14 hexagon categories, and writes `src/assets/data/resources.json`. This runs automatically before every `dev` and `build`.

To add a resource to the app: **edit `../README.md`, then restart the dev server**.

## Deploy

Import the repo in [Vercel](https://vercel.com), set **Root Directory** to `web`. Vercel auto-detects Astro and handles the rest.
