'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import Card, { CardImage, CardContent, CardTitle, CardDescription, CardPrice } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Turnstile from '../components/Turnstile'
import FadeInSection from '../components/ui/FadeInSection'
import TrustBar from '../components/TrustBar'

const features = [
  { icon: '🛒', title: 'E-commerce', description: 'Full online store with cart and checkout', href: '/shop', color: 'from-pink-500 to-rose-500' },
  { icon: '✈️', title: 'Travel Booking', description: 'Discover and book amazing destinations', href: '/travel', color: 'from-cyan-500 to-blue-500' },
  { icon: '💼', title: 'Portfolio', description: 'Showcase your projects and work', href: '/portfolio', color: 'from-indigo-500 to-purple-500' },
  { icon: '📊', title: 'Dashboard', description: 'Manage your account and orders', href: '/dashboard', color: 'from-amber-500 to-orange-500' },
]

const techStack = [
  'Next.js', 'React', 'TypeScript', 'Tailwind CSS', 
  'Supabase', 'Cloudflare', 'PostgreSQL', 'GitHub Actions'
]

const fallbackProducts = [
  { id: 1, name: 'Premium Web Hosting', description: 'High-performance hosting for your applications', price: 29, image_url: null },
  { id: 2, name: 'Domain Registration', description: 'Secure your perfect domain name', price: 12, image_url: null },
  { id: 3, name: 'SSL Certificate', description: 'Enterprise-grade security for your site', price: 49, image_url: null },
  { id: 4, name: 'Cloud Backup', description: 'Automated backups for peace of mind', price: 19, image_url: null },
]

export default function Home() {
  const [products, setProducts] = useState(fallbackProducts)
  const [loaded, setLoaded] = useState(false)
  const [showVerify, setShowVerify] = useState(false)
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    setLoaded(true)
    
    // Check if already verified (cookie set for 24 hours)
    const isVerified = document.cookie
      .split('; ')
      .find(row => row.startsWith('turnstile_verified='))
    
    if (!isVerified) {
      // Show verification after 2 seconds if not verified
      const timer = setTimeout(() => {
        setShowVerify(true)
      }, 2000)
      return () => clearTimeout(timer)
    } else {
      setVerified(true)
    }
  }, [])

  const handleVerify = (token) => {
    if (token) {
      setVerified(true)
      setShowVerify(false)
      // Set cookie for 24 hours
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString()
      document.cookie = `turnstile_verified=true; expires=${expires}; path=/; SameSite=Strict`
    }
  }

  return (
    <>
      {/* Turnstile Verification Modal */}
      {showVerify && !verified && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-xl border border-indigo-500/30 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-4">
              Verify you're human
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
              Please complete the verification below to continue.
            </p>
            <Turnstile onVerify={handleVerify} action="homepage" />
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm mb-6 ${loaded ? 'animate-fade-in' : 'opacity-0'}`}>
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
              Enterprise-Grade Platform
            </div>
            
            <FadeInSection delay={0}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-gray-900 dark:text-white">Welcome to </span>
              <span className="gradient-text dark:text-white">Rhine</span>
            </h1>
          </FadeInSection>
            
            <FadeInSection delay={0.1}>
              <p className="text-xl text-gray-500 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
                Enterprise-grade multi-service platform built with modern web technologies. 
                E-commerce, travel booking, portfolio, and more.
              </p>
            </FadeInSection>
            
            <FadeInSection delay={0.2}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/shop">
                  <Button size="lg" className="glow-primary hover-lift">Browse Shop</Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg">Get In Touch</Button>
                </Link>
              </div>
            </FadeInSection>
          </div>

          {/* Tech Stack */}
          <div className={`mt-20 text-center ${loaded ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
            <p className="text-sm text-gray-500 dark:text-zinc-500 mb-6">Built with modern technologies</p>
            <div className="flex flex-wrap justify-center gap-3">
              {techStack.map((tech, i) => (
                <span 
                  key={tech} 
                  className="px-4 py-2 bg-white dark:bg-zinc-900/80 border border-gray-200 dark:border-zinc-800 rounded-full text-sm text-gray-600 dark:text-zinc-400 hover:border-gray-300 dark:hover:border-zinc-700 hover:text-gray-900 dark:hover:text-white transition-all hover-lift"
                  style={{ animationDelay: `${0.4 + i * 0.05}s` }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <TrustBar />

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">Our Services</h2>
          <p className="text-gray-500 dark:text-zinc-400 text-center mb-12 max-w-xl mx-auto">
            Everything you need to build, launch, and grow your business online
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FadeInSection key={index} delay={index * 0.1}>
                <Link href={feature.href}>
                  <Card className="h-full group card-animate hover-lift">
                    <div className={`h-1 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                    <CardContent className="text-center p-6">
                      <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                      <CardTitle className="group-hover:text-indigo-400 transition-colors">{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Products</h2>
              <p className="text-gray-500 dark:text-zinc-400 mt-2">Premium services for your business</p>
            </div>
            <Link href="/shop">
              <Button variant="ghost" className="hidden md:inline-flex">View All →</Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <Card key={product.id} className="card-animate hover-lift group" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardImage 
                  src={product.image_url} 
                  alt={product.name}
                  className="group-hover:scale-105 transition-transform duration-300"
                />
                <CardContent>
                  <CardTitle className="group-hover:text-indigo-400 transition-colors">{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                  <CardPrice>${product.price}/mo</CardPrice>
                  <Link href="/checkout">
                    <Button className="w-full mt-4">Add to Cart</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/shop">
              <Button variant="outline">View All Products</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50 dark:bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10K+', label: 'Happy Customers' },
              { value: '99.9%', label: 'Uptime' },
              { value: '50+', label: 'Integrations' },
              { value: '24/7', label: 'Support' },
            ].map((stat, i) => (
              <div key={stat.label} className={`text-center card-animate`} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-4xl md:text-5xl font-bold gradient-text dark:text-white">{stat.value}</div>
                <div className="text-gray-500 dark:text-zinc-500 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <FadeInSection>
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="p-12 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-zinc-900 dark:to-zinc-800 rounded-2xl border border-gray-200 dark:border-zinc-800">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Ready to Get Started?</h2>
              <p className="text-gray-500 dark:text-zinc-400 mb-8 max-w-lg mx-auto">
                Join thousands of users who trust Rhine for your digital needs. 
                Start your free trial today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="glow-primary">Create Account</Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline" size="lg">View Pricing</Button>
                </Link>
              </div>
            </div>
          </div>
        </FadeInSection>
      </section>
    </>
  )
}