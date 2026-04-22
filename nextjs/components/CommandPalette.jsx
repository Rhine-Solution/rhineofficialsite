'use client';

import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import {
  Home,
  ShoppingBag,
  Briefcase,
  Mail,
  User,
  Settings,
  FileText,
  Map,
  Calendar,
  BookOpen,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Search,
  Package,
  MessageCircle,
  HelpCircle,
} from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { useMeilisearch } from './useMeilisearch';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://crqjedivobupxbbathux.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycWplZGl2b2J1cHhiYmF0aHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTA5MDEsImV4cCI6MjA5MDM2NjkwMX0.0_HAu_sj7j-3racZK9nWIghKdNEXWRTHgLme2sUMAhM'

const navigationItems = [
  { name: 'Home', href: '/', icon: Home, keywords: ['index', 'main'] },
  { name: 'Shop', href: '/shop', icon: ShoppingBag, keywords: ['store', 'products', 'pricing', 'subscription'] },
  { name: 'Travel', href: '/travel', icon: Map, keywords: ['destinations', 'booking', 'vacation'] },
  { name: 'Portfolio', href: '/portfolio', icon: Briefcase, keywords: ['projects', 'work', 'showcase'] },
  { name: 'Blog', href: '/blog', icon: BookOpen, keywords: ['articles', 'news', 'posts'] },
  { name: 'FAQ', href: '/faq', icon: HelpCircle, keywords: ['questions', 'help', 'support'] },
  { name: 'Contact', href: '/contact', icon: Mail, keywords: ['support', 'email', 'message'] },
  { name: 'Pricing', href: '/pricing', icon: Package, keywords: ['plans', 'subscription', 'plans'] },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, keywords: ['user', 'account', 'profile'] },
  { name: 'Profile', href: '/profile', icon: User, keywords: ['settings', 'avatar'] },
  { name: 'Orders', href: '/orders', icon: ShoppingBag, keywords: ['history', 'purchases'] },
  { name: 'Login', href: '/login', icon: LogIn, keywords: ['signin', 'auth'] },
  { name: 'Register', href: '/register', icon: UserPlus, keywords: ['signup', 'create'] },
  { name: 'Terms', href: '/terms', icon: FileText },
  { name: 'Privacy', href: '/privacy', icon: FileText },
];

// FAQ data (local)
const faqItems = [
  { question: 'How do I get started?', answer: 'Create an account, browse services, and subscribe.', href: '/faq' },
  { question: 'What payment methods do you accept?', answer: 'Credit cards, PayPal, bank transfers.', href: '/faq' },
  { question: 'Is there a free trial?', answer: '14-day free trial on all plans.', href: '/faq' },
  { question: 'Can I cancel anytime?', answer: 'Yes, cancel or upgrade anytime.', href: '/faq' },
]

