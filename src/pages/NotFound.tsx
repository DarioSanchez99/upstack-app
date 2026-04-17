import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Zap } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <Zap className="h-8 w-8 text-muted-foreground" />
      </div>
      <div>
        <h1 className="text-6xl font-bold tracking-tight">404</h1>
        <p className="mt-2 text-lg text-muted-foreground">Page not found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
      <Button asChild className="mt-4">
        <Link to="/dashboard">Go to Dashboard</Link>
      </Button>
    </div>
  )
}
