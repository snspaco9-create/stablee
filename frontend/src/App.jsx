import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Properties from './pages/Properties'
import Units from './pages/Units'
import Tenants from './pages/Tenants'
import Payments from './pages/Payments'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Pricing from './pages/Pricing'
import Checkout from './pages/Checkout'
import Settings from './pages/Settings'
import Reminders from './pages/Reminders'
import TenantPortal from './pages/TenantPortal'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Terms from './pages/Terms'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminRoute from './pages/admin/AdminRoute'

function PrivateRoute({ children }) {
  const { landlord, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>
  return landlord ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <Routes>
     
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/tenant/:token" element={<TenantPortal />} />
      
     
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      
      
      <Route path="/home" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/properties" element={<PrivateRoute><Properties /></PrivateRoute>} />
      <Route path="/properties/:property_id/units" element={<PrivateRoute><Units /></PrivateRoute>} />
      <Route path="/tenants" element={<PrivateRoute><Tenants /></PrivateRoute>} />
      <Route path="/payments" element={<PrivateRoute><Payments /></PrivateRoute>} />
      <Route path="/reminders" element={<PrivateRoute><Reminders /></PrivateRoute>} />
      <Route path="/pricing" element={<PrivateRoute><Pricing /></PrivateRoute>} />
      <Route path="/checkout/:plan" element={<PrivateRoute><Checkout /></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}