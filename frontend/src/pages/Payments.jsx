import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ListSkeleton } from '../components/Skeleton'
import BottomNav from '../components/BottomNav'
import api from '../api'

export default function Payments() {
  const [payments, setPayments] = useState([])
  const [tenants, setTenants] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ tenant_id: '', unit_id: '', amount: '', method: 'cash', payment_date: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  const filteredPayments = payments.filter(p =>
    p.tenants?.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    fetchPayments()
    api.get('/tenants').then(res => setTenants(res.data))
  }, [])

  const fetchPayments = () => {
    setLoading(true)
    api.get('/payments')
      .then(res => setPayments(res.data))
      .finally(() => setLoading(false))
  }

  const handleTenantChange = (tenant_id) => {
    const tenant = tenants.find(t => t.id === tenant_id)
    setForm(f => ({
      ...f,
      tenant_id,
      unit_id: tenant?.unit_id || '',
      amount: tenant?.units?.rent_amount || ''
    }))
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
      setForm({ tenant_id: '', unit_id: '', amount: '', method: 'cash', payment_date: '' })
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
      toast.error(err.response?.data?.error || 'Failed to delete payment', { id: toastId })
    }
  }

  const downloadReceipt = (paymentId) => {
    const token = localStorage.getItem('token')
    window.open(`${import.meta.env.VITE_API_URL}/receipts/${paymentId}?token=${token}`, '_blank')
  }

  const fmt = (n) => `₦${Number(n).toLocaleString()}`

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">S</span>
          </div>
          <span className="text-base font-bold text-gray-900">Payments</span>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg hover:bg-blue-700"
        >
          +
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Record payment</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Tenant</label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.tenant_id}
                  onChange={e => handleTenantChange(e.target.value)}
                  required
                >
                  <option value="">Select tenant</option>
                  {tenants.map(t => (
                    <option key={t.id} value={t.id}>{t.full_name} — {t.units?.unit_number}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Amount (₦)</label>
                <input
                  type="number"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.amount}
                  onChange={e => setForm({ ...form, amount: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Payment method</label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.method}
                  onChange={e => setForm({ ...form, method: e.target.value })}
                >
                  <option value="cash">Cash</option>
                  <option value="transfer">Bank transfer</option>
                  <option value="online">Online</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Payment date</label>
                <input
                  type="date"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.payment_date}
                  onChange={e => setForm({ ...form, payment_date: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Record payment'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        {loading ? (
          <ListSkeleton count={4} />
        ) : payments.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">💳</p>
            <p className="text-gray-500 text-sm font-medium">No payments yet</p>
            <p className="text-gray-400 text-xs mt-1">Tap + to record a payment</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by tenant name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-3">
              {filteredPayments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">No payments found for "{search}"</p>
                </div>
              ) : (
                filteredPayments.map(p => (
                  <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{p.tenants?.full_name}</h3>
                        <p className="text-xs text-gray-400 mt-1">{p.tenants?.units?.properties?.name} · {p.tenants?.units?.unit_number}</p>
                        <p className="text-xs text-gray-400">{p.method} · {p.payment_date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">{fmt(p.amount)}</p>
                        <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-lg">{p.status}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
                      <button
                        onClick={() => downloadReceipt(p.id)}
                        className="flex-1 text-xs bg-blue-50 text-blue-600 py-1.5 rounded-lg hover:bg-blue-100"
                      >
                        Receipt
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="flex-1 text-xs bg-red-50 text-red-500 py-1.5 rounded-lg hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  )
}