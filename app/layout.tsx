import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Boston Jimmy',
  description: 'Boston Jimmy – private high-stakes poker experiences.',
  icons: {
    icon: '/assets/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
