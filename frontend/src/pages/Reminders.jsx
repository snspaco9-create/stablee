import { useEffect, useState } from 'react'
import BottomNav from '../components/BottomNav'
import { ListSkeleton } from '../components/Skeleton'
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

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">S</span>
          </div>

          <span className="text-base font-bold text-gray-900">
            Reminder Logs
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-6">

        {loading ? (
          <ListSkeleton count={4} />
        ) : reminders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-7 h-7 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>

            <p className="text-gray-500 text-sm font-medium">
              No reminders sent yet
            </p>

            <p className="text-gray-400 text-xs mt-1">
              Reminders will appear here once sent
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reminders.map(r => (
              <div
                key={r.id}
                className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
              >
                <div className="flex justify-between items-start">

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {r.tenants?.full_name}
                    </h3>

                    <p className="text-xs text-gray-400 mt-1">
                      {r.channel?.toUpperCase()}
                    </p>

                    <p className="text-xs text-gray-400">
                      {new Date(r.sent_at).toLocaleDateString('en-NG', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  <span
                    className={
                      r.status === 'sent'
                        ? 'text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-lg'
                        : r.status === 'pending'
                        ? 'text-xs bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded-lg'
                        : 'text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-lg'
                    }
                  >
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