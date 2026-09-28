import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

export default function TenantPortal() {
  const { token } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/tenant-portal/${token}`)
      .then(res => setData(res.data))
      .catch(err => setError(err.response?.data?.error || 'This link is invalid or has expired.'))
      .finally(() => setLoading(false))
  }, [token])

  const fmt = (n) => `₦${Number(n).toLocaleString()}`

  const fmtDate = (d) => d
    ? new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Not set'

  const downloadReceipt = (paymentId) => {
    window.open(`${import.meta.env.VITE_API_URL}/receipts/${paymentId}?portal_token=${token}`, '_blank')
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400 text-sm">Loading your portal...</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center max-w-sm w-full">
        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-5V7" />
          </svg>
        </div>
        <p className="text-gray-900 font-semibold mb-2">Link expired</p>
        <p className="text-gray-400 text-sm">{error}</p>
        <p className="text-gray-400 text-xs mt-2">Contact your landlord for a new link.</p>
      </div>
    </div>
  )

  const isOverdue = new Date(data.tenant.next_due_date) < new Date()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 px-4 py-8 text-white">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-sm text-blue-200 font-medium">Stablee Tenant Portal</span>
        </div>
        <h1 className="text-xl font-bold">{data.tenant.full_name}</h1>
        <p className="text-sm text-blue-200 mt-0.5">{data.tenant.property} · {data.tenant.unit}</p>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        <div className={`rounded-2xl border p-5 ${isOverdue ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
          <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Next due date</p>
          <p className={`text-2xl font-bold ${isOverdue ? 'text-red-600' : 'text-green-600'}`}>
            {fmtDate(data.tenant.next_due_date)}
          </p>
          <p className={`text-xs mt-1 ${isOverdue ? 'text-red-500' : 'text-green-500'}`}>
            {isOverdue ? 'Overdue — please contact your landlord' : 'Upcoming payment'}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Rent details</h3>
          <div className="space-y-2.5">
            {[
              { label: 'Monthly rent', value: fmt(data.tenant.rent_amount) },
              { label: 'Payment cycle', value: data.tenant.payment_cycle?.charAt(0).toUpperCase() + data.tenant.payment_cycle?.slice(1) },
              { label: 'Lease start', value: fmtDate(data.tenant.lease_start) },
              { label: 'Lease end', value: fmtDate(data.tenant.lease_end) },
              { label: 'Property address', value: data.tenant.address }
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center">
                <span className="text-xs text-gray-400">{item.label}</span>
                <span className="text-xs font-medium text-gray-700">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Payment history ({data.payments.length})
          </h3>
          {data.payments.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">No payments recorded yet</p>
          ) : (
            <div className="space-y-3">
              {data.payments.map(p => (
                <div key={p.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{fmt(p.amount)}</p>
                    <p className="text-xs text-gray-400">{fmtDate(p.payment_date)} · {p.method}</p>
                  </div>
                  <button
                    onClick={() => downloadReceipt(p.id)}
                    className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-lg hover:bg-blue-100"
                  >
                    Receipt
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Need help?</h3>
          <p className="text-xs text-gray-500">Contact your landlord for any questions about your tenancy or payments.</p>
        </div>

        <p className="text-center text-xs text-gray-300 pb-4">Powered by Stablee</p>
      </div>
    </div>
  )
}