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
    modePill.textContent = data.aiConfigured ? "AI ready" : "Preview mode";
  } catch {
    modePill.textContent = "Preview mode";
  }
}

async function generateBrief() {
  const projectIdea = ideaInput.value.trim();

  if (!projectIdea) {
    renderBrief({
      headline: "Start with humanity, then build the technology.",
      bullets: [
        "Name the people who should find, remember, coordinate with, or care for each other.",
        "Describe the real-world moment the technology should make easier, warmer, or more possible.",
      ],
      metric: "Humanity signal: someone connects, helps, gathers, or shows up in real life.",
    });
    return;
  }

  button.disabled = true;
  button.textContent = "Shaping...";
  output.innerHTML = `
    <strong>Finding the human layer...</strong>
    <span>Looking for the people, the technology, the trust, and the smallest beautiful first version.</span>
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
    button.textContent = "Shape the technology";
  }
}

function renderBrief(brief) {
  const bullets = Array.isArray(brief.bullets) ? brief.bullets.slice(0, 4) : [];
  output.innerHTML = `
    <strong>${escapeHtml(brief.headline || "A technology direction for human connection")}</strong>
    <ul>
      ${bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ul>
    <span>${escapeHtml(brief.metric || "Humanity signal: someone shows up in real life.")}</span>
  `;
}

function createFallbackBrief(projectIdea, error) {
  const plainIdea = truncateText(projectIdea, 118);
  return {
    headline: "Build remarkable technology around a deeply human moment.",
    bullets: [
      `Center the product on this human moment: ${plainIdea}`,
      "Make the first version excellent at one behavior: discover, coordinate, remember, invite, care, or follow through.",
      "Design the trust layer clearly: consent, privacy, timing, tone, and the right amount of memory.",
      "Keep the technology focused enough that people can use it in real life this week.",
    ],
    metric:
      error instanceof Error
        ? "Preview direction shown locally. AI-shaped output unlocks when the API is configured."
        : "Humanity signal: someone gets outside, accepts help, offers care, or comes back tomorrow.",
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
