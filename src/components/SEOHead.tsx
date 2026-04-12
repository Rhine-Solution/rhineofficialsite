import React from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article' | 'product' | 'service';
  publishedTime?: string;
  author?: string;
  noindex?: boolean;
}

const defaultDescription = 'Rhine Solution - Building innovative digital solutions that transform businesses with cutting-edge web technologies including WebGPU, AI, Cloud, and Cybersecurity';
const defaultImage = 'https://rhinesolution.com/icon.svg';
const siteName = 'Rhine Solution';

export default function SEOHead({
  title,
  description = defaultDescription,
  image = defaultImage,
  type = 'website',
  publishedTime,
  author,
  noindex = false,
}: SEOHeadProps) {
  const location = useLocation();
  const canonicalUrl = `https://rhinesolution.com${location.pathname}`;
  const fullTitle = title ? `${title} | ${siteName}` : siteName;

  return (
    <>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="author" content="Rhine Solution" />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="en_US" />

      {/* Article specific */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image } />
      <meta name="twitter:site" content="@RhineSolution" />

      {/* Additional SEO */}
      <meta name="theme-color" content="#0082D8" />
      <meta name="format-detection" content="telephone=no" />

      {/* Dublin Core */}
      <meta name="DC.title" content={fullTitle} />
      <meta name="DC.description" content={description} />
    </>
  );
}

export function useBreadcrumb(pathname: string) {
  const pathSegments = pathname.split('/').filter(Boolean);
  
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    ...pathSegments.map((segment, index) => {
      const url = '/' + pathSegments.slice(0, index + 1).join('/');
      const name = segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
      return { name, url };
    }),
  ];

  return breadcrumbs;
}