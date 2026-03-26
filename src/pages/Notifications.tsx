import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Bell, Search } from 'lucide-react'
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

const statusVariant: Record<string, 'success' | 'warning' | 'destructive' | 'secondary'> = {
  sent: 'success',
  delivered: 'success',
  pending: 'warning',
  failed: 'destructive',
}

const recipientVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
  tenant: 'default',
  owner: 'secondary',
  agent: 'outline',
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

  if (loading) return <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search notifications..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterType} onChange={e => setFilterType(e.target.value)} className="w-auto min-w-[200px]">
          <option value="all">All Types</option>
          {Object.entries(typeLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No notifications</p>
            <p className="text-sm text-muted-foreground">Notifications will appear here as actions are taken</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(notification => (
            <Card key={notification.id}>
              <CardContent className="p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Badge variant={recipientVariant[notification.recipient_type]}>
                        {notification.recipient_type.charAt(0).toUpperCase() + notification.recipient_type.slice(1)}
                      </Badge>
                      <Badge variant="outline">{typeLabels[notification.notification_type] || notification.notification_type}</Badge>
                      <Badge variant={statusVariant[notification.status]}>{notification.status}</Badge>
                    </div>
                    <p className="text-sm font-medium">{notification.recipient_name}</p>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(notification.sent_at)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
