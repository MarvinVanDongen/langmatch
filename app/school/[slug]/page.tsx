import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { schools, getSchoolBySlug } from '@/lib/data/schools'
import { scoreSchool, parseIntakeFromParams, buildIntakeParams } from '@/lib/scoring'
import Navbar from '@/components/Navbar'
import LabelBadge from '@/components/LabelBadge'
import ScoreBar from '@/components/ScoreBar'
import type { IntakeAnswers, ScoredSchool } from '@/lib/types'

const PRICE_BAND_STYLES = {
  'LOW':        'bg-emerald-50 text-emerald-700 border-emerald-200',
  'FAIR VALUE': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'PREMIUM':    'bg-amber-50 text-amber-700 border-amber-200',
  'OVERPRICED': 'bg-red-50 text-red-700 border-red-200',
}
const CANCEL_LABELS = { flexible: 'Flexible cancellation', standard: 'Standard cancellation', strict: 'Strict cancellation' }
const CANCEL_COLORS = { flexible: 'text-emerald-700 bg-emerald-50', standard: 'text-amber-700 bg-amber-50', strict: 'text-red-700 bg-red-50' }
const COURSE_LABELS: Record<string, string> = {
  conversational: 'Conversational', intensive: 'Intensive', general: 'General',
  exam_prep: 'Exam Preparation', business: 'Business Language', immersive: 'Immersive',
  cultural: 'Language & Culture', holiday: 'Holiday + Language',
}
const ACCOM_LABELS: Record<string, string> = {
  homestay: 'Host family', shared_apartment: 'Shared apartment', residence: 'School residence', studio: 'Studio apartment',
}

