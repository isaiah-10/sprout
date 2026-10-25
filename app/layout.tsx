import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title:       'Sprout — Growing money confidence',
  description: 'Parent-led financial literacy practice for ages 5–17. Forty curriculum topics, fictional examples, and no subscriptions.',
  keywords:    ['kids finance', 'children investing', 'financial literacy', 'stock market for kids', 'budgeting app'],
  authors:     [{ name: 'Sprout' }],
  manifest:    '/manifest.json',
  icons: {
    icon:  '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title:       'Sprout — Growing money confidence',
    description: 'Parent-led financial literacy practice with pretend money and no subscriptions.',
    type:        'website',
    siteName:    'Sprout',
  },
}

export const viewport: Viewport = {
  themeColor:    '#2D6A4F',
  width:         'device-width',
  initialScale:  1,
  viewportFit:   'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
