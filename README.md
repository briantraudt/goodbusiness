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

`/api/social-arb-nightly` collects public social signals, combines them with late-session price, volume, liquidity, catalyst, and risk evidence, ranks qualified close-to-next-open setups, saves the auditable report to Supabase, and emails it through Resend. It explicitly sends `NO TRADE` when no setup clears every hard gate.

The Vercel cron checks hourly at `:45` from `17:45-20:45 UTC` on weekdays. The API handler runs only 15 minutes before the applicable US market close in `America/Chicago`: normally `2:45 PM CT`, with DST, weekends, common US exchange holidays, and common early-close sessions handled in code.

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
- InvestEngine Community public Discourse JSON for retail-investor, ETF, ISA, portfolio, and brokerage-product sentiment
- Trading 212 Community and Portfolio Performance Forum public Discourse JSON for brokerage, holdings, portfolio analytics, and retail-investor sentiment
- MetaMask Community public Discourse JSON for crypto-wallet, swap, bridge, transaction, and product-friction sentiment
- Umbrel Community public Discourse JSON for Bitcoin-node, self-custody, miner, home-server, and product sentiment
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
- Head-Fi public RSS for consumer-audio product demand
- ResetEra and GBAtemp public forum RSS for gaming hardware, software, and launch sentiment
- Garmin, Zwift, and Peloton public forum RSS feeds for wearables, connected-fitness hardware, subscriptions, and product reliability sentiment
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
- Bambu Lab, GL.iNet, Fairphone, and Sailfish OS public Discourse JSON feeds for hardware, networking, mobile-device, and product sentiment
- Qubes OS public forum RSS for security-product and privacy-community sentiment
- TRAE's official public community JSON endpoint for AI coding-product demand and user sentiment
- Aqara's public Discourse JSON and Unraid's public forum RSS for smart-home and storage-product sentiment
- Plex's official public Discourse JSON and MySensors' public forum RSS for consumer-media, home-automation, and IoT product sentiment
- Snapmaker and Volumio official public Discourse JSON endpoints for 3D-printing hardware and consumer-audio product sentiment
- Creality and PlatformIO official public Discourse JSON endpoints for 3D-printing hardware, embedded development, and IoT product sentiment
- Sui Developer Forum and Stacks Forum official public Discourse JSON endpoints for crypto ecosystem, protocol, and governance discussion
- Stellar Protocol official GitHub Discussions Atom feed for protocol proposals and developer ecosystem sentiment
- Fortinet Community public RSS for cybersecurity product, deployment, and customer sentiment
- Spiceworks Community public RSS for enterprise IT operations, hardware, software, and security sentiment
- AVS Forum public RSS for televisions, projectors, streaming devices, and home-theater product demand
- LangChain Deep Agents public GitHub Discussions Atom feed for AI-agent adoption and implementation sentiment
- Pololu's official public forum RSS for robotics, embedded electronics, components, and hardware-product sentiment
- Cheap Ass Gamer's public forum RSS for gaming demand, pricing, promotions, and retail deal attention
- SAP Community's official public Technology Q&A RSS for enterprise-software adoption, integration, and product-friction sentiment
- SparkFun Community's official public Discourse JSON plus DigiKey TechForum and All About Circuits public RSS feeds for electronics, components, embedded hardware, and maker-product demand
- Nordic Semiconductor DevZone and Onshape Forum public RSS feeds for semiconductor, embedded-device, cloud-CAD, manufacturing-workflow, and product sentiment
- Texas Instruments E2E Processors and Renesas RA MCU official public forum RSS feeds for semiconductor, embedded-device, industrial-computing, and product-demand sentiment
- Docker Community's official public Discourse JSON endpoint for container-platform adoption, enterprise deployment, and developer-product sentiment
- DigitalOcean Community's official public Questions Atom feed for cloud infrastructure, AI platform, database, and developer-product sentiment
- Intercom Community's official public RSS feed for customer-support automation, AI-agent, workflow, and product-friction sentiment
- monday Community's official public RSS feed for work-management adoption, automations, integrations, and customer-product sentiment
- MoneySavingExpert Forum's public RSS feed for household-finance, banking, insurance, energy, and retail-consumer sentiment
- DIY Solar Forum's public RSS feed for solar, battery-storage, inverter, installation, and EV-product demand and friction
- Canva Developers Community's official public Discourse JSON for creative-platform APIs, app monetization, integrations, and developer-product sentiment
- Dremio Community's official public Discourse JSON for cloud data-platform, Apache Iceberg, permissions, engine, and AI-integration sentiment
- Asana Community's official public Discourse JSON for work-management, integrations, automations, and customer-product sentiment
- RingCentral Community's official public RSS for business communications, contact-center AI, CRM integrations, licensing, SMS, and reliability sentiment
- Qualtrics Community's official public RSS for customer-experience, survey, distribution, API, and product-friction sentiment
- Celonis Community's official public RSS for process mining, enterprise automation, data integration, machine learning, and product-adoption sentiment
- Gainsight Community's official public RSS for customer-success operations, adoption, lifecycle automation, SDK, and product-friction sentiment
- Gong Visioneers Community's official public RSS for revenue-intelligence adoption, sales workflows, integrations, compliance, and product sentiment
- Arm Community's official Architectures and Processors forum RSS for CPU architecture, Cortex, AMBA, SoC, FPGA, and embedded-product discussion
- Okta Developer Forum's official public Discourse JSON for identity, authentication, SCIM, workflow, and developer-product sentiment
- Cloudron Forum's public RSS for self-hosted cloud infrastructure, application operations, updates, email, and reliability sentiment
- SonarSource Community's official public Discourse JSON for code-quality, security-analysis, CI, IDE, and developer-product sentiment
- Bitwarden and Avast official public Discourse JSON endpoints for password-manager, consumer-cybersecurity, browser, VPN, account, and product-reliability sentiment

