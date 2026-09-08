import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api'

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/login', form)

      if (!res.data.token) {
        setError('Login failed')
        return
      }

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('landlord', JSON.stringify(res.data.landlord))

      const profileRes = await api.get('/landlords/profile')

      if (!profileRes.data.is_admin) {
        setError('Access denied. Admin accounts only.')
        localStorage.removeItem('token')
        localStorage.removeItem('landlord')
        return
      }

      navigate('/admin/dashboard')
    } catch (err) {
      console.error('Admin login error:', err.response?.data || err.message)
      setError('Invalid credentials or access denied')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-sm border border-gray-700">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold">S</span>
          </div>
          <div>
            <p className="text-white font-bold">Stablee</p>
            <p className="text-gray-400 text-xs">Admin access only</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-400 text-sm p-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Email address</label>
            <input
              type="email"
              className="w-full bg-gray-700 border border-gray-600 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="admin@stablee.app"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Password</label>
            <input
              type="password"
              className="w-full bg-gray-700 border border-gray-600 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors mt-2"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}