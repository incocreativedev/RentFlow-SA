import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  AlertTriangle, Bell, FileWarning, Ban, UserCheck, Clock,
  CheckCircle, ChevronRight, Send, ShieldCheck
} from 'lucide-react'
import { getActiveLeases } from '@/services/leases'
import { getPayments } from '@/services/payments'
import { getEscalationsByLease, createEscalation } from '@/services/escalations'
import { createNotification } from '@/services/notifications'
import type { Lease, Payment, Escalation } from '@/lib/database.types'
import { formatCurrency, formatDate, getDaysOverdue } from '@/lib/utils'

interface OverdueLease extends Lease {
  daysOverdue: number
  escalations: Escalation[]
  currentLevel: number
}

const escalationSteps = [
  { level: 1, action: 'reminder_sent' as const, label: 'Send Reminder', icon: Bell, description: 'Send overdue notification to tenant', color: 'text-yellow-600 bg-yellow-100' },
  { level: 2, action: 'second_reminder' as const, label: 'Send 2nd Reminder', icon: Send, description: 'Follow up with another reminder', color: 'text-orange-600 bg-orange-100' },
  { level: 3, action: 'letter_of_demand' as const, label: 'Issue Letter of Demand', icon: FileWarning, description: 'Formal letter of demand to tenant', color: 'text-red-600 bg-red-100' },
  { level: 4, action: 'termination_notice' as const, label: 'Termination Notice', icon: Ban, description: 'Issue lease termination notice', color: 'text-red-700 bg-red-100' },
  { level: 5, action: 'agent_notified' as const, label: 'Notify Agent', icon: UserCheck, description: 'Escalate to agent for manual intervention', color: 'text-purple-600 bg-purple-100' },
]

