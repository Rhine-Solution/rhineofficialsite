import './globals.css'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { ToastProvider } from '../components/ui/Toast'
import { AuthProvider } from '../components/AuthProvider'
import { CartProvider } from '../components/CartProvider'
import { WishlistProvider } from '../components/WishlistProvider'
import { NotificationProvider } from '../components/NotificationProvider'
import { SearchProvider } from '../components/SearchContext'
import CartSidebar from '../components/CartSidebar'
import SearchModal from '../components/SearchModal'
import { Analytics } from '@vercel/analytics/next'

export const dynamic = 'force-dynamic'

export const metadata = {
  metadataBase: new URL('https://rhinesolution.com'),
  title: {
    default: 'Rhine Solution - Enterprise Web Platform',
    template: '%s | Rhine Solution'
  },
  description: 'Enterprise-grade multi-service platform built with Next.js, Supabase, and Cloudflare. E-commerce, travel booking, portfolio, and more.',
  keywords: ['web development', 'e-commerce', 'travel booking', 'portfolio', 'Next.js', 'Supabase', 'enterprise'],
  authors: [{ name: 'Rhine Solution' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://rhinesolution.com',
    siteName: 'Rhine Solution',
    title: 'Rhine Solution - Enterprise Web Platform',
    description: 'Enterprise-grade multi-service platform with e-commerce, travel booking, and portfolio features.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rhine Solution',
    description: 'Enterprise-grade multi-service platform',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="bg-zinc-950 text-zinc-100 antialiased">
        <AuthProvider>
          <ToastProvider>
            <CartProvider>
              <WishlistProvider>
                <NotificationProvider>
                  <SearchProvider>
                    <Navbar />
                    <CartSidebar />
                    <SearchModal />
                    <main className="min-h-screen pt-16">
                      {children}
                    </main>
                    <Footer />
                  </SearchProvider>
                </NotificationProvider>
              </WishlistProvider>
            </CartProvider>
          </ToastProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}