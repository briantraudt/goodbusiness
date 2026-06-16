# Good Business

Good Business is a lightweight website for a consumer technology company building apps and intelligent products for real life. It positions the firm around products that help people connect, remember, choose, care, gather, practice faith, make better decisions, and spend more time being human.

## What it includes

- Responsive no-framework frontend
- Plain wordmark with no robot mascot
- Real people imagery, movement, and tech-forward sections about matching, syncing, remembering, and caring
- Connection technology direction builder backed by `/api/brief`
- Local fallback direction generation when no OpenAI key is configured
- Native iOS home-services app scaffold in `ios/GoodBusiness`
- Supabase-backed home service categories, providers, profiles, and service requests

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

## Native iOS App

The iOS app lives in `ios/GoodBusiness` and is generated with XcodeGen.

```sh
cd ios/GoodBusiness
xcodegen generate
open GoodBusiness.xcodeproj
```

The home screen shows the six primary service buttons:

- Plumbing
- Electrical
- Landscaping
- Painting
- Cleaning
- HVAC

`GoodBusiness/Support/Config.xcconfig` points to the Good Business Supabase project URL. Replace `SUPABASE_ANON_KEY` with the project's publishable/anon key before testing live Supabase reads.

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
- Additional official public Discourse `latest.json` forums for Google AI Developers, PyTorch, Fly.io, Solana, Optimism, and Uniswap
- Additional verified official public Discourse forums for DeepLearning.AI, NVIDIA Developer Forums, Vercel Community, Arbitrum Governance, Ethereum Magicians, the Swift Forums, Python Discuss, Ray Discuss, the Cosmos Forum, the Celestia Forum, and the Sky Ecosystem Forum
- Hacker News Algolia public API
- Hacker News RSS
- Lobsters RSS
- Lemmy RSS
- Product Hunt RSS
- Slashdot RSS
- Stack Exchange public API for live `artificial-intelligence`, `machine-learning`, `cybersecurity`, and `cryptocurrency` questions
- Reddit RSS when reachable; the job skips it if Reddit blocks the request

Recent source expansion intentionally skipped public news-only feeds such as Investing.com RSS, challenge-gated or unstable community feeds such as Cloudflare Community and Anthropic Community, weak or low-signal candidates such as the AVAX forum, Intel Community RSS HTML challenge responses, AMD Community RSS redirects, noisy activity-only endpoints such as GitHub public events, DNS-dead candidates such as `forum.aave.com` and `community.ollama.com`, and lower-signal general community mixes such as the DFINITY forum and Cardano forum. The collector prioritizes user-generated discussion or user-generated Q&A over headline syndication, support-site anti-bot pages, broad general chat, or undifferentiated event firehoses.

Manual run:

```sh
curl -H "Authorization: Bearer $SOCIAL_ARB_CRON_SECRET" https://your-domain.com/api/social-arb-nightly
```
