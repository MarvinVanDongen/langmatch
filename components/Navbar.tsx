import Link from 'next/link'

interface NavbarProps {
  showBackLink?: boolean
  backHref?: string
  backLabel?: string
}

export default function Navbar({ showBackLink, backHref = '/', backLabel = 'Terug' }: NavbarProps) {
  return (
    <nav className="w-full px-6 md:px-10 py-5 flex items-center justify-between">
      <Link href="/" className="font-display text-xl font-semibold text-ink tracking-tight hover:opacity-80 transition-opacity">
        LangMatch
      </Link>

      <div className="flex items-center gap-6">
        {showBackLink ? (
          <Link
            href={backHref}
            className="text-sm text-muted hover:text-ink transition-colors flex items-center gap-1"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {backLabel}
          </Link>
        ) : (
          <>
            <Link href="/over" className="text-sm text-muted hover:text-ink transition-colors hidden sm:block">
              Over
            </Link>
            <Link href="/voor-scholen" className="text-sm text-muted hover:text-ink transition-colors hidden sm:block">
              Voor scholen
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
