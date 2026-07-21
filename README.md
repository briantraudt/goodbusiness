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

The Vercel cron in `vercel.json` runs on weekdays at `13:20 UTC` and `14:20 UTC`. The API handler only executes when a Vercel Cron request lands in the `8:15-8:25 AM America/Chicago` market-morning window, which keeps the run aligned across daylight-saving changes.

Social inputs are free/public only:

- Stocktwits public streams
- Bluesky public search
- Mastodon public hashtag RSS
- 4chan read-only JSON catalogs for public boards
- DEV/Forem public article API
- Public Discourse `latest.json` forums for Hugging Face, OpenAI Developer Community, and Polkadot
- Coda Community public Discourse `latest.json` for user-generated SaaS, workflow, and product sentiment
- Additional official public Discourse `latest.json` forums for Google AI Developers, PyTorch, Fly.io, Solana, Optimism, and Uniswap
- Additional verified official public Discourse forums for DeepLearning.AI, NVIDIA Developer Forums, Vercel Community, Arbitrum Governance, Shopify Developer Community, Atlassian Developer Community, Aave Governance, the Safe Community, the Dfinity Forum, the Posit Community, Grafana Community, Ethereum Magicians, the Swift Forums, Python Discuss, Ray Discuss, HashiCorp Discuss, the Temporal Community, the Auth0 Community, the Cosmos Forum, the Celestia Forum, the Sky Ecosystem Forum, the Alpaca Forum, the Cursor Forum, Discuss Kubernetes, Elastic Discuss, the Rust Users Forum, and the Polygon Governance Forum
- Hacker News Algolia public API
- Hacker News RSS
- Lobsters RSS
- LessWrong public RSS for AI research and alignment community discussion
- Lemmy RSS
- Additional Lemmy technology, investing, and cryptocurrency RSS feeds
- Bogleheads forum Atom feed
- MQL5 forum RSS
- MacRumors forum RSS
- Tesla Motors Club forum RSS
- TradingView public ideas RSS
- useThinkScript forum RSS and Trade2Win forum RSS for retail-trader discussion
- Stockaholics public forum RSS for retail-investor chatter
- Slickdeals frontpage RSS for public retail-demand and deal-attention signals
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
- Additional GitHub Discussions Atom feeds for OpenAI Node, Tailwind CSS, AWS CDK, and Vite
- Additional GitHub Discussions Atom feeds for Microsoft AutoGen, Flowise, and ComfyUI
- Additional GitHub Discussions Atom feeds for Bun, Deno, Svelte, Langfuse, and MLflow
- Additional GitHub Discussions Atom feeds for llama.cpp, ONNX Runtime, browser-use, Haystack, Qdrant, Reflex, and Strands Agents
- Additional GitHub Discussions Atom feeds for TanStack Query, Storybook, Hono, Biome, Vitest, Milvus, and OpenTelemetry Collector
- Additional GitHub Discussions Atom feeds for ClickHouse, Drizzle ORM, Payload CMS, Strapi, and Apache SeaTunnel
- Additional GitHub Discussions Atom feeds for Zed, OpenBB, Appwrite, NocoDB, RustDesk, and Immich
- Additional GitHub Discussions Atom feeds for Google Gemini CLI, Hugging Face Smolagents, Microsoft MarkItDown, Delta Lake, and assistant-ui
- Additional GitHub Discussions Atom feeds for Ruff, Sentry, and Firebase JS SDK
- Google Trends public RSS for U.S. trending public attention
- HotUKDeals public RSS for user-submitted retail-demand and deal-attention signals
- RedFlagDeals and OzBargain public RSS feeds for user-submitted retail-demand and deal-attention signals
- Stack Exchange public API for live `artificial-intelligence`, `machine-learning`, `cybersecurity`, `cryptocurrency`, Quantitative Finance, Personal Finance, and Artificial Intelligence questions
- Additional Stack Exchange public API coverage for Data Science, Bitcoin, and Ethereum questions
- Additional Stack Exchange public API coverage for Economics and Cross Validated questions
- Additional Stack Exchange public API coverage for GenAI questions
- Alternative.me public Crypto Fear and Greed JSON endpoint for no-auth crypto retail sentiment context
- CoinGecko public trending search JSON endpoint for no-auth crypto retail attention context
- Additional verified public Discourse forums for fast.ai, ROS, Edge Impulse, and n8n
- Additional verified public Discourse forums for OpenZeppelin, Zcash Community, Gnosis, Balancer, Celo, Godot, and GitLab
- Additional verified public Discourse forums for Retool, Jupyter, Plotly, Neo4j, Osmosis, Scroll, and LLVM
- Additional verified public Discourse forums for Ethereum Research, Perplexity Community, Bubble, and Webflow
- Additional verified public Discourse forums for Zama Community, Kong Community, and ArduPilot
- Additional verified public Discourse forums for Compound Governance and Morpho
- Additional verified public Discourse forum for Brave Community
- Additional verified public Discourse forums for The Graph, Tezos Agora, Storj, SSV Network, Threshold, and POKT
- Additional verified public Discourse forums for Weaviate, OpenCV, EigenLayer, Flashbots, StakeWise, 1inch, Frax, Rari Foundation, Mantle, Portfolio123, and Seeed Studio
- Additional verified public Discourse forums for CircleCI, Make, and Yearn Governance
- Additional verified public Discourse forums for Let's Encrypt, Confluent Kafka, OctoPrint, Tron DAO, and Algorand
- Additional verified public Discourse forums for Signal Users, Snapcraft, and openHAB
- Particle, Hubitat, and Mattermost public Discourse JSON feeds for IoT hardware, smart-home, and enterprise-collaboration product sentiment
- Additional GitHub Discussions Atom feeds for DuckDB, Expo, Nuxt, Dify, and Open Interpreter
- Additional GitHub Discussions Atom feeds for Google ADK Python, Composio, and Agno
- Cybertruck Owners Club and Lucid Owners public RSS feeds for EV owner/product sentiment
- Mach-E Forum, F-150 Lightning Forum, Kia EV Forum, Inside EVs Forum, and Ford Tremor Forum public RSS feeds for auto and EV owner/product sentiment
- Chevy Bolt EV Forum, VW ID Talk, Hyundai Ioniq Forum, and Tesla Owners Online public RSS feeds for EV owner/product sentiment
- Porsche Taycan Forum, BMW iX Forums, and Toyota RAV4 World public RSS feeds for owner/product sentiment
- BMW i4, Polestar, Silverado EV, Subaru Solterra, and Mercedes EQ public forum RSS feeds for EV owner/product sentiment
- Bronco6G, F-150 Gen14, Toyota Tacoma 4G, and 5th Gen Ram public forum RSS feeds for owner/product sentiment
- Android Central and SmallNetBuilder public forum RSS feeds for mobile-device and networking-hardware chatter
- Wilders Security public forum RSS for cybersecurity and software-user chatter
- Proxmox and Netgate public forum RSS feeds for infrastructure, homelab, and network-security product chatter
- Sonos public community RSS for consumer-audio product sentiment
- SmartThings public Discourse JSON for smart-home product and integration sentiment
- Klaviyo, Zapier, and Zoom public community RSS feeds for SaaS customer demand, workflow, and product sentiment
- Airtable, Miro, Typeform, DocuSign, and Freshworks public community RSS feeds for SaaS product demand, workflows, and customer sentiment
- Esri ArcGIS Pro public community RSS for geospatial-software product demand and user sentiment
- UiPath, KiCad, and Pimoroni public Discourse JSON feeds for enterprise automation, electronics design, and maker-hardware product sentiment
- Core Electronics and OpenEnergyMonitor public Discourse JSON feeds for maker electronics, embedded hardware, home energy, and heat-pump product sentiment
- FreeCAD and VideoLAN public forum Atom feeds for open-source CAD and consumer-media software product sentiment
- Rivian Owners public forum RSS for EV-owner and vehicle-product sentiment
- TrueNAS, Wyze, Homey, and Obsidian public Discourse `latest.json` forums for storage, smart-home, IoT, and productivity product sentiment
- Reddit RSS when reachable; the job skips it if Reddit blocks the request
- Manifold public search-market JSON endpoint for no-auth prediction-market sentiment around AI, semiconductors, macro, EVs, and crypto
- Klipper public Discourse `latest.json` for 3D-printer hardware/product community chatter
- Additional verified public Discourse forums for Decentraland, Frappe, Ghost, and Lawrence Systems
- Additional verified public Discourse forums for WeWeb, Plasmic, Three.js, and ODK
- Additional verified public Discourse forums for Trading 212, Roon, SmartThings, and Netdata
- Traefik Community public Discourse JSON for cloud infrastructure and networking product sentiment
- Grist, Activepieces, Latenode, and Directus public Discourse JSON for no-code, workflow-automation, database, CMS, and AI-product sentiment
- Wappler, Glide, and Pipedream public Discourse JSON for low-code app-building, workflow-automation, API-integration, and developer-product sentiment
- Maker Forums and Privacy Guides public RSS feeds for maker-product, digital-privacy, and cybersecurity community chatter
- Zcash Community public RSS for cryptocurrency ecosystem and user sentiment

