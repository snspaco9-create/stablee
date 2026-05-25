import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
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

function PrivateRoute({ children }) {
  const { landlord, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>
  return landlord ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/properties" element={<PrivateRoute><Properties /></PrivateRoute>} />
      <Route path="/properties/:property_id/units" element={<PrivateRoute><Units /></PrivateRoute>} />
      <Route path="/tenants" element={<PrivateRoute><Tenants /></PrivateRoute>} />
      <Route path="/payments" element={<PrivateRoute><Payments /></PrivateRoute>} />
      <Route path="/pricing" element={<PrivateRoute><Pricing /></PrivateRoute>} />
      <Route path="/checkout/:plan" element={<PrivateRoute><Checkout /></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
    </Routes>
  )
}