# Good Business

Good Business is a lightweight website for a consumer technology company building apps and intelligent products for real life. It positions the firm around products that help people connect, remember, choose, care, gather, practice faith, make better decisions, and spend more time being human.

## What it includes

- Responsive no-framework frontend
- Plain wordmark with no robot mascot
- Real people imagery, movement, and tech-forward sections about matching, syncing, remembering, and caring
- Connection technology direction builder backed by `/api/brief`
- Local fallback direction generation when no OpenAI key is configured

## Run it locally

1. Make sure you have Node 18 or newer.
2. Copy `.env.example` to `.env`.
3. Add your OpenAI key to `.env` if you want live AI briefs.
4. Start the app:

```sh
npm start
```

5. Open `http://localhost:3000`.

## Environment variables

```sh
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-5-mini
OPENAI_BRIEF_MODEL=gpt-5-mini
RESEND_API_KEY=...
RESEND_FROM_EMAIL="Good Business <hello@yourdomain.com>"
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
SOCIAL_ARB_EMAIL_TO=briantraudt@gmail.com
SOCIAL_ARB_FROM_EMAIL="Good Business <hello@yourdomain.com>"
SOCIAL_ARB_OPENAI_MODEL=gpt-5-mini
SOCIAL_ARB_CRON_SECRET=optional_shared_secret
```

If no API key is present, the site still runs and returns a practical local brief.

## Social ARB Nightly Email

`/api/social-arb-nightly` collects free/public social data overnight, distills the top three market conversations with OpenAI, saves the report to Supabase, and emails it through Resend.

The Vercel cron in `vercel.json` runs daily at `08:30 UTC`, which is `3:30 AM America/Chicago` during daylight saving time.

Social inputs are free/public only:

- Stocktwits public streams
- Bluesky public search
- Mastodon public hashtag RSS
- 4chan read-only JSON catalogs for public boards
- DEV/Forem public article API
- Public Discourse `latest.json` forums for Hugging Face, OpenAI Developer Community, and Polkadot
- Hacker News Algolia public API
- Hacker News RSS
- Lobsters RSS
- Lemmy RSS
- Product Hunt RSS
- Slashdot RSS
- Stack Exchange public API for live `artificial-intelligence`, `machine-learning`, `cybersecurity`, and `cryptocurrency` questions
- Reddit RSS when reachable; the job skips it if Reddit blocks the request

Recent source expansion intentionally skipped public news-only feeds such as Investing.com RSS and noisy activity-only endpoints such as GitHub public events. The collector prioritizes user-generated discussion or user-generated Q&A over headline syndication or undifferentiated event firehoses.

Manual run:

```sh
curl -H "Authorization: Bearer $SOCIAL_ARB_CRON_SECRET" https://your-domain.com/api/social-arb-nightly
```
