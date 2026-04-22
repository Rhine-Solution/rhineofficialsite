'use client';

import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
} from 'lucide-react';

const navigationItems = [
  { name: 'Home', href: '/', icon: Home, keywords: ['index', 'main'] },
  { name: 'Shop', href: '/shop', icon: ShoppingBag, keywords: ['store', 'products', 'pricing', 'subscription'] },
  { name: 'Travel', href: '/travel', icon: Map, keywords: ['destinations', 'booking', 'vacation'] },
  { name: 'Portfolio', href: '/portfolio', icon: Briefcase, keywords: ['projects', 'work', 'showcase'] },
  { name: 'Blog', href: '/blog', icon: BookOpen, keywords: ['articles', 'news', 'posts'] },
  { name: 'Contact', href: '/contact', icon: Mail, keywords: ['support', 'email', 'message'] },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, keywords: ['user', 'account', 'profile'] },
  { name: 'Profile', href: '/profile', icon: User, keywords: ['settings', 'avatar'] },
  { name: 'Orders', href: '/orders', icon: ShoppingBag, keywords: ['history', 'purchases'] },
  { name: 'Login', href: '/login', icon: LogIn, keywords: ['signin', 'auth'] },
  { name: 'Register', href: '/register', icon: UserPlus, keywords: ['signup', 'create'] },
  { name: 'Terms', href: '/terms', icon: FileText },
  { name: 'Privacy', href: '/privacy', icon: FileText },
];

export default function CommandPalette({ open, onOpenChange }) {
  const router = useRouter();

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
            placeholder="Type a command or search..."
            className="w-full border-0 border-b border-gray-200 bg-transparent px-4 py-4 text-base text-gray-900 outline-none placeholder:text-gray-500 dark:border-zinc-800 dark:text-white dark:placeholder:text-zinc-400"
          />

          <Command.List className="max-h-[400px] overflow-y-auto p-2 scroll-py-2">
            <Command.Empty className="py-6 text-center text-sm text-gray-500 dark:text-zinc-400">
              No results found.
            </Command.Empty>

            <Command.Group heading="Navigation" className="text-xs font-medium text-gray-500 dark:text-zinc-400 mb-2 px-2">
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