import { buildOvernightSignalReport } from "./social-arb-signal.js";

const requestTimeoutMs = 14_000;
const reportRecipient = "briantraudt@gmail.com";
const socialUserAgent = "GoodBusiness Social ARB/1.0 (+free public social monitoring)";

const sourceWeights = {
  bluesky: 0.95,
  activepieces: 0.6,
  anandtech: 0.6,
  arduino: 0.5,
  airtable: 0.6,
  android_central: 0.55,
  aqara: 0.6,
  bambu_lab: 0.6,
  bogleheads: 0.7,
  bronco6g: 0.6,
  chevy_bolt_forum: 0.6,
  compound: 0.75,
  core_electronics: 0.55,
  coda: 0.6,
  cybertruck_owners_club: 0.7,
  devto: 0.55,
  directus: 0.6,
  docusign: 0.6,
  discourse: 0.75,
  eevblog: 0.55,
  esri: 0.6,
  fourchan: 0.7,
  framework: 0.65,
  glide: 0.6,
  f150gen14: 0.6,
  f150_lightning_forum: 0.65,
  freshworks: 0.6,
  fairphone: 0.6,
  grist: 0.6,
  glinet: 0.6,
  ford_tremor_forum: 0.55,
  freecad: 0.55,
  github_discussions: 0.7,
  google_trends: 0.6,
  hnrss: 0.7,
  reddit: 1,
  hacker_news: 0.85,
  hardware_canucks: 0.6,
  hardforum: 0.6,
  inside_evs_forum: 0.6,
  bmw_i4_forum: 0.6,
  bmw_ix_forum: 0.6,
  julia: 0.55,
  kia_ev_forum: 0.6,
  klipper: 0.55,
  klaviyo: 0.6,
  latenode: 0.55,
  langchain: 0.75,
  level1techs: 0.65,
  lesswrong: 0.7,
  lobsters: 0.55,
  lemmy: 0.65,
  ardupilot: 0.55,
  kong: 0.6,
  lucid_owners: 0.7,
  macrumors: 0.65,
  mach_e_forum: 0.65,
  manifold_prediction: 0.8,
  maker_forums: 0.55,
  mysensors: 0.55,
  mastodon: 0.8,
  mercedes_eq_forum: 0.6,
  miro: 0.6,
  crypto_fear_greed: 0.85,
  coingecko_trending: 0.85,
  elitetrader: 0.75,
  morpho: 0.7,
  mongodb: 0.65,
  mql5: 0.6,
  nasaspaceflight: 0.55,
  node_red: 0.55,
  open_robotics: 0.65,
  open_energy_monitor: 0.55,
  overclock: 0.6,
  ozbargain: 0.55,
  homey: 0.55,
  netgate: 0.6,
  obsidian: 0.55,
  openhab: 0.55,
  particle: 0.6,
  pipedream: 0.65,
  polestar_forum: 0.6,
  porsche_taycan_forum: 0.6,
  privacy_guides: 0.55,
  product_hunt: 0.75,
  proxmox: 0.6,
  plex: 0.6,
  rav4world: 0.55,
  ram1500forum: 0.55,
  qubes_os: 0.65,
  redflagdeals: 0.55,
  rivian_owners_forum: 0.7,
  serve_the_home: 0.65,
  signalusers: 0.65,
  sailfish_os: 0.6,
  slashdot: 0.65,
  snapcraft: 0.55,
  silverado_ev_forum: 0.6,
  stackexchange: 0.7,
  stockaholics: 0.75,
  stocktwits: 1.25,
  slickdeals: 0.55,
  smartthings: 0.6,
  hubitat: 0.6,
  mattermost: 0.6,
  snbforums: 0.55,
  sonos: 0.6,
  solterra_forum: 0.6,
  tacoma4g: 0.55,
  tesla_motors_club: 0.75,
  trade2win: 0.7,
  tradingview: 0.9,
  tesla_owners_online: 0.65,
  truenas: 0.6,
  typeform: 0.6,
  trae: 0.6,
  unraid: 0.6,
  usethinkscript: 0.7,
  vwidtalk_forum: 0.6,
  videolan: 0.55,
  wappler: 0.6,
  wilders_security: 0.6,
  wyze: 0.6,
  ioniq_forum: 0.6,
  zama: 0.65,
  zapier: 0.6,
  zoom: 0.6,
  zcash_community: 0.7,
};

const stocktwitsSymbols = [
  "NVDA", "TSLA", "AAPL", "MSFT", "GOOGL", "META", "AMZN", "AMD", "INTC", "AVGO",
  "TSM", "PLTR", "SMCI", "COIN", "MSTR", "HOOD", "ARM", "NOW", "NFLX", "DIS",
  "BA", "JPM", "XOM",
];

const redditSubreddits = [
  "wallstreetbets", "stocks", "investing", "StockMarket", "options", "ValueInvesting",
  "technology", "artificial", "electricvehicles", "CryptoCurrency", "economics", "news",
];

const hnQueries = [
  "Nvidia GPU AI chip datacenter",
  "Apple iPhone App Store",
  "Tesla EV robotaxi",
  "Microsoft OpenAI Azure",
  "Google Gemini antitrust",
  "Amazon AWS",
  "Meta Instagram WhatsApp",
  "semiconductor TSMC ASML",
  "cybersecurity breach ransomware",
  "rates inflation jobs recession",
];

const blueskyQueries = [
  "NVDA OR Nvidia OR AI chips",
  "TSLA OR Tesla OR robotaxi",
  "AAPL OR Apple OR iPhone",
  "MSFT OR Microsoft OR OpenAI",
  "GOOGL OR Google OR Gemini",
  "META OR Instagram OR Facebook",
  "AMZN OR Amazon OR AWS",
  "AMD OR semiconductor OR TSMC",
  "MSTR OR Bitcoin OR Coinbase",
  "inflation OR Fed OR jobs report",
];

const mastodonTags = [
  "stocks",
  "stockmarket",
  "investing",
  "finance",
  "business",
  "economics",
  "technology",
  "ai",
  "bitcoin",
  "cybersecurity",
  "electricvehicles",
];

const devToTags = [
  "ai",
  "machinelearning",
  "webdev",
  "programming",
  "cybersecurity",
  "devops",
  "cloud",
  "startup",
];

const fourChanBoards = [
  "biz",
  "g",
  "sci",
  "news",
];

const manifoldQueries = [
  "AI",
  "Nvidia",
  "OpenAI",
  "semiconductors",
  "robotaxi",
  "Tesla",
  "Apple",
  "inflation",
  "Federal Reserve",
  "interest rates",
  "recession",
  "tariffs",
  "Bitcoin",
  "Ethereum",
  "crypto",
];

