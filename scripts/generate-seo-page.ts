import { promises as fs } from "node:fs";
import path from "node:path";
import { generateSeoPage } from "@/lib/grok";
import { getAllSlugs } from "@/lib/content";

const contentDir = path.join(process.cwd(), "content", "generated");

function buildPrompt(existingSlugs: string[]) {
  return `You are writing a programmatic SEO article for EasiBill (https://easibill.vercel.app).

## What EasiBill is
EasiBill is a SaaS platform for independent pharmacies in India. Its core product is automated patient refill management:
- Sends WhatsApp and SMS reminders to chronic-care patients when their prescriptions are due for refill
- Tracks which patients haven't returned and flags them so pharmacy staff can follow up
- Bulk billing: generate and send GST-compliant invoices to multiple patients in one click
- Purchase order management: raise POs to distributors, track delivery and payment
- Expiry tracking: flag near-expiry stock before it becomes dead inventory
- Sales and financial reporting: daily, weekly, monthly revenue breakdowns by drug category
- Multi-store support: one owner can manage multiple pharmacy branches from one dashboard
- Works on mobile — designed for pharmacy owners who are on the floor, not at a desk

## Target customer
Independent pharmacy owners in India, especially Tier 2 and Tier 3 cities. Age 35–60. Non-technical. Time-pressured. They lose revenue when chronic patients (diabetes, hypertension, thyroid) don't come back for refills. EasiBill solves this by automating the follow-up they used to do manually by phone.

## Brand voice
Practical, direct, grounded in the pharmacy owner's daily reality. Never over-promise. Avoid corporate jargon. Write as if you are a trusted pharmacy business advisor explaining something to a shop owner in plain language.

## CTA details
Trial: https://easibill.vercel.app/login
Contact: hello@easibill.io

---

Now write one new SEO article using the keyword topic below.

Existing slugs (do not reuse any of these):
${existingSlugs.length > 0 ? existingSlugs.join("\n") : "No existing generated pages yet."}

Return exactly this JSON shape with no extra keys:
{
  "slug": "",
  "keyword": "",
  "metaTitle": "",
  "metaDescription": "",
  "h1": "",
  "content": ""
}

Rules:
- Pick ONE commercially valuable keyword that an Indian pharmacy owner would search when they have a real problem: GST invoicing, refill reminders, expiry tracking, purchase order management, patient follow-up, bulk billing, inventory management, drug licence compliance, pharmacy reporting, WhatsApp billing, or similar.
- slug: unique lowercase kebab-case, 3–6 words, matches the keyword
- metaTitle: 60 characters or fewer, include the keyword
- metaDescription: 160 characters or fewer, include a clear benefit and EasiBill
- h1: clear question or statement the pharmacy owner would recognise as their problem
- content: markdown. Write a MINIMUM of 1200 words — do not stop early. Structure with ## subheadings. Include:
  1. The real pain this pharmacy owner faces (300+ words — be specific, give concrete examples)
  2. Step-by-step practical advice they can act on today without any software (400+ words — numbered steps, real-world detail)
  3. How EasiBill specifically solves this faster — name the actual feature (e.g. "EasiBill's WhatsApp refill reminder") (300+ words)
  4. A closing CTA section linking to https://easibill.vercel.app/login (100+ words)
- Write all four sections completely before outputting the JSON. Do not truncate.
- Do not invent features EasiBill does not have (see the feature list above)
- Do not include HTML
- Do not wrap the JSON in markdown fences`;
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
