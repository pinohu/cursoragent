import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { validateEnvironment } from './utils/env'
import { ErrorBoundary } from './components/ErrorBoundary'

// Validate environment variables at startup
validateEnvironment();

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'Cursor Agent',
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'AI-powered code generation and automation tool',
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {children}
          </main>
        </ErrorBoundary>
      </body>
    </html>
  )
} 