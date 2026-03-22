import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { schools, getSchoolBySlug } from '@/lib/data/schools'
import { scoreSchool, parseIntakeFromParams, buildIntakeParams } from '@/lib/scoring'
import type { IntakeAnswers, ScoredSchool } from '@/lib/types'
import Navbar from '@/components/Navbar'
import LabelBadge from '@/components/LabelBadge'
import ScoreBar from '@/components/ScoreBar'

// ─── Helpers ────────────────────────────────────────────────────────────────

const PRICE_BAND_STYLES = {
  LOW: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'FAIR VALUE': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  PREMIUM: 'bg-amber-50 text-amber-700 border-amber-200',
  OVERPRICED: 'bg-red-50 text-red-700 border-red-200',
}

const CANCEL_LABELS = {
  flexible: 'Flexibel annuleerbaar',
  standard: 'Standaard annuleringsbeleid',
  strict: 'Strikt annuleringsbeleid',
}

const CANCEL_COLORS = {
  flexible: 'text-emerald-700 bg-emerald-50',
  standard: 'text-amber-700 bg-amber-50',
  strict: 'text-red-700 bg-red-50',
}

const COURSE_TYPE_LABELS: Record<string, string> = {
  conversational: 'Conversatie',
  intensive: 'Intensief',
  general: 'Algemeen',
  exam_prep: 'Examenvoorbereiding',
  business: 'Zakelijk taalgebruik',
  immersive: 'Taaldompeling',
  cultural: 'Taal & cultuur',
  holiday: 'Vakantie + taal',
}

const ACCOM_LABELS: Record<string, string> = {
  homestay: 'Gastgezin',
  shared_apartment: 'Gedeeld appartement',
  residence: 'Schoolresidentie',
  studio: 'Studio-appartement',
}

// ─── "Why recommended for you" block ────────────────────────────────────────

function buildDetailedReason(scored: ScoredSchool, intake: IntakeAnswers): string {
  const parts: string[] = []
  const courseTotal = scored.avg_week_price * intake.duration_weeks
  const accomTotal =
    intake.accommodation_pref === 'school'
      ? scored.accommodation_price_week * intake.duration_weeks
      : 0
  const total = courseTotal + accomTotal

  if (intake.destination !== 'ANY') {
    parts.push(`Je zoekt een school in ${scored.country_name} — deze school staat in ${scored.city}`)
  }

  if (total <= intake.budget_max) {
    parts.push(`De totale kosten (€${total.toLocaleString('nl-NL')}) vallen binnen je budget van €${intake.budget_max.toLocaleString('nl-NL')}`)
  } else if (total <= intake.budget_max * 1.15) {
    parts.push(`De totale kosten (€${total.toLocaleString('nl-NL')}) liggen net boven je budget, maar zijn vergelijkbaar met andere opties`)
  }

  const ageOk = intake.age_group >= scored.target_age_min && intake.age_group <= scored.target_age_max
  if (ageOk) {
    parts.push(`Jouw leeftijdsgroep (${scored.target_age_min}–${scored.target_age_max} jaar) past precies bij de doelgroep van deze school`)
  }

  if (scored.accreditation.length > 0) {
    parts.push(`De school is officieel geaccrediteerd door ${scored.accreditation.join(' en ')}`)
  }

  if (scored.review_count >= 100) {
    parts.push(`Met ${scored.review_count}+ beoordelingen en een score van ${scored.rating}/5 is de kwaliteit goed gedocumenteerd`)
  }

  return parts.length > 0
    ? parts.join('. ') + '.'
    : `${scored.school_name} scoort goed op meerdere criteria die voor jou belangrijk zijn.`
}

// ─── Score badge component ───────────────────────────────────────────────────

