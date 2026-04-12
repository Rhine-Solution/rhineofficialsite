import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface PrefetchOptions {
  priority?: 'high' | 'low';
  timeout?: number;
}

export function usePrefetch(options: PrefetchOptions = {}) {
  const { priority = 'low', timeout = 3000 } = options;
  const navigate = useNavigate();
  const prefetchedUrls = useRef<Set<string>>(new Set());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const prefetch = useCallback((url: string) => {
    if (prefetchedUrls.current.has(url)) return;
    if (typeof window === 'undefined') return;

    const link = document.createElement('link');
    link.rel = priority === 'high' ? 'preload' : 'prefetch';
    link.href = url;
    link.as = 'document';
    
    link.onload = () => {
      prefetchedUrls.current.add(url);
    };
    
    link.onerror = () => {
      console.warn(`Prefetch failed for: ${url}`);
    };

    document.head.appendChild(link);

    if (priority === 'low') {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        link.remove();
      }, timeout);
    }
  }, [priority, timeout]);

  const prefetchOnHover = useCallback((url: string) => {
    return {
      onMouseEnter: () => prefetch(url),
      onTouchStart: () => prefetch(url),
    };
  }, [prefetch]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { prefetch, prefetchOnHover, navigate };
}

export function LinkPrefetch({ to, children, className, onClick, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  const { prefetch, prefetchOnHover } = usePrefetch();
  
  return (
    <a
      href={to}
      onClick={onClick}
      onMouseEnter={() => prefetch(to)}
      onTouchStart={() => prefetch(to)}
      className={className}
      {...props}
    >
      {children}
    </a>
  );
}

export default usePrefetch;
