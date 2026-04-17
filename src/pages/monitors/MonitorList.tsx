import { Link } from 'react-router-dom'
import { Plus, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MonitorCard } from '@/components/monitors/MonitorCard'
import { useMonitors } from '@/hooks/useMonitors'

export default function MonitorList() {
  const { data: monitors, isLoading, isError } = useMonitors()

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {monitors ? `${monitors.length} monitor${monitors.length !== 1 ? 's' : ''}` : ''}
        </p>
        <Button asChild>
          <Link to="/monitors/new">
            <Plus className="mr-2 h-4 w-4" />
            New Monitor
          </Link>
        </Button>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-36 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="py-8 text-center text-sm text-destructive">
            Could not load monitors. Please try again.
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {!isLoading && !isError && monitors?.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <Activity className="h-12 w-12 text-muted-foreground/40" />
            <div>
              <p className="font-semibold">No monitors yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add your first endpoint to start monitoring uptime and response time.
              </p>
            </div>
            <Button asChild className="mt-2">
              <Link to="/monitors/new">
                <Plus className="mr-2 h-4 w-4" />
                Create your first monitor
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Grid */}
      {!isLoading && !isError && monitors && monitors.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {monitors.map((monitor) => (
            <MonitorCard key={monitor.id} monitor={monitor} />
          ))}
        </div>
      )}
    </div>
  )
}
