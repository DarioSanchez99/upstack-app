import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/api'
import type { Monitor } from '@/types'

const MONITORS_KEY = ['monitors']

function monitorKey(id: string) {
  return ['monitors', id]
}

// ─── List ─────────────────────────────────────────────────────────────────────

export function useMonitors() {
  return useQuery({
    queryKey: MONITORS_KEY,
    queryFn: async () => {
      const { data } = await api.get<Monitor[]>('/api/monitors')
      return data
    },
  })
}

// ─── Single ───────────────────────────────────────────────────────────────────

export function useMonitor(id: string) {
  return useQuery({
    queryKey: monitorKey(id),
    queryFn: async () => {
      const { data } = await api.get<Monitor>(`/api/monitors/${id}`)
      return data
    },
    enabled: !!id,
  })
}

// ─── Create ───────────────────────────────────────────────────────────────────

export type CreateMonitorPayload = Omit<
  Monitor,
  'id' | 'workspaceId' | 'status' | 'lastCheckedAt' | 'uptimePercent7d' | 'uptimePercent30d' | 'avgResponseTimeMs' | 'isPaused' | 'createdAt' | 'updatedAt'
>

export function useCreateMonitor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CreateMonitorPayload) => {
      const { data } = await api.post<Monitor>('/api/monitors', payload)
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: MONITORS_KEY })
      toast.success('Monitor created successfully.')
    },
    onError: () => {
      toast.error('Failed to create monitor.')
    },
  })
}

// ─── Update ───────────────────────────────────────────────────────────────────

export function useUpdateMonitor(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<CreateMonitorPayload>) => {
      const { data } = await api.patch<Monitor>(`/api/monitors/${id}`, payload)
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: MONITORS_KEY })
      qc.invalidateQueries({ queryKey: monitorKey(id) })
      toast.success('Monitor updated.')
    },
    onError: () => {
      toast.error('Failed to update monitor.')
    },
  })
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export function useDeleteMonitor(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      await api.delete(`/api/monitors/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: MONITORS_KEY })
      toast.success('Monitor deleted.')
    },
    onError: () => {
      toast.error('Failed to delete monitor.')
    },
  })
}

// ─── Toggle pause ─────────────────────────────────────────────────────────────

export function useTogglePauseMonitor(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (isPaused: boolean) => {
      const { data } = await api.patch<Monitor>(`/api/monitors/${id}`, { isPaused })
      return data
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: MONITORS_KEY })
      qc.invalidateQueries({ queryKey: monitorKey(id) })
      toast.success(data.isPaused ? 'Monitor paused.' : 'Monitor resumed.')
    },
  })
}