export default function CommandPalette({ open, onOpenChange }) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [results, setResults] = useState({
    products: [],
    posts: [],
    faqs: []
  })
  const [loading, setLoading] = useState(false)
  const debouncedSearch = useDebounce(search, 300)
  const { search: meiliSearch, searchMultiple: meiliMultiSearch, isConfigured: meiliConfigured, results: meiliResults, loading: meiliLoading } = useMeilisearch()
  const [meiliData, setMeiliData] = useState({ products: [], posts: [], portfolio: [] })

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  // Fetch search results
  useEffect(() => {
    if (!debouncedSearch || debouncedSearch.length < 2) {
      setResults({ products: [], posts: [], faqs: [] })
      return
    }

    const fetchResults = async () => {
      setLoading(true)
      try {
        // Search products
        const productsRes = await fetch(
          `${SUPABASE_URL}/rest/v1/products?select=id,name,price,description&name=ilike.*${encodeURIComponent(debouncedSearch)}*&limit=5`,
          {
            headers: {
              'apikey': SUPABASE_KEY,
              'Authorization': `Bearer ${SUPABASE_KEY}`
            }
          }
        )
        const products = await productsRes.json()

        // Search posts (blog)
        const postsRes = await fetch(
          `${SUPABASE_URL}/rest/v1/posts?select=id,title,slug&title=ilike.*${encodeURIComponent(debouncedSearch)}*&limit=5`,
          {
            headers: {
              'apikey': SUPABASE_KEY,
              'Authorization': `Bearer ${SUPABASE_KEY}`
            }
          }
        )
        const posts = await postsRes.json()

        // Search FAQ (local)
        const faqs = faqItems.filter(faq => 
          faq.question.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          faq.answer.toLowerCase().includes(debouncedSearch.toLowerCase())
        ).slice(0, 5)

        setResults({ products: products || [], posts: posts || [], faqs })
      } catch (err) {
        console.error('Search error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [debouncedSearch])

  // Meilisearch enhanced search
  useEffect(() => {
    if (!meiliConfigured || !debouncedSearch || debouncedSearch.length < 2) {
      setMeiliData({ products: [], posts: [], portfolio: [] })
      return
    }

    const fetchMeiliResults = async () => {
      try {
        const multiResults = await meiliMultiSearch(debouncedSearch, ['products', 'blog', 'portfolio'])
        setMeiliData({
          products: multiResults.products || [],
          posts: multiResults.blog || [],
          portfolio: multiResults.portfolio || []
        })
      } catch (err) {
        console.error('Meilisearch error:', err)
      }
    }

    fetchMeiliResults()
  }, [debouncedSearch, meiliConfigured, meiliMultiSearch])

  const hasContentResults = results.products.length > 0 || results.posts.length > 0 || results.faqs.length > 0 || meiliData.products.length > 0 || meiliData.posts.length > 0 || meiliData.portfolio.length > 0

  if (!open) return null;

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Global Command Menu"
    >
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15%]">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
        <div className="relative w-full max-w-lg mx-4 overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
          <Command.Input
            value={search}
            onValueChange={setSearch}
            placeholder="Search products, posts, FAQ..."
            className="w-full border-0 border-b border-gray-200 bg-transparent px-4 py-4 text-base text-gray-900 outline-none placeholder:text-gray-500 dark:border-zinc-800 dark:text-white dark:placeholder:text-zinc-400"
          />

          <Command.List className="max-h-[500px] overflow-y-auto p-2 scroll-py-2">
            <Command.Empty className="py-6 text-center text-sm text-gray-500 dark:text-zinc-400">
              {loading ? 'Searching...' : 'No results found.'}
            </Command.Empty>

            {/* Products */}
            {results.products.length > 0 && (
              <Command.Group heading="Products" className="text-xs font-medium text-gray-500 dark:text-zinc-400 mb-2 px-2">
                {results.products.map((product) => (
                  <Command.Item
                    key={product.id}
                    value={`product ${product.name}`}
                    onSelect={() => {
                      router.push(`/shop?search=${product.name}`);
                      onOpenChange(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-zinc-300 aria-selected:bg-gray-100 dark:aria-selected:bg-zinc-800 cursor-pointer"
                  >
                    <ShoppingBag className="h-4 w-4 text-indigo-400" />
                    <span className="flex-1">{product.name}</span>
                    <span className="text-xs text-gray-500 dark:text-zinc-500">${product.price}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Blog Posts */}
            {results.posts.length > 0 && (
              <Command.Group heading="Blog Posts" className="text-xs font-medium text-gray-500 dark:text-zinc-400 mb-2 px-2">
                {results.posts.map((post) => (
                  <Command.Item
                    key={post.id}
                    value={`blog ${post.title}`}
                    onSelect={() => {
                      router.push(`/blog/${post.slug}`);
                      onOpenChange(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-zinc-300 aria-selected:bg-gray-100 dark:aria-selected:bg-zinc-800 cursor-pointer"
                  >
                    <BookOpen className="h-4 w-4 text-green-400" />
                    <span className="flex-1">{post.title}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Meilisearch Products */}
            {meiliData.products.length > 0 && (
              <Command.Group heading="Products (Enhanced)" className="text-xs font-medium text-indigo-500 dark:text-indigo-400 mb-2 px-2">
                {meiliData.products.map((product) => (
                  <Command.Item
                    key={`meili-prod-${product.id}`}
                    value={`meili product ${product.title || product.name}`}
                    onSelect={() => {
                      router.push(`/shop?search=${product.title || product.name}`);
                      onOpenChange(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-zinc-300 aria-selected:bg-indigo-50 dark:aria-selected:bg-indigo-900/20 cursor-pointer"
                  >
                    <ShoppingBag className="h-4 w-4 text-indigo-500" />
                    <span className="flex-1">{product.title || product.name}</span>
                    {product.price && <span className="text-xs text-gray-500">${product.price}</span>}
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Meilisearch Blog Posts */}
            {meiliData.posts.length > 0 && (
              <Command.Group heading="Blog (Enhanced)" className="text-xs font-medium text-indigo-500 dark:text-indigo-400 mb-2 px-2">
                {meiliData.posts.map((post) => (
                  <Command.Item
                    key={`meili-post-${post.id}`}
                    value={`meili blog ${post.title}`}
                    onSelect={() => {
                      router.push(`/blog/${post.slug}`);
                      onOpenChange(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-zinc-300 aria-selected:bg-indigo-50 dark:aria-selected:bg-indigo-900/20 cursor-pointer"
                  >
                    <BookOpen className="h-4 w-4 text-indigo-500" />
                    <span className="flex-1">{post.title}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Meilisearch Portfolio */}
            {meiliData.portfolio.length > 0 && (
              <Command.Group heading="Portfolio (Enhanced)" className="text-xs font-medium text-indigo-500 dark:text-indigo-400 mb-2 px-2">
                {meiliData.portfolio.map((item) => (
                  <Command.Item
                    key={`meili-port-${item.id}`}
                    value={`meili portfolio ${item.title}`}
                    onSelect={() => {
                      router.push(`/portfolio`);
                      onOpenChange(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-zinc-300 aria-selected:bg-indigo-50 dark:aria-selected:bg-indigo-900/20 cursor-pointer"
                  >
                    <Briefcase className="h-4 w-4 text-indigo-500" />
                    <span className="flex-1">{item.title}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* FAQ */}
            {results.faqs.length > 0 && (
              <Command.Group heading="FAQ" className="text-xs font-medium text-gray-500 dark:text-zinc-400 mb-2 px-2">
                {results.faqs.map((faq, idx) => (
                  <Command.Item
                    key={idx}
                    value={`faq ${faq.question}`}
                    onSelect={() => {
                      router.push(faq.href);
                      onOpenChange(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-zinc-300 aria-selected:bg-gray-100 dark:aria-selected:bg-zinc-800 cursor-pointer"
                  >
                    <HelpCircle className="h-4 w-4 text-amber-400" />
                    <span className="flex-1 truncate">{faq.question}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Navigation */}
            <Command.Group heading="Pages" className="text-xs font-medium text-gray-500 dark:text-zinc-400 mb-2 px-2 mt-2">
              {navigationItems.map((item) => (
                <Command.Item
                  key={item.href}
                  value={`${item.name} ${item.keywords?.join(' ') || ''}`}
                  onSelect={() => {
                    router.push(item.href);
                    onOpenChange(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-zinc-300 aria-selected:bg-gray-100 dark:aria-selected:bg-zinc-800 cursor-pointer"
                >
                  <item.icon className="h-4 w-4 text-gray-500 dark:text-zinc-400" />
                  {item.name}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>

          <div className="border-t border-gray-200 px-4 py-3 dark:border-zinc-800">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-zinc-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-gray-300 bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-zinc-700 dark:bg-zinc-800">↑↓</kbd>
                  <span>Navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-gray-300 bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-zinc-700 dark:bg-zinc-800">↵</kbd>
                  <span>Select</span>
                </span>
              </div>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-gray-300 bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-zinc-700 dark:bg-zinc-800">Esc</kbd>
                <span>Close</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Command.Dialog>
  );
}