import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function Properties() {
  const [properties, setProperties] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editProperty, setEditProperty] = useState(null)
  const [form, setForm] = useState({ name: '', address: '', city: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => { fetchProperties() }, [])

  const fetchProperties = () => {
    api.get('/properties').then(res => setProperties(res.data))
  }

  const handleEdit = (property) => {
    setEditProperty(property)
    setForm({ name: property.name, address: property.address || '', city: property.city || '' })
    setShowForm(true)
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}? All units and tenants will be removed.`)) return
    try {
      await api.delete(`/properties/${id}`)
      fetchProperties()
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete property')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editProperty) {
        await api.put(`/properties/${editProperty.id}`, form)
      } else {
        await api.post('/properties', form)
      }
      setForm({ name: '', address: '', city: '' })
      setEditProperty(null)
      setShowForm(false)
      fetchProperties()
    } catch (err) {
      const data = err.response?.data
      if (data?.upgrade) {
        if (window.confirm(`${data.error}\n\nUpgrade now?`)) {
          navigate('/pricing')
        }
      } else {
        alert(data?.error || 'Failed to save property')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <button onClick={() => navigate('/')} className="text-sm text-blue-600 hover:underline">← Dashboard</button>
        <span className="text-lg font-bold text-blue-600">Properties</span>
        <button
          onClick={() => { setEditProperty(null); setForm({ name: '', address: '', city: '' }); setShowForm(!showForm) }}
          className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700"
        >
          + Add
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
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
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editProperty ? 'Update property' : 'Save property'}
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

        {properties.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            No properties yet. Tap + Add to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {properties.map(p => (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-5">
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