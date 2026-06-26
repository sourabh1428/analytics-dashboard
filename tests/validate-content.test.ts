import test from "node:test";
import assert from "node:assert/strict";

import {
  SEO_CONTENT_FIELDS,
  validateSeoContent,
  validateUniqueSlug,
} from "../scripts/validate-content";

const faqPairs = [
  "**Q: What is pharmacy GST billing software?** It helps chemists generate GST-compliant invoices quickly.",
  "**Q: Does it work on mobile?** Yes, it works on any device with a browser.",
  "**Q: Can I send bills on WhatsApp?** Yes, bills are sent directly to patients via WhatsApp.",
  "**Q: Is there a free trial?** Yes, you can start free with no credit card required.",
  "**Q: How does refill reminder work?** The system automatically messages patients when their medicine is due.",
].join(" ");
const longContent = Array.from({ length: 1001 }, (_, index) => `word${index}`).join(" ") + " " + faqPairs;

const validPage = {
  slug: "pharmacy-gst-billing-software",
  keyword: "pharmacy gst billing software",
  metaTitle: "Pharmacy GST Billing Software",
  metaDescription: "Learn how pharmacy GST billing software helps Indian chemists simplify invoices, expiry tracking, stock control, and compliant billing.",
  h1: "Pharmacy GST Billing Software",
  content: longContent,
};

test("validateSeoContent accepts a complete generated page", () => {
  assert.deepEqual(validateSeoContent(validPage, []), {
    ok: true,
    data: validPage,
    errors: [],
  });
});

test("validateSeoContent rejects missing fields and short content", () => {
  const result = validateSeoContent({ slug: "short-page", content: "too short" }, []);

  assert.equal(result.ok, false);
  assert.ok(result.errors.some((error) => error.includes("keyword")));
  assert.ok(result.errors.some((error) => error.includes("at least 800 words")));
});

test("validateSeoContent rejects duplicate slugs", () => {
  const result = validateSeoContent(validPage, ["pharmacy-gst-billing-software"]);

  assert.equal(result.ok, false);
  assert.ok(result.errors.some((error) => error.includes("Duplicate slug")));
});

test("validateUniqueSlug reports duplicates", () => {
  assert.equal(validateUniqueSlug("medicine-expiry-management", ["medicine-expiry-management"]), false);
});

test("SEO_CONTENT_FIELDS stays aligned with generated JSON storage", () => {
  assert.deepEqual(SEO_CONTENT_FIELDS, [
    "slug",
    "keyword",
    "metaTitle",
    "metaDescription",
    "h1",
    "content",
  ]);
});
