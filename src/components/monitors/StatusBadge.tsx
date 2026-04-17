import { MonitorStatus } from '@/types'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: MonitorStatus
  className?: string
}

const config: Record<MonitorStatus, { label: string; dot: string; bg: string; text: string }> = {
  [MonitorStatus.UP]: {
    label: 'UP',
    dot: 'bg-emerald-500',
    bg: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-700',
  },
  [MonitorStatus.DOWN]: {
    label: 'DOWN',
    dot: 'bg-red-500',
    bg: 'bg-red-50 border-red-200',
    text: 'text-red-700',
  },
  [MonitorStatus.DEGRADED]: {
    label: 'DEGRADED',
    dot: 'bg-yellow-500',
    bg: 'bg-yellow-50 border-yellow-200',
    text: 'text-yellow-700',
  },
  [MonitorStatus.PENDING]: {
    label: 'PENDING',
    dot: 'bg-gray-400',
    bg: 'bg-gray-50 border-gray-200',
    text: 'text-gray-600',
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const c = config[status] ?? config[MonitorStatus.PENDING]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        c.bg,
        c.text,
        className
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          c.dot,
          status === MonitorStatus.DOWN && 'animate-pulse-dot'
        )}
      />
      {c.label}
    </span>
  )
}
