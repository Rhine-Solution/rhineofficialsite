'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Button from '../../components/ui/Button'

export default function CheckoutError({ error, reset }) {
  useEffect(() => {
    console.error('[Checkout Error]', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-3">
          Payment System Unavailable
        </h1>
        
        <p className="text-zinc-400 mb-8">
          We're having trouble loading our payment system. Please refresh the page or try again later.
        </p>

        <div className="space-y-3">
          <Button 
            onClick={() => reset()}
            className="w-full py-4"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Try Again
          </Button>
          
          <Link href="/shop" className="block">
            <Button 
              variant="outline"
              className="w-full py-4"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Shop
            </Button>
          </Link>
        </div>

        <p className="text-sm text-zinc-500 mt-6">
          If the problem persists, please <Link href="/contact" className="text-indigo-400 hover:underline">contact support</Link>.
        </p>
      </div>
    </div>
  )
}