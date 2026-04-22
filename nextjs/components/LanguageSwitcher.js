'use client'

import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGUAGES } from '../lib/i18n'
import { Globe } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === i18n.language) || SUPPORTED_LANGUAGES[0]

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
    i18n.changeLanguage(code)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors"
        aria-label="Select language"
      >
        <Globe size={18} />
        <span className="text-sm font-medium">{currentLang.code.toUpperCase()}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 max-h-80 overflow-y-auto bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-800 py-1 z-50">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-zinc-400 border-b border-gray-200 dark:border-zinc-800">
            Select Language
          </div>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-between ${
                i18n.language === lang.code
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-700 dark:text-zinc-300'
              }`}
            >
              <span>
                {lang.nativeName} <span className="text-gray-400 text-xs ml-1">({lang.name})</span>
              </span>
              {i18n.language === lang.code && (
                <span className="text-blue-600 dark:text-blue-400 text-xs">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}