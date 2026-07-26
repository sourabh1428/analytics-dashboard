import { promises as fs } from "node:fs";
import path from "node:path";
import { generateSeoPage } from "@/lib/grok";

const contentDir = path.join(process.cwd(), "content", "generated");

type Theme = {
  id: string;
  label: string;
  examples: string;
  matchKeywords: string[];
};

type Vertical = {
  key: string;
  label: string;
  ownerLabel: string;
  targetCustomer: string;
  painPoints: string;
  itemExamples: string;
  gstFacts: string;
  themes: Theme[];
};

// Every vertical carries the SAME four theme buckets so the generator can be forced
// to rotate through billing, retention, broadcast/seasonal, and ops/analytics content
// instead of drifting toward whichever bucket is easiest to write (historically: GST/billing).
const VERTICALS: Vertical[] = [
  {
    key: "pharmacy",
    label: "independent pharmacies",
    ownerLabel: "pharmacy owner",
    targetCustomer:
      "Independent pharmacy owners in India, especially Tier 2 and Tier 3 cities. Age 35–60. Non-technical. They lose revenue when chronic-care customers don't return for refills and waste money on expired stock.",
    painPoints:
      "Chronic-care customers (diabetes, hypertension, thyroid) forgetting to return for refills, expired stock going unsold, manual GST billing eating evenings.",
    itemExamples: "Metformin, Amlodipine, Atorvastatin, insulin, vitamin supplements",
    gstFacts: `- Most medicines (OTC, generic, branded): 12% GST
- Essential medicines on exemption list: 0% GST (e.g., insulin, oral rehydration salts, contraceptives)
- Nutraceuticals, supplements, vitamins: typically 12% or 18% GST
- Medical devices and equipment: 12% GST
- HSN code for medicaments (general): 3004
- GSTIN mandatory above ₹40 lakh turnover; Composition Scheme available below ₹1.5 crore (but cannot issue tax invoice)`,
    themes: [
      {
        id: "billing_gst",
        label: "GST & billing",
        examples: "GST invoicing for pharmacy, bulk GST billing for medical stores, GST compliance and HSN codes for medicines, WhatsApp GST billing",
        matchKeywords: ["gst", "billing", "invoic", "hsn"],
      },
      {
        id: "retention_followup",
        label: "customer retention & follow-up",
        examples:
          "refill reminders for chronic-care customers (diabetes, hypertension, thyroid), WhatsApp refill reminder systems, winning back lapsed chronic-care customers",
        matchKeywords: ["refill", "reminder", "chronic", "lapsed", "follow-up", "follow up"],
      },
      {
        id: "broadcast_seasonal",
        label: "broadcast campaigns & festivals/seasons",
        examples:
          "WhatsApp broadcast campaigns for flu/monsoon health kits, festival health-checkup camp promotions, seasonal vitamin and immunity-booster campaigns, announcing new stock or offers to customer segments",
        matchKeywords: ["broadcast", "festival", "season", "monsoon", "campaign", "promotion"],
      },
      {
        id: "ops_analytics",
        label: "operations & retention analytics",
        examples:
          "expiry stock tracking and clearance, purchase order management for medical stores, tracking refill/follow-up recovery rate, medicine inventory management systems",
        matchKeywords: ["expiry", "stock", "inventory", "purchase order", "analytics", "recovery rate", "daily queue"],
      },
    ],
  },
  {
    key: "kirana",
    label: "kirana and grocery stores",
    ownerLabel: "kirana store owner",
    targetCustomer:
      "Independent kirana/grocery store owners in India, especially Tier 2 and Tier 3 cities. Age 30–60. Non-technical, price-sensitive, competing against quick-commerce apps like Blinkit, Zepto, and Instamart for the same repeat customers.",
    painPoints:
      "Regular monthly-restock customers drifting to quick-commerce apps, khata (credit book) tracking done on paper, no way to remind customers when their staples are due for reorder.",
    itemExamples: "rice, atta, pulses, cooking oil, sugar, packaged snacks, household staples",
    gstFacts: `- Unbranded, loose food staples (rice, wheat, pulses, flour): generally 0% GST
- Branded and pre-packaged staples in a unit container: generally 5% GST
- Packaged branded snacks, biscuits, namkeen: generally 18% GST (some categories lower — verify per item)
- Fresh unbranded milk: 0% GST; UHT/branded packaged milk: generally 5% GST
- GSTIN mandatory above ₹40 lakh turnover; Composition Scheme available below ₹1.5 crore for goods retailers`,
    themes: [
      {
        id: "billing_gst",
        label: "GST & billing",
        examples: "GST on packaged vs loose staples, WhatsApp billing for kirana stores, GST invoicing for grocery stores",
        matchKeywords: ["gst", "billing", "invoic"],
      },
      {
        id: "retention_followup",
        label: "customer retention & follow-up",
        examples:
          "monthly restock reminders over WhatsApp, winning back customers drifting to quick-commerce apps, personalised reorder reminders based on purchase history",
        matchKeywords: ["restock", "reminder", "quick-commerce", "quick commerce", "reorder", "follow-up", "follow up"],
      },
      {
        id: "broadcast_seasonal",
        label: "broadcast campaigns & festivals/seasons",
        examples:
          "festival stock-up broadcast campaigns (Diwali, Holi, Eid), WhatsApp broadcast for weekly offers and discounts, seasonal staple demand campaigns (winter/monsoon)",
        matchKeywords: ["broadcast", "festival", "diwali", "holi", "eid", "season", "campaign", "offer"],
      },
      {
        id: "ops_analytics",
        label: "operations & retention analytics",
        examples:
          "khata/credit book digitisation, tracking which customers have gone inactive, restock/reorder analytics for grocery stores",
        matchKeywords: ["khata", "credit book", "inactive", "analytics", "daily queue"],
      },
    ],
  },
  {
    key: "electronics",
    label: "electronics and appliance stores",
    ownerLabel: "electronics store owner",
    targetCustomer:
      "Independent electronics and appliance store owners in India. Age 30–55. Sell high-value, low-frequency purchases (phones, TVs, appliances) and depend on warranty/AMC renewals and accessory upsells for repeat revenue.",
    painPoints:
      "Customers forgetting warranty and AMC renewal dates, no organised way to follow up after a big-ticket sale, accessory and upgrade opportunities missed because there's no reminder system.",
    itemExamples: "smartphones, televisions, refrigerators, washing machines, small appliances, accessories",
    gstFacts: `- Mobile phones: 18% GST (HSN 8517)
- Most consumer electronics and home appliances: generally 18% GST
- Large televisions (screen size above 32 inches): generally 28% GST
- GSTIN mandatory above ₹40 lakh turnover; Composition Scheme available below ₹1.5 crore for goods traders (no input tax credit, no inter-state sales)`,
    themes: [
      {
        id: "billing_gst",
        label: "GST & billing",
        examples: "GST on electronics and appliances by category, WhatsApp billing for electronics stores, bulk invoicing for retail chains",
        matchKeywords: ["gst", "billing", "invoic"],
      },
      {
        id: "retention_followup",
        label: "customer retention & follow-up",
        examples: "warranty and AMC renewal reminders, follow-up after high-value purchases, accessory/upgrade reminder campaigns",
        matchKeywords: ["warranty", "amc", "renewal", "follow-up", "follow up", "upgrade"],
      },
      {
        id: "broadcast_seasonal",
        label: "broadcast campaigns & festivals/seasons",
        examples:
          "festival sale broadcast campaigns (Diwali, New Year electronics sales), WhatsApp broadcast for new model launches, seasonal upgrade campaigns (AC season, exam-season laptop offers)",
        matchKeywords: ["broadcast", "festival", "diwali", "sale", "season", "campaign", "launch"],
      },
      {
        id: "ops_analytics",
        label: "operations & retention analytics",
        examples:
          "tracking warranty/AMC renewal rates, retention analytics for repeat electronics buyers, inventory and stock-level tracking for appliance stores",
        matchKeywords: ["analytics", "retention rate", "inventory", "stock", "daily queue"],
      },
    ],
  },
  {
    key: "clothing",
    label: "clothing and apparel stores",
    ownerLabel: "clothing store owner",
    targetCustomer:
      "Independent clothing and apparel store owners in India. Age 25–55. Deal with seasonal and festival demand spikes, need to track customer size/style preferences, and rely on repeat buyers for steady revenue between sale seasons.",
    painPoints:
      "Customers forgetting about new season/festival collections, no record of a repeat customer's size and style preferences, sale and new-arrival announcements sent inconsistently or not at all.",
    itemExamples: "shirts, kurtas, sarees, jeans, festive wear, footwear",
    gstFacts: `- Apparel priced up to ₹1,000 per piece: generally 5% GST
- Apparel priced above ₹1,000 per piece: generally 12% GST
- Footwear priced up to ₹1,000 per pair: generally 5% GST; above that, generally 12–18% GST
- GSTIN mandatory above ₹40 lakh turnover; Composition Scheme available below ₹1.5 crore for goods retailers`,
    themes: [
      {
        id: "billing_gst",
        label: "GST & billing",
        examples: "GST on apparel by price slab, WhatsApp billing for clothing stores, bulk billing for apparel retailers",
        matchKeywords: ["gst", "billing", "invoic"],
      },
      {
        id: "retention_followup",
        label: "customer retention & follow-up",
        examples: "tracking customer size and style preferences, personalised restock/reorder reminders, follow-up after festive purchases",
        matchKeywords: ["size", "style", "preference", "follow-up", "follow up", "reminder"],
      },
      {
        id: "broadcast_seasonal",
        label: "broadcast campaigns & festivals/seasons",
        examples:
          "festival and new-collection broadcast campaigns (Diwali, wedding season, Eid), seasonal sale announcement campaigns, WhatsApp broadcast for new arrivals",
        matchKeywords: ["broadcast", "festival", "diwali", "wedding season", "eid", "new arrival", "campaign", "sale"],
      },
      {
        id: "ops_analytics",
        label: "operations & retention analytics",
        examples:
          "loyalty programmes for repeat buyers, tracking follow-up/conversion rate on broadcast campaigns, seasonal inventory planning for apparel stores",
        matchKeywords: ["loyalty", "analytics", "conversion rate", "inventory planning", "daily queue"],
      },
    ],
  },
  {
    key: "spa",
    label: "spas and salons",
    ownerLabel: "spa or salon owner",
    targetCustomer:
      "Independent spa and salon owners in India. Age 25–55. Revenue depends on customers rebooking for their next appointment on time, and on running membership/package deals that keep customers coming back.",
    painPoints:
      "Customers forgetting to rebook their next appointment, no automated way to remind clients when a package or membership is about to expire, staff manually tracking client preferences on paper.",
    itemExamples: "haircuts, facials, massages, manicure/pedicure, membership packages",
    gstFacts: `- Salon and spa services: generally 18% GST
- Service providers with turnover below ₹20 lakh (₹10 lakh in special category states) are generally not required to register for GST
- A composition scheme for services is available for eligible providers with turnover up to ₹50 lakh, at a lower fixed rate
- GSTR-1 by the 11th of the following month, GSTR-3B by the 20th, for registered service providers`,
    themes: [
      {
        id: "billing_gst",
        label: "GST & billing",
        examples: "GST on salon and spa services, WhatsApp billing for salons and spas, composition scheme for service providers",
        matchKeywords: ["gst", "billing", "invoic", "composition scheme"],
      },
      {
        id: "retention_followup",
        label: "customer retention & follow-up",
        examples: "appointment rebooking reminders over WhatsApp, membership and package expiry reminders, client preference tracking",
        matchKeywords: ["rebook", "appointment", "membership", "expiry reminder", "preference", "follow-up", "follow up"],
      },
      {
        id: "broadcast_seasonal",
        label: "broadcast campaigns & festivals/seasons",
        examples:
          "festival and wedding-season broadcast campaigns, WhatsApp broadcast for new package launches, seasonal offer campaigns (bridal season, festive grooming packages)",
        matchKeywords: ["broadcast", "festival", "wedding season", "bridal", "campaign", "launch", "offer"],
      },
      {
        id: "ops_analytics",
        label: "operations & retention analytics",
        examples:
          "retention analytics for salons (follow-up rate, inactive clients), staff/appointment scheduling tracking, membership utilisation tracking",
        matchKeywords: ["analytics", "inactive client", "scheduling", "utilisation", "daily queue"],
      },
    ],
  },
];

