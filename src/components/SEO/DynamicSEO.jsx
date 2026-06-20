// src/components/SEO/DynamicSEO.jsx
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';

export const DynamicSEO = ({ 
  title = "Easibill - WhatsApp Refill Reminders for Indian Pharmacies",
  description = "Easibill helps Indian pharmacies automate WhatsApp refill reminders, track due patients, and recover chronic-care revenue without replacing existing billing software.",
  keywords = "Pharmacy CRM India, WhatsApp refill reminders, pharmacy patient retention, chronic medicine refills, Easibill",
  imageUrl = "https://easibill.site/assets/easibill-preview.png"
}) => {
  const location = useLocation();
  const canonicalUrl = `https://easibill.site${location.pathname}`;
  const navigate = useNavigate();
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#f8faf8" />
      
      {/* OpenGraph Tags for Social Sharing */}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content="Easibill" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@easibill" />
      <meta name="twitter:creator" content="@easibill" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Structured Data - SoftwareApplication */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Easibill",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web, Android, iOS",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR",
            "availability": "https://schema.org/InStock"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "150",
            "bestRating": "5",
            "worstRating": "1"
          },
          "description": "WhatsApp refill reminder and pharmacy retention software for Indian pharmacies.",
          "softwareVersion": "2.0",
          "fileSize": "5MB",
          "downloadUrl": "https://easibill.site",
          "screenshot": "https://easibill.site/assets/easibill-screenshot.png",
          "releaseNotes": "https://easibill.site/release-notes"
        })}
      </script>
      
      {/* Structured Data - Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Easibill",
          "url": "https://easibill.site",
          "logo": "https://easibill.site/assets/easibill-logo.png",
          "sameAs": [
            "https://facebook.com/easibill",
            "https://twitter.com/easibill",
            "https://linkedin.com/company/easibill",
            "https://instagram.com/easibill"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-800-123-4567",
            "contactType": "customer service",
            "availableLanguage": ["English", "Hindi"]
          }
        })}
      </script>
    </Helmet>
  );
};

// src/components/SEO/RichSnippets.jsx
export const RichSnippets = ({ reviews, faq }) => {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": "Easibill",
          "review": reviews.map(review => ({
            "@type": "Review",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": review.rating,
              "bestRating": "5"
            },
            "author": {
              "@type": "Person",
              "name": review.author
            },
            "reviewBody": review.content,
            "datePublished": review.date
          })),
          "faqPage": {
            "@type": "FAQPage",
            "mainEntity": faq.map(item => ({
              "@type": "Question",
              "name": item.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
              }
            }))
          }
        })}
      </script>
    </Helmet>
  );
};

// src/components/Layout/SeoFooter.jsx
import React from 'react';


export const SeoFooter = () => {
  const navigate = useNavigate();

  const linkClasses = "cursor-pointer text-white hover:text-blue-400 transition-colors";

  return (
    <footer className="bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Billing Software Features */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Billing Software Features</h3>
            <ul className="space-y-2">
              <li>
                <a onClick={() => navigate('/features')} className={linkClasses}>
                  GST Billing
                </a>
              </li>
              <li>
                <a onClick={() => navigate('/features')} className={linkClasses}>
                  Inventory Management
                </a>
              </li>
              <li>
                <a onClick={() => navigate('/features')} className={linkClasses}>
                  Business Reports
                </a>
              </li>
              <li>
                <a onClick={() => navigate('/features')} className={linkClasses}>
                  Quick Invoicing
                </a>
              </li>
              <li>
                <a onClick={() => navigate('/features')} className={linkClasses}>
                  Fast Invoicing Software
                </a>
              </li>
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Industries</h3>
            <ul className="space-y-2">
              <li>
                <a onClick={() => navigate('/industries')} className={linkClasses}>
                  Retail Stores
                </a>
              </li>
              <li>
                <a onClick={() => navigate('/industries')} className={linkClasses}>
                  Wholesale Business
                </a>
              </li>
              <li>
                <a onClick={() => navigate('/industries')} className={linkClasses}>
                  Restaurants
                </a>
              </li>
              <li>
                <a onClick={() => navigate('/industries')} className={linkClasses}>
                  Service Providers
                </a>
              </li>
              <li>
                <a onClick={() => navigate('/industries')} className={linkClasses}>
                  Local Shop Billing
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a onClick={() => navigate('/blog')} className={linkClasses}>
                  Blog
                </a>
              </li>
              <li>
                <a onClick={() => navigate('/guides')} className={linkClasses}>
                  User Guides
                </a>
              </li>
              <li>
                <a onClick={() => navigate('/tutorials')} className={linkClasses}>
                  Video Tutorials
                </a>
              </li>
              <li>
                <a onClick={() => navigate('/case-studies')} className={linkClasses}>
                  Case Studies
                </a>
              </li>
              <li>
                <a href="https://billing-software-guide.com" target="_blank" rel="noopener noreferrer" className={linkClasses}>
                  Billing Software Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Contact & Support</h3>
            <ul className="space-y-2">
              <li>
                <a onClick={() => navigate('/contact')} className={linkClasses}>
                  Contact Us
                </a>
              </li>
              <li>
                <a onClick={() => navigate('/support')} className={linkClasses}>
                  Customer Support
                </a>
              </li>
              <li>
                <a onClick={() => navigate('/lead')} className={linkClasses}>
                  Request Demo
                </a>
              </li>
              <li>
                <a onClick={() => navigate('/lead')} className={linkClasses}>
                  Get Started
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-sm text-gray-400">
            Easibill is India's leading billing software for small businesses, retailers, and entrepreneurs. Our easy-to-use billing service helps you create professional invoices, manage inventory, and grow your business. Experience fast invoicing and streamlined local shop billing with Easibill today.
          </p>
          <p className="mt-4 text-sm text-gray-400">
            © {new Date().getFullYear()} Easibill - Best Billing Service & Simple Billing Software. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

