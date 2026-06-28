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
- Additional official public Discourse `latest.json` forums for Google AI Developers, PyTorch, Fly.io, Solana, Optimism, and Uniswap
- Additional verified official public Discourse forums for DeepLearning.AI, NVIDIA Developer Forums, Vercel Community, Arbitrum Governance, Shopify Developer Community, Atlassian Developer Community, Aave Governance, the Safe Community, the Dfinity Forum, the Posit Community, Grafana Community, Ethereum Magicians, the Swift Forums, Python Discuss, Ray Discuss, HashiCorp Discuss, the Temporal Community, the Auth0 Community, the Cosmos Forum, the Celestia Forum, the Sky Ecosystem Forum, the Alpaca Forum, the Cursor Forum, Discuss Kubernetes, Elastic Discuss, the Rust Users Forum, and the Polygon Governance Forum
- Hacker News Algolia public API
- Hacker News RSS
- Lobsters RSS
- Lemmy RSS
- Additional Lemmy technology, investing, and cryptocurrency RSS feeds
- Bogleheads forum Atom feed
- MQL5 forum RSS
- MacRumors forum RSS
- Tesla Motors Club forum RSS
- TradingView public ideas RSS
- Product Hunt RSS
- Slashdot RSS
- Additional verified official public Discourse `latest.json` forums for Ubuntu Discourse, Home Assistant Community, Unreal Engine Forums, Mozilla Discourse, and the OpenWrt Forum
- Additional verified public Discourse forums for LangChain, Open Robotics, Framework Laptop, Level1Techs, and Julia
- Additional verified public Discourse forums for Streamlit, Netlify, Bitwarden, Lido Research, Rocket Pool, Starknet, Gitcoin Governance, Cardano, Monzo, Elixir, and Kotlin
- Additional verified public Discourse forums for MongoDB Community, Node-RED, dbt Community, and InfluxData Community
- Hardware Canucks forum RSS
- Elite Trader forum RSS
- HardForum RSS
- Overclock.net forum RSS
- AnandTech forum RSS
- ServeTheHome forum RSS
- EEVblog forum RSS
- NASASpaceflight forum RSS
- Arduino Forum RSS
- GitHub Discussions Atom feeds for Next.js, VS Code, Supabase, Homebrew, OpenAI Python, and LangChain
- Additional GitHub Discussions Atom feeds for Open WebUI, vLLM, Microsoft Semantic Kernel, Anthropic SDK Python, and Apache Airflow
- Additional GitHub Discussions Atom feed for Filecoin Project community discussions
- Additional GitHub Discussions Atom feeds for Model Context Protocol and Browserbase Stagehand
- Additional GitHub Discussions Atom feeds for shadcn/ui, Cloudflare Workers SDK, Anthropic TypeScript SDK, OpenAI Codex, and CrewAI
- Stack Exchange public API for live `artificial-intelligence`, `machine-learning`, `cybersecurity`, `cryptocurrency`, Quantitative Finance, Personal Finance, and Artificial Intelligence questions
- Additional Stack Exchange public API coverage for Data Science, Bitcoin, and Ethereum questions
- Additional Stack Exchange public API coverage for Economics and Cross Validated questions
- Alternative.me public Crypto Fear and Greed JSON endpoint for no-auth crypto retail sentiment context
- CoinGecko public trending search JSON endpoint for no-auth crypto retail attention context
- Additional verified public Discourse forums for fast.ai, ROS, Edge Impulse, and n8n
- Additional verified public Discourse forums for OpenZeppelin, Zcash Community, Gnosis, Balancer, Celo, Godot, and GitLab
- Additional verified public Discourse forums for Retool, Jupyter, Plotly, Neo4j, Osmosis, Scroll, and LLVM
- Additional verified public Discourse forums for Ethereum Research, Perplexity Community, Bubble, and Webflow
- Additional verified public Discourse forums for Zama Community, Kong Community, and ArduPilot
- Additional verified public Discourse forums for Compound Governance and Morpho
- Reddit RSS when reachable; the job skips it if Reddit blocks the request
- Manifold public search-market JSON endpoint for no-auth prediction-market sentiment around AI, semiconductors, macro, EVs, and crypto