Recent source expansion intentionally skipped public news-only feeds such as Investing.com RSS, Seeking Alpha market-current RSS, LWN headlines, personal finance blogs, the GitHub blog feed, the Hugging Face blog feed, OpenAI status RSS, ForexLive RSS, DealNews RSS, Phoronix RSS, Yahoo Finance RSS, MarketWatch RSS, SEC investor alerts RSS, and broad crypto-news aggregators, broad politics/news or off-topic forum feeds such as Ars Technica OpenForum, timeout-prone or unstable community feeds such as OpenBB Community, the Coinbase CDP forum, the Sui forum, ENS governance, BNB Chain governance, Nostr.band trending notes, the DataHub forum, PCPartPicker forum RSS, Anthropic Community, Filecoin Community, Railway Community, Lovable Forum, Chroma Community, Nomic Forum, Liquity Forum, SafeMoon Forum, Startree Community, Dagster Community, Airbyte Community, Trino Forum, and Backtrader Community, low-cadence or stale candidates such as Render Community, RedwoodJS Community, the Tailscale forum, Anaconda Community, Mina Protocol Forums, Mattermost Forum, Fedora Discussion, Grafana GitHub Discussions, W&B Community, Euler Governance, ValuePickr, Metabase Forum, Apache Superset GitHub Discussions, Lobe Chat GitHub Discussions, Remix GitHub Discussions, Prisma GitHub Discussions, and the empty/stale Prusa forum RSS feed, overlap-heavy crypto forums such as MakerDAO because the collector already ingests the Sky Ecosystem Forum, weak or low-signal candidates such as the AVAX forum, Near Governance latest topics that were dominated by test posts, Pi-hole Discourse, SonarSource Community, Open Source Hardware Discourse, Linux Containers Discussion, MAAS Discourse, Logseq Forum, QuantConnect pages that returned HTML instead of feed/API data, Steam Community XML guesses that returned HTML, and OpenStreetMap Community because it is broad mapping support rather than market, product, or investor conversation, DNS-dead or TLS-failing candidates such as `forum.aave.com`, `community.ollama.com`, `forum.pinecone.io`, `discuss.docker.com`, `community.webull.com`, `community.turso.tech`, `forum.mistral.ai`, `community.openrouter.ai`, `forum.injective.network`, Automotive Grade Linux Discourse, Radix Forum, dYdX Governance, Hedera Forum, Chainlink Community, Worldcoin Forum, and Qdrant Community `latest.json`, SSL-failing endpoints such as `community.robinhood.com`, 403/429-blocked candidates such as Forex Factory RSS, GM-Trucks forum RSS, AppleInsider forum RSS, Malwarebytes forum RSS, Mr. Money Mustache forum RSS, Aptos Forum, XDA forum RSS, Raspberry Pi forum RSS, Early Retirement forum RSS, Databricks Community, Unity Discussions, BabyPips Forum, Futures.io, Linus Tech Tips RSS, Tom's Hardware forum RSS, Bambu Lab Forum, BoardGameGeek hot RSS, Beehiiv Community, Bogleheads alternate active-topics RSS, Rivian Forums RSS, Curve Governance, and several extra Reddit RSS feeds, 404/non-feed candidates such as Kaggle discussions, Tildes group Atom guesses, RISC-V `latest.json`, iMore forum RSS, Traderji forum RSS, Microsoft Tech Community RSS guesses, Inkscape forum JSON guesses, GitHub Discussions Atom guesses for OpenAI Agents, Astral uv, Pydantic AI, LangGraph, Modal examples, Bitcoin Core, and SST opencode, alternate Tailscale category JSON, Vercel AI Discussions, OpenAI Cookbook Discussions, OpenAI Agents Python Discussions, Ollama Discussions, OpenAI Agents JS Discussions, Hugging Face Transformers Discussions, PyTorch Discussions, TensorFlow Discuss, Qt Forum `latest.json`, GitHub Trending AI RSS, GitHub Issues Atom feeds that returned 406 under the collector fetch headers, Apple Developer Forums RSS guesses, SingularityNET Community `latest.json`, Linux Foundation Forum `latest.json`, Kubernetes Discussions Atom, TensorFlow Discussions Atom, TechPowerUp forum RSS, Astral uv Discussions, Bitcoin Core Discussions, Ethereum go-ethereum Discussions, LangGraph Discussions, Pydantic AI Discussions, Anthropic Courses Discussions, React Discussions Atom, React Native Discussions Atom, TypeScript Discussions Atom, Electron Discussions Atom, Node.js Discussions Atom, Supabase Auth Discussions, Mistral Cookbook Discussions, Ray Discussions, GitHub Discussions feeds for Model Context Protocol servers, n8n, Continue, OpenHands, Ollama, Kubernetes Enhancements, LangChain Agents, Chroma, and Weaviate, and Google Trends realtime business RSS, disabled public feed candidates such as Bitcointalk RSS, private/auth-required candidates such as The Motley Fool Community, empty or HTML-only RSS candidates such as Indie Hackers, Nitter search RSS, NinjaTrader RSS, Corner of Berkshire and Fairfax RSS, Silicon Investor RSS, Espressif Forum `latest.json`, Hugging Face trending pages, PostHog Community, MotherDuck Community, Steam Community XML, Finviz news RSS, and Linear Community `latest.json`, invalid unauthenticated JSON such as Freetrade Community's `latest.json`, unfiltered public prediction-market endpoints such as Polymarket Gamma and Kalshi markets when their tested public search parameters returned unrelated default results, non-social public market-data endpoints such as DefiLlama stablecoin and yield JSON, and endpoints that do not resolve cleanly without auth such as Cloudflare Community's `latest.json`, Ubiquiti Community's `latest.json`, Modal Community `latest.json`, Replicate Community `latest.json`, and ST Community `latest.json`. The collector prioritizes user-generated discussion or user-generated Q&A over headline syndication, support-site anti-bot pages, broad general chat, non-social market data, and endpoints that do not resolve cleanly without auth.

