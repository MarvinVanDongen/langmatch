import type { Metadata } from 'next'
import { Fraunces, DM_Sans } from 'next/font/google'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'LangMatch – Vind jouw perfecte taalschool',
  description:
    'LangMatch helpt je de beste taalschool in het buitenland vinden op basis van jouw budget, doel en reisduur. Alleen de top 3 matches – in 90 seconden.',
  keywords: ['taalschool', 'spaans leren', 'engels leren', 'malta', 'spanje', 'portugal'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
