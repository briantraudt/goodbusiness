# goodbusinesshq.com

Static rebrand landing site for Good Business HQ.

## Structure

- `index.html` — the rebranded landing page (live site)
- `design/` — design explorations: logo concepts (v1/v2/v3/v4), identity system, interactive HQ preview, UX standard
- `design/screenshots/` — reference screenshots from the design process
- `favicon.ico`, `robots.txt`, `sitemap.xml` — site metadata

Contact: hello@goodbusinesshq.com

## Deployment

Pure static site — no build step. Hosted on Vercel; pushes to `main` ship to production, PRs get preview URLs.

**Important (Vercel settings):** This replaced a Vite/React app. In the Vercel project dashboard, update:
- **Framework Preset:** `Other` (was: Vite)
- **Build Command:** leave empty (was: `npm run build`)
- **Output Directory:** leave empty / `.` (was: `dist`)

The `vercel.json` in this repo handles the routing; the dashboard change is needed because Vercel caches the framework preset.

## Previous app (recovering React code)

Before this rebrand, the repo hosted a Vite + React + TypeScript + Tailwind + Supabase app (training flows, admin/client dashboards). That code is preserved in git history.

To browse or restore it:

```sh
# see the last commit before the rebrand
git log --oneline main

# restore a specific file from that commit
git checkout <pre-rebrand-sha> -- path/to/file

# or branch off the pre-rebrand state entirely
git checkout -b restore-app <pre-rebrand-sha>
```
