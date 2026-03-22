import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function VoorScholenPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">Voor taalscholen</p>
        <h1 className="font-display text-4xl md:text-5xl font-medium text-ink leading-tight mb-6">
          Bereik gemotiveerde Nederlandse studenten.
        </h1>
        <p className="text-lg text-muted leading-relaxed mb-8">
          LangMatch stuurt geen massale traffic. We sturen <strong className="text-ink font-medium">gekwalificeerde aanvragen</strong> van studenten die jóuw school als beste match hebben gezien — gescoord op hun doel, budget en verblijfsduur.
        </p>

        <div className="space-y-4 mb-10">
          {[
            {
              title: 'Alleen gemotiveerde studenten',
              desc: 'Onze studenten doorlopen een intake van 6 vragen. Ze weten wat ze willen — en zijn klaar om te boeken.',
            },
            {
              title: 'Commissie of leadvergoeding',
              desc: 'We werken op basis van een succesfee. Geen maandelijks abonnement, geen verrassingen.',
            },
            {
              title: 'Maximaal 2–3 scholen per stad',
              desc: 'We tonen nooit 20 scholen naast elkaar. Als wij jouw school aanbevelen, doen we dat serieus.',
            },
          ].map(({ title, desc }) => (
            <div key={title} className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-display font-semibold text-ink mb-1">{title}</h3>
              <p className="text-sm text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-accent-light border border-accent/20 rounded-2xl p-6">
          <h2 className="font-display font-semibold text-ink text-lg mb-2">Interesse?</h2>
          <p className="text-sm text-muted mb-4">
            Stuur ons een e-mail en we nemen binnen 2 werkdagen contact op.
          </p>
          <a
            href="mailto:scholen@langmatch.nl?subject=Aanmelding school voor LangMatch"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-medium px-5 py-3 rounded-xl text-sm transition-colors"
          >
            Meld jouw school aan →
          </a>
        </div>
      </main>
    </div>
  )
}