The 2026-09-04 expansion added Avast's official live, no-auth Discourse JSON endpoint and gave the already-collected Bitwarden Community its own cybersecurity-product source weight instead of the generic Discourse weight. Each endpoint returned 30 public topics with same-day activity under the collector user agent. Bitwarden had current password-manager, browser-extension, passkey, account-access, self-hosting, and product-reliability discussion; Avast added current antivirus, Secure Browser, VPN, account, subscription, update, and false-positive discussion. Mozilla and /e/OS public Discourse endpoints were also live but their latest topics were broader or less directly market-relevant; Replit redirected to HTML; Databricks returned a 403 anti-bot page; 1Password returned HTML instead of a feed; Norton returned 404; and Vivaldi, GrapheneOS, Element, Claude, Anthropic, Ollama, and Lovable endpoints were missing or failed to resolve, so none were added.

The 2026-09-03 expansion added SonarSource Community's official live, no-auth Discourse JSON endpoint. It returned 30 public topics with same-day code-analysis, false-positive, IDE, CI, language-support, and product-friction activity under the collector user agent. Retool Community was also live again but already present in the collector; Postman Community, Temporal Community, and Brevo Community were live but stale; Ghost Forum was current but already collected; Shopify, Auth0, OpenAI, Vercel, Hugging Face, Fly.io, Make, n8n, Wyze, Home Assistant, and Bubble were live but already collected; NVIDIA CUDA Python, NVIDIA TensorRT-LLM, Sentry, and Stripe Node discussions were stale or low-cadence; JetBrains, Cloudflare, and Splunk returned 403 anti-bot pages; Snowplow, Webflow, and Tableau redirected to HTML; Figma, Framer, and Algolia returned 404; and Square, Render, Railway, Circle, Zapier, and Stripe forum candidates failed to fetch, so none were added.

The 2026-09-02 expansion added Okta Developer Forum's official live, no-auth Discourse JSON endpoint and Cloudron Forum's live, no-auth public RSS feed. Okta returned 30 public topics with same-day identity-workflow release activity and current authentication, SCIM, account-setup, and integration discussions. Cloudron returned 25 current public discussions covering email delivery, storage, resource limits, managed application updates, and reliability. GitLab, Elastic, Grafana, HashiCorp, Ubuntu, and MongoDB endpoints were live but already collected. Analog Devices and Microchip feed guesses returned 404 HTML; Salesforce, Atlassian, Snowflake, and AMD returned or redirected to HTML; Instructure returned 404; and Cloudflare and Unity blocked the collector user agent, so none were added.

