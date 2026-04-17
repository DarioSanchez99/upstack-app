import { useState } from 'react'
import { toast } from 'sonner'
import { Check, Zap, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/stores/authStore'
import api from '@/lib/api'
import { Plan } from '@/types'

const FREE_FEATURES = [
  '5 monitors',
  '5-minute check interval',
  'Email alerts',
  'Public status page',
  '7-day data retention',
]

const PRO_FEATURES = [
  'Unlimited monitors',
  '1-minute check interval',
  'Email, SMS & Slack alerts',
  'Custom status page domain',
  '90-day data retention',
  'Incident history & reports',
  'Priority support',
]

export default function Billing() {
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const isPro = user?.plan === Plan.PRO

  async function handleUpgrade() {
    setIsLoading(true)
    try {
      const { data } = await api.post<{ url: string }>('/api/billing/create-checkout')
      window.location.href = data.url
    } catch {
      toast.error('Failed to start checkout. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleManage() {
    setIsLoading(true)
    try {
      const { data } = await api.post<{ url: string }>('/api/billing/portal')
      window.location.href = data.url
    } catch {
      toast.error('Failed to open billing portal. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Current plan banner */}
      <Card>
        <CardContent className="flex items-center justify-between py-5">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${isPro ? 'bg-primary' : 'bg-muted'}`}>
              {isPro ? (
                <Zap className="h-5 w-5 text-primary-foreground" />
              ) : (
                <CreditCard className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="font-semibold">
                {isPro ? 'Upstack Pro' : 'Upstack Free'}
              </p>
              <p className="text-sm text-muted-foreground">
                {isPro ? 'All features unlocked.' : 'Upgrade to unlock all features.'}
              </p>
            </div>
          </div>
          <Badge variant={isPro ? 'default' : 'secondary'}>
            {isPro ? 'Pro' : 'Free'}
          </Badge>
        </CardContent>
      </Card>

      {/* Plans comparison */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Free plan */}
        <Card className={!isPro ? 'ring-2 ring-primary' : ''}>
          <CardHeader>
            <CardTitle className="text-lg">Free</CardTitle>
            <CardDescription>
              <span className="text-3xl font-bold text-foreground">$0</span>
              <span className="text-muted-foreground">/month</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {FREE_FEATURES.map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                {f}
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>
              {!isPro ? 'Current Plan' : 'Downgrade'}
            </Button>
          </CardFooter>
        </Card>

        {/* Pro plan */}
        <Card className={isPro ? 'ring-2 ring-primary' : 'relative overflow-hidden'}>
          {!isPro && (
            <div className="absolute right-4 top-4">
              <Badge variant="default" className="text-xs">Most Popular</Badge>
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-lg">Pro</CardTitle>
            <CardDescription>
              <span className="text-3xl font-bold text-foreground">$19</span>
              <span className="text-muted-foreground">/month</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {PRO_FEATURES.map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                {f}
              </div>
            ))}
          </CardContent>
          <CardFooter>
            {isPro ? (
              <Button variant="outline" className="w-full" onClick={handleManage} disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Manage Subscription'}
              </Button>
            ) : (
              <Button className="w-full" onClick={handleUpgrade} disabled={isLoading}>
                <Zap className="mr-2 h-4 w-4" />
                {isLoading ? 'Loading...' : 'Upgrade to Pro'}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Payments are processed securely by Stripe. Cancel anytime.
      </p>
    </div>
  )
}
