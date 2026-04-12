import React from 'react';

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Rhine Solution',
  url: 'https://rhinesolution.com',
  logo: 'https://rhinesolution.com/icon.svg',
  description: 'Building innovative digital solutions that transform businesses with cutting-edge web technologies including WebGPU, AI, Cloud, and Cybersecurity.',
  foundingDate: '2024',
  areaServed: 'Worldwide',
  serviceType: ['Web Development', 'Cloud Infrastructure', 'AI Automation', 'Cybersecurity'],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-555-123-4567',
    contactType: 'customer service',
    availableTime: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  },
  sameAs: [
    'https://github.com/Rhine-Solution',
    'https://x.com/RhineSolution',
    'https://discord.gg/WEwGppRN8K',
  ],
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Rhine Solution',
  url: 'https://rhinesolution.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://rhinesolution.com/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Rhine Solution',
  image: 'https://rhinesolution.com/icon.svg',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'US',
  },
  priceRange: '$$',
};

export const productSchema = (name: string, description: string, price?: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name,
  description,
  brand: {
    '@type': 'Brand',
    name: 'Rhine Solution',
  },
  offers: {
    '@type': 'Offer',
    priceCurrency: 'USD',
    price: price || 'Contact for pricing',
    availability: 'https://schema.org/InStock',
  },
});

export const articleSchema = (title: string, description: string, date: string, author: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: title,
  description,
  datePublished: date,
  author: {
    '@type': 'Person',
    name: author,
  },
  publisher: {
    '@type': 'Organization',
    name: 'Rhine Solution',
    logo: {
      '@type': 'ImageObject',
      url: 'https://rhinesolution.com/icon.svg',
    },
  },
});

export const serviceSchema = (name: string, description: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name,
  description,
  provider: {
    '@type': 'Organization',
    name: 'Rhine Solution',
  },
  areaOfServed: 'Worldwide',
  serviceType: name,
});

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});