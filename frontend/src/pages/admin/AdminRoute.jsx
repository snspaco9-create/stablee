import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import api from '../../api'

export default function AdminRoute({ children }) {
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setStatus('denied')
      return
    }
    api.get('/landlords/profile')
      .then(res => {
        if (res.data.is_admin) {
          setStatus('allowed')
        } else {
          setStatus('denied')
        }
      })
      .catch(() => setStatus('denied'))
  }, [])

  if (status === 'checking') return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <p className="text-gray-400 text-sm">Verifying access...</p>
    </div>
  )

  if (status === 'denied') return <Navigate to="/admin/login" />

  return children
}