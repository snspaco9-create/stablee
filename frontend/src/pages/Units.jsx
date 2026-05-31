import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus, Home } from 'lucide-react'
import toast from 'react-hot-toast'
import PageHeader from '../components/PageHeader'
import BottomNav from '../components/BottomNav'
import SkeletonCard from '../components/SkeletonCard'
import api from '../api'

export default function Units() {
  const { property_id } = useParams()
  const [units, setUnits] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editUnit, setEditUnit] = useState(null)
  const [form, setForm] = useState({ unit_number: '', rent_amount: '', payment_cycle: 'monthly' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => { fetchUnits() }, [property_id])

  const fetchUnits = () => {
    api.get(`/units/${property_id}`)
      .then(res => setUnits(res.data))
      .finally(() => setLoading(false))
  }

  const handleEdit = (unit) => {
    setEditUnit(unit)
    setForm({ unit_number: unit.unit_number, rent_amount: unit.rent_amount, payment_cycle: unit.payment_cycle })
    setShowForm(true)
  }

  const handleDelete = async (id, name) => {
    const toastId = toast.loading(`Deleting ${name}...`)
    try {
      await api.delete(`/units/${id}`)
      toast.success(`${name} deleted`, { id: toastId })
      fetchUnits()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete', { id: toastId })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editUnit) {
        await api.put(`/units/${editUnit.id}`, { ...form, rent_amount: Number(form.rent_amount) })
        toast.success('Unit updated')
      } else {
        await api.post('/units', { ...form, property_id, rent_amount: Number(form.rent_amount) })
        toast.success('Unit added')
      }
      setForm({ unit_number: '', rent_amount: '', payment_cycle: 'monthly' })
      setEditUnit(null)
      setShowForm(false)
      fetchUnits()
    } catch (err) {
      const data = err.response?.data
      if (data?.upgrade) {
        toast.error(data.error)
        setTimeout(() => navigate('/pricing'), 1500)
      } else {
        toast.error(data?.error || 'Failed to save unit')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <PageHeader
        title="Units"
        backTo="/properties"
        action={
          <button
            onClick={() => { setEditUnit(null); setForm({ unit_number: '', rent_amount: '', payment_cycle: 'monthly' }); setShowForm(true) }}
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
              {editUnit ? 'Edit unit' : 'New unit'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="label">Unit number</label>
                <input className="input" placeholder="e.g. Unit 1A" value={form.unit_number} onChange={e => setForm({ ...form, unit_number: e.target.value })} required />
              </div>
              <div>
                <label className="label">Rent amount (₦)</label>
                <input className="input" type="number" placeholder="150000" value={form.rent_amount} onChange={e => setForm({ ...form, rent_amount: e.target.value })} required />
              </div>
              <div>
                <label className="label">Payment cycle</label>
                <select className="input" value={form.payment_cycle} onChange={e => setForm({ ...form, payment_cycle: e.target.value })}>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div className="flex gap-2 pt-1">
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? 'Saving...' : editUnit ? 'Update unit' : 'Add unit'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditUnit(null) }} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <SkeletonCard key={i} lines={2} />)}
          </div>
        ) : units.length === 0 ? (
          <div className="text-center py-20">
            <Home size={48} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No units yet</p>
            <p className="text-gray-400 text-sm mt-1">Tap + to add units to this property</p>
          </div>
        ) : (
          <div className="space-y-3">
            {units.map(u => (
              <div key={u.id} className="card p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{u.unit_number}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      ₦{Number(u.rent_amount).toLocaleString()} / {u.payment_cycle}
                    </p>
                  </div>
                  <span className={u.status === 'occupied' ? 'badge-success' : 'badge-warning'}>
                    {u.status}
                  </span>
                </div>
                {u.tenants?.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-3 mb-3">
                    <p className="text-xs font-medium text-gray-700">{u.tenants[0].full_name}</p>
                    <p className="text-xs text-gray-400">{u.tenants[0].phone} · Due: {u.tenants[0].next_due_date}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(u)} className="flex-1 text-xs bg-blue-50 text-blue-600 py-2 rounded-xl hover:bg-blue-100 font-medium transition-colors">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(u.id, u.unit_number)} className="flex-1 text-xs bg-red-50 text-red-500 py-2 rounded-xl hover:bg-red-100 font-medium transition-colors">
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