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
      .catch(() => setError('This link is invalid or has expired.'))
      .finally(() => setLoading(false))
  }, [token])

  const fmt = (n) => `₦${Number(n).toLocaleString()}`

  const downloadReceipt = (paymentId) => {
    window.open(`${import.meta.env.VITE_API_URL}/receipts/${paymentId}?token=${token}&portal=true`, '_blank')
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400 text-sm">Loading your portal...</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center max-w-sm">
        <p className="text-4xl mb-3">🔒</p>
        <p className="text-gray-900 font-semibold mb-2">Link expired</p>
        <p className="text-gray-400 text-sm">{error}</p>
        <p className="text-gray-400 text-xs mt-2">Ask your landlord to send a new link.</p>
      </div>
    </div>
  )

  const isOverdue = new Date(data.tenant.next_due_date) < new Date()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 px-4 py-6 text-white">
        <p className="text-xs text-blue-200 mb-1">Tenant Portal</p>
        <h1 className="text-xl font-bold">{data.tenant.full_name}</h1>
        <p className="text-sm text-blue-200">{data.tenant.property} · {data.tenant.unit}</p>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Rent details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">Monthly rent</span>
              <span className="text-xs font-semibold text-gray-900">{fmt(data.tenant.rent_amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">Payment cycle</span>
              <span className="text-xs text-gray-700 capitalize">{data.tenant.payment_cycle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">Lease start</span>
              <span className="text-xs text-gray-700">{data.tenant.lease_start}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">Lease end</span>
              <span className="text-xs text-gray-700">{data.tenant.lease_end || 'Not set'}</span>
            </div>
            {data.tenant.notes && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400">Notes</span>
                <p className="text-xs text-gray-700 mt-1 italic">{data.tenant.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div className={`rounded-2xl border p-5 ${isOverdue ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
          <p className="text-xs text-gray-500 mb-1">Next due date</p>
          <p className={`text-2xl font-bold ${isOverdue ? 'text-red-600' : 'text-green-600'}`}>
            {data.tenant.next_due_date}
          </p>
          <p className={`text-xs mt-1 ${isOverdue ? 'text-red-500' : 'text-green-500'}`}>
            {isOverdue ? 'Overdue — please contact your landlord' : 'Upcoming payment'}
          </p>
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
                    <p className="text-xs text-gray-400">{p.payment_date} · {p.method}</p>
                  </div>
                  <button
                    onClick={() => downloadReceipt(p.id)}
                    className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-lg hover:bg-blue-100"
                  >
                    Receipt
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Need help?</h3>
          <p className="text-xs text-gray-500 mb-3">Contact your landlord for any questions about your tenancy.</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">📧</span>
              <span className="text-gray-700">{data.tenant.landlord_email || 'Email not provided'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">📱</span>
              <span className="text-gray-700">{data.tenant.landlord_phone || 'Phone not provided'}</span>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-300 pb-4">Powered by Stablee</p>
      </div>
    </div>
  )
}