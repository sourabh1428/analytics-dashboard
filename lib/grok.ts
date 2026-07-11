import { validateSeoContent, type ValidationResult } from "@/scripts/validate-content";
import type { SeoContent } from "@/lib/content";

type GroqResponse = {
  choices?: Array<{ message?: { content?: string } }>;
};

type Metadata = {
  slug: string;
  keyword: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
};

const GROQ_API_URL = process.env.GROQ_API_URL ?? "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";
const MAX_CONTENT_TOKENS = 4_096;
const MAX_ATTEMPTS = 3;
const RETRY_BASE_DELAY_MS = 1_000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * O(n) scanner that escapes control characters inside JSON string values.
 * Handles all 0x00-0x1f chars. Used for metadata-only JSON (small).
 */
function sanitizeJsonControlChars(raw: string): string {
  let out = "";
  let i = 0;
  while (i < raw.length) {
    const ch = raw[i];
    if (ch === '"') {
      out += '"';
      i++;
      while (i < raw.length) {
        const c = raw[i];
        if (c === "\\") {
          out += c;
          i++;
          if (i < raw.length) { out += raw[i]; i++; }
        } else if (c === '"') {
          out += '"';
          i++;
          break;
        } else if (c.charCodeAt(0) < 0x20) {
          if (c === "\n") out += "\\n";
          else if (c === "\r") out += "\\r";
          else if (c === "\t") out += "\\t";
          i++;
        } else {
          out += c;
          i++;
        }
      }
    } else {
      out += ch;
      i++;
    }
  }
  return out;
}

/** Low-level single Groq call. Returns the raw text response. Handles 429. */
async function callGroq(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number,
): Promise<string> {
  let attempts = 0;

  while (true) {
    attempts++;
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      signal: AbortSignal.timeout(90_000),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        max_tokens: maxTokens,
        temperature: 0.7,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (response.status === 429) {
      const body = await response.text();
      const seconds = parseFloat(body.match(/try again in (\d+(?:\.\d+)?)s/i)?.[1] ?? "15");
      const waitMs = Math.ceil(seconds * 1_000) + 2_000;
      console.error(`Groq rate limit — waiting ${waitMs}ms`);
      await sleep(waitMs);
      continue;
    }

    if (!response.ok) {
      throw new Error(`Groq API ${response.status}: ${await response.text()}`);
    }

    const json = (await response.json()) as GroqResponse;
    const text = json.choices?.[0]?.message?.content;
    if (!text) throw new Error("Groq returned empty content");
    return text;
  }
}

/** Parse the 5-field metadata JSON. Small JSON — no control char issues expected. */
function parseMetadata(raw: string): Metadata {
  const sanitized = sanitizeJsonControlChars(raw.trim());
  let data: unknown;
  try {
    data = JSON.parse(sanitized);
  } catch {
    const fenced = sanitized.match(/```(?:json)?\s*([\s\S]*?)```/i);
    const candidate = fenced?.[1] ?? sanitized.slice(sanitized.indexOf("{"), sanitized.lastIndexOf("}") + 1);
    data = JSON.parse(sanitizeJsonControlChars(candidate));
  }

  const d = data as Record<string, unknown>;
  for (const f of ["slug", "keyword", "metaTitle", "metaDescription", "h1"] as const) {
    if (typeof d[f] !== "string" || !(d[f] as string).trim()) {
      throw new Error(`Metadata missing field: ${f}`);
    }
  }

  const meta: Metadata = {
    slug: (d.slug as string).trim(),
    keyword: (d.keyword as string).trim(),
    metaTitle: (d.metaTitle as string).trim(),
    metaDescription: (d.metaDescription as string).trim(),
    h1: (d.h1 as string).trim(),
  };

  if (meta.metaTitle.length > 60) throw new Error("metaTitle exceeds 60 chars");
  if (meta.metaDescription.length > 160) throw new Error("metaDescription exceeds 160 chars");

  return meta;
}

export async function generateSeoPage(
  metadataPrompt: string,
  buildContentPrompt: (meta: Metadata) => string,
  existingSlugs: string[],
  contentSystemPrompt: string = "You are a local business advisor writing SEO articles for Indian small business owners. Write clear, practical, detailed markdown. Do not wrap output in JSON or code fences — return plain markdown text only.",
): Promise<SeoContent> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("Missing GROQ_API_KEY environment variable.");

  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      // --- Call 1: metadata only (tiny JSON, reliable) ---
      const metaRaw = await callGroq(
        apiKey,
        "You generate SEO page metadata for EasiBill. Return ONLY a JSON object with exactly 5 fields: slug, keyword, metaTitle, metaDescription, h1. No markdown fences. No extra fields.",
        metadataPrompt,
        512,
      );
      const meta = parseMetadata(metaRaw);

      if (existingSlugs.includes(meta.slug)) {
        throw new Error(`Duplicate slug generated: ${meta.slug}`);
      }

      // --- Call 2: article as plain text (no JSON, no escaping issues) ---
      const contentRaw = await callGroq(
        apiKey,
        contentSystemPrompt,
        buildContentPrompt(meta),
        MAX_CONTENT_TOKENS,
      );

      // content is plain markdown — use it directly, trim leading/trailing whitespace
      const content = contentRaw.trim();

      const candidate: SeoContent = {
        slug: meta.slug,
        keyword: meta.keyword,
        metaTitle: meta.metaTitle,
        metaDescription: meta.metaDescription,
        h1: meta.h1,
        content,
      };

      const validation: ValidationResult = validateSeoContent(candidate, existingSlugs);
      if (!validation.ok) {
        throw new Error(`Validation failed: ${validation.errors.join("; ")}`);
      }

      return validation.data;
    } catch (error) {
      lastError = error;
      console.error(`Groq generation attempt ${attempt} failed:`, error);
      if (attempt < MAX_ATTEMPTS) await sleep(RETRY_BASE_DELAY_MS * attempt);
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Groq generation failed.");
}
