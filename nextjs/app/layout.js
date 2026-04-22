import './globals.css'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { ToastProvider } from '../components/ui/Toast'
import { AuthProvider } from '../components/AuthProvider'
import { CartProvider } from '../components/CartProvider'
import { WishlistProvider } from '../components/WishlistProvider'
import { NotificationProvider } from '../components/NotificationProvider'
import { SearchProvider } from '../components/SearchContext'
import { ThemeProvider } from '../components/ThemeProvider'
import CartSidebar from '../components/CartSidebar'
import SearchModal from '../components/SearchModal'
import CommandPaletteWrapper from '../components/CommandPaletteWrapper'
import PageTransition from '../components/PageTransition'
import FloatingActionButton from '../components/FloatingActionButton'
import RecentlyViewedBar from '../components/RecentlyViewedBar'
import CookieConsent from '../components/CookieConsent'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { OrganizationSchema, WebsiteSchema } from '../components/JsonLd'

export const dynamic = 'force-dynamic'

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'Rhine Solution',
      url: 'https://rhinesolution.com',
      logo: 'https://rhinesolution.com/logo.png',
      description: 'Enterprise-grade web development and IT solutions provider.',
      sameAs: [
        'https://github.com/rhine-solution',
        'https://twitter.com/rhinesolution',
        'https://linkedin.com/company/rhine-solution'
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-555-123-4567',
        contactType: 'customer service',
        availableTime: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '18:00'
        }
      }
    },
    {
      '@type': 'WebSite',
      name: 'Rhine Solution',
      url: 'https://rhinesolution.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://rhinesolution.com/search?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@type': 'Product',
      name: 'Professional Subscription',
      description: 'Managed IT support with live chat, monthly audits, and guided implementation.',
      offers: {
        '@type': 'Offer',
        price: '99',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        billingDuration: 'P1M'
      }
    }
  ]
}

export const metadata = {
  metadataBase: new URL('https://rhinesolution.com'),
  title: {
    default: 'Rhine Solution - Enterprise Web Platform',
    template: '%s | Rhine Solution'
  },
  description: 'Enterprise-grade multi-service platform built with Next.js, Supabase, and Vercel. E-commerce, travel booking, portfolio, and more.',
  keywords: ['web development', 'e-commerce', 'travel booking', 'portfolio', 'Next.js', 'Supabase', 'enterprise'],
  authors: [{ name: 'Rhine Solution' }],
  creator: 'Rhine Solution',
  publisher: 'Rhine Solution',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://rhinesolution.com',
    siteName: 'Rhine Solution',
    title: 'Rhine Solution - Enterprise Web Platform',
    description: 'Enterprise-grade multi-service platform with e-commerce, travel booking, and portfolio features.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200',
        width: 1200,
        height: 630,
        alt: 'Rhine Solution - Enterprise Web Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rhine Solution',
    description: 'Enterprise-grade multi-service platform',
    images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200'],
    creator: '@rhinesolution',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        {/* Plausible Analytics - Replace with your domain */}
        <script defer data-domain="rhinesolution.com" src="https://plausible.io/js/script.js"></script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <ToastProvider>
              <CartProvider>
                <WishlistProvider>
                  <NotificationProvider>
                    <SearchProvider>
                      <Navbar />
                      <CartSidebar />
                      <SearchModal />
                      <CommandPaletteWrapper />
                      <FloatingActionButton />
                      <RecentlyViewedBar />
                      <CookieConsent />
                      <main className="min-h-screen pt-16">
                        <PageTransition>
                          {children}
                        </PageTransition>
                      </main>
                      <Footer />
                    </SearchProvider>
                  </NotificationProvider>
                </WishlistProvider>
              </CartProvider>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
        <OrganizationSchema />
        <WebsiteSchema />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}