const rssFeeds = [
  { source: "lobsters", channel: "lobsters", url: "https://lobste.rs/rss" },
  { source: "lesswrong", channel: "lesswrong", url: "https://www.lesswrong.com/feed.xml" },
  { source: "hnrss", channel: "hacker news rss", url: "https://news.ycombinator.com/rss" },
  { source: "lemmy", channel: "lemmy technology", url: "https://lemmy.world/feeds/c/technology.xml?sort=Active" },
  { source: "lemmy", channel: "lemmy news", url: "https://lemmy.world/feeds/c/news.xml?sort=Active" },
  { source: "lemmy", channel: "lemmy world", url: "https://lemmy.world/feeds/c/world.xml?sort=Active" },
  { source: "lemmy", channel: "lemmy investing", url: "https://lemmy.world/feeds/c/investing.xml?sort=Active" },
  { source: "lemmy", channel: "lemmy cryptocurrency", url: "https://lemmy.world/feeds/c/cryptocurrency.xml?sort=Active" },
  { source: "lemmy", channel: "lemmy.ml technology", url: "https://lemmy.ml/feeds/c/technology.xml?sort=Active" },
  { source: "lemmy", channel: "programming.dev", url: "https://programming.dev/feeds/c/programming.xml?sort=Active" },
  { source: "product_hunt", channel: "product hunt", url: "https://www.producthunt.com/feed" },
  { source: "slashdot", channel: "slashdot", url: "https://rss.slashdot.org/Slashdot/slashdotMain" },
  { source: "bogleheads", channel: "bogleheads forum", url: "https://www.bogleheads.org/forum/feed.php" },
  { source: "mql5", channel: "mql5 forum", url: "https://www.mql5.com/en/forum/rss" },
  { source: "macrumors", channel: "macrumors forums", url: "https://forums.macrumors.com/forums/-/index.rss" },
  { source: "tesla_motors_club", channel: "tesla motors club", url: "https://teslamotorsclub.com/tmc/forums/-/index.rss" },
  { source: "tradingview", channel: "tradingview ideas", url: "https://www.tradingview.com/feed/" },
  { source: "usethinkscript", channel: "usethinkscript forum", url: "https://usethinkscript.com/forums/-/index.rss" },
  { source: "trade2win", channel: "trade2win forum", url: "https://www.trade2win.com/forums/-/index.rss" },
  { source: "stockaholics", channel: "stockaholics forum", url: "https://stockaholics.net/forums/-/index.rss" },
  { source: "slickdeals", channel: "slickdeals frontpage deals", url: "https://slickdeals.net/newsearch.php?mode=frontpage&searcharea=deals&searchin=first&rss=1" },
  { source: "hardware_canucks", channel: "hardware canucks forum", url: "https://hardwarecanucks.com/forum/forums/-/index.rss" },
  { source: "elitetrader", channel: "elite trader forum", url: "https://www.elitetrader.com/et/forums/-/index.rss" },
  { source: "hardforum", channel: "hardforum", url: "https://hardforum.com/forums/-/index.rss" },
  { source: "overclock", channel: "overclock forum", url: "https://www.overclock.net/forums/-/index.rss" },
  { source: "anandtech", channel: "anandtech forums", url: "https://forums.anandtech.com/forums/-/index.rss" },
  { source: "serve_the_home", channel: "serve the home forums", url: "https://forums.servethehome.com/index.php?forums/-/index.rss" },
  { source: "eevblog", channel: "eevblog forum", url: "https://www.eevblog.com/forum/.xml/?type=rss" },
  { source: "freecad", channel: "freecad forum", url: "https://forum.freecad.org/feed.php" },
  { source: "videolan", channel: "videolan forum", url: "https://forum.videolan.org/feed.php" },
  { source: "nasaspaceflight", channel: "nasaspaceflight forum", url: "https://forum.nasaspaceflight.com/index.php?action=.xml;type=rss" },
  { source: "github_discussions", channel: "next.js discussions", url: "https://github.com/vercel/next.js/discussions.atom" },
  { source: "github_discussions", channel: "vs code discussions", url: "https://github.com/microsoft/vscode-discussions/discussions.atom" },
  { source: "github_discussions", channel: "supabase discussions", url: "https://github.com/supabase/supabase/discussions.atom" },
  { source: "github_discussions", channel: "homebrew discussions", url: "https://github.com/orgs/Homebrew/discussions.atom" },
  { source: "github_discussions", channel: "openai python discussions", url: "https://github.com/openai/openai-python/discussions.atom" },
  { source: "github_discussions", channel: "langchain discussions", url: "https://github.com/langchain-ai/langchain/discussions.atom" },
  { source: "github_discussions", channel: "open-webui discussions", url: "https://github.com/open-webui/open-webui/discussions.atom" },
  { source: "github_discussions", channel: "vllm discussions", url: "https://github.com/vllm-project/vllm/discussions.atom" },
  { source: "github_discussions", channel: "semantic kernel discussions", url: "https://github.com/microsoft/semantic-kernel/discussions.atom" },
  { source: "github_discussions", channel: "anthropic sdk discussions", url: "https://github.com/anthropics/anthropic-sdk-python/discussions.atom" },
  { source: "github_discussions", channel: "airflow discussions", url: "https://github.com/apache/airflow/discussions.atom" },
  { source: "github_discussions", channel: "filecoin community discussions", url: "https://github.com/filecoin-project/community/discussions.atom" },
  { source: "github_discussions", channel: "model context protocol discussions", url: "https://github.com/modelcontextprotocol/specification/discussions.atom" },
  { source: "github_discussions", channel: "stagehand discussions", url: "https://github.com/browserbase/stagehand/discussions.atom" },
  { source: "github_discussions", channel: "shadcn ui discussions", url: "https://github.com/shadcn-ui/ui/discussions.atom" },
  { source: "github_discussions", channel: "cloudflare workers sdk discussions", url: "https://github.com/cloudflare/workers-sdk/discussions.atom" },
  { source: "github_discussions", channel: "anthropic typescript sdk discussions", url: "https://github.com/anthropics/anthropic-sdk-typescript/discussions.atom" },
  { source: "github_discussions", channel: "openai codex discussions", url: "https://github.com/openai/codex/discussions.atom" },
  { source: "github_discussions", channel: "crewai discussions", url: "https://github.com/crewAIInc/crewAI/discussions.atom" },
  { source: "github_discussions", channel: "openai node discussions", url: "https://github.com/openai/openai-node/discussions.atom" },
  { source: "github_discussions", channel: "tailwind css discussions", url: "https://github.com/tailwindlabs/tailwindcss/discussions.atom" },
  { source: "github_discussions", channel: "aws cdk discussions", url: "https://github.com/aws/aws-cdk/discussions.atom" },
  { source: "github_discussions", channel: "vite discussions", url: "https://github.com/vitejs/vite/discussions.atom" },
  { source: "github_discussions", channel: "microsoft autogen discussions", url: "https://github.com/microsoft/autogen/discussions.atom" },
  { source: "github_discussions", channel: "flowise discussions", url: "https://github.com/FlowiseAI/Flowise/discussions.atom" },
  { source: "github_discussions", channel: "comfyui discussions", url: "https://github.com/comfyanonymous/ComfyUI/discussions.atom" },
  { source: "github_discussions", channel: "bun discussions", url: "https://github.com/oven-sh/bun/discussions.atom" },
  { source: "github_discussions", channel: "deno discussions", url: "https://github.com/denoland/deno/discussions.atom" },
  { source: "github_discussions", channel: "svelte discussions", url: "https://github.com/sveltejs/svelte/discussions.atom" },
  { source: "github_discussions", channel: "langfuse discussions", url: "https://github.com/orgs/langfuse/discussions.atom" },
  { source: "github_discussions", channel: "mlflow discussions", url: "https://github.com/mlflow/mlflow/discussions.atom" },
  { source: "github_discussions", channel: "llama.cpp discussions", url: "https://github.com/ggml-org/llama.cpp/discussions.atom" },
  { source: "github_discussions", channel: "onnx runtime discussions", url: "https://github.com/microsoft/onnxruntime/discussions.atom" },
  { source: "github_discussions", channel: "browser-use discussions", url: "https://github.com/browser-use/browser-use/discussions.atom" },
  { source: "github_discussions", channel: "haystack discussions", url: "https://github.com/deepset-ai/haystack/discussions.atom" },
  { source: "github_discussions", channel: "qdrant discussions", url: "https://github.com/qdrant/qdrant/discussions.atom" },
  { source: "github_discussions", channel: "reflex discussions", url: "https://github.com/reflex-dev/reflex/discussions.atom" },
  { source: "github_discussions", channel: "strands agents discussions", url: "https://github.com/strands-agents/sdk-python/discussions.atom" },
  { source: "github_discussions", channel: "duckdb discussions", url: "https://github.com/duckdb/duckdb/discussions.atom" },
  { source: "github_discussions", channel: "expo discussions", url: "https://github.com/expo/expo/discussions.atom" },
  { source: "github_discussions", channel: "nuxt discussions", url: "https://github.com/nuxt/nuxt/discussions.atom" },
  { source: "github_discussions", channel: "dify discussions", url: "https://github.com/langgenius/dify/discussions.atom" },
  { source: "github_discussions", channel: "open interpreter discussions", url: "https://github.com/OpenInterpreter/open-interpreter/discussions.atom" },
  { source: "github_discussions", channel: "tanstack query discussions", url: "https://github.com/TanStack/query/discussions.atom" },
  { source: "github_discussions", channel: "storybook discussions", url: "https://github.com/storybookjs/storybook/discussions.atom" },
  { source: "github_discussions", channel: "hono discussions", url: "https://github.com/honojs/hono/discussions.atom" },
  { source: "github_discussions", channel: "biome discussions", url: "https://github.com/biomejs/biome/discussions.atom" },
  { source: "github_discussions", channel: "vitest discussions", url: "https://github.com/vitest-dev/vitest/discussions.atom" },
  { source: "github_discussions", channel: "milvus discussions", url: "https://github.com/milvus-io/milvus/discussions.atom" },
  { source: "github_discussions", channel: "opentelemetry collector discussions", url: "https://github.com/open-telemetry/opentelemetry-collector/discussions.atom" },
  { source: "github_discussions", channel: "clickhouse discussions", url: "https://github.com/ClickHouse/ClickHouse/discussions.atom" },
  { source: "github_discussions", channel: "drizzle orm discussions", url: "https://github.com/drizzle-team/drizzle-orm/discussions.atom" },
  { source: "github_discussions", channel: "payload cms discussions", url: "https://github.com/payloadcms/payload/discussions.atom" },
  { source: "github_discussions", channel: "strapi discussions", url: "https://github.com/strapi/strapi/discussions.atom" },
  { source: "github_discussions", channel: "apache seatunnel discussions", url: "https://github.com/apache/seatunnel/discussions.atom" },
  { source: "github_discussions", channel: "zed discussions", url: "https://github.com/zed-industries/zed/discussions.atom" },
  { source: "github_discussions", channel: "openbb discussions", url: "https://github.com/OpenBB-finance/OpenBB/discussions.atom" },
  { source: "github_discussions", channel: "appwrite discussions", url: "https://github.com/appwrite/appwrite/discussions.atom" },
  { source: "github_discussions", channel: "nocodb discussions", url: "https://github.com/nocodb/nocodb/discussions.atom" },
  { source: "github_discussions", channel: "rustdesk discussions", url: "https://github.com/rustdesk/rustdesk/discussions.atom" },
  { source: "github_discussions", channel: "immich discussions", url: "https://github.com/immich-app/immich/discussions.atom" },
  { source: "github_discussions", channel: "google gemini cli discussions", url: "https://github.com/google-gemini/gemini-cli/discussions.atom" },
  { source: "github_discussions", channel: "hugging face smolagents discussions", url: "https://github.com/huggingface/smolagents/discussions.atom" },
  { source: "github_discussions", channel: "microsoft markitdown discussions", url: "https://github.com/microsoft/markitdown/discussions.atom" },
  { source: "github_discussions", channel: "delta lake discussions", url: "https://github.com/delta-io/delta/discussions.atom" },
  { source: "github_discussions", channel: "assistant-ui discussions", url: "https://github.com/assistant-ui/assistant-ui/discussions.atom" },
  { source: "github_discussions", channel: "ruff discussions", url: "https://github.com/astral-sh/ruff/discussions.atom" },
  { source: "github_discussions", channel: "sentry discussions", url: "https://github.com/getsentry/sentry/discussions.atom" },
  { source: "github_discussions", channel: "firebase js sdk discussions", url: "https://github.com/firebase/firebase-js-sdk/discussions.atom" },
  { source: "github_discussions", channel: "google adk python discussions", url: "https://github.com/google/adk-python/discussions.atom" },
  { source: "github_discussions", channel: "composio discussions", url: "https://github.com/ComposioHQ/composio/discussions.atom" },
  { source: "github_discussions", channel: "agno discussions", url: "https://github.com/agno-agi/agno/discussions.atom" },
  { source: "arduino", channel: "arduino forum", url: "https://forum.arduino.cc/latest.rss" },
  { source: "google_trends", channel: "google trends us", url: "https://trends.google.com/trending/rss?geo=US" },
  { source: "slickdeals", channel: "hotukdeals deals", url: "https://www.hotukdeals.com/rss" },
  { source: "redflagdeals", channel: "redflagdeals hot deals", url: "https://forums.redflagdeals.com/feed/forum/9" },
  { source: "ozbargain", channel: "ozbargain deals", url: "https://www.ozbargain.com.au/deals/feed" },
  { source: "cybertruck_owners_club", channel: "cybertruck owners club", url: "https://www.cybertruckownersclub.com/forum/forums/-/index.rss" },
  { source: "lucid_owners", channel: "lucid owners forum", url: "https://lucidowners.com/forums/-/index.rss" },
  { source: "mach_e_forum", channel: "mach-e forum", url: "https://www.macheforum.com/site/forums/-/index.rss" },
  { source: "f150_lightning_forum", channel: "f-150 lightning forum", url: "https://www.f150lightningforum.com/forum/forums/-/index.rss" },
  { source: "kia_ev_forum", channel: "kia ev forum", url: "https://www.kiaevforums.com/forums/-/index.rss" },
  { source: "inside_evs_forum", channel: "inside evs forum", url: "https://www.insideevsforum.com/community/index.php?forums/-/index.rss" },
  { source: "ford_tremor_forum", channel: "ford tremor forum", url: "https://www.fordtremor.com/forums/-/index.rss" },
  { source: "chevy_bolt_forum", channel: "chevy bolt ev forum", url: "https://www.chevybolt.org/forums/-/index.rss" },
  { source: "vwidtalk_forum", channel: "vw id talk forum", url: "https://www.vwidtalk.com/forums/-/index.rss" },
  { source: "ioniq_forum", channel: "hyundai ioniq forum", url: "https://www.ioniqforum.com/forums/-/index.rss" },
  { source: "tesla_owners_online", channel: "tesla owners online forum", url: "https://teslaownersonline.com/forums/-/index.rss" },
  { source: "android_central", channel: "android central forums", url: "https://forums.androidcentral.com/index.php?forums/-/index.rss" },
  { source: "snbforums", channel: "smallnetbuilder forums", url: "https://www.snbforums.com/forums/-/index.rss" },
  { source: "wilders_security", channel: "wilders security forum", url: "https://www.wilderssecurity.com/forums/-/index.rss" },
  { source: "proxmox", channel: "proxmox support forum", url: "https://forum.proxmox.com/forums/-/index.rss" },
  { source: "netgate", channel: "netgate forum", url: "https://forum.netgate.com/recent.rss" },
  { source: "sonos", channel: "sonos community", url: "https://en.community.sonos.com/feed/topics" },
  { source: "klaviyo", channel: "klaviyo community", url: "https://community.klaviyo.com/feed/topics" },
  { source: "zapier", channel: "zapier community", url: "https://community.zapier.com/feed/topics" },
  { source: "zoom", channel: "zoom community", url: "https://community.zoom.com/feed/topics" },
  { source: "rivian_owners_forum", channel: "rivian owners forum", url: "https://www.rivianownersforum.com/forums/-/index.rss" },
  { source: "airtable", channel: "airtable community", url: "https://community.airtable.com/feed/topics" },
  { source: "miro", channel: "miro community", url: "https://community.miro.com/feed/topics" },
  { source: "typeform", channel: "typeform community", url: "https://community.typeform.com/feed/topics" },
  { source: "docusign", channel: "docusign community", url: "https://community.docusign.com/feed/topics" },
  { source: "freshworks", channel: "freshworks community", url: "https://community.freshworks.com/feed/topics" },
  { source: "porsche_taycan_forum", channel: "porsche taycan forum", url: "https://www.taycanforum.com/forum/forums/-/index.rss" },
  { source: "bmw_ix_forum", channel: "bmw ix forum", url: "https://www.ixforums.com/forums/-/index.rss" },
  { source: "bmw_i4_forum", channel: "bmw i4 forum", url: "https://www.i4talk.com/forums/-/index.rss" },
  { source: "polestar_forum", channel: "polestar forum", url: "https://www.polestar-forum.com/forums/-/index.rss" },
  { source: "silverado_ev_forum", channel: "silverado ev forum", url: "https://www.silveradoevforum.com/forums/-/index.rss" },
  { source: "solterra_forum", channel: "subaru solterra forum", url: "https://www.solterraforum.com/forums/-/index.rss" },
  { source: "mercedes_eq_forum", channel: "mercedes eq forum", url: "https://www.mbeqclub.com/forums/-/index.rss" },
  { source: "rav4world", channel: "toyota rav4 world", url: "https://www.rav4world.com/forums/-/index.rss" },
  { source: "bronco6g", channel: "bronco6g forum", url: "https://www.bronco6g.com/forum/forums/-/index.rss" },
  { source: "f150gen14", channel: "f-150 gen14 forum", url: "https://www.f150gen14.com/forum/forums/-/index.rss" },
  { source: "tacoma4g", channel: "toyota tacoma 4g forum", url: "https://www.tacoma4g.com/forum/forums/-/index.rss" },
  { source: "ram1500forum", channel: "5th gen ram forum", url: "https://5thgenrams.com/community/forums/-/index.rss" },
  { source: "esri", channel: "arcgis pro community", url: "https://community.esri.com/ccqpr47374/rss/board?board.id=arcgis-pro-questions" },
  { source: "maker_forums", channel: "maker forums", url: "https://forum.makerforums.info/latest.rss" },
  { source: "privacy_guides", channel: "privacy guides community", url: "https://discuss.privacyguides.net/latest.rss" },
  { source: "zcash_community", channel: "zcash community forum", url: "https://forum.zcashcommunity.com/latest.rss" },
  { source: "qubes_os", channel: "qubes os forum", url: "https://forum.qubes-os.org/latest.rss" },
  { source: "unraid", channel: "unraid forum", url: "https://forums.unraid.net/discover/6.xml/?membermap=1" },
  { source: "mysensors", channel: "mysensors forum", url: "https://forum.mysensors.org/recent.rss" },
];

