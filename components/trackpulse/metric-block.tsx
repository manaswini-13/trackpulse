interface MetricBlockProps {
  label: string
  value: number
  accent: string
  textClass?: string
  rotate?: string
}

export function MetricBlock({
  label,
  value,
  accent,
  textClass = 'text-black',
  rotate = '',
}: MetricBlockProps) {
  return (
    <div
      className={`${accent} ${textClass} ${rotate} border-4 border-black p-3 tp-shadow-sm transition-transform hover:-translate-y-0.5`}
    >
      <div className="font-mono text-[10px] font-bold uppercase tracking-widest opacity-80">
        {label}
      </div>
      <div className="mt-1 font-sans text-4xl font-black leading-none tabular-nums">
        {value.toString().padStart(2, '0')}
      </div>
    </div>
  )
}
