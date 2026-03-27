import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Search, Pencil, Trash2, Users, Mail, Phone, IdCard } from 'lucide-react'
import { getTenants, createTenant, updateTenant, deleteTenant } from '@/services/tenants'
import type { Tenant } from '@/lib/database.types'

const emptyForm = { first_name: '', last_name: '', email: '', phone: '', id_number: '', notes: '' }

export default function Tenants() {
  const { user } = useAuth()
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Tenant | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadTenants() }, [])

  async function loadTenants() {
    try { setTenants(await getTenants()) }
    catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  function openCreate() { setEditing(null); setForm(emptyForm); setDialogOpen(true) }

  function openEdit(tenant: Tenant) {
    setEditing(tenant)
    setForm({
      first_name: tenant.first_name, last_name: tenant.last_name,
      email: tenant.email || '', phone: tenant.phone,
      id_number: tenant.id_number || '', notes: tenant.notes || '',
    })
    setDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    try {
      if (editing) { await updateTenant(editing.id, form) }
      else { await createTenant({ ...form, user_id: user.id }) }
      setDialogOpen(false)
      loadTenants()
    } catch (err) { console.error(err) }
    finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this tenant?')) return
    try { await deleteTenant(id); loadTenants() }
    catch (err) { console.error(err) }
  }

  const filtered = tenants.filter(t =>
    `${t.first_name} ${t.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    t.phone.includes(search) ||
    (t.email || '').toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-4 text-sm text-muted-foreground">Loading tenants...</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tenants</h2>
          <p className="text-sm text-muted-foreground">{tenants.length} tenants registered</p>
        </div>
        <Button onClick={openCreate} className="shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Add Tenant
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search by name, phone, or email..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-white" />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-white py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50">
            <Users className="h-8 w-8 text-green-500" />
          </div>
          <p className="mt-4 text-lg font-semibold">No tenants yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Add your first tenant to get started</p>
          <Button onClick={openCreate} className="mt-4">
            <Plus className="mr-2 h-4 w-4" /> Add Tenant
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tenant</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone</th>
                <th className="hidden px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">Email</th>
                <th className="hidden px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground lg:table-cell">ID Number</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(tenant => (
                <tr key={tenant.id} className="transition-colors hover:bg-muted/20">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 text-xs font-bold text-white">
                        {tenant.first_name[0]}{tenant.last_name[0]}
                      </div>
                      <div>
                        <p className="font-medium">{tenant.first_name} {tenant.last_name}</p>
                        {tenant.notes && <p className="text-xs text-muted-foreground truncate max-w-[200px]">{tenant.notes}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" />
                      {tenant.phone}
                    </div>
                  </td>
                  <td className="hidden px-5 py-3.5 md:table-cell">
                    {tenant.email ? (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        {tenant.email}
                      </div>
                    ) : (
                      <span className="text-muted-foreground/50">-</span>
                    )}
                  </td>
                  <td className="hidden px-5 py-3.5 lg:table-cell">
                    {tenant.id_number ? (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <IdCard className="h-3.5 w-3.5" />
                        {tenant.id_number}
                      </div>
                    ) : (
                      <span className="text-muted-foreground/50">-</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600" onClick={() => openEdit(tenant)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50 hover:text-red-600" onClick={() => handleDelete(tenant.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
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
          <DialogHeader><DialogTitle>{editing ? 'Edit Tenant' : 'Add Tenant'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name *</Label>
                <Input value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Last Name *</Label>
                <Input value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Phone *</Label>
              <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required placeholder="072 123 4567" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>ID Number</Label>
              <Input value={form.id_number} onChange={e => setForm({ ...form, id_number: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update Tenant' : 'Add Tenant'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
