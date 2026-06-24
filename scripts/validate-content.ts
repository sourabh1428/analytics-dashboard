import { promises as fs } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const SEO_CONTENT_FIELDS = ["slug", "keyword", "metaTitle", "metaDescription", "h1", "content"] as const;

export type SeoContentField = (typeof SEO_CONTENT_FIELDS)[number];

export type SeoContent = Record<SeoContentField, string>;

export type ShapeValidationResult =
  | { ok: true; data: SeoContent; errors: [] }
  | { ok: false; errors: string[] };

export type ValidationResult =
  | { ok: true; data: SeoContent; errors: [] }
  | { ok: false; errors: string[] };

export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function wordCount(content: string) {
  return content.trim().split(/\s+/).filter(Boolean).length;
}

function faqCount(content: string) {
  // Count bold Q: patterns — **Q:** or **Q.** or **Question:** etc.
  return (content.match(/\*\*Q[^*]{0,30}[?:*]/gi) ?? []).length;
}

export function validateUniqueSlug(slug: string, existingSlugs: string[]) {
  return !existingSlugs.includes(slug);
}

/** Shape-only validation: field presence, field lengths, word count, slug format.
 *  No uniqueness check — safe to call at read time. */
export function validateSeoShape(input: unknown): ShapeValidationResult {
  const errors: string[] = [];

  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, errors: ["Content must be a JSON object."] };
  }

  const candidate = input as Partial<SeoContent>;

  for (const field of SEO_CONTENT_FIELDS) {
    if (typeof candidate[field] !== "string" || candidate[field]?.trim() === "") {
      errors.push(`Missing or invalid field: ${field}.`);
    }
  }

  if (typeof candidate.slug === "string" && !slugPattern.test(candidate.slug)) {
    errors.push("Slug must use lowercase letters, numbers, and hyphens only.");
  }

  if (typeof candidate.metaTitle === "string" && candidate.metaTitle.length > 60) {
    errors.push("Meta title must be 60 characters or fewer.");
  }

  if (typeof candidate.metaDescription === "string" && candidate.metaDescription.length > 160) {
    errors.push("Meta description must be 160 characters or fewer.");
  }

  if (typeof candidate.content === "string" && wordCount(candidate.content) < 800) {
    errors.push("Content must be at least 800 words.");
  }

  if (typeof candidate.content === "string" && faqCount(candidate.content) < 5) {
    errors.push("Content must include at least 5 FAQ Q&A pairs (formatted as **Q: ...**).");
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      slug: candidate.slug!,
      keyword: candidate.keyword!,
      metaTitle: candidate.metaTitle!,
      metaDescription: candidate.metaDescription!,
      h1: candidate.h1!,
      content: candidate.content!,
    },
    errors: [],
  };
}

/** Full validation: shape + uniqueness check. Use only at write time (generate script, CLI). */
export function validateSeoContent(input: unknown, existingSlugs: string[]): ValidationResult {
  const shape = validateSeoShape(input);

  if (!shape.ok) {
    return shape;
  }

  if (!validateUniqueSlug(shape.data.slug, existingSlugs)) {
    return { ok: false, errors: [`Duplicate slug: ${shape.data.slug}.`] };
  }

  return shape;
}

async function validateAllGeneratedContent() {
  const contentDir = path.join(process.cwd(), "content", "generated");
  await fs.mkdir(contentDir, { recursive: true });
  const files = (await fs.readdir(contentDir)).filter((file) => file.endsWith(".json"));
  const slugs = files.map((file) => file.replace(/\.json$/, ""));

  const parsed = await Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(path.join(contentDir, file), "utf8");
      return { file, data: JSON.parse(raw) as unknown };
    }),
  );

  const errors: string[] = [];

  for (const { file, data } of parsed) {
    const slug = file.replace(/\.json$/, "");
    const validation = validateSeoContent(data, slugs.filter((s) => s !== slug));

    if (!validation.ok) {
      errors.push(`${file}: ${validation.errors.join(" ")}`);
      continue;
    }

    if (validation.data.slug !== slug) {
      errors.push(`${file}: file name must match slug field.`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Generated content validation failed:\n${errors.join("\n")}`);
  }

  console.log(`Validated ${files.length} generated SEO page(s).`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  validateAllGeneratedContent().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
