'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { schools } from '@/lib/data/schools'
import { getTop3Schools, parseIntakeFromParams, buildIntakeParams } from '@/lib/scoring'
import { DESTINATION_LABELS, GOAL_LABELS, DURATION_LABELS, BUDGET_LABELS } from '@/lib/types'
import RecommendationCard from '@/components/RecommendationCard'
import Navbar from '@/components/Navbar'

function buildSummary(params: ReturnType<typeof parseIntakeFromParams>): string {
  if (!params) return 'Jouw top 3 taalscholen'

  const destLabel = DESTINATION_LABELS[params.destination] ?? params.destination
  const durLabel = DURATION_LABELS[params.duration_weeks] ?? `${params.duration_weeks} weken`
  const goalLabel = GOAL_LABELS[params.goal] ?? params.goal
  const budgetLabel = BUDGET_LABELS[params.budget_max] ?? `€${params.budget_max}`

  if (params.destination === 'ANY') {
    return `Jouw top 3 voor ${durLabel} taalreizen, budget ${budgetLabel} — beste matches uit alle bestemmingen.`
  }
  return `Jouw top 3 voor ${durLabel} in ${destLabel}, budget ${budgetLabel} — geselecteerd op jouw doel: ${goalLabel}.`
}

export default function ResultsContent() {
  const searchParams = useSearchParams()

  const rawParams: Record<string, string> = {}
  searchParams.forEach((value, key) => {
    rawParams[key] = value
  })

  const intake = parseIntakeFromParams(rawParams)
  const top3 = intake ? getTop3Schools(schools, intake) : []
  const intakeParams = intake ? buildIntakeParams(intake) : ''
  const summary = buildSummary(intake)

  // No intake params found - redirect prompt
  if (!intake) {
    return (
      <div className="min-h-screen bg-bg">
        <Navbar />
        <div className="max-w-lg mx-auto px-6 py-24 text-center">
          <h1 className="font-display text-3xl font-medium text-ink mb-4">Geen zoekopdracht gevonden</h1>
          <p className="text-muted mb-8">Start de intake opnieuw om je persoonlijke top 3 te zien.</p>
          <Link
            href="/start"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-medium px-6 py-3.5 rounded-xl transition-colors"
          >
            Opnieuw beginnen
          </Link>
        </div>
      </div>
    )
  }

  // No matches found (edge case)
  if (top3.length === 0) {
    return (
      <div className="min-h-screen bg-bg">
        <Navbar />
        <div className="max-w-lg mx-auto px-6 py-24 text-center">
          <h1 className="font-display text-3xl font-medium text-ink mb-4">Geen matches gevonden</h1>
          <p className="text-muted mb-8">
            We konden geen scholen vinden die goed bij jouw criteria passen. Probeer een ruimer budget of andere bestemming.
          </p>
          <Link
            href="/start"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-medium px-6 py-3.5 rounded-xl transition-colors"
          >
            Opnieuw proberen
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg pb-20">
      <Navbar showBackLink backHref="/start" backLabel="Aanpassen" />

      <main className="max-w-lg mx-auto px-5 pt-4 pb-8">
        {/* Summary sentence */}
        <div className="mb-6 animate-fade-up">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-2">
            Jouw matches
          </p>
          <p className="text-base text-ink leading-relaxed">{summary}</p>
        </div>

        {/* Score legend */}
        <div className="flex items-center gap-4 mb-6 py-3 px-4 bg-card rounded-xl border border-border animate-fade-up-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-xs text-muted">Match</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-xs text-muted">Waarde</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-violet-500" />
            <span className="text-xs text-muted">Vertrouwen</span>
          </div>
          <span className="text-xs text-muted ml-auto">Score 0–100</span>
        </div>

        {/* Cards */}
        <div className="space-y-4">
          {top3.map((school, i) => (
            <div
              key={school.id}
              className={i === 0 ? 'animate-fade-up-1' : i === 1 ? 'animate-fade-up-2' : 'animate-fade-up-3'}
            >
              <RecommendationCard
                school={school}
                rank={i + 1}
                intakeParams={intakeParams}
              />
            </div>
          ))}
        </div>

        {/* Adjust preferences */}
        <div className="mt-8 text-center animate-fade-up-3">
          <p className="text-sm text-muted mb-2">Resultaten niet wat je verwachtte?</p>
          <Link
            href="/start"
            className="text-sm font-medium text-accent hover:underline underline-offset-4"
          >
            ↩ Pas je voorkeuren aan
          </Link>
        </div>
      </main>
    </div>
  )
}
