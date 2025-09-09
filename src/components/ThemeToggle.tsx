'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from './providers/ThemeProvider'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
        "hover:bg-gray-100 dark:hover:bg-gray-800",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      )}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <Sun
        className={cn(
          "h-4 w-4 transition-all",
          theme === 'light' ? "rotate-0 scale-100" : "-rotate-90 scale-0"
        )}
      />
      <Moon
        className={cn(
          "absolute h-4 w-4 transition-all",
          theme === 'dark' ? "rotate-0 scale-100" : "rotate-90 scale-0"
        )}
      />
    </button>
  )
}