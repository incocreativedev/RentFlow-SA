import { supabase } from '@/lib/supabase'
import type { Payment } from '@/lib/database.types'

export async function getPayments() {
  const { data, error } = await supabase
    .from('payments')
    .select('*, lease:leases(*, property:properties(*), tenant:tenants(*))')
    .order('payment_date', { ascending: false })
  if (error) throw error
  return data as Payment[]
}

export async function getPaymentsByLease(leaseId: string) {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('lease_id', leaseId)
    .order('payment_date', { ascending: false })
  if (error) throw error
  return data as Payment[]
}

export async function createPayment(payment: Omit<Payment, 'id' | 'created_at' | 'lease'>) {
  const { data, error } = await supabase
    .from('payments')
    .insert(payment)
    .select()
    .single()
  if (error) throw error
  return data as Payment
}

export async function deletePayment(id: string) {
  const { error } = await supabase
    .from('payments')
    .delete()
    .eq('id', id)
  if (error) throw error
}