const discourseForums = [
  {
    source: "coda",
    channel: "coda community",
    site: "https://community.coda.io",
    url: "https://community.coda.io/latest.json",
  },
  {
    source: "discourse",
    channel: "hugging face forum",
    site: "https://discuss.huggingface.co",
    url: "https://discuss.huggingface.co/latest.json",
  },
  {
    source: "discourse",
    channel: "openai developer community",
    site: "https://community.openai.com",
    url: "https://community.openai.com/latest.json",
  },
  {
    source: "discourse",
    channel: "google ai developers forum",
    site: "https://discuss.ai.google.dev",
    url: "https://discuss.ai.google.dev/latest.json",
  },
  {
    source: "discourse",
    channel: "polkadot forum",
    site: "https://forum.polkadot.network",
    url: "https://forum.polkadot.network/latest.json",
  },
  {
    source: "discourse",
    channel: "pytorch forums",
    site: "https://discuss.pytorch.org",
    url: "https://discuss.pytorch.org/latest.json",
  },
  {
    source: "discourse",
    channel: "python discuss",
    site: "https://discuss.python.org",
    url: "https://discuss.python.org/latest.json",
  },
  {
    source: "discourse",
    channel: "ray discuss",
    site: "https://discuss.ray.io",
    url: "https://discuss.ray.io/latest.json",
  },
  {
    source: "discourse",
    channel: "fly.io community",
    site: "https://community.fly.io",
    url: "https://community.fly.io/latest.json",
  },
  {
    source: "discourse",
    channel: "solana forum",
    site: "https://forum.solana.com",
    url: "https://forum.solana.com/latest.json",
  },
  {
    source: "discourse",
    channel: "optimism governance",
    site: "https://gov.optimism.io",
    url: "https://gov.optimism.io/latest.json",
  },
  {
    source: "discourse",
    channel: "uniswap governance",
    site: "https://gov.uniswap.org",
    url: "https://gov.uniswap.org/latest.json",
  },
  {
    source: "discourse",
    channel: "deeplearning.ai community",
    site: "https://community.deeplearning.ai",
    url: "https://community.deeplearning.ai/latest.json",
  },
  {
    source: "discourse",
    channel: "nvidia developer forums",
    site: "https://forums.developer.nvidia.com",
    url: "https://forums.developer.nvidia.com/latest.json",
  },
  {
    source: "discourse",
    channel: "vercel community",
    site: "https://community.vercel.com",
    url: "https://community.vercel.com/latest.json",
  },
  {
    source: "discourse",
    channel: "arbitrum governance",
    site: "https://forum.arbitrum.foundation",
    url: "https://forum.arbitrum.foundation/latest.json",
  },
  {
    source: "discourse",
    channel: "shopify developer community",
    site: "https://community.shopify.dev",
    url: "https://community.shopify.dev/latest.json",
  },
  {
    source: "discourse",
    channel: "atlassian developer community",
    site: "https://community.developer.atlassian.com",
    url: "https://community.developer.atlassian.com/latest.json",
  },
  {
    source: "discourse",
    channel: "aave governance",
    site: "https://governance.aave.com",
    url: "https://governance.aave.com/latest.json",
  },
  {
    source: "discourse",
    channel: "safe community",
    site: "https://forum.safe.global",
    url: "https://forum.safe.global/latest.json",
  },
  {
    source: "discourse",
    channel: "dfinity forum",
    site: "https://forum.dfinity.org",
    url: "https://forum.dfinity.org/latest.json",
  },
  {
    source: "discourse",
    channel: "posit community",
    site: "https://forum.posit.co",
    url: "https://forum.posit.co/latest.json",
  },
  {
    source: "discourse",
    channel: "grafana community",
    site: "https://community.grafana.com",
    url: "https://community.grafana.com/latest.json",
  },
  {
    source: "discourse",
    channel: "ethereum magicians",
    site: "https://ethereum-magicians.org",
    url: "https://ethereum-magicians.org/latest.json",
  },
  {
    source: "discourse",
    channel: "swift forums",
    site: "https://forums.swift.org",
    url: "https://forums.swift.org/latest.json",
  },
  {
    source: "discourse",
    channel: "cosmos forum",
    site: "https://forum.cosmos.network",
    url: "https://forum.cosmos.network/latest.json",
  },
  {
    source: "discourse",
    channel: "celestia forum",
    site: "https://forum.celestia.org",
    url: "https://forum.celestia.org/latest.json",
  },
  {
    source: "discourse",
    channel: "sky ecosystem forum",
    site: "https://forum.skyeco.com",
    url: "https://forum.skyeco.com/latest.json",
  },
  {
    source: "discourse",
    channel: "alpaca forum",
    site: "https://forum.alpaca.markets",
    url: "https://forum.alpaca.markets/latest.json",
  },
  {
    source: "discourse",
    channel: "cursor forum",
    site: "https://forum.cursor.com",
    url: "https://forum.cursor.com/latest.json",
  },
  {
    source: "discourse",
    channel: "hashicorp discuss",
    site: "https://discuss.hashicorp.com",
    url: "https://discuss.hashicorp.com/latest.json",
  },
  {
    source: "discourse",
    channel: "temporal community",
    site: "https://community.temporal.io",
    url: "https://community.temporal.io/latest.json",
  },
  {
    source: "discourse",
    channel: "auth0 community",
    site: "https://community.auth0.com",
    url: "https://community.auth0.com/latest.json",
  },
  {
    source: "discourse",
    channel: "discuss kubernetes",
    site: "https://discuss.kubernetes.io",
    url: "https://discuss.kubernetes.io/latest.json",
  },
  {
    source: "discourse",
    channel: "elastic discuss",
    site: "https://discuss.elastic.co",
    url: "https://discuss.elastic.co/latest.json",
  },
  {
    source: "discourse",
    channel: "rust users forum",
    site: "https://users.rust-lang.org",
    url: "https://users.rust-lang.org/latest.json",
  },
  {
    source: "discourse",
    channel: "polygon governance forum",
    site: "https://forum.polygon.technology",
    url: "https://forum.polygon.technology/latest.json",
  },
  {
    source: "discourse",
    channel: "ubuntu discourse",
    site: "https://discourse.ubuntu.com",
    url: "https://discourse.ubuntu.com/latest.json",
  },
  {
    source: "discourse",
    channel: "home assistant community",
    site: "https://community.home-assistant.io",
    url: "https://community.home-assistant.io/latest.json",
  },
  {
    source: "discourse",
    channel: "unreal engine forums",
    site: "https://forums.unrealengine.com",
    url: "https://forums.unrealengine.com/latest.json",
  },
  {
    source: "discourse",
    channel: "mozilla discourse",
    site: "https://discourse.mozilla.org",
    url: "https://discourse.mozilla.org/latest.json",
  },
  {
    source: "discourse",
    channel: "openwrt forum",
    site: "https://forum.openwrt.org",
    url: "https://forum.openwrt.org/latest.json",
  },
  {
    source: "truenas",
    channel: "truenas community forums",
    site: "https://forums.truenas.com",
    url: "https://forums.truenas.com/latest.json",
  },
  {
    source: "wyze",
    channel: "wyze forum",
    site: "https://forums.wyze.com",
    url: "https://forums.wyze.com/latest.json",
  },
  {
    source: "smartthings",
    channel: "smartthings community",
    site: "https://community.smartthings.com",
    url: "https://community.smartthings.com/latest.json",
  },
  {
    source: "homey",
    channel: "homey community",
    site: "https://community.homey.app",
    url: "https://community.homey.app/latest.json",
  },
  {
    source: "obsidian",
    channel: "obsidian forum",
    site: "https://forum.obsidian.md",
    url: "https://forum.obsidian.md/latest.json",
  },
  {
    source: "langchain",
    channel: "langchain forum",
    site: "https://forum.langchain.com",
    url: "https://forum.langchain.com/latest.json",
  },
  {
    source: "open_robotics",
    channel: "open robotics discourse",
    site: "https://discourse.openrobotics.org",
    url: "https://discourse.openrobotics.org/latest.json",
  },
  {
    source: "framework",
    channel: "framework laptop community",
    site: "https://community.frame.work",
    url: "https://community.frame.work/latest.json",
  },
  {
    source: "level1techs",
    channel: "level1techs forum",
    site: "https://forum.level1techs.com",
    url: "https://forum.level1techs.com/latest.json",
  },
  {
    source: "julia",
    channel: "julia discourse",
    site: "https://discourse.julialang.org",
    url: "https://discourse.julialang.org/latest.json",
  },
  {
    source: "discourse",
    channel: "streamlit community",
    site: "https://discuss.streamlit.io",
    url: "https://discuss.streamlit.io/latest.json",
  },
  {
    source: "discourse",
    channel: "netlify community",
    site: "https://answers.netlify.com",
    url: "https://answers.netlify.com/latest.json",
  },
  {
    source: "discourse",
    channel: "bitwarden community",
    site: "https://community.bitwarden.com",
    url: "https://community.bitwarden.com/latest.json",
  },
  {
    source: "discourse",
    channel: "lido research forum",
    site: "https://research.lido.fi",
    url: "https://research.lido.fi/latest.json",
  },
  {
    source: "discourse",
    channel: "rocket pool forum",
    site: "https://dao.rocketpool.net",
    url: "https://dao.rocketpool.net/latest.json",
  },
  {
    source: "discourse",
    channel: "starknet forum",
    site: "https://community.starknet.io",
    url: "https://community.starknet.io/latest.json",
  },
  {
    source: "discourse",
    channel: "gitcoin governance",
    site: "https://gov.gitcoin.co",
    url: "https://gov.gitcoin.co/latest.json",
  },
  {
    source: "discourse",
    channel: "cardano forum",
    site: "https://forum.cardano.org",
    url: "https://forum.cardano.org/latest.json",
  },
  {
    source: "discourse",
    channel: "monzo community",
    site: "https://community.monzo.com",
    url: "https://community.monzo.com/latest.json",
  },
  {
    source: "discourse",
    channel: "elixir forum",
    site: "https://elixirforum.com",
    url: "https://elixirforum.com/latest.json",
  },
  {
    source: "discourse",
    channel: "kotlin discussions",
    site: "https://discuss.kotlinlang.org",
    url: "https://discuss.kotlinlang.org/latest.json",
  },
  {
    source: "mongodb",
    channel: "mongodb community forum",
    site: "https://www.mongodb.com/community/forums",
    url: "https://www.mongodb.com/community/forums/latest.json",
  },
  {
    source: "node_red",
    channel: "node-red forum",
    site: "https://discourse.nodered.org",
    url: "https://discourse.nodered.org/latest.json",
  },
  {
    source: "discourse",
    channel: "dbt community forum",
    site: "https://discourse.getdbt.com",
    url: "https://discourse.getdbt.com/latest.json",
  },
  {
    source: "discourse",
    channel: "influxdata community",
    site: "https://community.influxdata.com",
    url: "https://community.influxdata.com/latest.json",
  },
  {
    source: "discourse",
    channel: "fast.ai forum",
    site: "https://forums.fast.ai",
    url: "https://forums.fast.ai/latest.json",
  },
  {
    source: "discourse",
    channel: "ros discourse",
    site: "https://discourse.ros.org",
    url: "https://discourse.ros.org/latest.json",
  },
  {
    source: "discourse",
    channel: "edge impulse forum",
    site: "https://forum.edgeimpulse.com",
    url: "https://forum.edgeimpulse.com/latest.json",
  },
  {
    source: "discourse",
    channel: "n8n community",
    site: "https://community.n8n.io",
    url: "https://community.n8n.io/latest.json",
  },
  {
    source: "discourse",
    channel: "openzeppelin forum",
    site: "https://forum.openzeppelin.com",
    url: "https://forum.openzeppelin.com/latest.json",
  },
  {
    source: "discourse",
    channel: "zcash community forum",
    site: "https://forum.zcashcommunity.com",
    url: "https://forum.zcashcommunity.com/latest.json",
  },
  {
    source: "discourse",
    channel: "gnosis forum",
    site: "https://forum.gnosis.io",
    url: "https://forum.gnosis.io/latest.json",
  },
  {
    source: "discourse",
    channel: "balancer forum",
    site: "https://forum.balancer.fi",
    url: "https://forum.balancer.fi/latest.json",
  },
  {
    source: "discourse",
    channel: "celo forum",
    site: "https://forum.celo.org",
    url: "https://forum.celo.org/latest.json",
  },
  {
    source: "discourse",
    channel: "godot forum",
    site: "https://forum.godotengine.org",
    url: "https://forum.godotengine.org/latest.json",
  },
  {
    source: "discourse",
    channel: "gitlab forum",
    site: "https://forum.gitlab.com",
    url: "https://forum.gitlab.com/latest.json",
  },
  {
    source: "discourse",
    channel: "retool community",
    site: "https://community.retool.com",
    url: "https://community.retool.com/latest.json",
  },
  {
    source: "discourse",
    channel: "jupyter discourse",
    site: "https://discourse.jupyter.org",
    url: "https://discourse.jupyter.org/latest.json",
  },
  {
    source: "discourse",
    channel: "plotly community",
    site: "https://community.plotly.com",
    url: "https://community.plotly.com/latest.json",
  },
  {
    source: "discourse",
    channel: "neo4j community",
    site: "https://community.neo4j.com",
    url: "https://community.neo4j.com/latest.json",
  },
  {
    source: "discourse",
    channel: "osmosis forum",
    site: "https://forum.osmosis.zone",
    url: "https://forum.osmosis.zone/latest.json",
  },
  {
    source: "discourse",
    channel: "scroll forum",
    site: "https://forum.scroll.io",
    url: "https://forum.scroll.io/latest.json",
  },
  {
    source: "discourse",
    channel: "llvm discourse",
    site: "https://discourse.llvm.org",
    url: "https://discourse.llvm.org/latest.json",
  },
  {
    source: "discourse",
    channel: "ethereum research",
    site: "https://ethresear.ch",
    url: "https://ethresear.ch/latest.json",
  },
  {
    source: "discourse",
    channel: "perplexity community",
    site: "https://community.perplexity.ai",
    url: "https://community.perplexity.ai/latest.json",
  },
  {
    source: "discourse",
    channel: "bubble forum",
    site: "https://forum.bubble.io",
    url: "https://forum.bubble.io/latest.json",
  },
  {
    source: "discourse",
    channel: "webflow forum",
    site: "https://discourse.webflow.com",
    url: "https://discourse.webflow.com/latest.json",
  },
  {
    source: "discourse",
    channel: "uipath forum",
    site: "https://forum.uipath.com",
    url: "https://forum.uipath.com/latest.json",
  },
  {
    source: "discourse",
    channel: "kicad forum",
    site: "https://forum.kicad.info",
    url: "https://forum.kicad.info/latest.json",
  },
  {
    source: "discourse",
    channel: "pimoroni forum",
    site: "https://forums.pimoroni.com",
    url: "https://forums.pimoroni.com/latest.json",
  },
  {
    source: "core_electronics",
    channel: "core electronics forum",
    site: "https://forum.core-electronics.com.au",
    url: "https://forum.core-electronics.com.au/latest.json",
  },
  {
    source: "open_energy_monitor",
    channel: "openenergymonitor community",
    site: "https://community.openenergymonitor.org",
    url: "https://community.openenergymonitor.org/latest.json",
  },
  {
    source: "zama",
    channel: "zama community",
    site: "https://community.zama.ai",
    url: "https://community.zama.ai/latest.json",
  },
  {
    source: "kong",
    channel: "kong community",
    site: "https://discuss.konghq.com",
    url: "https://discuss.konghq.com/latest.json",
  },
  {
    source: "ardupilot",
    channel: "ardupilot discourse",
    site: "https://discuss.ardupilot.org",
    url: "https://discuss.ardupilot.org/latest.json",
  },
  {
    source: "compound",
    channel: "compound governance",
    site: "https://www.comp.xyz",
    url: "https://www.comp.xyz/latest.json",
  },
  {
    source: "morpho",
    channel: "morpho forum",
    site: "https://forum.morpho.org",
    url: "https://forum.morpho.org/latest.json",
  },
  {
    source: "discourse",
    channel: "brave community",
    site: "https://community.brave.com",
    url: "https://community.brave.com/latest.json",
  },
  {
    source: "discourse",
    channel: "the graph forum",
    site: "https://forum.thegraph.com",
    url: "https://forum.thegraph.com/latest.json",
  },
  {
    source: "discourse",
    channel: "tezos agora",
    site: "https://forum.tezosagora.org",
    url: "https://forum.tezosagora.org/latest.json",
  },
  {
    source: "discourse",
    channel: "storj forum",
    site: "https://forum.storj.io",
    url: "https://forum.storj.io/latest.json",
  },
  {
    source: "discourse",
    channel: "ssv network forum",
    site: "https://forum.ssv.network",
    url: "https://forum.ssv.network/latest.json",
  },
  {
    source: "discourse",
    channel: "threshold forum",
    site: "https://forum.threshold.network",
    url: "https://forum.threshold.network/latest.json",
  },
  {
    source: "discourse",
    channel: "pokt forum",
    site: "https://forum.pokt.network",
    url: "https://forum.pokt.network/latest.json",
  },
  {
    source: "discourse",
    channel: "weaviate forum",
    site: "https://forum.weaviate.io",
    url: "https://forum.weaviate.io/latest.json",
  },
  {
    source: "discourse",
    channel: "opencv forum",
    site: "https://forum.opencv.org",
    url: "https://forum.opencv.org/latest.json",
  },
  {
    source: "discourse",
    channel: "eigenlayer forum",
    site: "https://forum.eigenlayer.xyz",
    url: "https://forum.eigenlayer.xyz/latest.json",
  },
  {
    source: "discourse",
    channel: "flashbots collective",
    site: "https://collective.flashbots.net",
    url: "https://collective.flashbots.net/latest.json",
  },
  {
    source: "discourse",
    channel: "stakewise forum",
    site: "https://forum.stakewise.io",
    url: "https://forum.stakewise.io/latest.json",
  },
  {
    source: "discourse",
    channel: "1inch governance",
    site: "https://gov.1inch.io",
    url: "https://gov.1inch.io/latest.json",
  },
  {
    source: "discourse",
    channel: "frax governance",
    site: "https://gov.frax.finance",
    url: "https://gov.frax.finance/latest.json",
  },
  {
    source: "discourse",
    channel: "rari foundation forum",
    site: "https://forum.rari.foundation",
    url: "https://forum.rari.foundation/latest.json",
  },
  {
    source: "discourse",
    channel: "mantle forum",
    site: "https://forum.mantle.xyz",
    url: "https://forum.mantle.xyz/latest.json",
  },
  {
    source: "discourse",
    channel: "portfolio123 community",
    site: "https://community.portfolio123.com",
    url: "https://community.portfolio123.com/latest.json",
  },
  {
    source: "discourse",
    channel: "seeed studio forum",
    site: "https://forum.seeedstudio.com",
    url: "https://forum.seeedstudio.com/latest.json",
  },
  {
    source: "discourse",
    channel: "circleci discuss",
    site: "https://discuss.circleci.com",
    url: "https://discuss.circleci.com/latest.json",
  },
  {
    source: "discourse",
    channel: "make community",
    site: "https://community.make.com",
    url: "https://community.make.com/latest.json",
  },
  {
    source: "discourse",
    channel: "yearn governance",
    site: "https://gov.yearn.fi",
    url: "https://gov.yearn.fi/latest.json",
  },
  {
    source: "klipper",
    channel: "klipper community",
    site: "https://klipper.discourse.group",
    url: "https://klipper.discourse.group/latest.json",
  },
  {
    source: "discourse",
    channel: "letsencrypt community",
    site: "https://community.letsencrypt.org",
    url: "https://community.letsencrypt.org/latest.json",
  },
  {
    source: "discourse",
    channel: "confluent kafka forum",
    site: "https://forum.confluent.io",
    url: "https://forum.confluent.io/latest.json",
  },
  {
    source: "discourse",
    channel: "octoprint community",
    site: "https://community.octoprint.org",
    url: "https://community.octoprint.org/latest.json",
  },
  {
    source: "discourse",
    channel: "tron dao forum",
    site: "https://forum.trondao.org",
    url: "https://forum.trondao.org/latest.json",
  },
  {
    source: "discourse",
    channel: "algorand forum",
    site: "https://forum.algorand.org",
    url: "https://forum.algorand.org/latest.json",
  },
  {
    source: "signalusers",
    channel: "signal users community",
    site: "https://community.signalusers.org",
    url: "https://community.signalusers.org/latest.json",
  },
  {
    source: "snapcraft",
    channel: "snapcraft forum",
    site: "https://forum.snapcraft.io",
    url: "https://forum.snapcraft.io/latest.json",
  },
  {
    source: "openhab",
    channel: "openhab community",
    site: "https://community.openhab.org",
    url: "https://community.openhab.org/latest.json",
  },
  {
    source: "particle",
    channel: "particle community",
    site: "https://community.particle.io",
    url: "https://community.particle.io/latest.json",
  },
  {
    source: "hubitat",
    channel: "hubitat community",
    site: "https://community.hubitat.com",
    url: "https://community.hubitat.com/latest.json",
  },
  {
    source: "mattermost",
    channel: "mattermost forum",
    site: "https://forum.mattermost.com",
    url: "https://forum.mattermost.com/latest.json",
  },
  {
    source: "discourse",
    channel: "decentraland forum",
    site: "https://forum.decentraland.org",
    url: "https://forum.decentraland.org/latest.json",
  },
  {
    source: "discourse",
    channel: "frappe forum",
    site: "https://discuss.frappe.io",
    url: "https://discuss.frappe.io/latest.json",
  },
  {
    source: "discourse",
    channel: "ghost forum",
    site: "https://forum.ghost.org",
    url: "https://forum.ghost.org/latest.json",
  },
  {
    source: "discourse",
    channel: "lawrence systems forum",
    site: "https://forums.lawrencesystems.com",
    url: "https://forums.lawrencesystems.com/latest.json",
  },
  {
    source: "discourse",
    channel: "trading 212 community",
    site: "https://community.trading212.com",
    url: "https://community.trading212.com/latest.json",
  },
  {
    source: "discourse",
    channel: "roon community",
    site: "https://community.roonlabs.com",
    url: "https://community.roonlabs.com/latest.json",
  },
  {
    source: "plex",
    channel: "plex forums",
    site: "https://forums.plex.tv",
    url: "https://forums.plex.tv/latest.json",
  },
  {
    source: "discourse",
    channel: "smartthings community",
    site: "https://community.smartthings.com",
    url: "https://community.smartthings.com/latest.json",
  },
  {
    source: "discourse",
    channel: "netdata community",
    site: "https://community.netdata.cloud",
    url: "https://community.netdata.cloud/latest.json",
  },
  {
    source: "discourse",
    channel: "traefik community",
    site: "https://community.traefik.io",
    url: "https://community.traefik.io/latest.json",
  },
  {
    source: "grist",
    channel: "grist community",
    site: "https://community.getgrist.com",
    url: "https://community.getgrist.com/latest.json",
  },
  {
    source: "activepieces",
    channel: "activepieces community",
    site: "https://community.activepieces.com",
    url: "https://community.activepieces.com/latest.json",
  },
  {
    source: "latenode",
    channel: "latenode community",
    site: "https://community.latenode.com",
    url: "https://community.latenode.com/latest.json",
  },
  {
    source: "directus",
    channel: "directus community",
    site: "https://community.directus.com",
    url: "https://community.directus.com/latest.json",
  },
  {
    source: "discourse",
    channel: "weweb community",
    site: "https://community.weweb.io",
    url: "https://community.weweb.io/latest.json",
  },
  {
    source: "discourse",
    channel: "plasmic forum",
    site: "https://forum.plasmic.app",
    url: "https://forum.plasmic.app/latest.json",
  },
  {
    source: "discourse",
    channel: "three.js forum",
    site: "https://discourse.threejs.org",
    url: "https://discourse.threejs.org/latest.json",
  },
  {
    source: "discourse",
    channel: "odk forum",
    site: "https://forum.getodk.org",
    url: "https://forum.getodk.org/latest.json",
  },
  {
    source: "wappler",
    channel: "wappler community",
    site: "https://community.wappler.io",
    url: "https://community.wappler.io/latest.json",
  },
  {
    source: "glide",
    channel: "glide community",
    site: "https://community.glideapps.com",
    url: "https://community.glideapps.com/latest.json",
  },
  {
    source: "pipedream",
    channel: "pipedream community",
    site: "https://pipedream.com/community",
    url: "https://pipedream.com/community/latest.json",
  },
  {
    source: "bambu_lab",
    channel: "bambu lab forum",
    site: "https://forum.bambulab.com",
    url: "https://forum.bambulab.com/latest.json",
  },
  {
    source: "glinet",
    channel: "gl.inet forum",
    site: "https://forum.gl-inet.com",
    url: "https://forum.gl-inet.com/latest.json",
  },
  {
    source: "fairphone",
    channel: "fairphone community",
    site: "https://forum.fairphone.com",
    url: "https://forum.fairphone.com/latest.json",
  },
  {
    source: "sailfish_os",
    channel: "sailfish os forum",
    site: "https://forum.sailfishos.org",
    url: "https://forum.sailfishos.org/latest.json",
  },
  {
    source: "trae",
    channel: "trae community",
    site: "https://forum.trae.cn",
    url: "https://forum.trae.cn/latest.json",
  },
  {
    source: "aqara",
    channel: "aqara forum",
    site: "https://forum.aqara.com",
    url: "https://forum.aqara.com/latest.json",
  },
];

