import { supabase } from '@/lib/supabase'
import type { Lease } from '@/lib/database.types'

export async function getLeases() {
  const { data, error } = await supabase
    .from('leases')
    .select('*, property:properties(*), tenant:tenants(*)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Lease[]
}

export async function getActiveLeases() {
  const { data, error } = await supabase
    .from('leases')
    .select('*, property:properties(*), tenant:tenants(*)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Lease[]
}

export async function getLease(id: string) {
  const { data, error } = await supabase
    .from('leases')
    .select('*, property:properties(*), tenant:tenants(*)')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as Lease
}

export async function createLease(lease: Omit<Lease, 'id' | 'created_at' | 'updated_at' | 'property' | 'tenant'>) {
  const { data, error } = await supabase
    .from('leases')
    .insert(lease)
    .select('*, property:properties(*), tenant:tenants(*)')
    .single()
  if (error) throw error
  return data as Lease
}

export async function updateLease(id: string, updates: Partial<Lease>) {
  const { property: _p, tenant: _t, ...cleanUpdates } = updates
  const { data, error } = await supabase
    .from('leases')
    .update(cleanUpdates)
    .eq('id', id)
    .select('*, property:properties(*), tenant:tenants(*)')
    .single()
  if (error) throw error
  return data as Lease
}

export async function deleteLease(id: string) {
  const { error } = await supabase
    .from('leases')
    .delete()
    .eq('id', id)
  if (error) throw error
}
