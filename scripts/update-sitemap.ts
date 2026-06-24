import { promises as fs } from "node:fs";
import path from "node:path";
import { getAllSlugs } from "@/lib/content";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

async function updateSitemap() {
  const siteUrl = (process.env.SITE_URL ?? "https://easibill.com").replace(/\/$/, "");
  const slugs = await getAllSlugs();
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = [
    {
      loc: siteUrl,
      priority: "1.0",
    },
    ...slugs.map((slug) => ({
      loc: `${siteUrl}/${slug}`,
      priority: "0.8",
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
