'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function OptimizedImage({ 
  src, 
  alt, 
  className = '', 
  width, 
  height, 
  priority = false,
  sizes,
  fill = false
}) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  const handleLoad = () => setLoaded(true)
  const handleError = () => setError(true)

  const aspectRatio = width && height ? width / height : undefined

  if (fill) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {!loaded && !error && (
          <div className="absolute inset-0 bg-zinc-800 animate-pulse" />
        )}
        {error ? (
          <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
            <span className="text-4xl">🖼️</span>
          </div>
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes || '100vw'}
            priority={priority}
            onLoad={handleLoad}
            onError={handleError}
            className={`object-cover transition-opacity duration-300 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundColor: '#1a1a1a'
            }}
          />
        )}
      </div>
    )
  }

  return (
    <div 
      className={`relative overflow-hidden ${className}`} 
      style={{ 
        aspectRatio: aspectRatio,
        backgroundColor: '#1a1a1a'
      }}
    >
      {!loaded && !error && (
        <div className="absolute inset-0 bg-zinc-800 animate-pulse" />
      )}
      {error ? (
        <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
          <span className="text-4xl">🖼️</span>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
          priority={priority}
          onLoad={handleLoad}
          onError={handleError}
          className={`object-cover transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundColor: '#1a1a1a'
          }}
        />
      )}
    </div>
  )
}