The latest expansion also skipped live-tested candidates that were blocked, stale, empty, HTML-only, duplicative, too broad/news-only, or unavailable under the collector fetch path: Rivian Forums RSS, Apple Discussions RSS guesses, Steam Deck Community RSS, Bimmerpost EV RSS, Apache Discourse, Prefect Linen, Prusa Forum `latest.json`, Rational Reminder Community, Playwright Discussions Atom, Astro Discussions Atom, NestJS Discussions Atom, Apache Iceberg Discussions Atom, Grafana k6 Discussions Atom, Garmin forum RSS, Intel community pages, Roborock Forum `latest.json`, Roku Community RSS, Unraid forum RSS, Zotero forum RSS, Fedora Discussion, Mattermost Forum, NVIDIA Developer Forum RSS duplicate, Framework Community RSS duplicate, Grafana Alloy Discussions, Apache Flink Discussions, ElasticSearch Discussions, Materialize Discussions, MetaFilter RSS, HN/Lobsters duplicate topic feeds, LinuxQuestions RSS, Product Hunt topic RSS, DPReview forum RSS, Tailscale Forum, Dune Community, Microsoft Fabric Community, Golem Network Forum, Homebrew Discourse, OpenAI status incidents JSON, and broad personal/blog feeds such as Marginal Revolution, AVC, MacObserver, and Mac news RSS.