function buildReason(scored: ScoredSchool, intake: IntakeAnswers): string {
  const parts: string[] = []
  const total = scored.avg_week_price * intake.duration_weeks +
    (intake.accommodation_pref === 'school' ? scored.accommodation_price_week * intake.duration_weeks : 0)

  if (intake.destination !== 'ANY') parts.push(`You're looking for a school in ${scored.country_name} — this school is in ${scored.city}`)
  if (total <= intake.budget_max) parts.push(`Total estimated cost (€${total.toLocaleString()}) fits within your budget of €${intake.budget_max.toLocaleString()}`)
  else if (total <= intake.budget_max * 1.15) parts.push(`Total cost (€${total.toLocaleString()}) is slightly over your budget but competitive`)
  const ageOk = intake.age_group >= scored.target_age_min && intake.age_group <= scored.target_age_max
  if (ageOk) parts.push(`Your age group fits the school's target range of ${scored.target_age_min}–${scored.target_age_max}`)
  if (scored.accreditation.length > 0) parts.push(`Officially accredited by ${scored.accreditation.join(' and ')}`)
  if (scored.review_count >= 100) parts.push(`${scored.review_count}+ reviews with a ${scored.rating}/5 rating`)
  return parts.length > 0 ? parts.join('. ') + '.' : `${scored.school_name} scores well across multiple criteria that matter to you.`
}

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function SchoolDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const sp       = await searchParams
  const school   = getSchoolBySlug(slug)
  if (!school) notFound()

  const intake       = parseIntakeFromParams(sp)
  const intakeParams = intake ? buildIntakeParams(intake) : ''
  const scored       = intake ? scoreSchool(school, intake, schools) : null
  const reason       = scored && intake ? buildReason(scored, intake) : null
  const weeks        = intake?.duration_weeks ?? 2
  const grandTotal   = (school.avg_week_price + school.accommodation_price_week) * weeks
  const bookUrl      = `/book/${school.slug}${intakeParams ? `?${intakeParams}` : ''}`

  return (
    <div className="min-h-screen bg-bg">
      <Navbar showBackLink backHref={`/results?${intakeParams}`} backLabel="Back to results" />

      {/* Hero */}
      <div className="relative w-full h-60 md:h-80 overflow-hidden">
        <Image src={school.image_url} alt={school.school_name} fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-dark/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 md:px-10">
          <div className="max-w-2xl">
            {scored && <div className="mb-2"><LabelBadge label={scored.label} size="sm" /></div>}
            <h1 className="font-display text-2xl md:text-3xl font-semibold text-white">{school.school_name}</h1>
            <p className="text-white/70 text-sm mt-0.5">{school.city} · {school.country_name}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 md:px-6 py-8 space-y-5 pb-32 md:pb-12">

        {/* Score badges */}
        {scored && (
          <div className="grid grid-cols-3 gap-3 animate-fade-up">
            {[
              { label: 'Match', value: scored.match_score, style: 'border-accent/20 bg-accent-light text-accent' },
              { label: 'Value', value: scored.value_score, style: 'border-blue-200 bg-blue-50 text-blue-700' },
              { label: 'Trust', value: scored.trust_score, style: 'border-violet-200 bg-violet-50 text-violet-700' },
            ].map(({ label, value, style }) => (
              <div key={label} className={`flex flex-col items-center px-3 py-3 rounded-xl border ${style}`}>
                <span className="text-[10px] font-semibold uppercase tracking-wider opacity-70 mb-1">{label}</span>
                <span className="text-2xl font-bold tabular-nums">{value}</span>
              </div>
            ))}
          </div>
        )}

        <p className="text-muted leading-relaxed animate-fade-up-1">{school.description_short}</p>

        {/* Why recommended */}
        {reason && (
          <section className="bg-accent-light border border-accent/20 rounded-2xl p-5 animate-fade-up-1">
            <h2 className="font-display font-semibold text-ink text-base mb-2 flex items-center gap-2">
              <span className="text-accent">✓</span> Why this school is recommended for you
            </h2>
            <p className="text-sm text-ink/80 leading-relaxed">{reason}</p>
            {scored && (
              <div className="mt-4 space-y-2 pt-4 border-t border-accent/20">
                <ScoreBar label="Match" score={scored.match_score} color="match" />
                <ScoreBar label="Value" score={scored.value_score} color="value" />
                <ScoreBar label="Trust" score={scored.trust_score} color="trust" />
              </div>
            )}
          </section>
        )}

        {/* Trade-offs */}
        <section className="bg-card border border-border rounded-2xl p-5 animate-fade-up-2">
          <h2 className="font-display font-semibold text-ink text-base mb-3 flex items-center gap-2">
            <span className="text-amber-500">!</span> Possible considerations
          </h2>
          <ul className="space-y-2">
            {school.trade_offs.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-muted">
                <span className="text-amber-400 mt-0.5 shrink-0">–</span> {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Price context */}
        <section className="bg-card border border-border rounded-2xl p-5 animate-fade-up-2">
          <h2 className="font-display font-semibold text-ink text-base mb-4">Pricing</h2>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-bg rounded-xl px-4 py-3">
              <p className="text-xs text-muted mb-1">Course per week</p>
              <p className="text-xl font-semibold text-ink">€{school.avg_week_price}</p>
            </div>
            <div className="bg-bg rounded-xl px-4 py-3">
              <p className="text-xs text-muted mb-1">Accommodation per week</p>
              <p className="text-xl font-semibold text-ink">€{school.accommodation_price_week}</p>
            </div>
          </div>
          <div className="bg-bg rounded-xl px-4 py-3 mb-4">
            <p className="text-xs text-muted mb-1">Estimated total ({weeks} {weeks === 1 ? 'week' : 'weeks'})</p>
            <p className="text-2xl font-semibold text-ink">€{grandTotal.toLocaleString()}</p>
            <p className="text-xs text-muted mt-0.5">Course + school accommodation</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {scored && (
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${PRICE_BAND_STYLES[scored.price_band]}`}>
                {scored.price_band}
              </span>
            )}
            {school.cashback_possible && school.cashback_amount > 0 && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                €{school.cashback_amount} cashback when booking via LangMatch
              </span>
            )}
          </div>
        </section>

        {/* Course info */}
        <section className="bg-card border border-border rounded-2xl p-5 animate-fade-up-2">
          <h2 className="font-display font-semibold text-ink text-base mb-4">Course details</h2>
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div><p className="text-muted mb-1">Language</p><p className="font-medium text-ink">{school.language}</p></div>
            <div><p className="text-muted mb-1">Minimum duration</p><p className="font-medium text-ink">{school.min_duration_weeks === 1 ? '1 week' : `${school.min_duration_weeks} weeks`}</p></div>
            <div><p className="text-muted mb-1">Age group</p><p className="font-medium text-ink">{school.target_age_min}–{school.target_age_max} years</p></div>
            <div>
              <p className="text-muted mb-1">Cancellation</p>
              <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${CANCEL_COLORS[school.cancellation_policy]}`}>
                {CANCEL_LABELS[school.cancellation_policy]}
              </span>
            </div>
          </div>
          {school.course_types.length > 0 && (
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted mb-2">Course types</p>
              <div className="flex flex-wrap gap-2">
                {school.course_types.map(ct => (
                  <span key={ct} className="text-xs font-medium px-2.5 py-1 rounded-full bg-bg border border-border text-ink">
                    {COURSE_LABELS[ct] ?? ct}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Accommodation */}
        {school.accommodation_types.length > 0 && (
          <section className="bg-card border border-border rounded-2xl p-5 animate-fade-up-3">
            <h2 className="font-display font-semibold text-ink text-base mb-3">Accommodation</h2>
            <p className="text-sm text-muted mb-3">Through the school: <strong className="text-ink">€{school.accommodation_price_week}/week</strong></p>
            <div className="flex flex-wrap gap-2">
              {school.accommodation_types.map(t => (
                <span key={t} className="text-xs font-medium px-2.5 py-1.5 rounded-full bg-bg border border-border text-ink">
                  {ACCOM_LABELS[t] ?? t}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Best for */}
        {school.best_for_tags.length > 0 && (
          <section className="bg-card border border-border rounded-2xl p-5 animate-fade-up-3">
            <h2 className="font-display font-semibold text-ink text-base mb-3">Best for</h2>
            <div className="flex flex-wrap gap-2">
              {school.best_for_tags.map(tag => (
                <span key={tag} className="text-xs font-medium px-3 py-1.5 rounded-full bg-accent-light text-accent border border-accent/20">{tag}</span>
              ))}
            </div>
          </section>
        )}

        {/* Highlights */}
        <section className="bg-card border border-border rounded-2xl p-5 animate-fade-up-3">
          <h2 className="font-display font-semibold text-ink text-base mb-3">Highlights</h2>
          <ul className="space-y-2.5">
            {school.highlights.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-ink">
                <span className="text-accent mt-0.5 shrink-0 font-bold">✓</span> {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Reviews */}
        <section className="bg-card border border-border rounded-2xl p-5 animate-fade-up-3">
          <h2 className="font-display font-semibold text-ink text-base mb-4">Reviews</h2>
          <div className="flex items-center gap-5">
            <div className="text-center">
              <p className="text-4xl font-bold text-ink tabular-nums">{school.rating.toFixed(1)}</p>
              <p className="text-xs text-muted mt-1">out of 5.0</p>
            </div>
            <div className="flex-1">
              <div className="flex gap-0.5 mb-2">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} width="16" height="16" viewBox="0 0 16 16" fill={s <= Math.round(school.rating) ? '#1B4332' : 'none'} stroke={s <= Math.round(school.rating) ? '#1B4332' : '#E8E3DC'}>
                    <path d="M8 1l1.854 3.756L14 5.382l-3 2.924.708 4.131L8 10.25l-3.708 2.187L5 8.306 2 5.382l4.146-.626L8 1z" strokeWidth="1" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-muted">Based on <strong className="text-ink">{school.review_count} reviews</strong></p>
            </div>
          </div>
        </section>

        {/* Trust indicators */}
        <section className="bg-card border border-border rounded-2xl p-5 animate-fade-up-3">
          <h2 className="font-display font-semibold text-ink text-base mb-4">Trust indicators</h2>
          <div className="space-y-3">
            {school.accreditation.length > 0 ? (
              <div className="flex items-start gap-3">
                <span className="text-accent font-bold mt-0.5">✓</span>
                <div><p className="text-sm font-medium text-ink">Officially accredited</p><p className="text-xs text-muted">{school.accreditation.join(' · ')}</p></div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <span className="text-muted mt-0.5">–</span>
                <div><p className="text-sm font-medium text-muted">No formal accreditation</p><p className="text-xs text-muted">Assess based on reviews and price</p></div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <span className={`mt-0.5 font-bold ${school.cancellation_policy === 'flexible' ? 'text-accent' : school.cancellation_policy === 'standard' ? 'text-amber-500' : 'text-red-500'}`}>
                {school.cancellation_policy === 'flexible' ? '✓' : school.cancellation_policy === 'standard' ? '!' : '✗'}
              </span>
              <div>
                <p className="text-sm font-medium text-ink">{CANCEL_LABELS[school.cancellation_policy]}</p>
                {school.cancellation_policy === 'flexible' && <p className="text-xs text-muted">You can cancel without fees if your plans change</p>}
                {school.cancellation_policy === 'strict'   && <p className="text-xs text-muted">Read the cancellation terms carefully before booking</p>}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-accent font-bold mt-0.5">✓</span>
              <div><p className="text-sm font-medium text-ink">Curated school</p><p className="text-xs text-muted">Manually selected and verified by LangMatch</p></div>
            </div>
          </div>
        </section>

        {/* Desktop CTA */}
        <div className="hidden md:block bg-card border border-border rounded-2xl p-5 animate-fade-up-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-ink">Interested in {school.school_name}?</p>
              {school.cashback_possible && <p className="text-xs text-muted mt-0.5">Book via LangMatch and receive €{school.cashback_amount} cashback</p>}
            </div>
            <div className="flex gap-2.5 shrink-0">
              <Link href={bookUrl} className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-xl transition-colors">
                {school.cashback_possible ? `Book — €${school.cashback_amount} cashback` : 'Start application'}
              </Link>
              <Link href={bookUrl} className="px-5 py-2.5 border border-border text-ink text-sm font-medium rounded-xl hover:bg-accent-light transition-colors">
                Request a quote
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-card border-t border-border p-4">
        <div className="flex gap-2.5">
          <Link href={bookUrl} className="flex-1 text-center py-3.5 bg-accent hover:bg-accent-hover text-white font-medium text-sm rounded-xl transition-colors">
            {school.cashback_possible ? `Book — €${school.cashback_amount} cashback` : 'Start application'}
          </Link>
          <Link href={bookUrl} className="px-4 py-3.5 border border-border text-ink text-sm font-medium rounded-xl hover:bg-bg transition-colors">
            Quote
          </Link>
        </div>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  return schools.map(s => ({ slug: s.slug }))
}
