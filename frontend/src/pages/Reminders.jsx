import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function Reminders() {
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/reminders/logs')
      .then(res => setReminders(res.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <button onClick={() => navigate('/')} className="text-sm text-blue-600 hover:underline">← Dashboard</button>
        <span className="text-lg font-bold text-blue-600">Reminder Logs</span>
        <span></span>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">Loading...</div>
        ) : reminders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-500 text-sm font-medium">No reminders sent yet</p>
            <p className="text-gray-400 text-xs mt-1">Reminders will appear here once sent</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reminders.map(r => (
              <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {r.tenants?.full_name || 'Unknown tenant'}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {r.channel?.toUpperCase()} · {new Date(r.sent_at).toLocaleDateString('en-NG', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-lg font-medium ${
                    r.status === 'sent'
                      ? 'bg-green-50 text-green-600'
                      : r.status === 'pending'
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-red-50 text-red-500'
                  }`}>
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}