function ScoreBadge({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`flex flex-col items-center px-4 py-3 rounded-xl border ${color}`}>
      <span className="text-[10px] font-semibold uppercase tracking-wider opacity-70 mb-1">{label}</span>
      <span className="text-2xl font-bold tabular-nums leading-none">{value}</span>
    </div>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function SchoolDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const sp = await searchParams

  const school = getSchoolBySlug(slug)
  if (!school) notFound()

  // Parse intake if present (used for "why this school" section)
  const intake = parseIntakeFromParams(sp)
  const intakeParams = intake ? buildIntakeParams(intake) : ''

  // Score the school if we have intake data
  const scored: ScoredSchool | null = intake
    ? scoreSchool(school, intake, schools)
    : null

  const detailReason = scored && intake ? buildDetailedReason(scored, intake) : null

  // Estimated total
  const weeksForEstimate = intake?.duration_weeks ?? 2
  const courseTotal = school.avg_week_price * weeksForEstimate
  const accomTotal = school.accommodation_price_week * weeksForEstimate
  const grandTotal = courseTotal + accomTotal

  const bookUrl = `/book/${school.slug}${intakeParams ? `?${intakeParams}` : ''}`

  return (
    <div className="min-h-screen bg-bg">
      <Navbar showBackLink backHref={`/results?${intakeParams}`} backLabel="Terug naar resultaten" />

      {/* ─── HERO IMAGE ───────────────────────────────────────────────── */}
      <div className="relative w-full h-56 md:h-72 overflow-hidden">
        <Image
          src={school.image_url}
          alt={school.school_name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent" />

        {/* Overlay info */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 md:px-10">
          <div className="max-w-2xl">
            {scored && (
              <div className="mb-2">
                <LabelBadge label={scored.label} size="sm" />
              </div>
            )}
            <h1 className="font-display text-2xl md:text-3xl font-semibold text-white leading-tight">
              {school.school_name}
            </h1>
            <p className="text-white/80 text-sm mt-0.5">
              {school.city} · {school.country_name}
            </p>
          </div>
        </div>
      </div>

      {/* ─── MAIN CONTENT ─────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-5 md:px-6 py-8 space-y-6 pb-32 md:pb-12">

        {/* Score badges (only if we have scores) */}
        {scored && (
          <div className="grid grid-cols-3 gap-3 animate-fade-up">
            <ScoreBadge label="Match" value={scored.match_score} color="border-accent/20 bg-accent-light text-accent" />
            <ScoreBadge label="Waarde" value={scored.value_score} color="border-blue-200 bg-blue-50 text-blue-700" />
            <ScoreBadge label="Vertrouwen" value={scored.trust_score} color="border-violet-200 bg-violet-50 text-violet-700" />
          </div>
        )}

        {/* Description */}
        <div className="animate-fade-up-1">
          <p className="text-muted leading-relaxed">{school.description_short}</p>
        </div>

        {/* ── Why recommended for you ── */}
        {detailReason && (
          <section className="bg-accent-light border border-accent/20 rounded-2xl p-5 animate-fade-up-1">
            <h2 className="font-display font-semibold text-ink text-base mb-2 flex items-center gap-2">
              <span className="text-accent">✓</span>
              Waarom aanbevolen voor jou
            </h2>
            <p className="text-sm text-ink/80 leading-relaxed">{detailReason}</p>

            {/* Mini score bars */}
            {scored && (
              <div className="mt-4 space-y-2 pt-4 border-t border-accent/20">
                <ScoreBar label="Match" score={scored.match_score} color="match" />
                <ScoreBar label="Waarde" score={scored.value_score} color="value" />
                <ScoreBar label="Vertrouwen" score={scored.trust_score} color="trust" />
              </div>
            )}
          </section>
        )}

        {/* ── Trade-offs ── */}
        <section className="bg-card border border-border rounded-2xl p-5 animate-fade-up-2">
          <h2 className="font-display font-semibold text-ink text-base mb-3 flex items-center gap-2">
            <span className="text-amber-500">!</span>
            Mogelijke aandachtspunten
          </h2>
          <ul className="space-y-2">
            {school.trade_offs.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-muted">
                <span className="text-amber-400 mt-0.5 shrink-0">–</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* ── Price context ── */}
        <section className="bg-card border border-border rounded-2xl p-5 animate-fade-up-2">
          <h2 className="font-display font-semibold text-ink text-base mb-4">Prijscontext</h2>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-bg rounded-xl px-4 py-3">
              <p className="text-xs text-muted mb-1">Cursus per week</p>
              <p className="text-xl font-semibold text-ink">€{school.avg_week_price}</p>
            </div>
            <div className="bg-bg rounded-xl px-4 py-3">
              <p className="text-xs text-muted mb-1">Verblijf per week</p>
              <p className="text-xl font-semibold text-ink">€{school.accommodation_price_week}</p>
            </div>
          </div>

          <div className="bg-bg rounded-xl px-4 py-3 mb-4">
            <p className="text-xs text-muted mb-1">
              Geschatte totaalkosten ({weeksForEstimate} {weeksForEstimate === 1 ? 'week' : 'weken'})
            </p>
            <p className="text-2xl font-semibold text-ink">
              €{grandTotal.toLocaleString('nl-NL')}
            </p>
            <p className="text-xs text-muted mt-0.5">Cursus + verblijf via school</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {scored && (
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${PRICE_BAND_STYLES[scored.price_band]}`}>
                {scored.price_band}
              </span>
            )}
            {school.cashback_possible && school.cashback_amount > 0 && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                €{school.cashback_amount} cashback bij boeking via LangMatch
              </span>
            )}
          </div>
        </section>

        {/* ── Course details ── */}
        <section className="bg-card border border-border rounded-2xl p-5 animate-fade-up-2">
          <h2 className="font-display font-semibold text-ink text-base mb-4">Cursusinfo</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted mb-1">Taal</p>
              <p className="font-medium text-ink">{school.language}</p>
            </div>
            <div>
              <p className="text-muted mb-1">Minimale duur</p>
              <p className="font-medium text-ink">
                {school.min_duration_weeks === 1 ? '1 week' : `${school.min_duration_weeks} weken`}
              </p>
            </div>
            <div>
              <p className="text-muted mb-1">Leeftijdsgroep</p>
              <p className="font-medium text-ink">{school.target_age_min}–{school.target_age_max} jaar</p>
            </div>
            <div>
              <p className="text-muted mb-1">Annuleringsbeleid</p>
              <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${CANCEL_COLORS[school.cancellation_policy]}`}>
                {CANCEL_LABELS[school.cancellation_policy]}
              </span>
            </div>
          </div>

          {school.course_types.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted mb-2">Cursustypen</p>
              <div className="flex flex-wrap gap-2">
                {school.course_types.map((ct) => (
                  <span
                    key={ct}
                    className="text-xs font-medium px-2.5 py-1 rounded-full bg-bg border border-border text-ink"
                  >
                    {COURSE_TYPE_LABELS[ct] ?? ct}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ── Accommodation ── */}
        {school.accommodation_types.length > 0 && (
          <section className="bg-card border border-border rounded-2xl p-5 animate-fade-up-3">
            <h2 className="font-display font-semibold text-ink text-base mb-3">Verblijfsmogelijkheden</h2>
            <p className="text-sm text-muted mb-3">
              Verblijf via de school: <strong className="text-ink">€{school.accommodation_price_week}/week</strong>
            </p>
            <div className="flex flex-wrap gap-2">
              {school.accommodation_types.map((type) => (
                <span
                  key={type}
                  className="text-xs font-medium px-2.5 py-1.5 rounded-full bg-bg border border-border text-ink"
                >
                  {ACCOM_LABELS[type] ?? type}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* ── Best for tags ── */}
        {school.best_for_tags.length > 0 && (
          <section className="bg-card border border-border rounded-2xl p-5 animate-fade-up-3">
            <h2 className="font-display font-semibold text-ink text-base mb-3">
              Het beste voor
            </h2>
            <div className="flex flex-wrap gap-2">
              {school.best_for_tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium px-3 py-1.5 rounded-full bg-accent-light text-accent border border-accent/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* ── Highlights ── */}
        {school.highlights.length > 0 && (
          <section className="bg-card border border-border rounded-2xl p-5 animate-fade-up-3">
            <h2 className="font-display font-semibold text-ink text-base mb-3">Hoogtepunten</h2>
            <ul className="space-y-2.5">
              {school.highlights.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-ink">
                  <span className="text-accent mt-0.5 shrink-0 font-bold">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Reviews ── */}
        <section className="bg-card border border-border rounded-2xl p-5 animate-fade-up-3">
          <h2 className="font-display font-semibold text-ink text-base mb-4">Beoordelingen</h2>
          <div className="flex items-center gap-5">
            <div className="text-center">
              <p className="text-4xl font-bold text-ink tabular-nums">{school.rating.toFixed(1)}</p>
              <p className="text-xs text-muted mt-1">van 5.0</p>
            </div>
            <div className="flex-1">
              {/* Stars */}
              <div className="flex gap-0.5 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill={star <= Math.round(school.rating) ? '#2A6944' : 'none'}
                    stroke={star <= Math.round(school.rating) ? '#2A6944' : '#E6E0D8'}
                  >
                    <path d="M8 1l1.854 3.756L14 5.382l-3 2.924.708 4.131L8 10.25l-3.708 2.187L5 8.306 2 5.382l4.146-.626L8 1z" strokeWidth="1" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-muted">
                Gebaseerd op <strong className="text-ink">{school.review_count} beoordelingen</strong>
              </p>
            </div>
          </div>
        </section>

        {/* ── Trust indicators ── */}
        <section className="bg-card border border-border rounded-2xl p-5 animate-fade-up-3">
          <h2 className="font-display font-semibold text-ink text-base mb-4">Vertrouwenssignalen</h2>
          <div className="space-y-3">
            {school.accreditation.length > 0 ? (
              <div className="flex items-start gap-3">
                <span className="text-accent font-bold mt-0.5">✓</span>
                <div>
                  <p className="text-sm font-medium text-ink">Officieel geaccrediteerd</p>
                  <p className="text-xs text-muted">{school.accreditation.join(' · ')}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <span className="text-muted mt-0.5">–</span>
                <div>
                  <p className="text-sm font-medium text-muted">Geen formele accreditatie</p>
                  <p className="text-xs text-muted">Beoordeel op basis van reviews en prijs</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <span className={`mt-0.5 font-bold ${school.cancellation_policy === 'flexible' ? 'text-accent' : school.cancellation_policy === 'standard' ? 'text-amber-500' : 'text-red-500'}`}>
                {school.cancellation_policy === 'flexible' ? '✓' : school.cancellation_policy === 'standard' ? '!' : '✗'}
              </span>
              <div>
                <p className="text-sm font-medium text-ink">{CANCEL_LABELS[school.cancellation_policy]}</p>
                {school.cancellation_policy === 'flexible' && (
                  <p className="text-xs text-muted">Je kunt kosteloos annuleren als je plannen wijzigen</p>
                )}
                {school.cancellation_policy === 'strict' && (
                  <p className="text-xs text-muted">Lees de annuleringsvoorwaarden goed door</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-accent font-bold mt-0.5">✓</span>
              <div>
                <p className="text-sm font-medium text-ink">Gecureerde school</p>
                <p className="text-xs text-muted">Handmatig geselecteerd en gecontroleerd door LangMatch</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Desktop CTA ── */}
        <div className="hidden md:block bg-card border border-border rounded-2xl p-5 animate-fade-up-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-ink">Interesse in {school.school_name}?</p>
              {school.cashback_possible && (
                <p className="text-xs text-muted mt-0.5">
                  Boek via LangMatch en ontvang €{school.cashback_amount} cashback
                </p>
              )}
            </div>
            <div className="flex gap-2.5 shrink-0">
              <Link
                href={bookUrl}
                className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-xl transition-colors"
              >
                {school.cashback_possible
                  ? `Boek met €${school.cashback_amount} cashback`
                  : 'Aanvraag starten'}
              </Link>
              <Link
                href={bookUrl}
                className="px-5 py-2.5 border border-border text-ink text-sm font-medium rounded-xl hover:border-accent/50 hover:bg-accent-light transition-colors"
              >
                Offerte aanvragen
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky CTA — mobile only ── */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-card border-t border-border p-4 safe-area-pb">
        <div className="flex gap-2.5">
          <Link
            href={bookUrl}
            className="flex-1 text-center py-3.5 bg-accent hover:bg-accent-hover text-white font-medium text-sm rounded-xl transition-colors"
          >
            {school.cashback_possible
              ? `Boek met €${school.cashback_amount} cashback`
              : 'Aanvraag starten'}
          </Link>
          <Link
            href={bookUrl}
            className="px-4 py-3.5 border border-border text-ink text-sm font-medium rounded-xl hover:bg-bg transition-colors"
          >
            Offerte
          </Link>
        </div>
      </div>
    </div>
  )
}

// Generate static params for all school slugs
export async function generateStaticParams() {
  return schools.map((school) => ({ slug: school.slug }))
}
