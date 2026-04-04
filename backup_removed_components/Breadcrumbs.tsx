import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

function formatSegment(seg: string) {
  try {
    const decoded = decodeURIComponent(seg);
    return decoded
      .replace(/[-_]+/g, ' ')
      .split(' ')
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ');
  } catch (e) {
    return seg;
  }
}

export default function Breadcrumbs(): JSX.Element | null {
  const { pathname } = useLocation();

  const crumbs = useMemo(() => {
    const parts = pathname.split('/').filter(Boolean);
    const paths = parts.map((part, idx) => ({
      name: formatSegment(part),
      path: '/' + parts.slice(0, idx + 1).join('/'),
    }));
    return [{ name: 'Home', path: '/' }, ...paths];
  }, [pathname]);

  if (!crumbs || crumbs.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="w-full bg-transparent">
      <div className="container mx-auto px-6 py-3">
        <ol className="flex items-center gap-2 text-sm text-white/70">
          {crumbs.map((crumb, i) => (
            <li key={crumb.path} className="flex items-center">
              {i > 0 && <span className="mx-2 text-white/30">/</span>}
              {i === crumbs.length - 1 ? (
                <span className="font-medium text-white">{crumb.name}</span>
              ) : (
                <Link to={crumb.path} className="hover:underline text-white/80">
                  {crumb.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