Recent source expansion intentionally skipped public news-only feeds such as Investing.com RSS, Seeking Alpha market-current RSS, LWN headlines, personal finance blogs, the GitHub blog feed, the Hugging Face blog feed, OpenAI status RSS, and ForexLive RSS, broad politics/news or off-topic forum feeds such as Ars Technica OpenForum, timeout-prone or unstable community feeds such as OpenBB Community, the Coinbase CDP forum, the Sui forum, ENS governance, BNB Chain governance, Nostr.band trending notes, the DataHub forum, PCPartPicker forum RSS, and Anthropic Community, low-cadence or stale candidates such as Render Community, RedwoodJS Community, the Tailscale forum, Anaconda Community, Mina Protocol Forums, Mattermost Forum, Fedora Discussion, Grafana GitHub Discussions, W&B Community, Euler Governance, ValuePickr, and the empty/stale Prusa forum RSS feed, overlap-heavy crypto forums such as MakerDAO because the collector already ingests the Sky Ecosystem Forum, weak or low-signal candidates such as the AVAX forum, Near Governance latest topics that were dominated by test posts, Pi-hole Discourse, SonarSource Community, Open Source Hardware Discourse, QuantConnect pages that returned HTML instead of feed/API data, Steam Community XML guesses that returned HTML, and OpenStreetMap Community because it is broad mapping support rather than market, product, or investor conversation, DNS-dead or TLS-failing candidates such as `forum.aave.com`, `community.ollama.com`, `forum.pinecone.io`, `discuss.docker.com`, `community.webull.com`, `community.turso.tech`, `forum.mistral.ai`, `community.openrouter.ai`, `forum.injective.network`, Automotive Grade Linux Discourse, Radix Forum, dYdX Governance, Hedera Forum, and Chainlink Community, SSL-failing endpoints such as `community.robinhood.com`, 403/429-blocked candidates such as Forex Factory RSS, Mr. Money Mustache forum RSS, Aptos Forum, XDA forum RSS, Raspberry Pi forum RSS, Early Retirement forum RSS, Databricks Community, Unity Discussions, BabyPips Forum, Futures.io, Linus Tech Tips RSS, Tom's Hardware forum RSS, and several extra Reddit RSS feeds, 404/non-feed candidates such as Kaggle discussions, Tildes group Atom guesses, RISC-V `latest.json`, Android Central forum RSS, alternate Tailscale category JSON, Vercel AI Discussions, OpenAI Cookbook Discussions, OpenAI Agents Python Discussions, Ollama Discussions, OpenAI Agents JS Discussions, Hugging Face Transformers Discussions, PyTorch Discussions, TensorFlow Discuss, Qt Forum `latest.json`, GitHub Trending AI RSS, GitHub Issues Atom feeds that returned 406 under the collector fetch headers, Apple Developer Forums RSS guesses, SingularityNET Community `latest.json`, Linux Foundation Forum `latest.json`, Kubernetes Discussions Atom, TensorFlow Discussions Atom, TechPowerUp forum RSS, Astral uv Discussions, Bitcoin Core Discussions, Ethereum go-ethereum Discussions, LangGraph Discussions, Pydantic AI Discussions, and Anthropic Courses Discussions, disabled public feed candidates such as Bitcointalk RSS, private/auth-required candidates such as The Motley Fool Community, empty or HTML-only RSS candidates such as Indie Hackers, Nitter search RSS, and NinjaTrader RSS, invalid unauthenticated JSON such as Freetrade Community's `latest.json`, unfiltered public prediction-market endpoints such as Polymarket Gamma and Kalshi markets when their tested public search parameters returned unrelated default results, and endpoints that do not resolve cleanly without auth such as Cloudflare Community's `latest.json` and Ubiquiti Community's `latest.json`. The collector prioritizes user-generated discussion or user-generated Q&A over headline syndication, support-site anti-bot pages, broad general chat, and endpoints that do not resolve cleanly without auth.

Manual run:

```sh
curl -H "Authorization: Bearer $SOCIAL_ARB_CRON_SECRET" https://your-domain.com/api/social-arb-nightly
```
