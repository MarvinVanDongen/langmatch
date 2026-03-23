'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { IntakeAnswers } from '@/lib/types'

interface StepOption { label: string; value: string; sublabel?: string }
interface Step { key: keyof IntakeAnswers; question: string; hint?: string; options: StepOption[]; optional?: boolean }

const STEPS: Step[] = [
  {
    key: 'destination', question: 'Where do you want to go?', hint: 'You can refine by city later.',
    options: [
      { label: 'Spain',    value: 'ES', sublabel: 'Barcelona, Seville, Málaga…' },
      { label: 'Portugal', value: 'PT', sublabel: 'Lisbon, Porto, Faro…' },
      { label: 'Malta',    value: 'MT', sublabel: "St Julian's, Sliema, Gozo…" },
      { label: 'Surprise me', value: 'ANY', sublabel: 'Show the best match overall' },
    ],
  },
  {
    key: 'goal', question: "What's your main goal?", hint: 'Choose the option that best describes your reason for going.',
    options: [
      { label: 'Language + holiday',     value: 'holiday', sublabel: 'Learn while having fun' },
      { label: 'Become fluent fast',     value: 'fluency', sublabel: 'Intensive learning' },
      { label: 'Exam preparation',       value: 'exam',    sublabel: 'DELE, IELTS or Cambridge' },
      { label: 'Language for my career', value: 'career',  sublabel: 'Business language skills' },
      { label: 'Gap year / sabbatical',  value: 'gap',     sublabel: 'Learn at my own pace' },
    ],
  },
  {
    key: 'duration_weeks', question: 'How long do you want to go?', hint: 'Including weekends, excluding travel days.',
    options: [
      { label: '1 week' },
      { label: '2 weeks' },
      { label: '3–4 weeks' },
      { label: '6 weeks or more' },
    ].map((o, i) => ({ ...o, value: ['1','2','3','6'][i] })),
  },
  {
    key: 'budget_max', question: "What's your total budget?", hint: 'Course and accommodation combined.',
    options: [
      { label: 'Under €900',      value: '900',  sublabel: 'Short trip' },
      { label: '€900 – €1,500',   value: '1500', sublabel: 'Most popular' },
      { label: '€1,500 – €2,500', value: '2500', sublabel: 'More flexibility' },
      { label: '€2,500 or more',  value: '9999', sublabel: 'No price limit' },
    ],
  },
  {
    key: 'age_group', question: 'How old are you?', hint: 'Schools target specific age groups.',
    options: [
      { label: '18–24', value: '21' },
      { label: '25–35', value: '30' },
      { label: '35–50', value: '42' },
      { label: '50+',   value: '55' },
    ],
  },
  {
    key: 'accommodation_pref', question: 'Do you want accommodation through the school?', hint: 'You can always change this later.',
    optional: true,
    options: [
      { label: 'Yes, through the school', value: 'school', sublabel: 'I want it arranged' },
      { label: "I'll arrange it myself",  value: 'self',   sublabel: 'Airbnb, hostel, etc.' },
      { label: "Doesn't matter to me",    value: 'any',    sublabel: "I'm open to anything" },
    ],
  },
]

export default function StartPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')
  const [answers, setAnswers] = useState<Partial<Record<keyof IntakeAnswers, string>>>({})

  const step      = STEPS[currentStep]
  const selected  = answers[step.key]
  const isLast    = currentStep === STEPS.length - 1
  const canNext   = !!selected || step.optional

  function select(value: string) { setAnswers(p => ({ ...p, [step.key]: value })) }

  function goNext() {
    if (!canNext) return
    if (isLast) submit()
    else { setDirection('forward'); setCurrentStep(p => p + 1) }
  }

  function goBack() {
    if (currentStep === 0) { router.push('/'); return }
    setDirection('back'); setCurrentStep(p => p - 1)
  }

  function submit(override?: Partial<Record<keyof IntakeAnswers, string>>) {
    const final = { ...answers, ...override }
    const params = new URLSearchParams({
      dest:   String(final.destination   ?? 'ANY'),
      goal:   String(final.goal          ?? 'holiday'),
      weeks:  String(final.duration_weeks ?? '2'),
      budget: String(final.budget_max    ?? '1500'),
      age:    String(final.age_group     ?? '21'),
      acc:    String(final.accommodation_pref ?? 'any'),
    })
    router.push(`/results?${params.toString()}`)
  }

  const progress = ((currentStep + (selected ? 1 : 0)) / STEPS.length) * 100

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Progress bar */}
      <div className="h-0.5 bg-border">
        <div className="h-full bg-accent transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>

      {/* Nav */}
      <div className="px-6 py-4 flex items-center justify-between">
        <button onClick={goBack} className="flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {currentStep === 0 ? 'Home' : 'Back'}
        </button>
        <span className="font-display font-semibold text-ink">LangMatch</span>
        <span className="text-xs text-muted tabular-nums">{currentStep + 1} / {STEPS.length}</span>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div key={currentStep} className={`w-full max-w-md ${direction === 'forward' ? 'animate-slide-in' : 'animate-slide-in-back'}`}>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-ink leading-tight mb-2">
            {step.question}
          </h1>
          {step.hint && <p className="text-sm text-muted mb-8">{step.hint}</p>}
          {!step.hint && <div className="mb-8" />}

          <div className="space-y-2.5">
            {step.options.map(opt => {
              const isSel = selected === opt.value
              return (
                <button key={opt.value} onClick={() => select(opt.value)}
                  className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-150 flex items-center justify-between group
                    ${isSel ? 'border-accent bg-accent-light' : 'border-border bg-card hover:border-accent/40 hover:bg-accent-light/30'}`}
                >
                  <div>
                    <span className="font-medium text-base text-ink block">{opt.label}</span>
                    {opt.sublabel && <span className="text-sm text-muted mt-0.5 block">{opt.sublabel}</span>}
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all
                    ${isSel ? 'border-accent bg-accent' : 'border-border group-hover:border-accent/50'}`}>
                    {isSel && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <button onClick={goNext} disabled={!canNext}
              className={`w-full py-3.5 px-6 rounded-xl font-medium text-base transition-all flex items-center justify-center gap-2
                ${canNext ? 'bg-accent hover:bg-accent-hover text-white shadow-sm' : 'bg-border text-muted cursor-not-allowed'}`}
            >
              {isLast ? 'Show my top 3' : 'Next'}
              {canNext && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            {step.optional && (
              <button onClick={() => submit({ [step.key]: 'any' })}
                className="w-full py-2.5 text-sm text-muted hover:text-ink transition-colors">
                Skip this step →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Dot progress */}
      <div className="pb-8 flex items-center justify-center gap-2">
        {STEPS.map((_, i) => (
          <div key={i} className={`rounded-full transition-all duration-300 ${
            i < currentStep ? 'w-4 h-1.5 bg-accent' : i === currentStep ? 'w-6 h-1.5 bg-accent' : 'w-1.5 h-1.5 bg-border'
          }`} />
        ))}
      </div>
    </div>
  )
}
