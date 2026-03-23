import { Suspense } from 'react'
import ThankYouContent from './ThankYouContent'

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg" />}>
      <ThankYouContent />
    </Suspense>
  )
}
