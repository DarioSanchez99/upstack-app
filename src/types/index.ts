// ─── Enums ────────────────────────────────────────────────────────────────────

export enum MonitorStatus {
  UP = 'UP',
  DOWN = 'DOWN',
  DEGRADED = 'DEGRADED',
  PENDING = 'PENDING',
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export enum Plan {
  FREE = 'FREE',
  PRO = 'PRO',
}

// ─── Core Entities ────────────────────────────────────────────────────────────

export interface User {
  id: string
  name: string
  email: string
  plan: Plan
  createdAt: string
  updatedAt: string
}

export interface Workspace {
  id: string
  name: string
  slug: string
  ownerId: string
  plan: Plan
  createdAt: string
  updatedAt: string
}

export interface Monitor {
  id: string
  workspaceId: string
  name: string
  url: string
  method: HttpMethod
  expectedStatus: number
  intervalMins: number
  timeoutSecs: number
  headers?: Record<string, string>
  body?: string
  status: MonitorStatus
  lastCheckedAt: string | null
  uptimePercent7d: number | null
  uptimePercent30d: number | null
  avgResponseTimeMs: number | null
  isPaused: boolean
  createdAt: string
  updatedAt: string
}

export interface CheckResult {
  id: string
  monitorId: string
  status: MonitorStatus
  responseTimeMs: number | null
  httpStatus: number | null
  error: string | null
  checkedAt: string
}

export interface AlertLog {
  id: string
  monitorId: string
  monitor?: Monitor
  type: 'DOWN' | 'UP' | 'DEGRADED'
  message: string
  resolvedAt: string | null
  createdAt: string
}

// ─── API Wrappers ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
