import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import BottomNav from '../components/BottomNav'
import SkeletonCard from '../components/SkeletonCard'
import api from '../api'

export default function Reminders() {
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/reminders/logs')
      .then(res => setReminders(res.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <PageHeader title="Reminder Logs" />

      <div className="px-4 py-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <SkeletonCard key={i} lines={2} />)}
          </div>
        ) : reminders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm font-medium">No reminders sent yet</p>
            <p className="text-gray-400 text-xs mt-1">Reminders will appear here once sent</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reminders.map(r => (
              <div key={r.id} className="card p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{r.tenants?.full_name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {r.channel?.toUpperCase()} · {new Date(r.sent_at).toLocaleDateString('en-NG', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span className={
                    r.status === 'sent' ? 'badge-success' :
                    r.status === 'pending' ? 'badge-warning' : 'badge-danger'
                  }>
                    {r.status}
                  </span>
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