The 2026-09-01 expansion added Arm Community's official live, no-auth Architectures and Processors forum RSS. It returned HTTP 200 XML with current public processor and SoC discussions under the collector user agent, including Cortex-M documentation, Agilex 5 AXI throughput, and ADIv5 debug-interface questions. Other live-tested candidates were skipped: Adobe and Roku redirected to HTML; Broadcom and IBM returned HTML rather than feeds; Splunk, NXP, and Infineon returned 403 anti-bot pages; Tableau returned HTTP 500; QuickBooks returned HTTP 502; Xilinx failed TLS validation; and other Arm forum feeds were stale or materially less current.

The 2026-08-31 expansion added Gainsight Community and Gong Visioneers Community official live, no-auth RSS feeds. Each returned 100 public user discussions under the collector user agent. Gainsight had same-day customer-success automation, community-analytics, SDK, AI-lifecycle, and product-support activity; Gong had current adoption measurement, keyword tracking, integrations, recording-consent, and stakeholder-buy-in discussion. Tesla Energy's public forum RSS was also live with 20 entries but skipped because the broader Tesla Motors Club feed is already collected, so adding the category feed would duplicate source evidence.

The 2026-08-30 expansion added Qualtrics Community and Celonis Community official live, no-auth RSS feeds. Each returned 100 public user discussions under the collector user agent. Qualtrics had current survey-distribution, API, user-management, calendar, and product-support activity; Celonis had current process-object, data-source, machine-learning, training, and product-adoption activity. Gainsight and Gong community RSS feeds were also live but skipped to keep the expansion focused on the more complementary customer-experience and process-intelligence signals. Genesys, ServiceNow, Broadcom, AMD, and Atlassian returned HTML instead of feed data; Zendesk, Databricks, Braze, Pendo, Dovetail, and Sendbird returned 404 responses; Alteryx and Splunk returned 403 anti-bot pages; Contentsquare redirected to authentication; and Hootsuite failed to fetch.

The 2026-08-29 expansion added Asana Community's official live, no-auth Discourse JSON endpoint and RingCentral Community's official live, no-auth RSS feed. Asana returned 30 public topics with same-day project-workflow, Microsoft Teams integration, automation-rule, mobile-app, and feature-request activity. RingCentral returned 100 public discussions with current RingEX, contact-center AI, CRM integration, phone/SMS, licensing, number-porting, and service-reliability activity under the collector user agent. Canon, Alteryx, Splunk, Meraki, and Cloudera returned 403 anti-bot pages; Notion, Retool, Tableau, Snowflake, and Ubiquiti returned HTML instead of public JSON or RSS; UiPath, Atlassian, Box, Dropbox, Ring, and eero returned 404 responses; Snowplow redirected to help-center HTML; Cohere, Gurobi, Deephaven, and HP failed to fetch. Neo4j, Confluent, Streamlit, HashiCorp, and Cloudron were live but already covered or intentionally skipped for overlap or cadence.

The 2026-08-26 expansion skipped HubSpot, Samsung, Spotify, Alteryx, Dynatrace, and Cloudflare because they returned anti-bot pages; eBay, Braze, Pendo, Datadog, Autodesk, Splunk, and Shopify because the tested URLs returned 404 responses; Fitbit, Roku, Adobe, Amplitude, Schneider Electric, Rockwell Automation, Lenovo, Synology, Snowflake, Atlassian, and Okta because the tested feed URLs returned HTML rather than RSS or JSON; Tableau because its tested endpoint returned HTTP 500; and Aircall and PayPal because live requests timed out. Gainsight's public RSS was live but omitted because Intercom and monday offered more complementary, market-relevant product signals.

The 2026-08-27 expansion added live, no-auth public RSS feeds for the MoneySavingExpert Forum and DIY Solar Forum. MoneySavingExpert returned 20 public discussions with same-day household-finance, insurance, banking, solar, and consumer activity; DIY Solar returned 100 public discussions with same-day solar-panel, inverter, battery-storage, installation, Starlink, and EV activity under the collector user agent. MyBroadband and Boards.ie returned 403 anti-bot pages, Whirlpool returned 404, and Ubiquiti returned HTML instead of RSS. Tesla Energy's forum RSS and Gainsight's community RSS were live but skipped because the selected feeds offered broader complementary household-finance and distributed-energy coverage.

