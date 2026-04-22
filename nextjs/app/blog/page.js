'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Clock, ArrowRight, Tag, Calendar, User, ChevronRight } from 'lucide-react'
import { useDebounce } from '../../hooks/useDebounce'
import ShareButton from '../../components/ShareButton'

const categories = [
  { id: 'all', name: 'All Posts', count: 8 },
  { id: 'development', name: 'Development', count: 3 },
  { id: 'security', name: 'Security', count: 2 },
  { id: 'cloud', name: 'Cloud', count: 2 },
  { id: 'tips', name: 'IT Tips', count: 1 },
]

const posts = [
  {
    id: 1,
    slug: 'scalable-web-applications-nextjs',
    title: 'Building Scalable Web Applications with Next.js 14',
    excerpt: 'Learn how to build high-performance web applications using Next.js 14 and modern architecture patterns. Discover the best practices for scaling your applications.',
    category: 'Development',
    categorySlug: 'development',
    date: 'April 15, 2026',
    readTime: '8 min read',
    author: 'Rhine Team',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
  },
  {
    id: 2,
    slug: 'cloud-computing-trends-2026',
    title: 'The Future of Cloud Computing in 2026',
    excerpt: 'Explore the latest trends in cloud computing and how they\'re shaping the future of technology. From edge computing to serverless architectures.',
    category: 'Cloud',
    categorySlug: 'cloud',
    date: 'April 10, 2026',
    readTime: '6 min read',
    author: 'Rhine Team',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop',
  },
  {
    id: 3,
    slug: 'web-application-security',
    title: 'Securing Your Web Applications: Best Practices',
    excerpt: 'A comprehensive guide to securing your web applications against common vulnerabilities. Learn about OWASP Top 10, HTTPS, CSP, and more.',
    category: 'Security',
    categorySlug: 'security',
    date: 'April 5, 2026',
    readTime: '10 min read',
    author: 'Rhine Team',
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=400&fit=crop',
  },
  {
    id: 4,
    slug: 'postgresql-performance',
    title: 'Optimizing Database Performance with PostgreSQL',
    excerpt: 'Tips and techniques for getting the most out of your PostgreSQL database. Learn about indexing, query optimization, and caching strategies.',
    category: 'Development',
    categorySlug: 'development',
    date: 'March 28, 2026',
    readTime: '7 min read',
    author: 'Rhine Team',
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=400&fit=crop',
  },
  {
    id: 5,
    slug: 'edge-computing-introduction',
    title: 'Introduction to Edge Computing',
    excerpt: 'Understanding edge computing and how it can improve your application\'s performance. Learn about edge functions, CDN optimization, and latency reduction.',
    category: 'Cloud',
    categorySlug: 'cloud',
    date: 'March 20, 2026',
    readTime: '5 min read',
    author: 'Rhine Team',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',
  },
  {
    id: 6,
    slug: 'it-security-tips-2026',
    title: '10 Essential IT Security Tips for Businesses',
    excerpt: 'Protect your business from cyber threats with these essential security practices. From password management to employee training.',
    category: 'IT Tips',
    categorySlug: 'tips',
    date: 'March 15, 2026',
    readTime: '5 min read',
    author: 'Rhine Team',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=400&fit=crop',
  },
]

const featuredPost = posts[0]

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const isSearching = searchTerm !== debouncedSearchTerm

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || 
      post.category.toLowerCase() === selectedCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 pt-20 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-zinc-950 to-zinc-950" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-medium mb-5">
              Our Blog
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5">
              Latest <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Insights</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">
              Expert insights, tutorials, and industry trends to help you stay ahead in tech.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-10 py-4 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              />
              {isSearching && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Featured Post */}
              <div className="group relative bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-medium rounded-full">
                      {featuredPost.category}
                    </span>
                    <span className="text-zinc-500 text-sm flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTime}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-zinc-400 mb-4">{featuredPost.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-500">{featuredPost.date}</span>
                    <Link 
                      href={`/blog/${featuredPost.slug}`}
                      className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      Read More <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Posts Grid */}
              <div className="grid sm:grid-cols-2 gap-6">
                {filteredPosts.slice(1).map(post => (
                  <article 
                    key={post.id}
                    className="group bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-xs font-medium rounded-full">
                          {post.category}
                        </span>
                        <span className="text-zinc-600 text-xs">{post.readTime}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-indigo-400 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-zinc-400 line-clamp-2 mb-3">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-500">{post.date}</span>
                        <div className="flex items-center gap-2">
                          <ShareButton title={post.title} />
                          <Link 
                            href={`/blog/${post.slug}`}
                            className="text-indigo-400 hover:text-indigo-300"
                          >
                            Read →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {filteredPosts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-zinc-500 mb-4">No posts found matching your criteria.</p>
                  <button 
                    onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Categories */}
              <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                        selectedCategory === cat.id 
                          ? 'bg-indigo-500/20 text-indigo-400' 
                          : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        {cat.name}
                      </span>
                      <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded-full">
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-gradient-to-br from-indigo-900/60 to-purple-900/60 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Newsletter</h3>
                <p className="text-sm text-zinc-400 mb-4">
                  Get the latest tech insights delivered to your inbox.
                </p>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 mb-3"
                />
                <button className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all">
                  Subscribe
                </button>
              </div>

              {/* Popular Posts */}
              <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Popular Posts</h3>
                <div className="space-y-4">
                  {posts.slice(0, 3).map(post => (
                    <Link 
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="flex gap-3 group"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-white line-clamp-2 group-hover:text-indigo-400 transition-colors">
                          {post.title}
                        </h4>
                        <span className="text-xs text-zinc-500">{post.readTime}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {['Next.js', 'React', 'Cloud', 'Security', 'DevOps', 'Database', 'Performance', 'API'].map(tag => (
                    <button 
                      key={tag}
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white text-sm rounded-lg transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need Help With Your Project?</h2>
          <p className="text-zinc-400 mb-8">
            Our team of experts can help you build, secure, and optimize your applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
            >
              Get in Touch
            </Link>
            <Link 
              href="/shop" 
              className="px-8 py-3 bg-zinc-800 text-white font-semibold rounded-xl hover:bg-zinc-700 transition-all"
            >
              View Plans
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}