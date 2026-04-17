import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface DayBlock {
  date: string
  status: 'up' | 'down' | 'degraded' | 'no_data'
  uptimePercent?: number
}

interface UptimeBarProps {
  days: DayBlock[]
  className?: string
}

const statusColor: Record<DayBlock['status'], string> = {
  up: 'bg-emerald-500',
  down: 'bg-red-500',
  degraded: 'bg-yellow-400',
  no_data: 'bg-muted',
}

const statusLabel: Record<DayBlock['status'], string> = {
  up: 'Operational',
  down: 'Outage',
  degraded: 'Degraded',
  no_data: 'No data',
}

export function UptimeBar({ days, className }: UptimeBarProps) {
  // If no data provided, render 90 gray placeholder blocks
  const blocks: DayBlock[] =
    days.length > 0
      ? days
      : Array.from({ length: 90 }, (_, i) => ({
          date: new Date(Date.now() - (89 - i) * 86400000).toISOString(),
          status: 'no_data' as const,
        }))

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-end gap-px overflow-hidden rounded">
        {blocks.map((block, i) => (
          <div key={i} className="group relative flex-1">
            {/* Tooltip */}
            <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 hidden -translate-x-1/2 whitespace-nowrap rounded bg-popover px-2 py-1 text-xs shadow-lg group-hover:block border">
              <div className="font-medium">{format(new Date(block.date), 'MMM d, yyyy')}</div>
              <div className={cn(
                'mt-0.5',
                block.status === 'up' && 'text-emerald-600',
                block.status === 'down' && 'text-red-600',
                block.status === 'degraded' && 'text-yellow-600',
                block.status === 'no_data' && 'text-muted-foreground',
              )}>
                {statusLabel[block.status]}
                {block.uptimePercent !== undefined && block.status !== 'no_data' &&
                  ` — ${block.uptimePercent.toFixed(1)}%`}
              </div>
            </div>

            {/* Block */}
            <div
              className={cn(
                'h-8 w-full cursor-default rounded-sm transition-opacity hover:opacity-75',
                statusColor[block.status]
              )}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>90 days ago</span>
        <span>Today</span>
      </div>
    </div>
  )
}
