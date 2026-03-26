export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id'>>
      }
      properties: {
        Row: Property
        Insert: Omit<Property, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Property, 'id' | 'user_id'>>
      }
      tenants: {
        Row: Tenant
        Insert: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Tenant, 'id' | 'user_id'>>
      }
      leases: {
        Row: Lease
        Insert: Omit<Lease, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Lease, 'id' | 'user_id'>>
      }
      payments: {
        Row: Payment
        Insert: Omit<Payment, 'id' | 'created_at'>
        Update: Partial<Omit<Payment, 'id' | 'user_id'>>
      }
      notifications: {
        Row: Notification
        Insert: Omit<Notification, 'id' | 'created_at' | 'sent_at'>
        Update: Partial<Omit<Notification, 'id' | 'user_id'>>
      }
      escalations: {
        Row: Escalation
        Insert: Omit<Escalation, 'id' | 'created_at'>
        Update: Partial<Omit<Escalation, 'id' | 'user_id'>>
      }
    }
  }
}

export interface Profile {
  id: string
  agency_name: string
  contact_name: string
  email: string
  phone: string | null
  created_at: string
  updated_at: string
}

export interface Property {
  id: string
  user_id: string
  address: string
  suburb: string | null
  city: string
  province: string
  property_type: 'house' | 'apartment' | 'townhouse' | 'flat' | 'commercial' | 'other'
  monthly_rent: number
  owner_name: string
  owner_email: string | null
  owner_phone: string | null
  notes: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Tenant {
  id: string
  user_id: string
  first_name: string
  last_name: string
  email: string | null
  phone: string
  id_number: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Lease {
  id: string
  user_id: string
  property_id: string
  tenant_id: string
  monthly_rent: number
  rent_due_day: number
  start_date: string
  end_date: string | null
  deposit_amount: number
  status: 'active' | 'expired' | 'terminated' | 'pending'
  created_at: string
  updated_at: string
  // Joined fields
  property?: Property
  tenant?: Tenant
}

export interface Payment {
  id: string
  user_id: string
  lease_id: string
  amount: number
  payment_date: string
  payment_method: 'eft' | 'cash' | 'card' | 'debit_order' | 'other'
  reference: string | null
  notes: string | null
  period_month: number | null
  period_year: number | null
  created_at: string
  // Joined fields
  lease?: Lease
}

export interface Notification {
  id: string
  user_id: string
  lease_id: string | null
  recipient_type: 'tenant' | 'owner' | 'agent'
  recipient_name: string
  recipient_contact: string | null
  notification_type: 'pre_due_reminder' | 'due_date_notice' | 'overdue_alert' | 'payment_received' | 'escalation_update' | 'owner_update' | 'letter_of_demand' | 'termination_notice'
  message: string
  status: 'sent' | 'delivered' | 'failed' | 'pending'
  sent_at: string
  created_at: string
}

export interface Escalation {
  id: string
  user_id: string
  lease_id: string
  level: number
  action_type: 'reminder_sent' | 'second_reminder' | 'letter_of_demand' | 'termination_notice' | 'agent_notified' | 'legal_action'
  action_details: string | null
  owner_notified: boolean
  resolved: boolean
  resolved_at: string | null
  created_at: string
  // Joined
  lease?: Lease
}
