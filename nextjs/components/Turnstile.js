'use client'

import { useEffect, useRef, useState } from 'react'

export default function Turnstile({ onVerify, action = 'homepage' }) {
  const containerRef = useRef(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Load Turnstile script
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src*="turnstile"]')
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [])

  useEffect(() => {
    if (!mounted || !containerRef.current) return

    // Render Turnstile when container is ready
    const renderWidget = () => {
      if (window.turnstile && containerRef.current) {
        // Clear any existing widget
        containerRef.current.innerHTML = ''
        
        window.turnstile.render(containerRef.current, {
          sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAAC0dqZ7Ghagz7QaS',
          action: action,
          callback: (token) => {
            if (onVerify) onVerify(token)
          },
          'expired-callback': () => {
            // Token expired, user needs to verify again
            if (onVerify) onVerify(null)
          },
        })
      }
    }

    // Wait for script to load
    if (window.turnstile) {
      renderWidget()
    } else {
      const checkTurnstile = setInterval(() => {
        if (window.turnstile) {
          renderWidget()
          clearInterval(checkTurnstile)
        }
      }, 100)
    }
  }, [mounted, action, onVerify])

  return (
    <div 
      ref={containerRef} 
      className="cf-turnstile"
      style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}
    />
  )
}