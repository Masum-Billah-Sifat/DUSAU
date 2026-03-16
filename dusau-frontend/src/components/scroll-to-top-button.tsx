'use client'

import { useEffect, useState } from 'react'
import { useLocalizedContent } from '@/hooks/use-locallized-content'

export default function ScrollToTopButton() {
  const [showButton, setShowButton] = useState(false)
  const { content } = useLocalizedContent()

  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.innerHeight * 0.5
      setShowButton(window.scrollY > threshold)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={content.common.goToTop}
      className={`fixed bottom-6 right-6 z-[60] rounded-full border border-white/10 bg-black px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_50px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 ${
        showButton
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      {content.common.goToTop}
    </button>
  )
}