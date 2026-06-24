import { validateSeoContent, type ValidationResult } from "@/scripts/validate-content";
import type { SeoContent } from "@/lib/content";

type GrokResponse = {
  output_text?: string;
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

const GROK_API_URL = process.env.GROK_API_URL ?? "https://api.x.ai/v1/responses";
const GROK_MODEL = process.env.GROK_MODEL ?? "grok-4.3";
const MAX_ATTEMPTS = 3;
const RETRY_BASE_DELAY_MS = 1_000;

if (process.env.NODE_ENV === "production" && !process.env.GROK_API_URL) {
  console.warn("[grok] GROK_API_URL not set — using hardcoded fallback. Set GROK_API_URL env var to suppress this warning.");
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractJson(raw: string): unknown {
  const trimmed = raw.trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    const candidate = fenced?.[1] ?? trimmed.slice(trimmed.indexOf("{"), trimmed.lastIndexOf("}") + 1);
    return JSON.parse(candidate);
  }
}

function parseGrokResponse(response: GrokResponse): unknown {
  const text = response.output_text ?? response.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error("Grok response did not include text output.");
  }

  return extractJson(text);
}

export async function generateSeoPage(prompt: string, existingSlugs: string[]): Promise<SeoContent> {
  const apiKey = process.env.GROK_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GROK_API_KEY environment variable.");
  }

  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(GROK_API_URL, {
        method: "POST",
        signal: AbortSignal.timeout(30_000),
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: GROK_MODEL,
          input: [
            {
              role: "system",
              content:
                "You generate production-ready programmatic SEO pages for EasiBill. Return only valid JSON with no markdown fences.",
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
        throw new Error(`Grok API failed with ${response.status}: ${await response.text()}`);
      }

      const parsed = parseGrokResponse((await response.json()) as GrokResponse);
      const validation: ValidationResult = validateSeoContent(parsed, existingSlugs);

      if (!validation.ok) {
        throw new Error(`Invalid Grok content: ${validation.errors.join("; ")}`);
      }

      return validation.data;
    } catch (error) {
      lastError = error;
      console.error(`Grok generation attempt ${attempt} failed:`, error);

      if (attempt < MAX_ATTEMPTS) {
        await sleep(RETRY_BASE_DELAY_MS * attempt);
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Grok generation failed.");
}
