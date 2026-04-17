import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MonitorForm } from '@/components/monitors/MonitorForm'
import { useCreateMonitor } from '@/hooks/useMonitors'
import type { MonitorFormValues } from '@/components/monitors/MonitorForm'

export default function MonitorNew() {
  const navigate = useNavigate()
  const createMonitor = useCreateMonitor()

  async function handleSubmit(values: MonitorFormValues) {
    const headers: Record<string, string> = {}
    values.headers?.forEach(({ key, value }) => {
      if (key.trim()) headers[key.trim()] = value
    })

    await createMonitor.mutateAsync({
      name: values.name,
      url: values.url,
      method: values.method,
      expectedStatus: values.expectedStatus,
      intervalMins: values.intervalMins,
      timeoutSecs: values.timeoutSecs,
      headers: Object.keys(headers).length > 0 ? headers : undefined,
      body: values.body || undefined,
    })

    navigate('/monitors')
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>New Monitor</CardTitle>
          <CardDescription>
            Configure an HTTP endpoint to monitor. Upstack will check it on your chosen interval
            and alert you if it goes down.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MonitorForm
            onSubmit={handleSubmit}
            isSubmitting={createMonitor.isPending}
            submitLabel="Create Monitor"
          />
        </CardContent>
      </Card>
    </div>
  )
}
