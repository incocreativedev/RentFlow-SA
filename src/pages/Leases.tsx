import { useEffect, useState } from 'react'
// import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select } from '@/components/ui/select'
import { Plus, Search, Pencil, Trash2, FileText } from 'lucide-react'
import { getLeases, createLease, updateLease, deleteLease } from '@/services/leases'
import { getProperties } from '@/services/properties'
import { getTenants } from '@/services/tenants'
import type { Lease, Property, Tenant } from '@/lib/database.types'
import { formatCurrency, formatDate } from '@/lib/utils'

const statusColors: Record<string, BadgeVariant> = {
  active: 'success', expired: 'secondary', terminated: 'destructive', pending: 'warning',
}
type BadgeVariant = 'success' | 'secondary' | 'destructive' | 'warning'

export default function Leases() {
  const user = { id: 'demo' }
  const [leases, setLeases] = useState<Lease[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Lease | null>(null)
  const [form, setForm] = useState({
    property_id: '', tenant_id: '', monthly_rent: 0, rent_due_day: 1,
    start_date: '', end_date: '', deposit_amount: 0, status: 'active' as Lease['status'],
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    try {
      const [l, p, t] = await Promise.all([getLeases(), getProperties(), getTenants()])
      setLeases(l); setProperties(p); setTenants(t)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  function openCreate() {
    setEditing(null)
    setForm({
      property_id: properties[0]?.id || '', tenant_id: tenants[0]?.id || '',
      monthly_rent: 0, rent_due_day: 1, start_date: new Date().toISOString().split('T')[0],
      end_date: '', deposit_amount: 0, status: 'active',
    })
    setDialogOpen(true)
  }

  function openEdit(lease: Lease) {
    setEditing(lease)
    setForm({
      property_id: lease.property_id, tenant_id: lease.tenant_id,
      monthly_rent: lease.monthly_rent, rent_due_day: lease.rent_due_day,
      start_date: lease.start_date, end_date: lease.end_date || '',
      deposit_amount: lease.deposit_amount, status: lease.status,
    })
    setDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    try {
      const payload = { ...form, end_date: form.end_date || null }
      if (editing) { await updateLease(editing.id, payload) }
      else { await createLease({ ...payload, user_id: user.id }) }
      setDialogOpen(false)
      loadData()
    } catch (err) { console.error(err) }
    finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this lease?')) return
    try { await deleteLease(id); loadData() } catch (err) { console.error(err) }
  }

  const filtered = leases.filter(l => {
    const tenantName = `${l.tenant?.first_name || ''} ${l.tenant?.last_name || ''}`.toLowerCase()
    const propertyAddr = (l.property?.address || '').toLowerCase()
    return tenantName.includes(search.toLowerCase()) || propertyAddr.includes(search.toLowerCase())
  })

  if (loading) return <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search leases..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button onClick={openCreate} disabled={properties.length === 0 || tenants.length === 0}>
          <Plus className="mr-2 h-4 w-4" /> New Lease
        </Button>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No leases yet</p>
            <p className="text-sm text-muted-foreground mb-4">
              {properties.length === 0 || tenants.length === 0
                ? 'Add properties and tenants first'
                : 'Create your first lease to start tracking rent'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Tenant</th>
                <th className="px-4 py-3 text-left font-medium">Property</th>
                <th className="px-4 py-3 text-left font-medium">Rent</th>
                <th className="px-4 py-3 text-left font-medium">Due Day</th>
                <th className="px-4 py-3 text-left font-medium">Period</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(lease => (
                <tr key={lease.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{lease.tenant?.first_name} {lease.tenant?.last_name}</td>
                  <td className="px-4 py-3">{lease.property?.address}</td>
                  <td className="px-4 py-3">{formatCurrency(lease.monthly_rent)}</td>
                  <td className="px-4 py-3">{lease.rent_due_day}</td>
                  <td className="px-4 py-3">{formatDate(lease.start_date)} - {lease.end_date ? formatDate(lease.end_date) : 'Ongoing'}</td>
                  <td className="px-4 py-3"><Badge variant={statusColors[lease.status]}>{lease.status}</Badge></td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(lease)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(lease.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent onClose={() => setDialogOpen(false)}>
          <DialogHeader><DialogTitle>{editing ? 'Edit Lease' : 'New Lease'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Property *</Label>
              <Select value={form.property_id} onChange={e => {
                const prop = properties.find(p => p.id === e.target.value)
                setForm({ ...form, property_id: e.target.value, monthly_rent: prop?.monthly_rent || form.monthly_rent })
              }}>
                {properties.map(p => <option key={p.id} value={p.id}>{p.address}</option>)}
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tenant *</Label>
              <Select value={form.tenant_id} onChange={e => setForm({ ...form, tenant_id: e.target.value })}>
                {tenants.map(t => <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>)}
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Monthly Rent (ZAR) *</Label>
                <Input type="number" min="0" step="0.01" value={form.monthly_rent} onChange={e => setForm({ ...form, monthly_rent: parseFloat(e.target.value) || 0 })} required />
              </div>
              <div className="space-y-2">
                <Label>Rent Due Day *</Label>
                <Input type="number" min="1" max="31" value={form.rent_due_day} onChange={e => setForm({ ...form, rent_due_day: parseInt(e.target.value) || 1 })} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Deposit Amount</Label>
                <Input type="number" min="0" step="0.01" value={form.deposit_amount} onChange={e => setForm({ ...form, deposit_amount: parseFloat(e.target.value) || 0 })} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Lease['status'] })}>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="expired">Expired</option>
                  <option value="terminated">Terminated</option>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
