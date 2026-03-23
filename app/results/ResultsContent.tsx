'use client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { schools } from '@/lib/data/schools'
import { getTop3Schools, parseIntakeFromParams, buildIntakeParams } from '@/lib/scoring'
import { DESTINATION_LABELS, GOAL_LABELS, DURATION_LABELS, BUDGET_LABELS } from '@/lib/types'
import RecommendationCard from '@/components/RecommendationCard'
import Navbar from '@/components/Navbar'

function buildSummary(params: ReturnType<typeof parseIntakeFromParams>): string {
  if (!params) return 'Your top 3 language schools'
  const dest   = DESTINATION_LABELS[params.destination] ?? params.destination
  const dur    = DURATION_LABELS[params.duration_weeks] ?? `${params.duration_weeks} weeks`
  const goal   = GOAL_LABELS[params.goal] ?? params.goal
  const budget = BUDGET_LABELS[params.budget_max] ?? `€${params.budget_max}`
  if (params.destination === 'ANY')
    return `Your top 3 for a ${dur} language trip, budget ${budget} — best matches across all destinations.`
  return `Your top 3 for ${dur} in ${dest}, budget ${budget} — matched to your goal: ${goal}.`
}

export default function ResultsContent() {
  const searchParams = useSearchParams()
  const rawParams: Record<string, string> = {}
  searchParams.forEach((v, k) => { rawParams[k] = v })

  const intake      = parseIntakeFromParams(rawParams)
  const top3        = intake ? getTop3Schools(schools, intake) : []
  const intakeParams = intake ? buildIntakeParams(intake) : ''
  const summary     = buildSummary(intake)

  if (!intake) {
    return (
      <div className="min-h-screen bg-bg">
        <Navbar />
        <div className="max-w-lg mx-auto px-6 py-24 text-center">
          <h1 className="font-display text-3xl font-semibold text-ink mb-4">No search found</h1>
          <p className="text-muted mb-8">Start the intake again to see your personal top 3.</p>
          <Link href="/start" className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-medium px-6 py-3.5 rounded-xl transition-colors">
            Start again
          </Link>
        </div>
      </div>
    )
  }

  if (top3.length === 0) {
    return (
      <div className="min-h-screen bg-bg">
        <Navbar />
        <div className="max-w-lg mx-auto px-6 py-24 text-center">
          <h1 className="font-display text-3xl font-semibold text-ink mb-4">No matches found</h1>
          <p className="text-muted mb-8">We couldn't find schools that match your criteria well. Try a wider budget or different destination.</p>
          <Link href="/start" className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-medium px-6 py-3.5 rounded-xl transition-colors">
            Try again
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg pb-20">
      <Navbar showBackLink backHref="/start" backLabel="Adjust" />

      <main className="max-w-lg mx-auto px-5 pt-4 pb-8">
        <div className="mb-6 animate-fade-up">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-2">Your matches</p>
          <p className="text-base text-ink leading-relaxed">{summary}</p>
        </div>

        <div className="flex items-center gap-4 mb-6 py-3 px-4 bg-card rounded-xl border border-border animate-fade-up-1">
          {[
            { color: 'bg-accent',       label: 'Match' },
            { color: 'bg-blue-500',     label: 'Value' },
            { color: 'bg-violet-500',   label: 'Trust' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${color}`} />
              <span className="text-xs text-muted">{label}</span>
            </div>
          ))}
          <span className="text-xs text-muted ml-auto">Score 0–100</span>
        </div>

        <div className="space-y-4">
          {top3.map((school, i) => (
            <div key={school.id} className={i === 0 ? 'animate-fade-up-1' : i === 1 ? 'animate-fade-up-2' : 'animate-fade-up-3'}>
              <RecommendationCard school={school} rank={i + 1} intakeParams={intakeParams} />
            </div>
          ))}
        </div>

        <div className="mt-8 text-center animate-fade-up-3">
          <p className="text-sm text-muted mb-2">Results not quite right?</p>
          <Link href="/start" className="text-sm font-medium text-accent hover:underline underline-offset-4">
            ↩ Adjust your preferences
          </Link>
        </div>
      </main>
    </div>
  )
}
