import { Navigate } from 'react-router-dom'

export default function AdminRoute({ children }) {
  // Get landlord from localStorage
  const landlordStr = localStorage.getItem('landlord')
  
  if (!landlordStr) {
    return <Navigate to="/admin/login" replace />
  }
  
  try {
    const landlord = JSON.parse(landlordStr)
    
    // Check if user is admin
    if (!landlord.is_admin) {
      return <Navigate to="/admin/login" replace />
    }
    
    // Check if token exists
    const token = localStorage.getItem('token')
    if (!token) {
      return <Navigate to="/admin/login" replace />
    }
    
    return children
  } catch (error) {
    // If there's an error parsing, redirect to login
    return <Navigate to="/admin/login" replace />
  }
}