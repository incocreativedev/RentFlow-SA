import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Bell, Search, Mail, MessageSquare, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { getNotifications } from '@/services/notifications'
import type { Notification } from '@/lib/database.types'
import { formatDate } from '@/lib/utils'

const typeLabels: Record<string, string> = {
  pre_due_reminder: 'Pre-Due Reminder',
  due_date_notice: 'Due Date Notice',
  overdue_alert: 'Overdue Alert',
  payment_received: 'Payment Received',
  escalation_update: 'Escalation Update',
  owner_update: 'Owner Update',
  letter_of_demand: 'Letter of Demand',
  termination_notice: 'Termination Notice',
}

const statusConfig: Record<string, { variant: 'success' | 'warning' | 'destructive' | 'secondary'; icon: typeof CheckCircle }> = {
  sent: { variant: 'success', icon: CheckCircle },
  delivered: { variant: 'success', icon: CheckCircle },
  pending: { variant: 'warning', icon: Clock },
  failed: { variant: 'destructive', icon: AlertCircle },
}

const recipientIcons: Record<string, typeof Mail> = {
  tenant: Mail,
  owner: MessageSquare,
  agent: Bell,
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')

  useEffect(() => { loadNotifications() }, [])

  async function loadNotifications() {
    try { setNotifications(await getNotifications()) }
    catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const filtered = notifications.filter(n => {
    const matchesSearch = n.recipient_name.toLowerCase().includes(search.toLowerCase()) ||
      n.message.toLowerCase().includes(search.toLowerCase())
    const matchesType = filterType === 'all' || n.notification_type === filterType
    return matchesSearch && matchesType
  })

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-4 text-sm text-muted-foreground">Loading notifications...</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
        <p className="text-sm text-muted-foreground">{notifications.length} notifications sent</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search notifications..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-white" />
        </div>
        <Select value={filterType} onChange={e => setFilterType(e.target.value)} className="w-auto min-w-[200px] bg-white">
          <option value="all">All Types</option>
          {Object.entries(typeLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-white py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
            <Bell className="h-8 w-8 text-blue-500" />
          </div>
          <p className="mt-4 text-lg font-semibold">No notifications</p>
          <p className="mt-1 text-sm text-muted-foreground">Notifications will appear here as actions are taken</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(notification => {
            const RecipientIcon = recipientIcons[notification.recipient_type] || Mail
            const statusInfo = statusConfig[notification.status] || statusConfig.pending
            const StatusIcon = statusInfo.icon

            return (
              <div key={notification.id} className="overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md">
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <RecipientIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-medium">{notification.recipient_name}</span>
                        <Badge variant={statusInfo.variant} className="text-[10px] gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {notification.status}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {typeLabels[notification.notification_type] || notification.notification_type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">{formatDate(notification.sent_at)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
