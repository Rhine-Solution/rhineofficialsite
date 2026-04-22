'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import en from '../messages/en.json'
import es from '../messages/es.json'

const messages = { en, es }
const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const params = new URLSearchParams(window.location.search)
    const urlLocale = params.get('lang')
    
    if (urlLocale && ['en', 'es'].includes(urlLocale)) {
      setLocale(urlLocale)
      localStorage.setItem('locale', urlLocale)
    } else {
      const saved = localStorage.getItem('locale')
      if (saved && ['en', 'es'].includes(saved)) {
        setLocale(saved)
      }
    }
  }, [])

  const changeLocale = (newLocale) => {
    setLocale(newLocale)
    localStorage.setItem('locale', newLocale)
    const url = new URL(window.location.href)
    url.searchParams.set('lang', newLocale)
    window.history.replaceState({}, '', url)
  }

  const t = (key) => {
    const keys = key.split('.')
    let value = messages[locale]
    for (const k of keys) {
      value = value?.[k]
    }
    return value || key
  }

  return (
    <LanguageContext.Provider value={{ locale, changeLocale, t, mounted }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)