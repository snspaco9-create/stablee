import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Building2, Users, CreditCard, Bell } from 'lucide-react'

const navItems = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/properties', icon: Building2, label: 'Properties' },
  { path: '/tenants', icon: Users, label: 'Tenants' },
  { path: '/payments', icon: CreditCard, label: 'Payments' },
  { path: '/reminders', icon: Bell, label: 'Reminders' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-2 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full"
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.5 : 1.8}
                className={active ? 'text-blue-600' : 'text-gray-400 dark:text-gray-500'}
              />
              <span className={`text-xs font-medium ${active ? 'text-blue-600' : 'text-gray-400 dark:text-gray-500'}`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}