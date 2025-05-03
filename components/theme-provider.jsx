'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
} from 'next-themes'

// Functional component to provide theme context
export function ThemeProvider({ children, ...props }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
