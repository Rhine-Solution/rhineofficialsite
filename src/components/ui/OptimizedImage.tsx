import { useState, useEffect, useRef, memo } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  sizes?: string;
  srcSet?: string;
}

export function OptimizedImage({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3Crect fill="%23transparent"/%3E%3C/svg%3E',
  loading = 'lazy',
  onLoad,
  sizes,
  srcSet,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(loading === 'eager');
  const [currentSrc, setCurrentSrc] = useState(placeholder);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (loading === 'lazy' && imgRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              observerRef.current?.disconnect();
            }
          });
        },
        { rootMargin: '100px', threshold: 0 }
      );
      observerRef.current.observe(imgRef.current);

      return () => observerRef.current?.disconnect();
    }
    return undefined;
  }, [loading]);

  useEffect(() => {
    if (!isInView) return;

    const img = new Image();
    img.src = src;
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
      onLoad?.();
    };
    img.onerror = () => {
      console.warn(`Failed to load image: ${src}`);
    };
  }, [isInView, src, onLoad]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        loading={loading}
        sizes={sizes}
        srcSet={srcSet}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        decoding="async"
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-white/5 animate-pulse" />
      )}
    </div>
  );
}

export function BlurHashImage({
  src,
  alt,
  blurHash,
  className = '',
}: {
  src: string;
  alt: string;
  blurHash?: string;
  className?: string;
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={className}
      placeholder={blurHash || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3Crect fill="%23transparent"/%3E%3C/svg%3E'}
    />
  );
}

export default memo(OptimizedImage);
