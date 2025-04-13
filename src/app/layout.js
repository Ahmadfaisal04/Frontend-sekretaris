'use client';

import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { SoftUIControllerProvider } from '@/context'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from '../theme'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SoftUIControllerProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </SoftUIControllerProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
