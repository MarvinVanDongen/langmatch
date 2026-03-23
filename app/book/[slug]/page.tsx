import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { schools, getSchoolBySlug } from '@/lib/data/schools'
import { parseIntakeFromParams, buildIntakeParams, scoreSchool } from '@/lib/scoring'
import Navbar from '@/components/Navbar'
import LabelBadge from '@/components/LabelBadge'
import BookForm from '@/components/BookForm'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function BookPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const sp       = await searchParams
  const school   = getSchoolBySlug(slug)
  if (!school) notFound()

  const intake       = parseIntakeFromParams(sp)
  const intakeParams = intake ? buildIntakeParams(intake) : ''
  const scored       = intake ? scoreSchool(school, intake, schools) : null
  const weeks        = intake?.duration_weeks ?? 2
  const courseTotal  = school.avg_week_price * weeks
  const accomTotal   = school.accommodation_price_week * weeks

  return (
    <div className="min-h-screen bg-bg">
      <Navbar showBackLink backHref={`/school/${school.slug}?${intakeParams}`} backLabel="Back to school" />

      <div className="max-w-2xl mx-auto px-5 md:px-6 py-6 pb-16">
        {/* School summary */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden mb-8 shadow-card">
          <div className="relative h-36 w-full">
            <Image src={school.image_url} alt={school.school_name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 672px" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
              <div>
                <h2 className="font-display font-semibold text-lg text-white leading-tight">{school.school_name}</h2>
                <p className="text-white/70 text-xs mt-0.5">{school.city} · {school.country_name}</p>
              </div>
              {scored && <LabelBadge label={scored.label} size="sm" />}
            </div>
          </div>
          <div className="px-4 py-3 flex flex-wrap gap-3 items-center border-t border-border bg-bg/40">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted">Course:</span>
              <span className="text-sm font-semibold text-ink">€{school.avg_week_price}/week</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted">Accommodation:</span>
              <span className="text-sm font-semibold text-ink">€{school.accommodation_price_week}/week</span>
            </div>
            {school.cashback_possible && school.cashback_amount > 0 && (
              <>
                <div className="w-px h-4 bg-border" />
                <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                  €{school.cashback_amount} cashback
                </span>
              </>
            )}
          </div>
        </div>

        {/* Cost estimate */}
        {intake && (
          <div className="bg-accent-light border border-accent/20 rounded-2xl p-4 mb-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-3">Your estimated costs</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Course ({weeks} {weeks === 1 ? 'week' : 'weeks'})</span>
                <span className="font-medium text-ink">€{courseTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Accommodation ({weeks} {weeks === 1 ? 'week' : 'weeks'})</span>
                <span className="font-medium text-ink">€{accomTotal.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-accent/20 flex justify-between">
                <span className="text-sm font-semibold text-ink">Total (indicative)</span>
                <span className="text-base font-bold text-ink">€{(courseTotal + accomTotal).toLocaleString()}</span>
              </div>
              {school.cashback_possible && (
                <div className="flex justify-between text-sm">
                  <span className="text-accent font-medium">Cashback after booking</span>
                  <span className="text-accent font-bold">− €{school.cashback_amount}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-card rounded-2xl border border-border p-5 md:p-6 shadow-card">
          <h1 className="font-display text-2xl font-semibold text-ink mb-1">
            Apply for {school.school_name}
          </h1>
          <p className="text-sm text-muted mb-6">
            Fill in your details and we'll make sure the school gets back to you as soon as possible.
            {school.cashback_possible && <> You'll receive €{school.cashback_amount} cashback after your booking is confirmed.</>}
          </p>
          <BookForm school={school} intakeParams={intakeParams} />
        </div>

        {/* Trust note */}
        <div className="mt-6 flex flex-col gap-2 items-center text-center">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted">
            {['No hidden fees', 'No account required', 'Privacy guaranteed'].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.25" />
                  <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                </svg>
                {t}
              </span>
            ))}
          </div>
          {intakeParams && (
            <Link href={`/results?${intakeParams}`} className="text-xs text-muted hover:text-ink transition-colors underline underline-offset-2 mt-1">
              ← Back to your other matches
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  const { schools: all } = await import('@/lib/data/schools')
  return all.map(s => ({ slug: s.slug }))
}
