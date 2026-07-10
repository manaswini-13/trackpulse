export type Status = 'Applied' | 'Interviewing' | 'Offer' | 'Rejected'

export interface Application {
  id: string
  company: string
  role: string
  date: string
  status: Status
  notes: string
}

export const STATUS_ORDER: Status[] = [
  'Applied',
  'Interviewing',
  'Offer',
  'Rejected',
]

// Brutalist neon palette mapped per status.
export const STATUS_STYLES: Record<
  Status,
  { bg: string; text: string; label: string }
> = {
  Applied: { bg: 'bg-[#00e5ff]', text: 'text-black', label: 'APPLIED' },
  Interviewing: { bg: 'bg-[#ccff00]', text: 'text-black', label: 'INTERVIEWING' },
  Offer: { bg: 'bg-[#39ff14]', text: 'text-black', label: 'OFFER' },
  Rejected: { bg: 'bg-[#ff007f]', text: 'text-black', label: 'REJECTED' },
}

export const STORAGE_KEY = 'trackpulse.applications.v1'

export function nextStatus(current: Status): Status {
  const idx = STATUS_ORDER.indexOf(current)
  return STATUS_ORDER[(idx + 1) % STATUS_ORDER.length]
}

export function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export const SEED_APPLICATIONS: Application[] = [
  {
    id: 'seed-vercel',
    company: 'Vercel',
    role: 'Frontend Intern',
    date: '2026-06-14',
    status: 'Interviewing',
    notes: 'Recruiter reached out on LinkedIn. Technical screen scheduled — brush up on React Server Components.',
  },
  {
    id: 'seed-stripe',
    company: 'Stripe',
    role: 'Software Engineer Intern',
    date: '2026-06-02',
    status: 'Applied',
    notes: 'Referred by a friend on the payments team. Waiting on OA link.',
  },
  {
    id: 'seed-linear',
    company: 'Linear',
    role: 'Product Engineer Intern',
    date: '2026-05-20',
    status: 'Offer',
    notes: 'Loved the design-eng crossover. Offer received — negotiating start date.',
  },
]

export function loadApplications(): Application[] {
  if (typeof window === 'undefined') return SEED_APPLICATIONS
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return SEED_APPLICATIONS
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return SEED_APPLICATIONS
    return parsed as Application[]
  } catch {
    return SEED_APPLICATIONS
  }
}

export function saveApplications(apps: Application[]): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(apps))
  } catch {
    // ignore quota / serialization errors
  }
}
