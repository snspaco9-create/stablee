import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import PageHeader from '../components/PageHeader'
import BottomNav from '../components/BottomNav'
import SkeletonCard from '../components/SkeletonCard'
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
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      api.get('/tenants'),
      api.get('/properties')
    ]).then(([tenantsRes, propsRes]) => {
      setTenants(tenantsRes.data)
      setProperties(propsRes.data)
    }).finally(() => setLoading(false))
  }, [])

  const fetchTenants = () => api.get('/tenants').then(res => setTenants(res.data))

  const handlePropertyChange = async (property_id) => {
    setSelectedProperty(property_id)
    setForm(f => ({ ...f, unit_id: '' }))
    if (property_id) {
      const res = await api.get(`/units/${property_id}`)
      setUnits(res.data.filter(u => u.status === 'vacant'))
    } else setUnits([])
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

  const handleDelete = async (id, name) => {
    const toastId = toast.loading(`Removing ${name}...`)
    try {
      await api.delete(`/tenants/${id}`)
      toast.success(`${name} removed`, { id: toastId })
      fetchTenants()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete', { id: toastId })
    }
  }

  const sendReminder = async (tenant_id, name) => {
    const toastId = toast.loading(`Sending reminder...`)
    try {
      const res = await api.post('/reminders/send', { tenant_id })
      if (res.data.pending) {
        toast('Reminder logged. SMS pending approval.', { id: toastId, icon: '⏳' })
      } else {
        toast.success(`Reminder sent to ${name}`, { id: toastId })
      }
    } catch (err) {
      toast.error('Failed to send reminder', { id: toastId })
    }
  }

  const sendPortalLink = async (tenant_id, name) => {
    const toastId = toast.loading(`Generating portal link...`)
    try {
      const res = await api.post(`/tenant-portal/generate/${tenant_id}`)
      if (res.data.sms_sent) {
        toast.success(`Portal link sent to ${name}`, { id: toastId })
      } else {
        toast(`Portal ready. Copy: ${res.data.portal_url}`, { id: toastId, icon: '🔗', duration: 8000 })
      }
    } catch (err) {
      toast.error('Failed to generate portal link', { id: toastId })
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

  const isOverdue = (date) => new Date(date) < new Date()

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <PageHeader
        title="Tenants"
        action={
          <button
            onClick={() => { setEditTenant(null); setForm({ unit_id: '', full_name: '', phone: '', email: '', lease_start: '', lease_end: '' }); setShowForm(true) }}
            className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
          </button>
        }
      />

      <div className="px-4 py-4">
        {showForm && (
          <div className="card p-5 mb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              {editTenant ? 'Edit tenant' : 'New tenant'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              {!editTenant && (
                <>
                  <div>
                    <label className="label">Property</label>
                    <select className="input" value={selectedProperty} onChange={e => handlePropertyChange(e.target.value)} required>
                      <option value="">Select property</option>
                      {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Unit</label>
                    <select className="input" value={form.unit_id} onChange={e => setForm({ ...form, unit_id: e.target.value })} required>
                      <option value="">Select vacant unit</option>
                      {units.map(u => <option key={u.id} value={u.id}>{u.unit_number} — ₦{Number(u.rent_amount).toLocaleString()}</option>)}
                    </select>
                  </div>
                </>
              )}
              <div>
                <label className="label">Full name</label>
                <input className="input" placeholder="Tenant's full name" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} required />
              </div>
              <div>
                <label className="label">Phone</label>
                <input className="input" type="tel" placeholder="080XXXXXXXX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
              </div>
              <div>
                <label className="label">Email (optional)</label>
                <input className="input" type="email" placeholder="tenant@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              {!editTenant && (
                <div>
                  <label className="label">Lease start</label>
                  <input className="input" type="date" value={form.lease_start} onChange={e => setForm({ ...form, lease_start: e.target.value })} required />
                </div>
              )}
              <div>
                <label className="label">Lease end</label>
                <input className="input" type="date" value={form.lease_end} onChange={e => setForm({ ...form, lease_end: e.target.value })} />
              </div>
              <div className="flex gap-2 pt-1">
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? 'Saving...' : editTenant ? 'Update tenant' : 'Add tenant'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditTenant(null) }} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <SkeletonCard key={i} lines={3} />)}
          </div>
        ) : tenants.length === 0 ? (
          <div className="text-center py-20">
            <Users size={48} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No tenants yet</p>
            <p className="text-gray-400 text-sm mt-1">Tap + to add your first tenant</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tenants.map(t => (
              <div key={t.id} className="card p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                      {t.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{t.full_name}</p>
                      <p className="text-xs text-gray-400">{t.units?.properties?.name} · {t.units?.unit_number}</p>
                      <p className="text-xs text-gray-400">{t.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 mb-1">Next due</p>
                    <span className={isOverdue(t.next_due_date) ? 'badge-danger' : 'badge-info'}>
                      {t.next_due_date}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  <button onClick={() => sendReminder(t.id, t.full_name)} className="text-xs bg-green-50 text-green-700 py-2 rounded-xl hover:bg-green-100 font-medium transition-colors">
                    Remind
                  </button>
                  <button onClick={() => sendPortalLink(t.id, t.full_name)} className="text-xs bg-purple-50 text-purple-700 py-2 rounded-xl hover:bg-purple-100 font-medium transition-colors">
                    Portal
                  </button>
                  <button onClick={() => handleEdit(t)} className="text-xs bg-blue-50 text-blue-600 py-2 rounded-xl hover:bg-blue-100 font-medium transition-colors">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(t.id, t.full_name)} className="text-xs bg-red-50 text-red-500 py-2 rounded-xl hover:bg-red-100 font-medium transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}