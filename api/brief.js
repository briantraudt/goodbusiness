const maxBodySize = 24 * 1024;
const briefResponseTimeoutMs = 2200;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const body = await readBody(req);
    const projectIdea = sanitizeText(body.projectIdea, 900);
    const brief = await getBuildBrief(projectIdea);

    return res.status(200).json(brief);
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Something went wrong.",
    });
  }
}

async function readBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > maxBodySize) {
        reject(new Error("That request is too large for this brief builder."));
        req.destroy();
      }
    });

    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("The request body was not valid JSON."));
      }
    });

    req.on("error", reject);
  });
}

async function getBuildBrief(projectIdea) {
  if (!projectIdea || !process.env.OPENAI_API_KEY) {
    return createFallbackBrief(projectIdea);
  }

  try {
    return await promiseWithTimeout(generateBuildBriefWithOpenAI(projectIdea), briefResponseTimeoutMs);
  } catch {
    return createFallbackBrief(projectIdea);
  }
}

async function generateBuildBriefWithOpenAI(projectIdea) {
  const schema = {
    type: "object",
    additionalProperties: false,
    properties: {
      headline: { type: "string" },
      bullets: {
        type: "array",
        minItems: 4,
        maxItems: 4,
        items: { type: "string" },
      },
      metric: { type: "string" },
    },
    required: ["headline", "bullets", "metric"],
  };

  const result = await requestOpenAIJson({
    model: process.env.OPENAI_BRIEF_MODEL || process.env.OPENAI_MODEL || "gpt-5-mini",
    name: "good_business_build_brief",
    schema,
    developerPrompt:
      "You are Good Business, a practical software design and development partner for smaller businesses. " +
      "Turn a messy operational problem into a concise custom software direction: internal tools, dashboards, workflow automation, portals, or AI-powered workflows when useful. " +
      "Be direct, business-focused, practical, and plain-spoken. Do not overpromise, do not sound like an AI consultant, and do not use vague transformation language. " +
      "Mention the workflow, systems involved, people affected, smallest useful first version, and measurable business outcome where relevant.",
    input: {
      project_idea: projectIdea,
    },
  });

  return normalizeBrief(result);
}

function createFallbackBrief(projectIdea) {
  const idea = truncateText(projectIdea || "the people you want to bring together", 118);
  return {
    headline: "Build software around the way the business actually works.",
    bullets: [
      `Start with the operating problem: ${idea}`,
      "Identify the systems, spreadsheets, handoffs, and decisions involved today.",
      "Design the smallest useful tool that reduces manual work or improves visibility.",
      "Ship in focused phases, then improve the software as the team uses it.",
    ],
    metric: "Business signal: less manual work, clearer reporting, faster decisions, or fewer missed handoffs.",
  };
}

function normalizeBrief(result) {
  const bullets = Array.isArray(result.bullets)
    ? result.bullets.map((entry) => sanitizeText(entry, 180)).filter(Boolean).slice(0, 4)
    : [];

  while (bullets.length < 4) {
    bullets.push("Keep the first release narrow enough to test with real users quickly.");
  }

  return {
    headline: sanitizeText(result.headline, 110) || "A practical custom software direction",
    bullets,
    metric: sanitizeText(result.metric, 180) || "Business signal: less manual work or clearer visibility.",
  };
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
      text: {
        format: {
          type: "json_schema",
          name,
          strict: true,
          schema,
        },
      },
      input: [
        {
          role: "developer",
          content: developerPrompt,
        },
        {
          role: "user",
          content: JSON.stringify(input),
        },
      ],
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(details.slice(0, 400));
  }

  const payload = await response.json();
  const text =
    payload.output_text ||
    payload.output
      ?.flatMap((item) => item.content || [])
      ?.find((item) => item.type === "output_text")
      ?.text;

  if (!text) {
    throw new Error("The AI response did not include any text output.");
  }

  return JSON.parse(text);
}

function promiseWithTimeout(promise, timeoutMs) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Timed out waiting for AI brief.")), timeoutMs);
    }),
  ]);
}

function sanitizeText(value, maxLength) {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function truncateText(value, maxLength) {
  const text = sanitizeText(value, maxLength + 1);
  if (text.length <= maxLength) {
    return text;
  }

  const trimmed = text.slice(0, maxLength);
  const lastSpace = trimmed.lastIndexOf(" ");
  return `${trimmed.slice(0, lastSpace > 60 ? lastSpace : maxLength).trim()}...`;
}
