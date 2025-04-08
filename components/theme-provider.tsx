"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps as NextThemesProviderProps } from "next-themes"
import type { ReactNode } from "react"

// Update the interface to match the next-themes package
interface ThemeProviderProps {
  children: ReactNode
  // Use the correct types from next-themes
  attribute?: NextThemesProviderProps["attribute"]
  defaultTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
