import { promises as fs } from "node:fs";
import path from "node:path";
import { getAllSlugs } from "@/lib/content";
import { blogPosts } from "@/src/data/blogPosts";
import { helpArticles } from "@/src/data/helpArticles";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

const STATIC_PAGES = [
  { path: "", priority: "1.0" },
  { path: "about", priority: "0.6" },
  { path: "contact", priority: "0.6" },
  { path: "features", priority: "0.8" },
  { path: "features/follow-up-reminders", priority: "0.7" },
  { path: "features/patient-records", priority: "0.7" },
  { path: "features/daily-queue", priority: "0.7" },
  { path: "features/broadcast-campaigns", priority: "0.7" },
  { path: "features/retention-analytics", priority: "0.7" },
  { path: "testimonials", priority: "0.6" },
  { path: "blog", priority: "0.7" },
  { path: "help", priority: "0.7" },
  { path: "onboarding", priority: "0.5" },
  { path: "tutorials", priority: "0.5" },
  { path: "webinars", priority: "0.5" },
  { path: "sitemap-page", priority: "0.3" },
  { path: "ferbz-customisable-bulk-billing-solution", priority: "0.7" },
  { path: "privacy", priority: "0.3" },
  { path: "terms", priority: "0.3" },
];

async function updateSitemap() {
  const siteUrl = (process.env.SITE_URL ?? "https://ferbz.com").replace(/\/$/, "");
  const slugs = await getAllSlugs();
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = [
    ...STATIC_PAGES.map((page) => ({
      loc: page.path ? `${siteUrl}/${page.path}` : siteUrl,
      priority: page.priority,
    })),
    ...slugs.map((slug) => ({
      loc: `${siteUrl}/${slug}`,
      priority: "0.8",
    })),
    ...blogPosts.map((post) => ({
      loc: `${siteUrl}/blog/${post.slug}`,
      priority: "0.6",
    })),
    ...helpArticles.map((article) => ({
      loc: `${siteUrl}/help/${article.slug}`,
      priority: "0.6",
    })),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

  const publicDir = path.join(process.cwd(), "public");
  await fs.mkdir(publicDir, { recursive: true });
  await fs.writeFile(path.join(publicDir, "sitemap.xml"), sitemap, "utf8");

  console.log(`Updated sitemap with ${urls.length} URL(s).`);
}

updateSitemap().catch((error) => {
  console.error("Sitemap update failed.");
  console.error(error);
  process.exit(1);
});
