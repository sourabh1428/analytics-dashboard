import { promises as fs } from "node:fs";
import path from "node:path";
import { validateSeoShape, slugPattern } from "@/scripts/validate-content";

export type SeoContent = {
  slug: string;
  keyword: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  content: string;
};

const generatedContentDir =
  process.env.CONTENT_DIR ?? path.join(process.cwd(), "content", "generated");

async function ensureGeneratedContentDir() {
  await fs.mkdir(generatedContentDir, { recursive: true });
}

// Process-scoped slug list cache with a 60s TTL.
// Safe for SSG builds; TTL prevents stale data in long-lived processes (e.g. ISR workers).
// Not a substitute for setting `revalidate` on ISR routes — ISR consumers should do both.
const CACHE_TTL_MS = 60_000;
let slugsCache: string[] | null = null;
let slugsCacheAt = 0;

async function getCachedSlugs(): Promise<string[]> {
  if (slugsCache !== null && Date.now() - slugsCacheAt < CACHE_TTL_MS) {
    return slugsCache;
  }
  await ensureGeneratedContentDir();
  const files = await fs.readdir(generatedContentDir);
  slugsCache = files
    .filter((file) => file.endsWith(".json"))
    .map((file) => file.replace(/\.json$/, ""))
    .sort();
  slugsCacheAt = Date.now();
  return slugsCache;
}

// Per-slug content cache — prevents N+1 fs.readFile calls when getRelatedPages scores candidates.
const contentCache = new Map<string, SeoContent | null>();

export async function getAllSlugs(): Promise<string[]> {
  return getCachedSlugs();
}

export async function getContentBySlug(slug: string): Promise<SeoContent | null> {
  if (!slugPattern.test(slug)) {
    return null;
  }

  if (contentCache.has(slug)) {
    return contentCache.get(slug) ?? null;
  }

  try {
    const filePath = path.join(generatedContentDir, `${slug}.json`);
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw.replace(/^﻿/, "")) as unknown;
    const validation = validateSeoShape(parsed);

    if (!validation.ok) {
      console.error(`Invalid generated content for ${slug}: ${validation.errors.join("; ")}`);
      contentCache.set(slug, null);
      return null;
    }

    contentCache.set(slug, validation.data);
    return validation.data;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error(`Unable to load generated content for ${slug}:`, error);
    }
    contentCache.set(slug, null);
    return null;
  }
}

// Cap the number of candidate slugs scored for related pages to avoid unbounded I/O
// when the content corpus grows large. Candidates are taken from the sorted slug list,
// which means this is deterministic (no random sampling).
const RELATED_CANDIDATE_LIMIT = 100;

export async function getRelatedPages(slug: string, limit = 5): Promise<SeoContent[]> {
  const allSlugs = (await getCachedSlugs()).filter((s) => s !== slug);
  const candidates =
    allSlugs.length <= RELATED_CANDIDATE_LIMIT ? allSlugs : allSlugs.slice(0, RELATED_CANDIDATE_LIMIT);

  const currentTokens = new Set(slug.split("-"));
  const pages = await Promise.all(candidates.map((s) => getContentBySlug(s)));

  return pages
    .filter((page): page is SeoContent => page !== null)
    .map((page) => ({
      page,
      score: page.slug.split("-").filter((token) => currentTokens.has(token)).length,
    }))
    .sort((left, right) => right.score - left.score || left.page.metaTitle.localeCompare(right.page.metaTitle))
    .slice(0, limit)
    .map(({ page }) => page);
}
