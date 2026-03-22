import { Suspense } from 'react'
import BedanktContent from './BedanktContent'

export default function BedanktPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg" />}>
      <BedanktContent />
    </Suspense>
  )
}
