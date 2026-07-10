'use client'

import type { Status } from '@/lib/trackpulse'

export type Filter = 'All' | Status

const FILTERS: { key: Filter; accent: string }[] = [
  { key: 'All', accent: 'bg-white' },
  { key: 'Applied', accent: 'bg-[#00e5ff]' },
  { key: 'Interviewing', accent: 'bg-[#ccff00]' },
  { key: 'Offer', accent: 'bg-[#39ff14]' },
  { key: 'Rejected', accent: 'bg-[#ff007f]' },
]

interface StatusTabsProps {
  active: Filter
  counts: Record<Filter, number>
  onChange: (filter: Filter) => void
}

export function StatusTabs({ active, counts, onChange }: StatusTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map(({ key, accent }) => {
        const isActive = active === key
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`flex items-center gap-2 border-4 border-black px-3 py-2 font-mono text-xs font-bold uppercase tracking-wide tp-shadow-sm transition-transform hover:-translate-y-0.5 ${
              isActive ? `${accent} text-black` : 'bg-[#1a1a1e] text-white'
            }`}
          >
            {key}
            <span
              className={`inline-flex min-w-5 items-center justify-center border-2 border-black px-1 tabular-nums ${
                isActive ? 'bg-black text-white' : 'bg-white text-black'
              }`}
            >
              {counts[key]}
            </span>
          </button>
        )
      })}
    </div>
  )
}
