'use client';

import Script from 'next/script';

export default function JsonLd({ data }) {
  return (
    <Script
      id="json-ld"
      type="application/ld+json"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Rhine Solution",
    "url": "https://rhinesolution.com",
    "logo": "https://rhinesolution.com/logo.png",
    "description": "Enterprise-grade multi-service platform built with modern web technologies. E-commerce, travel booking, portfolio, and more.",
    "sameAs": [
      "https://github.com/rhine-solution",
      "https://twitter.com/rhinesolution",
      "https://linkedin.com/company/rhine-solution"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-123-4567",
      "contactType": "customer service",
      "availableTime": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      }
    }
  };

  return <JsonLd data={schema} />;
}

export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Rhine Solution",
    "url": "https://rhinesolution.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://rhinesolution.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return <JsonLd data={schema} />;
}

export function ProductSchema({ name, description, price, currency = "USD" }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description,
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": currency,
      "availability": "https://schema.org/InStock"
    },
    "brand": {
      "@type": "Brand",
      "name": "Rhine Solution"
    }
  };

  return <JsonLd data={schema} />;
}

export function FAQSchema({ faqs }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return <JsonLd data={schema} />;
}

export function BlogPostSchema({ title, description, date, author, image, url }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "image": image,
    "datePublished": date,
    "author": {
      "@type": "Person",
      "name": author || "Rhine Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Rhine Solution",
      "logo": {
        "@type": "ImageObject",
        "url": "https://rhinesolution.com/logo.png"
      }
    },
    "url": url
  };

  return <JsonLd data={schema} />;
}

export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Rhine Solution",
    "image": "https://rhinesolution.com/logo.png",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "priceRange": "$$",
    "telephone": "+1-555-123-4567",
    "email": "contact@rhinesolution.com",
    "url": "https://rhinesolution.com"
  };

  return <JsonLd data={schema} />;
}