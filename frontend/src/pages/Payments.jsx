import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function Payments() {
  const [payments, setPayments] = useState([])
  const [tenants, setTenants] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ tenant_id: '', amount: '', method: 'cash', payment_date: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/payments').then(res => setPayments(res.data))
    api.get('/tenants').then(res => setTenants(res.data))
  }, [])

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
    setLoading(true)
    try {
      await api.post('/payments', {
        ...form,
        amount: Number(form.amount),
        payment_date: form.payment_date || new Date().toISOString().split('T')[0]
      })
      setForm({ tenant_id: '', amount: '', method: 'cash', payment_date: '' })
      setShowForm(false)
      const res = await api.get('/payments')
      setPayments(res.data)
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to record payment')
    } finally {
      setLoading(false)
    }
  }

  const downloadReceipt = (paymentId) => {
    const token = localStorage.getItem('token')
    window.open(`http://localhost:5000/api/receipts/${paymentId}?token=${token}`, '_blank')
  }

  const fmt = (n) => `₦${Number(n).toLocaleString()}`

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <button onClick={() => navigate('/')} className="text-sm text-blue-600 hover:underline">← Dashboard</button>
        <span className="text-lg font-bold text-blue-600">Payments</span>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700"
        >
          + Record
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
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
                    <option key={t.id} value={t.id}>
                      {t.full_name} — {t.units?.unit_number}
                    </option>
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
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Record payment'}
              </button>
            </div>
          </form>
        )}

        {payments.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            No payments yet.
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map(p => (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{p.tenants?.full_name}</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {p.tenants?.units?.properties?.name} · {p.tenants?.units?.unit_number}
                    </p>
                    <p className="text-xs text-gray-400">{p.method} · {p.payment_date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">{fmt(p.amount)}</p>
                    <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-lg">{p.status}</span>
                    <button
                      onClick={() => downloadReceipt(p.id)}
                      className="block mt-2 text-xs text-blue-600 hover:underline ml-auto"
                    >
                      Download receipt
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}