'use client'

import { useEffect } from 'react'

const isDev = process.env.NODE_ENV === 'development'

export function AccessibilityChecker({ children }) {
  useEffect(() => {
    if (!isDev) return

    const initAxe = async () => {
      try {
        const axe = await import('@axe-core/react')
        const React = require('react')
        
        if (window.__AXE__) return
        
        axe.default(React, {
          runOnly: {
            values: ['wcag2a', 'wcag2aa', 'wcag21aa'],
          },
          resultLogger: (result) => {
            if (result.violations.length > 0) {
              console.group('🔍 Accessibility Issues Found')
              console.warn(`Found ${result.violations.length} accessibility violation(s) on ${result.url}`)
              result.violations.forEach((violation) => {
                console.warn(`- ${violation.id}: ${violation.description} (${violation.nodes.length} nodes)`)
              })
              console.groupEnd()
            }
          },
        })
        
        window.__AXE__ = true
        console.log('🔍 Accessibility checker initialized (dev mode only)')
      } catch (err) {
        console.warn('Accessibility checker not available:', err.message)
      }
    }

    initAxe()
  }, [])

  return children
}

export default AccessibilityChecker