const stackExchangeQueries = [
  {
    source: "stackexchange",
    channel: "stackoverflow ai",
    site: "stackoverflow",
    tagged: "artificial-intelligence",
    sort: "creation",
  },
  {
    source: "stackexchange",
    channel: "stackoverflow machine learning",
    site: "stackoverflow",
    tagged: "machine-learning",
    sort: "creation",
  },
  {
    source: "stackexchange",
    channel: "stackoverflow cybersecurity",
    site: "stackoverflow",
    tagged: "cybersecurity",
    sort: "activity",
  },
  {
    source: "stackexchange",
    channel: "stackoverflow cryptocurrency",
    site: "stackoverflow",
    tagged: "cryptocurrency",
    sort: "activity",
  },
  {
    source: "stackexchange",
    channel: "quantitative finance",
    site: "quant",
    sort: "activity",
  },
  {
    source: "stackexchange",
    channel: "personal finance",
    site: "money",
    sort: "activity",
  },
  {
    source: "stackexchange",
    channel: "ai stack exchange",
    site: "ai",
    sort: "activity",
  },
  {
    source: "stackexchange",
    channel: "data science stack exchange",
    site: "datascience",
    sort: "activity",
  },
  {
    source: "stackexchange",
    channel: "bitcoin stack exchange",
    site: "bitcoin",
    sort: "activity",
  },
  {
    source: "stackexchange",
    channel: "ethereum stack exchange",
    site: "ethereum",
    sort: "activity",
  },
  {
    source: "stackexchange",
    channel: "economics stack exchange",
    site: "economics",
    sort: "activity",
  },
  {
    source: "stackexchange",
    channel: "cross validated",
    site: "stats",
    sort: "activity",
  },
  {
    source: "stackexchange",
    channel: "genai stack exchange",
    site: "genai",
    sort: "activity",
  },
];

