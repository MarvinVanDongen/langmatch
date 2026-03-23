import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function ForSchoolsPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">For language schools</p>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-ink leading-tight mb-6">
          Reach motivated students<br />who already know what they want.
        </h1>
        <p className="text-lg text-muted leading-relaxed mb-10">
          LangMatch doesn't send you mass traffic. We send{' '}
          <strong className="text-ink font-medium">qualified applications</strong>{' '}
          from students who've seen your school as their best match — scored against their goal, budget, and trip length.
        </p>

        <div className="space-y-4 mb-12">
          {[
            {
              title: 'Only motivated students',
              desc: 'Our students complete a 6-question intake flow. They know what they want — and they\'re ready to book.',
            },
            {
              title: 'Commission or lead fee',
              desc: 'We work on a success-fee basis. No monthly subscription, no surprises.',
            },
            {
              title: 'Maximum 2–3 schools per city',
              desc: 'We never put 20 competitors side by side. When we recommend your school, we mean it.',
            },
            {
              title: 'Full transparency on scoring',
              desc: 'Students see exactly why your school was recommended. Trust is built before they even contact you.',
            },
          ].map(({ title, desc }) => (
            <div key={title} className="bg-card border border-border rounded-2xl p-5 flex gap-4">
              <span className="text-accent font-bold mt-0.5 shrink-0">✓</span>
              <div>
                <h3 className="font-display font-semibold text-ink mb-1">{title}</h3>
                <p className="text-sm text-muted leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-dark rounded-2xl p-6 md:p-8">
          <h2 className="font-display font-semibold text-white text-xl mb-2">Interested?</h2>
          <p className="text-white/60 text-sm mb-5">
            Send us an email and we'll be in touch within 2 business days.
          </p>
          <a
            href="mailto:schools@langmatch.com?subject=School application for LangMatch"
            className="inline-flex items-center gap-2 bg-accent-mid hover:bg-accent text-white font-medium px-5 py-3 rounded-xl text-sm transition-colors">
            Apply to join LangMatch →
          </a>
          <p className="text-white/30 text-xs mt-4">
            We're currently onboarding schools in Spain, Portugal, and Malta only.
          </p>
        </div>
      </main>
    </div>
  )
}
