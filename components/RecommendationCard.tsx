import Link from 'next/link'
import type { ScoredSchool } from '@/lib/types'
import LabelBadge from './LabelBadge'
import ScoreBar from './ScoreBar'

interface RecommendationCardProps {
  school: ScoredSchool
  rank: number
  intakeParams: string
}

const PRICE_BAND_STYLES = {
  'LOW':        'bg-emerald-50 text-emerald-700',
  'FAIR VALUE': 'bg-emerald-50 text-emerald-700',
  'PREMIUM':    'bg-amber-50 text-amber-700',
  'OVERPRICED': 'bg-red-50 text-red-700',
}

export default function RecommendationCard({ school, rank, intakeParams }: RecommendationCardProps) {
  const isTop     = rank === 1
  const detailUrl = `/school/${school.slug}?${intakeParams}`
  const bookUrl   = `/book/${school.slug}?${intakeParams}`

  return (
    <article className={`bg-card rounded-2xl transition-shadow hover:shadow-card-hover overflow-hidden
      ${isTop
        ? 'shadow-card ring-1 ring-accent/20 border border-accent/20'
        : 'shadow-card border border-border'}`}
    >
      {/* Top accent bar for #1 */}
      {isTop && <div className="h-1 w-full bg-gradient-to-r from-accent via-accent-mid to-accent" />}

      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {isTop && (
              <p className="text-[10px] font-semibold tracking-widest uppercase text-accent mb-1">
                ★ Best match
              </p>
            )}
            <h3 className={`font-display font-semibold text-ink leading-tight ${isTop ? 'text-xl' : 'text-lg'}`}>
              {school.school_name}
            </h3>
            <p className="text-sm text-muted mt-0.5">{school.city} · {school.country_name}</p>
          </div>
          <LabelBadge label={school.label} />
        </div>

        {/* Scores */}
        <div className="space-y-2.5">
          <ScoreBar label="Match"  score={school.match_score} color="match" />
          <ScoreBar label="Value"  score={school.value_score} color="value" />
          <ScoreBar label="Trust"  score={school.trust_score} color="trust" />
        </div>

        {/* Reason */}
        <p className="text-sm text-muted italic leading-relaxed border-t border-border pt-3">
          "{school.recommendation_reason}"
        </p>

        {/* Price row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-base font-semibold text-ink">€{school.avg_week_price}/week</span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PRICE_BAND_STYLES[school.price_band]}`}>
            {school.price_band}
          </span>
          {school.cashback_possible && school.cashback_amount > 0 && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-sky-50 text-sky-700">
              €{school.cashback_amount} cashback
            </span>
          )}
        </div>

        {/* CTAs */}
        <div className="flex gap-2.5 pt-1">
          <Link href={detailUrl}
            className="flex-1 text-center text-sm font-medium px-4 py-2.5 rounded-xl border border-border text-ink hover:border-accent/40 hover:bg-accent-light transition-colors">
            View school
          </Link>
          <Link href={bookUrl}
            className="flex-1 text-center text-sm font-medium px-4 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white transition-colors">
            {school.cashback_possible ? `Book — €${school.cashback_amount} back` : 'Book now'}
          </Link>
        </div>
      </div>
    </article>
  )
}
