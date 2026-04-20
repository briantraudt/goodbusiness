# goodbusinesshq.com

The Good Business HQ web app — marketing site, training flows, and admin/client dashboards.

## Stack

Vite · React · TypeScript · Tailwind · shadcn/ui · Supabase (auth, database, edge functions).

## Local development

```sh
npm install
cp .env.example .env   # then fill in the values
npm run dev            # http://localhost:8080
```

## Environment

See `.env.example` for the full list. All current values are Vite-public (`VITE_*`) — they get baked into the client bundle and the Supabase key is the "publishable" (anon) one, which is designed to be exposed. Don't put real secrets in any `VITE_*` variable.

## Deployment

Hosted on Vercel. Every push to `main` ships to production; pull requests get a preview URL.

Domain: [goodbusinesshq.com](https://goodbusinesshq.com).

## Project layout

```
src/
  pages/            top-level routes (marketing, dashboards, auth, training)
  components/       shared UI
  contexts/         React context providers
  hooks/            shared hooks
  integrations/     supabase client and adapters
  lib/              small utilities
  data/             static content

supabase/
  migrations/       SQL migrations
  functions/        edge functions
```
