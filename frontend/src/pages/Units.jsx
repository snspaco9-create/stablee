import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api'

export default function Units() {
  const { property_id } = useParams()
  const [units, setUnits] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editUnit, setEditUnit] = useState(null)
  const [form, setForm] = useState({ unit_number: '', rent_amount: '', payment_cycle: 'monthly' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => { fetchUnits() }, [property_id])

  const fetchUnits = () => {
    api.get(`/units/${property_id}`).then(res => setUnits(res.data))
  }

  const handleEdit = (unit) => {
    setEditUnit(unit)
    setForm({ unit_number: unit.unit_number, rent_amount: unit.rent_amount, payment_cycle: unit.payment_cycle })
    setShowForm(true)
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return
    try {
      await api.delete(`/units/${id}`)
      fetchUnits()
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete unit')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editUnit) {
        await api.put(`/units/${editUnit.id}`, { ...form, rent_amount: Number(form.rent_amount) })
      } else {
        await api.post('/units', { ...form, property_id, rent_amount: Number(form.rent_amount) })
      }
      setForm({ unit_number: '', rent_amount: '', payment_cycle: 'monthly' })
      setEditUnit(null)
      setShowForm(false)
      fetchUnits()
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save unit')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <button onClick={() => navigate('/properties')} className="text-sm text-blue-600 hover:underline">← Properties</button>
        <span className="text-lg font-bold text-blue-600">Units</span>
        <button
          onClick={() => { setEditUnit(null); setForm({ unit_number: '', rent_amount: '', payment_cycle: 'monthly' }); setShowForm(!showForm) }}
          className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700"
        >
          + Add
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              {editUnit ? 'Edit unit' : 'New unit'}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Unit number</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.unit_number}
                  onChange={e => setForm({ ...form, unit_number: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Rent amount (₦)</label>
                <input
                  type="number"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.rent_amount}
                  onChange={e => setForm({ ...form, rent_amount: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Payment cycle</label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.payment_cycle}
                  onChange={e => setForm({ ...form, payment_cycle: e.target.value })}
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editUnit ? 'Update unit' : 'Save unit'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditUnit(null) }}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        {units.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">No units yet. Tap + Add.</div>
        ) : (
          <div className="space-y-4">
            {units.map(u => (
              <div key={u.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{u.unit_number}</h3>
                    <p className="text-xs text-gray-400 mt-1">₦{Number(u.rent_amount).toLocaleString()} / {u.payment_cycle}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-lg font-medium ${u.status === 'occupied' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                    {u.status}
                  </span>
                </div>
                {u.tenants?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-50">
                    <p className="text-xs text-gray-500">{u.tenants[0].full_name} · {u.tenants[0].phone}</p>
                    <p className="text-xs text-gray-400">Due: {u.tenants[0].next_due_date}</p>
                  </div>
                )}
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
                  <button
                    onClick={() => handleEdit(u)}
                    className="flex-1 text-xs bg-blue-50 text-blue-600 py-1.5 rounded-lg hover:bg-blue-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(u.id, u.unit_number)}
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