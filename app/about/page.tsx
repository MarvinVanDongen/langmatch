import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">About LangMatch</p>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-ink leading-tight mb-8">
          A decision tool,<br />not a directory.
        </h1>

        <div className="space-y-5 text-muted leading-relaxed">
          <p>
            LangMatch was built for people who want to study a language abroad — without spending three evenings comparing 80 schools on five different tabs. We've done the comparison for you.
          </p>
          <p>
            We curate a small, carefully selected set of schools in Spain, Portugal, and Malta. No hundreds of options. No sponsored results. No hidden agenda.
          </p>
          <p>
            Based on your answers — destination, goal, budget, duration — LangMatch calculates a Match Score, Value Score, and Trust Score for each school. You always see exactly why a school scored the way it did, including honest trade-offs.
          </p>
          <p>
            We earn a commission when you book through LangMatch. We give a portion of that back to you directly as cashback. That way our interests are fully aligned with yours.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Schools curated', value: '30+' },
            { label: 'Destinations', value: '3' },
            { label: 'Scores per school', value: '3' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-card border border-border rounded-2xl p-5 text-center">
              <p className="font-display text-4xl font-semibold text-accent mb-1">{value}</p>
              <p className="text-sm text-muted">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Link href="/start"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-medium px-6 py-3.5 rounded-xl transition-colors">
            Find my school →
          </Link>
        </div>
      </main>
    </div>
  )
}
