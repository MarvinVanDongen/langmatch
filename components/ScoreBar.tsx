'use client'

import { useEffect, useState } from 'react'

interface ScoreBarProps {
  label: string
  score: number
  color: 'match' | 'value' | 'trust'
}

const COLOR_CLASSES = {
  match: 'bg-accent',
  value: 'bg-blue-500',
  trust: 'bg-violet-500',
}

const TEXT_COLORS = {
  match: 'text-accent',
  value: 'text-blue-600',
  trust: 'text-violet-600',
}

export default function ScoreBar({ label, score, color }: ScoreBarProps) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    // Animate on mount
    const timer = setTimeout(() => setWidth(score), 80)
    return () => clearTimeout(timer)
  }, [score])

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted w-12 shrink-0 font-medium">{label}</span>
      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full score-bar-inner ${COLOR_CLASSES[color]}`}
          style={{ width: `${width}%` }}
        />
      </div>
      <span className={`text-sm font-semibold w-8 text-right tabular-nums ${TEXT_COLORS[color]}`}>
        {score}
      </span>
    </div>
  )
}
