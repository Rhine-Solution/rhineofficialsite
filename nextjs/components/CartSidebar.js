'use client'

import Link from 'next/link'
import { useCart } from './CartProvider'
import Button from './ui/Button'

export default function CartSidebar() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, cartTotal, cartCount, clearCart } = useCart()

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-zinc-900 border-l border-gray-200 dark:border-zinc-800 z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Cart</h2>
            <span className="px-2 py-1 bg-indigo-600 text-white text-xs rounded-full">
              {cartCount} items
            </span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400 dark:text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Your cart is empty</h3>
              <p className="text-gray-500 dark:text-zinc-400 text-sm mb-6">Looks like you haven't added any items to your cart yet.</p>
              <div className="space-y-3">
                <Link 
                  href="/shop"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-500 transition-colors"
                >
                  Browse Shop
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link 
                  href="/travel"
                  onClick={() => setIsOpen(false)}
                  className="block text-center text-sm text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Or book a trip →
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div 
                  key={item.id}
                  className="flex gap-4 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg"
                >
                  <div className="w-20 h-20 bg-gray-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-2xl">
                    📦
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">{item.name}</h3>
                    <p className="text-indigo-400 font-semibold">${item.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 bg-gray-200 dark:bg-zinc-700 rounded flex items-center justify-center text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-zinc-600"
                      >
                        -
                      </button>
                      <span className="text-gray-900 dark:text-white w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 bg-gray-200 dark:bg-zinc-700 rounded flex items-center justify-center text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-zinc-600"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gray-200 dark:border-zinc-800 space-y-4">
            <div className="flex justify-between text-lg font-semibold">
              <span className="text-gray-500 dark:text-zinc-400">Total</span>
              <span className="text-gray-900 dark:text-white">${cartTotal.toFixed(2)}</span>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
              <Link 
                href="/checkout"
                className="flex-1"
                onClick={() => setIsOpen(false)}
              >
                <Button className="w-full">Checkout</Button>
              </Link>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="w-full text-center text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white text-sm"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}