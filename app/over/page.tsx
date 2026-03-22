import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function OverPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">Over LangMatch</p>
        <h1 className="font-display text-4xl md:text-5xl font-medium text-ink leading-tight mb-6">
          Een beslissingstool,<br />geen directory.
        </h1>
        <div className="prose prose-stone max-w-none space-y-4 text-muted leading-relaxed">
          <p>
            LangMatch is gemaakt voor Nederlandstalige studenten en jongvolwassenen die een taalschool in het buitenland zoeken — zonder te verdwalen in eindeloze vergelijkingssites.
          </p>
          <p>
            We cureren een kleine, zorgvuldig geselecteerde set van scholen in Spanje, Portugal en Malta. Geen honderden opties. Geen gesponsorde resultaten. Geen verborgen agenda.
          </p>
          <p>
            Op basis van jouw antwoorden — bestemming, doel, budget, duur — berekent LangMatch een Match Score, Value Score en Trust Score voor elke school. Je ziet altijd precies waarom een school scoort zoals het scoort, inclusief eerlijke kanttekeningen.
          </p>
          <p>
            We verdienen een commissie als je via LangMatch boekt. Een deel geven we direct aan jou terug als cashback. Zo zijn onze belangen volledig aligned met die van jou.
          </p>
        </div>
        <div className="mt-10">
          <Link
            href="/start"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-medium px-6 py-3.5 rounded-xl transition-colors"
          >
            Vind mijn school →
          </Link>
        </div>
      </main>
    </div>
  )
}
