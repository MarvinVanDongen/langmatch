'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { School } from '@/lib/types'

interface BookFormProps {
  school: School
  intakeParams: string
}

interface FormData {
  voornaam: string
  email: string
  telefoon: string
  startperiode: string
  bericht: string
}

export default function BookForm({ school, intakeParams }: BookFormProps) {
  const router = useRouter()
  const [form, setForm] = useState<FormData>({
    voornaam: '',
    email: '',
    telefoon: '',
    startperiode: '',
    bericht: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  function validate(): boolean {
    const newErrors: Partial<FormData> = {}
    if (!form.voornaam.trim()) newErrors.voornaam = 'Voornaam is verplicht'
    if (!form.email.trim()) newErrors.email = 'E-mailadres is verplicht'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'Voer een geldig e-mailadres in'
    return Object.keys(newErrors).length === 0
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)

    // Store lead in localStorage (no backend in MVP)
    const lead = {
      school_id: school.id,
      school_name: school.school_name,
      school_slug: school.slug,
      ...form,
      intake_params: intakeParams,
      submitted_at: new Date().toISOString(),
    }

    try {
      const existing = JSON.parse(localStorage.getItem('langmatch_leads') ?? '[]')
      existing.push(lead)
      localStorage.setItem('langmatch_leads', JSON.stringify(existing))
    } catch {
      // localStorage not available – fine for MVP
    }

    // Simulate short processing delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    router.push(`/bedankt?school=${encodeURIComponent(school.school_name)}&cashback=${school.cashback_amount}&${intakeParams}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Voornaam */}
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="voornaam">
          Voornaam <span className="text-red-400">*</span>
        </label>
        <input
          id="voornaam"
          name="voornaam"
          type="text"
          value={form.voornaam}
          onChange={handleChange}
          placeholder="Bijv. Emma"
          autoComplete="given-name"
          className={`w-full px-4 py-3 bg-white border rounded-xl text-ink placeholder:text-muted/50 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 ${
            errors.voornaam ? 'border-red-300' : 'border-border'
          }`}
        />
        {errors.voornaam && (
          <p className="text-xs text-red-500 mt-1">{errors.voornaam}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="email">
          E-mailadres <span className="text-red-400">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="jouw@email.nl"
          autoComplete="email"
          className={`w-full px-4 py-3 bg-white border rounded-xl text-ink placeholder:text-muted/50 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 ${
            errors.email ? 'border-red-300' : 'border-border'
          }`}
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email}</p>
        )}
        <p className="text-xs text-muted mt-1">We sturen je bevestiging en cashback-instructies per e-mail.</p>
      </div>

      {/* Telefoon (optional) */}
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="telefoon">
          Telefoonnummer <span className="text-muted font-normal">(optioneel)</span>
        </label>
        <input
          id="telefoon"
          name="telefoon"
          type="tel"
          value={form.telefoon}
          onChange={handleChange}
          placeholder="+31 6 ..."
          autoComplete="tel"
          className="w-full px-4 py-3 bg-white border border-border rounded-xl text-ink placeholder:text-muted/50 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50"
        />
      </div>

      {/* Gewenste startperiode */}
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="startperiode">
          Gewenste startperiode <span className="text-muted font-normal">(optioneel)</span>
        </label>
        <input
          id="startperiode"
          name="startperiode"
          type="text"
          value={form.startperiode}
          onChange={handleChange}
          placeholder="Bijv. juni 2025 of zo snel mogelijk"
          className="w-full px-4 py-3 bg-white border border-border rounded-xl text-ink placeholder:text-muted/50 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50"
        />
      </div>

      {/* Bericht */}
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="bericht">
          Bericht of wensen <span className="text-muted font-normal">(optioneel)</span>
        </label>
        <textarea
          id="bericht"
          name="bericht"
          rows={3}
          value={form.bericht}
          onChange={handleChange}
          placeholder="Bijv. specifieke vragen over de accommodatie, cursusniveau, of extra activiteiten"
          className="w-full px-4 py-3 bg-white border border-border rounded-xl text-ink placeholder:text-muted/50 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 resize-none"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 px-6 bg-accent hover:bg-accent-hover text-white font-medium rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Aanvraag verzenden...
          </>
        ) : (
          <>
            Verstuur mijn aanvraag
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </>
        )}
      </button>

      <p className="text-xs text-center text-muted">
        Je gegevens worden alleen gebruikt om je aanvraag te verwerken. Geen spam, geen doorverkoop.
      </p>
    </form>
  )
}
