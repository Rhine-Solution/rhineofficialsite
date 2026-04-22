'use client'

import { Loader2 } from 'lucide-react'

export default function PageLoader({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-zinc-800 rounded-full"></div>
        <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-indigo-500 animate-spin" />
      </div>
      <p className="mt-4 text-zinc-400 text-sm">{text}</p>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="aspect-video bg-zinc-800 animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-zinc-800 rounded w-1/3 animate-pulse" />
        <div className="h-5 bg-zinc-800 rounded w-2/3 animate-pulse" />
        <div className="h-4 bg-zinc-800 rounded w-full animate-pulse" />
        <div className="h-4 bg-zinc-800 rounded w-3/4 animate-pulse" />
        <div className="h-10 bg-zinc-800 rounded w-full mt-4 animate-pulse" />
      </div>
    </div>
  )
}

export function GridSkeleton({ count = 8 }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="space-y-3">
      <div className="flex gap-4 p-4 bg-zinc-800/50 rounded-lg">
        {[...Array(cols)].map((_, i) => (
          <div key={i} className="flex-1 h-4 bg-zinc-700 rounded animate-pulse" />
        ))}
      </div>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex gap-4 p-4 border border-zinc-800 rounded-lg">
          {[...Array(cols)].map((_, j) => (
            <div key={j} className="flex-1 h-4 bg-zinc-800 rounded animate-pulse" />
          ))}
        </div>
      ))}
    </div>
  )
}