type ExistingPage = { slug: string; keyword: string; h1: string; theme?: string };

async function loadExistingPages(): Promise<ExistingPage[]> {
  await fs.mkdir(contentDir, { recursive: true });
  const files = (await fs.readdir(contentDir)).filter((file) => file.endsWith(".json"));

  const pages = await Promise.all(
    files.map(async (file) => {
      try {
        const raw = await fs.readFile(path.join(contentDir, file), "utf8");
        const data = JSON.parse(raw.replace(/^﻿/, "")) as Partial<ExistingPage>;
        return {
          slug: file.replace(/\.json$/, ""),
          keyword: data.keyword ?? "",
          h1: data.h1 ?? "",
          theme: data.theme,
        };
      } catch {
        return { slug: file.replace(/\.json$/, ""), keyword: "", h1: "" };
      }
    }),
  );

  return pages;
}

function classifyTheme(page: ExistingPage, vertical: Vertical): string | null {
  if (page.theme && vertical.themes.some((t) => t.id === page.theme)) {
    return page.theme;
  }
  const haystack = `${page.slug} ${page.keyword} ${page.h1}`.toLowerCase();
  for (const theme of vertical.themes) {
    if (theme.matchKeywords.some((kw) => haystack.includes(kw))) {
      return theme.id;
    }
  }
  return null;
}

