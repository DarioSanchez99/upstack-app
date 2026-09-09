import { useParams, Link } from 'react-router-dom'
import { format, formatDistanceToNow } from 'date-fns'
import { ArrowLeft, Edit, Clock, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/monitors/StatusBadge'
import { UptimeBar } from '@/components/monitors/UptimeBar'
import { ResponseTimeChart } from '@/components/charts/ResponseTimeChart'
import { useMonitor } from '@/hooks/useMonitors'
import { useCheckResults, useCheckResults24h, useDailyUptime } from '@/hooks/useCheckResults'
import { MonitorStatus } from '@/types'
import { cn } from '@/lib/utils'

export default function MonitorDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: monitor, isLoading } = useMonitor(id!)
  const { data: results } = useCheckResults(id!, 20)
  const { data: results24h } = useCheckResults24h(id!)
  const { data: dailyUptime } = useDailyUptime(id!)

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    )
  }

  if (!monitor) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        Monitor not found.{' '}
        <Link to="/monitors" className="text-primary hover:underline">
          Go back
        </Link>
      </div>
    )
  }

  const statCards = [
    {
      label: 'Uptime (7d)',
      value: monitor.uptimePercent7d !== null ? `${monitor.uptimePercent7d.toFixed(2)}%` : '—',
      icon: TrendingUp,
      color: 'text-emerald-600',
    },
    {
      label: 'Uptime (30d)',
      value: monitor.uptimePercent30d !== null ? `${monitor.uptimePercent30d.toFixed(2)}%` : '—',
      icon: TrendingUp,
      color: 'text-emerald-600',
    },
    {
      label: 'Avg Response',
      value: monitor.avgResponseTimeMs !== null ? `${Math.round(monitor.avgResponseTimeMs)}ms` : '—',
      icon: Clock,
      color: 'text-primary',
    },
  ]

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Back + header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Button variant="ghost" size="sm" asChild className="-ml-2">
            <Link to="/monitors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Monitors
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">{monitor.name}</h2>
            <StatusBadge status={monitor.status} />
            {monitor.isPaused && (
              <Badge variant="muted">Paused</Badge>
            )}
          </div>
          <a
            href={monitor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            {monitor.url}
          </a>
          {monitor.lastCheckedAt && (
            <p className="text-xs text-muted-foreground">
              Last checked {formatDistanceToNow(new Date(monitor.lastCheckedAt), { addSuffix: true })}
            </p>
          )}
        </div>
        <Button asChild>
          <Link to={`/monitors/${monitor.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
      </div>

      {/* Uptime bar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">90-Day Uptime</CardTitle>
        </CardHeader>
        <CardContent>
          <UptimeBar days={dailyUptime ?? []} />
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {statCards.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-3 py-5">
              <s.icon className={cn('h-8 w-8', s.color)} />
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Response time chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Response Time — Last 24h</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponseTimeChart results={results24h ?? []} />
        </CardContent>
      </Card>

      {/* Recent check results */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Recent Checks</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!results || results.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-muted-foreground">
              No data yet — first check runs within 1 minute.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40 text-xs text-muted-foreground">
                    <th className="px-4 py-2 text-left font-medium">Time</th>
                    <th className="px-4 py-2 text-left font-medium">Status</th>
                    <th className="px-4 py-2 text-left font-medium">HTTP</th>
                    <th className="px-4 py-2 text-left font-medium">Response</th>
                    <th className="px-4 py-2 text-left font-medium">Error</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r) => (
                    <tr key={r.id} className="border-b last:border-0 hover:bg-muted/20">
                      <td className="px-4 py-2 tabular-nums text-muted-foreground">
                        {format(new Date(r.checkedAt), 'MMM d, HH:mm:ss')}
                      </td>
                      <td className="px-4 py-2">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-4 py-2 tabular-nums">{r.httpStatus ?? '—'}</td>
                      <td className="px-4 py-2 tabular-nums">
                        {r.responseTimeMs !== null ? `${r.responseTimeMs}ms` : '—'}
                      </td>
                      <td className="max-w-xs truncate px-4 py-2 text-xs text-muted-foreground">
                        {r.error ?? '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Incident list */}
      {results && results.filter(r => r.status === MonitorStatus.DOWN).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Recent Incidents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {results
              .filter((r) => r.status === MonitorStatus.DOWN)
              .map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-md bg-red-50 px-3 py-2 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    <span className="text-red-700">
                      {r.error ?? `HTTP ${r.httpStatus}`}
                    </span>
                  </div>
                  <span className="text-xs text-red-500">
                    {format(new Date(r.checkedAt), 'MMM d, HH:mm')}
                  </span>
                </div>
              ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
