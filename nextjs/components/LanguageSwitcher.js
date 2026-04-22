'use client'

import { Globe } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
  { code: 'zh-CN', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'ar', name: 'العربية' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'th', name: 'ไทย' },
  { code: 'pl', name: 'Polski' },
  { code: 'uk', name: 'Українська' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'fa', name: 'فارسی' },
  { code: 'ms', name: 'Bahasa Melayu' },
  { code: 'sw', name: 'Kiswahili' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'ur', name: 'اردو' },
]

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const changeLanguage = (code) => {
    const select = document.querySelector('.goog-te-combo')
    if (select) {
      select.value = code
      select.dispatchEvent(new Event('change', { bubbles: true }))
    }
    setIsOpen(false)
    localStorage.setItem('preferredLanguage', code)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors"
        aria-label="Select language"
      >
        <Globe size={18} />
        <span className="text-sm font-medium">Language</span>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 max-h-80 overflow-y-auto bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-800 py-1 z-50">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300 transition-colors"
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}