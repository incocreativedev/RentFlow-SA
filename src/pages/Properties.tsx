import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Search, Pencil, Trash2, Building, MapPin, User } from 'lucide-react'
import { getProperties, createProperty, updateProperty, deleteProperty } from '@/services/properties'
import type { Property } from '@/lib/database.types'
import { formatCurrency } from '@/lib/utils'

const emptyForm: {
  address: string; suburb: string; city: string; province: string;
  property_type: string; monthly_rent: number; owner_name: string;
  owner_email: string; owner_phone: string; notes: string; is_active: boolean;
} = {
  address: '', suburb: '', city: 'Durban', province: 'KwaZulu-Natal',
  property_type: 'apartment', monthly_rent: 0, owner_name: '',
  owner_email: '', owner_phone: '', notes: '', is_active: true,
}

const typeIcons: Record<string, string> = {
  apartment: '🏢',
  house: '🏠',
  townhouse: '🏘️',
  flat: '🏬',
  commercial: '🏪',
  other: '🏗️',
}

export default function Properties() {
  const { user } = useAuth()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Property | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadProperties() }, [])

  async function loadProperties() {
    try {
      const data = await getProperties()
      setProperties(data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  function openEdit(property: Property) {
    setEditing(property)
    setForm({
      address: property.address, suburb: property.suburb || '', city: property.city,
      province: property.province, property_type: property.property_type,
      monthly_rent: property.monthly_rent, owner_name: property.owner_name,
      owner_email: property.owner_email || '', owner_phone: property.owner_phone || '',
      notes: property.notes || '', is_active: property.is_active,
    })
    setDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    try {
      const payload = { ...form, property_type: form.property_type as Property['property_type'] }
      if (editing) {
        await updateProperty(editing.id, payload)
      } else {
        await createProperty({ ...payload, user_id: user.id })
      }
      setDialogOpen(false)
      loadProperties()
    } catch (err) { console.error(err) }
    finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this property?')) return
    try {
      await deleteProperty(id)
      loadProperties()
    } catch (err) { console.error(err) }
  }

  const filtered = properties.filter(p =>
    p.address.toLowerCase().includes(search.toLowerCase()) ||
    p.owner_name.toLowerCase().includes(search.toLowerCase()) ||
    (p.suburb || '').toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-4 text-sm text-muted-foreground">Loading properties...</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Properties</h2>
          <p className="text-sm text-muted-foreground">{properties.length} total properties in your portfolio</p>
        </div>
        <Button onClick={openCreate} className="shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Add Property
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search by address, suburb, or owner..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-white" />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-white py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
            <Building className="h-8 w-8 text-blue-500" />
          </div>
          <p className="mt-4 text-lg font-semibold">No properties yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Add your first property to get started</p>
          <Button onClick={openCreate} className="mt-4">
            <Plus className="mr-2 h-4 w-4" /> Add Property
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map(property => (
            <div key={property.id} className="group overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md">
              {/* Card header with type */}
              <div className="flex items-center justify-between border-b bg-muted/30 px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{typeIcons[property.property_type] || '🏗️'}</span>
                  <span className="text-sm font-medium capitalize text-muted-foreground">{property.property_type}</span>
                </div>
                <Badge variant={property.is_active ? 'success' : 'secondary'} className="text-xs">
                  {property.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              {/* Card body */}
              <div className="p-5">
                <h3 className="font-semibold text-foreground">{property.address}</h3>
                {(property.suburb || property.city) && (
                  <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {property.suburb}{property.suburb ? ', ' : ''}{property.city}
                  </p>
                )}

                <div className="mt-4 flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
                  <span className="text-sm text-muted-foreground">Monthly Rent</span>
                  <span className="text-lg font-bold text-foreground">{formatCurrency(property.monthly_rent)}</span>
                </div>

                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-3.5 w-3.5" />
                  <span>Owner: <span className="font-medium text-foreground">{property.owner_name}</span></span>
                </div>
              </div>

              {/* Card actions */}
              <div className="flex border-t">
                <button
                  onClick={() => openEdit(property)}
                  className="flex flex-1 items-center justify-center gap-2 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-blue-50 hover:text-blue-600"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <div className="w-px bg-border" />
                <button
                  onClick={() => handleDelete(property.id)}
                  className="flex flex-1 items-center justify-center gap-2 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Property Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent onClose={() => setDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Property' : 'Add Property'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Address *</Label>
              <Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required placeholder="e.g. 12 Main Street" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Suburb</Label>
                <Input value={form.suburb} onChange={e => setForm({ ...form, suburb: e.target.value })} placeholder="e.g. Umhlanga" />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={form.property_type} onChange={e => setForm({ ...form, property_type: e.target.value as Property['property_type'] })}>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="flat">Flat</option>
                  <option value="commercial">Commercial</option>
                  <option value="other">Other</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Monthly Rent (ZAR) *</Label>
                <Input type="number" min="0" step="0.01" value={form.monthly_rent} onChange={e => setForm({ ...form, monthly_rent: parseFloat(e.target.value) || 0 })} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Owner Name *</Label>
              <Input value={form.owner_name} onChange={e => setForm({ ...form, owner_name: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Owner Email</Label>
                <Input type="email" value={form.owner_email} onChange={e => setForm({ ...form, owner_email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Owner Phone</Label>
                <Input value={form.owner_phone} onChange={e => setForm({ ...form, owner_phone: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update Property' : 'Add Property'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
