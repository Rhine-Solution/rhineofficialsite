'use client';
import { useState, useEffect } from 'react';

const MAX_ITEMS = 5;
const STORAGE_KEY = 'rhine_recently_viewed';

export function useRecentlyViewed() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    }
  }, []);

  const addItem = (newItem) => {
    if (typeof window === 'undefined') return;
    
    setItems(prev => {
      const filtered = prev.filter(item => item.id !== newItem.id);
      const updated = [newItem, ...filtered].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearItems = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
    setItems([]);
  };

  return { items, addItem, clearItems };
}