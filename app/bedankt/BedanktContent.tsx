'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function BedanktContent() {
  const searchParams = useSearchParams()
  const schoolName = searchParams.get('school') ?? 'de school'
  const cashback = parseInt(searchParams.get('cashback') ?? '0', 10)

  // Rebuild results link from intake params
  const intakeKeys = ['dest', 'goal', 'weeks', 'budget', 'age', 'acc']
  const intakeParams = new URLSearchParams()
  intakeKeys.forEach((key) => {
    const val = searchParams.get(key)
    if (val) intakeParams.set(key, val)
  })
  const resultsHref = intakeParams.size > 0 ? `/results?${intakeParams.toString()}` : '/results'

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-md w-full text-center">

          {/* Success icon */}
          <div className="w-16 h-16 rounded-full bg-accent-light border-2 border-accent/30 flex items-center justify-center mx-auto mb-6 animate-fade-up">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path
                d="M6 14l5.5 5.5L22 8"
                stroke="#2A6944"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Heading */}
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-ink mb-3 animate-fade-up-1">
            Je aanvraag is verstuurd!
          </h1>
          <p className="text-muted leading-relaxed mb-8 animate-fade-up-1">
            We hebben je aanvraag voor{' '}
            <strong className="text-ink font-medium">{schoolName}</strong> ontvangen.
            De school neemt contact met je op — meestal binnen 1 werkdag.
          </p>

          {/* What happens next */}
          <div className="bg-card border border-border rounded-2xl p-5 text-left mb-6 animate-fade-up-2">
            <h2 className="font-display font-semibold text-ink text-base mb-4">
              Wat gebeurt er nu?
            </h2>
            <ol className="space-y-4">
              {[
                {
                  step: '1',
                  title: 'Bevestiging per e-mail',
                  desc: 'Je ontvangt een bevestiging van je aanvraag op het door jou opgegeven e-mailadres.',
                },
                {
                  step: '2',
                  title: 'School neemt contact op',
                  desc: `${schoolName} beantwoordt je vragen en stuurt je een definitieve offerte, meestal binnen 24 uur.`,
                },
                {
                  step: '3',
                  title: 'Boeking bevestigen',
                  desc: 'Zodra je de boeking bevestigt, verwerken wij je cashback binnen 5 werkdagen.',
                },
              ].map(({ step, title, desc }) => (
                <li key={step} className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-accent-light text-accent text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {step}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{title}</p>
                    <p className="text-xs text-muted mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Cashback reminder */}
          {cashback > 0 && (
            <div className="bg-sky-50 border border-sky-200 rounded-2xl px-5 py-4 mb-6 animate-fade-up-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" stroke="#0369a1" strokeWidth="1.5" />
                    <path d="M10 6v4l2.5 2.5" stroke="#0369a1" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-sky-800">
                    €{cashback} cashback komt jouw kant op
                  </p>
                  <p className="text-xs text-sky-700 mt-0.5">
                    Na bevestiging van je boeking ontvang je €{cashback} terug van LangMatch.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Back to results */}
          {intakeParams.size > 0 && (
            <div className="animate-fade-up-3">
              <p className="text-sm text-muted mb-3">
                Wil je ook je andere 2 matches bekijken?
              </p>
              <Link
                href={resultsHref}
                className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline underline-offset-4"
              >
                ← Terug naar mijn top 3
              </Link>
            </div>
          )}

          {/* Start over */}
          <div className="mt-8 pt-6 border-t border-border animate-fade-up-3">
            <p className="text-xs text-muted mb-3">Of begin opnieuw voor een andere bestemming</p>
            <Link
              href="/start"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-ink transition-colors border border-border rounded-xl px-4 py-2.5"
            >
              Nieuwe zoekopdracht starten
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-border text-center">
        <p className="text-xs text-muted">
          Vragen? Mail ons op{' '}
          <a href="mailto:hallo@langmatch.nl" className="text-ink hover:underline underline-offset-2">
            hallo@langmatch.nl
          </a>
        </p>
      </footer>
    </div>
  )
}
