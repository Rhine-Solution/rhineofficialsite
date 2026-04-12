import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
  separator?: React.ReactNode;
}

export function Breadcrumbs({
  items,
  className = '',
  separator = <ChevronRight className="w-4 h-4 text-white/30" />,
}: BreadcrumbsProps) {
  const location = useLocation();
  
  const defaultItems: BreadcrumbItem[] = React.useMemo(() => {
    const paths = location.pathname.split('/').filter(Boolean);
    
    if (paths.length === 0) return [];
    
    const crumbs: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];
    
    let currentPath = '';
    paths.forEach((path) => {
      currentPath += `/${path}`;
      const label = path
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
      crumbs.push({
        label,
        href: currentPath,
      });
    });
    
    return crumbs;
  }, [location.pathname]);

  const breadcrumbItems = items || defaultItems;

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-1 text-sm ${className}`}>
      <ol className="flex items-center gap-1 list-none">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          
          return (
            <li key={item.href || index} className="flex items-center">
              {index === 0 ? (
                <Link
                  to={item.href || '/'}
                  className="flex items-center text-white/50 hover:text-white transition-colors"
                  aria-label="Home"
                >
                  <Home className="w-4 h-4" />
                </Link>
              ) : isLast ? (
                <span className="text-white/80 font-medium" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href || '#'}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              )}
              
              {!isLast && (
                <span className="mx-1 text-white/30" aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}