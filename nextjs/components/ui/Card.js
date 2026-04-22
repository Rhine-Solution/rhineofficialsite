'use client'

import { useState } from 'react'

export default function Card({ children, className = '', hover = true, ...props }) {
  const baseStyles = 'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden'
  const hoverStyles = hover ? 'transition-all duration-300 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10' : ''
  
  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardImage({ src, alt, className = '', priority = false }) {
  const [imgError, setImgError] = useState(false)
  const [loaded, setLoaded] = useState(false)
  
  const getPlaceholder = () => {
    const key = alt?.toLowerCase() || ''
    if (key.includes('hosting') || key.includes('server')) return '🖥️'
    if (key.includes('domain') || key.includes('globe')) return '🌐'
    if (key.includes('ssl') || key.includes('security') || key.includes('lock')) return '🔒'
    if (key.includes('cloud') || key.includes('backup') || key.includes('storage')) return '☁️'
    if (key.includes('email') || key.includes('mail')) return '📧'
    if (key.includes('seo')) return '📈'
    return '📦'
  }

  return (
    <div className={`aspect-video bg-gray-100 dark:bg-zinc-800 flex items-center justify-center ${className}`}>
      {src && !imgError ? (
        <img 
          src={src} 
          alt={alt} 
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setImgError(true)}
          onLoad={() => setLoaded(true)}
        />
      ) : (
        <span className="text-4xl">{getPlaceholder()}</span>
      )}
    </div>
  )
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`p-5 ${className}`}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 dark:text-white ${className}`}>
      {children}
    </h3>
  )
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-sm text-gray-600 dark:text-zinc-400 mt-1 ${className}`}>
      {children}
    </p>
  )
}

export function CardPrice({ children, className = '' }) {
  return (
    <div className={`text-xl font-bold text-cyan-600 dark:text-cyan-400 mt-3 ${className}`}>
      {children}
    </div>
  )
}