const tickerAliases = new Map(
  Object.entries({
    Apple: "AAPL",
    iPhone: "AAPL",
    Microsoft: "MSFT",
    Azure: "MSFT",
    OpenAI: "MSFT",
    Nvidia: "NVDA",
    NVIDIA: "NVDA",
    GPU: "NVDA",
    CUDA: "NVDA",
    Tesla: "TSLA",
    robotaxi: "TSLA",
    Google: "GOOGL",
    Alphabet: "GOOGL",
    Gemini: "GOOGL",
    Meta: "META",
    Facebook: "META",
    Instagram: "META",
    Amazon: "AMZN",
    AWS: "AMZN",
    AMD: "AMD",
    Intel: "INTC",
    Broadcom: "AVGO",
    TSMC: "TSM",
    ASML: "ASML",
    Palantir: "PLTR",
    Coinbase: "COIN",
    Bitcoin: "MSTR",
    "BTC.X": "MSTR",
    Netflix: "NFLX",
    Disney: "DIS",
    Boeing: "BA",
    JPMorgan: "JPM",
    Exxon: "XOM",
  }).map(([key, value]) => [key.toLowerCase(), value]),
);

const sectorTickers = {
  ai: ["NVDA", "MSFT", "GOOGL", "META", "AMD", "AVGO", "PLTR"],
  semiconductor: ["NVDA", "AMD", "INTC", "AVGO", "TSM", "ASML", "SMCI"],
  ev: ["TSLA", "GM", "F", "RIVN", "LCID"],
  crypto: ["MSTR", "COIN", "HOOD", "RIOT", "MARA"],
  streaming: ["NFLX", "DIS", "WBD", "PARA"],
  cybersecurity: ["CRWD", "PANW", "ZS", "NET", "OKTA"],
  banking: ["JPM", "BAC", "C", "GS", "MS"],
  energy: ["XOM", "CVX", "OXY", "COP", "SLB"],
  retail: ["AMZN", "WMT", "TGT", "COST", "SHOP"],
};

const themes = {
  "AI infrastructure": ["ai", "artificial", "intelligence", "agent", "agents", "adk", "composio", "agno", "gpu", "gpus", "datacenter", "llm", "model", "models", "chip", "chips", "cuda", "inference", "vllm"],
  Semiconductors: ["semiconductor", "semiconductors", "chip", "chips", "foundry", "wafer", "tsmc", "asml", "gpu", "cuda"],
  "Electric vehicles": ["tesla", "ev", "electric", "vehicle", "vehicles", "robotaxi", "battery", "charging"],
  "Crypto risk appetite": ["bitcoin", "btc", "ethereum", "crypto", "coinbase", "mstr", "etf", "stablecoin", "solana", "defi", "staking", "validator", "governance", "layer2", "rollup", "arbitrum", "onchain", "vault", "maker", "sky"],
  "Consumer platforms": ["iphone", "app", "store", "instagram", "facebook", "tiktok", "ads", "advertising", "streaming"],
  Cybersecurity: ["cybersecurity", "breach", "ransomware", "hack", "hacked", "security", "vulnerability", "outage"],
  "Macro rates": ["inflation", "rates", "rate", "fed", "jobs", "cpi", "recession", "yield", "yields", "tariff"],
  "Healthcare biotech": ["fda", "drug", "trial", "biotech", "vaccine", "approval", "phase", "patient"],
};

const positiveWords = new Set([
  "beat", "beats", "bull", "bullish", "breakout", "growth", "upgrade", "record", "surge",
  "rally", "strong", "profit", "margin", "demand", "buyback", "approval", "win", "launch",
  "partnership", "raise", "love", "cheap", "ready", "bulls", "buy",
  "greed",
]);

const negativeWords = new Set([
  "bear", "bearish", "miss", "lawsuit", "probe", "investigation", "antitrust", "recall",
  "delay", "cut", "weak", "fraud", "breach", "hack", "outage", "strike", "tariff", "ban",
  "downgrade", "selloff", "crash", "risk", "short", "dump", "expensive", "overvalued",
  "fear",
]);

const stopwords = new Set([
  "about", "after", "again", "against", "also", "because", "before", "being", "could",
  "daily", "does", "down", "from", "have", "into", "just", "like", "market", "markets",
  "more", "most", "news", "over", "people", "post", "really", "says", "some", "stock",
  "stocks", "than", "that", "their", "there", "these", "they", "this", "those", "through",
  "today", "trading", "under", "what", "when", "where", "which", "while", "with", "would",
  "year", "years", "your",
]);

const nonEquityTickers = new Set(["BTC", "ETH", "DOGE", "SOL", "XRP", "ADA"]);

export async function runSocialArbNightly(options = {}) {
  const startedAt = new Date();
  const hours = Number(options.hours || process.env.SOCIAL_ARB_LOOKBACK_HOURS || 14);
  const limitPerSource = Number(options.limitPerSource || process.env.SOCIAL_ARB_LIMIT_PER_SOURCE || 120);
  const items = await collectSocialItems(limitPerSource);
  const recentItems = items.filter((item) => new Date(item.createdAt).getTime() >= Date.now() - hours * 60 * 60 * 1000);
  const analyzedItems = recentItems.length ? recentItems : items;
  const heuristicReport = analyzeItems(analyzedItems);
  const topicReport = await refineReportWithOpenAI(heuristicReport, analyzedItems);
  const report = await buildOvernightSignalReport({ items: analyzedItems, topicReport, generatedAt: new Date() });
  const persisted = await persistReport(report, analyzedItems, startedAt);
  const email = await sendReportEmail(report, persisted?.id || null);

  return {
    ok: true,
    collected: items.length,
    analyzed: analyzedItems.length,
    recommendation: report.recommendation,
    picks: report.picks.length,
    reportId: persisted?.id || null,
    emailId: email?.id || null,
    generatedAt: report.generatedAt,
  };
}

