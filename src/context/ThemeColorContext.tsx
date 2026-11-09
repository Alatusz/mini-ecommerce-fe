import * as React from "react"

export type ColorPresetId =
  | "zinc"
  | "blue"
  | "violet"
  | "emerald"
  | "rose"
  | "orange"
  | "amber"

export interface ColorPreset {
  id: ColorPresetId
  name: string
  swatchHex: string
  description: string
}

export const COLOR_PRESETS: ColorPreset[] = [
  {
    id: "zinc",
    name: "Zinc",
    swatchHex: "#52525b",
    description: "Classic monochrome, neutral and balanced",
  },
  {
    id: "blue",
    name: "Ocean Blue",
    swatchHex: "#2563eb",
    description: "Modern, professional, and trustworthy",
  },
  {
    id: "violet",
    name: "Royal Violet",
    swatchHex: "#7c3aed",
    description: "Creative, sleek, and vibrant SaaS style",
  },
  {
    id: "emerald",
    name: "Emerald",
    swatchHex: "#059669",
    description: "Fresh, energetic, and clean nature tone",
  },
  {
    id: "rose",
    name: "Ruby Rose",
    swatchHex: "#e11d48",
    description: "Warm, eye-catching, and passionate",
  },
  {
    id: "orange",
    name: "Sunset Orange",
    swatchHex: "#ea580c",
    description: "Playful, energetic, and friendly",
  },
  {
    id: "amber",
    name: "Golden Amber",
    swatchHex: "#d97706",
    description: "Warm, radiant, and luxurious accent",
  },
]

interface ThemeColorContextType {
  color: ColorPresetId
  setColor: (color: ColorPresetId) => void
  presets: ColorPreset[]
}

const ThemeColorContext = React.createContext<
  ThemeColorContextType | undefined
>(undefined)

const STORAGE_KEY = "vite-ui-color"

export function ThemeColorProvider({ children }: { children: React.ReactNode }) {
  const [color, setColorState] = React.useState<ColorPresetId>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ColorPresetId | null
    if (saved && COLOR_PRESETS.some((p) => p.id === saved)) {
      return saved
    }
    return "zinc"
  })

  const applyColor = React.useCallback((presetId: ColorPresetId) => {
    const root = document.documentElement
    if (presetId === "zinc") {
      root.removeAttribute("data-color")
    } else {
      root.setAttribute("data-color", presetId)
    }
  }, [])

  const setColor = React.useCallback(
    (newColor: ColorPresetId) => {
      localStorage.setItem(STORAGE_KEY, newColor)
      setColorState(newColor)
      applyColor(newColor)
    },
    [applyColor]
  )

  React.useEffect(() => {
    applyColor(color)
  }, [color, applyColor])

  return (
    <ThemeColorContext.Provider value={{ color, setColor, presets: COLOR_PRESETS }}>
      {children}
    </ThemeColorContext.Provider>
  )
}

export function useThemeColor() {
  const context = React.useContext(ThemeColorContext)
  if (!context) {
    throw new Error("useThemeColor must be used within a ThemeColorProvider")
  }
  return context
}

