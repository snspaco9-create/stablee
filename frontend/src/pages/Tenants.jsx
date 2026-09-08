import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ListSkeleton } from '../components/Skeleton'
import BottomNav from '../components/BottomNav'
import api from '../api'

export default function Tenants() {
  const [tenants, setTenants] = useState([])
  const [units, setUnits] = useState([])
  const [properties, setProperties] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editTenant, setEditTenant] = useState(null)
  const [selectedProperty, setSelectedProperty] = useState('')
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    unit_id: '', full_name: '', phone: '', email: '', lease_start: '', lease_end: '', notes: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  const filteredTenants = tenants.filter(t =>
    t.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    t.phone?.includes(search)
  )

  useEffect(() => {
    fetchTenants()
    api.get('/properties').then(res => setProperties(res.data))
  }, [])

  const fetchTenants = () => {
    setLoading(true)
    api.get('/tenants')
      .then(res => setTenants(res.data))
      .finally(() => setLoading(false))
  }

  const handlePropertyChange = async (property_id) => {
    setSelectedProperty(property_id)
    setForm(f => ({ ...f, unit_id: '' }))
    if (property_id) {
      const res = await api.get(`/units/${property_id}`)
      setUnits(res.data.filter(u => u.status === 'vacant'))
    } else {
      setUnits([])
    }
  }

  const handleEdit = (tenant) => {
    setEditTenant(tenant)
    setForm({
      unit_id: tenant.unit_id,
      full_name: tenant.full_name,
      phone: tenant.phone,
      email: tenant.email || '',
      lease_start: tenant.lease_start || '',
      lease_end: tenant.lease_end || '',
      notes: tenant.notes || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (tenant_id, name) => {
    const toastId = toast.loading(`Deleting ${name}...`)
    try {
      await api.delete(`/tenants/${tenant_id}`)
      toast.success(`${name} removed`, { id: toastId })
      fetchTenants()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete tenant', { id: toastId })
    }
  }

  const sendReminder = async (tenant_id, name) => {
    const toastId = toast.loading(`Sending reminder to ${name}...`)
    try {
      const res = await api.post('/reminders/send', { tenant_id })
      if (res.data.pending) {
        toast('Reminder logged. SMS pending sender ID approval.', { id: toastId, icon: '⏳' })
      } else {
        toast.success(`Reminder sent to ${name}`, { id: toastId })
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send reminder', { id: toastId })
    }
  }

  const sendBulkReminders = async () => {
    const toastId = toast.loading('Sending reminders to all overdue tenants...')
    try {
      const res = await api.post('/reminders/send-bulk', { days_ahead: 0 })
      toast.success(`Sent ${res.data.sent} reminders`, { id: toastId })
    } catch (err) {
      toast.error('Failed to send bulk reminders', { id: toastId })
    }
  }

  const sendPortalLink = async (tenant_id, name) => {
    const toastId = toast.loading(`Sending portal link to ${name}...`)
    try {
      const res = await api.post(`/tenant-portal/generate/${tenant_id}`)
      if (res.data.sms_sent) {
        toast.success(`Portal link sent to ${name}`, { id: toastId })
      } else {
        toast(`Portal link generated. Copy: ${res.data.portal_url}`, { id: toastId, icon: '🔗', duration: 8000 })
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to generate portal link', { id: toastId })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editTenant) {
        await api.put(`/tenants/${editTenant.id}`, {
          full_name: form.full_name,
          phone: form.phone,
          email: form.email,
          lease_end: form.lease_end,
          notes: form.notes
        })
        toast.success('Tenant updated')
      } else {
        await api.post('/tenants', form)
        toast.success('Tenant added')
      }
      setForm({ unit_id: '', full_name: '', phone: '', email: '', lease_start: '', lease_end: '', notes: '' })
      setEditTenant(null)
      setShowForm(false)
      fetchTenants()
    } catch (err) {
      const data = err.response?.data
      if (data?.upgrade) {
        toast.error(data.error)
        setTimeout(() => navigate('/pricing'), 1500)
      } else {
        toast.error(data?.error || 'Failed to save tenant')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">S</span>
          </div>
          <span className="text-base font-bold text-gray-900">Tenants</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={sendBulkReminders}
            className="text-sm bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700"
          >
            Bulk remind
          </button>
          <button
            onClick={() => { setEditTenant(null); setForm({ unit_id: '', full_name: '', phone: '', email: '', lease_start: '', lease_end: '', notes: '' }); setShowForm(!showForm) }}
            className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg hover:bg-blue-700"
          >
            +
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              {editTenant ? 'Edit tenant' : 'New tenant'}
            </h3>
            <div className="space-y-3">
              {!editTenant && (
                <>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Property</label>
                    <select
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedProperty}
                      onChange={e => handlePropertyChange(e.target.value)}
                      required
                    >
                      <option value="">Select property</option>
                      {properties.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Unit</label>
                    <select
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={form.unit_id}
                      onChange={e => setForm({ ...form, unit_id: e.target.value })}
                      required
                    >
                      <option value="">Select vacant unit</option>
                      {units.map(u => (
                        <option key={u.id} value={u.id}>{u.unit_number} — ₦{Number(u.rent_amount).toLocaleString()}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Full name</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.full_name}
                  onChange={e => setForm({ ...form, full_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Phone</label>
                <input
                  type="tel"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Email (optional)</label>
                <input
                  type="email"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
              {!editTenant && (
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Lease start</label>
                  <input
                    type="date"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.lease_start}
                    onChange={e => setForm({ ...form, lease_start: e.target.value })}
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Lease end</label>
                <input
                  type="date"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.lease_end}
                  onChange={e => setForm({ ...form, lease_end: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Notes (optional)</label>
                <textarea
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="e.g. Has a dog, pays on time, prefers WhatsApp"
                  value={form.notes || ''}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editTenant ? 'Update tenant' : 'Save tenant'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditTenant(null) }}
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
        ) : tenants.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm font-medium">No tenants yet</p>
            <p className="text-gray-400 text-xs mt-1">Tap + to get started</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-4">
              {filteredTenants.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">No tenants found matching "{search}"</p>
                </div>
              ) : (
                filteredTenants.map(t => (
                  <div key={t.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{t.full_name}</h3>
                        <p className="text-xs text-gray-400 mt-1">{t.phone}</p>
                        <p className="text-xs text-gray-400">{t.units?.properties?.name} · {t.units?.unit_number}</p>
                        {t.notes && (
                          <p className="text-xs text-gray-500 mt-1 italic">📝 {t.notes}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Next due</p>
                        <p className={`text-sm font-semibold mt-0.5 ${new Date(t.next_due_date) < new Date() ? 'text-red-500' : 'text-gray-900'}`}>
                          {t.next_due_date}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
                      <button onClick={() => sendReminder(t.id, t.full_name)} className="flex-1 text-xs bg-green-50 text-green-600 py-1.5 rounded-lg hover:bg-green-100">Remind</button>
                      <button onClick={() => sendPortalLink(t.id, t.full_name)} className="flex-1 text-xs bg-purple-50 text-purple-600 py-1.5 rounded-lg hover:bg-purple-100">Portal</button>
                      <button onClick={() => handleEdit(t)} className="flex-1 text-xs bg-blue-50 text-blue-600 py-1.5 rounded-lg hover:bg-blue-100">Edit</button>
                      <button onClick={() => handleDelete(t.id, t.full_name)} className="flex-1 text-xs bg-red-50 text-red-500 py-1.5 rounded-lg hover:bg-red-100">Delete</button>
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