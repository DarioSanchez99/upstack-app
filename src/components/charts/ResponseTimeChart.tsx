import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { format } from 'date-fns'
import type { CheckResult } from '@/types'

interface ResponseTimeChartProps {
  results: CheckResult[]
}

interface ChartPoint {
  time: string
  ms: number | null
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border bg-popover p-2 text-xs shadow-lg">
      <p className="font-medium">{label}</p>
      <p className="text-primary">{payload[0].value != null ? `${payload[0].value}ms` : 'N/A'}</p>
    </div>
  )
}

export function ResponseTimeChart({ results }: ResponseTimeChartProps) {
  const data: ChartPoint[] = results
    .slice()
    .sort((a, b) => new Date(a.checkedAt).getTime() - new Date(b.checkedAt).getTime())
    .map((r) => ({
      time: format(new Date(r.checkedAt), 'HH:mm'),
      ms: r.responseTimeMs,
    }))

  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border bg-muted/30 text-sm text-muted-foreground">
        No response time data available yet.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="responseGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="time"
          tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${v}ms`}
          width={50}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="ms"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          fill="url(#responseGradient)"
          dot={false}
          connectNulls
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
