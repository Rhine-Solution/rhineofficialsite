'use client'

import { useEffect } from 'react'

const OPENREPLAY_PROJECT_KEY = process.env.NEXT_PUBLIC_OPENREPLAY_KEY

export function OpenReplayProvider({ children }) {
  useEffect(() => {
    if (!OPENREPLAY_PROJECT_KEY) return

    const initOpenReplay = async () => {
      const { default: Tracker } = await import('@openreplay/tracker')
      
      const tracker = new Tracker({
        projectID: OPENREPLAY_PROJECT_KEY,
        defaultInputMode: 0,
        obscureTextNumbers: true,
        obscureTextEmails: true,
      })

      tracker.start()
    }

    initOpenReplay()
  }, [])

  return children
}