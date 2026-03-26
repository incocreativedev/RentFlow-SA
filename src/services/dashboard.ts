import { supabase } from '@/lib/supabase'
import type { Lease, Payment } from '@/lib/database.types'

export interface DashboardStats {
  totalProperties: number
  activeTenants: number
  rentCollectedThisMonth: number
  outstandingArrears: number
  overdueLeases: Lease[]
  recentPayments: Payment[]
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date()
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]

  const [propertiesRes, leasesRes, paymentsRes] = await Promise.all([
    supabase.from('properties').select('id', { count: 'exact' }).eq('is_active', true),
    supabase.from('leases').select('*, property:properties(*), tenant:tenants(*)').eq('status', 'active'),
    supabase.from('payments').select('*, lease:leases(*, property:properties(*), tenant:tenants(*))').gte('payment_date', firstOfMonth).order('payment_date', { ascending: false }),
  ])

  if (propertiesRes.error) throw propertiesRes.error
  if (leasesRes.error) throw leasesRes.error
  if (paymentsRes.error) throw paymentsRes.error

  const activeLeases = (leasesRes.data || []) as Lease[]
  const payments = (paymentsRes.data || []) as Payment[]
  const totalCollected = payments.reduce((sum, p) => sum + Number(p.amount), 0)

  // Find overdue leases (where current month payment hasn't been received)
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()
  const paidLeaseIds = new Set(
    payments
      .filter(p => p.period_month === currentMonth && p.period_year === currentYear)
      .map(p => p.lease_id)
  )

  const overdueLeases = activeLeases.filter(lease => {
    const dueDay = lease.rent_due_day || 1
    const dueDate = new Date(currentYear, now.getMonth(), dueDay)
    return now > dueDate && !paidLeaseIds.has(lease.id)
  })

  const totalOutstanding = overdueLeases.reduce((sum, l) => sum + Number(l.monthly_rent), 0)

  return {
    totalProperties: propertiesRes.count || 0,
    activeTenants: activeLeases.length,
    rentCollectedThisMonth: totalCollected,
    outstandingArrears: totalOutstanding,
    overdueLeases,
    recentPayments: payments.slice(0, 10),
  }
}
