import { promises as fs } from "node:fs";
import path from "node:path";
import { generateSeoPage } from "@/lib/grok";
import { getAllSlugs } from "@/lib/content";

const contentDir = path.join(process.cwd(), "content", "generated");

function buildPrompt(existingSlugs: string[]) {
  return `Create one new programmatic SEO article for EasiBill, a SaaS for independent pharmacies in India.

Existing slugs to avoid:
${existingSlugs.length > 0 ? existingSlugs.join("\n") : "No existing generated pages yet."}

Return exactly this JSON shape:
{
  "slug": "",
  "keyword": "",
  "metaTitle": "",
  "metaDescription": "",
  "h1": "",
  "content": ""
}

Rules:
- Pick a commercially useful pharmacy billing, GST invoicing, inventory, expiry, purchase, reporting, or compliance keyword.
- Use a unique lowercase kebab-case slug.
- metaTitle must be 60 characters or fewer.
- metaDescription must be 160 characters or fewer.
- content must be markdown and at least 1000 words.
- Write practical advice for Indian pharmacy owners.
- Mention EasiBill naturally as the solution.
- Do not include HTML.
- Do not include markdown fences around the JSON.`;
}

async function savePage() {
  await fs.mkdir(contentDir, { recursive: true });

  const existingSlugs = await getAllSlugs();
  const prompt = buildPrompt(existingSlugs);
  const page = await generateSeoPage(prompt, existingSlugs);

  const filePath = path.join(contentDir, `${page.slug}.json`);

  try {
    await fs.writeFile(filePath, `${JSON.stringify(page, null, 2)}\n`, { flag: "wx" });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST") {
      throw new Error(`Generated duplicate file: ${filePath}`);
    }

    throw error;
  }

  console.log(`Created generated SEO page: ${page.slug}`);
}

savePage().catch((error) => {
  console.error("SEO page generation failed.");
  console.error(error);
  process.exit(1);
});
