import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Building, Users, CreditCard, AlertTriangle, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StatsCard } from '@/components/StatsCard'
import { getDashboardStats, type DashboardStats } from '@/services/dashboard'
import { formatCurrency, formatDate, getDaysOverdue } from '@/lib/utils'

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    try {
      const data = await getDashboardStats()
      setStats(data)
    } catch (err) {
      console.error('Failed to load dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Properties" value={stats?.totalProperties || 0} icon={Building} />
        <StatsCard title="Active Tenants" value={stats?.activeTenants || 0} icon={Users} />
        <StatsCard title="Collected This Month" value={formatCurrency(stats?.rentCollectedThisMonth || 0)} icon={CreditCard} />
        <StatsCard
          title="Outstanding Arrears"
          value={formatCurrency(stats?.outstandingArrears || 0)}
          icon={AlertTriangle}
          className={stats?.outstandingArrears ? 'border-destructive/50' : ''}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Overdue Leases */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Overdue Rent</CardTitle>
            <Link to="/arrears">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {stats?.overdueLeases.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No overdue rent - all tenants are up to date!</p>
            ) : (
              <div className="space-y-3">
                {stats?.overdueLeases.slice(0, 5).map(lease => (
                  <div key={lease.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">
                        {lease.tenant?.first_name} {lease.tenant?.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">{lease.property?.address}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-destructive">{formatCurrency(lease.monthly_rent)}</p>
                      <Badge variant="destructive" className="text-xs">
                        {getDaysOverdue(
                          new Date(new Date().getFullYear(), new Date().getMonth(), lease.rent_due_day).toISOString()
                        )} days overdue
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Payments</CardTitle>
            <Link to="/payments">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {stats?.recentPayments.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No payments recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {stats?.recentPayments.slice(0, 5).map(payment => (
                  <div key={payment.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">
                        {payment.lease?.tenant?.first_name} {payment.lease?.tenant?.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">{formatDate(payment.payment_date)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600">{formatCurrency(payment.amount)}</p>
                      <Badge variant="success" className="text-xs">{payment.payment_method.toUpperCase()}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
