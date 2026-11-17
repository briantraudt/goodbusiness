// Good Business HQ: every scheduled agent on one private page.
const $ = id => document.getElementById(id);
const HOUR = 3600e3;
const DAY = 24 * HOUR;

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = text;
  return node;
}

const safeUrl = url => (typeof url === "string" && /^https:\/\//i.test(url) ? url : null);
const time = value => (value ? new Date(value).getTime() : null);
const clock = ms => new Date(ms).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

function ago(ms, now) {
  const diff = Math.max(0, now - ms);
  if (diff < 60e3) return "just now";
  if (diff < HOUR) return `${Math.round(diff / 60e3)}m ago`;
  if (diff < DAY) return `${Math.round(diff / HOUR)}h ago`;
  return `${Math.round(diff / DAY)}d ago`;
}

function until(ms, now) {
  const diff = ms - now;
  if (diff <= 0) return "due";
  if (diff < HOUR) return `in ${Math.max(1, Math.round(diff / 60e3))}m`;
  if (diff < DAY) return `in ${Math.round(diff / HOUR)}h`;
  return new Date(ms).toLocaleDateString([], { weekday: "short" }) + " " + clock(ms);
}

function duration(start, end) {
  const mins = Math.max(1, Math.round((end - start) / 60e3));
  return mins < 60 ? `${mins} min` : `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

// One word for where an agent stands right now.
function stateOf(agent, synced) {
  if (!agent.enabled) return { key: "off", label: "Paused" };
  if (agent.last_status === "failed") return { key: "bad", label: "Failed" };
  if (agent.last_status === "running") return { key: "run", label: "Running" };
  const next = time(agent.next_run_at);
  if (next && synced && next < synced - HOUR) return { key: "warn", label: "Late" };
  if (!agent.last_fired_at) return { key: "off", label: "Not run yet" };
  return { key: "ok", label: "Finished" };
}

function renderStats(data, now, synced) {
  const agents = data.agents || [];
  const runs24 = (data.runs || []).filter(run => time(run.fired_at) > now - DAY);
  const failed24 = runs24.filter(run => run.status === "failed").length;
  const active = agents.filter(agent => agent.enabled).length;
  const trouble = agents.filter(agent => ["bad", "warn"].includes(stateOf(agent, synced).key)).length;
  const needs = (data.items || []).length;
  const done = runs24.filter(run => run.status === "succeeded").length;

  const tiles = [
    { label: "Agents", value: active, note: agents.length > active ? `${agents.length - active} paused` : "all scheduled" },
    { label: "Runs, last 24 hours", value: runs24.length, note: `${done} finished on their own` },
    { label: "Failed or late", value: trouble, note: failed24 ? `${failed24} failed run${failed24 === 1 ? "" : "s"} in 24 hours` : "nothing failed in 24 hours", tone: trouble ? "bad" : "good" },
    { label: "From you", value: needs, note: needs ? "waiting on you" : "nothing waiting", tone: needs ? "warn" : "" },
  ];
  const root = $("stats");
  root.replaceChildren(...tiles.map(tile => {
    const node = el("div", `stat ${tile.tone || ""}`.trim());
    node.append(el("div", "label", tile.label), el("div", "value", String(tile.value)), el("div", "note", tile.note));
    return node;
  }));
}

function renderTimeline(data, now, synced) {
  const start = now - DAY;
  const agents = data.agents || [];
  const runsByAgent = new Map();
  for (const run of data.runs || []) {
    if (!runsByAgent.has(run.trigger_id)) runsByAgent.set(run.trigger_id, []);
    runsByAgent.get(run.trigger_id).push(run);
  }
  const root = $("timeline");
  root.replaceChildren();
  if (!agents.length) {
    root.append(el("p", "empty", "No agents recorded yet. The first sync has not finished."));
    return;
  }

  let product = null;
  for (const agent of agents) {
    if (agent.product !== product) {
      product = agent.product;
      root.append(el("div", "group", product));
    }
    const state = stateOf(agent, synced);
    const row = el("div", "row");

    const who = el("div");
    const name = el("div", "name");
    name.append(el("i", `dot ${state.key}`), el("span", "", agent.name));
    who.append(name);
    if (agent.schedule) who.append(el("div", "role", agent.schedule));

    const track = el("div", "track");
    track.setAttribute("role", "img");
    const recent = (runsByAgent.get(agent.trigger_id) || []).filter(run => (time(run.finished_at) || time(run.fired_at)) > start);
    track.setAttribute("aria-label", `${recent.length} run${recent.length === 1 ? "" : "s"} in the last 24 hours`);
    for (const run of recent) {
      const from = Math.max(start, time(run.fired_at));
      const to = Math.min(now, time(run.finished_at) || (run.status === "running" ? now : from));
      const bar = el("span", `bar ${run.status === "failed" ? "bad" : run.status === "running" ? "run" : run.status === "unknown" ? "unknown" : ""}`.trim());
      bar.style.left = `${((from - start) / DAY) * 100}%`;
      bar.style.width = `${(Math.max(0, to - from) / DAY) * 100}%`;
      bar.title = `${clock(time(run.fired_at))}, ${run.status}${run.finished_at ? `, ${duration(time(run.fired_at), time(run.finished_at))}` : ""}`;
      track.append(bar);
    }

    const status = el("div", `state ${state.key}`);
    status.append(el("b", "", state.label));
    const last = time(agent.last_fired_at);
    const next = time(agent.next_run_at);
    const when = [];
    if (last) when.push(ago(last, now));
    if (agent.enabled && next) when.push(`next ${until(next, now)}`);
    status.append(el("div", "when", when.join(" · ")));

    row.append(who, track, status);
    if (agent.summary) row.append(el("div", "did", agent.summary));
    root.append(row);
  }

  const axis = el("div", "axis");
  const ticks = el("div", "ticks");
  for (let h = 0; h <= 24; h += 4) {
    const tick = el("span", "", h === 24 ? "now" : clock(start + h * HOUR));
    tick.style.left = `${(h / 24) * 100}%`;
    ticks.append(tick);
  }
  axis.append(el("div"), ticks, el("div"));
  root.append(axis);
}

function renderItems(data) {
  const root = $("needs");
  const items = data.items || [];
  root.replaceChildren();
  if (!items.length) return root.append(el("p", "empty", "Nothing needed from you."));
  for (const item of items) {
    const node = el("div", "item");
    node.append(el("div", "meta", item.product), el("div", "title", item.title));
    if (item.detail) node.append(el("div", "detail", item.detail));
    const url = safeUrl(item.url);
    if (url) {
      const link = el("a", "", "Open");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      node.append(link);
    }
    root.append(node);
  }
}

function renderTrouble(data, now, synced) {
  const root = $("trouble");
  root.replaceChildren();
  const rows = (data.agents || []).map(agent => ({ agent, state: stateOf(agent, synced) })).filter(row => ["bad", "warn"].includes(row.state.key));
  if (!rows.length) return root.append(el("p", "empty", "Every agent ran when it should have."));
  for (const { agent, state } of rows) {
    const node = el("div", "item");
    node.append(el("div", "meta", agent.product), el("div", "title", agent.name));
    const last = time(agent.last_fired_at);
    const detail = state.key === "bad"
      ? `Last run failed${last ? `, ${ago(last, now)}` : ""}.`
      : `Was due ${agent.next_run_at ? ago(time(agent.next_run_at), now) : "earlier"} and has not run.`;
    node.append(el("div", "detail", detail));
    root.append(node);
  }
}

function renderProducts(data, synced) {
  const root = $("products");
  root.replaceChildren();
  const products = new Map((data.products || []).map(product => [product.product, product]));
  const names = [...new Set([...(data.agents || []).map(agent => agent.product), ...products.keys()])];
  if (!names.length) return root.append(el("p", "empty", "No products recorded yet."));
  for (const name of names) {
    const info = products.get(name) || {};
    const mine = (data.agents || []).filter(agent => agent.product === name);
    const bad = mine.filter(agent => ["bad", "warn"].includes(stateOf(agent, synced).key)).length;
    const card = el("div", "product");
    const head = el("h3");
    const site = safeUrl(info.site_url);
    if (site) {
      const link = el("a", "", name);
      link.href = site;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      head.append(link);
    } else head.append(el("span", "", name));
    card.append(head);

    const chips = el("div", "chips");
    chips.append(el("span", "chip", `${mine.length} agent${mine.length === 1 ? "" : "s"}`));
    if (bad) chips.append(el("span", "chip bad", `${bad} failed or late`));
    if (Number.isInteger(info.merged_24h)) chips.append(el("span", "chip", `${info.merged_24h} merged today`));
    if (Number.isInteger(info.open_prs)) chips.append(el("span", "chip", `${info.open_prs} open`));
    if (info.deploy_state) chips.append(el("span", `chip ${/error|fail/i.test(info.deploy_state) ? "bad" : ""}`.trim(), `site ${info.deploy_state.toLowerCase()}`));
    card.append(chips);

    for (const [label, text] of [["Shipped", info.shipped], ["In review", info.in_review]]) {
      if (!text) continue;
      const line = el("p");
      line.append(el("b", "", `${label}: `), document.createTextNode(text));
      card.append(line);
    }
    root.append(card);
  }
}

function render(data) {
  const now = Date.now();
  const synced = time(data.synced_at);
  const agents = data.agents || [];
  const products = new Set(agents.map(agent => agent.product)).size;
  $("subtitle").textContent = agents.length
    ? `${agents.length} agents across ${products} product${products === 1 ? "" : "s"}. Updated ${synced ? ago(synced, now) : "never"}.`
    : "Waiting for the first sync.";
  const from = now - DAY;
  $("timeline-sub").textContent = `${new Date(from).toLocaleDateString([], { weekday: "short" })} ${clock(from)} to now. Each bar is one run.`;
  renderStats(data, now, synced);
  renderTimeline(data, now, synced);
  renderItems(data);
  renderTrouble(data, now, synced);
  renderProducts(data, synced);
  $("footnote").textContent = synced
    ? `Data is collected by the HQ sync agent. Last sync ${new Date(synced).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}.${synced < now - 5 * HOUR ? " The sync is behind." : ""}`
    : "";
}

function show(view) {
  $("gate").hidden = view !== "gate";
  $("app").hidden = view !== "app";
}

async function load() {
  const response = await fetch("/api/hq", { credentials: "same-origin", headers: { Accept: "application/json" } });
  if (response.status === 401) {
    show("gate");
    $("password").focus();
    return;
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    show("gate");
    $("gate-error").textContent = data.error || "The dashboard could not load.";
    return;
  }
  render(data);
  show("app");
}

$("gate-form").addEventListener("submit", async event => {
  event.preventDefault();
  const button = $("gate-submit");
  const error = $("gate-error");
  error.textContent = "";
  button.disabled = true;
  try {
    const response = await fetch("/api/hq", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login", password: $("password").value }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      error.textContent = data.error || "Could not sign in.";
      return;
    }
    $("password").value = "";
    await load();
  } catch {
    error.textContent = "Could not reach the server. Try again.";
  } finally {
    button.disabled = false;
  }
});

$("signout").addEventListener("click", async () => {
  await fetch("/api/hq", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "logout" }) }).catch(() => null);
  show("gate");
});

$("refresh").addEventListener("click", () => load());
setInterval(() => { if (!$("app").hidden) load(); }, 5 * 60e3);

load().catch(() => {
  show("gate");
  $("gate-error").textContent = "Could not reach the server. Try again.";
});
