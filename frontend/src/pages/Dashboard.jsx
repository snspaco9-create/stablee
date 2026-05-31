import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Settings, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import api from '../api'

export default function Dashboard() {
  const { landlord, logout } = useAuth()
  const [summary, setSummary] = useState(null)
  const [stats, setStats] = useState({ properties: 0, tenants: 0 })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      api.get('/payments/summary'),
      api.get('/properties'),
      api.get('/tenants')
    ]).then(([summaryRes, propsRes, tenantsRes]) => {
      setSummary(summaryRes.data)
      setStats({
        properties: propsRes.data.length,
        tenants: tenantsRes.data.length
      })
    }).finally(() => setLoading(false))

    const params = new URLSearchParams(window.location.search)
    if (params.get('payment') === 'success') {
      const plan = params.get('plan')
      const updated = { ...landlord, plan }
      localStorage.setItem('landlord', JSON.stringify(updated))
      window.history.replaceState({}, '', '/')
    }
  }, [])

  const fmt = (n) => {
    const num = Number(n)
    if (num >= 1000000) return `₦${(num / 1000000).toFixed(1)}m`
    if (num >= 1000) return `₦${(num / 1000).toFixed(0)}k`
    return `₦${num.toLocaleString()}`
  }

  const initials = landlord?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">S</span>
          </div>
          <span className="text-base font-bold text-gray-900">Stablee</span>
        </div>
        <button
          onClick={() => navigate('/settings')}
          className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 text-sm font-semibold hover:bg-blue-100 transition-colors"
        >
          {initials}
        </button>
      </div>

      <div className="px-4 pt-6 pb-2">
        <p className="text-sm text-gray-400">{greeting},</p>
        <h2 className="text-xl font-bold text-gray-900 mt-0.5">
          {landlord?.full_name?.split(' ')[0]}
        </h2>
      </div>

      <div className="px-4 mb-4">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white">
          <p className="text-xs text-blue-200 uppercase tracking-wide mb-1">This month</p>
          <p className="text-3xl font-bold mb-4">{summary ? fmt(summary.expected) : '—'}</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 rounded-xl p-3">
              <div className="flex items-center gap-1 mb-1">
                <TrendingUp size={12} className="text-green-300" />
                <span className="text-xs text-blue-200">Collected</span>
              </div>
              <p className="text-lg font-bold text-white">{summary ? fmt(summary.collected) : '—'}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="flex items-center gap-1 mb-1">
                <TrendingDown size={12} className="text-red-300" />
                <span className="text-xs text-blue-200">Outstanding</span>
              </div>
              <p className="text-lg font-bold text-white">{summary ? fmt(summary.outstanding) : '—'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mb-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <p className="text-2xl font-bold text-gray-900">{stats.properties}</p>
            <p className="text-xs text-gray-400 mt-1">Properties</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <p className="text-2xl font-bold text-gray-900">{stats.tenants}</p>
            <p className="text-xs text-gray-400 mt-1">Tenants</p>
          </div>
        </div>
      </div>

      {summary?.overdue_tenants?.length > 0 && (
        <div className="px-4 mb-4">
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <h3 className="text-sm font-semibold text-red-700">
                {summary.overdue_tenants.length} overdue {summary.overdue_tenants.length === 1 ? 'tenant' : 'tenants'}
              </h3>
            </div>
            {summary.overdue_tenants.map(t => (
              <div key={t.id} className="flex justify-between items-center py-2 border-b border-red-100 last:border-0">
                <span className="text-sm font-medium text-gray-800">{t.full_name}</span>
                <span className="badge-danger">{t.next_due_date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {summary?.upcoming_due?.length > 0 && (
        <div className="px-4 mb-4">
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full" />
              <h3 className="text-sm font-semibold text-amber-700">Due this week</h3>
            </div>
            {summary.upcoming_due.map(t => (
              <div key={t.id} className="flex justify-between items-center py-2 border-b border-amber-100 last:border-0">
                <span className="text-sm font-medium text-gray-800">{t.full_name}</span>
                <span className="badge-warning">{t.next_due_date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {summary?.overdue_tenants?.length === 0 && summary?.upcoming_due?.length === 0 && !loading && (
        <div className="px-4 mb-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-gray-600 text-sm font-medium">All payments up to date</p>
            <p className="text-gray-400 text-xs mt-1">No overdue or upcoming payments</p>
          </div>
        </div>
      )}

      {landlord?.plan === 'free' && (
        <div className="px-4 mb-4">
          <button
            onClick={() => navigate('/pricing')}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-4 text-left shadow-sm"
          >
            <p className="text-xs text-purple-200 uppercase tracking-wide mb-1">Free plan</p>
            <p className="text-base font-semibold">Upgrade to Starter</p>
            <p className="text-xs text-purple-200 mt-1">Unlock SMS reminders and PDF receipts →</p>
          </button>
        </div>
      )}

      <BottomNav />
    </div>
  )
}