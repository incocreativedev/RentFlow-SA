-- RentFlow SA - Initial Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  agency_name text not null,
  contact_name text not null,
  email text not null,
  phone text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, agency_name, contact_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'agency_name', ''),
    coalesce(new.raw_user_meta_data->>'contact_name', ''),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- PROPERTIES
-- ============================================
create table public.properties (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  address text not null,
  suburb text,
  city text default 'Durban',
  province text default 'KwaZulu-Natal',
  property_type text check (property_type in ('house', 'apartment', 'townhouse', 'flat', 'commercial', 'other')) default 'apartment',
  monthly_rent numeric(10,2) not null,
  owner_name text not null,
  owner_email text,
  owner_phone text,
  notes text,
  is_active boolean default true,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- ============================================
-- TENANTS
-- ============================================
create table public.tenants (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  first_name text not null,
  last_name text not null,
  email text,
  phone text not null,
  id_number text,
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- ============================================
-- LEASES
-- ============================================
create table public.leases (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  property_id uuid references public.properties(id) on delete cascade not null,
  tenant_id uuid references public.tenants(id) on delete cascade not null,
  monthly_rent numeric(10,2) not null,
  rent_due_day integer check (rent_due_day between 1 and 31) default 1,
  start_date date not null,
  end_date date,
  deposit_amount numeric(10,2) default 0,
  status text check (status in ('active', 'expired', 'terminated', 'pending')) default 'active',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- ============================================
-- PAYMENTS
-- ============================================
create table public.payments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  lease_id uuid references public.leases(id) on delete cascade not null,
  amount numeric(10,2) not null,
  payment_date date not null,
  payment_method text check (payment_method in ('eft', 'cash', 'card', 'debit_order', 'other')) default 'eft',
  reference text,
  notes text,
  period_month integer check (period_month between 1 and 12),
  period_year integer,
  created_at timestamptz default now() not null
);

-- ============================================
-- NOTIFICATIONS
-- ============================================
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  lease_id uuid references public.leases(id) on delete set null,
  recipient_type text check (recipient_type in ('tenant', 'owner', 'agent')) not null,
  recipient_name text not null,
  recipient_contact text,
  notification_type text check (notification_type in ('pre_due_reminder', 'due_date_notice', 'overdue_alert', 'payment_received', 'escalation_update', 'owner_update', 'letter_of_demand', 'termination_notice')) not null,
  message text not null,
  status text check (status in ('sent', 'delivered', 'failed', 'pending')) default 'sent',
  sent_at timestamptz default now() not null,
  created_at timestamptz default now() not null
);

-- ============================================
-- ESCALATIONS
-- ============================================
create table public.escalations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  lease_id uuid references public.leases(id) on delete cascade not null,
  level integer check (level between 1 and 5) not null,
  action_type text check (action_type in ('reminder_sent', 'second_reminder', 'letter_of_demand', 'termination_notice', 'agent_notified', 'legal_action')) not null,
  action_details text,
  owner_notified boolean default false,
  resolved boolean default false,
  resolved_at timestamptz,
  created_at timestamptz default now() not null
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.tenants enable row level security;
alter table public.leases enable row level security;
alter table public.payments enable row level security;
alter table public.notifications enable row level security;
alter table public.escalations enable row level security;

-- Profiles: users can only see/edit their own profile
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Properties: users can only manage their own properties
create policy "Users can view own properties" on public.properties
  for select using (auth.uid() = user_id);
create policy "Users can insert own properties" on public.properties
  for insert with check (auth.uid() = user_id);
create policy "Users can update own properties" on public.properties
  for update using (auth.uid() = user_id);
create policy "Users can delete own properties" on public.properties
  for delete using (auth.uid() = user_id);

-- Tenants: users can only manage their own tenants
create policy "Users can view own tenants" on public.tenants
  for select using (auth.uid() = user_id);
create policy "Users can insert own tenants" on public.tenants
  for insert with check (auth.uid() = user_id);
create policy "Users can update own tenants" on public.tenants
  for update using (auth.uid() = user_id);
create policy "Users can delete own tenants" on public.tenants
  for delete using (auth.uid() = user_id);

-- Leases
create policy "Users can view own leases" on public.leases
  for select using (auth.uid() = user_id);
create policy "Users can insert own leases" on public.leases
  for insert with check (auth.uid() = user_id);
create policy "Users can update own leases" on public.leases
  for update using (auth.uid() = user_id);
create policy "Users can delete own leases" on public.leases
  for delete using (auth.uid() = user_id);

-- Payments
create policy "Users can view own payments" on public.payments
  for select using (auth.uid() = user_id);
create policy "Users can insert own payments" on public.payments
  for insert with check (auth.uid() = user_id);
create policy "Users can update own payments" on public.payments
  for update using (auth.uid() = user_id);
create policy "Users can delete own payments" on public.payments
  for delete using (auth.uid() = user_id);

-- Notifications
create policy "Users can view own notifications" on public.notifications
  for select using (auth.uid() = user_id);
create policy "Users can insert own notifications" on public.notifications
  for insert with check (auth.uid() = user_id);

-- Escalations
create policy "Users can view own escalations" on public.escalations
  for select using (auth.uid() = user_id);
create policy "Users can insert own escalations" on public.escalations
  for insert with check (auth.uid() = user_id);
create policy "Users can update own escalations" on public.escalations
  for update using (auth.uid() = user_id);

-- ============================================
-- INDEXES
-- ============================================
create index idx_properties_user_id on public.properties(user_id);
create index idx_tenants_user_id on public.tenants(user_id);
create index idx_leases_user_id on public.leases(user_id);
create index idx_leases_property_id on public.leases(property_id);
create index idx_leases_tenant_id on public.leases(tenant_id);
create index idx_payments_lease_id on public.payments(lease_id);
create index idx_notifications_lease_id on public.notifications(lease_id);
create index idx_escalations_lease_id on public.escalations(lease_id);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();
create trigger set_updated_at before update on public.properties
  for each row execute procedure public.handle_updated_at();
create trigger set_updated_at before update on public.tenants
  for each row execute procedure public.handle_updated_at();
create trigger set_updated_at before update on public.leases
  for each row execute procedure public.handle_updated_at();
