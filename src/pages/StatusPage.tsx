import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { format, formatDistanceToNow } from 'date-fns'
import { CheckCircle, XCircle, AlertTriangle, Zap, Clock } from 'lucide-react'
import { StatusBadge } from '@/components/monitors/StatusBadge'
import api from '@/lib/api'
import { MonitorStatus } from '@/types'
import type { Monitor, Workspace, AlertLog } from '@/types'

interface StatusPageData {
  workspace: Workspace
  monitors: Monitor[]
}

function OverallStatus({ monitors }: { monitors: Monitor[] }) {
  const hasDown = monitors.some((m) => m.status === MonitorStatus.DOWN)
  const hasDegraded = monitors.some((m) => m.status === MonitorStatus.DEGRADED)

  if (hasDown) {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-red-50 px-6 py-4 text-red-800">
        <XCircle className="h-6 w-6 shrink-0" />
        <div>
          <p className="font-semibold">Partial Outage</p>
          <p className="text-sm">Some services are experiencing issues.</p>
        </div>
      </div>
    )
  }

  if (hasDegraded) {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-yellow-50 px-6 py-4 text-yellow-800">
        <AlertTriangle className="h-6 w-6 shrink-0" />
        <div>
          <p className="font-semibold">Degraded Performance</p>
          <p className="text-sm">Some services are operating with reduced performance.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-6 py-4 text-emerald-800">
      <CheckCircle className="h-6 w-6 shrink-0" />
      <div>
        <p className="font-semibold">All Systems Operational</p>
        <p className="text-sm">All services are running normally.</p>
      </div>
    </div>
  )
}

interface IncidentHistoryProps {
  slug: string
  monitors: Monitor[]
}

function IncidentHistory({ slug, monitors }: IncidentHistoryProps) {
  const { data: alerts, isLoading } = useQuery({
    queryKey: ['status', slug, 'alerts'],
    queryFn: async () => {
      const { data } = await api.get<AlertLog[]>(`/api/status/${slug}/alerts`, {
        params: { limit: 10 },
      })
      return data
    },
    refetchInterval: 60_000,
  })

  // Build a monitor name lookup map
  const monitorMap = Object.fromEntries(monitors.map((m) => [m.id, m.name]))

  // Determine whether any monitor is currently in a non-UP state
  const hasActiveIncident = monitors.some(
    (m) => m.status === MonitorStatus.DOWN || m.status === MonitorStatus.DEGRADED
  )

  return (
    <section>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Incident History
      </h2>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      )}

      {!isLoading && (!alerts || alerts.length === 0) && !hasActiveIncident && (
        <div className="flex items-center gap-3 rounded-xl border bg-card px-5 py-4">
          <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500" />
          <p className="text-sm text-muted-foreground">
            No incidents in the recent period. All systems have been operational.
          </p>
        </div>
      )}

      {!isLoading && alerts && alerts.length > 0 && (
        <div className="divide-y rounded-xl border bg-card">
          {alerts.map((alert) => {
            const isResolved = alert.resolvedAt !== null
            const monitorName = monitorMap[alert.monitorId] ?? 'Unknown monitor'

            return (
              <div key={alert.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {alert.type === 'DOWN' ? (
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                    ) : alert.type === 'DEGRADED' ? (
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
                    ) : (
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    )}
                    <div>
                      <p className="text-sm font-medium">
                        {monitorName}
                        {' — '}
                        <span
                          className={
                            alert.type === 'DOWN'
                              ? 'text-red-600'
                              : alert.type === 'DEGRADED'
                              ? 'text-yellow-600'
                              : 'text-emerald-600'
                          }
                        >
                          {alert.type === 'DOWN'
                            ? 'Outage'
                            : alert.type === 'DEGRADED'
                            ? 'Degraded'
                            : 'Recovered'}
                        </span>
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{alert.message}</p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
                    </p>
                    {isResolved ? (
                      <p className="mt-0.5 flex items-center justify-end gap-1 text-xs text-emerald-600">
                        <Clock className="h-3 w-3" />
                        Resolved {format(new Date(alert.resolvedAt!), 'MMM d, HH:mm')}
                      </p>
                    ) : (
                      <p className="mt-0.5 text-xs font-medium text-red-500">Ongoing</p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default function StatusPage() {
  const { slug } = useParams<{ slug: string }>()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['status', slug],
    queryFn: async () => {
      const { data } = await api.get<StatusPageData>(`/api/status/${slug}`)
      return data
    },
    refetchInterval: 60_000,
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Nav bar */}
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-3xl items-center gap-2.5 px-4 py-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <Zap className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="font-semibold">
            {data?.workspace.name ?? 'Status Page'}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-8 px-4 py-10">
        {isLoading && (
          <div className="space-y-4">
            <div className="h-16 animate-pulse rounded-xl bg-muted" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center text-destructive">
            Status page not found or unavailable.
          </div>
        )}

        {data && (
          <>
            <OverallStatus monitors={data.monitors} />

            <section>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Services
              </h2>
              <div className="divide-y rounded-xl border bg-card">
                {data.monitors.map((monitor) => (
                  <div
                    key={monitor.id}
                    className="flex items-center justify-between px-5 py-4"
                  >
                    <div>
                      <p className="font-medium">{monitor.name}</p>
                      {monitor.lastCheckedAt && (
                        <p className="text-xs text-muted-foreground">
                          Checked{' '}
                          {format(new Date(monitor.lastCheckedAt), 'MMM d, HH:mm')}
                        </p>
                      )}
                    </div>
                    <StatusBadge status={monitor.status} />
                  </div>
                ))}
                {data.monitors.length === 0 && (
                  <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                    No monitors configured yet.
                  </p>
                )}
              </div>
            </section>

            {/* ─── Incident / alert history ─────────────────────────────── */}
            <IncidentHistory slug={slug!} monitors={data.monitors} />
          </>
        )}

        <footer className="text-center text-xs text-muted-foreground">
          Powered by{' '}
          <a href="/" className="hover:text-primary">
            Upstack
          </a>{' '}
          &mdash; Last updated {format(new Date(), 'HH:mm:ss')}
        </footer>
      </main>
    </div>
  )
}
