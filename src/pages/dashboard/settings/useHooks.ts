import { useState } from "react"
import { useTheme } from "@/components/theme-provider"
import { useThemeColor, type ColorPresetId } from "@/context/ThemeColorContext"
import { showToast } from "@/lib/toast"

export function useSettings() {
  const { theme, setTheme } = useTheme()
  const { color, setColor, presets } = useThemeColor()

  // Sandbox demo states
  const [demoSwitch, setDemoSwitch] = useState(true)
  const [demoSlider, setDemoSlider] = useState(65)
  const [demoCheckbox, setDemoCheckbox] = useState(true)

  const handleColorChange = (newColor: ColorPresetId) => {
    setColor(newColor)
    const preset = presets.find((p) => p.id === newColor)
    showToast.success(`Theme color changed to ${preset?.name ?? newColor}`)
  }

  const handleThemeModeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme)
  }

  return {
    // Theme Mode
    theme,
    handleThemeModeChange,

    // Color Swatches
    color,
    presets,
    handleColorChange,

    // Sandbox
    demoSwitch,
    setDemoSwitch,
    demoSlider,
    setDemoSlider,
    demoCheckbox,
    setDemoCheckbox,
  }
}

