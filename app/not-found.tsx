import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <p className="font-display text-7xl font-light text-accent/20 mb-4">404</p>
        <h1 className="font-display text-2xl font-semibold text-ink mb-3">Page not found</h1>
        <p className="text-muted mb-8 max-w-sm">
          The page you're looking for doesn't exist. Go back to the homepage or start a new search.
        </p>
        <div className="flex gap-3">
          <Link href="/"
            className="px-5 py-2.5 border border-border rounded-xl text-sm font-medium text-ink hover:bg-card transition-colors">
            Homepage
          </Link>
          <Link href="/start"
            className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-xl text-sm font-medium transition-colors">
            New search
          </Link>
        </div>
      </main>
    </div>
  )
}
