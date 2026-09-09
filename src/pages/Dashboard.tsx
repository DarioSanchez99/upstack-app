import { Link } from 'react-router-dom'
import { Plus, Activity, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MonitorCard } from '@/components/monitors/MonitorCard'
import { useMonitors } from '@/hooks/useMonitors'
import { MonitorStatus } from '@/types'

export default function Dashboard() {
  const { data: monitors, isLoading, isError } = useMonitors()
  // TanStack Query handles auto-refetch via refetchInterval configured in the QueryClient

  const up = monitors?.filter((m) => m.status === MonitorStatus.UP).length ?? 0
  const down = monitors?.filter((m) => m.status === MonitorStatus.DOWN).length ?? 0
  const degraded = monitors?.filter((m) => m.status === MonitorStatus.DEGRADED).length ?? 0
  const total = monitors?.length ?? 0

  const globalUptime =
    monitors && monitors.length > 0
      ? monitors.reduce((sum, m) => sum + (m.uptimePercent7d ?? 0), 0) / monitors.length
      : null

  const summaryCards = [
    {
      title: 'Total Monitors',
      value: total,
      icon: Activity,
      color: 'text-primary',
    },
    {
      title: 'Operational',
      value: up,
      icon: CheckCircle,
      color: 'text-emerald-600',
    },
    {
      title: 'Down',
      value: down,
      icon: XCircle,
      color: 'text-red-600',
    },
    {
      title: 'Degraded',
      value: degraded,
      icon: AlertTriangle,
      color: 'text-yellow-600',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Overview</h2>
          {isLoading ? (
            <div className="mt-1 h-4 w-48 animate-pulse rounded bg-muted" />
          ) : globalUptime !== null ? (
            <p className="mt-0.5 text-sm text-muted-foreground">
              Global uptime (7d):&nbsp;
              <span className="font-semibold text-emerald-600">{globalUptime.toFixed(2)}%</span>
            </p>
          ) : null}
        </div>
        <Button asChild>
          <Link to="/monitors/new">
            <Plus className="mr-2 h-4 w-4" />
            New Monitor
          </Link>
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-9 w-16 animate-pulse rounded-md bg-muted" />
              ) : (
                <div className="text-3xl font-bold">{card.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Monitor list */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">All Monitors</h3>

        {isLoading && (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-36 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        )}

        {isError && (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="py-8 text-center text-sm text-destructive">
              Failed to load monitors. Check your connection and try again.
            </CardContent>
          </Card>
        )}

        {!isLoading && !isError && monitors?.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
              <Activity className="h-10 w-10 text-muted-foreground/40" />
              <div>
                <p className="font-medium">No monitors yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Create your first monitor to start tracking uptime.
                </p>
              </div>
              <Button asChild className="mt-2">
                <Link to="/monitors/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Monitor
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {!isLoading && !isError && monitors && monitors.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {monitors.map((monitor) => (
              <MonitorCard key={monitor.id} monitor={monitor} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
