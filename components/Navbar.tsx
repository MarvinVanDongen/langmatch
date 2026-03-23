import Link from 'next/link'

interface NavbarProps {
  showBackLink?: boolean
  backHref?: string
  backLabel?: string
  dark?: boolean
}

export default function Navbar({ showBackLink, backHref = '/', backLabel = 'Back', dark = false }: NavbarProps) {
  const textColor = dark ? 'text-white/90 hover:text-white' : 'text-muted hover:text-ink'
  const logoColor = dark ? 'text-white' : 'text-ink'

  return (
    <nav className="w-full px-6 md:px-10 py-5 flex items-center justify-between">
      <Link href="/" className={`font-display text-xl font-semibold tracking-tight transition-opacity hover:opacity-80 ${logoColor}`}>
        LangMatch
      </Link>

      <div className="flex items-center gap-6">
        {showBackLink ? (
          <Link href={backHref} className={`text-sm transition-colors flex items-center gap-1.5 ${textColor}`}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {backLabel}
          </Link>
        ) : (
          <>
            <Link href="/about" className={`text-sm transition-colors hidden sm:block ${textColor}`}>About</Link>
            <Link href="/for-schools" className={`text-sm transition-colors hidden sm:block ${textColor}`}>For schools</Link>
            <Link href="/start" className={`text-sm font-medium px-4 py-2 rounded-full transition-colors ${dark ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20' : 'bg-accent text-white hover:bg-accent-hover'}`}>
              Get started
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
