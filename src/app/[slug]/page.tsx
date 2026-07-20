import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Article } from "@/components/seo/Article";
import { CTASection } from "@/components/seo/CTASection";
import { getAllSlugs, getContentBySlug, getRelatedPages } from "@/lib/content";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const siteUrl = process.env.SITE_URL ?? "https://ferbz.com";

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getContentBySlug(slug);

  if (!page) {
    return {};
  }

  const canonical = `${siteUrl.replace(/\/$/, "")}/${page.slug}`;

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: canonical,
      siteName: "Ferbz",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: page.metaTitle,
      description: page.metaDescription,
    },
  };
}

export default async function GeneratedSeoPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getContentBySlug(slug);

  if (!page) {
    notFound();
  }

  const relatedPages = await getRelatedPages(page.slug);

  return (
    <main>
      <Article page={page} relatedPages={relatedPages} />
      <CTASection />
    </main>
  );
}
