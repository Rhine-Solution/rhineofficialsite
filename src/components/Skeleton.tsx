import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'wave',
}: SkeletonProps) {
  const baseClasses = 'bg-white/10';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'skeleton-wave',
    none: '',
  };

  const style: React.CSSProperties = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1em' : '100%'),
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-4 space-y-3">
      <Skeleton height={200} variant="rectangular" />
      <Skeleton width="70%" height={24} variant="text" />
      <Skeleton width="100%" height={16} variant="text" />
      <Skeleton width="80%" height={16} variant="text" />
      <div className="flex gap-2 pt-2">
        <Skeleton width={60} height={28} variant="rectangular" />
        <Skeleton width={60} height={28} variant="rectangular" />
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 ? '60%' : '100%'}
          height={16}
          variant="text"
        />
      ))}
    </div>
  );
}

export function SkeletonButton() {
  return (
    <div className="flex gap-3">
      <Skeleton width={100} height={40} variant="rectangular" />
      <Skeleton width={100} height={40} variant="rectangular" />
    </div>
  );
}

export function SkeletonAvatar() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton width={48} height={48} variant="circular" />
      <div className="space-y-2">
        <Skeleton width={120} height={16} variant="text" />
        <Skeleton width={80} height={14} variant="text" />
      </div>
    </div>
  );
}

export function SkeletonSection() {
  return (
    <div className="space-y-6">
      <Skeleton width={200} height={32} variant="text" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}

export default Skeleton;