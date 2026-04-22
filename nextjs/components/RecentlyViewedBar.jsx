'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, BookOpen } from 'lucide-react';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';

export default function RecentlyViewedBar() {
  const { items } = useRecentlyViewed();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (items.length < 2 || isCollapsed) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:w-80 z-30"
    >
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-zinc-800">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Recently Viewed
          </span>
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-2 p-3 overflow-x-auto scrollbar-hide">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="flex-shrink-0 w-20 group"
            >
              <div className="w-20 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-800 mb-1">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.name || item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {item.type === 'product' ? (
                      <ShoppingBag className="w-6 h-6 text-gray-400" />
                    ) : (
                      <BookOpen className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-600 dark:text-zinc-400 truncate group-hover:text-indigo-400">
                {item.name || item.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
}