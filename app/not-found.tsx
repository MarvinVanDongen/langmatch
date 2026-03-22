import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <p className="font-display text-6xl font-light text-accent/30 mb-4">404</p>
        <h1 className="font-display text-2xl font-semibold text-ink mb-3">
          Pagina niet gevonden
        </h1>
        <p className="text-muted mb-8 max-w-sm">
          De pagina die je zoekt bestaat niet (meer). Ga terug naar de homepage of start een nieuwe zoekopdracht.
        </p>
        <div className="flex gap-3">
          <Link
            href="/"
            className="px-5 py-2.5 border border-border rounded-xl text-sm font-medium text-ink hover:bg-card transition-colors"
          >
            Naar de homepage
          </Link>
          <Link
            href="/start"
            className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-xl text-sm font-medium transition-colors"
          >
            Nieuwe zoekopdracht
          </Link>
        </div>
      </main>
    </div>
  )
}
