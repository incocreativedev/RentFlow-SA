import { supabase } from '@/lib/supabase'
import type { Escalation } from '@/lib/database.types'

export async function getEscalations() {
  const { data, error } = await supabase
    .from('escalations')
    .select('*, lease:leases(*, property:properties(*), tenant:tenants(*))')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Escalation[]
}

export async function getEscalationsByLease(leaseId: string) {
  const { data, error } = await supabase
    .from('escalations')
    .select('*')
    .eq('lease_id', leaseId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data as Escalation[]
}

export async function getLatestEscalation(leaseId: string) {
  const { data, error } = await supabase
    .from('escalations')
    .select('*')
    .eq('lease_id', leaseId)
    .eq('resolved', false)
    .order('level', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data as Escalation | null
}

export async function createEscalation(escalation: Omit<Escalation, 'id' | 'created_at' | 'lease'>) {
  const { data, error } = await supabase
    .from('escalations')
    .insert(escalation)
    .select()
    .single()
  if (error) throw error
  return data as Escalation
}

export async function resolveEscalation(id: string) {
  const { data, error } = await supabase
    .from('escalations')
    .update({ resolved: true, resolved_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Escalation
}
