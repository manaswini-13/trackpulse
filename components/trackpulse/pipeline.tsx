'use client'

import { Inbox } from 'lucide-react'
import type { Application, Status } from '@/lib/trackpulse'
import { ApplicationCard } from './application-card'

interface PipelineProps {
  apps: Application[]
  onSetStatus: (id: string, status: Status) => void
  onUpdateNotes: (id: string, notes: string) => void
  onDelete: (id: string) => void
}

const TILTS = ['rotate-[0.5deg]', 'rotate-[-0.5deg]', 'rotate-[0.4deg]', 'rotate-[-0.4deg]']

export function Pipeline({ apps, onSetStatus, onUpdateNotes, onDelete }: PipelineProps) {
  if (apps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center border-4 border-dashed border-white/30 bg-[#1a1a1e] p-12 text-center">
        <Inbox className="h-10 w-10 text-white/40" strokeWidth={2.5} />
        <p className="mt-4 font-sans text-lg font-black uppercase tracking-tight text-white/60">
          No roles here yet
        </p>
        <p className="mt-1 font-mono text-xs text-white/40">
          Log a role or switch filters to populate the pipeline.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {apps.map((app, i) => (
        <ApplicationCard
          key={app.id}
          app={app}
          tilt={TILTS[i % TILTS.length]}
          onSetStatus={onSetStatus}
          onUpdateNotes={onUpdateNotes}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
