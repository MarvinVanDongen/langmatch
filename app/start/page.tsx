'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { IntakeAnswers, DestinationParam, GoalParam, DurationParam, BudgetParam, AgeParam, AccomParam } from '@/lib/types'

// ─── Step definitions ───────────────────────────────────────────────────────

interface StepOption {
  label: string
  value: string
  sublabel?: string
}

interface Step {
  key: keyof IntakeAnswers
  question: string
  hint?: string
  options: StepOption[]
  optional?: boolean
}

const STEPS: Step[] = [
  {
    key: 'destination',
    question: 'Waar wil je naartoe?',
    hint: 'Je kunt later verfijnen op stad.',
    options: [
      { label: 'Spanje', value: 'ES', sublabel: 'Barcelona, Sevilla, Málaga…' },
      { label: 'Portugal', value: 'PT', sublabel: 'Lissabon, Porto, Faro…' },
      { label: 'Malta', value: 'MT', sublabel: 'St Julian\'s, Sliema, Gozo…' },
      { label: 'Verras me', value: 'ANY', sublabel: 'Toon de beste match overall' },
    ],
  },
  {
    key: 'goal',
    question: 'Wat is je doel?',
    hint: 'Kies wat het beste past bij je reden om te gaan.',
    options: [
      { label: 'Taal + vakantie combineren', value: 'holiday', sublabel: 'Leren én genieten' },
      { label: 'Zo snel mogelijk vloeiend', value: 'fluency', sublabel: 'Intensief leren' },
      { label: 'Examenvoorbereiding', value: 'exam', sublabel: 'DELE, IELTS of Cambridge' },
      { label: 'Taal voor mijn carrière', value: 'career', sublabel: 'Zakelijk taalgebruik' },
      { label: 'Gap year / sabbatical', value: 'gap', sublabel: 'Leren in je eigen tempo' },
    ],
  },
  {
    key: 'duration_weeks',
    question: 'Hoe lang wil je gaan?',
    hint: 'Inclusief weekend, exclusief reisdagen.',
    options: [
      { label: '1 week', value: '1' },
      { label: '2 weken', value: '2' },
      { label: '3–4 weken', value: '3' },
      { label: '6 weken of meer', value: '6' },
    ],
  },
  {
    key: 'budget_max',
    question: 'Wat is je totaalbudget?',
    hint: 'Cursus en verblijf samen.',
    options: [
      { label: 'Tot €900', value: '900', sublabel: 'Snel weekje weg' },
      { label: '€900 – €1.500', value: '1500', sublabel: 'Populairste keuze' },
      { label: '€1.500 – €2.500', value: '2500', sublabel: 'Meer ruimte' },
      { label: '€2.500 of meer', value: '9999', sublabel: 'Geen prijslimiet' },
    ],
  },
  {
    key: 'age_group',
    question: 'Hoe oud ben je?',
    hint: 'Scholen richten zich op specifieke leeftijdsgroepen.',
    options: [
      { label: '18–24', value: '21' },
      { label: '25–35', value: '30' },
      { label: '35–50', value: '42' },
      { label: '50+', value: '55' },
    ],
  },
  {
    key: 'accommodation_pref',
    question: 'Wil je verblijf via de school regelen?',
    hint: 'Je kunt dit later altijd nog wijzigen.',
    optional: true,
    options: [
      { label: 'Ja, liefst via de school', value: 'school', sublabel: 'Wil ik geregeld hebben' },
      { label: 'Ik regel het zelf', value: 'self', sublabel: 'Airbnb, hostel, etc.' },
      { label: 'Maakt me niet uit', value: 'any', sublabel: 'Ik sta overal voor open' },
    ],
  },
]