/** Weighted random pick, favoring items with lower existing counts — biases future
 *  generations toward under-covered verticals/themes without making selection fully rigid. */
function weightedPick<T extends string>(items: T[], counts: Record<string, number>): T {
  const weights = items.map((item) => 1 / ((counts[item] ?? 0) + 1));
  const total = weights.reduce((sum, w) => sum + w, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return items[i];
  }
  return items[items.length - 1];
}

function pickVertical(existingPages: ExistingPage[]): Vertical {
  const counts: Record<string, number> = {};
  for (const v of VERTICALS) {
    counts[v.key] = existingPages.filter((p) => p.slug.startsWith(`${v.key}-`)).length;
  }
  const key = weightedPick(VERTICALS.map((v) => v.key), counts);
  return VERTICALS.find((v) => v.key === key)!;
}

function pickTheme(vertical: Vertical, existingPages: ExistingPage[]): Theme {
  const verticalPages = existingPages.filter((p) => p.slug.startsWith(`${vertical.key}-`));
  const counts: Record<string, number> = {};
  for (const theme of vertical.themes) {
    counts[theme.id] = verticalPages.filter((p) => classifyTheme(p, vertical) === theme.id).length;
  }
  const id = weightedPick(
    vertical.themes.map((t) => t.id),
    counts,
  );
  return vertical.themes.find((t) => t.id === id)!;
}