The 2026-07-08 expansion also skipped live-tested candidates that were blocked, duplicate, weak, or unavailable under the collector fetch path: Elastic Path Community `latest.json`, ApeCoin Governance `latest.json`, OpenMediaVault Forum `latest.json`, Open Collective Forum `latest.json`, iMore forum RSS, Android Forums root RSS, GitHub Discussions Atom feeds for Anthropic Claude Code, Temporal TypeScript SDK, Apache Spark, and Vercel AI Chatbot, duplicate public sources for Dfinity Forum, Kia EV Forum, Cybertruck Owners Club, and Microsoft Semantic Kernel, and low-signal or previously skipped crypto governance candidates such as Avalanche Forum and Mina Protocol Forum.

The 2026-07-09 expansion also skipped live-tested candidates that were blocked, stale, duplicate, intermittent, or unavailable under the collector fetch path: Maverick Truck Club RSS and Jeep Gladiator Forum RSS returned 403 anti-bot pages, Mustang7G RSS and GolfMK8 RSS returned 404, 11th Gen Civic Forum RSS became timeout-prone during smoke testing, Hyundai Ioniq Forum was already covered, Tailscale Forum remained stale, category JSON feeds for ESPHome and Grafana Loki were not suitable as broad current-source additions, and GitHub Discussions Atom feeds for tldraw, Home Assistant Core, Hugging Face Transformers, OpenAI Agents JS, and Microsoft Playwright returned 404.

