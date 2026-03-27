import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select } from '@/components/ui/select'
import { Plus, Search, CreditCard, Trash2 } from 'lucide-react'
import { getPayments, createPayment, deletePayment } from '@/services/payments'
import { getActiveLeases } from '@/services/leases'
import type { Payment, Lease } from '@/lib/database.types'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function Payments() {
  const { user } = useAuth()
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

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-4 text-sm text-muted-foreground">Loading payments...</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Payments</h2>
          <p className="text-sm text-muted-foreground">{payments.length} payments recorded</p>
        </div>
        <Button onClick={openCreate} disabled={leases.length === 0} className="shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Record Payment
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search by tenant or reference..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-white" />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-white py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50">
            <CreditCard className="h-8 w-8 text-purple-500" />
          </div>
          <p className="mt-4 text-lg font-semibold">No payments recorded</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {leases.length === 0 ? 'Create active leases first' : 'Record your first payment'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tenant</th>
                <th className="hidden px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">Property</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</th>
                <th className="hidden px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground lg:table-cell">Method</th>
                <th className="hidden px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground lg:table-cell">Period</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(payment => (
                <tr key={payment.id} className="transition-colors hover:bg-muted/20">
                  <td className="px-5 py-3.5 text-muted-foreground">{formatDate(payment.payment_date)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-600">
                        {payment.lease?.tenant?.first_name?.[0]}{payment.lease?.tenant?.last_name?.[0]}
                      </div>
                      <span className="font-medium">{payment.lease?.tenant?.first_name} {payment.lease?.tenant?.last_name}</span>
                    </div>
                  </td>
                  <td className="hidden px-5 py-3.5 text-muted-foreground md:table-cell">{payment.lease?.property?.address}</td>
                  <td className="px-5 py-3.5 font-semibold text-green-600">{formatCurrency(payment.amount)}</td>
                  <td className="hidden px-5 py-3.5 lg:table-cell"><Badge variant="secondary" className="uppercase text-[10px]">{payment.payment_method}</Badge></td>
                  <td className="hidden px-5 py-3.5 text-muted-foreground lg:table-cell">{payment.period_month}/{payment.period_year}</td>
                  <td className="px-5 py-3.5 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50 hover:text-red-600" onClick={() => handleDelete(payment.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
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
