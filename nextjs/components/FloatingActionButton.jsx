'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Plus, ArrowUp, Mail, Calendar, X } from 'lucide-react';

const menuItems = [
  { icon: ArrowUp, label: 'Back to Top', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
  { icon: Mail, label: 'Contact Support', href: '/contact' },
  { icon: Calendar, label: 'Book a Call', href: '/appointments/book' },
];

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50" ref={menuRef}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-14 right-0 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-800 p-2 w-48"
          >
            {menuItems.map((item, idx) => (
              <div key={idx}>
                {item.href ? (
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <item.icon className="w-4 h-4 text-gray-500 dark:text-zinc-400" />
                    {item.label}
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      item.action();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <item.icon className="w-4 h-4 text-gray-500 dark:text-zinc-400" />
                    {item.label}
                  </button>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-colors ${
          isOpen
            ? 'bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300'
            : 'bg-indigo-600 hover:bg-indigo-500 text-white'
        }`}
      >
        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Plus className="w-5 h-5" />
        )}
      </motion.button>
    </div>
  );
}