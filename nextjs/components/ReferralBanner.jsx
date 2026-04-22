'use client'

import { useState, useEffect } from 'react'
import { Link } from 'next/navigation'
import { Gift, Copy, Check, X } from 'lucide-react'

const REFERRAL_CODE_KEY = 'rhine_referral_code'
const REFERRED_BY_KEY = 'rhine_referred_by'

function generateCode() {
  return 'RH' + Math.random().toString(36).substring(2, 8).toUpperCase()
}

export function getReferralCode() {
  if (typeof window === 'undefined') return null
  let code = localStorage.getItem(REFERRAL_CODE_KEY)
  if (!code) {
    code = generateCode()
    localStorage.setItem(REFERRAL_CODE_KEY, code)
  }
  return code
}

export function getReferredBy() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(REFERRED_BY_KEY)
}

export function setReferredBy(code) {
  if (typeof window === 'undefined') return
  localStorage.setItem(REFERRED_BY_KEY, code)
}

export default function ReferralBanner({ referralCode }) {
  const [copied, setCopied] = useState(false)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const code = getReferralCode()
    if (code && !getReferredBy()) {
      setShowBanner(true)
    }
  }, [])

  const copyReferralLink = async () => {
    const code = getReferralCode()
    const url = `${window.location.origin}?ref=${code}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!showBanner || referralCode) return null

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-sm bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-indigo-500/30 p-4">
      <button
        onClick={() => setShowBanner(false)}
        className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-600"
      >
        <X className="w-4 h-4" />
      </button>
      
      <div className="flex items-start gap-3">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
          <Gift className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
            Invite friends, earn rewards!
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Share your referral link and get benefits when they subscribe.
          </p>
          
          <div className="flex items-center gap-2 mt-3">
            <code className="flex-1 px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-xs font-mono">
              {getReferralCode()}
            </code>
            <button
              onClick={copyReferralLink}
              className="p-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}