export async function collectSocialItems(limitPerSource = 120) {
  const groups = await Promise.allSettled([
    collectStocktwits(limitPerSource),
    collectBluesky(limitPerSource),
    collectMastodonTags(limitPerSource),
    collectFourChan(limitPerSource),
    collectDevTo(limitPerSource),
    collectDiscourseForums(limitPerSource),
    collectHackerNews(limitPerSource),
    collectRssFeeds(limitPerSource),
    collectReddit(limitPerSource),
    collectStackExchange(limitPerSource),
    collectManifoldMarkets(limitPerSource),
    collectCryptoFearGreed(),
    collectCoinGeckoTrending(),
  ]);
  const seen = new Set();

  return groups
    .flatMap((result) => (result.status === "fulfilled" ? result.value : []))
    .filter((item) => item.title || item.body)
    .filter((item) => uniqueItem(item, seen))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

async function collectStocktwits(limitPerSource) {
  const urls = [
    "https://api.stocktwits.com/api/2/streams/trending.json",
    ...stocktwitsSymbols.map((symbol) => `https://api.stocktwits.com/api/2/streams/symbol/${symbol}.json`),
  ];

  const items = await mapLimit(urls, 8, async (url) => {
    try {
      const data = await fetchJson(url);
      const channel = data.symbol?.symbol || "trending";
      const streamItems = [];
      for (const message of data.messages || []) {
        const symbols = (message.symbols || []).map((symbol) => `$${symbol.symbol}`).join(" ");
        const body = stripHtml(`${message.body || ""} ${symbols}`.trim());
        streamItems.push({
          source: "stocktwits",
          channel,
          externalId: String(message.id),
          title: body.slice(0, 160),
          body,
          url: `https://stocktwits.com/message/${message.id}`,
          author: message.user?.username || "",
          score: 0,
          comments: 0,
          createdAt: parseDate(message.created_at),
          raw: {
            symbols: message.symbols || [],
            sentiment: message.entities?.sentiment?.basic || null,
          },
        });
      }
      return streamItems;
    } catch {
      return [];
    }
  });

  return items.flat().slice(0, limitPerSource);
}

async function collectBluesky(limitPerSource) {
  const perQuery = Math.max(1, Math.floor(limitPerSource / blueskyQueries.length));

  const items = await mapLimit(blueskyQueries, 6, async (query) => {
    const url = `https://api.bsky.app/xrpc/app.bsky.feed.searchPosts?${new URLSearchParams({
      q: query,
      limit: String(Math.min(25, perQuery)),
      sort: "latest",
    })}`;
    try {
      const data = await fetchJson(url);
      const queryItems = [];
      for (const post of data.posts || []) {
        const text = stripHtml(post.record?.text || "");
        const handle = post.author?.handle || "";
        const rkey = String(post.uri || "").split("/").pop();
        queryItems.push({
          source: "bluesky",
          channel: query,
          externalId: post.uri || stableId("bluesky", handle, text),
          title: text.slice(0, 160),
          body: text,
          url: handle && rkey ? `https://bsky.app/profile/${handle}/post/${rkey}` : "https://bsky.app",
          author: handle,
          score: Number(post.likeCount || 0) + Number(post.repostCount || 0),
          comments: Number(post.replyCount || 0),
          createdAt: parseDate(post.indexedAt || post.record?.createdAt),
          raw: {
            likeCount: post.likeCount || 0,
            replyCount: post.replyCount || 0,
            repostCount: post.repostCount || 0,
          },
        });
      }
      return queryItems;
    } catch {
      return [];
    }
  });

  return items.flat().slice(0, limitPerSource);
}

async function collectMastodonTags(limitPerSource) {
  const perTag = Math.max(1, Math.floor(limitPerSource / mastodonTags.length));

  const items = await mapLimit(mastodonTags, 6, async (tag) => {
    const feed = {
      source: "mastodon",
      channel: `#${tag}`,
      url: `https://mastodon.social/tags/${encodeURIComponent(tag)}.rss`,
    };
    try {
      const xml = await fetchText(feed.url);
      return parseRss(xml, feed).slice(0, perTag);
    } catch {
      return [];
    }
  });

  return items.flat().slice(0, limitPerSource);
}

async function collectFourChan(limitPerSource) {
  const perBoard = Math.max(1, Math.floor(limitPerSource / fourChanBoards.length));

  const items = await mapLimit(fourChanBoards, 4, async (board) => {
    try {
      const pages = await fetchJson(`https://a.4cdn.org/${board}/catalog.json`);
      const threads = pages.flatMap((page) => page.threads || []).slice(0, perBoard);
      const boardItems = [];
      for (const thread of threads) {
        const title = stripHtml(thread.sub || thread.com || `/${board}/ thread ${thread.no}`).slice(0, 180);
        const body = stripHtml(thread.com || thread.sub || "");
        boardItems.push({
          source: "fourchan",
          channel: `/${board}/`,
          externalId: `${board}-${thread.no}`,
          title,
          body,
          url: `https://boards.4channel.org/${board}/thread/${thread.no}`,
          author: stripHtml(thread.name || "Anonymous"),
          score: Number(thread.replies || 0) + Number(thread.images || 0),
          comments: Number(thread.replies || 0),
          createdAt: thread.last_modified ? new Date(Number(thread.last_modified) * 1000).toISOString() : parseDate(thread.now),
          raw: {
            board,
            replies: thread.replies || 0,
            images: thread.images || 0,
          },
        });
      }
      return boardItems;
    } catch {
      return [];
    }
  });

  return items.flat().slice(0, limitPerSource);
}

async function collectDevTo(limitPerSource) {
  const perTag = Math.max(1, Math.floor(limitPerSource / devToTags.length));

  const items = await mapLimit(devToTags, 6, async (tag) => {
    const url = `https://dev.to/api/articles?${new URLSearchParams({
      tag,
      top: "1",
      per_page: String(Math.min(30, perTag)),
    })}`;
    try {
      const articles = await fetchJson(url);
      const tagItems = [];
      for (const article of articles || []) {
        tagItems.push({
          source: "devto",
          channel: tag,
          externalId: String(article.id || stableId("devto", article.url, article.title)),
          title: stripHtml(article.title || ""),
          body: stripHtml(article.description || article.readable_publish_date || ""),
          url: article.url || "https://dev.to",
          author: article.user?.username || article.organization?.username || "",
          score: Number(article.public_reactions_count || 0),
          comments: Number(article.comments_count || 0),
          createdAt: parseDate(article.published_at || article.created_at),
          raw: {
            tagList: article.tag_list || [],
          },
        });
      }
      return tagItems;
    } catch {
      return [];
    }
  });

  return items.flat().slice(0, limitPerSource);
}

async function collectDiscourseForums(limitPerSource) {
  const perForum = Math.max(1, Math.floor(limitPerSource / discourseForums.length));

  const items = await mapLimit(discourseForums, 8, async (forum) => {
    try {
      const data = await fetchJson(forum.url);
      const forumItems = [];
      for (const topic of data.topic_list?.topics || []) {
        if (topic.pinned || topic.pinned_globally) continue;
        const tags = (topic.tags || []).map((tag) => (typeof tag === "string" ? tag : tag?.slug || tag?.name || "")).filter(Boolean);
        const gist = stripHtml(topic.ai_topic_gist || "");
        const body = [gist, ...tags.map((tag) => `#${tag}`)].filter(Boolean).join(" ").trim();
        forumItems.push({
          source: forum.source,
          channel: forum.channel,
          externalId: String(topic.id || stableId("discourse", forum.url, topic.slug, topic.title)),
          title: stripHtml(topic.title || topic.fancy_title || ""),
          body,
          url: `${forum.site}/t/${topic.slug}/${topic.id}`,
          author: topic.last_poster_username || "",
          score: Number(topic.like_count || 0) + Number(topic.views || 0) / 25 + Number(topic.posts_count || 0),
          comments: Number(topic.reply_count || 0),
          createdAt: parseDate(topic.bumped_at || topic.last_posted_at || topic.created_at),
          raw: {
            views: Number(topic.views || 0),
            likeCount: Number(topic.like_count || 0),
            postsCount: Number(topic.posts_count || 0),
            tags,
          },
        });
      }
      return forumItems.slice(0, perForum);
    } catch {
      return [];
    }
  });

  return items
    .flat()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limitPerSource);
}

async function collectHackerNews(limitPerSource) {
  const perQuery = Math.max(1, Math.floor(limitPerSource / hnQueries.length));

  const items = await mapLimit(hnQueries, 6, async (query) => {
    const url = `https://hn.algolia.com/api/v1/search_by_date?${new URLSearchParams({
      query,
      tags: "story",
      hitsPerPage: String(perQuery),
    })}`;
    try {
      const data = await fetchJson(url);
      const queryItems = [];
      for (const hit of data.hits || []) {
        const title = stripHtml(hit.title || hit.story_title || "");
        const body = stripHtml(hit.story_text || "");
        queryItems.push({
          source: "hacker_news",
          channel: query,
          externalId: String(hit.objectID || stableId("hn", title)),
          title,
          body,
          url: hit.url || hit.story_url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
          author: hit.author || "",
          score: Number(hit.points || 0),
          comments: Number(hit.num_comments || 0),
          createdAt: parseDate(hit.created_at),
          raw: {},
        });
      }
      return queryItems;
    } catch {
      return [];
    }
  });

  return items.flat().slice(0, limitPerSource);
}

async function collectRssFeeds(limitPerSource) {
  const perFeed = Math.max(1, Math.floor(limitPerSource / rssFeeds.length));
  const items = await mapLimit(rssFeeds, 8, async (feed) => {
    try {
      const xml = await fetchText(feed.url);
      return parseRss(xml, feed).slice(0, perFeed);
    } catch {
      return [];
    }
  });
  return items.flat().slice(0, limitPerSource);
}

async function collectReddit(limitPerSource) {
  const items = await mapLimit(redditSubreddits, 4, async (subreddit) => {
    const feed = {
      source: "reddit",
      channel: `r/${subreddit}`,
      url: `https://www.reddit.com/r/${subreddit}/top/.rss?t=day`,
    };
    try {
      const xml = await fetchText(feed.url);
      return parseRss(xml, feed);
    } catch {
      return [];
    }
  });
  return items.flat().slice(0, limitPerSource);
}

async function collectStackExchange(limitPerSource) {
  const perQuery = Math.max(1, Math.floor(limitPerSource / stackExchangeQueries.length));

  const items = await mapLimit(stackExchangeQueries, 6, async (query) => {
    const params = new URLSearchParams({
      order: "desc",
      sort: query.sort,
      site: query.site,
      pagesize: String(Math.min(20, perQuery)),
      filter: "withbody",
    });
    if (query.tagged) params.set("tagged", query.tagged);
    const url = `https://api.stackexchange.com/2.3/questions?${params}`;
    try {
      const data = await fetchJson(url);
      const queryItems = [];
      for (const question of data.items || []) {
        const body = stripHtml(question.body || "");
        queryItems.push({
          source: query.source,
          channel: query.channel,
          externalId: String(question.question_id || stableId("stackexchange", question.link, question.title)),
          title: stripHtml(question.title || ""),
          body,
          url: question.link || "https://stackexchange.com",
          author: stripHtml(question.owner?.display_name || ""),
          score: Number(question.score || 0) + Number(question.view_count || 0) / 20,
          comments: Number(question.answer_count || 0),
          createdAt:
            query.sort === "activity" && question.last_activity_date
              ? new Date(Number(question.last_activity_date) * 1000).toISOString()
              : question.creation_date
                ? new Date(Number(question.creation_date) * 1000).toISOString()
                : parseDate(question.last_activity_date),
          raw: {
            tags: question.tags || [],
            viewCount: Number(question.view_count || 0),
            answerCount: Number(question.answer_count || 0),
          },
        });
      }
      return queryItems;
    } catch {
      return [];
    }
  });

  return items.flat().slice(0, limitPerSource);
}

async function collectManifoldMarkets(limitPerSource) {
  const perQuery = Math.max(1, Math.floor(limitPerSource / manifoldQueries.length));

  const items = await mapLimit(manifoldQueries, 5, async (query) => {
    const url = `https://api.manifold.markets/v0/search-markets?${new URLSearchParams({
      term: query,
      limit: String(Math.min(20, perQuery)),
    })}`;
    try {
      const markets = await fetchJson(url);
      const marketItems = [];
      for (const market of Array.isArray(markets) ? markets : []) {
        const question = stripHtml(market.question || market.textDescription || "");
        if (!question) continue;
        const probability = Number(market.probability);
        const volume = Number(market.volume || market.volume24Hours || 0);
        const liquidity = Number(market.liquidity || market.totalLiquidity || 0);
        const probabilityText = Number.isFinite(probability)
          ? ` Implied probability: ${Math.round(probability * 100)}%.`
          : "";
        marketItems.push({
          source: "manifold_prediction",
          channel: `manifold: ${query}`,
          externalId: String(market.id || stableId("manifold", market.url, question)),
          title: question.slice(0, 180),
          body: stripHtml(`${market.description || market.textDescription || ""}${probabilityText}`.trim()),
          url: market.url || (market.slug ? `https://manifold.markets/${market.slug}` : "https://manifold.markets"),
          author: stripHtml(market.creatorUsername || market.creatorName || ""),
          score: Number.isFinite(volume) ? volume : 0,
          comments: Number.isFinite(liquidity) ? liquidity / 100 : 0,
          createdAt: market.lastUpdatedTime
            ? new Date(Number(market.lastUpdatedTime)).toISOString()
            : market.createdTime
              ? new Date(Number(market.createdTime)).toISOString()
              : parseDate(market.closeTime),
          raw: {
            query,
            probability: Number.isFinite(probability) ? probability : null,
            volume: Number.isFinite(volume) ? volume : null,
            liquidity: Number.isFinite(liquidity) ? liquidity : null,
            closeTime: market.closeTime || null,
          },
        });
      }
      return marketItems;
    } catch {
      return [];
    }
  });

  return items.flat().slice(0, limitPerSource);
}