The 2026-07-10 expansion also skipped live-tested candidates that were unavailable, duplicate, or not enabled under the collector fetch path: EthStaker Community, BanklessDAO Forum, EthFinance Forum, and Ethereum Cat Herders failed during fetch; Cadillac Lyriq Forum RSS and Corvette E-Ray Forum RSS failed during fetch; OpenAI Codex GitHub Discussions was already covered; Vercel AI, Mastra, and Microsoft AI Agents for Beginners GitHub Discussions Atom feeds returned 404.

The 2026-07-11 expansion also skipped live-tested candidates that were unavailable, stale, or did not expose public JSON under the collector fetch path: Ring Community, eero Community, Reolink Community, Snowflake Community, Alteryx Community, Samsung Developer Forum, Cloudron Forum, and Hetzner Community returned 404 or HTML instead of JSON; ZKsync, Immutable, Aerodrome, and Rivian community endpoints failed during fetch; ZK Nation, Shopify Community, Hubitat Community, and the tested Grafana endpoint were stale or already covered.

The 2026-07-12 expansion added the live, no-auth Coda Community Discourse JSON endpoint. It skipped Base Research, Base Forum, Synthetix Forum, Euler Governance, and the tested Espressif endpoint because their hosts did not resolve; Zoom, Zapier, ElevenLabs, and the tested GoPro community endpoints returned HTML errors or required authentication; Meraki failed TLS validation; and PyTorch was already covered.

The 2026-07-13 expansion added live, no-auth SmartThings Discourse JSON plus Klaviyo, Zapier, Zoom, and Rivian Owners community RSS feeds. The working `/feed/topics` endpoints made Zapier and Zoom usable after earlier URL guesses failed. It skipped Honda Prologue and Espressif community endpoints because their hosts did not resolve, Blazer Forum and MicroPython feed guesses because they returned 404, ST Community and Snowflake JSON guesses because they returned HTML instead of public JSON, Esri and Databricks feeds because they returned 403, GM-Trucks because it timed out, Roku because it redirected to HTML, and the stale/empty Prusa feed. Live but overlapping JL Wrangler, GR86, and Equinox EV feeds were not added to keep this expansion focused.

The 2026-07-14 expansion added live, no-auth community RSS feeds for Airtable, Miro, Typeform, DocuSign, and Freshworks plus Traefik Community's public Discourse JSON endpoint. It skipped Monday.com because `/feed/topics` returned an HTML not-found page, GoPro because it required authentication, Dropbox because the feed URL returned 404, HubSpot because it returned a 403 anti-bot page, Canva and Pulumi because their tested hosts did not resolve, Snowflake because it redirected to login HTML, dbt because it redirected to a marketing page, Datadog and Hetzner because their tested JSON endpoints returned 404, and Traefik's live endpoint was preferred over weaker overlapping infrastructure candidates.

