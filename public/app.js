const form = document.querySelector("#brief-form");
const ideaInput = document.querySelector("#project-idea");
const output = document.querySelector("#brief-output");
const button = document.querySelector("#brief-button");
const modePill = document.querySelector("#mode-pill");

boot();

function boot() {
  checkHealth();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    void generateBrief();
  });
}

async function checkHealth() {
  try {
    const response = await fetch("/api/health");
    const data = await response.json();
    modePill.textContent = data.aiConfigured ? "Live studio" : "Local studio";
  } catch {
    modePill.textContent = "Local studio";
  }
}

async function generateBrief() {
  const projectIdea = ideaInput.value.trim();

  if (!projectIdea) {
    renderBrief({
      headline: "Start with the people, not the platform.",
      bullets: [
        "Name who should find, remember, coordinate with, or care for each other.",
        "Describe the real-world connection the technology should unlock.",
      ],
      metric: "Connection signal: someone shows up in real life.",
    });
    return;
  }

  button.disabled = true;
  button.textContent = "Shaping...";
  output.innerHTML = `
    <strong>Finding the connective layer...</strong>
    <span>Looking for the people, the signal, the system, and the smallest useful next step.</span>
  `;

  try {
    const response = await fetch("/api/brief", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectIdea }),
    });
    const brief = await response.json();

    if (!response.ok) {
      throw new Error(brief.error || "Could not shape the connection.");
    }

    renderBrief(brief);
  } catch (error) {
    renderBrief(createFallbackBrief(projectIdea, error));
  } finally {
    button.disabled = false;
    button.textContent = "Shape the system";
  }
}

function renderBrief(brief) {
  const bullets = Array.isArray(brief.bullets) ? brief.bullets.slice(0, 4) : [];
  output.innerHTML = `
    <strong>${escapeHtml(brief.headline || "A human-centered technology direction")}</strong>
    <ul>
      ${bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ul>
    <span>${escapeHtml(brief.metric || "Connection signal: someone shows up in real life.")}</span>
  `;
}

function createFallbackBrief(projectIdea, error) {
  const plainIdea = truncateText(projectIdea, 118);
  return {
    headline: "Build the smallest technology that helps people show up.",
    bullets: [
      `Center the technology on this human moment: ${plainIdea}`,
      "Make the first version about one connection behavior: discover, coordinate, remember, invite, care, or follow through.",
      "Define what trust requires before anyone shares too much.",
      "Keep the system small enough that people actually use it this week.",
    ],
    metric:
      error instanceof Error
        ? "Fallback direction shown locally. Live studio output unlocks when the API is configured."
        : "Connection signal: someone gets outside, accepts help, offers care, or comes back tomorrow.",
  };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function truncateText(value, maxLength) {
  const text = String(value).replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) {
    return text;
  }

  const trimmed = text.slice(0, maxLength);
  const lastSpace = trimmed.lastIndexOf(" ");
  return `${trimmed.slice(0, lastSpace > 60 ? lastSpace : maxLength).trim()}...`;
}
