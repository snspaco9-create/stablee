import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, ChevronRight, Building2 } from 'lucide-react'
import toast from 'react-hot-toast'
import PageHeader from '../components/PageHeader'
import BottomNav from '../components/BottomNav'
import SkeletonCard from '../components/SkeletonCard'
import api from '../api'

export default function Properties() {
  const [properties, setProperties] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editProperty, setEditProperty] = useState(null)
  const [form, setForm] = useState({ name: '', address: '', city: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => { fetchProperties() }, [])

  const fetchProperties = () => {
    api.get('/properties')
      .then(res => setProperties(res.data))
      .finally(() => setLoading(false))
  }

  const handleEdit = (property) => {
    setEditProperty(property)
    setForm({ name: property.name, address: property.address || '', city: property.city || '' })
    setShowForm(true)
  }

  const handleDelete = async (id, name) => {
    const toastId = toast.loading(`Deleting ${name}...`)
    try {
      await api.delete(`/properties/${id}`)
      toast.success(`${name} deleted`, { id: toastId })
      fetchProperties()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete', { id: toastId })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editProperty) {
        await api.put(`/properties/${editProperty.id}`, form)
        toast.success('Property updated')
      } else {
        await api.post('/properties', form)
        toast.success('Property added')
      }
      setForm({ name: '', address: '', city: '' })
      setEditProperty(null)
      setShowForm(false)
      fetchProperties()
    } catch (err) {
      const data = err.response?.data
      if (data?.upgrade) {
        toast.error(data.error)
        setTimeout(() => navigate('/pricing'), 1500)
      } else {
        toast.error(data?.error || 'Failed to save')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <PageHeader
        title="Properties"
        action={
          <button
            onClick={() => { setEditProperty(null); setForm({ name: '', address: '', city: '' }); setShowForm(true) }}
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
              {editProperty ? 'Edit property' : 'New property'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="label">Property name</label>
                <input
                  className="input"
                  placeholder="e.g. Marina Court"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">Address</label>
                <input
                  className="input"
                  placeholder="Street address"
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                />
              </div>
              <div>
                <label className="label">City</label>
                <input
                  className="input"
                  placeholder="e.g. Lagos"
                  value={form.city}
                  onChange={e => setForm({ ...form, city: e.target.value })}
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? 'Saving...' : editProperty ? 'Update' : 'Add property'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditProperty(null) }}
                  className="btn-secondary"
                >
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
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <Building2 size={48} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No properties yet</p>
            <p className="text-gray-400 text-sm mt-1">Tap + to add your first property</p>
          </div>
        ) : (
          <div className="space-y-3">
            {properties.map(p => (
              <div key={p.id} className="card p-4">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => navigate(`/properties/${p.id}/units`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                      <Building2 size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{p.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {p.address}{p.city ? `, ${p.city}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="badge-info">{p.units?.[0]?.count || 0} units</span>
                    <ChevronRight size={16} className="text-gray-300" />
                  </div>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
                  <button
                    onClick={() => navigate(`/properties/${p.id}/units`)}
                    className="flex-1 text-xs bg-blue-50 text-blue-600 py-2 rounded-xl hover:bg-blue-100 font-medium transition-colors"
                  >
                    View units
                  </button>
                  <button
                    onClick={() => handleEdit(p)}
                    className="flex-1 text-xs bg-gray-50 text-gray-600 py-2 rounded-xl hover:bg-gray-100 font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id, p.name)}
                    className="flex-1 text-xs bg-red-50 text-red-500 py-2 rounded-xl hover:bg-red-100 font-medium transition-colors"
                  >
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