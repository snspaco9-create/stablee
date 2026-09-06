import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null)
  const [landlords, setLandlords] = useState([])
  const [reminders, setReminders] = useState([])
  const [tab, setTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      const [overviewRes, landlordsRes, remindersRes] = await Promise.all([
        api.get('/admin/overview'),
        api.get('/admin/landlords'),
        api.get('/admin/reminders')
      ])
      setOverview(overviewRes.data)
      setLandlords(landlordsRes.data)
      setReminders(remindersRes.data)
    } catch (err) {
      toast.error('Access denied or session expired')
      navigate('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  const updatePlan = async (id, plan) => {
    try {
      await api.put(`/admin/landlords/${id}/plan`, { plan })
      toast.success('Plan updated successfully')
      fetchAll()
    } catch (err) {
      toast.error('Failed to update plan')
    }
  }

  const fmt = (n) => `₦${Number(n).toLocaleString()}`

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('landlord')
    navigate('/admin/login')
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <p className="text-gray-400 text-sm">Loading admin panel...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-bold text-white">Stablee Admin</span>
        </div>
        <button
          onClick={logout}
          className="text-xs text-gray-400 hover:text-red-400 transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-3 mb-6">
          {['overview', 'landlords', 'reminders'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                tab === t
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'overview' && overview && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Landlords', value: overview.total_landlords, color: 'text-white' },
                { label: 'MRR', value: fmt(overview.mrr), color: 'text-green-400' },
                { label: 'Total Properties', value: overview.total_properties, color: 'text-blue-400' },
                { label: 'Total Tenants', value: overview.total_tenants, color: 'text-purple-400' }
              ].map(stat => (
                <div key={stat.label} className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Free Plan', value: overview.free_plan, color: 'text-gray-300' },
                { label: 'Starter Plan', value: overview.starter_plan, color: 'text-blue-400' },
                { label: 'Pro Plan', value: overview.pro_plan, color: 'text-purple-400' }
              ].map(plan => (
                <div key={plan.label} className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">{plan.label}</p>
                  <p className={`text-2xl font-bold ${plan.color}`}>{plan.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">SMS Sent</p>
                <p className="text-2xl font-bold text-green-400">{overview.reminders_sent}</p>
              </div>
              <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">SMS Failed</p>
                <p className="text-2xl font-bold text-red-400">{overview.reminders_failed}</p>
              </div>
            </div>
          </div>
        )}

        {tab === 'landlords' && (
          <div className="space-y-3">
            <p className="text-xs text-gray-400 mb-2">{landlords.length} total landlords</p>
            {landlords.map(l => (
              <div key={l.id} className="bg-gray-800 rounded-2xl p-5 border border-gray-700 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white">{l.full_name}</p>
                    {l.is_admin && (
                      <span className="text-xs bg-yellow-900/50 text-yellow-400 px-2 py-0.5 rounded-full">Admin</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{l.email}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{l.phone} · Joined {new Date(l.created_at).toLocaleDateString('en-NG')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-lg font-medium ${
                    l.plan === 'pro' ? 'bg-purple-900/50 text-purple-400' :
                    l.plan === 'starter' ? 'bg-blue-900/50 text-blue-400' :
                    'bg-gray-700 text-gray-400'
                  }`}>
                    {l.plan}
                  </span>
                  {!l.is_admin && (
                    <select
                      value={l.plan}
                      onChange={e => updatePlan(l.id, e.target.value)}
                      className="bg-gray-700 border border-gray-600 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="free">Free</option>
                      <option value="starter">Starter</option>
                      <option value="pro">Pro</option>
                    </select>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'reminders' && (
          <div className="space-y-3">
            <p className="text-xs text-gray-400 mb-2">{reminders.length} total reminders</p>
            {reminders.map(r => (
              <div key={r.id} className="bg-gray-800 rounded-2xl p-4 border border-gray-700 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-white">{r.tenants?.full_name || 'Unknown'}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{r.tenants?.phone} · {r.channel?.toUpperCase()}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{new Date(r.sent_at).toLocaleString('en-NG')}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-lg font-medium ${
                  r.status === 'sent'
                    ? 'bg-green-900/50 text-green-400'
                    : 'bg-red-900/50 text-red-400'
                }`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}