import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  AlertTriangle, Bell, FileWarning, Ban, UserCheck, Clock,
  CheckCircle, ChevronRight, Send
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
  { level: 1, action: 'reminder_sent' as const, label: 'Send Reminder', icon: Bell, description: 'Send overdue notification to tenant' },
  { level: 2, action: 'second_reminder' as const, label: 'Send 2nd Reminder', icon: Send, description: 'Follow up with another reminder' },
  { level: 3, action: 'letter_of_demand' as const, label: 'Issue Letter of Demand', icon: FileWarning, description: 'Formal letter of demand to tenant' },
  { level: 4, action: 'termination_notice' as const, label: 'Termination Notice', icon: Ban, description: 'Issue lease termination notice' },
  { level: 5, action: 'agent_notified' as const, label: 'Notify Agent', icon: UserCheck, description: 'Escalate to agent for manual intervention' },
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

      // Find which leases have been paid this month
      const paidLeaseIds = new Set(
        payments
          .filter((p: Payment) => p.period_month === currentMonth && p.period_year === currentYear)
          .map((p: Payment) => p.lease_id)
      )

      // Find overdue leases and load their escalations
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
      // Create escalation record
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

      // Create tenant notification
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

      // Create owner notification
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
      // Refresh selected lease
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

  if (loading) return <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>

  return (
    <div className="space-y-6">
      {overdueLeases.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <p className="text-lg font-medium">No Arrears</p>
            <p className="text-sm text-muted-foreground">All tenants are up to date with their rent!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <span className="font-semibold text-destructive">
                {overdueLeases.length} lease{overdueLeases.length > 1 ? 's' : ''} with outstanding arrears
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Total outstanding: {formatCurrency(overdueLeases.reduce((sum, l) => sum + l.monthly_rent, 0))}
            </p>
          </div>

          {overdueLeases.map(lease => (
            <Card key={lease.id} className="border-l-4 border-l-destructive">
              <CardContent className="p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{lease.tenant?.first_name} {lease.tenant?.last_name}</h3>
                      {getEscalationBadge(lease.currentLevel)}
                    </div>
                    <p className="text-sm text-muted-foreground">{lease.property?.address}</p>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm">
                      <span>Rent: <strong>{formatCurrency(lease.monthly_rent)}</strong></span>
                      <span className="text-destructive font-medium">
                        <Clock className="inline h-3 w-3 mr-1" />
                        {lease.daysOverdue} days overdue
                      </span>
                      <span>Owner: {lease.property?.owner_name}</span>
                    </div>
                  </div>
                  <Button onClick={() => setSelectedLease(lease)} variant="outline" size="sm">
                    Manage <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Escalation Workflow Dialog */}
      <Dialog open={!!selectedLease} onOpenChange={() => setSelectedLease(null)}>
        <DialogContent onClose={() => setSelectedLease(null)} className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Escalation Workflow - {selectedLease?.tenant?.first_name} {selectedLease?.tenant?.last_name}
            </DialogTitle>
          </DialogHeader>

          {selectedLease && (
            <div className="space-y-6">
              {/* Lease Info */}
              <div className="rounded-lg bg-muted/50 p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Property</span>
                  <span>{selectedLease.property?.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Rent</span>
                  <span className="font-semibold">{formatCurrency(selectedLease.monthly_rent)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Days Overdue</span>
                  <span className="text-destructive font-semibold">{selectedLease.daysOverdue} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Owner</span>
                  <span>{selectedLease.property?.owner_name}</span>
                </div>
              </div>

              {/* Escalation Steps */}
              <div>
                <h4 className="font-medium mb-3">Actions</h4>
                <div className="space-y-3">
                  {escalationSteps.map(step => {
                    const completed = selectedLease.escalations.some(e => e.level === step.level)
                    const isNext = step.level === selectedLease.currentLevel + 1
                    return (
                      <div
                        key={step.level}
                        className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                          completed ? 'bg-muted/50 border-green-200' :
                          isNext ? 'border-primary bg-primary/5' : 'opacity-60'
                        }`}
                      >
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          completed ? 'bg-green-100 text-green-600' :
                          isNext ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
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
                  <h4 className="font-medium mb-3">History</h4>
                  <div className="space-y-2">
                    {selectedLease.escalations.map(esc => (
                      <div key={esc.id} className="flex items-center justify-between rounded border p-2 text-sm">
                        <div>
                          <span className="font-medium">Level {esc.level}: </span>
                          <span className="capitalize">{esc.action_type.replace(/_/g, ' ')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{formatDate(esc.created_at)}</span>
                          {esc.owner_notified && <Badge variant="outline" className="text-xs">Owner Notified</Badge>}
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
