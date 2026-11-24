import * as React from "react"
import EN from "@/locale/EN.json"
import TH from "@/locale/TH.json"

export type Language = "TH" | "EN"
export type LocaleDictionary = typeof EN

type NestedKeyOf<T> = {
  [K in keyof T & string]: T[K] extends Record<string, unknown>
    ? `${K}.${NestedKeyOf<T[K]>}`
    : K
}[keyof T & string]

export type LocaleKey = NestedKeyOf<LocaleDictionary>

const DICTIONARIES: Record<Language, LocaleDictionary> = {
  EN,
  TH,
}

const STORAGE_KEY = "vite-ui-lang"

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  toggleLang: () => void
  dict: LocaleDictionary
  t: (key: LocaleKey) => string
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(
  undefined
)

export function LanguageProvider({
  children,
  defaultLang = "EN",
}: {
  children: React.ReactNode
  defaultLang?: Language
}) {
  const [lang, setLangState] = React.useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === "TH" || saved === "EN" ? saved : defaultLang
  })

  const setLang = React.useCallback((nextLang: Language) => {
    localStorage.setItem(STORAGE_KEY, nextLang)
    setLangState(nextLang)
  }, [])

  const toggleLang = React.useCallback(() => {
    setLang(lang === "TH" ? "EN" : "TH")
  }, [lang, setLang])

  React.useEffect(() => {
    document.documentElement.lang = lang.toLowerCase()
  }, [lang])

  const dict = DICTIONARIES[lang]

  const t = React.useCallback(
    (key: LocaleKey): string => {
      const value = key
        .split(".")
        .reduce<unknown>(
          (acc, part) =>
            acc && typeof acc === "object"
              ? (acc as Record<string, unknown>)[part]
              : undefined,
          dict
        )
      return typeof value === "string" ? value : key
    },
    [dict]
  )

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, dict, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextType {
  const context = React.useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
