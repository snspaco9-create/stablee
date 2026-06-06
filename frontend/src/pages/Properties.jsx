import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ListSkeleton } from '../components/Skeleton'
import api from '../api'
import BottomNav from '../components/BottomNav'

export default function Properties() {
  const [properties, setProperties] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editProperty, setEditProperty] = useState(null)
  const [form, setForm] = useState({ name: '', address: '', city: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const navigate = useNavigate()

  useEffect(() => { fetchProperties() }, [])

  const fetchProperties = () => {
    setLoading(true)
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
    setDeleting(id)
    try {
      await api.delete(`/properties/${id}`)
      toast.success(`${name} deleted`)
      fetchProperties()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete property')
    } finally {
      setDeleting(null)
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
        toast.error(data?.error || 'Failed to save property')
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
          <span className="text-base font-bold text-gray-900">Properties</span>
        </div>
        <button
          onClick={() => { setEditProperty(null); setForm({ name: '', address: '', city: '' }); setShowForm(!showForm) }}
          className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg hover:bg-blue-700"
        >
          +
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              {editProperty ? 'Edit property' : 'New property'}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Property name</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Address</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">City</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.city}
                  onChange={e => setForm({ ...form, city: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editProperty ? 'Update property' : 'Save property'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditProperty(null) }}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        {loading ? (
          <ListSkeleton count={3} />
        ) : properties.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🏠</p>
            <p className="text-gray-500 text-sm font-medium">No properties yet</p>
            <p className="text-gray-400 text-xs mt-1">Tap + to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {properties.map(p => (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="cursor-pointer" onClick={() => navigate(`/properties/${p.id}/units`)}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{p.name}</h3>
                      <p className="text-xs text-gray-400 mt-1">{p.address}{p.city ? `, ${p.city}` : ''}</p>
                    </div>
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                      {p.units?.[0]?.count || 0} units
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
                  <button
                    onClick={() => navigate(`/properties/${p.id}/units`)}
                    className="flex-1 text-xs bg-blue-50 text-blue-600 py-1.5 rounded-lg hover:bg-blue-100"
                  >
                    View units
                  </button>
                  <button
                    onClick={() => handleEdit(p)}
                    className="flex-1 text-xs bg-gray-50 text-gray-600 py-1.5 rounded-lg hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id, p.name)}
                    disabled={deleting === p.id}
                    className="flex-1 text-xs bg-red-50 text-red-500 py-1.5 rounded-lg hover:bg-red-100 disabled:opacity-50"
                  >
                    {deleting === p.id ? 'Deleting...' : 'Delete'}
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