function buildFerbzBrief(vertical: Vertical): string {
  return `
## Ferbz — What It Is
Ferbz is a SaaS platform for independent local businesses in India, currently used heavily by ${vertical.label}. Core features:
- WhatsApp + SMS follow-up reminders: automatically reminds customers when it's time to come back, based on a per-customer interval
- Bulk GST-compliant billing: generate and send invoices to multiple customers in one click, delivered on WhatsApp
- Customer records: every customer's contact info, item/service history, and follow-up interval in one place
- Daily queue: shows who's due, overdue, or recently followed up, every morning
- Broadcast campaigns: send targeted WhatsApp messages to customer segments for offers, restocks, or seasonal promotions
- Retention analytics: follow-up rate, recovered follow-ups, and inactive customers, calculated from actual sales data
- Works on mobile — designed for a shop owner on the floor, not at a desk

## Target Customer
${vertical.targetCustomer}

## This Vertical's Specific Pain Points
${vertical.painPoints}

## Typical Items/Services Sold
${vertical.itemExamples}

## GST Facts for This Vertical (use these — do not invent different numbers, and do not overstate certainty on figures marked "generally")
${vertical.gstFacts}

## CTA
Trial: https://dashboard.ferbz.com/
Contact: support@ferbz.com
`;
}

function buildMetadataPrompt(vertical: Vertical, theme: Theme, existingSlugs: string[]): string {
  return `${buildFerbzBrief(vertical)}

---

Your assigned theme for this article is: **${theme.label}**. This is not optional — pick a keyword strictly within this theme.

Topic ideas for this theme: ${theme.examples}

Pick ONE commercially valuable keyword within this theme that a ${vertical.ownerLabel} in India would search when facing a real problem in this specific area. You may pick a close variation of the topic ideas above, but it MUST stay within the "${theme.label}" theme.

${theme.id === "billing_gst" ? "" : "Do NOT make this about GST rates, tax invoicing, or billing mechanics — that is a different theme and is already heavily covered. Stay focused on \"" + theme.label + "\"."}

Existing slugs — do NOT reuse any of these:
${existingSlugs.length > 0 ? existingSlugs.join("\n") : "No existing pages yet."}

Return ONLY this JSON with no extra text:
{
  "slug": "${vertical.key}-unique-lowercase-kebab-2-to-5-words",
  "keyword": "the exact keyword phrase the ${vertical.ownerLabel} would search",
  "metaTitle": "Under 60 characters. Include keyword. Brand: Ferbz.",
  "metaDescription": "Under 160 characters. State the benefit clearly. Mention Ferbz.",
  "h1": "A question or statement the ${vertical.ownerLabel} would instantly recognise as their problem."
}

The slug MUST start with "${vertical.key}-".`;
}

