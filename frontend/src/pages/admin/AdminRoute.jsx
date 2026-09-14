import { Navigate, useLocation } from 'react-router-dom'

export default function AdminRoute({ children }) {
  const location = useLocation()

  const token = localStorage.getItem('token')
  const landlordStr = localStorage.getItem('landlord')

  if (!token || !landlordStr) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location }}
      />
    )
  }

  try {
    const landlord = JSON.parse(landlordStr)

    if (!landlord || landlord.is_admin !== true) {
      return (
        <Navigate
          to="/admin/login"
          replace
        />
      )
    }

    return children
  } catch (error) {
    localStorage.removeItem('landlord')

    return (
      <Navigate
        to="/admin/login"
        replace
      />
    )
  }
}