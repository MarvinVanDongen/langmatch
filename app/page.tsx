import Link from 'next/link'
import Navbar from '@/components/Navbar'
import LabelBadge from '@/components/LabelBadge'

// Static mock card shown as a preview on the landing page
function MockResultCard() {
  return (
    <div className="bg-card rounded-2xl border border-accent/15 shadow-card p-5 ring-1 ring-accent/10 max-w-sm mx-auto">
      <div className="mb-1">
        <span className="text-[10px] font-semibold tracking-widest uppercase text-accent">★ Beste match</span>
      </div>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="font-display font-semibold text-xl text-ink">CLIC IH Sevilla</h3>
          <p className="text-sm text-muted mt-0.5">Sevilla · Spanje</p>
        </div>
        <LabelBadge label="GO" />
      </div>

      {/* Score bars */}
      <div className="space-y-2.5 mb-4">
        {[
          { label: 'Match', score: 88, color: 'bg-accent', textColor: 'text-accent' },
          { label: 'Waarde', score: 79, color: 'bg-blue-500', textColor: 'text-blue-600' },
          { label: 'Vertrouwen', score: 84, color: 'bg-violet-500', textColor: 'text-violet-600' },
        ].map(({ label, score, color, textColor }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="text-xs text-muted w-16 shrink-0 font-medium">{label}</span>
            <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
            </div>
            <span className={`text-sm font-semibold w-8 text-right tabular-nums ${textColor}`}>{score}</span>
          </div>
        ))}
      </div>

      <p className="text-sm text-muted italic border-t border-border pt-3 mb-4">
        "Ruim binnen je budget, met 256+ beoordelingen en officieel geaccrediteerd."
      </p>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-base font-semibold text-ink">€310/week</span>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">FAIR VALUE</span>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-sky-50 text-sky-700">€50 cashback</span>
      </div>

      <div className="flex gap-2.5">
        <div className="flex-1 text-center text-sm font-medium px-4 py-2.5 rounded-xl border border-border text-ink">
          Bekijk school
        </div>
        <div className="flex-1 text-center text-sm font-medium px-4 py-2.5 rounded-xl bg-accent text-white">
          Boek met €50
        </div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 pt-12 pb-20 md:pt-20 md:pb-28 max-w-5xl mx-auto">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-accent-light text-accent text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-accent/20">
            <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
            Spanje · Portugal · Malta
          </div>

          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-medium text-ink leading-[1.05] tracking-tight mb-6">
            Vind jouw perfecte{' '}
            <span className="italic text-accent">taalschool</span>{' '}
            in 90 seconden.
          </h1>

          <p className="text-lg md:text-xl text-muted leading-relaxed mb-8 max-w-lg">
            Geen eindeloze vergelijkingssites. Geen verrassingen achteraf.
            LangMatch scoort 30+ scholen op jouw budget, doel en reisduur —
            en toont je <strong className="text-ink font-medium">alleen de top 3</strong>.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <Link
              href="/start"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-medium text-base px-6 py-3.5 rounded-xl transition-colors shadow-sm"
            >
              Vind mijn school
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <span className="text-sm text-muted">Gratis · 90 seconden · Geen registratie nodig</span>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 py-16 md:py-20 max-w-5xl mx-auto border-t border-border">
        <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-10">Hoe het werkt</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {[
            {
              step: '01',
              title: 'Vertel ons wat je zoekt',
              desc: 'Bestemming, budget, duur en doel. Zes korte vragen — klaar in minder dan 90 seconden.',
            },
            {
              step: '02',
              title: 'We scoren de scholen',
              desc: 'Elk school krijgt een Match Score, Value Score en Trust Score op basis van jouw antwoorden.',
            },
            {
              step: '03',
              title: 'Kies uit je top 3',
              desc: 'Alleen de beste matches. Inclusief cashback bij boeking via LangMatch.',
            },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex gap-4">
              <span className="font-display text-3xl font-light text-accent/30 leading-none shrink-0 w-8">
                {step}
              </span>
              <div>
                <h3 className="font-display font-semibold text-lg text-ink mb-2">{title}</h3>
                <p className="text-muted text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TRUST STRIP ─────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 py-8 bg-card border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-x-10 gap-y-3 items-center justify-center md:justify-start">
            {[
              { icon: '✓', text: '30+ gecureerde scholen' },
              { icon: '✓', text: 'Transparante prijscontext' },
              { icon: '✓', text: 'Altijd top 3 — nooit meer' },
              { icon: '✓', text: 'Eerlijke kanttekeningen per school' },
              { icon: '✓', text: 'Cashback bij boeking' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm text-muted">
                <span className="text-accent font-semibold">{icon}</span>
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EXAMPLE RESULT ──────────────────────────────────────────── */}
      <section className="px-6 md:px-10 py-16 md:py-24 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-4">Zo ziet je resultaat eruit</p>
            <h2 className="font-display text-3xl md:text-4xl font-medium text-ink leading-tight mb-4">
              Niet een lijst.<br />
              Een <em>beslissing</em>.
            </h2>
            <p className="text-muted leading-relaxed mb-6">
              LangMatch geeft je geen 80 opties om zelf te sorteren. We laten je precies zien welke school het beste bij jou past — met eerlijke scores, een duidelijke prijs en de reden waarom.
            </p>
            <Link
              href="/start"
              className="inline-flex items-center gap-2 text-accent font-medium text-sm hover:underline underline-offset-4"
            >
              Probeer het zelf
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
          <div>
            <MockResultCard />
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ───────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 py-16 md:py-24 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-medium text-ink mb-4">
            Klaar om de juiste keuze te maken?
          </h2>
          <p className="text-muted mb-8">
            90 seconden. Gratis. Geen registratie nodig.
          </p>
          <Link
            href="/start"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-medium text-base px-8 py-4 rounded-xl transition-colors shadow-sm"
          >
            Vind mijn school
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <p className="text-xs text-muted mt-4">
            LangMatch is geen reisbureau en geen directory. Het is een beslissingstool die voor jou werkt.
          </p>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────────────── */}
      <footer className="px-6 md:px-10 py-8 border-t border-border">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-display font-semibold text-ink">LangMatch</span>
          <div className="flex gap-6 text-sm text-muted">
            <Link href="/over" className="hover:text-ink transition-colors">Over ons</Link>
            <Link href="/voor-scholen" className="hover:text-ink transition-colors">Voor scholen</Link>
            <Link href="/contact" className="hover:text-ink transition-colors">Contact</Link>
          </div>
          <p className="text-xs text-muted">© 2025 LangMatch</p>
        </div>
      </footer>
    </div>
  )
}