function buildContentPrompt(vertical: Vertical, theme: Theme, meta: { slug: string; keyword: string; h1: string }): string {
  return `${buildFerbzBrief(vertical)}

---

Write a complete SEO article for Indian ${vertical.label.replace(/^./, (c) => c.toUpperCase())} owners. Topic: "${meta.h1}"
Target keyword: "${meta.keyword}"
Assigned theme: **${theme.label}** — the entire article must stay focused on this theme.
${theme.id === "billing_gst" ? "" : "Do NOT let this article turn into a GST-rates or generic-billing piece. GST/billing may be mentioned only in passing (e.g. as one line in the \"how Ferbz solves this\" section) — the substance of every section must be about \"" + theme.label + "\"."}

## Required structure — use EXACTLY these heading names (no numbering):

### ## The Problem (at least 300 words)
Open with a specific, realistic scenario: a ${vertical.ownerLabel} in a Tier 2 city dealing with the exact pain this keyword targets. Use concrete numbers and daily-life details. Explain why this problem costs them money or time.

### ## How ${vertical.label.replace(/^./, (c) => c.toUpperCase())} Owners Manage This Today (at least 350 words)
Step-by-step practical advice they can act on TODAY without any software. Use a numbered list. Real-world tools: notebooks, Excel, WhatsApp groups, phone calls. Acknowledge the limitations. Include at least one real GST/regulatory fact relevant to this vertical if it's naturally relevant — do not force it if the theme is unrelated to GST.

### ## How Ferbz Solves This (at least 300 words)
Name the specific Ferbz feature that addresses this pain. Explain exactly how it works for a ${vertical.ownerLabel}. Quantify time or money saved. Be specific ("replaces a 45-minute nightly Excel session" not "saves time").

### ## Frequently Asked Questions (at least 5 questions)
Write exactly 5 Q&A pairs. Each question must be something a real Indian ${vertical.ownerLabel} would Google. Each answer: 3–5 sentences, specific, useful. Format EXACTLY like this — do not deviate:

**Q: [question]**
[answer]

**Q: [question]**
[answer]

(continue for all 5 pairs)

### ## Get Started with Ferbz (at least 100 words)
A closing CTA section. Include the trial link https://dashboard.ferbz.com/ and contact support@ferbz.com.

---

Rules:
- Total minimum: 1,200 words across all sections
- Use ## for section headings
- Write in plain markdown — no HTML
- Do not return JSON or code fences — return ONLY the markdown article
- Do not invent GST rates, HSN codes, or features that Ferbz does not have
- Do not use pharmacy/medical language (refill, prescription, chronic-care, dosage) unless the vertical is pharmacy
- Write as a trusted local business advisor, not a marketer`;
}

async function savePage() {
  await fs.mkdir(contentDir, { recursive: true });

  const existingPages = await loadExistingPages();
  const existingSlugs = existingPages.map((p) => p.slug).sort();

  const vertical = pickVertical(existingPages);
  const theme = pickTheme(vertical, existingPages);

  const page = await generateSeoPage(
    buildMetadataPrompt(vertical, theme, existingSlugs),
    (meta) => buildContentPrompt(vertical, theme, meta),
    existingSlugs,
    `You are a local business advisor writing SEO articles for Indian ${vertical.label} owners. Write clear, practical, detailed markdown. Do not wrap output in JSON or code fences — return plain markdown text only.`,
  );

  if (!page.slug.startsWith(`${vertical.key}-`)) {
    throw new Error(`Generated slug "${page.slug}" does not start with expected prefix "${vertical.key}-"`);
  }

  const filePath = path.join(contentDir, `${page.slug}.json`);
  const pageWithTheme = { ...page, theme: theme.id };

  try {
    await fs.writeFile(filePath, `${JSON.stringify(pageWithTheme, null, 2)}\n`, { flag: "wx" });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST") {
      throw new Error(`Generated duplicate file: ${filePath}`);
    }
    throw error;
  }

  console.log(`Created SEO page: ${page.slug} (${vertical.key} · ${theme.id} · ${page.keyword})`);
}

savePage().catch((error) => {
  console.error("SEO page generation failed.");
  console.error(error);
  process.exit(1);
});