The 2026-08-28 expansion added Canva Developers Community and Dremio Community official live, no-auth Discourse JSON endpoints. Each returned 30 public topics under the collector user agent. Canva included current platform monetization, app-review, API, SDK, and integration discussion; Dremio included current cloud-engine, permissions, Apache Iceberg, catalog, and AI-integration product friction. Databricks, HubSpot, Microsoft Fabric, Cloudera, and Dell returned 403 anti-bot pages; Microsoft Tech Community, Etsy, QuickBooks, Gainsight, and Home Assistant Energy feed guesses returned 404; GoDaddy required authentication; Pulumi returned 429; and tested Stripe, Render, and AnkerMake hosts failed to fetch. Weights & Biases and dbt were stale, while Garmin Connect IQ overlapped existing Garmin coverage. Canva and Dremio were preferred over additional already-covered or overlapping live endpoints for Shopify, Grafana, Elastic, OpenAI, Vercel, Auth0, Fly.io, and Unreal Engine.

The 2026-08-22 expansion skipped Cloudflare Community and Cisco Community because they returned 403 anti-bot pages, GoPro Community because the tested public-feed URL returned a support-site 404 page, Ubiquiti and IBM Community because their feed guesses returned HTML, Fedora Discussion because its current topics were not sufficiently market-focused, GitHub Discussions Atom guesses for Ollama and Hugging Face Transformers because both returned 404, and Stable Diffusion WebUI Discussions because live smoke testing surfaced promotional/low-quality content. Docker's working official host is `forums.docker.com`; the earlier failed `discuss.docker.com` hostname remains excluded. DigitalOcean's working official Questions Atom URL replaces an older failed community-host guess.

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

The 2026-08-08 expansion added live, no-auth Discourse JSON endpoints for Bambu Lab, GL.iNet, Fairphone, and Sailfish OS plus the Qubes OS public RSS feed. Each returned 29–30 public topics with same-day activity under the collector user agent. It skipped eero and MikroTik because the tested feeds returned 404, HubSpot because it returned a 403 anti-bot page, Octopus Energy because its `latest.json` URL returned HTML instead of JSON, EnergyHub because the host did not resolve, and GitHub Discussions Atom guesses for Homebridge, OpenAI Agents Python, Anthropic Claude Code, and Vercel AI because they returned 404. Sentry and OpenAI Community feeds were live but already covered through equivalent collector sources.

The 2026-08-17 expansion added AVS Forum RSS plus the LangChain Deep Agents GitHub Discussions Atom feed. Under the collector user agent, AVS returned 35 current entries and Deep Agents returned 25 public discussions; both produced items in the live collector smoke test. It skipped HowardForums, Corsair Forum, and Micro Center because they returned 403 anti-bot pages, Linux Mint and rechecked OpenAI Agents Python, Anthropic Claude Code, Vercel AI, Mastra, LangGraph, and Model Context Protocol Servers GitHub Discussions feeds because they returned 404, and Microsoft TypeScript-Go because its valid 25-entry feed had no discussions inside the collector freshness window. Existing Zed, Framework, and Proxmox endpoints were live but already covered.

The 2026-08-18 expansion added live, no-auth RSS feeds for Pololu Forum, Cheap Ass Gamer, and SAP Community Technology Q&A. Under the collector user agent, Pololu returned 30 current robotics and electronics topics, Cheap Ass Gamer returned 30 current gaming-deal and retail discussions, and SAP returned 20 current enterprise-technology questions. SAS Community and EDAboard returned anti-bot HTML instead of feed data, AVForums substantially overlapped existing AVS Forum coverage, and Contextual Electronics was live but lower-cadence than the selected hardware source.

The 2026-08-19 expansion added SparkFun Community's official no-auth Discourse JSON endpoint plus public RSS feeds for DigiKey TechForum and All About Circuits. Under the collector user agent, SparkFun returned 30 current topics, DigiKey returned 30 current component and engineering discussions, and All About Circuits returned current electronics discussions. Raspberry Pi, Cisco, Intel, Adafruit, and Wall Street Oasis returned anti-bot pages; AMD redirected to a news page; Snowflake, Tableau, Ubiquiti, STMicroelectronics, and Atlassian returned HTML rather than feeds; M5Stack and Mouser failed or returned missing endpoints; and Prusa's RSS was empty. Electro-Tech-Online and Tom's Hardware were live but skipped because the selected sources offered stronger official or complementary coverage.

