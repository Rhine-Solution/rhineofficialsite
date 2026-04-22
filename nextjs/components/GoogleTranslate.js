'use client'

import { useEffect } from 'react'

export default function GoogleTranslate() {
  useEffect(() => {
    const existingScript = document.querySelector('script[src*="translate.google.com"]')
    if (existingScript) return

    const script = document.createElement('script')
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    script.async = true
    document.body.appendChild(script)

    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,es,fr,de,it,pt,ru,zh-CN,ja,ko,ar,hi,id,tr,vi,th,pl,uk,nl,fa,ms,sw,ta,bn,ur',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element'
        )
      }
    }

    return () => {
      delete window.googleTranslateElementInit
    }
  }, [])

  return <div id="google_translate_element" className="hidden"></div>
}