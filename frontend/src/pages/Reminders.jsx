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
          <div className="text-center py-20">
            <Bell size={48} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No reminders yet</p>
            <p className="text-gray-400 text-sm mt-1">Reminders will appear here once sent</p>
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