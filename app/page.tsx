import Link from 'next/link'
import Navbar from '@/components/Navbar'
import LabelBadge from '@/components/LabelBadge'

function MockCard() {
  return (
    <div className="bg-white rounded-2xl border border-accent/20 shadow-card-hover p-5 ring-1 ring-accent/10">
      <div className="h-0.5 w-full bg-gradient-to-r from-accent via-accent-mid to-accent -mt-5 -mx-5 mb-5 rounded-t-2xl" style={{marginLeft:'-1.25rem',marginRight:'-1.25rem',width:'calc(100% + 2.5rem)'}} />
      <p className="text-[10px] font-semibold tracking-widest uppercase text-accent mb-1">★ Best match</p>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="font-display font-semibold text-xl text-ink">CLIC IH Sevilla</h3>
          <p className="text-sm text-muted mt-0.5">Seville · Spain</p>
        </div>
        <LabelBadge label="GO" />
      </div>
      {[
        { label: 'Match', score: 88, color: 'bg-accent', tc: 'text-accent' },
        { label: 'Value', score: 79, color: 'bg-blue-500', tc: 'text-blue-600' },
        { label: 'Trust', score: 84, color: 'bg-violet-500', tc: 'text-violet-600' },
      ].map(({ label, score, color, tc }) => (
        <div key={label} className="flex items-center gap-3 mb-2.5">
          <span className="text-xs text-muted w-12 shrink-0 font-medium">{label}</span>
          <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
          </div>
          <span className={`text-sm font-semibold w-8 text-right tabular-nums ${tc}`}>{score}</span>
        </div>
      ))}
      <p className="text-sm text-muted italic border-t border-border pt-3 mt-3 mb-3">
        "Fits your budget, matches your learning goal, with 256+ verified reviews."
      </p>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-base font-semibold text-ink">€310/week</span>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">FAIR VALUE</span>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-sky-50 text-sky-700">€50 cashback</span>
      </div>
      <div className="flex gap-2.5">
        <div className="flex-1 text-center text-sm font-medium px-4 py-2.5 rounded-xl border border-border text-ink">View school</div>
        <div className="flex-1 text-center text-sm font-medium px-4 py-2.5 rounded-xl bg-accent text-white">Book — €50 back</div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg">

      {/* ─── HERO ─────────────────────────────────────── */}
      <div className="relative bg-dark overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #2D6A4F 0%, transparent 50%), radial-gradient(circle at 80% 20%, #1B4332 0%, transparent 50%)' }} />

        <Navbar dark />

        <div className="relative max-w-6xl mx-auto px-6 md:px-10 pt-16 pb-24 md:pt-24 md:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left: copy */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-medium px-3 py-1.5 rounded-full mb-6 border border-white/15">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-mid animate-pulse" />
                Spain · Portugal · Malta
              </div>

              <h1 className="font-display text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-semibold text-white leading-[1.05] tracking-tight mb-6">
                Find your perfect<br />
                <span className="italic text-accent-mid">language school</span><br />
                in 90 seconds.
              </h1>

              <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-md">
                No endless comparison tabs. No hidden fees. LangMatch scores every school against your budget, goal, and trip length — and shows you only the{' '}
                <strong className="text-white font-medium">top 3 matches</strong>.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <Link href="/start"
                  className="inline-flex items-center gap-2 bg-accent-mid hover:bg-accent text-white font-medium text-base px-7 py-3.5 rounded-xl transition-colors shadow-lg">
                  Find my school
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <span className="text-sm text-white/40">Free · 90 seconds · No sign-up</span>
              </div>

              {/* Social proof strip */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-10 pt-8 border-t border-white/10">
                {['30+ curated schools', 'Honest scoring', 'Cashback on bookings', 'No sponsored results'].map(t => (
                  <div key={t} className="flex items-center gap-1.5 text-xs text-white/50">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#52B788" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: mock card */}
            <div className="lg:justify-self-end w-full max-w-sm mx-auto lg:mx-0">
              <MockCard />
            </div>
          </div>
        </div>
      </div>

      {/* ─── HOW IT WORKS ─────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 py-20 md:py-28">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-3">How it works</p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-ink">Three steps to clarity.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {[
            {
              num: '01',
              title: 'Tell us what you need',
              desc: 'Destination, budget, duration, goal. Six quick questions — done in under 90 seconds.',
              icon: '✦',
            },
            {
              num: '02',
              title: 'We score every school',
              desc: 'Each school gets a Match Score, Value Score, and Trust Score calculated against your answers.',
              icon: '◈',
            },
            {
              num: '03',
              title: 'Choose from your top 3',
              desc: 'Only the best matches. Book through LangMatch and earn cashback — no extra cost to you.',
              icon: '★',
            },
          ].map(({ num, title, desc, icon }) => (
            <div key={num} className="relative bg-card rounded-2xl border border-border p-6 shadow-card hover:shadow-card-hover transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <span className="font-display text-5xl font-light text-accent/15 leading-none">{num}</span>
                <span className="text-2xl text-accent mt-1">{icon}</span>
              </div>
              <h3 className="font-display font-semibold text-lg text-ink mb-2">{title}</h3>
              <p className="text-sm text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── WHY NOT A DIRECTORY ──────────────────────── */}
      <section className="bg-dark py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #1B4332 0%, transparent 60%)' }} />
        <div className="relative max-w-5xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-accent-mid mb-4">Our philosophy</p>
              <h2 className="font-display text-4xl md:text-5xl font-semibold text-white leading-tight mb-6">
                Not a list.<br />A <em className="italic text-accent-mid">decision</em>.
              </h2>
              <p className="text-white/60 leading-relaxed mb-8">
                Most comparison sites show you 80 options and leave you to figure it out. LangMatch shows you exactly 3 — scored, ranked, and explained. We even show you the trade-offs.
              </p>
              <Link href="/start"
                className="inline-flex items-center gap-2 text-accent-mid font-medium text-sm hover:text-white transition-colors">
                Try it yourself
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Match Score',   desc: 'How well the school fits your specific needs', color: 'border-accent/30 bg-accent/10' },
                { label: 'Value Score',   desc: 'Whether the price is fair vs comparable schools', color: 'border-blue-400/20 bg-blue-900/20' },
                { label: 'Trust Score',   desc: 'How reliable the school appears from data', color: 'border-violet-400/20 bg-violet-900/20' },
                { label: 'Trade-offs',    desc: 'Honest downsides for every recommendation', color: 'border-amber-400/20 bg-amber-900/20' },
              ].map(({ label, desc, color }) => (
                <div key={label} className={`rounded-xl border p-4 ${color}`}>
                  <p className="text-sm font-semibold text-white mb-1">{label}</p>
                  <p className="text-xs text-white/50 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── DESTINATIONS ─────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 py-20 md:py-28">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-3">Where we operate</p>
          <h2 className="font-display text-4xl font-semibold text-ink">Three destinations. Handpicked schools.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { country: 'Spain', flag: '🇪🇸', schools: '5 schools', cities: 'Seville · Barcelona · Salamanca', desc: 'The most popular destination for Spanish learners. Rich culture, great weather, and excellent school quality.' },
            { country: 'Portugal', flag: '🇵🇹', schools: '3 schools', cities: 'Lisbon · Porto · Faro', desc: 'A rising star for language travel. Affordable, beautiful cities and an authentic European atmosphere.' },
            { country: 'Malta', flag: '🇲🇹', schools: '4 schools', cities: "St Julian's · Sliema · Gozo", desc: 'The most affordable English-language destination in Europe. Sun, sea, and serious learning — all year round.' },
          ].map(({ country, flag, schools, cities, desc }) => (
            <div key={country} className="bg-card border border-border rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{flag}</span>
                <div>
                  <h3 className="font-display font-semibold text-lg text-ink">{country}</h3>
                  <p className="text-xs text-muted">{schools}</p>
                </div>
              </div>
              <p className="text-xs text-accent font-medium mb-2">{cities}</p>
              <p className="text-sm text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FINAL CTA ────────────────────────────────── */}
      <section className="bg-accent py-20 md:py-28">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-white mb-4">
            Ready to find your school?
          </h2>
          <p className="text-white/70 mb-8 text-lg">
            90 seconds. Free. No account needed.
          </p>
          <Link href="/start"
            className="inline-flex items-center gap-2 bg-white text-accent hover:bg-accent-light font-semibold text-base px-8 py-4 rounded-xl transition-colors shadow-lg">
            Find my school
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <p className="text-white/40 text-xs mt-5">
            LangMatch is not a travel agent or a directory. It's a decision tool that works for you.
          </p>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────── */}
      <footer className="px-6 md:px-10 py-8 border-t border-border">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-display font-semibold text-ink">LangMatch</span>
          <div className="flex gap-6 text-sm text-muted">
            <Link href="/about" className="hover:text-ink transition-colors">About</Link>
            <Link href="/for-schools" className="hover:text-ink transition-colors">For schools</Link>
            <Link href="/contact" className="hover:text-ink transition-colors">Contact</Link>
          </div>
          <p className="text-xs text-muted">© 2025 LangMatch</p>
        </div>
      </footer>
    </div>
  )
}
