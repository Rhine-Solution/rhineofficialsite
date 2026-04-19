import './globals.css'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { ToastProvider } from '../components/ui/Toast'
import { AuthProvider } from '../components/AuthProvider'
import { CartProvider } from '../components/CartProvider'
import CartSidebar from '../components/CartSidebar'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Rhine Solution - Enterprise Web Platform',
  description: 'Multi-service enterprise platform built with Next.js, Supabase, and Cloudflare',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 antialiased">
        <AuthProvider>
          <ToastProvider>
            <CartProvider>
              <Navbar />
              <CartSidebar />
              <main className="min-h-screen pt-16">
                {children}
              </main>
              <Footer />
            </CartProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}