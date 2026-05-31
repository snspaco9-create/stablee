import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'
import PageHeader from '../components/PageHeader'
import BottomNav from '../components/BottomNav'
import SkeletonCard from '../components/SkeletonCard'
import api from '../api'

export default function Payments() {
  const [payments, setPayments] = useState([])
  const [tenants, setTenants] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ tenant_id: '', amount: '', method: 'cash', payment_date: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      api.get('/payments'),
      api.get('/tenants')
    ]).then(([paymentsRes, tenantsRes]) => {
      setPayments(paymentsRes.data)
      setTenants(tenantsRes.data)
    }).finally(() => setLoading(false))
  }, [])

  const fetchPayments = () => api.get('/payments').then(res => setPayments(res.data))

  const handleTenantChange = (tenant_id) => {
    const tenant = tenants.find(t => t.id === tenant_id)
    setForm(f => ({ ...f, tenant_id, unit_id: tenant?.unit_id || '', amount: tenant?.units?.rent_amount || '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post('/payments', {
        ...form,
        amount: Number(form.amount),
        payment_date: form.payment_date || new Date().toISOString().split('T')[0]
      })
      toast.success('Payment recorded')
      setForm({ tenant_id: '', amount: '', method: 'cash', payment_date: '' })
      setShowForm(false)
      fetchPayments()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to record payment')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    const toastId = toast.loading('Deleting payment...')
    try {
      await api.delete(`/payments/${id}`)
      toast.success('Payment deleted', { id: toastId })
      fetchPayments()
    } catch (err) {
      toast.error('Failed to delete payment', { id: toastId })
    }
  }

  const downloadReceipt = (paymentId) => {
    const token = localStorage.getItem('token')
    window.open(`${import.meta.env.VITE_API_URL}/receipts/${paymentId}?token=${token}`, '_blank')
  }

  const fmt = (n) => `₦${Number(n).toLocaleString()}`

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <PageHeader
        title="Payments"
        action={
          <button
            onClick={() => setShowForm(true)}
            className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
          </button>
        }
      />

      <div className="px-4 py-4">
        {showForm && (
          <div className="card p-5 mb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Record payment</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="label">Tenant</label>
                <select className="input" value={form.tenant_id} onChange={e => handleTenantChange(e.target.value)} required>
                  <option value="">Select tenant</option>
                  {tenants.map(t => <option key={t.id} value={t.id}>{t.full_name} — {t.units?.unit_number}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Amount (₦)</label>
                <input className="input" type="number" placeholder="0" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
              </div>
              <div>
                <label className="label">Payment method</label>
                <select className="input" value={form.method} onChange={e => setForm({ ...form, method: e.target.value })}>
                  <option value="cash">Cash</option>
                  <option value="transfer">Bank transfer</option>
                  <option value="online">Online</option>
                </select>
              </div>
              <div>
                <label className="label">Payment date</label>
                <input className="input" type="date" value={form.payment_date} onChange={e => setForm({ ...form, payment_date: e.target.value })} />
              </div>
              <div className="flex gap-2 pt-1">
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? 'Saving...' : 'Record payment'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <SkeletonCard key={i} lines={2} />)}
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-20">
            <CreditCard size={48} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No payments yet</p>
            <p className="text-gray-400 text-sm mt-1">Tap + to record a payment</p>
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map(p => (
              <div key={p.id} className="card p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{p.tenants?.full_name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {p.tenants?.units?.properties?.name} · {p.tenants?.units?.unit_number}
                    </p>
                    <p className="text-xs text-gray-400 capitalize">{p.method} · {p.payment_date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">{fmt(p.amount)}</p>
                    <span className="badge-success">{p.status}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => downloadReceipt(p.id)} className="flex-1 text-xs bg-blue-50 text-blue-600 py-2 rounded-xl hover:bg-blue-100 font-medium transition-colors">
                    Download receipt
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="flex-1 text-xs bg-red-50 text-red-500 py-2 rounded-xl hover:bg-red-100 font-medium transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}