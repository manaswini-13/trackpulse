'use client'

import { useEffect, useMemo, useState } from 'react'
import { Activity } from 'lucide-react'
import {
  loadApplications,
  saveApplications,
  type Application,
  type Status,
} from '@/lib/trackpulse'
import { MetricBlock } from '@/components/trackpulse/metric-block'
import { LogForm } from '@/components/trackpulse/log-form'
import { StatusTabs, type Filter } from '@/components/trackpulse/status-tabs'
import { Pipeline } from '@/components/trackpulse/pipeline'

export default function Page() {
  const [apps, setApps] = useState<Application[]>([])
  const [filter, setFilter] = useState<Filter>('All')
  const [ready, setReady] = useState(false)

  // Load persisted roles on mount.
  useEffect(() => {
    setApps(loadApplications())
    setReady(true)
  }, [])

  // Sync to localStorage immediately on any change (after initial load).
  useEffect(() => {
    if (ready) saveApplications(apps)
  }, [apps, ready])

  function addApp(app: Application) {
    setApps((prev) => [app, ...prev])
  }

  function deleteApp(id: string) {
    setApps((prev) => prev.filter((a) => a.id !== id))
  }

  function setStatus(id: string, status: Status) {
    setApps((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a)),
    )
  }

  function updateNotes(id: string, notes: string) {
    setApps((prev) =>
      prev.map((a) => (a.id === id ? { ...a, notes } : a)),
    )
  }

  const counts = useMemo(() => {
    return {
      All: apps.length,
      Applied: apps.filter((a) => a.status === 'Applied').length,
      Interviewing: apps.filter((a) => a.status === 'Interviewing').length,
      Offer: apps.filter((a) => a.status === 'Offer').length,
      Rejected: apps.filter((a) => a.status === 'Rejected').length,
    } as Record<Filter, number>
  }, [apps])

  const visible = useMemo(
    () => (filter === 'All' ? apps : apps.filter((a) => a.status === filter)),
    [apps, filter],
  )

  return (
    <main className="tp-grid min-h-screen text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        {/* Masthead */}
        <header className="mb-8 flex items-center justify-between border-b-4 border-white pb-4">
          <div className="flex items-center gap-2">
            <span className="border-4 border-black bg-[#ccff00] p-1.5 text-black tp-shadow-sm">
              <Activity className="h-5 w-5" strokeWidth={3} />
            </span>
            <span className="font-sans text-2xl font-black uppercase tracking-tighter">
              TrackPulse
            </span>
          </div>
          <span className="hidden font-mono text-[11px] font-bold uppercase tracking-widest text-white/50 sm:block">
            Internship Pipeline // v1
          </span>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
          {/* LEFT COLUMN */}
          <section className="flex flex-col gap-8 lg:sticky lg:top-12 lg:self-start">
            <h1 className="text-balance font-sans text-5xl font-black uppercase leading-[0.95] tracking-tighter sm:text-6xl">
              Secure the bag.{' '}
              <span className="bg-[#ff007f] px-2 text-black">Track</span> your{' '}
              <span className="bg-[#00e5ff] px-2 text-black">sprints.</span>
            </h1>

            {/* Metric counters */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <MetricBlock
                label="Total"
                value={counts.All}
                accent="bg-white"
                rotate="rotate-[-0.5deg]"
              />
              <MetricBlock
                label="Applied"
                value={counts.Applied}
                accent="bg-[#00e5ff]"
                rotate="rotate-[0.5deg]"
              />
              <MetricBlock
                label="Interviews"
                value={counts.Interviewing}
                accent="bg-[#ccff00]"
                rotate="rotate-[-0.5deg]"
              />
              <MetricBlock
                label="Offers"
                value={counts.Offer}
                accent="bg-[#39ff14]"
                rotate="rotate-[0.5deg]"
              />
            </div>

            <LogForm onAdd={addApp} />
          </section>

          {/* RIGHT COLUMN */}
          <section className="flex flex-col gap-5">
            <div className="flex items-baseline justify-between">
              <h2 className="font-sans text-2xl font-black uppercase tracking-tight">
                The Pipeline
              </h2>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-white/50">
                {visible.length} shown
              </span>
            </div>

            <StatusTabs active={filter} counts={counts} onChange={setFilter} />

            <div className="tp-scroll max-h-[75vh] overflow-y-auto overflow-x-visible px-1 py-2 lg:pr-2">
              <Pipeline
                apps={visible}
                onSetStatus={setStatus}
                onUpdateNotes={updateNotes}
                onDelete={deleteApp}
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