export default function StartPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')
  const [answers, setAnswers] = useState<Partial<Record<keyof IntakeAnswers, string>>>({})

  const step = STEPS[currentStep]
  const selectedValue = answers[step.key]
  const isLastStep = currentStep === STEPS.length - 1
  const canProceed = !!selectedValue || step.optional

  function selectOption(value: string) {
    setAnswers((prev) => ({ ...prev, [step.key]: value }))
  }

  function goNext() {
    if (!canProceed) return
    if (isLastStep) {
      submitIntake()
    } else {
      setDirection('forward')
      setCurrentStep((prev) => prev + 1)
    }
  }

  function goBack() {
    if (currentStep === 0) {
      router.push('/')
      return
    }
    setDirection('back')
    setCurrentStep((prev) => prev - 1)
  }

  function skipStep() {
    setAnswers((prev) => ({ ...prev, [step.key]: 'any' }))
    submitIntake({ [step.key]: 'any' })
  }

  function submitIntake(override?: Partial<Record<keyof IntakeAnswers, string>>) {
    const final = { ...answers, ...override }

    const params = new URLSearchParams({
      dest: (final.destination as DestinationParam) ?? 'ANY',
      goal: (final.goal as GoalParam) ?? 'holiday',
      weeks: String((final.duration_weeks as DurationParam) ?? '2'),
      budget: String((final.budget_max as BudgetParam) ?? '1500'),
      age: String((final.age_group as AgeParam) ?? '21'),
      acc: (final.accommodation_pref as AccomParam) ?? 'any',
    })

    router.push(`/results?${params.toString()}`)
  }

  const progressPercent = ((currentStep + (selectedValue ? 1 : 0)) / STEPS.length) * 100

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Progress bar at very top */}
      <div className="h-1 bg-border">
        <div
          className="h-full bg-accent transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Nav */}
      <div className="px-6 py-4 flex items-center justify-between">
        <button
          onClick={goBack}
          className="flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {currentStep === 0 ? 'Home' : 'Terug'}
        </button>

        <span className="font-display font-semibold text-ink">LangMatch</span>

        <span className="text-xs text-muted tabular-nums">
          {currentStep + 1} / {STEPS.length}
        </span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div
          key={currentStep}
          className={`w-full max-w-md ${direction === 'forward' ? 'animate-slide-in' : 'animate-slide-in-back'}`}
        >
          {/* Question */}
          <h1 className="font-display text-3xl md:text-4xl font-medium text-ink leading-tight mb-2">
            {step.question}
          </h1>
          {step.hint && (
            <p className="text-sm text-muted mb-8">{step.hint}</p>
          )}
          {!step.hint && <div className="mb-8" />}

          {/* Options */}
          <div className="space-y-2.5">
            {step.options.map((option) => {
              const isSelected = selectedValue === option.value
              return (
                <button
                  key={option.value}
                  onClick={() => selectOption(option.value)}
                  className={`
                    w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-150 flex items-center justify-between group
                    ${isSelected
                      ? 'border-accent bg-accent-light'
                      : 'border-border bg-card hover:border-accent/40 hover:bg-accent-light/30'
                    }
                  `}
                >
                  <div>
                    <span className={`font-medium text-base block ${isSelected ? 'text-ink' : 'text-ink'}`}>
                      {option.label}
                    </span>
                    {option.sublabel && (
                      <span className="text-sm text-muted mt-0.5 block">{option.sublabel}</span>
                    )}
                  </div>
                  <div
                    className={`
                      w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all
                      ${isSelected ? 'border-accent bg-accent' : 'border-border group-hover:border-accent/50'}
                    `}
                  >
                    {isSelected && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Navigation */}
          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={goNext}
              disabled={!canProceed}
              className={`
                w-full py-3.5 px-6 rounded-xl font-medium text-base transition-all flex items-center justify-center gap-2
                ${canProceed
                  ? 'bg-accent hover:bg-accent-hover text-white shadow-sm'
                  : 'bg-border text-muted cursor-not-allowed'
                }
              `}
            >
              {isLastStep ? 'Toon mijn top 3' : 'Volgende'}
              {canProceed && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>

            {step.optional && (
              <button
                onClick={skipStep}
                className="w-full py-2.5 text-sm text-muted hover:text-ink transition-colors"
              >
                Overslaan →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Dot progress indicator */}
      <div className="pb-8 flex items-center justify-center gap-2">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i < currentStep
                ? 'w-4 h-1.5 bg-accent'
                : i === currentStep
                ? 'w-6 h-1.5 bg-accent'
                : 'w-1.5 h-1.5 bg-border'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
