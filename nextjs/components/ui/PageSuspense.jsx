'use client'

import { Suspense } from 'react'
import { CardSkeleton } from './PageLoader'

export default function PageSuspense({ 
  children, 
  fallback = null,
  skeletonCount = 4,
  showSkeleton = true 
}) {
  const defaultFallback = showSkeleton ? (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(skeletonCount)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  ) : null

  return (
    <Suspense fallback={defaultFallback}>
      {children}
    </Suspense>
  )
}