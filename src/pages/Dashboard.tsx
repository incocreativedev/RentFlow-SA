import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Building, Users, CreditCard, AlertTriangle, ArrowRight, TrendingUp, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StatsCard } from '@/components/StatsCard'
import { getDashboardStats, type DashboardStats } from '@/services/dashboard'
import { formatCurrency, formatDate, getDaysOverdue } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const { profile } = useAuth()

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
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Generate mock monthly data for the chart
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const currentMonth = new Date().getMonth()
  const chartData = months.slice(0, currentMonth + 1).map((month, i) => ({
    month,
    collected: i === currentMonth ? (stats?.rentCollectedThisMonth || 0) : Math.floor(Math.random() * (stats?.rentCollectedThisMonth || 10000) * 0.9 + (stats?.rentCollectedThisMonth || 10000) * 0.6),
    arrears: i === currentMonth ? (stats?.outstandingArrears || 0) : Math.floor(Math.random() * (stats?.outstandingArrears || 5000) * 1.2),
  }))

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight">
          {greeting()}, {profile?.contact_name?.split(' ')[0] || 'there'}
        </h2>
        <p className="text-muted-foreground">
          Here's what's happening with your properties today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Properties"
          value={stats?.totalProperties || 0}
          icon={Building}
          gradient="blue"
          description="Active portfolio"
        />
        <StatsCard
          title="Active Tenants"
          value={stats?.activeTenants || 0}
          icon={Users}
          gradient="green"
          description="Currently leasing"
        />
        <StatsCard
          title="Collected This Month"
          value={formatCurrency(stats?.rentCollectedThisMonth || 0)}
          icon={CreditCard}
          gradient="purple"
        />
        <StatsCard
          title="Outstanding Arrears"
          value={formatCurrency(stats?.outstandingArrears || 0)}
          icon={AlertTriangle}
          gradient="red"
          description={stats?.outstandingArrears ? 'Requires attention' : 'All clear'}
        />
      </div>

      {/* Chart + Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Revenue Overview</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">Monthly collections vs arrears</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                <span className="text-muted-foreground">Collected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="text-muted-foreground">Arrears</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} tickFormatter={(v) => `R${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}
                  />
                  <Bar dataKey="collected" fill="hsl(221.2 83.2% 53.3%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="arrears" fill="hsl(0 84.2% 75%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/app/properties" className="flex items-center gap-3 rounded-lg border p-3 transition-all hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Building className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Add Property</p>
                <p className="text-xs text-muted-foreground">Register new rental</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link to="/app/tenants" className="flex items-center gap-3 rounded-lg border p-3 transition-all hover:border-green-200 hover:bg-green-50/50 hover:shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 text-green-600">
                <Users className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Add Tenant</p>
                <p className="text-xs text-muted-foreground">Register new tenant</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link to="/app/payments" className="flex items-center gap-3 rounded-lg border p-3 transition-all hover:border-purple-200 hover:bg-purple-50/50 hover:shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <CreditCard className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Record Payment</p>
                <p className="text-xs text-muted-foreground">Log a rent payment</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link to="/app/arrears" className="flex items-center gap-3 rounded-lg border p-3 transition-all hover:border-red-200 hover:bg-red-50/50 hover:shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-600">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Manage Arrears</p>
                <p className="text-xs text-muted-foreground">Escalation workflow</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Overdue Leases */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Overdue Rent</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">Tenants requiring follow-up</p>
            </div>
            <Link to="/app/arrears">
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {stats?.overdueLeases.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <p className="mt-3 text-sm font-medium text-green-600">All tenants are up to date!</p>
                <p className="text-xs text-muted-foreground mt-1">No overdue rent payments</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats?.overdueLeases.slice(0, 5).map(lease => (
                  <div key={lease.id} className="flex items-center justify-between rounded-xl border p-3 transition-colors hover:bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-600">
                        {lease.tenant?.first_name?.[0]}{lease.tenant?.last_name?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {lease.tenant?.first_name} {lease.tenant?.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground">{lease.property?.address}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-destructive">{formatCurrency(lease.monthly_rent)}</p>
                      <Badge variant="destructive" className="text-[10px]">
                        {getDaysOverdue(
                          new Date(new Date().getFullYear(), new Date().getMonth(), lease.rent_due_day).toISOString()
                        )}d overdue
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Recent Payments</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">Latest transactions received</p>
            </div>
            <Link to="/app/payments">
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {stats?.recentPayments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="mt-3 text-sm font-medium">No payments recorded yet</p>
                <p className="text-xs text-muted-foreground mt-1">Payments will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats?.recentPayments.slice(0, 5).map(payment => (
                  <div key={payment.id} className="flex items-center justify-between rounded-xl border p-3 transition-colors hover:bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-600">
                        {payment.lease?.tenant?.first_name?.[0]}{payment.lease?.tenant?.last_name?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {payment.lease?.tenant?.first_name} {payment.lease?.tenant?.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDate(payment.payment_date)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600">{formatCurrency(payment.amount)}</p>
                      <Badge variant="secondary" className="text-[10px] uppercase">{payment.payment_method}</Badge>
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
