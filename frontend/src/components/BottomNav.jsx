import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Building2, Users, CreditCard, Bell } from 'lucide-react'

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/properties', icon: Building2, label: 'Properties' },
  { path: '/tenants', icon: Users, label: 'Tenants' },
  { path: '/payments', icon: CreditCard, label: 'Payments' },
  { path: '/reminders', icon: Bell, label: 'Reminders' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="bottom-nav safe-area-pb">
      {navItems.map(({ path, icon: Icon, label }) => {
        const active = location.pathname === path
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`nav-item ${active ? 'active' : ''}`}
          >
            <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
            <span className="text-xs font-medium">{label}</span>
          </button>
        )
      })}
    </div>
  )
}