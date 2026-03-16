'use client'

import { localizedContent } from '@/data/store'
import { useLanguageStore } from '@/store/use-language-store'

export function useLocalizedContent() {
  const language = useLanguageStore((state) => state.language)

  return {
    language,
    content: localizedContent[language],
  }
}