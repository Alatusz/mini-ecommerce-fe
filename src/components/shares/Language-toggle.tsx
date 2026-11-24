import { Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/context/LanguageContext"

export function LanguageToggle() {
  const { lang, toggleLang } = useLanguage()

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={toggleLang}
      className="h-8 gap-1.5 px-2 text-xs font-semibold cursor-pointer hover:bg-accent"
      title={`Switch language (${lang === "TH" ? "English" : "ภาษาไทย"})`}
    >
      <Languages className="size-4" />
      <span>{lang}</span>
    </Button>
  )
}

export default LanguageToggle
