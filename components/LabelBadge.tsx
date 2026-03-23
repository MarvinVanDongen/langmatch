import type { RecommendationLabel } from '@/lib/types'

interface LabelBadgeProps {
  label: RecommendationLabel
  size?: 'sm' | 'md' | 'lg'
}

const LABEL_STYLES: Record<RecommendationLabel, string> = {
  'GO':       'bg-emerald-100 text-emerald-800 border-emerald-200',
  'GOOD FIT': 'bg-sky-100 text-sky-800 border-sky-200',
  'CAUTION':  'bg-amber-100 text-amber-800 border-amber-200',
  'SKIP':     'bg-stone-100 text-stone-500 border-stone-200',
}

const SIZE_STYLES = {
  sm: 'text-[10px] px-2 py-0.5 tracking-wide',
  md: 'text-xs px-2.5 py-1 tracking-wide',
  lg: 'text-sm px-3 py-1.5 tracking-wider',
}

export default function LabelBadge({ label, size = 'md' }: LabelBadgeProps) {
  return (
    <span className={`inline-flex items-center font-sans font-semibold uppercase rounded-full border ${LABEL_STYLES[label]} ${SIZE_STYLES[size]}`}>
      {label}
    </span>
  )
}
