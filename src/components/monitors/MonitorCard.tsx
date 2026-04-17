import { useNavigate } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { Edit, Pause, Play, Trash2, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from './StatusBadge'
import { useDeleteMonitor, useTogglePauseMonitor } from '@/hooks/useMonitors'
import type { Monitor } from '@/types'
import { cn } from '@/lib/utils'

interface MonitorCardProps {
  monitor: Monitor
}

export function MonitorCard({ monitor }: MonitorCardProps) {
  const navigate = useNavigate()
  const deleteMutation = useDeleteMonitor(monitor.id)
  const togglePause = useTogglePauseMonitor(monitor.id)

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation()
    if (confirm(`Delete monitor "${monitor.name}"? This cannot be undone.`)) {
      deleteMutation.mutate()
    }
  }

  function handleTogglePause(e: React.MouseEvent) {
    e.stopPropagation()
    togglePause.mutate(!monitor.isPaused)
  }

  function handleEdit(e: React.MouseEvent) {
    e.stopPropagation()
    navigate(`/monitors/${monitor.id}/edit`)
  }

  return (
    <Card
      className={cn(
        'cursor-pointer transition-shadow hover:shadow-md',
        monitor.isPaused && 'opacity-60'
      )}
      onClick={() => navigate(`/monitors/${monitor.id}`)}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          {/* Left: name + url */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-semibold text-foreground">{monitor.name}</h3>
              {monitor.isPaused && (
                <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  Paused
                </span>
              )}
            </div>
            <a
              href={monitor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground hover:text-primary"
              onClick={(e) => e.stopPropagation()}
            >
              {monitor.url}
              <ExternalLink className="h-3 w-3 shrink-0" />
            </a>
          </div>

          {/* Right: status badge */}
          <StatusBadge status={monitor.status} />
        </div>

        {/* Stats row */}
        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <span>
            {monitor.lastCheckedAt
              ? `Checked ${formatDistanceToNow(new Date(monitor.lastCheckedAt), { addSuffix: true })}`
              : 'Never checked'}
          </span>
          {monitor.uptimePercent7d !== null && (
            <span className="font-medium text-foreground">
              {monitor.uptimePercent7d.toFixed(2)}% uptime (7d)
            </span>
          )}
          {monitor.avgResponseTimeMs !== null && (
            <span>{Math.round(monitor.avgResponseTimeMs)}ms avg</span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-3 flex items-center gap-1 border-t pt-3">
          <Button variant="ghost" size="sm" onClick={handleEdit} className="h-7 px-2 text-xs">
            <Edit className="mr-1 h-3 w-3" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleTogglePause}
            className="h-7 px-2 text-xs"
            disabled={togglePause.isPending}
          >
            {monitor.isPaused ? (
              <>
                <Play className="mr-1 h-3 w-3" />
                Resume
              </>
            ) : (
              <>
                <Pause className="mr-1 h-3 w-3" />
                Pause
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="ml-auto h-7 px-2 text-xs text-destructive hover:text-destructive"
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="mr-1 h-3 w-3" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
