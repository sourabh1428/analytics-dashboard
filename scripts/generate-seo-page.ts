import { promises as fs } from "node:fs";
import path from "node:path";
import { generateSeoPage } from "@/lib/grok";
import { getAllSlugs } from "@/lib/content";

const contentDir = path.join(process.cwd(), "content", "generated");

const EASIBILL_BRIEF = `
## EasiBill — What It Is
EasiBill is a SaaS platform for independent pharmacies in India. Core features:
- WhatsApp + SMS refill reminders: automatically sends reminders to chronic-care patients (diabetes, hypertension, thyroid) when prescriptions are due
- Bulk GST-compliant billing: generate and send invoices to multiple patients in one click
- Expiry tracking: flags near-expiry stock before it becomes dead inventory
- Purchase order management: raise POs to distributors, track delivery and payment status
- Sales and financial reporting: daily/weekly/monthly revenue by drug category
- Multi-store support: one owner manages multiple pharmacy branches from one dashboard
- Works on mobile — designed for pharmacy owners on the floor, not at a desk

## Target Customer
Independent pharmacy owners in India, especially Tier 2 and Tier 3 cities. Age 35–60. Non-technical. They lose revenue when chronic patients don't return for refills. They waste money on expired stock. They spend evenings doing manual billing that software can automate.

## Pharmacy GST Facts (use these — do not invent different numbers)
- Most medicines (OTC, generic, branded): 12% GST
- Essential medicines on exemption list: 0% GST (e.g., insulin, oral rehydration salts, contraceptives)
- Nutraceuticals, supplements, vitamins: typically 12% or 18% GST
- Medical devices and equipment: 12% GST
- HSN code for medicaments (general): 3004
- GSTIN is mandatory for pharmacies with turnover above ₹40 lakhs
- Pharmacies can use Composition Scheme if turnover is below ₹1.5 crore (but cannot issue tax invoice)
- Monthly GST filing: GSTR-1 by 11th of following month, GSTR-3B by 20th

## CTA
Trial: https://easibill.vercel.app/login
Contact: support@easibill.com
`;

function buildMetadataPrompt(existingSlugs: string[]): string {
  return `${EASIBILL_BRIEF}

---

Pick ONE commercially valuable keyword that an Indian pharmacy owner would search when facing a real billing, inventory, or patient management problem. Choose from topics like: GST invoicing for pharmacy, refill reminders for chronic patients, expiry stock tracking, purchase order management for medical store, bulk billing, WhatsApp billing reminders, medicine inventory management, GSTR-1 filing for pharmacy, or similar.

Existing slugs — do NOT reuse any of these:
${existingSlugs.length > 0 ? existingSlugs.join("\n") : "No existing pages yet."}

Return ONLY this JSON with no extra text:
{
  "slug": "unique-lowercase-kebab-3-to-6-words",
  "keyword": "the exact keyword phrase the pharmacy owner would search",
  "metaTitle": "Under 60 characters. Include keyword. Brand: EasiBill.",
  "metaDescription": "Under 160 characters. State the benefit clearly. Mention EasiBill.",
  "h1": "A question or statement the pharmacy owner would instantly recognise as their problem."
}`;
}

function buildContentPrompt(meta: { slug: string; keyword: string; h1: string }): string {
  return `${EASIBILL_BRIEF}

---

Write a complete SEO article for Indian pharmacy owners. Topic: "${meta.h1}"
Target keyword: "${meta.keyword}"

## Required structure — use EXACTLY these heading names (no numbering):

### ## The Problem (at least 300 words)
Open with a specific, realistic scenario: a pharmacy owner in a Tier 2 city dealing with the exact pain this keyword targets. Use concrete numbers and daily-life details. Explain why this problem costs them money or time.

### ## How Pharmacy Owners Manage This Today (at least 350 words)
Step-by-step practical advice they can act on TODAY without any software. Use a numbered list. Real-world tools: Excel, paper registers, WhatsApp groups, phone calls. Acknowledge the limitations. Include at least one real GST/pharmacy regulation fact.

### ## How EasiBill Solves This (at least 300 words)
Name the specific EasiBill feature that addresses this pain. Explain exactly how it works. Quantify time or money saved. Be specific ("replaces a 45-minute nightly Excel session" not "saves time").

### ## Frequently Asked Questions (at least 5 questions)
Write exactly 5 Q&A pairs. Each question must be something a real Indian pharmacy owner would Google. Each answer: 3–5 sentences, specific, useful. Format EXACTLY like this — do not deviate:

**Q: [question]**
[answer]

**Q: [question]**
[answer]

(continue for all 5 pairs)

### ## Get Started with EasiBill (at least 100 words)
A closing CTA section. Include the trial link https://easibill.vercel.app/login and contact support@easibill.com.

---

Rules:
- Total minimum: 1,200 words across all sections
- Use ## for section headings
- Write in plain markdown — no HTML
- Do not return JSON or code fences — return ONLY the markdown article
- Do not invent GST rates, HSN codes, or features that EasiBill does not have
- Write as a trusted pharmacy business advisor, not a marketer`;
}

async function savePage() {
  await fs.mkdir(contentDir, { recursive: true });

  const existingSlugs = await getAllSlugs();

  const page = await generateSeoPage(
    buildMetadataPrompt(existingSlugs),
    buildContentPrompt,
    existingSlugs,
  );

  const filePath = path.join(contentDir, `${page.slug}.json`);

  try {
    await fs.writeFile(filePath, `${JSON.stringify(page, null, 2)}\n`, { flag: "wx" });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST") {
      throw new Error(`Generated duplicate file: ${filePath}`);
    }
    throw error;
  }

  console.log(`Created SEO page: ${page.slug} (${page.keyword})`);
}

savePage().catch((error) => {
  console.error("SEO page generation failed.");
  console.error(error);
  process.exit(1);
});
