import { readBody, defineEventHandler, getQuery } from "h3";
import { GoogleGenAI } from "@google/genai";

type PromptMessage = {
  type: "system" | "user" | "assistant";
  content: string | undefined;
};

export default defineEventHandler(async (event) => {
  const q = getQuery(event) as Record<string, string | undefined>;
  const type = (q.type || "default").toLowerCase();

  const body = (await readBody(event)) as any;

  const messagesFromClient: PromptMessage[] | undefined = Array.isArray(
    body?.messages
  )
    ? body.messages
    : undefined;

  const prompt = typeof body?.prompt === "string" ? body.prompt : "";

  const config = useRuntimeConfig();
  const GEMINI_KEY = config.geminiApiKey;
  const MODEL = config.geminiModel;

  if (!GEMINI_KEY) {
    return {
      success: false,
      error: "Server misconfigured: missing geminiApiKey",
    };
  }

  // ! Define prompt systems depending on type
  const templates: Record<string, string> = {
    summary: `You are an expert educational copywriter. Create a short summary (2–3 sentences).`,
    block: `You are an expert educational content generator. Return ONLY a VALID JSON ARRAY (no markdown, no backticks, no explanation) containing ONE or MORE lesson content block objects. The assistant must output a single JSON array as the entire response.

Each block object must follow this schema:
{
  "type": "text|image|video|multiple_choice|essay",
  "title": "string",
  "content": "string (for text blocks only)",
  "url": "string (for image or video blocks, optional)",
  "alt": "string (for image alt text, optional)",
  "options": [{"value":"string","is_correct":boolean}, ...] (for multiple_choice only),
  "placeholder": "string (for essay only)",
  "max_length": number (for essay only),
  "explanation": "string (optional, e.g., MCQ explanation)"
}

Rules (must be followed):
1. Return a JSON array: e.g. [ {block1}, {block2}, ... ] — nothing else.
2. For multiple_choice blocks, include **exactly 5** options unless user prompt requests otherwise. Mark one or more option(s) with is_correct: true.
3. If user asks for multiple essays, return each essay as its own block object (e.g., two essay blocks).
4. Keep text lengths concise but informative. Use Indonesian when user prompt is Indonesian.
5. Do not include extraneous fields. If a field is not applicable, omit it.
6. If the user prompt requests a topic + short explanation + quiz + essays, generate those blocks in the same array in a logical order (e.g., text -> multiple_choice -> essay -> essay).
7. Keep generation deterministic where possible: avoid adding commentary or metadata.

Example expected output format (exact JSON array; this is an instructive example — return similar structure not the literal text):
[
  {
    "type":"text",
    "title":"Space: A Glimpse into the Universe",
    "content":"Space is the space beyond the atmosphere... (short summary)"
  },
  {
    "type":"multiple_choice",
    "title":"What is meant by space??",
    "options":[
      {"value":"Space outside Earth's atmosphere","is_correct":true},
      {"value":"Planetary core","is_correct":false},
      {"value":"Layers of air in the atmosphere","is_correct":false},
      {"value":"Man-made satellite","is_correct":false},
      {"value":"Ozone layer","is_correct":false}
    ],
    "explanation":"The correct answer is because space is space outside the Earth's atmosphere.."
  },
  {
    "type":"essay",
    "title":"Explain the importance of space exploration",
    "placeholder":"Write your answer here...",
    "max_length":500
  },
  {
    "type":"essay",
    "title":"How space technology affects everyday life?",
    "placeholder":"Write your answer here...",
    "max_length":400
  }
]

Return ONLY the JSON array and nothing else.`,
    rewrite: `You are a helpful editor. Rewrite the given Indonesian text to be clearer and concise.`,
    mcq: `You are a quiz maker. Based on the topic, create a 4-option MCQ with answer + explanation.`,
    essay: `You are an assessment writer. Create an essay prompt with word limit + rubric.`,
    default: `You are a helpful assistant.`,
  };

  let messages: PromptMessage[] = [];

  if (messagesFromClient?.length) {
    messages = messagesFromClient.map((m) => ({
      type: ["system", "assistant"].includes(m.type) ? m.type : "user",
      content: String(m.content || ""),
    }));
  } else {
    const systemTemplate = templates[type] ?? templates.default;

    messages.push({ type: "system", content: systemTemplate });

    if (!prompt) {
      return { success: false, error: "Missing prompt or messages" };
    }

    messages.push({ type: "user", content: prompt });
  }

  const tryFixJSON = (text: string) => {
    let fixed = text.trim();
    if (!fixed.endsWith("]")) fixed += "]";
    fixed = fixed.replace(/,(\s*])/, "$1");
    return fixed;
  }

  const contents = messages.map((m) => ({
    role: m.type === "system" ? "user" : m.type,
    parts: [{ text: m.content }],
  }));

  try {
    const ai = new GoogleGenAI({ vertexai: false, apiKey: GEMINI_KEY });

    const maxOutputTokens = type === "block" || type === "module" ? 3048 : 512;

    const resp = await ai.models.generateContent({
      model: MODEL,
      contents,
      config: {
        temperature: 0.1,
        maxOutputTokens,
      }
    });

    //* The SDK response exposes a .text accessor for the generated text
    let outRaw: string = (resp as any)?.text ?? JSON.stringify(resp);

    //* strip code fences if present
    outRaw = outRaw
      .replace(/^```json/i, "")
      .replace(/^```/, "")
      .replace(/```$/, "")
      .trim();

    let parsedJSON = null;
    if (type === "block") {
      try {
        parsedJSON = JSON.parse(outRaw);
      } catch {
        try {
          parsedJSON = JSON.parse(tryFixJSON(outRaw));
        } catch {
          // TODO: ignore parse errors, we'll return raw string
        }
      }
    }

    return {
      success: true,
      type,
      input_messages_count: contents.length,
      output: parsedJSON ?? outRaw,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || String(err),
      type,
      input_messages_count: contents.length,
    };
  }
});
