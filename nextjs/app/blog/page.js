'use client'

import Link from 'next/link'
import Card, { CardImage, CardContent, CardTitle, CardDescription } from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const posts = [
  {
    id: 1,
    title: 'Building Scalable Web Applications with Next.js',
    excerpt: 'Learn how to build high-performance web applications using Next.js 14 and modern architecture patterns.',
    category: 'Development',
    date: 'April 15, 2026',
    readTime: '8 min read',
    image: null,
  },
  {
    id: 2,
    title: 'The Future of Cloud Computing in 2026',
    excerpt: 'Explore the latest trends in cloud computing and how they\'re shaping the future of technology.',
    category: 'Technology',
    date: 'April 10, 2026',
    readTime: '6 min read',
    image: null,
  },
  {
    id: 3,
    title: 'Securing Your Web Applications: Best Practices',
    excerpt: 'A comprehensive guide to securing your web applications against common vulnerabilities.',
    category: 'Security',
    date: 'April 5, 2026',
    readTime: '10 min read',
    image: null,
  },
  {
    id: 4,
    title: 'Optimizing Database Performance with PostgreSQL',
    excerpt: 'Tips and techniques for getting the most out of your PostgreSQL database.',
    category: 'Database',
    date: 'March 28, 2026',
    readTime: '7 min read',
    image: null,
  },
  {
    id: 5,
    title: 'Introduction to Edge Computing',
    excerpt: 'Understanding edge computing and how it can improve your application\'s performance.',
    category: 'Infrastructure',
    date: 'March 20, 2026',
    readTime: '5 min read',
    image: null,
  },
  {
    id: 6,
    title: 'Building a Modern CI/CD Pipeline',
    excerpt: 'Step-by-step guide to setting up a robust continuous integration and deployment pipeline.',
    category: 'DevOps',
    date: 'March 15, 2026',
    readTime: '12 min read',
    image: null,
  },
]

const categories = ['All', 'Development', 'Technology', 'Security', 'Database', 'Infrastructure', 'DevOps']

export default function BlogPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Latest <span className="gradient-text">Articles</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Insights, tutorials, and updates from the Rhine team
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                cat === 'All'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Post */}
        <div className="mb-12">
          <Card className="overflow-hidden hover-lift group">
            <div className="grid md:grid-cols-2">
              <div className="aspect-video md:aspect-auto bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 flex items-center justify-center">
                <span className="text-6xl">📝</span>
              </div>
              <CardContent className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-sm text-zinc-500 mb-3">
                  <span className="text-indigo-400">{posts[0].category}</span>
                  <span>•</span>
                  <span>{posts[0].date}</span>
                  <span>•</span>
                  <span>{posts[0].readTime}</span>
                </div>
                <CardTitle className="text-2xl mb-3 group-hover:text-indigo-400 transition-colors">
                  {posts[0].title}
                </CardTitle>
                <CardDescription className="mb-6">{posts[0].excerpt}</CardDescription>
                <div>
                  <Button variant="outline">Read More</Button>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(1).map((post, index) => (
            <Card key={post.id} className="card-animate hover-lift group" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardImage 
                src={post.image}
                alt={post.title}
                className="aspect-video bg-gradient-to-br from-zinc-800 to-zinc-900"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl opacity-50">📄</span>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3">
                  <span className="text-indigo-400">{post.category}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <CardTitle className="text-lg mb-2 group-hover:text-indigo-400 transition-colors line-clamp-2">
                  {post.title}
                </CardTitle>
                <CardDescription className="text-sm line-clamp-2">{post.excerpt}</CardDescription>
                <div className="mt-4 text-xs text-zinc-500">{post.date}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-20 p-12 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl border border-zinc-800 text-center">
          <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-zinc-400 mb-6 max-w-lg mx-auto">
            Get the latest articles, tutorials, and updates delivered straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </div>
    </div>
  )
}