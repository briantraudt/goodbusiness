import OpenAI from "openai";

let openai: OpenAI | null = null;

function getOpenAI() {
  if (openai) return openai;
  if (!process.env.OPENAI_API_KEY) return null;
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return openai;
}

export async function generateJson<T>(prompt: string, fallback: T): Promise<T> {
  const client = getOpenAI();
  if (!client) return fallback;

  let response;
  try {
    response = await client.chat.completions.create({
      model: process.env.GOODBOT_OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "Return valid JSON only. Do not include markdown."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });
  } catch (error) {
    console.error("GoodBot OpenAI generation failed; using deterministic fallback.", error);
    return fallback;
  }

  const content = response.choices[0]?.message?.content;
  if (!content) {
    console.error("GoodBot OpenAI returned no content; using deterministic fallback.");
    return fallback;
  }

  try {
    return JSON.parse(content) as T;
  } catch (error) {
    console.error("GoodBot OpenAI returned invalid JSON; using deterministic fallback.", error);
    return fallback;
  }
}