The 2026-07-15 expansion added live, no-auth Discourse JSON endpoints for Grist, Activepieces, Latenode, and Directus. It skipped Prismic and Penpot because their latest-topic listings were stale, Beehiiv and Cloudron because their tested JSON endpoints returned 404, ClickUp because it returned HTML instead of JSON, and Cal.com, ESPHome, and OpenPhone because their tested hosts failed under the collector fetch path. GitHub Discussions Atom candidates for Cal.com, Activepieces, Maybe Finance, and Actual Budget returned 404; Directus's live community forum was preferred over its duplicative GitHub Discussions feed.

The 2026-07-16 expansion added live, no-auth Discourse JSON endpoints for WeWeb, Plasmic, Three.js, and ODK. Each returned 30 topics with current-day activity under the collector user agent. It skipped Postman and Dgraph because their latest activity was stale, FlutterFlow and Outline because the tested JSON URLs returned or redirected to HTML, Gelato, ToolJet, Budibase, Prefect, Windmill, and Metabase because their tested hosts did not resolve, and Appsmith, Cloudron, NodeBB, and Zapier JSON because the endpoints returned 404. Zapier remains covered through its working public RSS feed; n8n, Make, Retool, Bubble, Neo4j, Jupyter, Frappe, Ghost, and Weaviate were already collected.

The 2026-07-17 expansion added live, no-auth Discourse JSON endpoints for Wappler, Glide, and Pipedream. All three returned valid topic listings with July 2026 activity under the collector user agent. It skipped dbt and Ghost because they were already covered; Airbyte and RudderStack because their endpoints returned TLS/proxy errors; Snowplow, Render, and Microsoft Fabric because they returned HTML or anti-bot pages instead of public feed data; and Framer, OpenPhone, Cal.com, and Looker because their tested hosts failed under the collector fetch path.

The 2026-07-18 expansion added live, no-auth Discourse JSON endpoints for UiPath, KiCad, and Pimoroni plus Esri's official ArcGIS Pro community RSS feed. Each returned valid user-generated discussions with July 2026 activity under the collector user agent. It skipped Processing because its creative-coding discussion was less directly relevant to market and product signals, DigitalOcean, ESPHome, and Onshape because their tested hosts did not resolve, Splunk because it returned a 403 anti-bot page, and Rapid7 because its endpoint redirected to HTML instead of public feed data.

The 2026-07-19 expansion added live, no-auth Discourse JSON endpoints for Core Electronics and OpenEnergyMonitor plus public Atom feeds for the FreeCAD and VideoLAN forums. All four returned current July 2026 user-generated discussions under the collector user agent. It skipped McNeel and 3D Slicer because their tested top listings were pinned or stale enough to weaken freshness confidence, and Element14 and Cadence because their feed endpoints returned 403 or login HTML instead of public feed data.

The 2026-07-20 expansion added live, no-auth Discourse JSON endpoints for Particle, Hubitat, and Mattermost. Each returned 30 public topics with same-day activity under the collector user agent. It skipped Flipper because its latest visible activity was stale, Sophos, Zendesk, and Cloudron because their tested endpoints returned 404 or non-JSON responses, and Canon because its endpoint returned a 403 anti-bot page. Seeed Studio, Arduino, and openHAB were live but already covered.

The 2026-07-21 expansion added live, no-auth RSS feeds for Maker Forums, Privacy Guides, and Zcash Community. The feeds returned 30 public topics with current July 2026 activity under the collector user agent and all three produced items in the live collector smoke test. It skipped AVS Forum because its initially valid feed timed out in the collector smoke test, Monero Space because the newest visible topic was promotional spam; Bitcointalk, TechPowerUp, Shopify Community, ST Community, NXP Community, and GrapheneOS because the tested feed URLs returned 400/404 or HTML instead of feeds; Raspberry Pi, Cloudflare Community, and Tom's Hardware because they returned anti-bot pages; and Framework and Level1Techs because their equivalent public JSON endpoints were already covered.

Manual run:

```sh
curl -H "Authorization: Bearer $SOCIAL_ARB_CRON_SECRET" https://your-domain.com/api/social-arb-nightly
```