The 2026-08-20 expansion added Nordic Semiconductor DevZone's official public Q&A RSS and Onshape Forum's public discussion RSS. Under the collector user agent, Nordic returned 25 current embedded-device and semiconductor questions, while Onshape returned 30 cloud-CAD and manufacturing-workflow discussions with current same-day activity. Autodesk, Samsung, and Unity returned anti-bot responses; Roku redirected to support HTML; Procore failed TLS validation; and live McNeel, OPNsense, and Proxmox endpoints were skipped because Onshape and Nordic added stronger complementary coverage while avoiding overlap with existing CAD, networking, and infrastructure sources.

The 2026-08-21 expansion added Texas Instruments E2E Processors and Renesas RA MCU official public forum RSS feeds. Under the collector user agent, each returned 25 user-generated entries, with TI active on August 21 and Renesas active across August 20-21, adding complementary semiconductor, embedded-device, industrial-computing, and product-friction signals. Element14, Infineon, NXP, and Raspberry Pi returned 403 anti-bot HTML; Silicon Labs returned a 404 HTML page; and MicroPython returned 404, so none were added.

The 2026-08-23 expansion added InvestEngine Community and MetaMask Community live, no-auth Discourse JSON endpoints. Each returned 30 public topics under the collector user agent. InvestEngine had same-day retail-investor discussion about ETFs, Vanguard funds, ISAs, transfers, and AutoInvest; MetaMask had current public wallet, swap, bridge, and transaction-support discussion. GitHub Discussions Atom feeds for Hummingbot, Freqtrade, QuantConnect Lean, and CCXT returned 404; Trezor, Coinbase Community, and BabyPips returned 403 anti-bot pages; Interactive Brokers redirected to authentication; Portfolio123 was stale; and tested Ledger, Lightyear, getquin, dYdX, Hummingbot, Freqtrade, and QuantConnect community hosts failed to resolve or fetch. MakerDAO redirected to the already-covered Sky Ecosystem Forum, so it was not duplicated.

The 2026-08-24 expansion added Portfolio Performance Forum's live, no-auth Discourse JSON endpoint and gave the already-collected Trading 212 Community its own retail-investor source weight instead of the generic Discourse weight. Portfolio Performance returned 30 public topics with same-day discussion about invested capital, holdings performance, broker statement imports, derivatives exposure, security categorization, and risk-adjusted returns; Trading 212 returned 30 current topics about stocks, ETFs, accounts, deposits, tax reporting, and brokerage features. Freetrade returned a marketing HTML page instead of JSON; Webull, QuantConnect's tested community hosts, and its forum host did not resolve; Bitcointalk explicitly disabled its RSS action; and Forex Factory returned a 403 anti-bot page, so none were added.

The 2026-08-25 expansion added Umbrel Community's live, no-auth public Discourse JSON endpoint after its activity improved materially from an earlier stale listing. It returned 30 public topics with current discussion about Bitcoin nodes and miners, self-hosted apps, backups, umbrelOS reliability, and a teased desktop product under the collector user agent. Roon was live but already covered; eufy's live feed remained dominated by low-context posts; DJI returned an empty 202 response; TP-Link and Ubiquiti returned HTML instead of feed data; Anker and Ring returned 404; and tested BitBox, River, Ledger, Bisq, Voltage, Fedimint, Starling, Lightyear, and other candidate community hosts did not resolve or fetch. Revolut returned a 403 anti-bot page, Freetrade again returned HTML, and Monero Space was dominated by spam, so none were added.

The later 2026-08-08 expansion added TRAE's official live, no-auth Discourse JSON endpoint. It returned 30 public AI coding-product and workflow discussions with same-day activity under the collector user agent. It skipped Reolink, Ondo, Filecoin, CachyOS, and Asahi Linux because their tested endpoints were missing or unreachable; Akash because `latest.json` returned HTML; Manjaro and Endless OS because their listings were stale; Element14 because its RSS returned a 403 page; and Fedora because its broad Linux-support discussion remained less directly useful than product and market sentiment.

