import { supabase } from '@/lib/supabase'
import type { Notification } from '@/lib/database.types'

export async function getNotifications() {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('sent_at', { ascending: false })
  if (error) throw error
  return data as Notification[]
}

export async function getNotificationsByLease(leaseId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('lease_id', leaseId)
    .order('sent_at', { ascending: false })
  if (error) throw error
  return data as Notification[]
}

export async function createNotification(notification: Omit<Notification, 'id' | 'created_at' | 'sent_at'>) {
  const { data, error } = await supabase
    .from('notifications')
    .insert(notification)
    .select()
    .single()
  if (error) throw error
  return data as Notification
}
