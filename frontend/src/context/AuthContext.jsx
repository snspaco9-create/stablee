import { createContext, useContext, useState, useEffect } from 'react'
import supabase from '../supabase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [landlord, setLandlord] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('landlord')
    if (stored) {
      try {
        setLandlord(JSON.parse(stored))
      } catch {
        localStorage.removeItem('landlord')
      }
    }
    setLoading(false)

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'TOKEN_REFRESHED' && session) {
        localStorage.setItem('token', session.access_token)
      }
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('token')
        localStorage.removeItem('landlord')
        setLandlord(null)
      }
      if (event === 'SIGNED_IN' && session) {
        localStorage.setItem('token', session.access_token)
      }
    })

    const handleStorageChange = (e) => {
      if (e.key === 'landlord' && !e.newValue) {
        setLandlord(null)
        window.location.href = '/login'
      }
    }
    window.addEventListener('storage', handleStorageChange)

    const refreshInterval = setInterval(async () => {
      const token = localStorage.getItem('token')
      if (!token) return
      const { data, error } = await supabase.auth.refreshSession()
      if (error || !data.session) {
        localStorage.removeItem('token')
        localStorage.removeItem('landlord')
        setLandlord(null)
        window.location.href = '/login'
      } else {
        localStorage.setItem('token', data.session.access_token)
      }
    }, 45 * 60 * 1000)

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(refreshInterval)
    }
  }, [])

  const login = (token, landlordData, refreshToken) => {
    localStorage.setItem('token', token)
    localStorage.setItem('landlord', JSON.stringify(landlordData))
    if (refreshToken) localStorage.setItem('refresh_token', refreshToken)
    setLandlord(landlordData)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('token')
    localStorage.removeItem('landlord')
    localStorage.removeItem('refresh_token')
    setLandlord(null)
  }

  return (
    <AuthContext.Provider value={{ landlord, login, logout, loading, setLandlord }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}