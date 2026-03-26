import { supabase } from '@/lib/supabase'
import type { Tenant } from '@/lib/database.types'

export async function getTenants() {
  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Tenant[]
}

export async function getTenant(id: string) {
  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as Tenant
}

export async function createTenant(tenant: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('tenants')
    .insert(tenant)
    .select()
    .single()
  if (error) throw error
  return data as Tenant
}

export async function updateTenant(id: string, updates: Partial<Tenant>) {
  const { data, error } = await supabase
    .from('tenants')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Tenant
}

export async function deleteTenant(id: string) {
  const { error } = await supabase
    .from('tenants')
    .delete()
    .eq('id', id)
  if (error) throw error
}
