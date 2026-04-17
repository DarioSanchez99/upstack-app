import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import type { CheckResult } from '@/types'

interface MonitorStats {
  uptime7d: number
  uptime30d: number
  avgResponseTimeMs: number
  totalChecks: number
  totalDown: number
}

// ─── Check results list ───────────────────────────────────────────────────────

export function useCheckResults(monitorId: string, limit = 20) {
  return useQuery({
    queryKey: ['monitors', monitorId, 'results', limit],
    queryFn: async () => {
      const { data } = await api.get<CheckResult[]>(
        `/api/monitors/${monitorId}/results`,
        { params: { limit } }
      )
      return data
    },
    enabled: !!monitorId,
  })
}

// ─── 24h results for chart ────────────────────────────────────────────────────

export function useCheckResults24h(monitorId: string) {
  return useQuery({
    queryKey: ['monitors', monitorId, 'results', '24h'],
    queryFn: async () => {
      const { data } = await api.get<CheckResult[]>(
        `/api/monitors/${monitorId}/results`,
        { params: { hours: 24, limit: 288 } }
      )
      return data
    },
    enabled: !!monitorId,
    refetchInterval: 60_000,
  })
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export function useMonitorStats(monitorId: string) {
  return useQuery({
    queryKey: ['monitors', monitorId, 'stats'],
    queryFn: async () => {
      const { data } = await api.get<MonitorStats>(
        `/api/monitors/${monitorId}/stats`
      )
      return data
    },
    enabled: !!monitorId,
  })
}

// ─── 90-day daily uptime (for UptimeBar) ─────────────────────────────────────

interface DailyUptime {
  date: string
  status: 'up' | 'down' | 'degraded' | 'no_data'
  uptimePercent: number
}

export function useDailyUptime(monitorId: string) {
  return useQuery({
    queryKey: ['monitors', monitorId, 'daily-uptime'],
    queryFn: async () => {
      const { data } = await api.get<DailyUptime[]>(
        `/api/monitors/${monitorId}/uptime/daily`,
        { params: { days: 90 } }
      )
      return data
    },
    enabled: !!monitorId,
  })
}
