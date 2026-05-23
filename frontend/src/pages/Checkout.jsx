import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

const PLANS = {
  starter: {
    name: 'Starter',
    price: 350000,
    display: '₦3,500/month',
    color: 'blue'
  },
  pro: {
    name: 'Pro',
    price: 800000,
    display: '₦8,000/month',
    color: 'purple'
  }
}

export default function Checkout() {
  const { plan } = useParams()
  const { landlord, login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const selectedPlan = PLANS[plan]

  useEffect(() => {
    if (!selectedPlan) navigate('/pricing')
  }, [plan])

  const handlePayment = async () => {
    setLoading(true)
    try {
      const res = await api.post('/subscriptions/initialize', { plan })
      const { authorization_url, reference } = res.data

      window.location.href = authorization_url
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to initialize payment')
      setLoading(false)
    }
  }

  if (!selectedPlan) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <button onClick={() => navigate('/pricing')} className="text-sm text-blue-600 hover:underline">← Plans</button>
        <span className="text-lg font-bold text-blue-600">Checkout</span>
        <span></span>
      </div>

      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Order summary</h3>
          <div className="flex justify-between items-center py-3 border-b border-gray-50">
            <span className="text-sm text-gray-600">Stablee {selectedPlan.name}</span>
            <span className="text-sm font-semibold text-gray-900">{selectedPlan.display}</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-sm font-semibold text-gray-900">Total</span>
            <span className="text-lg font-bold text-gray-900">{selectedPlan.display}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Billing details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">Name</span>
              <span className="text-xs text-gray-700">{landlord?.full_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">Email</span>
              <span className="text-xs text-gray-700">{landlord?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">Plan</span>
              <span className="text-xs text-gray-700">Stablee {selectedPlan.name}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className={`w-full py-3 rounded-xl text-white font-medium text-sm disabled:opacity-50 ${
            plan === 'starter' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {loading ? 'Redirecting to payment...' : `Pay ${selectedPlan.display}`}
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          Secured by Paystack. Cancel anytime.
        </p>
      </div>
    </div>
  )
}