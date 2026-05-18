import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [landlord, setLandlord] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('landlord')
    if (stored) setLandlord(JSON.parse(stored))
    setLoading(false)
  }, [])

  const login = (token, landlordData) => {
    localStorage.setItem('token', token)
    localStorage.setItem('landlord', JSON.stringify(landlordData))
    setLandlord(landlordData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('landlord')
    setLandlord(null)
  }

  return (
    <AuthContext.Provider value={{ landlord, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}