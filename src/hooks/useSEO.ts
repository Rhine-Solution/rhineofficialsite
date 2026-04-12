import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOConfig {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
}

const defaultSEO: SEOConfig = {
  title: '',
  description: 'Rhine Solution - Building innovative digital solutions with WebGPU, AI, Cloud & Enterprise Software',
  image: '/icon.svg',
  type: 'website',
};

const pageSEO: Record<string, SEOConfig> = {
  '/': {
    title: 'Next-Generation Digital Solutions',
    description: 'Rhine Solution - Innovative digital solutions with WebGPU 3D, AI, Cloud & Enterprise Software. Transform your business with cutting-edge technology.',
  },
  '/about': {
    title: 'About Us',
    description: 'Learn about Rhine Solution - our team, values, and mission to deliver innovative digital solutions worldwide.',
  },
  '/portfolio': {
    title: 'Our Portfolio',
    description: 'Explore our latest projects and case studies showcasing web development, cloud infrastructure, and AI solutions.',
  },
  '/services': {
    title: 'Services',
    description: 'Professional services including web development, cloud infrastructure, IT consulting, and digital transformation.',
  },
  '/solutions': {
    title: 'Solutions',
    description: 'Enterprise software, AI automation, cybersecurity, and data analytics solutions for your business.',
  },
  '/technology': {
    title: 'Technology',
    description: 'Cutting-edge technologies including WebGPU 3D, Blockchain/Web3, IoT, and custom API development.',
  },
  '/resources': {
    title: 'Resources',
    description: 'Case studies, documentation, blog insights, and community resources from Rhine Solution.',
  },
  '/contact': {
    title: 'Contact Us',
    description: 'Get in touch with Rhine Solution for your digital transformation needs. We\'re ready to help!',
  },
};

export function useSEO() {
  const location = useLocation();
  const [seo, setSeo] = useState<SEOConfig>(defaultSEO);

  useEffect(() => {
    const path = location.pathname;
    const exactMatch = pageSEO[path];
    
    if (exactMatch) {
      setSeo(exactMatch);
      return;
    }

    const partialMatch = Object.keys(pageSEO).find((key) => 
      path.startsWith(key) && key !== '/'
    );
    
    if (partialMatch) {
      setSeo(pageSEO[partialMatch]);
    } else {
      setSeo(defaultSEO);
    }
  }, [location.pathname]);

  return seo;
}

export function getPageSEO(pathname: string): SEOConfig {
  const exactMatch = pageSEO[pathname];
  if (exactMatch) return exactMatch;

  const partialMatch = Object.keys(pageSEO).find((key) => 
    pathname.startsWith(key) && key !== '/'
  );

  return partialMatch ? pageSEO[partialMatch] : defaultSEO;
}

export function generateBreadcrumbs(pathname: string): { name: string; url: string }[] {
  if (pathname === '/') return [];

  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs: { name: string; url: string }[] = [
    { name: 'Home', url: '/' },
  ];

  let currentPath = '';
  paths.forEach((segment) => {
    currentPath += `/${segment}`;
    const name = segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
    breadcrumbs.push({ name, url: currentPath });
  });

  return breadcrumbs;
}

export default useSEO;