export default function Arrears() {
  const { user } = useAuth()
  const [overdueLeases, setOverdueLeases] = useState<OverdueLease[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLease, setSelectedLease] = useState<OverdueLease | null>(null)
  const [processing, setProcessing] = useState(false)

  useEffect(() => { loadArrears() }, [])

  async function loadArrears() {
    try {
      const [leases, payments] = await Promise.all([getActiveLeases(), getPayments()])
      const now = new Date()
      const currentMonth = now.getMonth() + 1
      const currentYear = now.getFullYear()

      const paidLeaseIds = new Set(
        payments
          .filter((p: Payment) => p.period_month === currentMonth && p.period_year === currentYear)
          .map((p: Payment) => p.lease_id)
      )

      const overdue: OverdueLease[] = []
      for (const lease of leases) {
        const dueDate = new Date(currentYear, now.getMonth(), lease.rent_due_day)
        if (now > dueDate && !paidLeaseIds.has(lease.id)) {
          const escalations = await getEscalationsByLease(lease.id)
          const currentLevel = escalations.filter(e => !e.resolved).length > 0
            ? Math.max(...escalations.filter(e => !e.resolved).map(e => e.level))
            : 0
          overdue.push({
            ...lease,
            daysOverdue: getDaysOverdue(dueDate.toISOString()),
            escalations,
            currentLevel,
          })
        }
      }

      overdue.sort((a, b) => b.daysOverdue - a.daysOverdue)
      setOverdueLeases(overdue)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  async function handleEscalate(lease: OverdueLease, step: typeof escalationSteps[0]) {
    if (!user) return
    setProcessing(true)
    try {
      await createEscalation({
        user_id: user.id,
        lease_id: lease.id,
        level: step.level,
        action_type: step.action,
        action_details: `${step.label} - ${step.description}`,
        owner_notified: true,
        resolved: false,
        resolved_at: null,
      })

      await createNotification({
        user_id: user.id,
        lease_id: lease.id,
        recipient_type: 'tenant',
        recipient_name: `${lease.tenant?.first_name} ${lease.tenant?.last_name}`,
        recipient_contact: lease.tenant?.phone || '',
        notification_type: step.action === 'letter_of_demand' ? 'letter_of_demand'
          : step.action === 'termination_notice' ? 'termination_notice'
          : 'overdue_alert',
        message: `${step.label}: Your rent of ${formatCurrency(lease.monthly_rent)} for ${lease.property?.address} is ${lease.daysOverdue} days overdue.`,
        status: 'sent',
      })

      if (lease.property?.owner_name) {
        await createNotification({
          user_id: user.id,
          lease_id: lease.id,
          recipient_type: 'owner',
          recipient_name: lease.property.owner_name,
          recipient_contact: lease.property.owner_email || '',
          notification_type: 'owner_update',
          message: `Action taken: ${step.label} for tenant ${lease.tenant?.first_name} ${lease.tenant?.last_name} at ${lease.property.address}. Rent is ${lease.daysOverdue} days overdue.`,
          status: 'sent',
        })
      }

      await loadArrears()
      const updated = overdueLeases.find(l => l.id === lease.id)
      if (updated) setSelectedLease(updated)
    } catch (err) { console.error(err) }
    finally { setProcessing(false) }
  }

  function getEscalationBadge(level: number) {
    if (level === 0) return <Badge variant="warning">New</Badge>
    if (level <= 2) return <Badge variant="warning">Reminder Sent</Badge>
    if (level === 3) return <Badge variant="destructive">Letter of Demand</Badge>
    if (level >= 4) return <Badge variant="destructive">Termination</Badge>
    return null
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-4 text-sm text-muted-foreground">Loading arrears...</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Arrears Management</h2>
        <p className="text-sm text-muted-foreground">Track and escalate overdue rent payments</p>
      </div>

      {overdueLeases.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-white py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <ShieldCheck className="h-8 w-8 text-green-500" />
          </div>
          <p className="mt-4 text-lg font-semibold text-green-700">No Arrears</p>
          <p className="mt-1 text-sm text-muted-foreground">All tenants are up to date with their rent!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Summary banner */}
          <div className="flex items-center gap-4 rounded-xl bg-gradient-to-r from-red-500 to-red-600 p-5 text-white shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-bold">
                {overdueLeases.length} lease{overdueLeases.length > 1 ? 's' : ''} with outstanding arrears
              </p>
              <p className="text-sm text-red-100">
                Total outstanding: {formatCurrency(overdueLeases.reduce((sum, l) => sum + l.monthly_rent, 0))}
              </p>
            </div>
          </div>

          {overdueLeases.map(lease => (
            <div key={lease.id} className="overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md">
              <div className="border-l-4 border-l-red-500 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-600">
                      {lease.tenant?.first_name?.[0]}{lease.tenant?.last_name?.[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{lease.tenant?.first_name} {lease.tenant?.last_name}</h3>
                        {getEscalationBadge(lease.currentLevel)}
                      </div>
                      <p className="text-sm text-muted-foreground">{lease.property?.address}</p>
                      <div className="mt-1.5 flex flex-wrap gap-4 text-sm">
                        <span>Rent: <strong>{formatCurrency(lease.monthly_rent)}</strong></span>
                        <span className="text-red-600 font-medium">
                          <Clock className="inline h-3 w-3 mr-1" />
                          {lease.daysOverdue} days overdue
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button onClick={() => setSelectedLease(lease)} className="shadow-sm">
                    Manage <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Escalation Workflow Dialog */}
      <Dialog open={!!selectedLease} onOpenChange={() => setSelectedLease(null)}>
        <DialogContent onClose={() => setSelectedLease(null)} className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Escalation Workflow
            </DialogTitle>
          </DialogHeader>

          {selectedLease && (
            <div className="space-y-6">
              {/* Lease Info */}
              <div className="rounded-xl bg-muted/50 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-600">
                    {selectedLease.tenant?.first_name?.[0]}{selectedLease.tenant?.last_name?.[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{selectedLease.tenant?.first_name} {selectedLease.tenant?.last_name}</p>
                    <p className="text-sm text-muted-foreground">{selectedLease.property?.address}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-white p-2.5 text-center">
                    <p className="text-muted-foreground text-xs">Monthly Rent</p>
                    <p className="font-bold">{formatCurrency(selectedLease.monthly_rent)}</p>
                  </div>
                  <div className="rounded-lg bg-white p-2.5 text-center">
                    <p className="text-muted-foreground text-xs">Days Overdue</p>
                    <p className="font-bold text-red-600">{selectedLease.daysOverdue} days</p>
                  </div>
                </div>
              </div>

              {/* Escalation Steps */}
              <div>
                <h4 className="font-semibold mb-3">Escalation Steps</h4>
                <div className="space-y-2">
                  {escalationSteps.map(step => {
                    const completed = selectedLease.escalations.some(e => e.level === step.level)
                    const isNext = step.level === selectedLease.currentLevel + 1
                    return (
                      <div
                        key={step.level}
                        className={`flex items-center gap-3 rounded-xl border p-3.5 transition-all ${
                          completed ? 'bg-green-50/50 border-green-200' :
                          isNext ? 'border-blue-200 bg-blue-50/50 shadow-sm' : 'opacity-50'
                        }`}
                      >
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                          completed ? 'bg-green-100 text-green-600' :
                          isNext ? step.color : 'bg-muted text-muted-foreground'
                        }`}>
                          {completed ? <CheckCircle className="h-4 w-4" /> : <step.icon className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{step.label}</p>
                          <p className="text-xs text-muted-foreground">{step.description}</p>
                        </div>
                        {completed ? (
                          <Badge variant="success" className="text-xs">Done</Badge>
                        ) : isNext ? (
                          <Button
                            size="sm"
                            onClick={() => handleEscalate(selectedLease, step)}
                            disabled={processing}
                            className="shadow-sm"
                          >
                            {processing ? 'Processing...' : 'Execute'}
                          </Button>
                        ) : null}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Escalation History */}
              {selectedLease.escalations.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Audit Trail</h4>
                  <div className="space-y-2">
                    {selectedLease.escalations.map(esc => (
                      <div key={esc.id} className="flex items-center justify-between rounded-lg border bg-muted/20 p-3 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span className="font-medium">Level {esc.level}: </span>
                          <span className="capitalize text-muted-foreground">{esc.action_type.replace(/_/g, ' ')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{formatDate(esc.created_at)}</span>
                          {esc.owner_notified && <Badge variant="outline" className="text-[10px]">Owner Notified</Badge>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
