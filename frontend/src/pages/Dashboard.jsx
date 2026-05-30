import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

export default function Dashboard() {
  const { landlord, logout } = useAuth()
  const [summary, setSummary] = useState(null)
  const [stats, setStats] = useState({ properties: 0, tenants: 0 })
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/payments/summary').then(res => setSummary(res.data))
    api.get('/properties').then(res => setStats(prev => ({ ...prev, properties: res.data.length })))
    api.get('/tenants').then(res => setStats(prev => ({ ...prev, tenants: res.data.length })))

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex justify-between items-center sticky top-0 z-10">
        <span className="text-lg font-bold text-blue-600 tracking-tight">Stablee</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/settings')}
            className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold flex items-center justify-center">
              {initials}
            </div>
            <span className="text-sm text-gray-600 hidden sm:block">{landlord?.full_name}</span>
          </button>
          <button onClick={logout} className="text-xs text-gray-400 hover:text-red-500 transition-colors">Logout</button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <p className="text-sm text-gray-400 mb-1">Good day,</p>
        <h2 className="text-xl font-bold text-gray-900 mb-6">{landlord?.full_name}</h2>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Expected</p>
            <p className="text-lg font-bold text-gray-900">{summary ? fmt(summary.expected) : '—'}</p>
            <p className="text-xs text-gray-400 mt-1">this month</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Collected</p>
            <p className="text-lg font-bold text-green-600">{summary ? fmt(summary.collected) : '—'}</p>
            <p className="text-xs text-gray-400 mt-1">this month</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Outstanding</p>
            <p className="text-lg font-bold text-red-500">{summary ? fmt(summary.outstanding) : '—'}</p>
            <p className="text-xs text-gray-400 mt-1">this month</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
            <span className="text-2xl">🏠</span>
            <div>
              <p className="text-lg font-bold text-gray-900">{stats.properties}</p>
              <p className="text-xs text-gray-400">Properties</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
            <span className="text-2xl">👥</span>
            <div>
              <p className="text-lg font-bold text-gray-900">{stats.tenants}</p>
              <p className="text-xs text-gray-400">Tenants</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button onClick={() => navigate('/properties')} className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-4 text-left transition-colors">
            <p className="text-xs text-blue-200 uppercase tracking-wide mb-1">Properties</p>
            <p className="text-base font-semibold">Manage</p>
            <p className="text-xs text-blue-200 mt-1">Add or view properties</p>
          </button>
          <button onClick={() => navigate('/tenants')} className="bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl p-4 text-left transition-colors">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Tenants</p>
            <p className="text-base font-semibold text-gray-900">Manage</p>
            <p className="text-xs text-gray-400 mt-1">Add or view tenants</p>
          </button>
          <button onClick={() => navigate('/payments')} className="bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl p-4 text-left transition-colors">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Payments</p>
            <p className="text-base font-semibold text-gray-900">Record</p>
            <p className="text-xs text-gray-400 mt-1">Mark a rent as paid</p>
          </button>
          <button onClick={() => navigate('/reminders')} className="bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl p-4 text-left transition-colors">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Reminders</p>
            <p className="text-base font-semibold text-gray-900">History</p>
            <p className="text-xs text-gray-400 mt-1">View sent reminders</p>
          </button>
          <button onClick={() => navigate('/pricing')} className="col-span-2 bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl p-4 text-left transition-colors">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Plans</p>
            <p className="text-base font-semibold text-gray-900">
              {landlord?.plan === 'free' ? 'Upgrade' : `${landlord?.plan?.charAt(0).toUpperCase()}${landlord?.plan?.slice(1)} Plan`}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {landlord?.plan === 'free' ? 'You are on the free plan' : 'Manage your subscription'}
            </p>
          </button>
        </div>

        {summary?.overdue_tenants?.length > 0 && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-4">
            <h3 className="text-sm font-semibold text-red-700 mb-3">Overdue tenants</h3>
            {summary.overdue_tenants.map(t => (
              <div key={t.id} className="flex justify-between items-center py-2 border-b border-red-100 last:border-0">
                <span className="text-sm text-gray-800">{t.full_name}</span>
                <span className="text-xs text-red-500 font-medium">{t.next_due_date}</span>
              </div>
            ))}
          </div>
        )}

        {summary?.upcoming_due?.length > 0 && (
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-amber-700 mb-3">Due this week</h3>
            {summary.upcoming_due.map(t => (
              <div key={t.id} className="flex justify-between items-center py-2 border-b border-amber-100 last:border-0">
                <span className="text-sm text-gray-800">{t.full_name}</span>
                <span className="text-xs text-amber-600 font-medium">{t.next_due_date}</span>
              </div>
            ))}
          </div>
        )}

        {summary?.overdue_tenants?.length === 0 && summary?.upcoming_due?.length === 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
            <p className="text-gray-400 text-sm">No overdue or upcoming payments</p>
            <p className="text-gray-300 text-xs mt-1">Add properties and tenants to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}