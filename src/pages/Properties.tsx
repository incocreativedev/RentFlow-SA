import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Search, Pencil, Trash2, Building } from 'lucide-react'
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

  if (loading) return <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search properties..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Add Property</Button>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No properties yet</p>
            <p className="text-sm text-muted-foreground mb-4">Add your first property to get started</p>
            <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Add Property</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(property => (
            <Card key={property.id}>
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <CardTitle className="text-base">{property.address}</CardTitle>
                  <p className="text-sm text-muted-foreground">{property.suburb}{property.suburb ? ', ' : ''}{property.city}</p>
                </div>
                <Badge variant={property.is_active ? 'success' : 'secondary'}>
                  {property.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="capitalize">{property.property_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Rent</span>
                    <span className="font-semibold">{formatCurrency(property.monthly_rent)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Owner</span>
                    <span>{property.owner_name}</span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(property)}>
                    <Pencil className="mr-1 h-3 w-3" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDelete(property.id)}>
                    <Trash2 className="mr-1 h-3 w-3" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
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
              <Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Suburb</Label>
                <Input value={form.suburb} onChange={e => setForm({ ...form, suburb: e.target.value })} />
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
              <Button type="submit" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
