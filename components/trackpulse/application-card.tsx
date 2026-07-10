'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Pencil, Trash2 } from 'lucide-react'
import { STATUS_ORDER, STATUS_STYLES, type Application, type Status } from '@/lib/trackpulse'

interface ApplicationCardProps {
  app: Application
  tilt: string
  onSetStatus: (id: string, status: Status) => void
  onUpdateNotes: (id: string, notes: string) => void
  onDelete: (id: string) => void
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function ApplicationCard({
  app,
  tilt,
  onSetStatus,
  onUpdateNotes,
  onDelete,
}: ApplicationCardProps) {
  const style = STATUS_STYLES[app.status]
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Notes editing state
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(app.notes ?? '')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Keep the draft in sync if the underlying note changes externally.
  useEffect(() => {
    if (!editing) setDraft(app.notes ?? '')
  }, [app.notes, editing])

  // Close the dropdown on outside click or Escape.
  useEffect(() => {
    if (!open) return
    function onPointer(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Focus the textarea when entering edit mode.
  useEffect(() => {
    if (editing && textareaRef.current) {
      const el = textareaRef.current
      el.focus()
      el.setSelectionRange(el.value.length, el.value.length)
    }
  }, [editing])

  function pick(status: Status) {
    onSetStatus(app.id, status)
    setOpen(false)
  }

  function startEditing() {
    setDraft(app.notes ?? '')
    setEditing(true)
  }

  function saveNotes() {
    const trimmed = draft.trim()
    onUpdateNotes(app.id, trimmed)
    setEditing(false)
  }

  return (
    <article
      className={`${tilt} ${open ? 'relative z-50' : 'relative'} border-4 border-white bg-[#1a1a1e] p-4 tp-shadow transition-transform hover:rotate-0 hover:-translate-y-1`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-sans text-xl font-black uppercase leading-tight tracking-tight text-white">
            {app.company}
          </h3>
          <p className="truncate font-mono text-sm font-bold text-white/70">
            {app.role}
          </p>
        </div>
        <button
          onClick={() => onDelete(app.id)}
          aria-label={`Delete ${app.company} application`}
          className="shrink-0 border-4 border-black bg-[#ff007f] p-1.5 text-black tp-shadow-sm transition-transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Trash2 className="h-4 w-4" strokeWidth={3} />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-white/50">
          {formatDate(app.date)}
        </span>

        {/* Interactive brutalist status dropdown */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-label={`Change status. Current status ${style.label}`}
            className={`${style.bg} ${style.text} flex items-center gap-1.5 border-4 border-black px-3 py-1 font-mono text-xs font-bold uppercase tracking-wide tp-shadow-sm transition-transform hover:-translate-y-0.5 active:translate-y-0`}
          >
            {style.label}
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
              strokeWidth={3}
            />
          </button>

          {open ? (
            <div
              role="listbox"
              className="absolute right-0 z-50 mt-2 w-44 border-4 border-black bg-white tp-shadow"
            >
              {STATUS_ORDER.map((status) => {
                const s = STATUS_STYLES[status]
                const active = status === app.status
                return (
                  <button
                    key={status}
                    role="option"
                    aria-selected={active}
                    onClick={() => pick(status)}
                    className="flex w-full items-center justify-between gap-2 border-b-4 border-black px-3 py-2 font-mono text-xs font-bold uppercase tracking-wide text-black transition-colors last:border-b-0 hover:bg-black/5"
                  >
                    <span className="flex items-center gap-2">
                      <span className={`${s.bg} h-3.5 w-3.5 border-2 border-black`} />
                      {s.label}
                    </span>
                    {active ? <Check className="h-3.5 w-3.5" strokeWidth={4} /> : null}
                  </button>
                )
              })}
            </div>
          ) : null}
        </div>
      </div>

      {/* Editable notes */}
      <div className="mt-3 border-t-4 border-dashed border-white/20 pt-3">
        {editing ? (
          <div className="flex flex-col gap-2">
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={saveNotes}
              rows={3}
              placeholder="Add notes…"
              className="w-full resize-none border-4 border-[#ccff00] bg-black px-3 py-2 font-mono text-xs leading-relaxed text-white outline-none placeholder:text-white/30"
            />
            <div className="flex justify-end">
              <button
                // onMouseDown fires before the textarea blur, so Save wins.
                onMouseDown={(e) => {
                  e.preventDefault()
                  saveNotes()
                }}
                className="border-4 border-black bg-[#ccff00] px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-black tp-shadow-sm transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={startEditing}
            aria-label={`Edit notes for ${app.company}`}
            className="group flex w-full items-start justify-between gap-2 text-left"
          >
            <span
              className={`font-mono text-xs leading-relaxed ${
                app.notes ? 'text-white/60' : 'italic text-white/30'
              }`}
            >
              {app.notes || 'Add notes…'}
            </span>
            <Pencil
              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/30 transition-colors group-hover:text-[#ccff00]"
              strokeWidth={3}
            />
          </button>
        )}
      </div>
    </article>
  )
}
