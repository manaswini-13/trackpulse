'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { STATUS_ORDER, type Application, type Status, createId } from '@/lib/trackpulse'

interface LogFormProps {
  onAdd: (app: Application) => void
}

const inputBase =
  'w-full border-4 border-black bg-white px-3 py-2 font-mono text-sm font-bold text-black placeholder:text-black/40 focus:outline-none focus:ring-0 focus:border-black'

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

export function LogForm({ onAdd }: LogFormProps) {
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [date, setDate] = useState(today())
  const [status, setStatus] = useState<Status>('Applied')
  const [notes, setNotes] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!company.trim() || !role.trim()) return
    onAdd({
      id: createId(),
      company: company.trim(),
      role: role.trim(),
      date: date || today(),
      status,
      notes: notes.trim(),
    })
    setCompany('')
    setRole('')
    setDate(today())
    setStatus('Applied')
    setNotes('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-4 border-white bg-[#1a1a1e] p-5 tp-shadow-white"
    >
      <h2 className="mb-4 font-sans text-2xl font-black uppercase tracking-tight text-white">
        Log New Role
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-widest text-[#ccff00]">
            Company
          </span>
          <input
            className={inputBase}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Vercel"
            required
          />
        </label>

        <label className="block">
          <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-widest text-[#00e5ff]">
            Role Title
          </span>
          <input
            className={inputBase}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Frontend Intern"
            required
          />
        </label>

        <label className="block">
          <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-widest text-[#39ff14]">
            Applied On
          </span>
          <input
            type="date"
            className={inputBase}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <label className="block">
          <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-widest text-[#ff007f]">
            Status
          </span>
          <select
            className={inputBase}
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
          >
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-3 block">
        <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-widest text-white/70">
          Notes
        </span>
        <textarea
          className={`${inputBase} min-h-[80px] resize-y`}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Recruiter contact, OA deadline, referral..."
        />
      </label>

      <button
        type="submit"
        className="mt-4 flex w-full items-center justify-center gap-2 border-4 border-black bg-[#ccff00] px-4 py-3 font-sans text-lg font-black uppercase tracking-tight text-black tp-shadow transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0"
      >
        <Plus className="h-5 w-5" strokeWidth={3} />
        Add To Pipeline
      </button>
    </form>
  )
}
