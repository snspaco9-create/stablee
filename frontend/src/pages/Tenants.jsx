import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api'

export default function Tenants() {
  const [tenants, setTenants] = useState([])
  const [units, setUnits] = useState([])
  const [properties, setProperties] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editTenant, setEditTenant] = useState(null)
  const [selectedProperty, setSelectedProperty] = useState('')
  const [form, setForm] = useState({
    unit_id: '', full_name: '', phone: '', email: '', lease_start: '', lease_end: ''
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchTenants()
    api.get('/properties').then(res => setProperties(res.data))
  }, [])

  const fetchTenants = () => {
    api.get('/tenants').then(res => setTenants(res.data))
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
      lease_end: tenant.lease_end || ''
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
        toast('Reminder logged. SMS pending sender ID approval.', {
          id: toastId,
          icon: '⏳'
        })
      } else {
        toast.success(`Reminder sent to ${name}`, { id: toastId })
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send reminder', { id: toastId })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editTenant) {
        await api.put(`/tenants/${editTenant.id}`, {
          full_name: form.full_name,
          phone: form.phone,
          email: form.email,
          lease_end: form.lease_end
        })
        toast.success('Tenant updated')
      } else {
        await api.post('/tenants', form)
        toast.success('Tenant added')
      }
      setForm({ unit_id: '', full_name: '', phone: '', email: '', lease_start: '', lease_end: '' })
      setEditTenant(null)
      setShowForm(false)
      fetchTenants()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save tenant')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <button onClick={() => navigate('/')} className="text-sm text-blue-600 hover:underline">← Dashboard</button>
        <span className="text-lg font-bold text-blue-600">Tenants</span>
        <button
          onClick={() => { setEditTenant(null); setForm({ unit_id: '', full_name: '', phone: '', email: '', lease_start: '', lease_end: '' }); setShowForm(!showForm) }}
          className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700"
        >
          + Add
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
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
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editTenant ? 'Update tenant' : 'Save tenant'}
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

        {tenants.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">👥</p>
            <p className="text-gray-500 text-sm font-medium">No tenants yet</p>
            <p className="text-gray-400 text-xs mt-1">Tap + Add to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tenants.map(t => (
              <div key={t.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{t.full_name}</h3>
                    <p className="text-xs text-gray-400 mt-1">{t.phone}</p>
                    <p className="text-xs text-gray-400">
                      {t.units?.properties?.name} · {t.units?.unit_number}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Next due</p>
                    <p className={`text-sm font-semibold mt-0.5 ${new Date(t.next_due_date) < new Date() ? 'text-red-500' : 'text-gray-900'}`}>
                      {t.next_due_date}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
                  <button
                    onClick={() => sendReminder(t.id, t.full_name)}
                    className="flex-1 text-xs bg-green-50 text-green-600 py-1.5 rounded-lg hover:bg-green-100"
                  >
                    Remind
                  </button>
                  <button
                    onClick={() => handleEdit(t)}
                    className="flex-1 text-xs bg-blue-50 text-blue-600 py-1.5 rounded-lg hover:bg-blue-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(t.id, t.full_name)}
                    className="flex-1 text-xs bg-red-50 text-red-500 py-1.5 rounded-lg hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}