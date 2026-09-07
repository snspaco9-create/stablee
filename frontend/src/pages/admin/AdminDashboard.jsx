import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null)
  const [landlords, setLandlords] = useState([])
  const [filteredLandlords, setFilteredLandlords] = useState([])
  const [reminders, setReminders] = useState([])
  const [filteredReminders, setFilteredReminders] = useState([])
  const [tab, setTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [reminderFilter, setReminderFilter] = useState('all')
  const [planFilter, setPlanFilter] = useState('all')
  const navigate = useNavigate()

  useEffect(() => { fetchAll() }, [])

  useEffect(() => {
    let filtered = landlords
    if (search) {
      filtered = filtered.filter(l =>
        l.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        l.email?.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (planFilter !== 'all') {
      filtered = filtered.filter(l => l.plan === planFilter)
    }
    setFilteredLandlords(filtered)
  }, [search, planFilter, landlords])

  useEffect(() => {
    let filtered = reminders
    if (reminderFilter !== 'all') {
      filtered = filtered.filter(r => r.status === reminderFilter)
    }
    setFilteredReminders(filtered)
  }, [reminderFilter, reminders])

  const fetchAll = async () => {
    try {
      const [overviewRes, landlordsRes, remindersRes] = await Promise.all([
        api.get('/admin/overview'),
        api.get('/admin/landlords'),
        api.get('/admin/reminders')
      ])
      setOverview(overviewRes.data)
      setLandlords(landlordsRes.data)
      setFilteredLandlords(landlordsRes.data)
      setReminders(remindersRes.data)
      setFilteredReminders(remindersRes.data)
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
      toast.success('Plan updated')
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

  const conversionRate = overview?.total_landlords > 0
    ? (((overview?.starter_plan + overview?.pro_plan) / overview?.total_landlords) * 100).toFixed(1)
    : 0

  const smsSuccessRate = (overview?.reminders_sent + overview?.reminders_failed) > 0
    ? ((overview?.reminders_sent / (overview?.reminders_sent + overview?.reminders_failed)) * 100).toFixed(1)
    : 0

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <div>
            <span className="font-bold text-white">Stablee Admin</span>
            <span className="ml-2 text-xs bg-green-900/50 text-green-400 px-2 py-0.5 rounded-full">Live</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400">MRR: <span className="text-green-400 font-semibold">{fmt(overview?.mrr || 0)}</span></span>
          <button onClick={logout} className="text-xs text-gray-400 hover:text-red-400 transition-colors">Logout</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-3 mb-6 border-b border-gray-700 pb-4">
          {['overview', 'landlords', 'reminders'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                tab === t
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t}
              {t === 'landlords' && <span className="ml-2 text-xs bg-gray-700 px-1.5 py-0.5 rounded-full">{landlords.length}</span>}
              {t === 'reminders' && <span className="ml-2 text-xs bg-gray-700 px-1.5 py-0.5 rounded-full">{reminders.length}</span>}
            </button>
          ))}
        </div>

        {tab === 'overview' && overview && (
          <div className="space-y-6">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Revenue</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
                  <p className="text-xs text-gray-400 mb-2">Monthly MRR</p>
                  <p className="text-2xl font-bold text-green-400">{fmt(overview.mrr)}</p>
                  <p className="text-xs text-gray-500 mt-1">From paid plans</p>
                </div>
                <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
                  <p className="text-xs text-gray-400 mb-2">Annual Run Rate</p>
                  <p className="text-2xl font-bold text-green-300">{fmt(overview.mrr * 12)}</p>
                  <p className="text-xs text-gray-500 mt-1">MRR × 12</p>
                </div>
                <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
                  <p className="text-xs text-gray-400 mb-2">Conversion Rate</p>
                  <p className="text-2xl font-bold text-blue-400">{conversionRate}%</p>
                  <p className="text-xs text-gray-500 mt-1">Free → Paid</p>
                </div>
                <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
                  <p className="text-xs text-gray-400 mb-2">Avg Revenue/User</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {fmt(overview.starter_plan + overview.pro_plan > 0
                      ? overview.mrr / (overview.starter_plan + overview.pro_plan)
                      : 0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Per paying landlord</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Users</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
                  <p className="text-xs text-gray-400 mb-2">Total Landlords</p>
                  <p className="text-2xl font-bold text-white">{overview.total_landlords}</p>
                </div>
                <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
                  <p className="text-xs text-gray-400 mb-2">Free Plan</p>
                  <p className="text-2xl font-bold text-gray-300">{overview.free_plan}</p>
                  <div className="mt-2 bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-gray-400 h-1.5 rounded-full"
                      style={{ width: `${overview.total_landlords > 0 ? (overview.free_plan / overview.total_landlords) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
                  <p className="text-xs text-gray-400 mb-2">Starter Plan</p>
                  <p className="text-2xl font-bold text-blue-400">{overview.starter_plan}</p>
                  <div className="mt-2 bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full"
                      style={{ width: `${overview.total_landlords > 0 ? (overview.starter_plan / overview.total_landlords) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
                  <p className="text-xs text-gray-400 mb-2">Pro Plan</p>
                  <p className="text-2xl font-bold text-purple-400">{overview.pro_plan}</p>
                  <div className="mt-2 bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-purple-500 h-1.5 rounded-full"
                      style={{ width: `${overview.total_landlords > 0 ? (overview.pro_plan / overview.total_landlords) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Platform Data</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
                  <p className="text-xs text-gray-400 mb-2">Total Properties</p>
                  <p className="text-2xl font-bold text-white">{overview.total_properties}</p>
                </div>
                <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
                  <p className="text-xs text-gray-400 mb-2">Total Tenants</p>
                  <p className="text-2xl font-bold text-white">{overview.total_tenants}</p>
                </div>
                <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
                  <p className="text-xs text-gray-400 mb-2">SMS Sent</p>
                  <p className="text-2xl font-bold text-green-400">{overview.reminders_sent}</p>
                </div>
                <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
                  <p className="text-xs text-gray-400 mb-2">SMS Success Rate</p>
                  <p className="text-2xl font-bold text-blue-400">{smsSuccessRate}%</p>
                  <p className="text-xs text-gray-500 mt-1">{overview.reminders_failed} failed</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-4">System Status</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'API', status: 'operational' },
                  { label: 'Database', status: 'operational' },
                  { label: 'SMS (Termii)', status: overview.reminders_failed > overview.reminders_sent ? 'degraded' : 'operational' },
                  { label: 'Payments', status: 'operational' }
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${s.status === 'operational' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                    <span className="text-sm text-gray-300">{s.label}</span>
                    <span className={`text-xs ml-auto ${s.status === 'operational' ? 'text-green-400' : 'text-yellow-400'}`}>
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'landlords' && (
          <div className="space-y-4">
            <div className="flex gap-3 flex-wrap">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 min-w-48 bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={planFilter}
                onChange={e => setPlanFilter(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none"
              >
                <option value="all">All plans</option>
                <option value="free">Free</option>
                <option value="starter">Starter</option>
                <option value="pro">Pro</option>
              </select>
            </div>

            <p className="text-xs text-gray-400">{filteredLandlords.length} landlords shown</p>

            {filteredLandlords.map(l => (
              <div key={l.id} className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-white">{l.full_name}</p>
                      {l.is_admin && (
                        <span className="text-xs bg-yellow-900/50 text-yellow-400 px-2 py-0.5 rounded-full">Admin</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{l.email}</p>
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
                        <option value="free">→ Free</option>
                        <option value="starter">→ Starter</option>
                        <option value="pro">→ Pro</option>
                      </select>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'reminders' && (
          <div className="space-y-4">
            <div className="flex gap-3">
              <select
                value={reminderFilter}
                onChange={e => setReminderFilter(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none"
              >
                <option value="all">All reminders</option>
                <option value="sent">Sent only</option>
                <option value="failed">Failed only</option>
              </select>
            </div>

            <div className="flex gap-4 mb-2">
              <span className="text-xs text-green-400">{reminders.filter(r => r.status === 'sent').length} sent</span>
              <span className="text-xs text-red-400">{reminders.filter(r => r.status === 'failed').length} failed</span>
              <span className="text-xs text-gray-400">{reminders.length} total</span>
            </div>

            {filteredReminders.map(r => (
              <div key={r.id} className="bg-gray-800 rounded-2xl p-4 border border-gray-700 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-white">{r.tenants?.full_name || 'Unknown tenant'}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{r.tenants?.phone} · {r.channel?.toUpperCase()}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{new Date(r.sent_at).toLocaleString('en-NG')}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-lg font-medium ${
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