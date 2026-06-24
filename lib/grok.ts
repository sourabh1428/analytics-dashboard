import { validateSeoContent, type ValidationResult } from "@/scripts/validate-content";
import type { SeoContent } from "@/lib/content";

type GroqResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

// Groq uses the OpenAI-compatible chat completions endpoint
const GROQ_API_URL = process.env.GROQ_API_URL ?? "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";
const MAX_ATTEMPTS = 3;
const RETRY_BASE_DELAY_MS = 1_000;
// llama-3.3-70b-versatile supports up to 32k output tokens; 4096 is enough for 1000+ word articles
const MAX_TOKENS = 4_096;

if (process.env.NODE_ENV === "production" && !process.env.GROQ_API_URL) {
  console.warn("[groq] GROQ_API_URL not set — using hardcoded fallback. Set GROQ_API_URL env var to suppress this warning.");
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Escape literal control characters that appear inside JSON string values.
// Groq models sometimes emit raw newlines/tabs inside JSON strings, which is invalid JSON.
function sanitizeJsonStrings(raw: string): string {
  return raw.replace(/"((?:[^"\\]|\\.)*)"/g, (_match, inner: string) => {
    const fixed = inner
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/\t/g, "\\t");
    return `"${fixed}"`;
  });
}

function extractJson(raw: string): unknown {
  const trimmed = sanitizeJsonStrings(raw.trim());

  try {
    return JSON.parse(trimmed);
  } catch {
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    const candidate = fenced?.[1] ?? trimmed.slice(trimmed.indexOf("{"), trimmed.lastIndexOf("}") + 1);
    return JSON.parse(sanitizeJsonStrings(candidate));
  }
}

function parseGroqResponse(response: GroqResponse): unknown {
  const text = response.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error("Groq response did not include text output.");
  }

  return extractJson(text);
}

export async function generateSeoPage(prompt: string, existingSlugs: string[]): Promise<SeoContent> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY environment variable.");
  }

  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        signal: AbortSignal.timeout(60_000),
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          max_tokens: MAX_TOKENS,
          messages: [
            {
              role: "system",
              content:
                "You generate production-ready programmatic SEO pages for EasiBill. Return only valid JSON with no markdown fences. All newlines inside JSON string values must be escaped as \\n.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API failed with ${response.status}: ${await response.text()}`);
      }

      const parsed = parseGroqResponse((await response.json()) as GroqResponse);
      const validation: ValidationResult = validateSeoContent(parsed, existingSlugs);

      if (!validation.ok) {
        throw new Error(`Invalid Groq content: ${validation.errors.join("; ")}`);
      }

      return validation.data;
    } catch (error) {
      lastError = error;
      console.error(`Groq generation attempt ${attempt} failed:`, error);

      if (attempt < MAX_ATTEMPTS) {
        await sleep(RETRY_BASE_DELAY_MS * attempt);
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Groq generation failed.");
}