async function collectCryptoFearGreed() {
  try {
    const data = await fetchJson("https://api.alternative.me/fng/?limit=1");
    const row = data.data?.[0];
    if (!row) return [];
    const value = Number(row.value || 0);
    const classification = stripHtml(row.value_classification || "Unknown");
    const createdAt = row.timestamp
      ? new Date(Number(row.timestamp) * 1000).toISOString()
      : new Date().toISOString();
    return [
      {
        source: "crypto_fear_greed",
        channel: "alternative.me crypto fear and greed index",
        externalId: `crypto-fear-greed-${row.timestamp || new Date(createdAt).toISOString().slice(0, 10)}`,
        title: `Crypto Fear and Greed Index: ${classification} (${Number.isFinite(value) ? value : "n/a"})`,
        body: `Public crypto retail sentiment gauge from Alternative.me reported ${classification} at ${Number.isFinite(value) ? value : "n/a"} out of 100.`,
        url: "https://alternative.me/crypto/fear-and-greed-index/",
        author: "Alternative.me",
        score: Number.isFinite(value) ? Math.abs(value - 50) / 5 : 0,
        comments: 0,
        createdAt,
        raw: {
          value: Number.isFinite(value) ? value : null,
          valueClassification: classification,
        },
      },
    ];
  } catch {
    return [];
  }
}

async function collectCoinGeckoTrending() {
  try {
    const data = await fetchJson("https://api.coingecko.com/api/v3/search/trending");
    const coins = Array.isArray(data.coins) ? data.coins : [];
    return coins.map(({ item }) => {
      const coin = item || {};
      const name = stripHtml(coin.name || "");
      const symbol = stripHtml(coin.symbol || "").toUpperCase();
      const marketCapRank = Number(coin.market_cap_rank || 0);
      const score = Number(coin.score || 0);
      const dataSummary = coin.data || {};
      const priceChange = Number(dataSummary.price_change_percentage_24h?.usd);
      const priceChangeText = Number.isFinite(priceChange)
        ? `, with a 24h USD move of ${round(priceChange)}%`
        : "";
      return {
        source: "coingecko_trending",
        channel: "coingecko trending crypto search",
        externalId: `coingecko-trending-${coin.id || symbol || name}`,
        title: `CoinGecko trending: ${name || symbol}${symbol ? ` (${symbol})` : ""}`,
        body: `${name || symbol} is trending in CoinGecko public search results${marketCapRank ? ` at market cap rank ${marketCapRank}` : ""}${priceChangeText}.`,
        url: coin.id ? `https://www.coingecko.com/en/coins/${encodeURIComponent(coin.id)}` : "https://www.coingecko.com/en/discover",
        author: "CoinGecko",
        score: Math.max(1, 15 - score) + (marketCapRank ? Math.max(0, 8 - Math.log10(marketCapRank + 1)) : 0),
        comments: 0,
        createdAt: new Date().toISOString(),
        raw: {
          id: coin.id || "",
          symbol,
          marketCapRank: marketCapRank || null,
          priceChangePercentage24hUsd: Number.isFinite(priceChange) ? priceChange : null,
        },
      };
    });
  } catch {
    return [];
  }
}

function analyzeItems(items) {
  const grouped = new Map();
  for (const item of items) {
    const text = `${item.title} ${item.body}`;
    const tokens = tokenize(text);
    const tickers = extractTickers(text);
    const topic = chooseTheme(tokens, tickers);
    const sentiment = itemSentiment(item, tokens);
    const score = itemScore(item);
    if (!grouped.has(topic)) grouped.set(topic, []);
    grouped.get(topic).push({ item, tickers, sentiment, score });
  }

  const topics = [...grouped.entries()]
    .map(([topic, rows]) => buildTopic(topic, rows))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return {
    generatedAt: new Date().toISOString(),
    topics,
  };
}

function buildTopic(topic, rows) {
  const score = rows.reduce((sum, row) => sum + row.score, 0);
  const sentiment = rows.reduce((sum, row) => sum + row.sentiment * row.score, 0) / Math.max(score, 0.001);
  const sources = {};
  const tickerScores = new Map();
  const tickerSentiments = new Map();
  const tickerMentions = new Map();

  for (const row of rows) {
    sources[row.item.source] = (sources[row.item.source] || 0) + 1;
    for (const ticker of uniqueTickers([...row.tickers, ...inferredTickers(topic).slice(0, 3)])) {
      if (nonEquityTickers.has(ticker)) continue;
      const direct = row.tickers.includes(ticker);
      const multiplier = direct ? 1.35 : 0.45;
      tickerScores.set(ticker, (tickerScores.get(ticker) || 0) + row.score * multiplier);
      tickerSentiments.set(ticker, (tickerSentiments.get(ticker) || 0) + row.sentiment * row.score);
      tickerMentions.set(ticker, (tickerMentions.get(ticker) || 0) + (direct ? 1 : 0));
    }
  }

  const affectedStocks = [...tickerScores.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([ticker, tickerScore]) => {
      let tickerSentiment = (tickerSentiments.get(ticker) || 0) / Math.max(tickerScore, 0.001);
      if (Math.abs(tickerSentiment) < 0.05) tickerSentiment = sentiment;
      const direction = tickerSentiment > 0.08 ? "up" : tickerSentiment < -0.08 ? "down" : "mixed";
      const mentions = tickerMentions.get(ticker) || 0;
      return {
        ticker,
        direction,
        confidence: round(Math.min(0.95, 0.35 + Math.min(tickerScore, 20) / 40 + Math.min(Math.abs(tickerSentiment), 1) * 0.2)),
        mentions,
        reason: directionReason(direction, mentions),
      };
    });

  for (const ticker of inferredTickers(topic)) {
    if (affectedStocks.length >= 3) break;
    if (affectedStocks.some((stock) => stock.ticker === ticker)) continue;
    const direction = sentiment > 0.08 ? "up" : sentiment < -0.08 ? "down" : "mixed";
    affectedStocks.push({
      ticker,
      direction,
      confidence: round(0.32 + Math.min(Math.abs(sentiment), 1) * 0.18),
      mentions: 0,
      reason: directionReason(direction, 0),
    });
  }

  const evidence = rows
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((row) => row.item);

  return {
    topic,
    summary: `${rows.length} items across ${Object.keys(sources).length} sources show ${tone(sentiment)} attention around ${topic}.`,
    score: round(score),
    sentiment: round(sentiment),
    sources,
    affectedStocks: affectedStocks.slice(0, 3),
    evidence,
  };
}

async function refineReportWithOpenAI(report, items) {
  if (!process.env.OPENAI_API_KEY || report.topics.length < 3) {
    return report;
  }

  const schema = {
    type: "object",
    additionalProperties: false,
    properties: {
      topics: {
        type: "array",
        minItems: 3,
        maxItems: 3,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            topic: { type: "string" },
            summary: { type: "string" },
            sentiment: { type: "number" },
            affectedStocks: {
              type: "array",
              minItems: 3,
              maxItems: 3,
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  ticker: { type: "string" },
                  direction: { type: "string", enum: ["up", "down", "mixed"] },
                  confidence: { type: "number" },
                  mentions: { type: "integer" },
                  reason: { type: "string" },
                },
                required: ["ticker", "direction", "confidence", "mentions", "reason"],
              },
            },
          },
          required: ["topic", "summary", "sentiment", "affectedStocks"],
        },
      },
    },
    required: ["topics"],
  };

  try {
    const result = await requestOpenAIJson({
      model: process.env.SOCIAL_ARB_OPENAI_MODEL || process.env.OPENAI_MODEL || "gpt-5-mini",
      name: "social_arb_nightly_report",
      schema,
      developerPrompt:
        "You are a social-market signal analyst. Use only the supplied free/public social data and heuristic report. " +
        "Return exactly three conversation topics. For each topic, return exactly three publicly traded equity tickers, likely direction of social pressure, confidence from 0 to 1, and a concise rationale. " +
        "Do not claim certainty, do not give trading advice, and do not invent source data.",
      input: {
        heuristic_report: report,
        evidence_items: items.slice(0, 180).map((item) => ({
          source: item.source,
          channel: item.channel,
          title: item.title.slice(0, 220),
          body: item.body.slice(0, 360),
          url: item.url,
          score: item.score,
          comments: item.comments,
          createdAt: item.createdAt,
        })),
      },
    });

    return {
      ...report,
      generatedAt: new Date().toISOString(),
      topics: result.topics.map((topic, index) => ({
        ...report.topics[index],
        topic: sanitizeText(topic.topic, 120) || report.topics[index]?.topic || "Market conversation",
        summary: sanitizeText(topic.summary, 700) || report.topics[index]?.summary || "",
        sentiment: clamp(Number(topic.sentiment || 0), -1, 1),
        affectedStocks: topic.affectedStocks.map((stock) => ({
          ticker: sanitizeTicker(stock.ticker),
          direction: ["up", "down", "mixed"].includes(stock.direction) ? stock.direction : "mixed",
          confidence: clamp(Number(stock.confidence || 0.5), 0, 1),
          mentions: Math.max(0, Number.parseInt(stock.mentions || 0, 10)),
          reason: sanitizeText(stock.reason, 220),
        })),
      })),
    };
  } catch (error) {
    return {
      ...report,
      openaiError: error instanceof Error ? error.message.slice(0, 300) : "OpenAI refinement failed",
    };
  }
}

async function persistReport(report, items, startedAt) {
  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
  if (!supabaseUrl || !serviceRoleKey) return null;

  const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/social_arb_reports`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      generated_at: report.generatedAt,
      started_at: startedAt.toISOString(),
      item_count: items.length,
      topics: report,
      source_counts: countBy(items, "source"),
      raw_item_sample: items.slice(0, 150),
      email_to: process.env.SOCIAL_ARB_EMAIL_TO || reportRecipient,
    }),
  });

  if (!response.ok) {
    throw new Error(`Supabase report insert failed: ${(await response.text()).slice(0, 300)}`);
  }

  const rows = await response.json();
  const persisted = rows?.[0] || null;
  if (persisted?.id && report.picks?.length) {
    await persistSignalLedger(supabaseUrl, serviceRoleKey, persisted.id, report).catch(() => null);
  }
  return persisted;
}

async function persistSignalLedger(supabaseUrl, serviceRoleKey, reportId, report) {
  const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/social_arb_signals?on_conflict=session_date,ticker`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(report.picks.map((pick) => ({
      report_id: reportId,
      session_date: report.session.dateKey,
      ticker: pick.ticker,
      rank: pick.rank,
      score: pick.score,
      confidence_band: pick.confidenceBand,
      entry_reference: pick.entryReference,
      outcome: "pending",
      thesis: pick,
    }))),
  });
  if (!response.ok) throw new Error(`Signal ledger insert failed: ${(await response.text()).slice(0, 200)}`);
}

