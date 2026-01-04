import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '流水系统 | Flow System',
  description: '意识的灌溉系统 - Irrigation of Consciousness',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  )
}
