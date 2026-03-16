import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Language } from '@/data/store'

type LanguageState = {
  language: Language
  setLanguage: (language: Language) => void
  toggleLanguage: () => void
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (language) => set({ language }),
      toggleLanguage: () =>
        set({
          language: get().language === 'en' ? 'bn' : 'en',
        }),
    }),
    {
      name: 'dusau-language',
    }
  )
)