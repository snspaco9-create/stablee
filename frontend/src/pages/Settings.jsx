import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import supabase from '../supabase'
import toast from 'react-hot-toast'
import BottomNav from '../components/BottomNav'
import api from '../api'

const REMINDER_OPTIONS = [
  { days: 30, label: '30 days before' },
  { days: 14, label: '14 days before' },
  { days: 7, label: '7 days before' },
  { days: 3, label: '3 days before' },
  { days: 1, label: '1 day before' },
  { days: 0, label: 'On due date' },
  { days: -3, label: '3 days after (overdue)' }
]

export default function Settings() {
  const { landlord, setLandlord, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const [profileForm, setProfileForm] = useState({
    full_name: landlord?.full_name || '',
    phone: landlord?.phone || ''
  })

  const [passwordForm, setPasswordForm] = useState({
    new_password: '',
    confirm_password: ''
  })

  const [reminderDays, setReminderDays] = useState([30, 14, 7, 3, 1, 0, -3])
  const [showPassword, setShowPassword] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [reminderLoading, setReminderLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    api.get('/landlords/profile').then(res => {
      if (res.data.reminder_days) setReminderDays(res.data.reminder_days)
    }).catch(() => {})
  }, [])

  const toggleReminderDay = (day) => {
    setReminderDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setProfileLoading(true)

    try {
      await api.put('/landlords/profile', profileForm)

      const updated = { ...landlord, ...profileForm }

      localStorage.setItem('landlord', JSON.stringify(updated))
      setLandlord(updated)

      toast.success('Profile updated')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile')
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error('Passwords do not match')
      return
    }

    if (passwordForm.new_password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setPasswordLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.new_password
      })

      if (error) throw error

      toast.success('Password updated successfully')
      setPasswordForm({
        new_password: '',
        confirm_password: ''
      })
    } catch (err) {
      toast.error(err.message || 'Failed to update password')
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleReminderUpdate = async () => {
    if (reminderDays.length === 0) {
      toast.error('Select at least one reminder day')
      return
    }

    setReminderLoading(true)

    try {
      await api.put('/landlords/reminder-preferences', {
        reminder_days: reminderDays
      })

      toast.success('Reminder preferences saved')
    } catch (err) {
      toast.error(
        err.response?.data?.error || 'Failed to save preferences'
      )
    } finally {
      setReminderLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleDeleteAccount = async () => {
    setDeleteLoading(true)

    try {
      await api.delete('/auth/delete-account')

      await logout()

      toast.success('Your account has been deleted')
      navigate('/login')
    } catch (err) {
      toast.error(
        err.response?.data?.error || 'Failed to delete account'
      )
      setDeleteLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-4 py-4 flex items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">S</span>
          </div>
          <span className="text-base font-bold text-gray-900 dark:text-white">
            Settings
          </span>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-4">

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xl font-bold flex items-center justify-center">
              {landlord?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>

            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {landlord?.full_name}
              </p>

              <p className="text-xs text-gray-400 dark:text-gray-500">
                {landlord?.email}
              </p>

              <span className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                {landlord?.plan?.charAt(0).toUpperCase() + landlord?.plan?.slice(1)} Plan
              </span>
            </div>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Profile
            </h3>

            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Full name
              </label>

              <input
                className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={profileForm.full_name}
                onChange={e =>
                  setProfileForm({
                    ...profileForm,
                    full_name: e.target.value
                  })
                }
                required
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Phone
              </label>

              <input
                type="tel"
                className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={profileForm.phone}
                onChange={e =>
                  setProfileForm({
                    ...profileForm,
                    phone: e.target.value
                  })
                }
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Email
              </label>

              <input
                className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                value={landlord?.email || ''}
                disabled
              />

              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Email cannot be changed
              </p>
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {profileLoading ? 'Saving...' : 'Save profile'}
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Appearance
          </h3>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Theme
              </p>

              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {theme === 'dark' ? 'Dark mode is on' : 'Light mode is on'}
              </p>
            </div>

            <button
              onClick={toggleTheme}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                theme === 'dark' ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
          <form onSubmit={handlePasswordUpdate} className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Change password
            </h3>

            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                New password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-16"
                  value={passwordForm.new_password}
                  onChange={e =>
                    setPasswordForm({
                      ...passwordForm,
                      new_password: e.target.value
                    })
                  }
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Confirm new password
              </label>

              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={passwordForm.confirm_password}
                onChange={e =>
                  setPasswordForm({
                    ...passwordForm,
                    confirm_password: e.target.value
                  })
                }
                required
              />
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {passwordLoading ? 'Updating...' : 'Update password'}
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            Reminder preferences
          </h3>

          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
            Choose when to automatically remind tenants
          </p>

          {landlord?.plan === 'free' ? (
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-800 rounded-xl p-3 text-center">
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Automatic reminders available on Starter and Pro plans
              </p>

              <button
                onClick={() => navigate('/pricing')}
                className="text-xs text-blue-600 dark:text-blue-400 mt-1 hover:underline"
              >
                Upgrade now
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-2 mb-4">
                {REMINDER_OPTIONS.map(opt => (
                  <label
                    key={opt.days}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={reminderDays.includes(opt.days)}
                      onChange={() => toggleReminderDay(opt.days)}
                      className="w-4 h-4 rounded text-blue-600 dark:bg-gray-900 dark:border-gray-700"
                    />

                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>

              <button
                onClick={handleReminderUpdate}
                disabled={reminderLoading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {reminderLoading ? 'Saving...' : 'Save preferences'}
              </button>
            </>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Subscription
          </h3>

          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Current plan
              </p>

              <p className="text-xs text-gray-400 dark:text-gray-500">
                {landlord?.plan === 'free'
                  ? 'Free — limited features'
                  : `${landlord?.plan} — full access`}
              </p>
            </div>

            <span className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full font-medium">
              {landlord?.plan?.charAt(0).toUpperCase() + landlord?.plan?.slice(1)}
            </span>
          </div>

          <button
            onClick={() => navigate('/pricing')}
            className="w-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {landlord?.plan === 'free'
              ? 'Upgrade plan'
              : 'Manage subscription'}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-red-100 dark:border-red-900/30 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-3">
            Danger zone
          </h3>

          <div className="space-y-3">
            <button
              onClick={handleLogout}
              className="w-full border border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 py-2 rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              Log out
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={deleteLoading}
              className="w-full border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 py-2 rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-50"
            >
              Delete account
            </button>
          </div>
        </div>

        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Delete your account?
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                This action will permanently delete your account and remove
                your access to Stablee. This cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleteLoading}
                  className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                >
                  {deleteLoading ? 'Deleting...' : 'Yes, delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}