The 2026-08-09 expansion added Aqara's live, no-auth Discourse JSON endpoint and Unraid's public forum RSS feed. Aqara returned 30 current smart-home product discussions, while Unraid returned 25 current storage-product, upgrade, and plugin discussions under the collector user agent. It skipped eufy's live JSON feed because recent topics were dominated by truncated, low-context reviews, and OPNsense's live five-item RSS because it substantially overlapped existing OpenWrt and Netgate coverage. MikroTik returned 404, Synology and tested Anker/System76/GrapheneOS hosts did not resolve, 1Password and Ubiquiti returned HTML instead of feed data, Ring returned 404 after redirect, EcoFlow failed TLS validation, GoPro required authentication, and Arlo returned a 403 anti-bot page.

The 2026-08-10 expansion added Plex's official live, no-auth Discourse JSON endpoint and MySensors' public forum RSS feed. Plex returned 30 public topics with same-day consumer-media product activity, and MySensors returned current IoT and home-automation projects and troubleshooting under the collector user agent. It skipped Shelly because its endpoint returned a 403 anti-bot page; eero, MikroTik, and GoPro because their tested feeds returned 404; tado and Ubiquiti because their tested URLs returned HTML instead of feed data; and EndeavourOS because its broad operating-system discussion was less directly relevant to market and product sentiment. Roon was live but already covered.

The 2026-08-11 expansion added Snapmaker's and Volumio's official live, no-auth Discourse JSON endpoints. Both returned 30 public topics with same-day product activity under the collector user agent, covering 3D-printer purchase, firmware, materials, and accessory discussion plus consumer-audio hardware, streaming-plugin, and reliability sentiment. It skipped Umbrel and Flipper because their latest listings were stale; Anker because its tested endpoint returned 404; ESPHome, Prusa Community, and alternate Flipper/Snapmaker hosts because they failed under the collector fetch path; and Seeed Studio, OctoPrint, Framework, and Roon because equivalent collector sources were already covered.

The 2026-08-12 expansion added Creality's and PlatformIO's official live, no-auth Discourse JSON endpoints. Both returned 30 public topics with same-day activity under the collector user agent, adding 3D-printer hardware, firmware, and purchase sentiment plus embedded-development and IoT tooling discussion. It skipped OpenMQTTGateway because its latest listing was stale, Meshtastic and Sonos because their endpoints failed under the collector fetch path, Voron and eero because they returned 404 pages, DJI because its RSS endpoint returned an empty HTML response, and Octopus Energy and TP-Link because their tested URLs returned HTML instead of public JSON or RSS.

The 2026-08-13 expansion added Sui Developer Forum and Stacks Forum public Discourse JSON, the Stellar Protocol official GitHub Discussions Atom feed, and Fortinet Community RSS. The endpoints returned 30 Sui topics, 30 Stacks topics, 25 Stellar discussions, and 100 Fortinet topics without authentication; a live collector smoke test normalized three items from every new channel. Sui is now usable after failing an earlier collector-path check. Proxmox RSS was live but skipped because that forum is already collected.

The 2026-08-14 expansion added Spiceworks Community's live, no-auth RSS feed. It returned current same-day user-generated enterprise IT discussions under the collector user agent, adding practitioner sentiment around hardware, software, security, infrastructure, and operational incidents. Windsurf and Bolt community endpoints failed under the collector fetch path, Replit redirected to HTML, Lovable returned 404, ServiceNow timed out, Alteryx returned a 403 anti-bot page, and Shopify's tested RSS returned 404. Make, n8n, Obsidian, Proxmox, and Elastic were live but already covered; eufy's live feed remained too low-context, and Monero Space plus the tested Optimism and Arbitrum listings were stale.

The 2026-08-16 expansion added live, no-auth RSS feeds for Garmin Forums, Zwift Forums, and Peloton Forum. All three returned HTTP 200 and current same-day user discussions under the collector user agent, adding consumer sentiment around wearables, cycling and fitness software, connected hardware, subscriptions, integrations, and reliability. It skipped DPReview and COROS because they returned 403 anti-bot pages, DJI because its RSS endpoint returned an empty 202 response, Fitbit because its URL redirected to HTML, and Steam Community because the tested XML was an official announcement feed rather than user discussion. Trading 212, Sonos, Framework, OpenWrt, Home Assistant, Obsidian, and Tailscale were live but already covered; Pentax, Nikonites, and FujiX were live but their current feeds were dominated by photo-sharing threads rather than product or market signals.

Manual run:

```sh
curl -H "Authorization: Bearer $SOCIAL_ARB_CRON_SECRET" https://your-domain.com/api/social-arb-nightly
```
