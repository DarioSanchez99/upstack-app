import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MonitorForm, monitorToFormValues } from '@/components/monitors/MonitorForm'
import { useMonitor, useUpdateMonitor } from '@/hooks/useMonitors'
import type { MonitorFormValues } from '@/components/monitors/MonitorForm'

export default function MonitorEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: monitor, isLoading } = useMonitor(id!)
  const updateMonitor = useUpdateMonitor(id!)

  async function handleSubmit(values: MonitorFormValues) {
    const headers: Record<string, string> = {}
    values.headers?.forEach(({ key, value }) => {
      if (key.trim()) headers[key.trim()] = value
    })

    await updateMonitor.mutateAsync({
      name: values.name,
      url: values.url,
      method: values.method,
      expectedStatus: values.expectedStatus,
      intervalMins: values.intervalMins,
      timeoutSecs: values.timeoutSecs,
      headers: Object.keys(headers).length > 0 ? headers : undefined,
      body: values.body || undefined,
    })

    navigate(`/monitors/${id}`)
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="h-8 w-24 animate-pulse rounded bg-muted" />
        <div className="h-96 animate-pulse rounded-lg bg-muted" />
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

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit Monitor</CardTitle>
          <CardDescription>Update the configuration for "{monitor.name}".</CardDescription>
        </CardHeader>
        <CardContent>
          <MonitorForm
            defaultValues={monitorToFormValues(monitor)}
            onSubmit={handleSubmit}
            isSubmitting={updateMonitor.isPending}
            submitLabel="Save Changes"
          />
        </CardContent>
      </Card>
    </div>
  )
}