async function sendReportEmail(report, reportId) {
  if (!process.env.RESEND_API_KEY) return null;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.SOCIAL_ARB_FROM_EMAIL || process.env.RESEND_FROM_EMAIL || "Good Business <onboarding@resend.dev>",
      to: process.env.SOCIAL_ARB_EMAIL_TO || reportRecipient,
      subject: report.picks.length
        ? `Social ARB Close: ${report.picks.map((pick) => `${pick.rank}. ${pick.ticker} (${pick.score})`).join(" | ")}`
        : "Social ARB Close: NO TRADE — no setup cleared the gates",
      html: renderEmailHtml(report, reportId),
      text: renderEmailText(report, reportId),
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Resend email failed: ${JSON.stringify(payload).slice(0, 300)}`);
  }

  return payload;
}

function renderEmailHtml(report, reportId) {
  const pickCards = report.picks.map((pick) => `
    <section style="border:1px solid #dbe3ee;border-radius:12px;padding:18px;margin:14px 0;background:#fff;">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:16px;">
        <h2 style="font-size:25px;margin:0;">#${pick.rank} ${escapeHtml(pick.ticker)}</h2>
        <div style="font-size:22px;font-weight:800;color:${pick.score >= 78 ? "#047857" : "#9a6700"};">${pick.score}/100</div>
      </div>
      <p style="margin:7px 0 12px;color:#4b5563;"><strong>${escapeHtml(pick.confidenceBand)} setup</strong> · reference price $${pick.entryReference} · evaluate at next regular-session open</p>
      <p style="line-height:1.55;margin:0 0 14px;">${escapeHtml(pick.thesis)}</p>
      <table style="width:100%;border-collapse:collapse;font-size:13px;background:#f8fafc;">
        <tr><td style="padding:8px;"><strong>Social</strong><br>${pick.social.mentions24h} mentions / ${pick.social.sourceCount} sources</td><td style="padding:8px;"><strong>Acceleration</strong><br>${pick.social.acceleration}x</td><td style="padding:8px;"><strong>Late move</strong><br>${pick.market.lateMomentumPct}%</td><td style="padding:8px;"><strong>Rel. volume</strong><br>${pick.market.relativeVolume}x</td></tr>
      </table>
      ${pick.riskFlags.length ? `<p style="font-size:12px;color:#9a3412;margin:12px 0 0;"><strong>Risk flags:</strong> ${escapeHtml(pick.riskFlags.join(", "))}</p>` : ""}
      <p style="font-size:12px;color:#6b7280;margin:9px 0 0;">${escapeHtml(pick.invalidation)}</p>
      <div style="margin-top:10px;">${pick.social.evidence.map((item) => `<div style="font-size:12px;margin:4px 0;"><a href="${escapeAttribute(item.url)}">${escapeHtml(item.title || item.url)}</a> <span style="color:#6b7280;">(${escapeHtml(item.source)})</span></div>`).join("")}</div>
    </section>`).join("");

  const watchlist = report.watchlist.map((row) => `<tr><td style="padding:7px;border-bottom:1px solid #eef2f7;font-weight:700;">${escapeHtml(row.ticker)}</td><td style="padding:7px;border-bottom:1px solid #eef2f7;">${row.score}</td><td style="padding:7px;border-bottom:1px solid #eef2f7;">${escapeHtml(row.riskFlags.join(", ") || "did not clear every hard gate")}</td></tr>`).join("");

  return `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:760px;margin:0 auto;color:#111827;">
      <div style="background:#0f172a;color:#fff;border-radius:14px;padding:22px;">
        <div style="font-size:12px;letter-spacing:.08em;color:#93c5fd;font-weight:700;">CLOSE → NEXT OPEN SIGNAL</div>
        <h1 style="font-size:28px;line-height:1.2;margin:7px 0;">Social ARB Closing Bell Report</h1>
        <p style="margin:0;color:#cbd5e1;">Generated ${escapeHtml(new Date(report.generatedAt).toLocaleString("en-US", { timeZone: "America/Chicago" }))} · Market regime: ${escapeHtml(report.marketRegime.label)} · ${report.marketRegime.positiveBreadthPct}% positive breadth</p>
      </div>
      <div style="margin:16px 0;padding:14px;border-left:4px solid ${report.picks.length ? "#059669" : "#dc2626"};background:${report.picks.length ? "#ecfdf5" : "#fef2f2"};font-size:17px;font-weight:700;">${report.picks.length ? `${report.picks.length} setup${report.picks.length === 1 ? "" : "s"} cleared every buy gate` : "NO TRADE: no stock cleared every evidence and risk gate"}</div>
      ${pickCards}
      <h3 style="margin-top:25px;">Near misses / watchlist</h3><table style="width:100%;border-collapse:collapse;font-size:13px;"><tr><th align="left" style="padding:7px;">Ticker</th><th align="left" style="padding:7px;">Score</th><th align="left" style="padding:7px;">Why excluded</th></tr>${watchlist}</table>
      <p style="color:#6b7280;font-size:12px;margin-top:20px;line-height:1.5;">Experimental signal research, not personalized financial advice. Scores rank evidence quality; they are not probabilities or guarantees. Prices may move materially after this email. The system can abstain when evidence is weak.${reportId ? ` Report ID: ${escapeHtml(reportId)}` : ""}</p>
    </div>`;
}

function renderEmailText(report, reportId) {
  return [
    "Social ARB Closing Bell Report",
    `Generated ${new Date(report.generatedAt).toLocaleString("en-US", { timeZone: "America/Chicago" })}`,
    "",
    `Market regime: ${report.marketRegime.label}; ${report.marketRegime.positiveBreadthPct}% positive breadth`,
    report.picks.length ? `${report.picks.length} setup(s) cleared every gate` : "NO TRADE: no setup cleared every gate",
    "",
    ...report.picks.flatMap((pick) => [`#${pick.rank} ${pick.ticker} — ${pick.score}/100 (${pick.confidenceBand})`, pick.thesis, `Reference price: $${pick.entryReference}; evaluate at next regular-session open`, `Risks: ${pick.riskFlags.join(", ") || "none triggered"}`, ""]),
    "Experimental signal research, not personalized financial advice. Scores are not probabilities or guarantees.",
    reportId ? `Report ID: ${reportId}` : "",
  ].join("\n");
}

async function requestOpenAIJson({ model, name, schema, developerPrompt, input }) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      reasoning: { effort: "low" },
      text: { format: { type: "json_schema", name, strict: true, schema } },
      input: [
        { role: "developer", content: developerPrompt },
        { role: "user", content: JSON.stringify(input) },
      ],
    }),
  });

  if (!response.ok) throw new Error((await response.text()).slice(0, 400));
  const payload = await response.json();
  const text =
    payload.output_text ||
    payload.output?.flatMap((item) => item.content || [])?.find((item) => item.type === "output_text")?.text;
  if (!text) throw new Error("OpenAI response did not include output text.");
  return JSON.parse(text);
}

function parseRss(xml, feed) {
  const blocks = xml.match(/<(item|entry)\b[\s\S]*?<\/\1>/gi) || [];
  return blocks.map((block) => {
    const explicitTitle = stripHtml(xmlValue(block, "title"));
    const link = xmlValue(block, "link") || xmlLinkHref(block) || feed.url;
    const body = stripHtml(xmlValue(block, "description") || xmlValue(block, "summary") || xmlValue(block, "content:encoded"));
    const title = explicitTitle || body.slice(0, 160);
    const id = xmlValue(block, "guid") || xmlValue(block, "id") || stableId(feed.source, link, title);
    const published = xmlValue(block, "pubDate") || xmlValue(block, "published") || xmlValue(block, "updated");
    return {
      source: feed.source,
      channel: feed.channel,
      externalId: id,
      title,
      body,
      url: stripHtml(link),
      author: stripHtml(xmlValue(block, "author") || xmlValue(block, "dc:creator")),
      score: 0,
      comments: 0,
      createdAt: parseDate(published),
      raw: { feedUrl: feed.url },
    };
  });
}

function xmlValue(block, tag) {
  const escaped = escapeRegExp(tag);
  const match = block.match(new RegExp(`<${escaped}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escaped}>`, "i"));
  return decodeEntities(match?.[1] || "").trim();
}

function xmlLinkHref(block) {
  const match = block.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*>/i);
  return decodeEntities(match?.[1] || "").trim();
}

function tokenize(text) {
  return [...text.matchAll(/[A-Za-z][A-Za-z0-9+\-.]{2,}/g)]
    .map((match) => match[0].toLowerCase())
    .filter((word) => !stopwords.has(word));
}

function extractTickers(text) {
  const tickers = [...text.toUpperCase().matchAll(/(?<![A-Z0-9])\$([A-Z]{1,5})(?:\.X)?(?![A-Z0-9])/g)].map((match) => match[1]);
  const lowerText = text.toLowerCase();
  for (const [alias, ticker] of tickerAliases.entries()) {
    if (new RegExp(`\\b${escapeRegExp(alias)}\\b`, "i").test(lowerText)) tickers.push(ticker);
  }
  return tickers.filter((ticker) => ticker.length <= 5 && !nonEquityTickers.has(ticker));
}

function chooseTheme(tokens, tickers) {
  const tokenSet = new Set(tokens);
  const scores = new Map(Object.keys(themes).map((theme) => [theme, themes[theme].filter((word) => tokenSet.has(word)).length]));
  const tickerSet = new Set(tickers);
  for (const [sector, symbols] of Object.entries(sectorTickers)) {
    const overlap = symbols.filter((symbol) => tickerSet.has(symbol)).length;
    if (!overlap) continue;
    const theme = sectorTheme(sector);
    scores.set(theme, (scores.get(theme) || 0) + overlap * 2);
  }
  const [bestTheme, bestScore] = [...scores.entries()].sort((a, b) => b[1] - a[1])[0];
  return bestScore > 0 ? bestTheme : "General market chatter";
}

function itemSentiment(item, tokens) {
  if (item.raw?.sentiment === "Bullish") return 0.6;
  if (item.raw?.sentiment === "Bearish") return -0.6;
  const positive = tokens.filter((token) => positiveWords.has(token)).length;
  const negative = tokens.filter((token) => negativeWords.has(token)).length;
  return clamp((positive - negative) / Math.sqrt(Math.max(tokens.length, 1)), -1, 1);
}

function itemScore(item) {
  const ageHours = Math.max(0, (Date.now() - new Date(item.createdAt).getTime()) / 3_600_000);
  const recency = 1 / (1 + ageHours / 12);
  const engagement = 1 + Math.log1p(Math.max(0, item.score || 0)) + Math.log1p(Math.max(0, item.comments || 0));
  return (sourceWeights[item.source] || 1) * recency * engagement;
}

function inferredTickers(topic) {
  const lookup = {
    "AI infrastructure": "ai",
    Semiconductors: "semiconductor",
    "Electric vehicles": "ev",
    "Crypto risk appetite": "crypto",
    "Consumer platforms": "streaming",
    Cybersecurity: "cybersecurity",
    "Macro rates": "banking",
  };
  return sectorTickers[lookup[topic]] || [];
}

function sectorTheme(sector) {
  if (sector === "ai") return "AI infrastructure";
  if (sector === "ev") return "Electric vehicles";
  if (sector === "crypto") return "Crypto risk appetite";
  return sector.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function directionReason(direction, mentions) {
  const mentionText = mentions ? `${mentions} direct mentions` : "sector/theme exposure";
  if (direction === "up") return `positive conversation skew with ${mentionText}`;
  if (direction === "down") return `negative conversation skew with ${mentionText}`;
  return `balanced or conflicting conversation with ${mentionText}`;
}

async function fetchJson(url) {
  return JSON.parse(await fetchText(url));
}

async function mapLimit(values, concurrency, mapper) {
  const results = new Array(values.length);
  let index = 0;

  async function worker() {
    while (index < values.length) {
      const currentIndex = index;
      index += 1;
      results[currentIndex] = await mapper(values[currentIndex], currentIndex);
    }
  }

  const workerCount = Math.min(Math.max(1, concurrency), values.length);
  await Promise.all(Array.from({ length: workerCount }, worker));
  return results;
}

async function fetchText(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": socialUserAgent,
        Accept: "application/json, application/rss+xml, application/xml, text/xml, */*",
      },
    });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

function parseDate(value) {
  const time = Date.parse(value || "");
  return Number.isFinite(time) ? new Date(time).toISOString() : new Date().toISOString();
}

function stripHtml(value) {
  return decodeEntities(String(value || "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

function decodeEntities(value) {
  return String(value || "")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stableId(...parts) {
  let hash = 0;
  for (const char of parts.join("|")) {
    hash = (hash << 5) - hash + char.charCodeAt(0);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

function uniqueTickers(tickers) {
  return [...new Set(tickers)];
}

function uniqueItem(item, seen) {
  const key = `${item.source}:${item.externalId || item.url || item.title}`;
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
}

function countBy(items, key) {
  return items.reduce((counts, item) => {
    counts[item[key]] = (counts[item[key]] || 0) + 1;
    return counts;
  }, {});
}

function tone(sentiment) {
  if (sentiment > 0.08) return "positive";
  if (sentiment < -0.08) return "negative";
  return "mixed";
}

function round(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function clamp(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

function sanitizeText(value, maxLength) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function sanitizeTicker(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z.]/g, "")
    .slice(0, 6);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#96;");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
