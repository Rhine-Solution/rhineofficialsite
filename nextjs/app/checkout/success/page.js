'use client'

import { useSearchParams, Suspense } from 'next/navigation'
import Link from 'next/link'
import Button from '../../../components/ui/Button'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order') || 'N/A'

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="mb-8">
          <div className="text-8xl mb-6">🎉</div>
          <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-xl text-zinc-400">
            Thank you for your purchase. Your order has been received.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl mb-8 p-6">
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div>
              <p className="text-zinc-500 text-sm mb-1">Order ID</p>
              <p className="text-white font-semibold">#{orderId}</p>
            </div>
            <div>
              <p className="text-zinc-500 text-sm mb-1">Status</p>
              <p className="text-green-400 font-semibold">Processing</p>
            </div>
            <div>
              <p className="text-zinc-500 text-sm mb-1">Estimated Delivery</p>
              <p className="text-white">3-5 business days</p>
            </div>
            <div>
              <p className="text-zinc-500 text-sm mb-1">Confirmation</p>
              <p className="text-white">Email sent</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard">
            <Button size="lg">View My Orders</Button>
          </Link>
          <Link href="/shop">
            <Button variant="outline" size="lg">Continue Shopping</Button>
          </Link>
        </div>

        <div className="mt-12 p-6 bg-zinc-900/50 rounded-xl">
          <h3 className="font-semibold mb-2">What's next?</h3>
          <ul className="text-zinc-400 text-sm space-y-2 text-left">
            <li>📧 You'll receive a confirmation email shortly</li>
            <li>📦 Your order is being processed</li>
            <li>📬 We'll notify you when it ships</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen py-20 text-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}