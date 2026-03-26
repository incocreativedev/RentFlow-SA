import { useEffect, useState } from 'react'
// import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select } from '@/components/ui/select'
import { Plus, Search, CreditCard, Trash2 } from 'lucide-react'
import { getPayments, createPayment, deletePayment } from '@/services/payments'
import { getActiveLeases } from '@/services/leases'
import type { Payment, Lease } from '@/lib/database.types'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function Payments() {
  const user = { id: 'demo' }
  const [payments, setPayments] = useState<Payment[]>([])
  const [leases, setLeases] = useState<Lease[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const now = new Date()
  const [form, setForm] = useState({
    lease_id: '', amount: 0, payment_date: now.toISOString().split('T')[0],
    payment_method: 'eft' as Payment['payment_method'], reference: '',
    notes: '', period_month: now.getMonth() + 1, period_year: now.getFullYear(),
  })

  useEffect(() => { loadData() }, [])

  async function loadData() {
    try {
      const [p, l] = await Promise.all([getPayments(), getActiveLeases()])
      setPayments(p); setLeases(l)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  function openCreate() {
    const selectedLease = leases[0]
    setForm({
      lease_id: selectedLease?.id || '', amount: selectedLease?.monthly_rent || 0,
      payment_date: now.toISOString().split('T')[0],
      payment_method: 'eft', reference: '', notes: '',
      period_month: now.getMonth() + 1, period_year: now.getFullYear(),
    })
    setDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    try {
      await createPayment({ ...form, user_id: user.id })
      setDialogOpen(false)
      loadData()
    } catch (err) { console.error(err) }
    finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this payment?')) return
    try { await deletePayment(id); loadData() } catch (err) { console.error(err) }
  }

  const filtered = payments.filter(p => {
    const tenantName = `${p.lease?.tenant?.first_name || ''} ${p.lease?.tenant?.last_name || ''}`.toLowerCase()
    return tenantName.includes(search.toLowerCase()) || (p.reference || '').toLowerCase().includes(search.toLowerCase())
  })

  if (loading) return <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search payments..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button onClick={openCreate} disabled={leases.length === 0}>
          <Plus className="mr-2 h-4 w-4" /> Record Payment
        </Button>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No payments recorded</p>
            <p className="text-sm text-muted-foreground mb-4">
              {leases.length === 0 ? 'Create active leases first' : 'Record your first payment'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Date</th>
                <th className="px-4 py-3 text-left font-medium">Tenant</th>
                <th className="px-4 py-3 text-left font-medium">Property</th>
                <th className="px-4 py-3 text-left font-medium">Amount</th>
                <th className="px-4 py-3 text-left font-medium">Method</th>
                <th className="px-4 py-3 text-left font-medium">Period</th>
                <th className="px-4 py-3 text-left font-medium">Reference</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(payment => (
                <tr key={payment.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">{formatDate(payment.payment_date)}</td>
                  <td className="px-4 py-3 font-medium">{payment.lease?.tenant?.first_name} {payment.lease?.tenant?.last_name}</td>
                  <td className="px-4 py-3">{payment.lease?.property?.address}</td>
                  <td className="px-4 py-3 font-semibold text-green-600">{formatCurrency(payment.amount)}</td>
                  <td className="px-4 py-3"><Badge variant="secondary">{payment.payment_method.toUpperCase()}</Badge></td>
                  <td className="px-4 py-3">{payment.period_month}/{payment.period_year}</td>
                  <td className="px-4 py-3">{payment.reference || '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(payment.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent onClose={() => setDialogOpen(false)}>
          <DialogHeader><DialogTitle>Record Payment</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Lease *</Label>
              <Select value={form.lease_id} onChange={e => {
                const lease = leases.find(l => l.id === e.target.value)
                setForm({ ...form, lease_id: e.target.value, amount: lease?.monthly_rent || form.amount })
              }}>
                {leases.map(l => (
                  <option key={l.id} value={l.id}>
                    {l.tenant?.first_name} {l.tenant?.last_name} - {l.property?.address}
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Amount (ZAR) *</Label>
                <Input type="number" min="0" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })} required />
              </div>
              <div className="space-y-2">
                <Label>Payment Date *</Label>
                <Input type="date" value={form.payment_date} onChange={e => setForm({ ...form, payment_date: e.target.value })} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select value={form.payment_method} onChange={e => setForm({ ...form, payment_method: e.target.value as Payment['payment_method'] })}>
                  <option value="eft">EFT</option>
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="debit_order">Debit Order</option>
                  <option value="other">Other</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Reference</Label>
                <Input value={form.reference} onChange={e => setForm({ ...form, reference: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Period Month</Label>
                <Input type="number" min="1" max="12" value={form.period_month} onChange={e => setForm({ ...form, period_month: parseInt(e.target.value) || 1 })} />
              </div>
              <div className="space-y-2">
                <Label>Period Year</Label>
                <Input type="number" value={form.period_year} onChange={e => setForm({ ...form, period_year: parseInt(e.target.value) || now.getFullYear() })} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Record Payment'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
