import { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { HttpMethod } from '@/types'
import type { Monitor } from '@/types'
import { cn } from '@/lib/utils'

// ─── Schema ───────────────────────────────────────────────────────────────────

const monitorSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  url: z.string().url('Must be a valid URL'),
  method: z.nativeEnum(HttpMethod),
  expectedStatus: z.coerce.number().int().min(100).max(599),
  intervalMins: z.coerce.number().int().refine((v) => [1, 5, 10, 30].includes(v), {
    message: 'Select a valid interval',
  }),
  timeoutSecs: z.coerce.number().int().min(1).max(60),
  headers: z
    .array(z.object({ key: z.string(), value: z.string() }))
    .optional()
    .default([]),
  body: z.string().optional(),
})

export type MonitorFormValues = z.infer<typeof monitorSchema>

// ─── Component ────────────────────────────────────────────────────────────────

interface MonitorFormProps {
  defaultValues?: Partial<MonitorFormValues>
  onSubmit: (values: MonitorFormValues) => void
  isSubmitting?: boolean
  submitLabel?: string
}

const BODY_METHODS: HttpMethod[] = [HttpMethod.POST, HttpMethod.PUT, HttpMethod.PATCH]

export function MonitorForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel = 'Save',
}: MonitorFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<MonitorFormValues>({
    resolver: zodResolver(monitorSchema),
    defaultValues: {
      method: HttpMethod.GET,
      expectedStatus: 200,
      intervalMins: 5,
      timeoutSecs: 30,
      headers: [],
      ...defaultValues,
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'headers' })
  const method = watch('method')
  const showBody = BODY_METHODS.includes(method)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="name">Monitor Name</Label>
        <Input id="name" placeholder="My API — Health Check" {...register('name')} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      {/* URL + Method */}
      <div className="flex gap-3">
        <div className="w-36 shrink-0 space-y-1.5">
          <Label htmlFor="method">Method</Label>
          <select
            id="method"
            {...register('method')}
            className={cn(
              'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            )}
          >
            {Object.values(HttpMethod).map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="url">URL</Label>
          <Input id="url" placeholder="https://api.example.com/health" {...register('url')} />
          {errors.url && <p className="text-xs text-destructive">{errors.url.message}</p>}
        </div>
      </div>

      {/* Expected status + Interval + Timeout */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="expectedStatus">Expected Status</Label>
          <Input id="expectedStatus" type="number" placeholder="200" {...register('expectedStatus')} />
          {errors.expectedStatus && (
            <p className="text-xs text-destructive">{errors.expectedStatus.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="intervalMins">Check Interval</Label>
          <select
            id="intervalMins"
            {...register('intervalMins')}
            className={cn(
              'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            )}
          >
            <option value={1}>Every 1 min</option>
            <option value={5}>Every 5 mins</option>
            <option value={10}>Every 10 mins</option>
            <option value={30}>Every 30 mins</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="timeoutSecs">Timeout (sec)</Label>
          <Input id="timeoutSecs" type="number" placeholder="30" {...register('timeoutSecs')} />
          {errors.timeoutSecs && (
            <p className="text-xs text-destructive">{errors.timeoutSecs.message}</p>
          )}
        </div>
      </div>

      {/* Headers */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Request Headers <span className="text-muted-foreground">(optional)</span></Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ key: '', value: '' })}
          >
            <Plus className="mr-1 h-3 w-3" />
            Add Header
          </Button>
        </div>
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <Input
              placeholder="Header name"
              {...register(`headers.${index}.key`)}
              className="flex-1"
            />
            <Input
              placeholder="Value"
              {...register(`headers.${index}.value`)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
              className="shrink-0 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Body (only for POST/PUT/PATCH) */}
      {showBody && (
        <div className="space-y-1.5">
          <Label htmlFor="body">
            Request Body <span className="text-muted-foreground">(optional)</span>
          </Label>
          <textarea
            id="body"
            rows={5}
            placeholder='{"key": "value"}'
            {...register('body')}
            className={cn(
              'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
              'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              'disabled:cursor-not-allowed disabled:opacity-50 font-mono'
            )}
          />
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Saving...' : submitLabel}
      </Button>
    </form>
  )
}

// Helper to convert Monitor to form values
export function monitorToFormValues(monitor: Monitor): MonitorFormValues {
  return {
    name: monitor.name,
    url: monitor.url,
    method: monitor.method,
    expectedStatus: monitor.expectedStatus,
    intervalMins: monitor.intervalMins,
    timeoutSecs: monitor.timeoutSecs,
    headers: monitor.headers
      ? Object.entries(monitor.headers).map(([key, value]) => ({ key, value }))
      : [],
    body: monitor.body ?? '',
  }
}
