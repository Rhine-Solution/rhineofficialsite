import { useState, useEffect, useRef, ReactNode } from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
  count?: number;
}

export function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  count = 1,
}: SkeletonProps) {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse',
    none: '',
  };

  const defaultHeight = {
    text: '1em',
    circular: '40px',
    rectangular: '100px',
  };

  const style: React.CSSProperties = {
    width: width || '100%',
    height: height || defaultHeight[variant],
  };

  const skeletons = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={`bg-white/5 ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
      role="status"
      aria-label="Loading..."
    />
  ));

  return count === 1 ? skeletons[0] : <>{skeletons}</>;
}

interface SkeletonCardProps {
  lines?: number;
  showAvatar?: boolean;
  showImage?: boolean;
}

export function SkeletonCard({ lines = 3, showAvatar = true, showImage = false }: SkeletonCardProps) {
  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4">
      {showImage && <Skeleton variant="rectangular" height={150} className="w-full" />}
      {showAvatar && (
        <div className="flex items-center gap-3">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="space-y-2 flex-1">
            <Skeleton variant="text" width="60%" height={16} />
            <Skeleton variant="text" width="40%" height={12} />
          </div>
        </div>
      )}
      <div className="space-y-2">
        {Array.from({ length: lines }, (_, i) => (
          <Skeleton
            key={i}
            variant="text"
            width={i === lines - 1 ? '70%' : '100%'}
            height={14}
          />
        ))}
      </div>
      <div className="flex gap-2 pt-2">
        <Skeleton variant="rectangular" width={60} height={32} />
        <Skeleton variant="rectangular" width={80} height={32} />
      </div>
    </div>
  );
}

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export function SkeletonTable({ rows = 5, columns = 4 }: SkeletonTableProps) {
  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
      <div className="border-b border-white/10 p-4">
        <div className="flex gap-4">
          {Array.from({ length: columns }, (_, i) => (
            <Skeleton key={i} variant="text" className="flex-1" height={16} />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={rowIndex} className="border-b border-white/5 p-4 last:border-0">
          <div className="flex gap-4">
            {Array.from({ length: columns }, (_, i) => (
              <Skeleton key={i} variant="text" className="flex-1" height={14} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

interface SkeletonGridProps {
  count?: number;
  columns?: number;
}

export function SkeletonGrid({ count = 6, columns = 3 }: SkeletonGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${Math.min(columns, 3)} lg:grid-cols-${columns} gap-6`}>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

interface AsyncContentProps {
  isLoading: boolean;
  error?: Error | null;
  children: ReactNode;
  fallback?: ReactNode;
  onRetry?: () => void;
}

export function AsyncContent({
  isLoading,
  error,
  children,
  fallback,
  onRetry,
}: AsyncContentProps) {
  if (isLoading) {
    return fallback || <SkeletonGrid count={3} />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-red-400 mb-4">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-white/60 mb-4">Failed to load content</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return <>{children}</>;
}

export default Skeleton;
