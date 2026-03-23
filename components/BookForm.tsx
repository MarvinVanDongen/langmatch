'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { School } from '@/lib/types'

interface BookFormProps { school: School; intakeParams: string }
interface FormData { firstName: string; email: string; phone: string; startDate: string; message: string }

export default function BookForm({ school, intakeParams }: BookFormProps) {
  const router = useRouter()
  const [form, setForm] = useState<FormData>({ firstName: '', email: '', phone: '', startDate: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  function validate(): boolean {
    const e: Partial<FormData> = {}
    if (!form.firstName.trim()) e.firstName = 'First name is required'
    if (!form.email.trim())     e.email     = 'Email address is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email address'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    if (errors[name as keyof FormData]) setErrors(p => ({ ...p, [name]: undefined }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    try {
      const existing = JSON.parse(localStorage.getItem('langmatch_leads') ?? '[]')
      existing.push({ school_id: school.id, school_name: school.school_name, ...form, intake_params: intakeParams, submitted_at: new Date().toISOString() })
      localStorage.setItem('langmatch_leads', JSON.stringify(existing))
    } catch {}
    await new Promise(r => setTimeout(r, 600))
    router.push(`/thank-you?school=${encodeURIComponent(school.school_name)}&cashback=${school.cashback_amount}&${intakeParams}`)
  }

  const inputClass = (err?: string) =>
    `w-full px-4 py-3 bg-white border rounded-xl text-ink placeholder:text-muted/40 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 ${err ? 'border-red-300' : 'border-border'}`

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="firstName">
          First name <span className="text-red-400">*</span>
        </label>
        <input id="firstName" name="firstName" type="text" value={form.firstName} onChange={handleChange}
          placeholder="e.g. Emma" autoComplete="given-name" className={inputClass(errors.firstName)} />
        {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="email">
          Email address <span className="text-red-400">*</span>
        </label>
        <input id="email" name="email" type="email" value={form.email} onChange={handleChange}
          placeholder="your@email.com" autoComplete="email" className={inputClass(errors.email)} />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        <p className="text-xs text-muted mt-1">We'll send your confirmation and cashback instructions here.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="phone">
          Phone number <span className="text-muted font-normal">(optional)</span>
        </label>
        <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange}
          placeholder="+31 6 ..." autoComplete="tel" className={inputClass()} />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="startDate">
          Preferred start date <span className="text-muted font-normal">(optional)</span>
        </label>
        <input id="startDate" name="startDate" type="text" value={form.startDate} onChange={handleChange}
          placeholder="e.g. June 2025 or as soon as possible" className={inputClass()} />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="message">
          Message or requests <span className="text-muted font-normal">(optional)</span>
        </label>
        <textarea id="message" name="message" rows={3} value={form.message} onChange={handleChange}
          placeholder="e.g. questions about accommodation, course level, or activities"
          className={`${inputClass()} resize-none`} />
      </div>

      <button type="submit" disabled={isSubmitting}
        className="w-full py-3.5 px-6 bg-accent hover:bg-accent-hover text-white font-medium rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
        {isSubmitting ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending your request...
          </>
        ) : (
          <>
            Send my request
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </>
        )}
      </button>

      <p className="text-xs text-center text-muted">
        Your data is used only to process your request. No spam, no data selling.
      </p>
    </form>
  )
}
