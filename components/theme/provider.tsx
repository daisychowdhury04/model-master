"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

type ThemeMode = "light" | "dark" | "system"
type ResolvedTheme = "light" | "dark"

type ThemeContextValue = {
  /** Current theme mode: user choice (`light`/`dark`/`system`). */
  theme: ThemeMode;
  /** Resolved theme class (`light`/`dark`) used for `document.documentElement.classList`. */
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
}

const STORAGE_KEY = "theme"
const ThemeContext = React.createContext<ThemeContextValue | null>(null)

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function resolveTheme(mode: ThemeMode): ResolvedTheme {
  return mode === "system" ? getSystemTheme() : mode
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeMode] = React.useState<ThemeMode>("light")
  const [resolvedTheme, setResolvedTheme] = React.useState<ResolvedTheme>("light")

  // Load saved theme mode once on mount.
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw === "light" || raw === "dark" || raw === "system") {
        setThemeMode(raw)
      }
    } catch {
      // ignore
    }
  }, [])

  // Resolve theme (and update when system preference changes).
  React.useEffect(() => {
    const apply = () => setResolvedTheme(resolveTheme(themeMode))

    apply()

    if (themeMode !== "system") return

    const mql = window.matchMedia("(prefers-color-scheme: dark)")
    // Safari < 14 support
    const handler = () => apply()
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", handler)
      return () => mql.removeEventListener("change", handler)
    }
    mql.addListener(handler)
    return () => mql.removeListener(handler)
  }, [themeMode])

  // Apply theme class for Tailwind's `dark:` styles.
  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark")
  }, [resolvedTheme])

  const setTheme = React.useCallback((mode: ThemeMode) => {
    setThemeMode(mode)
    try {
      window.localStorage.setItem(STORAGE_KEY, mode)
    } catch {
      // ignore
    }
  }, [])

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme: themeMode, resolvedTheme, setTheme }),
    [themeMode, resolvedTheme, setTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const nextMode: ThemeMode = theme === "light" || theme === "system" ? "dark" : "light"

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(nextMode)}
      className="h-9 w-9"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}